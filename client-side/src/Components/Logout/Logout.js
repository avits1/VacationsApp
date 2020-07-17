
import React from 'react';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BrowserRouter as Link } from "react-router-dom";

class Logout extends React.Component {


   state = {
        show_message: false,
        message_ok: true,
        msg_text: "",
        first_name: "user"
   }
    
   componentDidMount() {
    this.setState({show_message: true, message_ok: true, msg_text: "Loggin Out .."});            
    if (sessionStorage && sessionStorage.first_name) {
        this.state.first_name = JSON.parse(sessionStorage.first_name);
    }    
    this.logout();
   }

   logout() {                      

    fetch("/users/logout", {
        method: "POST",                   
        body: JSON.stringify({ "username": this.state.first_name}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then((res) => {                                             
            if (res.success) {                                        
                sessionStorage.first_name = null;
                this.props.history.push('/');                                                                   
            } else {    // logout failed !                                                                       
                this.setState({ msg_text: res.message, message_ok: false, show_message: true});
            }                
        })
        .catch(error =>  {               
            this.setState({msg_text: "LOGOUT ERROR !! " + error.message, message_ok: false, show_message: true});
        } );
        
    }

    render() {
        return (
            <div className="border border-info p-4">
                <h1> Logout </h1>
                <VacsMsgs success={this.state.message_ok} show_msg={this.state.show_message} message={this.state.msg_text} />
                <div className="btn btn-danger mr-2" onClick={this.logout.bind(this)}>Logout</div>
                <Link to="/login" className="btn btn-primary" >Want To Login Again? Press Here</Link>                
            </div>
        )
    }
}

export default Logout;
