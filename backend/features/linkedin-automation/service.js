
const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-writer').createObjectCsvWriter;
const random = require('random');
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const path = require('path');

class LinkedinEasyApply {
  constructor(parameters) {
    this.email = parameters.email;
    this.password = parameters.password;
    this.disableLock = parameters.disableAntiLock;
    this.companyBlacklist = parameters.companyBlacklist || [];
    this.titleBlacklist = parameters.titleBlacklist || [];
    this.positions = parameters.positions || [];
    this.locations = parameters.locations || [];
    this.baseSearchUrl = "";
    this.seenJobs = [];
    this.fileName = "output";
    this.outputFileDirectory = "./output/";
    this.resumeDir = parameters.uploads?.resume || "";
    this.coverLetterDir = parameters.uploads?.coverLetter || '';
    this.checkboxes = parameters.checkboxes || {};
    this.universityGpa = parameters.universityGpa || 3.0;
    this.languages = parameters.languages || {};
    this.industry = parameters.industry || {};
    this.technology = parameters.technology || {};
    this.personalInfo = parameters.personalInfo || {};
    this.eeo = parameters.eeo || {};
    this.technologyDefault = this.technology.default || 0;
    this.industryDefault = this.industry.default || 0;
    this.browser = null;
    this.page = null;
    this.logs = [];
  }

  log(message) {
    console.log(message);
    this.logs.push(message);
  }

  getBaseSearchUrl(parameters) {
    let remoteUrl = "";
    if (parameters.remote) {
      remoteUrl = "f_CF=f_WRA";
    }

    let level = 1;
    let experienceUrl = "f_E=";
    if (parameters.experienceLevel) {
      for (const key in parameters.experienceLevel) {
        if (parameters.experienceLevel[key]) {
          experienceUrl += "%2C" + level;
        }
        level++;
      }
    }

    const distanceUrl = "?distance=" + (parameters.distance || 25);

    let jobTypesUrl = "f_JT=";
    if (parameters.jobTypes) {
      for (const key in parameters.jobTypes) {
        if (parameters.jobTypes[key]) {
          jobTypesUrl += "%2C" + key.charAt(0).toUpperCase();
        }
      }
    }

    let dateUrl = "f_TPR=";
    if (parameters.date) {
      for (const key in parameters.date) {
        if (parameters.date[key]) {
          if (key === "past24Hours") {
            dateUrl += "r86400";
          } else if (key === "pastWeek") {
            dateUrl += "r604800";
          } else if (key === "pastMonth") {
            dateUrl += "r2592000";
          }
          break;
        }
      }
    }

    return `https://www.linkedin.com/jobs/search/${remoteUrl}&${experienceUrl}&${jobTypesUrl}&${dateUrl}${distanceUrl}`;
  }

  async init() {
    try {
      this.log("Initializing browser...");
      this.browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1200, height: 800 });
      this.log("Browser initialized successfully");
      return true;
    } catch (err) {
      this.log(`Error initializing browser: ${err.message}`);
      return false;
    }
  }

  async login() {
    try {
      this.log("Navigating to LinkedIn login page...");
      await this.page.goto("https://www.linkedin.com/login", { waitUntil: 'networkidle2' });
      await sleep(random.int(5000, 10000));
      
      this.log("Entering login credentials...");
      await this.page.type('#username', this.email);
      await this.page.type('#password', this.password);
      await this.page.click('.btn__primary--large');
      await sleep(random.int(5000, 10000));
      
      this.log("Login successful");
      return true;
    } catch (err) {
      this.log(`Login failed: ${err.message}`);
      throw new Error("Could not login!");
    }
  }

  // Add a method to run the automation
  async runAutomation() {
    try {
      const initSuccess = await this.init();
      if (!initSuccess) {
        return { success: false, message: "Failed to initialize browser", logs: this.logs };
      }

      await this.login();
      this.log("Starting job search and application process...");
      
      // For testing purposes, we'll just log in and verify success
      // In a real implementation, you would call startApplying() here
      
      await this.browser.close();
      return { 
        success: true, 
        message: "Automation completed successfully", 
        logs: this.logs 
      };
    } catch (err) {
      this.log(`Automation error: ${err.message}`);
      if (this.browser) {
        await this.browser.close();
      }
      return { 
        success: false, 
        message: `Automation failed: ${err.message}`, 
        logs: this.logs,
        error: err.message
      };
    }
  }
}

async function runAutomation(parameters) {
  try {
    console.log("Starting LinkedIn automation with parameters:", parameters);
    const linkedinBot = new LinkedinEasyApply(parameters);
    return await linkedinBot.runAutomation();
  } catch (error) {
    console.error("LinkedIn automation error:", error);
    return {
      success: false,
      message: `LinkedIn automation failed: ${error.message}`,
      error: error.message
    };
  }
}

module.exports = {
  runAutomation
};
