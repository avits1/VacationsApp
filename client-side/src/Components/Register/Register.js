import React from 'react';
import VacsBanner from '../VacsBanner/VacsBanner';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import { BrowserRouter as Router, Link } from "react-router-dom";

class Register extends React.Component {

    state = {
        show_message: false,
        message_ok: true,
        msg_text: "",
        // user_unique: false,
        first_name: "",
        last_name: "",
        username: "",
        password: ""
        // email: ""        
    }

    updateStateMsg(newMsg) {
        this.setState({
            show_message: true,
            message_ok: false,
            msg_text: newMsg
        })    
    }

    validateForm() {               
        if (!this.state.first_name) {
            this.updateStateMsg("First Name IS EMPTY !");
            return(false);
        }        
        if (!this.state.last_name) {            
            this.updateStateMsg("Last Name IS EMPTY !");                     
            return(false);
        }

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

    register() {               
        let ret = this.validateForm();
        if (!ret) {          
            return;
        }
      
        fetch("/users/register", {
            method: "POST",
            body: JSON.stringify({ "first_name": this.state.first_name, "last_name": this.state.last_name,
                                "username": this.state.username, "password": this.state.password }), //  , "email": this.state.email                               
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {                                
                return res.json()
            })
            .then((res) => {                          
                if (res.success) {                    
                    if (res.data) {                        
                        sessionStorage.first_name = JSON.stringify(res.data);
                    }                                        
                    this.props.history.push('/vacations_user');
                } else {
                    let total_msg = res.message + " " + res.data;
                    this.setState({ msg_text: total_msg, message_ok: false, show_message: true});
                }                
            })
            .catch(error =>  {                               
                let total_msg = error.message + " " + error.data;
                this.setState({msg_text: "ERROR !! " + total_msg, message_ok: false, show_message: true});
            } );

            
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    clear_form() {
        this.setState({
            show_message: false,
            message_ok: true,
            msg_text: "",
            first_name: "",
            last_name: "",
            username: "",
            password: ""
            // email: ""
        });        
    }

    render() {
        return (
            <div className="row border border-success">                
                <div className="col-9 border border-dark border-left-0 border-bottom-0 border-top-0 p-1">              
                    <div className="form">                        
                        <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="first_name" className="col-form-label col-form-label-md">First Name</label>
                            <input type="text" id="first_name" onChange={this.handleChange.bind(this)} name="first_name" className="form-control" placeholder="first name.." value={this.state.first_name} />                    </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="last_name" className="col-form-label col-form-label-md">Last Name</label>
                            <input type="text"  id="last_name" onChange={(e) => this.handleChange(e)} name="last_name" className="form-control" placeholder="last name.." value={this.state.last_name} />
                        </div>        
                        </div>  

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="username" className="col-form-label col-form-label-md">Username</label>
                                <input type="text" id="username" onChange={(e) => this.handleChange(e)} name="username" className="form-control" placeholder="username" value={this.state.username} />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="password" className="col-form-label col-form-label-md">Password</label>
                                <input type="password" id="password" onChange={(e) => this.handleChange(e)} name="password" className="form-control" placeholder="password" value={this.state.password} />
                            </div>
                        </div>                        
                        
                        {/* <div className="form-group">
                            <label>Email</label>
                            <input type="email" onChange={this.handleChange.bind(this)} name="email" className="form-control" placeholder="email" value={this.state.email} />
                        </div> */}
                        <VacsMsgs success={this.state.message_ok} show_msg={this.state.show_message} message={this.state.msg_text} />                                        
                        <div className="btn btn-success mb-2 mr-2" onClick={(e) => this.register(e)}>Register And View</div>                    
                        <div className="btn btn-danger mb-2" onClick={(e) => this.clear_form(e)}>Clear Form</div>                                            
                    </div>
                    <Link to="/login" >Already Registerd? Login Here</Link>
                </div>
                
                <div className="col-3">                  
                    <VacsBanner show_banner={true}/> 
                </div>    
            </div>            
        )
    }
}

export default Register;