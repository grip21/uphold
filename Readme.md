##BTC USD Exchange Bot

 BTC-USD bot it's a node.js server that is able to move money between US dollar (USD) and Bitcoin (BTC) currencies.
    
###Usage:
   - Install postgreSQL;
    
   - In the terminal insert the following commands in order to start postgreSQL server:
    
    ``` 
        - $ sudo service postgresql start
        - $ sudo -i -u postgres
        - $ psql
        - CREATE DATABASE <name>
    
   - __Its mandatory the name of the database name and the access password to the posstgreSQL 
           server match the 'database' and 'password' parameters in the Javascript file 'databaseQueries' pool configuration ('uphold' and 'f037l$')__
    ```
#### Lets run the bot 
  ######Start the terminal, go to the project directory /uphold/bin and run the command: 
    ```
    - $ node www
    
    ```
    - The bot is up and running, the collections are created and is moving money between BTC and USD according the requested algorithm.
    - From now on you can see in real time at the terminal the data about:
        .the bot PAT;
        .the USD and BTC cards created;
        .the price of Bitcoin purchased;
        . the ticker (ASK and BID) every 5 seconds and if there is a profit above 5%, occurs a transaction between cards
    
###In the browser
        1. To see the bot PAT and ID -> [client] (http://localhost:3000/client)
        2. To see the info about the cards created -> [cards] (http://localhost:3000/cards)
        3. To see all the info about the transactions until the moment -> [transactions] (http://localhost:3000/transactions) 
        
####To run the test file in /test directory
    1. Go to the upholdBot.js file and comment the line 16 'await createDB();'
    2. At the terminal position yourself in /test directory and run $ npm test
    3. Make sure you database has some data.