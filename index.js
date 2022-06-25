
const express = require('express')
const fs = require('fs')
const uuid = require("uuid");
// const {login,logout} = require('./routes/auth.route')
// const {voters,party} = require("./routes/votes.route")
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json())

// app.use("/user/login",login)
// app.use("/user/logout",logout)
// app.use("/vote",voters)


app.get("/",(req,res)=>{
    res.send("Welcome")
})


// login user
app.post("/user/login",(req,res)=>{
    if(!req.body.username || !req.body.password) {
      return res.status(400).send({ status: "please provide username and password" })
    } 
    var flag = false
 
    let username = req.body.username;
    let password = req.body.password;
    let token = uuid.v4();
   
     fs.readFile("./db.json",{encoding: "utf-8"},(err,data)=>{
       let parsed = JSON.parse(data);
       parsed.users = parsed.users.map((item)=>{
         if(username == item.username && password == item.password) {
           flag = true
           return {...item, token:token}
         }
         return item
       })
      if(flag == false){
       return res.status(401).send({status :"Invalid Credentials"});
      }
       fs.writeFile("./db.json",JSON.stringify(parsed),"utf-8",(err,data)=>{
         if(err) throw err
         console.log(req.body)
         res.send({ status: "Login Successful", token })
       })
     })
     
 
   
 })
 
 app.get("/user/login",(req,res)=>{
     res.write("login")
     res.send(res.body)
 })
 
 
 
 // user logout
 
  app.post("/user/logout",(req,res)=>{
    
    // to remove token keep token in query 
     fs.readFile("./db.json",{encoding: "utf-8"},(err,data)=>{
       let arr = JSON.parse(data)
       arr.users = arr.users.map((item)=>{
         if(item.token == req.query["apikey"]) {
         
           return {...item, token:""};
         }
         return item;
       })
       fs.writeFile("./db.json",JSON.stringify(arr),"utf-8",(err,data)=>{
         if(err) throw err
         console.log(req.body)
        return res.send({ status: "user logged out successfully" })
       })
     })
  })

// voters part


app.post("/user/create",(req, res) => {
    // const {id} = uuid.v4();
    const {id,name,role,username,password,age,votes,party} = req.body
    let user;
    if(role == "voter") {
        user = {id,name,role,username,password,age}
    }
    else{
        user = {id,name,role,votes,party,age}
    }
    fs.readFile("./db.json",{encoding: "utf-8"},(err, data) => {
        if(err) console.error("something wrong",err)

       const array = JSON.parse(data)
       array.users = [...array.users, user]
            if(res.body !== data) {
                fs.writeFile("./db.json", JSON.stringify(array),"utf-8",(err) => {
                    if(err) console.error("file not got written",err)
                    console.log(req.body)
                })
            }
      
        console.log(JSON.parse(data))
    })
   
    res.send(req.body)
})

app.get("/votes/voters",(req, res) => {
    fs.readFile("./db.json",{encoding: "utf-8"},(err, data)=>{
        res.send(data)
    })
    // res.send(res.body)
})

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log("listening on http://localhost:8080")
})