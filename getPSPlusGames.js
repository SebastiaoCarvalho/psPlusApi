const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { getPsPlusEssentialGames } = require('./psPlusScraper');

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
 *         description: The games and expiration date.
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
    await getPsPlusGames(response);
});

async function getPsPlusGames(response) {
    response.json(await parseGames(await getPsPlusEssentialGames()));
}


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
 *           example: "https://store.playstation.com/pt-pt/product/EP9000-CUSA01073_00-RCPS400000000000"
 *         rating:
 *           type: string
 *           description: The game rating out of 10
 *           example: "8.5"
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
        /* contact: {
          name: "LogRocket",
          url: "https://logrocket.com",
          email: "info@email.com",
        }, */
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