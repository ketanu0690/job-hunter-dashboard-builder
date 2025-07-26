import { Router } from "express";
import puppeteer from "puppeteer";

const router = Router();

const headlineVariants = [
  "Skilled in full-stack development using .NET and React.",
  "Exploring cloud architecture with AWS, Azure, and GCP.",
  "Delivering optimized, scalable solutions consistently.",
  "Hands-on experience in TypeScript, C#, and MongoDB.",
  "Focused on clean code, modular design, and performance.",
  "Proficient with vertical slice architecture and FastEndpoints.",
  "Automation and CI/CD enthusiast using GitHub Actions.",
];

const summaryVariants = [
  "I'm a passionate developer with 2+ years of experience building scalable systems using .NET, React, and TypeScript.",
  "I specialize in full-stack development with a focus on performance, modularity, and clean architecture.",
  "Experienced in cloud-native design and automation-first workflows using Docker and GitHub Actions.",
  "I build robust applications using modern web stacks and follow best practices for frontend/backend integration.",
  "My goal is to architect solutions that are resilient, performant, and developer-friendly.",
];

const getBrowser = async (headless = false) => {
  return puppeteer.launch({
    headless,
    args: ["--start-maximized"],
    defaultViewport: null,
  });
};

async function waitForXPath(page, xpath, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const [el] = await page.$x(xpath);
    if (el) return el;
    await page.waitForTimeout(200); // small delay before retrying
  }
  throw new Error(`XPath "${xpath}" not found within ${timeout}ms`);
}

const updateNaukriProfile = async (email, password, headless = false) => {
  let browser;
  try {
    console.log("Launching browser...");
    browser = await getBrowser(false);
    const page = await browser.newPage();
    console.log("Navigating to Naukri.com...");
    await page.goto("https://www.naukri.com/", {
      waitUntil: "domcontentloaded",
    });

    // Login
    console.log("Clicking login button...");
    await page.waitForSelector("#login_Layer");
    await page.click("#login_Layer");
    console.log("Filling in email...");
    await page.waitForSelector(
      'input[placeholder="Enter your active Email ID / Username"]'
    );
    await page.type(
      'input[placeholder="Enter your active Email ID / Username"]',
      email,
      { delay: 50 }
    );
    console.log("Filling in password...");
    await page.type('input[placeholder="Enter your password"]', password, {
      delay: 50,
    });

    console.log("Clicking login submit...");

    await page.waitForSelector("button[type='submit']", { timeout: 5000 });
    console.log("✅ Submit button is visible. Clicking...");

    // Click the submit button
    await page.click("button[type='submit']");

    // Wait for profile view link
    console.log("Waiting for profile link after login...");
    await page.waitForXPath("//a[normalize-space()='View profile']", {
      timeout: 15000,
    });
    const [profileLink] = await page.$x(
      "//a[normalize-space()='View profile']"
    );
    await profileLink?.click();
    console.log("Clicked profile link.");

    // === Update Resume Headline ===
    console.log("Waiting for headline edit button...");
    await page.waitForXPath(
      "//div[@class='widgetHead']//span[@class='edit icon'][normalize-space()='editOneTheme']"
    );
    const [editHeadlineBtn] = await page.$x(
      "//div[@class='widgetHead']//span[@class='edit icon'][normalize-space()='editOneTheme']"
    );
    await editHeadlineBtn.click();
    console.log("Editing headline...");
    await page.waitForSelector("#resumeHeadlineTxt");
    await page.$eval("#resumeHeadlineTxt", (el) => (el.value = ""));
    const newHeadline =
      headlineVariants[Math.floor(Math.random() * headlineVariants.length)];
    console.log("New headline:", newHeadline);
    await page.type("#resumeHeadlineTxt", newHeadline);
    await page.click("button:has-text('Save')");
    await page.waitForTimeout(1500);
    console.log("Headline updated and saved.");

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    console.log("Scrolled to bottom of page.");

    // Scroll up to summary
    const [summaryTitle] = await page.$x(
      "//span[@class='widgetTitle typ-16Bold'][normalize-space()='Profile summary']"
    );
    if (summaryTitle) {
      await page.evaluate((el) => el.scrollIntoView(), summaryTitle);
      await page.waitForTimeout(500);
      console.log("Scrolled to profile summary section.");
    }

    const [editSummaryBtn] = await page.$x(
      "//div[@class='profileSummary']//div//span[@class='edit icon'][normalize-space()='editOneTheme']"
    );
    if (editSummaryBtn) {
      await page.evaluate((el) => el.scrollIntoView(), editSummaryBtn);
      await editSummaryBtn.click();
      console.log("Editing profile summary...");
      await page.waitForSelector("#profileSummaryTxt");
      await page.$eval("#profileSummaryTxt", (el) => (el.value = ""));
      const newSummary =
        summaryVariants[Math.floor(Math.random() * summaryVariants.length)];
      console.log("New summary:", newSummary);
      await page.type("#profileSummaryTxt", newSummary);
      await page.click("button:has-text('Save')");
      await page.waitForTimeout(1000);
      console.log("Profile summary updated and saved.");
    } else {
      console.log(
        "Profile summary edit button not found. Skipping summary update."
      );
    }

    console.log("Profile update automation completed successfully.");
    return {
      success: true,
      message: "Profile updated successfully!",
      headline: newHeadline,
    };
  } catch (err) {
    console.error("Automation failed:", err);
    return { success: false, message: "Automation failed: " + err.message };
  } finally {
    if (browser) await browser.close();
    console.log("Closed browser.");
  }
};

router.post("/update-profile", async (req, res) => {
  const { email, password } = req.body;
  const headless = req.query.headless !== "false";

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    const result = await updateNaukriProfile(email, password, headless);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
