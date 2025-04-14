using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace Job_worker.Shared.Helper
{
    public static class SeleniumHelper
    {
        public static IWebDriver InitBrowser(bool headless = true)
        {
            var chromeOptions = new ChromeOptions();

            // Common arguments
            chromeOptions.AddArguments(
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--disable-gpu",
                "--disable-blink-features=AutomationControlled"
            );

            // Headless support
            if (headless)
            {
                chromeOptions.AddArguments("--headless=new");
            }

            // Maximize window
            chromeOptions.AddArguments("--start-maximized");

            // Return initialized driver
            return new ChromeDriver(chromeOptions);
        }
    }
}
