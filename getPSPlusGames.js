const {spawn} = require('child_process');
// const {getGameRating} = require("../getGameRating.js");
const express = require("express");
const { getPsPlusEssentialGames } = require('./psPlusScraper');

const app = express();
const PORT = process.env.PORT || 3000

app.get('/', (request, response) => {
    response.send('App is on');
});

app.get('/games', async (request, response) => {
    await getPsPlusGames(response);
});

async function getPsPlusGames(response) {
    response.json(await parseGames(await getPsPlusEssentialGames()));
}



async function parseGames(data) {
    endDate = new Date(data.date);
    return {current : data.games, endDate : endDate};
}

app.listen(PORT);
console.log(`Running on port ${PORT}`);