# PS Plus API

## Documentation

To create the API documentation website, we use Swagger along with JSDocs, converting comments in JSDocs format to OpenAPI specifications.
To use this, simply create comments for schemas, and endpoints, and you're ready to go! 

The comments required for both are like the ones below:

- Endpoint:

```js
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
```

- Componets (includes schemas):

```js
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
```

For more information check [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) or [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc). 