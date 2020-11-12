var express = require('express');
var client_response = require('../modules/client_response');
const STANDARD_ROLE = 2;

module.exports = {
    curr_userid: (reqIn) => {                               
        if (reqIn.session && reqIn.session.user_logged_in && reqIn.session.connected_user) {              
            return(reqIn.session.connected_user.user_id);
        }

        // for Debug:
        console.log("curr_userid() - reqIn.session:");
        console.log(reqIn.session);
        
        return(0);
    },
    curr_username: (reqIn) => {                                     
        if (reqIn.session && reqIn.session.user_logged_in && reqIn.session.connected_user) {              
            return(reqIn.session.connected_user.username);
        }

        // for Debug:
        console.log("curr_username() - reqIn.session:");
        console.log(reqIn.session);
        
        return("");
    },
    is_logined_reply: (reqIn, resIn, placeStr) => {                
        client_response.clear();     
        if (reqIn.session && reqIn.session.user_logged_in)
            return(true);

        // for Debug:
        console.log("is_logined_reply() - reqIn.session:");
        console.log(reqIn.session);             
        
        let msgStr = placeStr + " - Not Logined !";
        client_response.setResponse(false, false, msgStr, []);
        resIn.status(401).json(client_response.getData()); /// code 401 - Unauthorized // 403 - Forbidden      
        return(false);
    },    
    is_admin_reply: (reqIn, resIn, placeStr) => {        
        client_response.clear();        
        if (reqIn.session && reqIn.session.user_logged_in && reqIn.session.connected_user) {
            if(reqIn.session.connected_user.role > 0 && reqIn.session.connected_user.role < STANDARD_ROLE) {
              return(true);
            }
          }

        // for Debug:
        console.log("is_admin_reply() - reqIn.session:");
        console.log(reqIn.session);        

        let msgStr = placeStr + " - Not Admin !";
        client_response.setResponse(false, false, msgStr, []);
        resIn.status(403).json(client_response.getData()); /// code 401 - Unauthorized // 403 - Forbidden      
        return(false);
    }    
}