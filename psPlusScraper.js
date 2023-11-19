const {Builder, By, until} = require('selenium-webdriver');
const {Options} = require('selenium-webdriver/chrome');
const { get } = require('selenium-webdriver/http');
const fs = require('fs');

async function getPsPlusEssentialGames() {
    let options = new Options();
    options.addArguments("--headless");
    let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    let obj = null;
    try {
        driver.get("https://www.playstation.com/pt-pt/ps-plus/whats-new/");
        saveScreenShot("test.png", driver);

    
        let boxes = await driver.findElement(By.className("cmp-experiencefragment--your-latest-monthly-games")).findElements(By.className("box"));
        let games = [];
        for (let i = 0; i < boxes.length; i++) {
            let box = boxes[i];
            let title = await box.findElement(By.css("h3")).getText();
            let description = await box.findElement(By.css("p")).getText();
            let img = await box.findElement(By.className("imageblock")).findElement(By.css("source")).getAttribute("srcset");
            let url = await box.findElement(By.className("button")).findElement(By.css("a")).getAttribute("href");
            let  game = new Game(title, description, img, url);
            games.push(game);
        }
        let date = await getEssentialExpirationDate(driver, games[0].url);
        obj = {games : games, date : date};
    }
    finally {
        await driver.quit();
    }
    return obj;
}

async function saveScreenShot(fileName, driver) {
    fileName = fileName || "test.png";
    let screenshot = await driver.takeScreenshot();
    fs.writeFileSync(fileName, screenshot, "base64");
}

async function getEssentialExpirationDate(driver, url) {
    driver.get(url);

    let label = null;
    let labels = await driver.findElements(By.css("label"));

    for (let tempLabel of labels) {
        if ((await tempLabel.getAttribute("data-qa")) == "mfeCtaMain#offer1") {
            label = tempLabel
            break
        }
    }
    spans = await label.findElements(By.css("span"));
    span = null;

    for (let tempSpan of spans) {
        if ((await tempSpan.getAttribute("data-qa")) == "mfeCtaMain#offer1#discountDescriptor") {
            span = tempSpan;
            break;
        }
    }

    let text = await span.getText();

    words = text.split(" ");

    i = 0;
    while (i < words.length && ! words[i].includes("/"))
        i += 1;

    let dateValues = words[i].split("/");
    let date = dateValues[1] + "/" + dateValues[0] + "/" + dateValues[2] + " ";

    i += 1;

    while (i < words.length) {
        date += words[i];
        if (i < words.length - 1)
            date += " ";
        i += 1;
    }
    return date;
}

class Game {
    constructor(title, description, imageUrl, url, rating=null) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.url = url;
        this.rating = rating;
    }
}

exports.getPsPlusEssentialGames = getPsPlusEssentialGames;