
require ('dotenv').config()
const http = require('http')
const app = require('./app')

const {openConnection} = require('./services/mongo-connection')
const { HOST = localhost, PORT = 3000, MONGO_DB_URL ='mongodb://localhost:27017'} = process.env
                                                    
const serverUrl = MONGO_DB_URL

openConnection(serverUrl).then(_ =>{
    app.listen(PORT||3000, HOST||localhost, ()=>{
        console.log(`Server is runnin on "http://${HOST}:${PORT}"`)
    })
    const server = http.createServer(app)
}).catch(ex=>{
    console.log({ex})
    console.log('Could not open a connection to mongo db server')
})