from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

browser.get("https://www.playstation.com/pt-pt/ps-plus/whats-new/")
browser.save_screenshot("test.png")

boxes = browser.find_element(By.CLASS_NAME, "cmp-experiencefragment--your-latest-monthly-games").find_elements(By.CLASS_NAME, "box")

class Game:

    def __init__(self, title, description,img_url, url):
        self.title = title
        self.description = description
        self.img_url = img_url
        self.url = url

game_list = []

for i in range(1, len(boxes)):
    box = boxes[i]
    txt = box.find_elements(By.TAG_NAME, "p")
    title = txt[0].text
    description = txt[1].text
    img = box.find_element(By.CLASS_NAME, "imageblock").find_element(By.TAG_NAME, "source").get_attribute("srcset")
    url = box.find_element(By.CLASS_NAME, "button").find_element(By.TAG_NAME, "a").get_attribute("href")
    print(title)
    print(description)
    print(img)
    print(url)
    game = Game(title, description, img, url)
    game_list.append(game)

url = game_list[0].url

browser.get(url)
sleep(2)
browser.save_screenshot("test.png");

label = None
labels = browser.find_elements(By.TAG_NAME, "label")

for temp_label in labels:
    if temp_label.get_attribute("data-qa") == "mfeCtaMain#offer1":
        label = temp_label
        break

spans = label.find_elements(By.TAG_NAME, "span")
span = None

for tem_span in spans:
    if tem_span.get_attribute("data-qa") == "mfeCtaMain#offer1#discountDescriptor":
        span = tem_span
        break

text : str = span.text

words = text.split(" ")

i = 0
while i < len(words) and not words[i].__contains__("/"):
    i += 1

date_values = words[i].split("/")
date = date_values[1] + "/" + date_values[0] + "/" + date_values[2] + " "

i += 1

while i < len(words):
    date += words[i]
    if i < len(words) - 1:
        date += " "
    i += 1

print(date)


# print(game_list)

