const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "web_term"
});

connection.connect(error=>{
    if(error) throw error;
    console.log("connected. ");
})

module.exports = connection;