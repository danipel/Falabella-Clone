import "reflect-metadata";
import "dotenv/config"
import app from "./app";
import {AppDataSource} from "./db";

async function main(){
    try{
        await AppDataSource.initialize();
        console.log("Database Connected...");
        app.listen(3000);
        console.log("Server is listeng on port, http://localhost:3000");
    } catch (error) {
        console.error(error);
    }   
}

main();
