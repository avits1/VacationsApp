
import React from 'react';
import VacsBanner from '../VacsBanner/VacsBanner';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import { BrowserRouter as Router, Link } from "react-router-dom";

const STANDARD_ROLE = 2;
class Login extends React.Component {

    state = {
        show_message: false,
        message_ok: true,
        msg_text: "",
        username: "",
        password: ""
    }

    login() {
        let ret = this.validateLogin();
        if (!ret) {           
            return;
        }
               
        fetch("/users/login", {
            method: "POST",
            body: JSON.stringify({ "username": this.state.username, "password": this.state.password }),
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
                        this.props.history.push('/vacations_admin');                        
                    } else {                        
                        this.props.history.push('/vacations_user');                                               
                    }
                } else {    // login failed !                                                                       
                    let total_msg = res.message + " " + res.data;
                    this.setState({ msg_text: total_msg, message_ok: false, show_message: true});
                }                
            })
            .catch(error =>  { 
                let total_msg = error.message + " " + error.data;              
                this.setState({msg_text: "ERROR !! " + total_msg, message_ok: false, show_message: true});
            } );
    }
    
    updateStateMsg(newMsg) {
        this.setState({
            show_message: true,
            message_ok: false,
            msg_text: newMsg
        })    
    }

    validateLogin() {                          
        if (this.state.username.length < 3) {
            this.updateStateMsg("Username IS EMPTY OR TOO SHORT !");
            return(false);
        }
        
        if (this.state.password.length < 4) {
            this.updateStateMsg("Password IS EMPTY OR TOO SHORT !");              
            return(false);
        }               
        return(true);
    }

    onKeyUp(event) {
        if (event.charCode === 13) {
            this.login();
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <div className="row border border-primary">                
                <div className="col-9 border border-dark border-left-0 border-bottom-0 border-top-0 p-1">                
                    <div className="form">
                    
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="username" className="col-form-label col-form-label-md">Username</label>                            
                            <input type="text" onChange={(e) => this.handleChange(e)} name="username" className="form-control" placeholder="username .." value={this.state.username} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="password" className="col-form-label col-form-label-md">Password</label>                            
                            <input type="password" onChange={(e) => this.handleChange(e)} onKeyPress={this.onKeyUp.bind(this)} name="password" className="form-control" placeholder="password .. " value={this.state.password} />
                        </div>
                    </div>    
                        
                        <VacsMsgs success={this.state.message_ok} show_msg={this.state.show_message} message={this.state.msg_text} />                                        
                        <div className="btn btn-primary mb-2" onClick={this.login.bind(this)}>Login</div>
                    </div>
                    <Link to="/register">New User? Please Register</Link>
                </div>
                
                <div className="col-3">
                    <VacsBanner show_banner={true}/> 
                </div>    
            </div>           
        )
    }
}

export default Login;
