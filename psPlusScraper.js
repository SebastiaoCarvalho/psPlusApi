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
        driver.get("https://www.playstation.com/en-us/ps-plus/whats-new/");
        saveScreenShot("test.png", driver);

    
        let boxes = await driver.findElement(By.className("cmp-experiencefragment--wn-latest-monthly-games-content")).findElements(By.className("box--light"));
        let games = [];
        for (let i = 0; i < boxes.length; i++) {
            let box = boxes[i];
            let title = await box.findElement(By.css("h3")).getText();
            let description = await box.findElement(By.css("p")).getText();
            let img = await box.findElement(By.className("imageblock")).findElement(By.css("source")).getAttribute("srcset");
            let url = await box.findElement(By.className("btn--cta__btn-container")).findElement(By.css("a")).getAttribute("href");
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

    let fatherSpanOptions = await driver.findElements(By.className("psw-l-line-left"));
    let span = null;
    for (fatherSpan of fatherSpanOptions) {
        spanOptions = await fatherSpan.findElements(By.className("psw-c-t-2"));
        if (spanOptions.length > 0) {
            span = spanOptions[0];
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