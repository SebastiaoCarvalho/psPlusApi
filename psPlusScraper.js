const {Builder, By, until} = require('selenium-webdriver');

async function getPsPlusEssentialGames() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        driver.get("https://www.playstation.com/pt-pt/ps-plus/whats-new/");
        saveScreenShot("test.png");

    }
    finally {
        await driver.quit();
    }
    let boxes = await driver.findElement(By.className("cmp-experiencefragment--your-latest-monthly-games")).findElements(By.className("box"));
    let games = [];
    for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i];
        let title = await box.findElement(By.css("h3")).text;
        let description = box.findElement(By.css("p")).text;
        let img = box.findElement(By.className("imageblock")).findElement(By.css("source")).getAttribute("srcset");
        let url = box.find_element(By.CLASS_NAME, "button").find_element(By.TAG_NAME, "a").getAttribute("href");
        /* print(title)
        print(description)
        print(img)
        print(url) */
        let  game = Game(title, description, img, url);
        games.append(game);
    }
    
}

async function saveScreenShot(fileName, driver) {
    fileName = fileName || "test.png";
    let screenshot = await driver.takeScreenshot();
    fs.writeFileSync(fileName, screenshot, "base64");
}

async function getEssentialExpirationDate() {
    let label = null;
    let labels = browser.find_elements(By.TAG_NAME, "label");

    for (let temp_label of labels) {
        if (temp_label.get_attribute("data-qa") == "mfeCtaMain#offer1") {
            label = temp_label
            break
        }
    }
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
}

class Game {
    constructor(title, description, imageUrl, url, rating) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.url = url;
        this.rating = rating;
    }
}