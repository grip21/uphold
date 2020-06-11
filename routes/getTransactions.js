const express = require('express')
const router = express.Router();
const database = require('../databaseQueries');

router.get('/',  (req, res) =>{
    const transactions =  database.pool.query('SELECT * FROM transaction',(error,result)=>{
        if (res) {
            res.status(200).json(result.rows)
        }
        else console.log(error)
    })
})

module.exports = router;