const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { getPsPlusEssentialGames, getPsPlusExtraNewGames, getPsPlusPremiumNewGames, getPsPlusExtraAllGames } = require('./psPlusScraper');
const { get } = require("selenium-webdriver/http");

const app = express();
const PORT = process.env.PORT || 3000

app.get('/', (request, response) => {
    response.send('App is on');
});

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: The games API
 * /games:
 *   get:
 *     summary: Get free games for Ps Plus Essential tier
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 current:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 *                 endDate:
 *                   type: string
 *                   description: The date when the games stop being free
 *                   format: date
 * 
 *       500:
 *         description: Some server error
 *
 */
app.get('/games', async (request, response) => {
    response.json(await parseGames(await getPsPlusEssentialGames()));
});

/**
 * @swagger
 * /games/extra:
 *   get:
 *     summary: Get the newest additions for Ps Plus Extra tier
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: The new games that are free for Ps Plus Extra tier
 *               items:
 *                 $ref: '#/components/schemas/Game'
 * 
 *       500:
 *         description: Some server error
 *
 */
app.get('/games/extra', async (request, response) => {
    response.json(await getPsPlusExtraNewGames());
});

/**
 * @swagger
 * /games/premium:
 *   get:
 *     summary: Get the newest additions for Ps Plus Premium tier
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: The new games that are free for Ps Plus Premium tier
 *               items:
 *                 $ref: '#/components/schemas/Game'
 * 
 *       500:
 *         description: Some server error
 *
 */
app.get('/games/premium', async (request, response) => {
    response.json(await getPsPlusPremiumNewGames());
});

app.get('/games/extra/all', async (request, response) => {
    response.json(await getPsPlusExtraAllGames());
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The game title
 *           example: "Ratchet & Clank"
 *         description:
 *           type: string
 *           description: The game description
 *           example : "Play as Ratchet, a lombax who is trying to save the galaxy, and Clank, his adorable robot friend."
 *         image:
 *           type: string
 *           description: The image url
 *           example: "https://image.api.playstation.com/vulcan/img/rnd/202011/0204/g7QavKoff0uAngWn4Hiytel9.png?w=1920&thumb=false"
 *         url:
 *           type: string
 *           description: The game url
 *           example: "https://www.playstation.com/en-us/games/ratchet-and-clank/"
 *         rating:
 *           type: string
 *           description: The game rating out of 5 stars
 *           example: "4.2"
 *         genre:
 *          type: string
 *          description: The genres of the game
 *          example: "Adventure"
 */
async function parseGames(data) {
    endDate = new Date(data.date);
    return {current : data.games, endDate : endDate};
}

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Ps Plus API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["getPSPlusGames.js"],
  };
  
  const specs = swaggerJsDoc(options);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );

app.listen(PORT);
console.log(`Running on port ${PORT}`);