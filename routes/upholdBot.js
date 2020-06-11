const express = require('express');
const router = express.Router();
const database = require('../databaseQueries');
const Uphold = require('uphold-sdk-node')({"host": "api-sandbox.uphold.com"});
const request = require('request');

let clientId;
let usCardId, btcCardId = '';
let tickerAsk, tickerBid = '',cost ='';
let bitcoinOn = false, usdollarOn = false;
let today,date, time, dateTime = '';
router.get('/', function(req, res, next) {
});

async function synchronize() {
    await createDB();
    await main();
}
synchronize().then(v =>console.log()).catch(err => console.log(err))

function main() {
    //Responsible to create and add the User's PAT to SDK configs
    Uphold.createPAT('helderduarte960@gmail.com', 'F037l$f0', 'Personal Access Token Helder', false, function (err, resolve) {
        const clientPat = resolve.accessToken;
        console.log(resolve)
        console.log("Client's Personal Access Token: ",clientPat);
        Uphold.addPAT(clientPat).user(async function (err, user) { // Add the PAT to the uphold-sdk-node configs
            clientId = user.id;
            console.log("CLIENT ID:", clientId)
            try {
                //INSERT client in database
                await database.pool.query("INSERT INTO client(clientid, clientpat) VALUES ($1, $2) ON CONFLICT(clientid) " +
                    "DO UPDATE SET clientpat =Excluded.clientpat", [clientId, clientPat]);
            } catch (e) {
                console.log(e)
            }
            //The uphold API calls for purchase Bitcoin and create cards depends on authentication through the PAT existance in configs
            BTCcard()
                .then(USDcard)
                .then(buyBtc)
        });
    })
}

async function createDB() { //create the Database
    try {
        //First, drop all collections if exists and then creates the collections
        await database.pool.query(database.dropClient);
        await database.pool.query(database.dropCard);
        await database.pool.query(database.dropTransaction);
        await database.pool.query(database.createTableClient);
        await database.pool.query(database.createTableCard);
        await database.pool.query(database.createTableTransaction);
    }
    catch (err) {
        console.log(err)
    }
    finally {
        console.log("Database created");
    }

}


//Buy the Bitcoin when bot is being initialized
function buyBtc() {
    let exchangeRate ='';
    try {
        return new Promise((resolve, reject) => {
            request('https://api.uphold.com/v0/ticker/BTC-USD', async (err, res, body) => {
                if (res) {
                    exchangeRate = JSON.parse(body);
                    cost = exchangeRate.ask
                    console.log("Bitcoin price:", cost,"$")
                    database.pool.query("UPDATE card SET balance= $1 WHERE currency = 'BTC'",[cost])
                    //Uphold.createTransaction((usCardId, "btc", tickerAsk, btcCardId, "usd to btc"), async (err, transaction) => {
                    //if (transaction) {
                    const time = await getDate(); // Returns transaction date in the format: YEAR-MONTH-DAY HOUR-MINUTE-SECOND
                    database.pool.query("INSERT INTO transaction (source_card, destination_card,currency,amount,date) " +
                        "VALUES( $1,$2,$3,$4,$5)", [usCardId, btcCardId, "btc", cost,time])
                    bitcoinOn = true; usdollarOn = false;
                    //}
                    //})
                }
            })
            resolve()
        })
    }
    catch (err) {
        console.log(err)
    }
}

async function ticker(){
    try {
        //get the current ticket for the BTC-USD pair
        await request('https://api.uphold.com/v0/ticker/BTC-USD', (err, res, body) => {
            const tick = JSON.parse(body);
            tickerAsk = tick.ask; // ASK parameter from the ticker response
            tickerBid = tick.bid; // BID parameter from the ticker response
            //tickerBid = 10500 //to test the algorithm, set the BID above 5% than the ASKing price
            console.log("Ticker:", tick)
        });
        //If the bot has a bitcoin in his wallet and the current bid is >= 1.05 the cost of the bitcoin purchased, there is enough profit and its sold
        if ((tickerBid > (cost * 1.05)) && bitcoinOn) { // its created a transaction between two cards, source - Bitcoin Card and destination - USD card
            //Uphold.createTransaction((btcCardId,"usd",tickerBid,usCardId, "btc to usd"),async (err,btcUsdTrans)=>{
                //if (btcUsdTrans){
                await console.log("Sell BITCOIN")
                const time = await getDate(); // Returns transaction date in the format: YEAR-MONTH-DAY HOUR-MINUTE-SECOND
                usdollarOn = true; bitcoinOn = false;
                cost = tickerBid; // the value, in dollars, for which the bitcoin was sold
                await console.log("Best Offer:",cost)
                //insert transaction record
                await database.pool.query("INSERT INTO transaction (source_card, destination_card,currency,amount,date) " +
                    "VALUES( $1,$2,$3,$4,$5)", [btcCardId,usCardId,"usd",tickerBid,time])
                //Set BTC card balance = 0
                await database.pool.query("UPDATE card SET balance = 0 WHERE currency = 'BTC'");
                //Add the money from the sale to the USD card
                await database.pool.query("UPDATE card SET balance = balance + $1 WHERE currency = 'USD'",[tickerBid])
                //}
            //})
        }
        //If the bot has dollars in his wallet and the current ASK for bitcoin is <= 0.95 the price of the bitcoin previously sold, there is enough profit and its purchased 1 Bitcoin
        else if (usdollarOn && (tickerAsk < (cost*0.95))) { // its created a transaction between two cards, source - UDS Card and destination - BITCOIN card
            //Uphold.createTransaction((usCardId, "btc", tickerAsk, btcCardId, "usd to btc"), async (err, usdBtcTrans) => {
                //if (usdBtcTrans){
                await console.log("Purchase BITCOIN")
                const time = await getDate(); // Returns transaction date in the format: YEAR-MONTH-DAY HOUR-MINUTE-SECOND
                usdollarOn = false; bitcoinOn = true;
                cost = tickerAsk;
                await console.log("COST ASK: ",cost)
                // Insert transaction record
                await database.pool.query("INSERT INTO transaction (source_card, destination_card,currency,amount,date) " +
                    "VALUES( $1,$2,$3,$4,$5)", [usCardId,btcCardId,"btc",tickerAsk,time]);
                //Remove X amount from USD card
                await database.pool.query("UPDATE card SET balance = balance - $1 WHERE currency = 'USD'",[tickerAsk])
                // Set BTC card balance = cost
                await database.pool.query("UPDATE card SET balance = $1 WHERE currency = 'BTC'",[tickerAsk])
                //}
            //})
        }
    } catch (err) {
        console.error("Could not get the BTC-USD currency rate:");
    }
}
setInterval(ticker,10000) // Repeat the request for the currency exchange rate BTC-USD

function BTCcard(){ //Create BTC card
    console.log("Creating BTC Card")
    return new Promise((resolve, reject) => {
        try {
            Uphold.createCard('Bitcoin Card', 'BTC',  (err,res) =>{
                btcCardId = res.id;
                console.log("BTC card ID: ",res.id)
                // Insert the card in card collection
                database.pool.query("INSERT INTO card(card_name, client,currency,balance,cardid)  VALUES ($1,$2,$3,'0',$4) ON CONFLICT " +
                    "ON CONSTRAINT card_pkey DO UPDATE SET cardid = EXCLUDED.cardid", [res.label, clientId, res.currency, res.id])
                resolve()
            })
        }
        catch (err) {
        }
    })
}

function USDcard() { //Create USD card
    return new Promise((resolve, reject) => {
        try {
            console.log("Creating USD card")
            Uphold.createCard('Us Dollar Card', 'USD', (err, res) => {
                usCardId = res.id;
                console.log("USD card ID: ", usCardId)
                // Insert the card in card collection
                database.pool.query("INSERT INTO card(card_name, client,currency,balance,cardid)  VALUES ($1,$2,$3,'0',$4) ON CONFLICT " +
                    "ON CONSTRAINT card_pkey DO UPDATE SET cardid = EXCLUDED.cardid", [res.label, clientId, res.currency, res.id])
                resolve()
            })
        }
        catch (e) {
        }
    })
}

function getDate() { // Returns the date in the format: YEAR-MONTH-DAY HOUR-MINUTE-SECOND
    today = new Date();
    date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date+' '+time
    return (dateTime)
}

module.exports ={router,ticker};
