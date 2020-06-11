const express = require('express')
const router = express.Router();
const database = require('../databaseQueries');

router.get('/',   (req, res) => {
   database.pool.query('SELECT * FROM card',(error,result) =>{
      if (result) {
         res.status(200).json(result.rows)
      }
      else console.log(error)
   })
})

module.exports = router;