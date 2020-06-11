const express = require('express')
const router = express.Router();
const database = require('../databaseQueries');

router.get('/', async function (req, res, next) {
   try {
      const cards = await database.pool.query('SELECT * FROM card')
      if (res) {
         res.status(200).json(cards.rows)
      }
   }
   catch (err) {
      console.log(err)
   }
})

module.exports = router;