const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-writer').createObjectCsvWriter;
const random = require('random');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

class LinkedinEasyApply {
    constructor(parameters) {
        this.email = parameters.email;
        this.password = parameters.password;
        this.disableLock = parameters.disableAntiLock;
        this.companyBlacklist = parameters.companyBlacklist || [];
        this.titleBlacklist = parameters.titleBlacklist || [];
        this.positions = parameters.positions || [];
        this.locations = parameters.locations || [];
        this.baseSearchUrl = this.getBaseSearchUrl(parameters);
        this.seenJobs = [];
        this.fileName = "output";
        this.outputFileDirectory = parameters.outputFileDirectory;
        this.resumeDir = parameters.uploads.resume;
        this.coverLetterDir = parameters.uploads.coverLetter || '';
        this.checkboxes = parameters.checkboxes || {};
        this.universityGpa = parameters.universityGpa;
        this.languages = parameters.languages || {};
        this.industry = parameters.industry || {};
        this.technology = parameters.technology || {};
        this.personalInfo = parameters.personalInfo || {};
        this.eeo = parameters.eeo || {};
        this.technologyDefault = this.technology.default || 0;
        this.industryDefault = this.industry.default || 0;
        this.browser = null;
        this.page = null;
    }

    async init() {
        this.browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1200, height: 800 });
    }

    async login() {
        try {
            await this.page.goto("https://www.linkedin.com/login", { waitUntil: 'networkidle2' });
            await sleep(random.int(5000, 10000));
            
            await this.page.type('#username', this.email);
            await this.page.type('#password', this.password);
            await this.page.click('.btn__primary--large');
            await sleep(random.int(5000, 10000));
        } catch (error) {
            throw new Error("Could not login!");
        }
    }

    async securityCheck() {
        const currentUrl = this.page.url();
        const pageSource = await this.page.content();

        if (currentUrl.includes('/checkpoint/challenge/') || pageSource.includes('security check')) {
            console.log("Please complete the security check manually...");
            await sleep(30000); // Wait 30 seconds for manual intervention
        }
    }

    async startApplying() {
        const searches = this.cartesianProduct(this.positions, this.locations);
        this.shuffleArray(searches);

        let pageSleep = 0;
        const minimumTime = 60 * 15 * 1000; // 15 minutes in ms
        let minimumPageTime = Date.now() + minimumTime;

        for (const [position, location] of searches) {
            const locationUrl = "&location=" + encodeURIComponent(location);
            let jobPageNumber = -1;

            console.log(`Starting the search for ${position} in ${location}.`);

            try {
                while (true) {
                    pageSleep++;
                    jobPageNumber++;
                    console.log(`Going to job page ${jobPageNumber}`);
                    await this.nextJobPage(position, locationUrl, jobPageNumber);
                    await sleep(random.int(1500, 3500));
                    console.log("Starting the application process for this page...");
                    await this.applyJobs(location);
                    console.log("Applying to jobs on this page has been completed!");

                    const timeLeft = minimumPageTime - Date.now();
                    if (timeLeft > 0) {
                        console.log(`Sleeping for ${timeLeft / 1000} seconds.`);
                        await sleep(timeLeft);
                        minimumPageTime = Date.now() + minimumTime;
                    }
                    if (pageSleep % 5 === 0) {
                        const sleepTime = random.int(500000, 900000);
                        console.log(`Sleeping for ${sleepTime / 60000} minutes.`);
                        await sleep(sleepTime);
                        pageSleep++;
                    }
                }
            } catch (error) {
                console.error(error);
            }

            const timeLeft = minimumPageTime - Date.now();
            if (timeLeft > 0) {
                console.log(`Sleeping for ${timeLeft / 1000} seconds.`);
                await sleep(timeLeft);
                minimumPageTime = Date.now() + minimumTime;
            }
            if (pageSleep % 5 === 0) {
                const sleepTime = random.int(500000, 900000);
                console.log(`Sleeping for ${sleepTime / 60000} minutes.`);
                await sleep(sleepTime);
                pageSleep++;
            }
        }
    }

    async applyJobs(location) {
        let noJobsText = "";
        try {
            const noJobsElement = await this.page.$('.jobs-search-two-pane__no-results-banner--expand');
            if (noJobsElement) {
                noJobsText = await this.page.evaluate(el => el.textContent, noJobsElement);
            }
        } catch (error) {
            // Ignore
        }

        if (noJobsText.includes('No matching jobs found')) {
            throw new Error("No more jobs on this page");
        }

        const pageContent = await this.page.content();
        if (pageContent.toLowerCase().includes('unfortunately, things aren')) {
            throw new Error("No more jobs on this page");
        }

        let jobList = [];
        try {
            const jobResults = await this.page.$(".jobs-search-results");
            await this.scrollSlow(jobResults);
            await this.scrollSlow(jobResults, { step: 300, reverse: true });

            jobList = await this.page.$$('.jobs-search-results__list-item');
        } catch (error) {
            throw new Error("No more jobs on this page");
        }

        if (jobList.length === 0) {
            throw new Error("No more jobs on this page");
        }

        for (const jobTile of jobList) {
            let jobTitle = "", company = "", jobLocation = "", applyMethod = "", link = "";

            try {
                const titleElement = await jobTile.$('.job-card-list__title');
                if (titleElement) {
                    jobTitle = await this.page.evaluate(el => el.textContent.trim(), titleElement);
                    link = await this.page.evaluate(el => el.href.split('?')[0], titleElement);
                }
            } catch (error) {
                // Ignore
            }

            try {
                const companyElement = await jobTile.$('.job-card-container__company-name');
                if (companyElement) {
                    company = await this.page.evaluate(el => el.textContent.trim(), companyElement);
                }
            } catch (error) {
                // Ignore
            }

            try {
                const locationElement = await jobTile.$('.job-card-container__metadata-item');
                if (locationElement) {
                    jobLocation = await this.page.evaluate(el => el.textContent.trim(), locationElement);
                }
            } catch (error) {
                // Ignore
            }

            try {
                const applyMethodElement = await jobTile.$('.job-card-container__apply-method');
                if (applyMethodElement) {
                    applyMethod = await this.page.evaluate(el => el.textContent.trim(), applyMethodElement);
                }
            } catch (error) {
                // Ignore
            }

            const containsBlacklistedKeywords = this.titleBlacklist.some(word => 
                jobTitle.toLowerCase().split(' ').includes(word.toLowerCase())
            );

            const companyNotBlacklisted = !this.companyBlacklist.some(word => 
                company.toLowerCase().includes(word.toLowerCase())
            );

            if (companyNotBlacklisted && !containsBlacklistedKeywords && !this.seenJobs.includes(link)) {
                try {
                    const jobEl = await jobTile.$('.job-card-list__title');
                    await jobEl.click();
                    await sleep(random.int(3000, 5000));

                    try {
                        const doneApplying = await this.applyToJob();
                        if (doneApplying) {
                            console.log("Done applying to the job!");
                        } else {
                            console.log('Already applied to the job!');
                        }
                    } catch (error) {
                        const temp = this.fileName;
                        this.fileName = "failed";
                        console.log(`Failed to apply to job! Please submit a bug report with this link: ${link}`);
                        console.log("Writing to the failed csv file...");
                        try {
                            await this.writeToFile(company, jobTitle, link, jobLocation, location);
                        } catch (error) {
                            // Ignore
                        }
                        this.fileName = temp;
                    }

                    try {
                        await this.writeToFile(company, jobTitle, link, jobLocation, location);
                    } catch (error) {
                        console.log("Could not write the job to the file! No special characters in the job title/company is allowed!");
                        console.error(error);
                    }
                } catch (error) {
                    console.error(error);
                    console.log("Could not apply to the job!");
                }
            } else {
                console.log("Job contains blacklisted keyword or company name!");
            }
            this.seenJobs.push(link);
        }
    }

    async applyToJob() {
        let easyApplyButton = null;
        try {
            easyApplyButton = await this.page.$('.jobs-apply-button');
        } catch (error) {
            return false;
        }

        if (!easyApplyButton) {
            return false;
        }

        try {
            const jobDescriptionArea = await this.page.$(".jobs-search__job-details--container");
            await this.scrollSlow(jobDescriptionArea, { end: 1600 });
            await this.scrollSlow(jobDescriptionArea, { end: 1600, step: 400, reverse: true });
        } catch (error) {
            // Ignore
        }

        console.log("Applying to the job....");
        await easyApplyButton.click();
        await sleep(random.int(2000, 4000));

        let buttonText = "";
        const submitApplicationText = 'submit application';
        
        while (!buttonText.toLowerCase().includes(submitApplicationText)) {
            let retries = 3;
            while (retries > 0) {
                try {
                    await this.fillUp();
                    const nextButton = await this.page.$(".artdeco-button--primary");
                    buttonText = await this.page.evaluate(el => el.textContent.toLowerCase(), nextButton);
                    
                    if (buttonText.includes(submitApplicationText)) {
                        try {
                            await this.unfollow();
                        } catch (error) {
                            console.log("Failed to unfollow company!");
                        }
                    }
                    
                    await sleep(random.int(1500, 2500));
                    await nextButton.click();
                    await sleep(random.int(3000, 5000));

                    const pageContent = await this.page.content();
                    if (pageContent.toLowerCase().includes('please enter a valid answer') || 
                        pageContent.toLowerCase().includes('file is required')) {
                        retries--;
                        console.log(`Retrying application, attempts left: ${retries}`);
                    } else {
                        break;
                    }
                } catch (error) {
                    console.error(error);
                    throw new Error("Failed to apply to job!");
                }
            }
            
            if (retries === 0) {
                console.error(error);
                const dismissButton = await this.page.$('.artdeco-modal__dismiss');
                if (dismissButton) {
                    await dismissButton.click();
                    await sleep(random.int(3000, 5000));
                }
                
                const confirmButtons = await this.page.$$('.artdeco-modal__confirm-dialog-btn');
                if (confirmButtons.length > 1) {
                    await confirmButtons[1].click();
                    await sleep(random.int(3000, 5000));
                }
                
                throw new Error("Failed to apply to job!");
            }
        }

        let closedNotification = false;
        await sleep(random.int(3000, 5000));
        
        try {
            const dismissButton = await this.page.$('.artdeco-modal__dismiss');
            if (dismissButton) {
                await dismissButton.click();
                closedNotification = true;
            }
        } catch (error) {
            // Ignore
        }
        
        try {
            const toastDismiss = await this.page.$('.artdeco-toast-item__dismiss');
            if (toastDismiss) {
                await toastDismiss.click();
                closedNotification = true;
            }
        } catch (error) {
            // Ignore
        }
        
        await sleep(random.int(3000, 5000));

        if (!closedNotification) {
            throw new Error("Could not close the applied confirmation window!");
        }

        return true;
    }

    async homeAddress(element) {
        try {
            const groups = await element.$$('.jobs-easy-apply-form-section__grouping');
            if (groups.length > 0) {
                for (const group of groups) {
                    const label = await group.$('label');
                    const lb = await this.page.evaluate(el => el.textContent.toLowerCase(), label);
                    
                    const inputField = await group.$('input');
                    
                    if (lb.includes('street')) {
                        await this.enterText(inputField, this.personalInfo['Street address']);
                    } else if (lb.includes('city')) {
                        await this.enterText(inputField, this.personalInfo['City']);
                        await sleep(3000);
                        await inputField.press('ArrowDown');
                        await inputField.press('Enter');
                    } else if (lb.includes('zip') || lb.includes('postal')) {
                        await this.enterText(inputField, this.personalInfo['Zip']);
                    } else if (lb.includes('state') || lb.includes('province')) {
                        await this.enterText(inputField, this.personalInfo['State']);
                    }
                }
            }
        } catch (error) {
            // Ignore
        }
    }

    getAnswer(question) {
        return this.checkboxes[question] ? 'yes' : 'no';
    }

    async additionalQuestions() {
        const frmEls = await this.page.$$('.jobs-easy-apply-form-section__grouping');
        
        if (frmEls.length > 0) {
            for (const el of frmEls) {
                // Radio check
                try {
                    const radioContainer = await el.$('.jobs-easy-apply-form-element');
                    if (radioContainer) {
                        const radios = await radioContainer.$$('.fb-radio');
                        
                        if (radios.length > 0) {
                            const radioText = await this.page.evaluate(e => e.textContent.toLowerCase(), el);
                            const radioOptions = await Promise.all(radios.map(r => 
                                this.page.evaluate(e => e.textContent.toLowerCase(), r)
                            ));
                            
                            let answer = "yes";
                            
                            if (radioText.includes("driver's licence") || radioText.includes("driver's license")) {
                                answer = this.getAnswer('driversLicence');
                            } else if (radioText.includes('gender') || radioText.includes('veteran') || 
                                      radioText.includes('race') || radioText.includes('disability') || 
                                      radioText.includes('latino')) {
                                answer = "";
                                for (const option of radioOptions) {
                                    if (option.includes('prefer') || option.includes('decline') || 
                                        option.includes("don't") || option.includes('specified') || 
                                        option.includes('none')) {
                                        answer = option;
                                    }
                                }
                                
                                if (answer === "") {
                                    answer = radioOptions[radioOptions.length - 1];
                                }
                            } else if (radioText.includes('north korea')) {
                                answer = 'no';
                            } else if (radioText.includes('sponsor')) {
                                answer = this.getAnswer('requireVisa');
                            } else if (radioText.includes('authorized') || radioText.includes('authorised') || 
                                      radioText.includes('legally')) {
                                answer = this.getAnswer('legallyAuthorized');
                            } else if (radioText.includes('urgent')) {
                                answer = this.getAnswer('urgentFill');
                            } else if (radioText.includes('commuting')) {
                                answer = this.getAnswer('commute');
                            } else if (radioText.includes('background check')) {
                                answer = this.getAnswer('backgroundCheck');
                            } else if (radioText.includes('level of education')) {
                                for (const degree in this.checkboxes['degreeCompleted']) {
                                    if (radioText.includes(degree.toLowerCase())) {
                                        answer = "yes";
                                        break;
                                    }
                                }
                            } else if (radioText.includes('data retention')) {
                                answer = 'no';
                            } else {
                                answer = radioOptions[radioOptions.length - 1];
                            }
                            
                            let toSelect = null;
                            for (let i = 0; i < radios.length; i++) {
                                const radioText = await this.page.evaluate(el => el.textContent.toLowerCase(), radios[i]);
                                if (answer.includes(radioText)) {
                                    toSelect = radios[i];
                                    break;
                                }
                            }
                            
                            if (!toSelect) {
                                toSelect = radios[radios.length - 1];
                            }
                            
                            await this.radioSelect(toSelect, answer, radios.length > 2);
                            continue;
                        }
                    }
                } catch (error) {
                    // Ignore
                }
                
                // Questions check
                try {
                    const question = await el.$('.jobs-easy-apply-form-element');
                    if (question) {
                        const questionTextElement = await question.$('.fb-form-element-label');
                        const questionText = await this.page.evaluate(el => el.textContent.toLowerCase(), questionTextElement);
                        
                        let txtField = null;
                        try {
                            txtField = await question.$('.fb-single-line-text__input');
                        } catch (error) {
                            try {
                                txtField = await question.$('.fb-textarea');
                            } catch (error) {
                                txtField = await question.$('.multi-line-text__input');
                            }
                        }
                        
                        if (txtField) {
                            const textFieldType = await this.page.evaluate(el => el.getAttribute('name').toLowerCase(), txtField);
                            
                            let toEnter = '';
                            if (questionText.includes('experience do you currently have')) {
                                let noOfYears = this.industryDefault;
                                
                                for (const industry in this.industry) {
                                    if (questionText.includes(industry.toLowerCase())) {
                                        noOfYears = this.industry[industry];
                                        break;
                                    }
                                }
                                
                                toEnter = noOfYears.toString();
                            } else if (questionText.includes('many years of work experience do you have using')) {
                                let noOfYears = this.technologyDefault;
                                
                                for (const tech in this.technology) {
                                    if (questionText.includes(tech.toLowerCase())) {
                                        noOfYears = this.technology[tech];
                                        break;
                                    }
                                }
                                
                                toEnter = noOfYears.toString();
                            } else if (questionText.includes('grade point average')) {
                                toEnter = this.universityGpa.toString();
                            } else if (questionText.includes('first name')) {
                                toEnter = this.personalInfo['First Name'];
                            } else if (questionText.includes('last name')) {
                                toEnter = this.personalInfo['Last Name'];
                            } else if (questionText.includes('name') && !questionText.includes('last') && !questionText.includes('first')) {
                                toEnter = `${this.personalInfo['First Name']} ${this.personalInfo['Last Name']}`;
                            } else if (questionText.includes('phone')) {
                                toEnter = this.personalInfo['Mobile Phone Number'];
                            } else if (questionText.includes('linkedin')) {
                                toEnter = this.personalInfo['Linkedin'];
                            } else if (questionText.includes('website') || questionText.includes('github') || questionText.includes('portfolio')) {
                                toEnter = this.personalInfo['Website'];
                            } else {
                                if (textFieldType.includes('numeric')) {
                                    toEnter = '0';
                                } else {
                                    toEnter = " ‏‏‎ "; // Zero-width space
                                }
                            }
                            
                            await this.enterText(txtField, toEnter);
                            continue;
                        }
                    }
                } catch (error) {
                    // Ignore
                }
                
                // Date Check
                try {
                    const datePicker = await el.$('.artdeco-datepicker__input');
                    if (datePicker) {
                        await datePicker.evaluate(el => el.value = '');
                        const today = new Date();
                        const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear().toString().slice(-2)}`;
                        await datePicker.type(dateStr);
                        await sleep(3000);
                        await datePicker.press('Enter');
                        await sleep(2000);
                        continue;
                    }
                } catch (error) {
                    // Ignore
                }
                
                // Dropdown check
                try {
                    const question = await el.$('.jobs-easy-apply-form-element');
                    if (question) {
                        const questionTextElement = await question.$('.fb-form-element-label');
                        const questionText = await this.page.evaluate(el => el.textContent.toLowerCase(), questionTextElement);
                        
                        const dropdownField = await question.$('.fb-dropdown__select');
                        if (dropdownField) {
                            const options = await dropdownField.$$('option');
                            const optionTexts = await Promise.all(options.map(o => 
                                this.page.evaluate(el => el.textContent, o)
                            );
                            
                            let choice = "";
                            
                            if (questionText.includes('proficiency')) {
                                let proficiency = "Conversational";
                                
                                for (const lang in this.languages) {
                                    if (questionText.includes(lang.toLowerCase())) {
                                        proficiency = this.languages[lang];
                                        break;
                                    }
                                }
                                
                                choice = proficiency;
                            } else if (questionText.includes('country code')) {
                                choice = this.personalInfo['Phone Country Code'];
                            } else if (questionText.includes('north korea')) {
                                for (const option of optionTexts) {
                                    if (option.toLowerCase().includes('no')) {
                                        choice = option;
                                        break;
                                    }
                                }
                                
                                if (!choice) {
                                    choice = optionTexts[optionTexts.length - 1];
                                }
                            } else if (questionText.includes('sponsor')) {
                                const answer = this.getAnswer('requireVisa');
                                
                                if (answer === 'yes') {
                                    choice = optionTexts[0]; // First option
                                } else {
                                    for (const option of optionTexts) {
                                        if (option.toLowerCase().includes('no')) {
                                            choice = option;
                                            break;
                                        }
                                    }
                                }
                                
                                if (!choice) {
                                    choice = optionTexts[optionTexts.length - 1];
                                }
                            } else if (questionText.includes('authorized') || questionText.includes('authorised')) {
                                const answer = this.getAnswer('legallyAuthorized');
                                
                                if (answer === 'yes') {
                                    choice = optionTexts[0]; // First option
                                } else {
                                    for (const option of optionTexts) {
                                        if (option.toLowerCase().includes('no')) {
                                            choice = option;
                                            break;
                                        }
                                    }
                                }
                                
                                if (!choice) {
                                    choice = optionTexts[optionTexts.length - 1];
                                }
                            } else if (questionText.includes('citizenship')) {
                                const answer = this.getAnswer('legallyAuthorized');
                                
                                if (answer === 'yes') {
                                    for (const option of optionTexts) {
                                        if (option.toLowerCase().includes('no')) {
                                            choice = option;
                                            break;
                                        }
                                    }
                                }
                                
                                if (!choice) {
                                    choice = optionTexts[optionTexts.length - 1];
                                }
                            } else if (questionText.includes('gender') || questionText.includes('veteran') || 
                                      questionText.includes('race') || questionText.includes('disability') || 
                                      questionText.includes('latino')) {
                                for (const option of optionTexts) {
                                    if (option.toLowerCase().includes('prefer') || option.toLowerCase().includes('decline') || 
                                        option.toLowerCase().includes("don't") || option.toLowerCase().includes('specified') || 
                                        option.toLowerCase().includes('none')) {
                                        choice = option;
                                        break;
                                    }
                                }
                                
                                if (!choice) {
                                    choice = optionTexts[optionTexts.length - 1];
                                }
                            } else {
                                for (const option of optionTexts) {
                                    if (option.toLowerCase().includes('yes')) {
                                        choice = option;
                                        break;
                                    }
                                }
                                
                                if (!choice) {
                                    choice = optionTexts[optionTexts.length - 1];
                                }
                            }
                            
                            await dropdownField.select(choice);
                            continue;
                        }
                    }
                } catch (error) {
                    // Ignore
                }
                
                // Checkbox check for agreeing to terms and service
                try {
                    const question = await el.$('.jobs-easy-apply-form-element');
                    if (question) {
                        const clickableCheckbox = await question.$('label');
                        if (clickableCheckbox) {
                            await clickableCheckbox.click();
                        }
                    }
                } catch (error) {
                    // Ignore
                }
            }
        }
    }

    async unfollow() {
        try {
            const followCheckbox = await this.page.$x("//label[contains(.,'to stay up to date with their page.')]");
            if (followCheckbox.length > 0) {
                await followCheckbox[0].click();
            }
        } catch (error) {
            // Ignore
        }
    }

    async sendResume() {
        try {
            const fileUploadElements = await this.page.$$("input[name='file']");
            
            for (const uploadButton of fileUploadElements) {
                const uploadTypeElement = await uploadButton.evaluateHandle(el => 
                    el.closest('*').previousElementSibling
                );
                
                const uploadType = await this.page.evaluate(el => el.textContent.toLowerCase(), uploadTypeElement);
                
                if (uploadType.includes('resume')) {
                    await uploadButton.uploadFile(this.resumeDir);
                } else if (uploadType.includes('cover')) {
                    if (this.coverLetterDir) {
                        await uploadButton.uploadFile(this.coverLetterDir);
                    } else if (uploadType.includes('required')) {
                        await uploadButton.uploadFile(this.resumeDir);
                    }
                }
            }
        } catch (error) {
            console.log("Failed to upload resume or cover letter!");
        }
    }

    async enterText(element, text) {
        await element.evaluate(el => el.value = '');
        await element.type(text);
    }

    async radioSelect(element, labelText, clickLast = false) {
        const label = await element.$('label');
        const labelContent = await this.page.evaluate(el => el.textContent.toLowerCase(), label);
        
        if (labelContent.includes(labelText) || clickLast) {
            await label.click();
        }
    }

    async contactInfo() {
        const frmEls = await this.page.$$('.jobs-easy-apply-form-section__grouping');
        
        if (frmEls.length > 0) {
            for (const el of frmEls) {
                const text = await this.page.evaluate(el => el.textContent.toLowerCase(), el);
                
                if (text.includes('email address')) {
                    continue;
                } else if (text.includes('phone number')) {
                    try {
                        const countryCodePicker = await el.$('.fb-dropdown__select');
                        if (countryCodePicker) {
                            await countryCodePicker.select(this.personalInfo['Phone Country Code']);
                        }
                    } catch (error) {
                        console.log(`Country code ${this.personalInfo['Phone Country Code']} not found! Make sure it is exact.`);
                    }
                    
                    try {
                        const phoneNumberField = await el.$('.fb-single-line-text__input');
                        if (phoneNumberField) {
                            await this.enterText(phoneNumberField, this.personalInfo['Mobile Phone Number']);
                        }
                    } catch (error) {
                        console.log("Could not input phone number.");
                    }
                }
            }
        }
    }

    async fillUp() {
        try {
            const easyApplyContent = await this.page.$('.jobs-easy-apply-content');
            if (easyApplyContent) {
                const pb4s = await easyApplyContent.$$('.pb4');
                
                if (pb4s.length > 0) {
                    for (const pb of pb4s) {
                        try {
                            const labelElement = await pb.$('h3');
                            if (labelElement) {
                                const label = await this.page.evaluate(el => el.textContent.toLowerCase(), labelElement);
                                
                                try {
                                    await this.additionalQuestions();
                                } catch (error) {
                                    // Ignore
                                }
                                
                                try {
                                    await this.sendResume();
                                } catch (error) {
                                    // Ignore
                                }
                                
                                if (label.includes('home address')) {
                                    await this.homeAddress(pb);
                                } else if (label.includes('contact info')) {
                                    await this.contactInfo();
                                }
                            }
                        } catch (error) {
                            // Ignore
                        }
                    }
                }
            }
        } catch (error) {
            // Ignore
        }
    }

    async writeToFile(company, jobTitle, link, location, searchLocation) {
        const toWrite = [
            { id: 'company', title: 'Company', value: company },
            { id: 'jobTitle', title: 'Job Title', value: jobTitle },
            { id: 'link', title: 'Link', value: link },
            { id: 'location', title: 'Location', value: location }
        ];
        
        const filePath = `${this.outputFileDirectory}${this.fileName}${searchLocation.replace(/[^a-z0-9]/gi, '_')}.csv`;
        
        const csvWriter = csv({
            path: filePath,
            header: [
                { id: 'company', title: 'Company' },
                { id: 'jobTitle', title: 'Job Title' },
                { id: 'link', title: 'Link' },
                { id: 'location', title: 'Location' }
            ],
            append: fs.existsSync(filePath)
        });
        
        await csvWriter.writeRecords([{
            company,
            jobTitle,
            link,
            location
        }]);
    }

    async scrollSlow(scrollableElement, options = {}) {
        const { start = 0, end = 3600, step = 100, reverse = false } = options;
        
        let current = start;
        const increment = reverse ? -step : step;
        const condition = reverse ? () => current >= end : () => current <= end;
        
        while (condition()) {
            await scrollableElement.evaluate((el, pos) => {
                el.scrollTo(0, pos);
            }, current);
            
            await sleep(random.int(1000, 2600));
            current += increment;
        }
    }

    async avoidLock() {
        if (this.disableLock) return;
        
        // This is tricky in Puppeteer since we can't easily simulate OS-level key presses
        // You might need to implement this differently based on your OS
        console.log("Implement avoidLock based on your OS");
    }

    getBaseSearchUrl(parameters) {
        let remoteUrl = "";
        if (parameters.remote) {
            remoteUrl = "f_CF=f_WRA";
        }

        let level = 1;
        let experienceUrl = "f_E=";
        for (const key in parameters.experienceLevel) {
            if (parameters.experienceLevel[key]) {
                experienceUrl += "%2C" + level;
            }
            level++;
        }

        const distanceUrl = "?distance=" + parameters.distance;

        let jobTypesUrl = "f_JT=";
        for (const key in parameters.jobTypes) {
            if (parameters.jobTypes[key]) {
                jobTypesUrl += "%2C" + key[0].toUpperCase();
            }
        }

        let dateUrl = "";
        const dates = {
            "all time": "", 
            "month": "&f_TPR=r2592000", 
            "week": "&f_TPR=r604800", 
            "24 hours": "&f_TPR=r86400"
        };
        
        for (const key in parameters.date) {
            if (parameters.date[key]) {
                dateUrl = dates[key];
                break;
            }
        }

        const easyApplyUrl = "&f_LF=f_AL";

        const extraSearchTerms = [distanceUrl, remoteUrl, jobTypesUrl, experienceUrl];
        const extraSearchTermsStr = extraSearchTerms.filter(term => term.length > 0).join('&') + easyApplyUrl + dateUrl;

        return extraSearchTermsStr;
    }

    async nextJobPage(position, location, jobPage) {
        const url = `https://www.linkedin.com/jobs/search/${this.baseSearchUrl}&keywords=${encodeURIComponent(position)}${location}&start=${jobPage * 25}`;
        await this.page.goto(url, { waitUntil: 'networkidle2' });
        await this.avoidLock();
    }

    // Helper functions
    cartesianProduct(a, b) {
        const result = [];
        for (const x of a) {
            for (const y of b) {
                result.push([x, y]);
            }
        }
        return result;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Example usage:
/*
const parameters = {
    email: 'your-email@example.com',
    password: 'your-password',
    disableAntiLock: false,
    companyBlacklist: ['blacklist-company'],
    titleBlacklist: ['blacklist-title'],
    positions: ['Software Engineer'],
    locations: ['New York'],
    remote: false,
    distance: 25,
    experienceLevel: {
        internship: false,
        entryLevel: true,
        associate: true,
        midSeniorLevel: true,
        director: false,
        executive: false
    },
    jobTypes: {
        fullTime: true,
        contract: false,
        partTime: false,
        temporary: false,
        volunteer: false,
        internship: false
    },
    date: {
        allTime: false,
        month: true,
        week: false,
        "24 hours": false
    },
    outputFileDirectory: './',
    uploads: {
        resume: './resume.pdf',
        coverLetter: './cover-letter.pdf'
    },
    checkboxes: {
        driversLicence: true,
        requireVisa: false,
        legallyAuthorized: true,
        urgentFill: false,
        commute: true,
        backgroundCheck: true
    },
    degreeCompleted: ['Bachelor'],
    universityGpa: '3.5',
    languages: {
        english: 'Native',
        spanish: 'Conversational'
    },
    industry: {
        default: 5,
        'software engineering': 3,
        'web development': 4
    },
    technology: {
        default: 3,
        javascript: 4,
        python: 3,
        java: 2
    },
    personalInfo: {
        'First Name': 'John',
        'Last Name': 'Doe',
        'Street address': '123 Main St',
        'City': 'New York',
        'Zip': '10001',
        'State': 'NY',
        'Mobile Phone Number': '555-123-4567',
        'Phone Country Code': 'United States',
        'Linkedin': 'https://linkedin.com/in/johndoe',
        'Website': 'https://johndoe.com'
    },
    eeo: {
        gender: 'Male',
        race: 'White',
        veteran: 'No'
    }
};

(async () => {
    const bot = new LinkedinEasyApply(parameters);
    try {
        await bot.init();
        await bot.login();
        await bot.securityCheck();
        await bot.startApplying();
    } catch (error) {
        console.error(error);
    } finally {
        await bot.close();
    }
})();
*/