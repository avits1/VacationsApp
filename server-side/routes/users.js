var express = require('express');
var router = express.Router();
var client_response = require('../modules/client_response');
var con = require('../modules/connection').getConnection();
var authen = require('../modules/authen'); /// authenticate modul - check login & admin

// Register User
router.post('/register', (req, res, next) => {
  var first_name = (req.body.first_name) ? req.body.first_name : "";
  var last_name = (req.body.last_name) ? req.body.last_name : "";
  var username = (req.body.username) ? req.body.username : "";
  var password = (req.body.password) ? req.body.password : "";     
  var role = 3; // DEFAULT IS REGULAR USER

  client_response.clear();
  var err_fields = [];  
  if (!first_name) {
    err_fields.push("First Name is Empty");
  }  
  if (!last_name) {
    err_fields.push("Last Name is Empty");
  }  
  if (!username) {    
    err_fields.push("Username is Empty");
  }  
  if (!password) {    
    err_fields.push("Password is Empty");
  }     

  if (err_fields.length > 0) {
      // something is missing...
      client_response.setResponse(false, false, " something is missing...", err_fields);
      res.status(400).json(client_response.getData());
      return;
  }
  
  //  make sure Unique Username !
  con.query('SELECT * FROM users WHERE username = ?', [username], function (err, result, fields) {
    if (err) {            
        console.log(err);
        client_response.setResponse(false, true, "There Was an Error Checking Existing User In The DB...", err);
        res.status(500).json(client_response.getData());
        return;
    }

    if (result.length > 0) {
        // username already Exist
        client_response.setResponse(false, false, "username " + username + " already EXIST!", []);
        res.status(409).json(client_response.getData()); // status code: 409 - Conflict
        return;
    }

    // Enter New User ...
    var ret = con.query(`INSERT INTO users (first_name,last_name,username,password,role) VALUES (?,?,?,?,?)`, [first_name, last_name, username, password, role], function (err, result, fields) {
      if (err) {
          console.log(err);
          client_response.setResponse(false, true, "There Was an Error Adding New User To DB...", err);
          res.status(500).json(client_response.getData());
          return;
      }        
                      
      if (result.affectedRows > 0) {
        req.session.user_logged_in = true;                        
        req.session.connected_user = {user_id: result.insertId, first_name: first_name, last_name: last_name,
                                  username: username, password: password, role: role};            
        client_response.setResponse(true, false, "New User Was Added Succesfully (and logined)", [first_name]);
        res.status(201).json(client_response.getData()); // status code: 201 - Created          
        return;
      }

      client_response.setResponse(false, false, "ERROR - Can't Add New User - Check Data !", []);
      res.status(409).json(client_response.getData()); // Status Code : 409 - Conflict        
    });
  });
});


// Simple login User - Session
router.post('/login', (req, res, next) => {      
  var username = (req.body.username) ? req.body.username.trim() : "";
  var password = (req.body.password) ? req.body.password.trim() : "";     

  client_response.clear();
  var err_fields = [];     
  if (!username || username.legth < 3) {      
    err_fields.push("Username is Empty OR Too Short");
  }
  
  if (!password || password.legth < 4) {      
    err_fields.push("Password is Empty OR Too Short");
  }
  
  if (err_fields.length > 0) {
      // something is missing...
      client_response.setResponse(false, false, " something is missing...", err_fields);
      res.status(400).json(client_response.getData());
      return;
  } 
  
  // check if user already login (by session):
  var user_name = authen.curr_username(req);  
  if (user_name.length > 0) {
    if (user_name === username) {
      client_response.setResponse(false, false, "User " + username + " Already Logined", []);
      res.status(409).json(client_response.getData()); // Status Code : 409 - Conflict 
      return;
    }
  }
  
  con.query(`SELECT * FROM users u WHERE u.username=? AND u.password=?`, [username, password], function (err, user_login, fields) {
      if (err) {
          console.log(err);
          client_response.setResponse(false, true, "There Was an Error Login to Username " + username + " On DB...", err);
          res.status(500).json(client_response.getData());
          return;
      }

      if (user_login.length > 0) { // Login OK
          // Set Session HERE:                              
          req.session.user_logged_in = true;
          req.session.connected_user = user_login[0];                                               
          client_response.setResponse(true, false, "Username "  + username + " Logined Succesfully", user_login[0]);
          res.status(200).json(client_response.getData());
      }
      else { // User Login Failed !            
          client_response.setResponse(false, false, "Username " + username + " failed to login ! ", []);
          res.status(401).json(client_response.getData()); /// code 401 - Unauthorized // 403 - Forbidden
      }            
  });
});


router.post('/logout', (req, res, next) => {  
  client_response.clear();

  if (req.session == null || req.session.user_logged_in == null || !req.session.user_logged_in) {
      client_response.setResponse(true, false, "No Username To Logout - Exit", []);
      res.status(200).json(client_response.getData());
    return;
  }
  var user_logout = req.session.connected_user.username;    
  req.session.destroy((err) => {
    if (err) reject(err);

    res.clearCookie('SESSION_NAME'); // (.., options?: any) => maxage , signed,path
    client_response.setResponse(true, false, "User  "  + user_logout.username + " Logout Succesfully", user_logout);
    res.status(200).json(client_response.getData());   
  });
});

router.get('/admin_logined', function (req, res, next) {      
  client_response.clear();      

  if (!authen.is_admin_reply(req,res,"Admin Logined")) { // not admin !  
    return;
  }
  client_response.setResponse(true, false, "Admin Is Logined Now", []);
  res.status(200).json(client_response.getData()); 
});

module.exports = router;
