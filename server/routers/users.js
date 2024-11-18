const express = require('express')
const{getAllUsers, createUser} = require('../modules/users')

const{checkBodyContainsKeys} = require ('../utils/middleware')

const router = express.Router()

router.get('/getAllUsers',async(req,res)=>{
    const users = await  getAllUsers()
    res.status(200).json(users)
})

router.use(express.json())

router.post('/createUser',checkBodyContainsKeys(['userName','name','phone']),async(req,res)=>{
    try{
    const user = req.body
    const newUser = await createUser(user)
    res.status(200).json(newUser)
}catch(error){
    res.status(500).send(error.message)
}

})

module.exports = router