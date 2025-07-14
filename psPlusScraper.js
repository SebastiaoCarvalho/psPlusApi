const {Builder, By, until} = require('selenium-webdriver');
const {Options} = require('selenium-webdriver/chrome');
const { get } = require('selenium-webdriver/http');
const fs = require('fs');

function getDriver() {
    let options = new Options();
    options.addArguments("--headless");
    return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function getPsPlusEssentialGames() {
    let driver = await getDriver();
    let obj = {};
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
            let rating = null;
            let genres = null;
            try {
                let newDriver = await getDriver();
                rating = await getGameRating(newDriver, url);
                genres = await getGameGenres(newDriver, url);
                await newDriver.quit();
            }
            catch (e) {}
            let game = new Game(title, description, img, url, rating, genres);
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

async function getGameRating(driver, url) {
    driver.get(url);
    let starRating = await driver.findElement(By.className("star-rating"));
    let rating = await starRating.findElement(By.className("rating__number"));
    return await rating.getText();
}

async function getGameGenres(driver, url) {
    driver.get(url);

    let dds = await driver.findElements(By.css("dd"));
    for (ddOption of dds) {
        if ((await ddOption.getAttribute("data-qa")) === "gameInfo#releaseInformation#genre-value") {
            let span = ddOption.findElement(By.css("span"));
            return await span.getText();
        }
    }
    return null;
}

async function getPsPlusExtraNewGames() {
    return await fetchGamesFromCarousel(1);
}

async function getPsPlusPremiumNewGames() {
    return await fetchGamesFromCarousel(3);
}

async function fetchGamesFromCarousel(carouselNumber) {
    let driver = await getDriver();
    let obj = {};
    try {
        driver.get("https://www.playstation.com/en-us/ps-plus/whats-new/");
        saveScreenShot("test.png", driver);

        let carousels = await driver.findElements(By.css("div[class*='simple-carousel simple-carousel--same-height']"));
        if (carousels.length < carouselNumber + 1) {
            return obj;
        }
        let carousel = carousels[carouselNumber]; // Extra is the first and Premium is the second
        let cards = await carousel.findElements(By.css("a[class*='card']"));
        let nextButton = await carousel.findElement(By.css("div[class='btn--quick-action carousel-nav-next btn--quick-action--large btn--quick-action--primary']"));
        if (cards.length > 5) cards = cards.slice(0, cards.length/2); // For some reason the carousel has 2 sequences of the same cards
        let games = [];
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            let title = await card.findElement(By.css("h5")).getText();
            let description = null;
            try {
                description = await card.findElement(By.css("p[class='txt-style-base']")).getText();
            } 
            catch (e) {}
            let img = await card.findElement(By.css("picture")).findElement(By.css("source")).getAttribute("srcset");
            let url = await card.getAttribute("href");
            let rating = null;
            let genres = null;
            try {
                let newDriver = await getDriver();
                rating = await getGameRating(newDriver, url);
                genres = await getGameGenres(newDriver, url);
                await newDriver.quit();
            }
            catch (e) {}
            console.log("Game: " + title + " - " + url);
            let game = new Game(title, description, img, url, rating, genres);
            if (nextButton != null && i < cards.length - 1) await nextButton.click();
            games.push(game);
        }
        obj = games;
    }
    finally {
        await driver.quit();
    }
    return obj;
}

async function getPsPlusExtraAllGames() {
    let driver = await getDriver();
    let obj = []
    try {
        driver.get("https://www.playstation.com/en-us/ps-plus/games/");

        let gamesListScreens = await driver.findElement(By.className("autogameslist"))
                .findElements(By.css("div[class*='tabs__tab-content']"));
        console.log(gamesListScreens.length)
        let games = [];
        for (let gamesListScreen of gamesListScreens) {
            let gamesElements = await gamesListScreen.findElements(By.css("p[class='txt-style-base']"));
            for (let gameElement of gamesElements) {
                let gameLinkElement = await gameElement.findElement(By.css("a"));
                let title = await gameLinkElement.getAttribute("data-dtm-label");
                let url = await gameLinkElement.getAttribute("href");
                let game = new Game(title, null, null, url);
                games.push(game);
            }
        }
        obj = games;
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
    constructor(title, description, imageUrl, url, rating=null, genres=null) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.url = url;
        this.rating = rating;
        this.genres = genres;
    }
}

exports.getPsPlusEssentialGames = getPsPlusEssentialGames;
exports.getPsPlusExtraNewGames = getPsPlusExtraNewGames;
exports.getPsPlusPremiumNewGames = getPsPlusPremiumNewGames;
exports.getPsPlusExtraAllGames = getPsPlusExtraAllGames;