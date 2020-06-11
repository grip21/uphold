const express = require('express')
const router = express.Router();
const database = require('../databaseQueries');

router.get('/', async function (req, res, next) {
    try {
        const transactions = await database.pool.query('SELECT * FROM transaction')
        if (res) {
            res.status(200).json(transactions.rows)
        }
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router;