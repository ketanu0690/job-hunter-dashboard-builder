using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace Job_worker.Shared.Helper;

public static class SeleniumHelper
{
    // Single static Random instance
    private static readonly Random _random = new();

    /// <summary>
    ///     Initializes a ChromeDriver with recommended options.
    /// </summary>
    public static IWebDriver InitBrowser(bool headless = true)
    {
        var options = new ChromeOptions();
        options.AddArguments(
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--disable-gpu",
            "--disable-blink-features=AutomationControlled",
            "--start-maximized"
        );

        if (headless)
            // Use the new headless mode flag
            options.AddArgument("--headless=new");

        return new ChromeDriver(options);
    }

    /// <summary>
    ///     Checks if any elements matching the locator exist.
    /// </summary>
    public static bool ElementExists(IWebDriver driver, By locator)
    {
        // FindElements never throws—just returns empty if none found
        return driver.FindElements(locator).Any();
    }

    /// <summary>
    ///     Returns a random delay in milliseconds between min (inclusive) and max (exclusive).
    /// </summary>
    public static int RandomDelay(int minMs = 5000, int maxMs = 10000)
    {
        return _random.Next(minMs, maxMs);
    }

    /// <summary>
    ///     Asynchronously waits for a random delay.
    /// </summary>
    public static async Task DelayRandomAsync(int minMs = 5000, int maxMs = 10000)
    {
        await Task.Delay(_random.Next(minMs, maxMs));
    }
}