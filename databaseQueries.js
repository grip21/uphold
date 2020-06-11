const express = require('express')
const router = express.Router();
const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'uphold',
    password: 'f037l$',
    port: 5432,
})

const dropClient = 'DROP TABLE IF EXISTS client CASCADE';
const dropCard = 'DROP TABLE IF EXISTS card CASCADE';
const dropTransaction = 'DROP TABLE IF EXISTS transaction CASCADE';

const createTableClient = 'CREATE TABLE client(' +
    'clientid VARCHAR (255) PRIMARY KEY,' +
    'clientpat VARCHAR (255));';

const createTableCard = 'CREATE TABLE card(' +
    'card_name VARCHAR(255) NOT NULL,' +
    'client VARCHAR(255) NOT NULL,' +
    'currency VARCHAR(255) NOT NULL,' +
    'balance NUMERIC(12,6),' +
    'cardid VARCHAR(255),' +
    'PRIMARY KEY (card_name, client),' +
    'FOREIGN KEY (client) REFERENCES client(clientid));';

const createTableTransaction = 'CREATE TABLE transaction (' +
    'source_card VARCHAR(255) NOT NULL,'+
    'destination_card VARCHAR(255) NOT NULL,' +
    'currency VARCHAR(255) NOT NULL,' +
    'amount NUMERIC (12,6) NOT NULL,' +
    'date VARCHAR(255) NOT NULL);';

module.exports = {
    dropClient,
    dropCard,
    dropTransaction,
    createTableClient,
    createTableCard,
    createTableTransaction,
    pool
}


