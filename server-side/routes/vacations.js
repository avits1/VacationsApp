var express = require('express');
var router = express.Router();
var client_response = require('../modules/client_response');
var con = require('../modules/connection').getConnection();
var authen = require('../modules/authen'); /// authenticate modul - check login & admin


// GET vacations.
router.get('/', function (req, res, next) {           
    client_response.clear();   
   
    if (!authen.is_logined_reply(req,res,"Vacations List")) { // not logined !          
      return;
    }
    
    con.query("SELECT * FROM vacations vacs ", function (err, vacations_list, fields) {    
      if (err) {
          console.log(err);
          client_response.setResponse(false, true, "Vacations List - There Was an Error...", err);
          res.status(500).json(client_response.getData());
          return;
      }
      client_response.setResponse(true, false, "Vacations List", vacations_list);      
      res.status(vacations_list.length?200:204).json(client_response.getData());      
      return;
    });
  });


// GET Admin vacations.
router.get('/admin', function (req, res, next) {         
  client_response.clear();   
   
  if (!authen.is_admin_reply(req,res,"Vacations List")) { // not admin !  
    return;
  }
  con.query("SELECT * FROM vacations v ", function (err, vacations, fields) {    
    if (err) {
        console.log(err);
        client_response.setResponse(false, true, "Vacations List For Admin - There Was an Error...", err);
        res.status(500).json(client_response.getData());
        return;
    }
    client_response.setResponse(true, false, "Vacations List For Admin", vacations);
    res.status(vacations.length?200:204).json(client_response.getData());
    return;
  });
});


router.get('/:user_id', function (req, res, next) {         
  client_response.clear(); 

  if (!authen.is_logined_reply(req,res,"Vacations List By User ID / Username")) { // not logined !    
    return;
  }    

  var user_id = (req.params.user_id) ? req.params.user_id : 0;    
  var err_fields = [];   
  if (user_id == 0) {  
    err_fields.push("User Id is Zero");
  }
  if (err_fields.length > 0) {
      // something is missing...
      client_response.setResponse(false, false, " something is missing...", err_fields);
      res.status(400).json(client_response.getData());
      return;
  }

  con.query("SELECT DISTINCT * FROM vacations v INNER JOIN vacs_follow vf ON v.vac_id = vf.vac_id WHERE vf.user_id = ?", [user_id],function (err, vacations_by_user, fields) {            
      if (err) {
          console.log(err);
          client_response.setResponse(false, true, "Vacations List - There Was an Error...", err);
          res.status(500).json(client_response.getData());
          return;
      }
      client_response.setResponse(true, false, "Vacations List By User", vacations_by_user);
      res.status(vacations_by_user.length?200:204).json(client_response.getData());
      return;
  });
});


// Insert Vacation
router.post('/', (req, res, next) => {      
  var vac_desc = (req.body.vac_desc) ? req.body.vac_desc : "";
  var dest = (req.body.dest) ? req.body.dest : "";     
  var pic = (req.body.pic) ? req.body.pic : "";       
  var date_start = (req.body.date_start) ? req.body.date_start : 0;     
  var date_end = (req.body.date_end) ? req.body.date_end : 0; 
  var price = (req.body.price) ? req.body.price : 0.0;  
  var follow_num = 0;  
    
  if (!authen.is_admin_reply(req,res,"Vacations List Insert - Forbidden Access")) { // not admin !    
    return;
  }
  
  client_response.clear();
  var err_fields = [];  
  if (!vac_desc) {
    err_fields.push("Vacation Description is Empty");
  }  
  if (!dest) {    
    err_fields.push("Destination is Empty");
  }  
  if (!pic) {    
    err_fields.push("Vacation Picture (FileName) is Empty");
  }
  if (!date_start || date_start == 0  || date_start == NaN) {    
    err_fields.push("Vacation Date Start is Empty");
  }
  if (!date_end || date_end == 0 || date_end == NaN) {    
    err_fields.push("Vacation Date End is Empty");
  }
  
  var d_start = new Date(date_start);
  var d_end = new Date(date_end);
  var currDate = Date.now();
    
  // Date: toString() // toUTCString() // toDateString() 

  if (d_start < currDate) { /// Block OLD Dates !
    err_fields.push("Vecation Date Start is Wrong !");
  }  

  if (d_start >= d_end) {
    err_fields.push("Dates are mis-placed !");
  }  

  if (price <= 0) {
      err_fields.push("Vacation Price must be Positive !");
  }

  if (err_fields.length > 0) {
      // something is missing...      
      client_response.setResponse(false, false, "something is missing...", err_fields);      
      res.status(400).json(client_response.getData());      
      return;
  }

  // Enter New Vacation ...                
  con.query(`INSERT INTO vacations (vac_desc,dest,pic,date_start,date_end,price,follow_num) VALUES (?,?,?,?,?,?,?)`, [vac_desc, dest, pic, d_start, d_end, price, follow_num], function (err, result, fields) {          
    if (err) {
        console.log(err);
        client_response.setResponse(false, true, "There Was an Error Adding New Vacation To DB...", err);
        res.status(500).json(client_response.getData());
        return;
    }        
    if (result.affectedRows > 0) {
      client_response.setResponse(true, false, "New Vacation Was Added Succesfully", []);
      res.status(201).json(client_response.getData());
      return;
    }
    client_response.setResponse(false, false, "Can't Add New Vacation - Check Data !", []);
    res.status(409).json(client_response.getData()); // Status Code : 409 - Conflict
    return;
  });

});


// Delete Vacation
router.delete('/', function (req, res, next) {  
  var err_fields = [];
  var vac_id = (req.body.vac_id) ? req.body.vac_id : 0;

  if (!authen.is_admin_reply(req,res,"Vacations List Delete - Forbidden Access")) { // not admin !    
    return;
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
         con.query(`DELETE FROM vacations Where vac_id = ? `, [vac_id], function (err, result, fields) {
          if (err) {
              console.log(err);
              client_response.setResponse(false, true, "Delete Vacation - There Was an Error...", err);
              res.status(500).json(client_response.getData());
              return;
          }          
          if (result.affectedRows > 0) {
            client_response.setResponse(true, false, "One Vacation was Deleted...", []);
            res.status(200).json(client_response.getData());
            return;
          }          
          client_response.setResponse(false, false, "NO Vacation To Delete ! ", []);
          res.status(500).json(client_response.getData());
          return;
      });
  }
});


// Update Vacation
router.put('/', (req, res, next) => {  
  var vac_id = (req.body.vac_id) ? req.body.vac_id : 0;
  var vac_desc = (req.body.vac_desc) ? req.body.vac_desc : "";
  var dest = (req.body.dest) ? req.body.dest : "";     
  var pic = (req.body.pic) ? req.body.pic : "";     
  var price = (req.body.price) ? req.body.price : 0.0;  
  var date_start = (req.body.date_start) ? req.body.date_start : "";     
  var date_end = (req.body.date_end) ? req.body.date_end : "";     
  var follow_num = (req.body.follow_num) ? req.body.follow_num : 0;  

  if (!authen.is_admin_reply(req,res,"Vacations List Update - Forbidden Access")) { // not admin !    
    return;
  }

  client_response.clear();   
  var err_fields = [];
  if (vac_id == 0) {
      err_fields.push("Vacation ID NOT Selected");
  }  
  if (!vac_desc) {    
    err_fields.push("Vacation Description is Empty");
  }  
  if (!dest) {    
    err_fields.push("Destination is Empty");
  }
  if (!pic) {    
    err_fields.push("Vacation Picture (FileName) is Empty");
  }  
  if (!date_start || date_start == 0  || date_start == NaN) {    
    err_fields.push("Vacation Date Start is Empty");
  }  
  if (!date_end || date_end == 0 || date_end == NaN) {    
    err_fields.push("Vacation Date End is Empty");
  }
    
  var d_start = new Date(date_start);
  var d_end = new Date(date_end);
  var currDate = Date.now();
  // Date: toString() // toUTCString() // toDateString() 
  
  if (d_start < currDate) { // avoid history dates
    err_fields.push("Vacation Date Start is Wrong ");
  }

  if (d_start >= d_end) {
    err_fields.push("Dates are mis-placed !");
  }  

  if (price <= 0) {
      err_fields.push("Vacation Price must be Positive !");
  }

  if (err_fields.length > 0) {
      // something is missing...
      client_response.setResponse(false, false, " something is missing...", err_fields);
      res.status(400).json(client_response.getData()); // Status Code : 400 - BAD REQUEST
      return;
  }

  // Update Vacation ...       
  con.query(`UPDATE vacations SET vac_desc=?,dest=?,pic=?,date_start=?,date_end=?,price=?,follow_num=? WHERE vac_id=?`, [vac_desc, dest, pic, d_start, d_end, price, follow_num, vac_id], function (err, result, fields) {
      if (err) {
          console.log(err);
          client_response.setResponse(false, true, "There Was an Error Updating Vacation To DB...", err);
          res.status(500).json(client_response.getData());
          return;
      }
      if (result.affectedRows > 0) {
        client_response.setResponse(true, false, "Vacation was Updated Succesfully", []);
        res.status(200).json(client_response.getData());
        return;
      }
      client_response.setResponse(false, false, "NO Vacation To Update !", []);
      res.status(500).json(client_response.getData());
      return;
  });
});

module.exports = router;
