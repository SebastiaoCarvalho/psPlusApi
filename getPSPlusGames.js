const {spawn} = require('child_process');
// const {getGameRating} = require("../getGameRating.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000

app.get('/', (request, response) => {
    response.send('App is on');
});

app.get('/games', async (request, response) => {
    let data = await getPsPlusGames(response);
    
});

async function getPsPlusGames(response) {
    // spawn new child process to call the python script
    const python = spawn('python3', ['ps_plus_scraper.py']);
    
    // collect data from script
    let text;
    
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        console.log("text : " + text);
        text = data.toString();
    });

    python.stderr.on('data', data => console.error(`sterr : ${data}`));
    
    // in close event we are sure that stream from child process is closed
    python.on('close', async (code) => {
        console.log(`child process close all stdio with code ${code}`);
        let games = await parseGames(text);
        response.json(games);
        console.log(games);
    });
}



async function parseGames(str) {
    console.log("a");
    let games = [];
    let lines = str.split("\n");
    for (let i = 0; i < (lines.length - 2) / 4; i++) {
        let title = lines[i * 4 ];
        // let rating = await getGameRating(title);
        let game = {title : title, url : lines[i * 4 + 3],
        description : lines[i * 4 + 1], imageUrl : lines[i * 4 + 2], rating : null}
        games.push(game);
    }
    endDate = new Date(lines[lines.length - 2]);
    return {current : games, endDate : endDate};
}

app.listen(PORT);