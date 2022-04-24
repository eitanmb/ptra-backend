const mongoose = require('mongoose');

const dbConnection = async(db) => {

    try {
        await mongoose.connect( db );
        console.log(`${ db } CONNECTED`);
    
    } catch (error) {
        console.log.log(error);
        throw new Error (`CAN'T CONNECT TO ${ db }`);
        
    }
}

module.exports = dbConnection;