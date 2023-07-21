import { MongoClient } from "mongodb";

const mongoConnectString='mongodb://127.0.0.1:27017/'
export async function dbConnection(){
    const client=new MongoClient(mongoConnectString)
    await client.connect();
    console.log('Mongodb connected successfully')
    return client
}