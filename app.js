var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(cors())


// create the connection to database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'fullstack_api'
  });


  app.get('/users', function(req,res,next){
    connection.query(
        'SELECT user_id,username,fname FROM `users`',
        function(err, results, fields) {
          res.json(results);
          //console.log(results); // results contains rows returned by server
         // console.log(fields); // fields contains extra meta data about results, if available
        }
      );
})

app.post('/register',jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    connection.execute(
      
      'insert into users (username,password,fname) values(?,?,?)',
      [req.body.username, hash, req.body.fname],
      function(err, results, fields) {
        if(err)
        {
          res.json({status : "error",message: "error"})
        }
        res.json(req.body)
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
      }
    );
});
})


app.put('/update',jsonParser,function(req,res,next)
{
  console.log(`update users set fname=${req.body.fname} where username = ${req.body.username}`)
  connection.query('update users set fname = ? WHERE username = ?', [req.body.fname, req.body.username], function (error, results, fields) {
    if (error) {
      res.json(req.body)
    };
    res.json(req.body)
    // ...
  });
}
)
 

 
app.listen(5432, function () {
  console.log('CORS-enabled web server listening on port 5432')
})