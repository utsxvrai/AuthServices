const express = require("express");
const bodyParser = require('body-parser');
const { ServerConfig , Logger} = require('./config')
const db = require('./models');

const app = express();
const apiRoutes = require('./routes');

const prepareAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/api', apiRoutes);

    app.listen(ServerConfig.PORT, async () => {
        console.log(`Server Started on Port: ${ServerConfig.PORT}`);
        if(process.env.DB_SYNC) {
            db.sequelize.sync({alter: true});
        }
    });
}   

prepareAndStartServer();