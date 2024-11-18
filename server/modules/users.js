
require('dotenv').config()
const{v4} = require('uuid')
const {MongoOperations} = require('../services/mongo-operation')
const {MONGO_EXPENSES_DB = "expenses", MONGO_USERS_COLLECTION = "users"} = process.env
const mongoConnection = new MongoOperations(MONGO_EXPENSES_DB)

const existUserName= async (username)=>{
    try{
        mongoConnection.Collection = MONGO_USERS_COLLECTION
        const response = await mongoConnection.find({filter:{userName}})
        if(response.length>0)
            return true
        else
            return false
    }catch(error){
        throw error
    }
}

const getAllUsers = async ()=>{
    try{
        mongoConnection.Collection = MONGO_USERS_COLLECTION
        const result = mongoConnection.find({})
        return result
    }catch(error){
        throw error
    }
}

const createUser = async(user) =>{
    const res = await existUserName(user.userName)
    if(res){
        throw new Error(`username ${user.userName} alredy exist in db`)
    }
    const id = v4()
    user.id=id
    try{
        mongoConnection.Collection = MONGO_USERS_COLLECTION
        const response = await mongoConnection.insertItem(user)
        const{acknowledged} = response
        if(acknowledged){
            return {user}
        }else{
            throw new Error('user was not saved')
        }
    } catch(error){
        throw error
    }
}

module.exports={getAllUsers, createUser}