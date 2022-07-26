import mongoose from "mongoose";

export const dbConnection = async( db:string ) => {

    try {
        await mongoose.connect( db );
        console.log(`${ db } CONNECTED`);
    
    } catch (error) {
        console.log(error);
        throw new Error (`CAN'T CONNECT TO ${ db }`);
        
    }
}
