import React, { useState } from 'react';
import VacsBanner from '../VacsBanner/VacsBanner';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import { BrowserRouter as Router, Link } from "react-router-dom";

const STANDARD_ROLE = 2;
const Login = (props) =>  { 
        
    const [showMessage, setShowMessage] = useState(false); 
    const [messageOk, setMessageOk] = useState(true); 
    const [msgText, setMsgText] = useState("");

    // Way1: different hooks for input fields:    
    // ref: https://www.digitalocean.com/community/tutorials/five-ways-to-convert-react-class-components-to-functional-components-with-react-hooks
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameInput = e => {
        setUsername(e.target.value);
    }
    const handlePasswordInput = e => {
        setPassword(e.target.value);
    }    
    // Way2: common hook for multiple fields in Input Object:
    // ref: https://stackoverflow.com/questions/53519578/forms-as-functional-components-with-react
    /*
    const [inputField , setInputField] = useState({
        username: '',
        password: '',
    })
    const inputsHandler = (e) =>{
        let value = { [e.target.name]: e.target.value };
        value = {
             ...inputField,
             ...value,
        };
        setInputField(value);
     }
    */
    // Way2 - get value sample:
    // => onChange={inputsHandler}
    // value={username} =>  value={inputField.username}

    const login = () => {
        let ret = validateLogin();
        if (!ret) {           
            return;
        }
               
        fetch("/users/login", {
            method: "POST",
            body: JSON.stringify({ "username": username, "password": password }),
            // body: JSON.stringify({ "username": inputField.username, "password": inputField.password }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((res) => {                
                if (res.success) {                     
                    if (res?.data?.username) {                        
                        sessionStorage.first_name = JSON.stringify(res.data.first_name);
                    }
                    if (res.data.role > 0 && res.data.role < STANDARD_ROLE) {                        
                        props.history.push('/vacations_admin');                        
                    } else {                        
                        props.history.push('/vacations_user');                                               
                    }
                } else {    // login failed !                                                                       
                    let total_msg = res.message + " " + res.data;
                    updateStateMsg(total_msg);
                }                
            })
            .catch(error =>  { 
                let total_msg = "ERROR !! " + error.message + " " + error.data;
                updateStateMsg(total_msg);
            } );
    }

    const updateStateMsg = (newMsg) => {
        setShowMessage(true);
        setMessageOk(false);
        setMsgText(newMsg);
    }

    const validateLogin = () => {
        if (username.length < 3) {
        // if (inputField.username.length < 3) {
            updateStateMsg("Username IS EMPTY OR TOO SHORT !");
            return(false);
        }
        
        if (password.length < 4) {
        // if (inputField.password.length < 4) {
            updateStateMsg("Password IS EMPTY OR TOO SHORT !");              
            return(false);
        }               
        return(true);
    }

    const onKeyUp = (event) => {
        if (event.charCode === 13) {
            login();
        }
    }

    return (
        <div className="row border border-primary">                
            <div className="col-9 border border-dark border-left-0 border-bottom-0 border-top-0 p-1">                
                <div className="form">
                
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="username" className="col-form-label col-form-label-md">Username</label>                            
                        <input type="text" onChange={handleUsernameInput} name="username" className="form-control" placeholder="username .." value={username} />
                        {/* <input type="text" onChange={inputsHandler} name="username" className="form-control" placeholder="username .." value={inputField.username} /> */}
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="password" className="col-form-label col-form-label-md">Password</label>                            
                        <input type="password" onChange={handlePasswordInput} onKeyPress={(e) => onKeyUp(e)} name="password" className="form-control" placeholder="password .. " value={password} />
                        {/* <input type="password" onChange={inputsHandler} onKeyPress={(e) => onKeyUp(e)} name="password" className="form-control" placeholder="password .. " value={inputField.password} /> */}
                    </div>
                </div>    
                    
                    <VacsMsgs success={messageOk} show_msg={showMessage} message={msgText} />                                        
                    <div className="btn btn-primary mb-2" onClick={login}>Login</div>
                </div>
                <Link to="/register">New User? Please Register</Link>
            </div>
            
            <div className="col-3">
                <VacsBanner show_banner={true}/> 
            </div>    
        </div>           
    )    
}

export default Login;
