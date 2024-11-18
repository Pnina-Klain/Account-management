const {MongoClient} = require('mongodb')
let client = null

async function openConnection(server){
    console.log({server})
    if(server === null || server === undefined)
        throw new Error('server url is not defind')
    if(typeof server !== 'string')
        throw new Error('server url must be of type string')
    if(!server.trim().startsWith('mongodb://') && !server.trim().startsWith('mongodb+srv://'))
        throw new Error('server string must start with "mongodb://" or with "mongodb+srv://"')
    try{
        client = new MongoClient(server.trim())
        await client.connect()
    }
    catch(ex){
        throw ex
    }
}

async function closeConnection(){
    await client.close()
}

const getClient = ()=>client

module.exports = {openConnection, closeConnection, getClient}