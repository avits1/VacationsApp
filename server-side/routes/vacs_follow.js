var express = require('express');
var router = express.Router();
var client_response = require('../modules/client_response');
var con = require('../modules/connection').getConnection();
var authen = require('../modules/authen'); /// authenticate modul - check login & admin


// Get Vacation_Follow for current User
router.get('/', function (req, res, next) {       
  var err_fields = [];   
  client_response.clear();     
  
  var place_msg = "Vacations Follow For User";
  if (!authen.is_logined_reply(req, res, place_msg)) { // not logined !        
    return;
  }    
   
  var user_id = authen.curr_userid(req);    
  if (user_id == 0) {
      err_fields.push("User ID is Zero");
  }
  if (err_fields.length > 0) {
    // something is missing...
    client_response.setResponse(false, false, " something is missing...", err_fields);
    res.status(400).json(client_response.getData());
    return;
  }
      
  con.query("SELECT vf.vac_id FROM vacs_follow vf WHERE vf.user_id = ?", [user_id], function (err, vacs_follow_user, fields) {        
    if (err) {
        console.log(err);
        client_response.setResponse(false, true, "Vacations Follow for User ID - There Was an Error...", err);
        res.status(500).json(client_response.getData());
        return;
    }
    client_response.setResponse(true, false, "Vacations Follow List", vacs_follow_user);
    res.status(vacs_follow_user.length?200:204).json(client_response.getData());
    return;  
  });
});


// Add Vacation_Follow
router.post('/', (req, res, next) => {    
  var vac_id = (req.body.vac_id) ? req.body.vac_id : 0;  
  client_response.clear();
 
  var place_msg = "Vacations Follow - Add Follow";
  if (authen.is_logined_reply(req, res, place_msg) === false) { // not logined !    
    return;
  }      
  var user_id = authen.curr_userid(req);  

  var err_fields = [];  
  if (user_id == 0) {
      err_fields.push("User ID is Zero");
  }
  if (vac_id == 0) {
    err_fields.push("vacation ID is Zero");
  }

  if (err_fields.length > 0) {
      // something is missing...
      client_response.setResponse(false, false, " something is missing...", err_fields);
      res.status(400).json(client_response.getData());
      return;
  } else {
      // Enter New Vacation_Follow ...
      // INSERT IGNORE .. => duplicate key create warning not error        
        var ret1 = con.query(`INSERT IGNORE INTO vacs_follow (user_id,vac_id) VALUES (?,?)`, [user_id, vac_id], function (err1, result1, fields1) {        
          if (err1) {
              console.log(err1);              
              client_response.setResponse(false, true, "There Was an Error Adding New Vacation_Follow To DB...", err);
              res.status(500).json(client_response.getData());                            
              return;
          }        
          if (result1.affectedRows > 0) { /// update vacations - follow num:
            var ret2 = con.query(`UPDATE vacations vac SET vac.follow_num = vac.follow_num + 1 WHERE vac.vac_id = ?`, [vac_id], function (err2, result2, fields2) {
              if (err2) {
                  console.log(err2);
                  client_response.setResponse(false, true, "There Was an Error Updating Vacation In DB...", err2);
                  res.status(500).json(client_response.getData());
                  return;
              }       

              if (result2.affectedRows > 0) {
                client_response.setResponse(true, false, "New Vacation Follow Was Added Succesfully", []);
                res.status(200).json(client_response.getData());
                return;
              }                            
              client_response.setResponse(false, false, "Can't Update Follow Num - Check Data !", []);
              res.status(409).json(client_response.getData()); // Status Code : 409 - Conflict              
              return;

            })
            // NO CODE HERE - exit after DB Callback - UPDATE
            return;
          }
          client_response.setResponse(false, false, "Can't Add New Vacation Follow - Check Data !", []);
          res.status(409).json(client_response.getData()); // Status Code : 409 - Conflict
          return;
      });
      // NO CODE HERE - after DB callback - INSERT IGNORE
  }  
});


// Remove Vacation_Follow
router.delete('/', function (req, res, next) {  
  var vac_id = (req.body.vac_id) ? req.body.vac_id : 0;  
  client_response.clear();     

  if (!authen.is_logined_reply(req,res,"Vacations Follow - Remove Follow")) { // not logined !    
    return;
  }    
  
  var user_id = authen.curr_userid(req);  
  var err_fields = [];
  if (user_id == 0) {
    err_fields.push("User ID is Zero");
  }
  if (vac_id == 0) {
      err_fields.push("Vacation ID is Zero or Empty");
  }

  client_response.clear();
  if (err_fields.length > 0) {
      // something is missing...
      client_response.setResponse(false, false, " something is missing...", err_fields);
      res.status(400).json(client_response.getData());
      return;
  } else {      
      var ret1 = con.query(`DELETE FROM vacs_follow Where vac_id = ? AND user_id = ?`, [vac_id, user_id], function (err1, result1, fields1) {        
          if (err1) {
              console.log(err1);
              client_response.setResponse(false, true, "Delete Vacation_Follow - There Was an Error...", err1);
              res.status(500).json(client_response.getData());
              return;
          }
          if (result1.affectedRows > 0) {
            var ret2 = con.query(`UPDATE vacations vac SET vac.follow_num = vac.follow_num - 1 WHERE vac.vac_id = ? AND vac.follow_num > 0`, [vac_id], function (err2, result2, fields2) {            
              if (err2) {
                  console.log(err2);
                  client_response.setResponse(false, true, "Update Vacation - There Was an Error...", err2);
                  res.status(500).json(client_response.getData());
                  return;
              }

              if (result2.affectedRows > 0) {
                client_response.setResponse(true, false, "One Vacation Follow was Deleted...", []);
                res.status(200).json(client_response.getData());
                return;
              }              
              
              client_response.setResponse(false, false, "NO Vacation - Follow Num To UPDATE - Check Data !", []);
              res.status(400).json(client_response.getData());
              return;
            });
            // NO CODE HERE - exit after DB Callback - UPDATE            
            return;
          } 
          client_response.setResponse(false, false, "NO Vacation Follow To Delete - Check Data !", []);
          res.status(409).json(client_response.getData());
          return;
      });
      // NO CODE HERE - after DB Callback - DELETE      
  }  
});

module.exports = router;
