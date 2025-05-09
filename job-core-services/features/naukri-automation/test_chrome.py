from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

def get_driver():
    chrome_options = Options()
    # Do NOT use headless mode
    # chrome_options.add_argument("--headless")
    print("Setting up Chrome driver...")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    return driver

def test_browser():
    print("Launching browser...")
    driver = get_driver()
    try:
        print("Navigating to Naukri...")
        driver.get('https://www.naukri.com/')
        input("Browser should be open. Press Enter to close...")
    except Exception as e:
        print("Error:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    test_browser()