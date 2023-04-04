// const mysql = require('mysql');

const db = require("../sql/connection");
let argon2 = require('argon2');
let jwt = require("jsonwebtoken");

let register = async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    let fullName = req.body.fullName;

    let passwordHash;

    try {
        passwordHash = await argon2.hash(password);

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }

    let params = [username, passwordHash, fullName];
    let sql = "insert into regUser (username, password_hash, full_name) values (?, ?, ?)"

    try {
    let results = await db.queryPromise(sql, params);
    res.sendStatus(200)
    } catch(err) {
        console.log(err); 
        if(err.code == "ER_DUP_ENTRY"){
            res.status(400).send("That username is taken. Please choose another")
        }else {
        res.sendStatus(500);
        }
        return;
    }

}


let login = (req,res) => {

let username = req.body.username;
let password = req.body.password;

let sql = "select id, full_name, password_hash from regUser where username = ?";
let params = [username];

db.query(sql, params, async (err, rows) => {
    if(err) {
        console.log("Could not get user", err)
        res.sendStatus(500)

        res.status(500)
    } else {
if(rows.length >1){
    console.log("Returned too many rows for username", username)
    res.sendStatus(500);
    } else if (rows.length == 0) {
        console.log("Username does not exist");
        res.status(400).send("that username does not exist. Please sign up for an account")
    } else {
        // {"id": "234", "username": "sgarsson", "password_hash": "....", "full_name: "Sasha Garsson"}
        let pwHash = rows[0].password_hash;
        let fnName = rows[0].full_name;
        let userId = rows[0].id;

        let goodPass = false;

        try{
            goodPass = await argon2.verify(pwHash, password);  // returns a boolean
        } catch(err) {
            console.log("Failed to verify password ", err)
            res.status(400).send("Invalid password");
        }
        if(goodPass) {
            let token  = {
                "fullName": fnName, 
                "userId": userId
            }
          //  res.json(token);
            let signedToken = jwt.sign(token, process.env.JWT_SECRET);
          //  res.json(signedToken);
          res.setHeader("Authorization", "Bearer", signedToken)
          res.sendStatus(200)
                    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IlNhc2hhIEdhcnNzb24iLCJ1c2VySWQiOjEsImlhdCI6MTY4MDE5MTEyNn0.eSSuJeYVdpmuJ_qHltm5r6G14vaDKm_0wP2PeQ4nZbw
        } else {
            res.sendStatus(400)
        }
    }
 }
}) 
}
const logout = (req,res) => {
    console.log("Logging out");
    if (req.session) {
        req.session.destroy(err => {
          if (err) {
            res.status(400).send('Unable to log out')
          } else {
            res.send('Logout successful')
          }
        });
      } else {
        res.end()
      }
   // req.session.destroy();
}


module.exports = {register, login, logout}