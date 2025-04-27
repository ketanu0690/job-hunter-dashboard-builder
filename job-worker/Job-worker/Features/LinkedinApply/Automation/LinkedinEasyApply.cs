using Job_worker.Models;
using Job_worker.Shared.Helper;
using Microsoft.AspNetCore.WebUtilities;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace Job_worker.Features.LinkedinApply.Automation;

public class LinkedinEasyApply(LinkedinConfig config, IWebDriver driver)
{
    private const string UniversityGpa = "3.5";

    private readonly AntiLockHelper _antiLockHelper = new();
    private readonly LinkedinConfig _config = config ?? throw new ArgumentNullException(nameof(config));
    private readonly IWebDriver _driver = driver ?? throw new ArgumentNullException(nameof(driver));

    private readonly Dictionary<string, string> _personalInfo = new()
    {
        ["First Name"] = "John",
        ["Last Name"] = "Doe",
        ["Linkedin"] = "https://linkedin.com/in/johndoe",
        ["Mobile Phone Number"] = "1234567890",
        ["Website"] = "https://example.com",
        ["Phone Country Code"] = "+1"
    };

    public readonly HashSet<string?> SeenJobs = [];

    public void Login()
    {
        _driver.Navigate().GoToUrl("https://www.linkedin.com/login");
        Thread.Sleep(SeleniumHelper.RandomDelay());

        _driver.FindElement(By.Id("username")).SendKeys(_config.Email);
        _driver.FindElement(By.Id("password")).SendKeys(_config.Password);
        _driver.FindElement(By.CssSelector("button[type='submit']")).Click();

        Thread.Sleep(SeleniumHelper.RandomDelay());
    }

    public async Task SecurityCheck()
    {
        var currentUrl = _driver.Url;
        var pageSource = _driver.PageSource;

        if (!currentUrl.Contains("/checkpoint/challenge/") &&
            !pageSource.ToLower().Contains("security check")) return;
        Console.WriteLine(
            "\u26a0\ufe0f Please complete the security check in the browser, then press ENTER to continue...");
        Console.ReadLine();

        await SeleniumHelper.DelayRandomAsync();
    }

    public async Task StartApplyingAsync()
    {
        var searches = _config.Positions
            .SelectMany(_ => _config.Locations,
                (position, location) => new { Position = position, Location = location })
            .ToList();

        var pageSleepCounter = 0;

        foreach (var search in searches)
        {
            var jobPageNumber = 0; // Changed from -1 to 0 (first page is 0)
            Console.WriteLine($"🔍 Starting search for '{search.Position}' in '{search.Location}'.");

            try
            {
                pageSleepCounter++;
                jobPageNumber++;

                Console.WriteLine($"➔ Navigating to job page {jobPageNumber}...");
                GoToJobPage(search.Position, search.Location, jobPageNumber);

                Console.WriteLine("📝 Applying to jobs on current page...");
                await ApplyJobsAsync(search.Location); // 👈 await it properly now!
                Console.WriteLine("✅ Applications for this page completed.");

                if (pageSleepCounter % 5 != 0) continue;
                Console.WriteLine("\ud83d\udca4 Sleeping for ...");
                await SeleniumHelper.DelayRandomAsync(); // 👈 Also await your delay!
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
    }

    public async Task<bool> ApplyJobsAsync(
        string location,
        CancellationToken cancellationToken = default)
    {
        EnsureJobsExist();

        var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
        var resultsSection = wait.Until(d =>
            d.FindElement(By.CssSelector("div[data-results-list-top-scroll-sentinel]"))
        );

        //await ScrollSlowAsync(resultsSection, ct: cancellationToken);
        //await ScrollSlowAsync(resultsSection, step: 300, reverse: true, ct: cancellationToken);

        var jobTiles = _driver
            .FindElements(By.CssSelector("li.scaffold-layout__list-item"))
            .ToList();

        if (!jobTiles.Any())
            throw new Exception("No jobs listed on this page.");

        var anyApplied = false;

        foreach (var tile in jobTiles)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var link = "";
            try
            {
                var linkElement = tile.FindElements(By.CssSelector("a.job-card-container__link")).FirstOrDefault();
                if (linkElement == null) continue;

                link = linkElement.GetAttribute("href");
                if (string.IsNullOrEmpty(link) || SeenJobs.Contains(link))
                    continue;

                // Now click the correct Easy Apply
                var easyApplyBtn = _driver.FindElement(By.XPath(
                    "(//div[contains(@class, 'jobs-apply-button--top-card')]//button[contains(@aria-label, 'Easy Apply')])[1]"));

                if (easyApplyBtn == null)
                {
                    Console.WriteLine($"❌ No Easy Apply button for: {link}");
                    continue;
                }

                easyApplyBtn.Click();
                await SeleniumHelper.DelayRandomAsync(3000, 5000);

                // 🚀 Important: Now we await ApplyToJobAsync
                if (await ApplyToJobAsync())
                {
                    Console.WriteLine($"✅ Applied: {link}");
                    anyApplied = true;
                }
                else
                {
                    Console.WriteLine($"⚠️ Already applied or skipped: {link}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Failed to apply: {ex.Message}\nLink: {link}");
                throw;
            }
            finally
            {
                SeenJobs.Add(link);
            }
        }

        return anyApplied;
    }

    public async Task<bool> ApplyToJobAsync()
    {
        try
        {
            Console.WriteLine("📩 Applying to the job...");
            await FillFormAndContinueAsync();

            var buttonText = string.Empty;
            const string submitText = "submit application";
            var retries = 3;

            while (!buttonText.ToLower().Contains(submitText) && retries > 0)
                try
                {
                    // await FillUpAsync();
                    var nextButton = _driver.FindElement(By.ClassName("artdeco-button--primary"));
                    buttonText = nextButton.Text.ToLower();

                    if (buttonText.Contains(submitText))
                        try
                        {
                            Unfollow();
                        }
                        catch
                        {
                            Console.WriteLine("⚠️ Failed to unfollow company.");
                        }

                    await SeleniumHelper.DelayRandomAsync();
                    nextButton.Click();
                    await SeleniumHelper.DelayRandomAsync();

                    var pageSource = _driver.PageSource.ToLower();
                    if (pageSource.Contains("please enter a valid answer") || pageSource.Contains("file is required"))
                    {
                        retries--;
                        Console.WriteLine($"🔁 Retrying application, attempts left: {retries}");
                    }
                    else
                    {
                        break;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("❌ Failed to apply to job:");
                    Console.WriteLine(ex);
                    retries--;
                }

            if (retries == 0)
            {
                Console.WriteLine("🛑 Max retries reached. Closing modal...");
                try
                {
                    _driver.FindElement(By.ClassName("artdeco-modal__dismiss")).Click();
                    await SeleniumHelper.DelayRandomAsync();

                    var confirmButtons = _driver.FindElements(By.ClassName("artdeco-modal__confirm-dialog-btn"));
                    if (confirmButtons.Count > 1)
                    {
                        confirmButtons[1].Click();
                        await SeleniumHelper.DelayRandomAsync();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("⚠️ Failed to close confirmation modal:");
                    Console.WriteLine(ex);
                }

                throw new Exception("Failed to apply to job after multiple retries.");
            }

            try
            {
                _driver.FindElement(By.ClassName("artdeco-modal__dismiss")).Click();
            }
            catch
            {
                /* ignore */
            }

            try
            {
                _driver.FindElement(By.ClassName("artdeco-toast-item__dismiss")).Click();
            }
            catch
            {
                /* ignore */
            }

            await SeleniumHelper.DelayRandomAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> FillFormAndContinueAsync(CancellationToken ct = default)
    {
        var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));

        // 1) Wait for the form to be present
        var form = wait.Until(d => d.FindElement(By.XPath("//html/body/div[4]/div/div/div[2]/div/div[2]/form")));
        if (form == null)
            throw new InvalidOperationException("Form not found.");

        // 2) Define the data mapping for each field based on labels (from the config or hardcoded)


        // 3) Handle the input fields
        var inputs = form.FindElements(By.CssSelector("input[required]"));
        foreach (var input in inputs)
        {
            var label = input.FindElement(By.XPath("./preceding-sibling::label")).Text.Trim();

            if (!_config.PersonalInfo.TryGetValue(label, out var value)) continue;
            var inputValue = input.GetAttribute("value")?.Trim();
            if (!string.IsNullOrEmpty(inputValue)) continue;
            input.Clear();
            input.SendKeys(value);
            await SeleniumHelper.DelayRandomAsync();
        }

        // 4) Handle select elements
        var selects = form.FindElements(By.CssSelector("select[required]"));
        foreach (var select in selects)
        {
            var label = select.FindElement(By.XPath("./preceding-sibling::label")).Text.Trim();

            if (!_config.PersonalInfo.ContainsKey(label)) continue;
            var selectedValue = select.GetAttribute("value")?.Trim();
            if (!string.IsNullOrEmpty(selectedValue) && !selectedValue.ToLower().Contains("select")) continue;
            var options = select.FindElements(By.TagName("option"))
                .Where(opt => !string.IsNullOrWhiteSpace(opt.GetAttribute("value")))
                .ToList();

            if (options.Count <= 0) continue;
            options.First().Click(); // Select first valid option
            await SeleniumHelper.DelayRandomAsync();
        }

        // 5) After filling the required fields, look for the "Next" button
        var nextButton = form.FindElement(By.CssSelector("button[data-easy-apply-next-button]"));
        if (nextButton == null || !nextButton.Enabled)
            throw new InvalidOperationException("Next button is disabled or not found.");

        // 6) Click the Next button to proceed
        nextButton.Click();
        await SeleniumHelper.DelayRandomAsync();

        return true;
    }

    private void EnsureJobsExist()
    {
        // 1) “No matching jobs” banner
        if (SeleniumHelper.ElementExists(_driver,
                By.XPath("//p[contains(@class,'text-align-center') and contains(.,'No matching jobs found')]")))
            throw new InvalidOperationException("No matching jobs found.");

        // 2) “results” count
        if (SeleniumHelper.ElementExists(_driver,
                By.XPath("//header[contains(@class,'scaffold-layout__list-header')]//small")))
        {
            var text = _driver.FindElement(By.XPath("//header[contains(@class,'scaffold-layout__list-header')]//small"))
                .Text;
            Console.WriteLine($"Found job count: {text}");
        }

        // 3) fallback “unfortunately” message
        if (_driver.PageSource.Contains("unfortunately, things aren't", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("LinkedIn reports no more jobs.");
    }

    public async Task ScrollSlowAsync(
        IWebElement scrollableElement,
        int start = 0,
        int end = 3600,
        int step = 100,
        bool reverse = false,
        CancellationToken ct = default)
    {
        var js = (IJavaScriptExecutor)_driver;

        // If reverse, swap start/end and invert step
        if (reverse)
        {
            (start, end) = (end, start);
            step = -Math.Abs(step);
        }

        // Scroll in increments
        for (var offset = start; reverse ? offset > end : offset < end; offset += step)
        {
            ct.ThrowIfCancellationRequested();

            // scrollTo(y) on the element
            js.ExecuteScript(
                "arguments[0].scrollTo(0, arguments[1]);",
                scrollableElement,
                offset);
            break;

            // properly await the random delay
            await SeleniumHelper.DelayRandomAsync();
        }
    }


    public void GoToJobPage(
        string position,
        string location,
        int jobPage,
        bool easyApply = true)
    {
        if (jobPage < 0)
            throw new ArgumentOutOfRangeException(nameof(jobPage), "Page index must be zero or positive.");

        const int JobsPerPage = 25;

        var queryParams = new Dictionary<string, string>
        {
            ["keywords"] = position,
            ["location"] = location,
            ["start"] = (jobPage * JobsPerPage).ToString(),
            ["origin"] = "JOB_SEARCH_PAGE_JOB_FILTER",
            ["f_AL"] = easyApply.ToString().ToLowerInvariant()
        };

        // Builds: https://www.linkedin.com/jobs/search/?keywords=…&location=…&start=…&origin=…&f_AL=true
        var url = QueryHelpers.AddQueryString(
            "https://www.linkedin.com/jobs/search/",
            queryParams!);

        _driver.Navigate().GoToUrl(url);
    }


    private void FillUp()
    {
        try
        {
            var easyApplyContent = _driver.FindElement(By.ClassName("jobs-easy-apply-content"));
            var pb4Sections = easyApplyContent.FindElements(By.ClassName("pb4"));

            foreach (var section in pb4Sections)
                try
                {
                    var label = section.FindElement(By.TagName("h3")).Text.ToLowerInvariant();

                    try
                    {
                        AdditionalQuestions();
                    }
                    catch
                    {
                        /* Ignore */
                    }

                    try
                    {
                        SendResume(easyApplyContent);
                    }
                    catch
                    {
                        /* Ignore */
                    }

                    if (label.Contains("home address"))
                        HomeAddress(section);
                    else if (label.Contains("contact info")) ContactInfo(section);
                }
                catch
                {
                    /* Silently ignore malformed sections */
                }
        }
        catch (NoSuchElementException)
        {
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ FillUp error: {ex.Message}");
        }
    }

    private void Unfollow()
    {
        try
        {
            var followLabel =
                _driver.FindElement(By.XPath("//label[contains(text(),'to stay up to date with their page.')]"));
            followLabel.Click();
        }
        catch (NoSuchElementException)
        {
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ Unfollow error: {ex.Message}");
        }
    }

    private void AvoidLock()
    {
        var timer = new Timer(e => _antiLockHelper.AvoidLock(), null, 0, 180000);
    }

    public void AdditionalQuestions()
    {
        var questionGroups = _driver.FindElements(By.ClassName("jobs-easy-apply-form-section__grouping"));
        foreach (var group in questionGroups)
        {
            try
            {
                HandleRadioOptions(group);
            }
            catch
            {
            }

            try
            {
                HandleTextInputs(group);
            }
            catch
            {
            }

            try
            {
                HandleDatePicker(group);
            }
            catch
            {
            }

            try
            {
                HandleDropdowns(group);
            }
            catch
            {
            }

            try
            {
                HandleCheckbox(group);
            }
            catch
            {
            }
        }
    }

    private void HandleRadioOptions(IWebElement group)
    {
        var element = group.FindElement(By.ClassName("jobs-easy-apply-form-element"));
        var radios = element.FindElements(By.ClassName("fb-radio"));
        var questionText = group.Text.ToLower();
        var answer = GetRadioAnswer(questionText, radios.Select(r => r.Text.ToLower()).ToList());

        foreach (var radio in radios)
            if (radio.Text.ToLower().Contains(answer))
            {
                radio.Click();
                break;
            }
    }

    private string GetRadioAnswer(string questionText, List<string> options)
    {
        if (questionText.Contains("driver's licence") || questionText.Contains("driver's license"))
            return GetAnswer("driversLicence");
        if (questionText.Contains("north korea"))
            return "no";
        if (questionText.Contains("sponsor"))
            return GetAnswer("requireVisa");
        if (questionText.Contains("authorized") || questionText.Contains("authorised"))
            return GetAnswer("legallyAuthorized");
        if (questionText.Contains("urgent"))
            return GetAnswer("urgentFill");
        if (questionText.Contains("commuting"))
            return GetAnswer("commute");
        if (questionText.Contains("background check"))
            return GetAnswer("backgroundCheck");
        if (questionText.Contains("gender") || questionText.Contains("race") || questionText.Contains("latino"))
            return options.FirstOrDefault(o =>
                       o.Contains("prefer") || o.Contains("decline") || o.Contains("don't") || o.Contains("none")) ??
                   options.Last();

        return options.Last(); // default fallback
    }

    private static string GetAnswer(string questionType)
    {
        // This should be implemented based on your configuration
        // For now returning default answers
        return questionType switch
        {
            "driversLicence" => "yes",
            "requireVisa" => "no",
            "legallyAuthorized" => "yes",
            "urgentFill" => "no",
            "commute" => "yes",
            "backgroundCheck" => "yes",
            _ => "yes"
        };
    }

    private void HandleTextInputs(IWebElement group)
    {
        var element = group.FindElement(By.ClassName("jobs-easy-apply-form-element"));
        var label = element.FindElement(By.ClassName("fb-form-element-label")).Text.ToLower();
        var input = element.FindElement(By.TagName("input"));

        var value = label switch
        {
            string l when l.Contains("first name") => _personalInfo["First Name"],
            string l when l.Contains("last name") => _personalInfo["Last Name"],
            string l when l.Contains("linkedin") => _personalInfo["Linkedin"],
            string l when l.Contains("phone") => _personalInfo["Mobile Phone Number"],
            string l when l.Contains("github") || l.Contains("portfolio") || l.Contains("website") => _personalInfo[
                "Website"],
            string l when l.Contains("grade point") => UniversityGpa,
            _ => "N/A"
        };

        input.Clear();
        input.SendKeys(value);
    }

    private static void HandleDatePicker(IWebElement group)
    {
        var dateInput = group.FindElement(By.ClassName("artdeco-datepicker__input"));
        dateInput.Clear();
        dateInput.SendKeys(DateTime.Now.ToString("MM/dd/yy"));
        dateInput.SendKeys(Keys.Return);
    }

    private static void HandleDropdowns(IWebElement group)
    {
        var element = group.FindElement(By.ClassName("jobs-easy-apply-form-element"));
        var label = element.FindElement(By.ClassName("fb-form-element-label")).Text.ToLower();
    }

    private static void HandleCheckbox(IWebElement group)
    {
        var checkbox = group.FindElement(By.TagName("label"));
        checkbox.Click();
    }

    public void HomeAddress(IWebElement sectionElement)
    {
        try
        {
            var groups = sectionElement.FindElements(By.ClassName("jobs-easy-apply-form-section__grouping"));
            foreach (var group in groups)
            {
                var labelText = group.FindElement(By.TagName("label")).Text.ToLower();
                var inputField = group.FindElement(By.TagName("input"));

                if (labelText.Contains("street"))
                {
                    inputField.SendKeys(_personalInfo["Street address"]);
                }
                else if (labelText.Contains("city"))
                {
                    inputField.SendKeys(_personalInfo["City"]);
                    Thread.Sleep(3000);
                    inputField.SendKeys(Keys.Down);
                    inputField.SendKeys(Keys.Enter);
                }
                else if (labelText.Contains("zip") || labelText.Contains("postal"))
                {
                    inputField.SendKeys(_personalInfo["Zip"]);
                }
                else if (labelText.Contains("state") || labelText.Contains("province"))
                {
                    inputField.SendKeys(_personalInfo["State"]);
                }
            }
        }
        catch
        {
            // Ignore address fill failures silently
        }
    }


    private void ContactInfo(IWebElement section)
    {
        var formGroups = section.FindElements(By.ClassName("jobs-easy-apply-form-section__grouping"));

        foreach (var group in formGroups)
        {
            var text = group.Text.ToLower();

            if (text.Contains("email address"))
                continue;

            if (text.Contains("phone number"))
            {
                try
                {
                    var countryCodeDropdown = group.FindElement(By.ClassName("fb-dropdown__select"));
                    //  SelectDropdown(countryCodeDropdown, personalInfo["Phone Country Code"]);
                }
                catch
                {
                    Console.WriteLine(
                        $"Country code {_personalInfo["Phone Country Code"]} not found! Ensure it is exact.");
                }

                try
                {
                    var phoneField = group.FindElement(By.ClassName("fb-single-line-text__input"));
                    phoneField.Clear();
                    phoneField.SendKeys(_personalInfo["Mobile Phone Number"]);
                }
                catch
                {
                    Console.WriteLine("Could not input phone number.");
                }
            }
        }
    }

    private static void SendResume(IWebElement section)
    {
        try
        {
            var fileInputs = section.FindElements(By.CssSelector("input[name='file']"));
            foreach (var fileInput in fileInputs)
            {
                //var uploadLabel = fileInput.FindElement(By.XPath("..")).FindElement(By.XPath("preceding-sibling::*")).Text.ToLower();

                //if (uploadLabel.Contains("resume"))
                //{
                //    fileInput.SendKeys(resumeDir);
                //}
                //else if (uploadLabel.Contains("cover"))
                //{
                //    if (!string.IsNullOrEmpty(coverLetterDir))
                //    {
                //        fileInput.SendKeys(coverLetterDir);
                //    }
                //    else if (uploadLabel.Contains("required"))
                //    {
                //        fileInput.SendKeys(resumeDir); // fallback to resume
                //    }
                //}
            }
        }
        catch
        {
            Console.WriteLine("Failed to upload resume or cover letter!");
        }
    }
}