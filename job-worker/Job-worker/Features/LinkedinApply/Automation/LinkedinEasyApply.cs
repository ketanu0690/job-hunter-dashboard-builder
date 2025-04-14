using Job_worker.Models;
using Job_worker.Shared.Helper;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;


namespace Job_worker.Features.LinkedinApply.Automation
{
    public class LinkedinEasyApply
    {
        private readonly LinkedinConfig _config;
        private readonly IWebDriver _driver;
        private readonly Random _random;
        private readonly HashSet<string> _seenJobs = new();
        private readonly Dictionary<string, string> personalInfo;
        private readonly string universityGPA;
        private readonly string resumeDir;
        private readonly string coverLetterDir;
        private AntiLockHelper _antiLockHelper;
        public LinkedinEasyApply(LinkedinConfig config, IWebDriver driver)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));
            _driver = driver ?? throw new ArgumentNullException(nameof(driver));
            _random = new Random();
            _antiLockHelper = new AntiLockHelper();

            // Initialize personal info (should come from config or another source)
            personalInfo = new Dictionary<string, string>
            {
                ["First Name"] = "John",
                ["Last Name"] = "Doe",
                ["Linkedin"] = "https://linkedin.com/in/johndoe",
                ["Mobile Phone Number"] = "1234567890",
                ["Website"] = "https://example.com",
                ["Phone Country Code"] = "+1"
            };

            universityGPA = "3.5";
            resumeDir = _config.ResumePath; // Ensure this is set in config
            coverLetterDir = _config.CoverLetterPath; // Optional
        }

        public void Login()
        {
            _driver.Navigate().GoToUrl("https://www.linkedin.com/login");
            Thread.Sleep(RandomDelay());

            _driver.FindElement(By.Id("username")).SendKeys(_config.Email);
            _driver.FindElement(By.Id("password")).SendKeys(_config.Password);
            _driver.FindElement(By.CssSelector("button[type='submit']")).Click();

            Thread.Sleep(RandomDelay());
        }

        public void SecurityCheck()
        {
            string currentUrl = _driver.Url;
            string pageSource = _driver.PageSource;

            if (currentUrl.Contains("/checkpoint/challenge/") || pageSource.ToLower().Contains("security check"))
            {
                Console.WriteLine("\u26a0\ufe0f Please complete the security check in the browser, then press ENTER to continue...");
                Console.ReadLine();

                Thread.Sleep(RandomDelay());
            }
        }

        public void StartApplying()
        {
            var searches = _config.Positions
                .SelectMany(position => _config.Locations, (position, location) => new { Position = position, Location = location })
                .OrderBy(_ => _random.Next())
                .ToList();

            int pageSleepCounter = 0;
            int minimumIntervalSeconds = 60 * 15;
            DateTime nextAllowedRun = DateTime.Now.AddSeconds(minimumIntervalSeconds);

            foreach (var search in searches)
            {
                int jobPageNumber = 0; // Changed from -1 to 0 (first page is 0)
                Console.WriteLine($"🔍 Starting search for '{search.Position}' in '{search.Location}'.");

                try
                {
                    while (true)
                    {
                        pageSleepCounter++;
                        jobPageNumber++;

                        Console.WriteLine($"➔ Navigating to job page {jobPageNumber}...");
                        NextJobPage(search.Position, search.Location, jobPageNumber);
                        Thread.Sleep(_random.Next(1500, 3500));

                        Console.WriteLine("📝 Applying to jobs on current page...");
                        ApplyJobsAsync(search.Location);
                        Console.WriteLine("✅ Applications for this page completed.");

                        //  WaitUntilNextCycle(ref nextAllowedRun, minimumIntervalSeconds);

                        if (pageSleepCounter % 5 == 0)
                        {
                            int sleepSeconds = _random.Next(500, 900);
                            Console.WriteLine($"💤 Sleeping for {sleepSeconds / 60} minutes...");
                            Thread.Sleep(sleepSeconds * 1000);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ Error: {ex.Message}");
                    Console.WriteLine(ex.StackTrace);
                }

                WaitUntilNextCycle(ref nextAllowedRun, minimumIntervalSeconds);

                if (pageSleepCounter % 5 == 0)
                {
                    int sleepSeconds = _random.Next(500, 900);
                    Console.WriteLine($"💤 Sleeping for {sleepSeconds / 60} minutes...");
                    Thread.Sleep(sleepSeconds * 1000);
                }
            }
        }

        public bool ApplyToJob()
        {
            try
            {
                var easyApplyButton = _driver.FindElement(By.ClassName("jobs-apply-button"));

                try
                {
                    var jobDescription = _driver.FindElement(By.ClassName("jobs-search__job-details--container"));
                    ScrollSlow(jobDescription, end: 1600);
                    ScrollSlow(jobDescription, end: 1600, step: 400, reverse: true);
                }
                catch { }

                Console.WriteLine("📩 Applying to the job...");
                easyApplyButton.Click();

                string buttonText = string.Empty;
                const string submitText = "submit application";
                int retries = 3;

                while (!buttonText.ToLower().Contains(submitText) && retries > 0)
                {
                    try
                    {
                        FillUp();

                        var nextButton = _driver.FindElement(By.ClassName("artdeco-button--primary"));
                        buttonText = nextButton.Text.ToLower();

                        if (buttonText.Contains(submitText))
                        {
                            try { Unfollow(); } catch { Console.WriteLine("⚠️ Failed to unfollow company."); }
                        }

                        Thread.Sleep(RandomDelay());
                        nextButton.Click();
                        Thread.Sleep(RandomDelay());

                        string pageSource = _driver.PageSource.ToLower();
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
                }

                if (retries == 0)
                {
                    Console.WriteLine("🛑 Max retries reached. Closing modal...");
                    try
                    {
                        _driver.FindElement(By.ClassName("artdeco-modal__dismiss")).Click();
                        Thread.Sleep(RandomDelay());

                        var confirmButtons = _driver.FindElements(By.ClassName("artdeco-modal__confirm-dialog-btn"));
                        if (confirmButtons.Count > 1)
                        {
                            confirmButtons[1].Click();
                            Thread.Sleep(RandomDelay());
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("⚠️ Failed to close confirmation modal:");
                        Console.WriteLine(ex);
                    }

                    throw new Exception("Failed to apply to job after multiple retries.");
                }

                try { _driver.FindElement(By.ClassName("artdeco-modal__dismiss")).Click(); } catch { }
                try { _driver.FindElement(By.ClassName("artdeco-toast-item__dismiss")).Click(); } catch { }

                Thread.Sleep(RandomDelay());
                return true;
            }
            catch
            {
                return false;
            }
        }



        public async Task ApplyJobsAsync(string location)
        {
            string noJobsText = "";

            try
            {
                var noJobsElement = _driver.FindElement(By.ClassName("jobs-search-two-pane__no-results-banner--expand"));
                noJobsText = noJobsElement.Text;
            }
            catch
            {
                // Ignore error if element is not found
            }

            if (noJobsText.Contains("No matching jobs found"))
            {
                throw new Exception("No more jobs on this page");
            }

            if (_driver.PageSource.ToLower().Contains("unfortunately, things aren't"))
            {
                throw new Exception("No more jobs on this page");
            }

            try
            {
                // Use an explicit wait to ensure the element is present before interacting with it
                WebDriverWait wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
                var jobResults = wait.Until(driver => driver.FindElement(By.ClassName("jobs-search-results")));

                ScrollSlow(jobResults);
                ScrollSlow(jobResults, step: 300, reverse: true);

                var jobList = _driver.FindElements(By.ClassName("jobs-search-results__list"))[0]
                    .FindElements(By.ClassName("jobs-search-results__list-item"));

                if (jobList.Count == 0)
                {
                    throw new Exception("No more jobs on this page");
                }

                foreach (var jobTile in jobList)
                {
                    string jobTitle = "", company = "", jobLocation = "", applyMethod = "", link = "";

                    try
                    {
                        jobTitle = jobTile.FindElement(By.ClassName("job-card-list__title")).Text;
                        link = jobTile.FindElement(By.ClassName("job-card-list__title")).GetAttribute("href").Split('?')[0];
                    }
                    catch { }

                    try
                    {
                        company = jobTile.FindElement(By.ClassName("job-card-container__company-name")).Text;
                    }
                    catch { }

                    try
                    {
                        jobLocation = jobTile.FindElement(By.ClassName("job-card-container__metadata-item")).Text;
                    }
                    catch { }

                    try
                    {
                        applyMethod = jobTile.FindElement(By.ClassName("job-card-container__apply-method")).Text;
                    }
                    catch { }

                    try
                    {
                        var jobEl = jobTile.FindElement(By.ClassName("job-card-list__title"));
                        jobEl.Click();

                        await Task.Delay(new Random().Next(3000, 5000)); // Sleep randomly between 3 to 5 seconds

                        try
                        {
                            bool doneApplying = ApplyToJob();
                            if (doneApplying)
                            {
                                Console.WriteLine("Done applying to the job!");
                            }
                            else
                            {
                                Console.WriteLine("Already applied to the job!");
                            }
                        }
                        catch
                        {
                            Console.WriteLine("Failed to apply to job! Please submit a bug report with this link: " + link);
                            Console.WriteLine("Writing to the failed CSV file...");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Could not apply to the job!");
                        Console.WriteLine(ex.Message);
                    }

                    _seenJobs.Add(link);
                }
            }
            catch (NoSuchElementException ex)
            {
                Console.WriteLine("Error: Could not find jobs-search-results element. " + ex.Message);
                throw new Exception("No more jobs on this page");
            }
        }

        public void ScrollSlow(IWebElement scrollableElement, int start = 0, int end = 3600, int step = 100, bool reverse = false)
        {
            if (reverse)
            {
                (start, end) = (end, start);
                step = -step;
            }

            for (int i = start; reverse ? i > end : i < end; i += step)
            {
                ((IJavaScriptExecutor)_driver).ExecuteScript($"arguments[0].scrollTo(0, {i});", scrollableElement);
                Thread.Sleep(_random.Next(1000, 2600));
            }
        }

        private void WaitUntilNextCycle(ref DateTime nextAllowedRun, int delaySeconds)
        {
            var timeLeft = (nextAllowedRun - DateTime.Now).TotalSeconds;
            if (timeLeft > 0)
            {
                Console.WriteLine($"⏳ Waiting {Math.Round(timeLeft)} seconds before continuing...");
                Thread.Sleep(TimeSpan.FromSeconds(timeLeft));
            }

            nextAllowedRun = DateTime.Now.AddSeconds(delaySeconds);
        }

        public void NextJobPage(string position, string location, int jobPage)
        {
            string url = $"https://www.linkedin.com/jobs/search/?keywords={position}&location={location}&start={jobPage * 25}";
            _driver.Navigate().GoToUrl(url);
            AvoidLock();
        }

        private int RandomDelay() => _random.Next(5000, 10000);

        private void FillUp()
        {
            try
            {
                var easyApplyContent = _driver.FindElement(By.ClassName("jobs-easy-apply-content"));
                var pb4Sections = easyApplyContent.FindElements(By.ClassName("pb4"));

                foreach (var section in pb4Sections)
                {
                    try
                    {
                        string label = section.FindElement(By.TagName("h3")).Text.ToLowerInvariant();

                        try { AdditionalQuestions(); } catch { /* Ignore */ }
                        try { SendResume(easyApplyContent); } catch { /* Ignore */ }

                        if (label.Contains("home address"))
                        {
                            HomeAddress(section);
                        }
                        else if (label.Contains("contact info"))
                        {
                            ContactInfo(section);
                        }
                    }
                    catch { /* Silently ignore malformed sections */ }
                }
            }
            catch (NoSuchElementException) { }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ FillUp error: {ex.Message}");
            }
        }

        private void Unfollow()
        {
            try
            {
                var followLabel = _driver.FindElement(By.XPath("//label[contains(text(),'to stay up to date with their page.')]"));
                followLabel.Click();
            }
            catch (NoSuchElementException) { }
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
                try { HandleRadioOptions(group); } catch { }
                try { HandleTextInputs(group); } catch { }
                try { HandleDatePicker(group); } catch { }
                try { HandleDropdowns(group); } catch { }
                try { HandleCheckbox(group); } catch { }
            }
        }

        private void HandleRadioOptions(IWebElement group)
        {
            var element = group.FindElement(By.ClassName("jobs-easy-apply-form-element"));
            var radios = element.FindElements(By.ClassName("fb-radio"));
            var questionText = group.Text.ToLower();
            string answer = GetRadioAnswer(questionText, radios.Select(r => r.Text.ToLower()).ToList());

            foreach (var radio in radios)
            {
                if (radio.Text.ToLower().Contains(answer))
                {
                    radio.Click();
                    break;
                }
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
            {
                return options.FirstOrDefault(o => o.Contains("prefer") || o.Contains("decline") || o.Contains("don't") || o.Contains("none")) ?? options.Last();
            }

            return options.Last(); // default fallback
        }

        private string GetAnswer(string questionType)
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
            IWebElement input = element.FindElement(By.TagName("input"));

            string value = label switch
            {
                string l when l.Contains("first name") => personalInfo["First Name"],
                string l when l.Contains("last name") => personalInfo["Last Name"],
                string l when l.Contains("linkedin") => personalInfo["Linkedin"],
                string l when l.Contains("phone") => personalInfo["Mobile Phone Number"],
                string l when l.Contains("github") || l.Contains("portfolio") || l.Contains("website") => personalInfo["Website"],
                string l when l.Contains("grade point") => universityGPA,
                _ => "N/A"
            };

            input.Clear();
            input.SendKeys(value);
        }

        private void HandleDatePicker(IWebElement group)
        {
            var dateInput = group.FindElement(By.ClassName("artdeco-datepicker__input"));
            dateInput.Clear();
            dateInput.SendKeys(DateTime.Now.ToString("MM/dd/yy"));
            dateInput.SendKeys(Keys.Return);
        }

        private void HandleDropdowns(IWebElement group)
        {
            var element = group.FindElement(By.ClassName("jobs-easy-apply-form-element"));
            var label = element.FindElement(By.ClassName("fb-form-element-label")).Text.ToLower();

        }

        private void HandleCheckbox(IWebElement group)
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
                        inputField.SendKeys(personalInfo["Street address"]);
                    else if (labelText.Contains("city"))
                    {
                        inputField.SendKeys(personalInfo["City"]);
                        Thread.Sleep(3000);
                        inputField.SendKeys(Keys.Down);
                        inputField.SendKeys(Keys.Enter);
                    }
                    else if (labelText.Contains("zip") || labelText.Contains("postal"))
                        inputField.SendKeys(personalInfo["Zip"]);
                    else if (labelText.Contains("state") || labelText.Contains("province"))
                        inputField.SendKeys(personalInfo["State"]);
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
                            $"Country code {personalInfo["Phone Country Code"]} not found! Ensure it is exact.");
                    }

                    try
                    {
                        var phoneField = group.FindElement(By.ClassName("fb-single-line-text__input"));
                        phoneField.Clear();
                        phoneField.SendKeys(personalInfo["Mobile Phone Number"]);
                    }
                    catch
                    {
                        Console.WriteLine("Could not input phone number.");
                    }
                }
            }
        }

        private void SendResume(IWebElement section)
        {
            try
            {
                var fileInputs = section.FindElements(By.CssSelector("input[name='file']"));
                foreach (var fileInput in fileInputs)
                {
                    var uploadLabel = fileInput.FindElement(By.XPath("..")).FindElement(By.XPath("preceding-sibling::*")).Text.ToLower();

                    if (uploadLabel.Contains("resume"))
                    {
                        fileInput.SendKeys(resumeDir);
                    }
                    else if (uploadLabel.Contains("cover"))
                    {
                        if (!string.IsNullOrEmpty(coverLetterDir))
                        {
                            fileInput.SendKeys(coverLetterDir);
                        }
                        else if (uploadLabel.Contains("required"))
                        {
                            fileInput.SendKeys(resumeDir); // fallback to resume
                        }
                    }
                }
            }
            catch
            {
                Console.WriteLine("Failed to upload resume or cover letter!");
            }
        }

    }

}
