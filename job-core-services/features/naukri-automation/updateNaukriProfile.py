import time
import random
import schedule
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_driver():
    chrome_options = Options()
    print("Setting up Chrome driver...")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    return driver

headline_variants = [
    "Skilled in full-stack development using .NET and React.",
    "Exploring cloud architecture with AWS, Azure, and GCP.",
    "Delivering optimized, scalable solutions consistently.",
    "Hands-on experience in TypeScript, C#, and MongoDB.",
    "Focused on clean code, modular design, and performance.",
    "Proficient with vertical slice architecture and FastEndpoints.",
    "Automation and CI/CD enthusiast using GitHub Actions."
]

summary_variants = [
    "I'm a passionate developer with 2+ years of experience building scalable systems using .NET, React, and TypeScript.",
    "I specialize in full-stack development with a focus on performance, modularity, and clean architecture.",
    "Experienced in cloud-native design and automation-first workflows using Docker and GitHub Actions.",
    "I build robust applications using modern web stacks and follow best practices for frontend/backend integration.",
    "My goal is to architect solutions that are resilient, performant, and developer-friendly."
]

def generate_dynamic_text(variants):
    return random.choice(variants)

def update_naukri_profile():
    print("Launching browser...")
    driver = get_driver()
    wait = WebDriverWait(driver, 15)

    try:
        print("Navigating to Naukri...")
        driver.get('https://www.naukri.com/')
        driver.maximize_window()

        print("Clicking login...")
        wait.until(EC.element_to_be_clickable((By.ID, "login_Layer"))).click()

        print("Waiting for email field...")
        wait.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Enter your active Email ID / Username']"))).send_keys('ketanupadhyay40@gmail.com')

        print("Waiting for password field...")
        wait.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Enter your password']"))).send_keys('ketan0690')

        print("Clicking login button...")
        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Login']"))).click()

        print("Opening profile page...")
        wait.until(EC.element_to_be_clickable((By.XPATH, "//a[normalize-space()='View profile']"))).click()

        # === Resume Headline Update ===
        print("Editing resume headline...")
        wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@class='widgetHead']//span[@class='edit icon'][normalize-space()='editOneTheme']"))).click()

        new_headline = generate_dynamic_text(headline_variants)
        print("New headline:", new_headline)

        headline_box = wait.until(EC.presence_of_element_located((By.ID, "resumeHeadlineTxt")))
        headline_box.clear()
        headline_box.send_keys(new_headline)

        print("Saving resume headline...")
        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Save']"))).click()
        time.sleep(2)

        # === Scroll to the Bottom of the Page ===
        print("Scrolling to the bottom of the page...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)  # Wait for any lazy-loaded content to load

        # === Scroll Back Up to Profile Summary ===
        print("Scrolling back up to the profile summary...")
        profile_summary_xpath = "//span[@class='widgetTitle typ-16Bold'][normalize-space()='Profile summary']"
        profile_summary_element = wait.until(EC.presence_of_element_located((By.XPATH, profile_summary_xpath)))
        driver.execute_script("arguments[0].scrollIntoView();", profile_summary_element)

        # Now you can click the edit icon for the profile summary
        summary_edit_xpath = "//div[@class='profileSummary']//div[@class='card']//div//span[@class='edit icon'][normalize-space()='editOneTheme']"
        summary_edit_elements = wait.until(EC.visibility_of_all_elements_located((By.XPATH, summary_edit_xpath)))

        if summary_edit_elements:
            print("Editing profile summary...")
            
            # Scroll to the edit icon
            driver.execute_script("arguments[0].scrollIntoView();", summary_edit_elements[0])
            
            # Wait for the element to be clickable
            wait.until(EC.element_to_be_clickable((By.XPATH, summary_edit_xpath)))
            
            # Use JavaScript to click the element
            driver.execute_script("arguments[0].click();", summary_edit_elements[0])
            
            print("Clicked on the icon")
            time.sleep(2)
            
            summary_textarea_xpath = "//textarea[@id='profileSummaryTxt']"
            summary_textarea = wait.until(EC.presence_of_element_located((By.XPATH, summary_textarea_xpath)))
            new_summary = "Passionate full-stack engineer with deep focus on scalable architectures and cloud-native apps."
            summary_textarea.clear()
            summary_textarea.send_keys(new_summary)
            print("New summary:", new_summary)

            summary_save_xpath = "//button[normalize-space()='Save']"
            wait.until(EC.element_to_be_clickable((By.XPATH, summary_save_xpath))).click()
            print("Profile summary updated successfully!")
        else:
            print("Profile summary edit icon not found. Skipping summary update.")

    except Exception as e:
        print("An error occurred:", str(e))

    finally:
        driver.quit()

def countdown_timer(seconds):
    for remaining in range(seconds, 0, -1):
        print(f"Next update in {remaining} seconds...", end="\r")
        time.sleep(1)

if __name__ == "__main__":
    print("Running update_naukri_profile() once at startup for testing...")
    update_naukri_profile()

    schedule.every(1).minutes.do(update_naukri_profile)
    print("Scheduler started. Press Ctrl+C to stop.")

    try:
        while True:
            countdown_timer(60)
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("Automation stopped by user.")
