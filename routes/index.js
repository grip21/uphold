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
router.get('/', async (req, res, next) =>{
    try {
        const client = await database.pool.query("SELECT * FROM client");
        if (res){
            res.status(200).json(client.rows)
        }
    }
    catch (err) {
        console.log(err)
    }
});



module.exports = router;
