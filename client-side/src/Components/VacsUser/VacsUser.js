import React  from 'react';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import VacationCube from '../VacationCube/VacationCube';
import { BrowserRouter as Router, Link } from "react-router-dom";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
// const ENDPOINT = "http://www.vacationapp.com:4001";

class VacsUser extends React.Component {
    state = {
        show_message: false,
        message_ok: true,
        msg_text: "",
        is_admin: false,
        vacationUpdated: null,
        vacationToDelete: 0,        
        vacations: [], // user vacations
        followed: [] // followed data from vacs_follow table (for Current User !), As: 'vac_id': <vacation id followed>
    }

    to_follow = []; // auxiliary array to store ONLY (!) vacations that are FOLLOWED,
                    //  to attach later to the begining of vacations [].

    socket = null;

    getVacations() {       
        let respStatus = 0;
        fetch('/vacations/', {'cache':'no-store'})
            .then((res1_vacs) => {
                respStatus = res1_vacs.status;                
                return res1_vacs.json();
            })
            .then((res2_vacs) => {                
                if (res2_vacs.success) {                    
                    this.state.vacations = res2_vacs.data;                    
                    this.getFollows();
                } else if (respStatus === 401 || respStatus === 403) { /// not logined
                    this.props.history.push('/login'); // back to login
                } else { // some error occured ..
                    let total_msg = res2_vacs.message + " " + res2_vacs.data;
                    console.log("getVacations() - some error occured"); 
                    this.setState({ msg_text: total_msg, message_ok: false, show_message: true});                    
                }
            })
            .catch((err) => {               
                console.log("getVacations() - catch(err) -  error occured");
                let err_msg = err.message + " " + err.data;
                this.setState({ msg_text: err_msg, message_ok: false, show_message: true});                    
            });           
    }

    getFollows() {        
        let respStatus = 0;
        fetch('/vacs_follow/', {'cache':'no-store'})
            .then((res1_follow) => {                
                respStatus = res1_follow.status;                
                if (respStatus === 204) {
                    res1_follow.data = [];
                    this.state.followed = [];
                    return(res1_follow);
                }                
                return(res1_follow.json());
            })       
            .then((res2_follow) => {                                              
                if (res2_follow.success) {                                                            
                    this.state.followed = res2_follow.data;                    
                    this.sortVacations();
                    this.setState({});                    
                } else {                     
                    this.setState({});
                    this.setState({ msg_text: res2_follow.message, message_ok: false, show_message: true});                    
                }
            })
            .catch(error =>  {                                               
                let errMsg = "ERROR In Get Follow: " + error.message;
                this.setState({msg_text: errMsg, message_ok: false, show_message: true});
            } );
    }
    
    sortVacations() {                
        this.to_follow = [];                
        if (this.state.followed.length === 0 || this.state.followed.length === this.state.vacations.length) {            
            return; // DON'T CHANGE Vacations Data!
        } 
        // else, do sort:                
        this.state.followed.map(
            (follower, findex) => {                
                this.vacationToFollow(follower);                
                return(true);
            });        
        // push to vacations array head:    
        this.to_follow.map( (vac_followed) => {
            this.state.vacations.unshift(vac_followed);
            return(true);
        });
    }

    vacationToFollow(follower) {        
        for (let idx = 0; idx < this.state.vacations.length ; idx++) {
            let vacationCurrent = this.state.vacations[idx];            
            if(vacationCurrent.vac_id === follower.vac_id) {                                                
                this.state.vacations.splice(idx, 1);                
                this.to_follow.push(vacationCurrent);                
                break;                
            }
        }
    }

    isFollowed(vacID) {               
        for (let vacationFollow of this.state.followed) {
            if(vacationFollow.vac_id === vacID) {                
                return(true);
            }                
        }                  
        return(false);
    }


    addFollowed(vac_id) {                
        fetch("/vacs_follow/", {
            method: "POST",
            body: JSON.stringify({vac_id: vac_id}),
            headers: {
                'Content-Type': 'application/json'
                }
            })
            .then((res1) => {                                
                return res1.json();
            })       
            .then((res2) => {                                          
                if (res2.success) {                    
                    this.getVacations();                    
                } else {
                    this.setState({ msg_text: res2.message, message_ok: false, show_message: true});
                }                
            })
            .catch(error =>  {                
                this.setState({msg_text: "ERROR In Add Follow: " + error.message, message_ok: false, show_message: true});
            } );
    }
 
 removeFollowed(vac_id) {            
    fetch('/vacs_follow/', {
        method: "DELETE",
        body: JSON.stringify({vac_id: vac_id}),
        headers: {
            'Content-Type': 'application/json'                            
            }
        })
        .then((res1) => {                        
            return res1.json();
        })  
        .then((res2) => {                                      
            if (res2.success) {                                    
                this.getVacations();
            } else {                
                this.setState({ msg_text: res2.message, message_ok: false, show_message: true});
            }                
        })
        .catch(error =>  {            
            this.setState({msg_text: "ERROR In Delete Follow: " + error.message, message_ok: false, show_message: true});
        } );      
    }

    componentDidMount() {
        this.setState({ error: "", show_warning: false});        
        this.socket = socketIOClient(ENDPOINT);
        this.socket.on("VacationUpdate", updated => {
            this.setState({vacationUpdated: JSON.parse(updated)});
            this.updateVaction(this.state.vacationUpdated);
         });
         this.socket.on("VacationDel", deleted => {
            this.setState({vacationToDelete: deleted});
            this.delVaction(this.state.vacationToDelete);
         });
        this.adminCheck();
        this.getVacations();                                         
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.setState({vacationUpdated: null});
        this.setState({vacationToDelete: 0});
        this.socket = null;
    }
    
    adminCheck() {
        let respStatus = 0;          
        fetch('/users/admin_logined')
            .then((res) => {
                respStatus = res.status;
                return res.json();
            })        
            .then((res) => {                
                if (res.success) {
                    this.setState({is_admin: true});
                    // this.state.is_admin = true;
                    return;
                }
                // } else if (respStatus === 401 || respStatus === 403) { /// not admin ! (or not logined)
                //     this.props.history.push('/login'); // back to login
                // } else { // some error occured ..
                //     let total_msg = res.message + " " + res.data;
                //     this.setState({ msg_text: total_msg, message_ok: false, show_message: true});                    
                // }                
            })
            .catch((err) => {
                let err_msg = err.message + " " + err.data;
                this.setState({ msg_text: err_msg, message_ok: false, show_message: true});                    
            }); 
    }


    updateVaction(updated) { // update vacation in array or add new one.        
        let indxUpd = this.state.vacations.findIndex(x => x.vac_id === updated.vac_id);
        if (indxUpd >= 0) {
            this.state.vacations[indxUpd] = updated;
        } else {
            this.state.vacations.push(updated);            
        }
        this.setState({});
    }

    delVaction(deleted) { // remove vacation from the array
        let indxDel = this.state.vacations.findIndex(x => x.vac_id === deleted);
        if (indxDel >= 0) {
            this.state.vacations.splice(indxDel, 1);
            this.setState({});
        }
    }

    render() {

        return (
            <div className="border border-success p-4">
                <div className="row"> 
                    <div className="col-2">
                        {/* badge-info badge-primary badge-secondary */}
                        {(sessionStorage.first_name) ? <h3> <span className="badge badge-secondary">Hello {JSON.parse( sessionStorage.first_name)}</span> </h3> : null}                        
                    </div>
                    <div className="col-6">                        
                    </div>
                    <div className="col-2">
                        <Link to="/vacations_admin" className={(this.state.is_admin) ? "btn btn-success mb-2 " : "d-none btn btn-success mb-2"} >Manage</Link>
                    </div>
                    <div className="col-2">
                        <Link to="/logout" className="btn btn-danger mb-2" >Logout</Link>
                    </div>
                </div>
                               
               <VacsMsgs success={this.state.message_ok} show_msg={this.state.show_message} message={this.state.msg_text} />                              
                <div className="row">                
                    <div className="col-12">
                                                                                                                                                                          
                        <div id="vacations_cubes">
                            <div className='row inner_vacs'>
                                { (this.state.vacations.length === 0) ?
                                   <h2> No Vacations Found !</h2> 
                                   : 
                                    this.state.vacations.map(
                                        (vacation, vindex) => {
                                            let followed = this.isFollowed(vacation.vac_id);                                            
                                            return (                                                
                                                <div key={vindex} className="col-4 p1 mb1 border border-primary">                                                                                                      
                                                    <VacationCube vcube={vacation} is_admin={false} is_followed={followed}
                                                       deleteVacation={null} addFollowed={(e) => this.addFollowed(e, vacation.vac_id)} removeFollowed={(e) => this.removeFollowed(e, vacation.vac_id)} />
                                                </div>
                                            )}
                                    )}
                            </div>
                            </div>
                    </div>                  
                </div>
            </div>
        )
    }
}

export default VacsUser;
