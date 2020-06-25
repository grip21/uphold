const express = require('express');
const router = express.Router();
const app = express()
const bodyParser = require('body-parser');
const database = require('../databaseQueries');

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
)

/* GET the client data*/
router.get('/', (req, res) =>{
    database.pool.query("SELECT * FROM client", (error, result) => {
        if (result) {
            res.status(200).json(result.rows)
        }
        else console.log(error)
    })
});



module.exports = router;
