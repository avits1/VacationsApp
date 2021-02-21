import React, { useState, useEffect } from 'react';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import VacationCube from '../VacationCube/VacationCube';
import { BrowserRouter as Router, Link } from "react-router-dom";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
// const ENDPOINT = "http://www.vacationapp.com:4001";

const VacsUser = (props) =>  { 

    const [isAdmin, setIsAdmin] = useState(false);
    const [vacationUpdated, setVacationUpdated] = useState(null);
    const [vacationToDelete, setVacationToDelete] = useState(0);
    const [vacations, setVacations] = useState([]);
    const [followed, setFollowed] = useState([]);

    var vacations_temp = []; // temporary array to help sorting without mutate/render
    let followed_temp = [];// followed temp array - will not cause state render.
    var to_follow = []; // auxiliary array to store ONLY (!) vacations that are FOLLOWED,
                    //  to attach later to the begining of vacations [].

    const [showMessage, setShowMessage] = useState(false); 
    const [messageOk, setMessageOk] = useState(true); 
    const [msgText, setMsgText] = useState("");

    const updateStateMsg = (newMsg, msgOK = false) => {
        setShowMessage(true);
        setMessageOk(msgOK);
        setMsgText(newMsg);
    }

    const getVacations = () => {       
        let respStatus = 0;
        fetch('/vacations/', {'cache':'no-store'})
            .then((res1_vacs) => {
                respStatus = res1_vacs.status;
                return res1_vacs.json();
            })
            .then((res2_vacs) => {                
                if (res2_vacs.success) {
                    vacations_temp = res2_vacs.data;
                    getFollows(vacations_temp);// move as param ,not causing render
                } else if (respStatus === 401 || respStatus === 403) { /// not logined
                    props.history.push('/login'); // back to login
                } else { // some error occured ..
                    let total_msg = res2_vacs.message + " " + res2_vacs.data;
                    console.log("getVacations() - some error occured"); 
                    updateStateMsg(total_msg);
                }
            })
            .catch((err) => {               
                console.log("getVacations() - catch(err) -  error occured");
                let err_msg = err.message + " " + err.data;
                updateStateMsg(err_msg);
            });           
    }

    const getFollows = (vacs_temp) => {        
        let respStatus = 0;
        fetch('/vacs_follow/', {'cache':'no-store'})
            .then((res1_follow) => {                
                respStatus = res1_follow.status;                
                if (respStatus === 204) {
                    res1_follow.data = [];
                    followed_temp = [];
                    return(res1_follow);
                }                
                return(res1_follow.json());
            })       
            .then((res2_follow) => {                                              
                if (res2_follow.success) {
                    followed_temp = res2_follow.data;
                    let len  = followed_temp.length;
                    sortVacations(vacs_temp, followed_temp);
                } else {                     
                    updateStateMsg(res2_follow.message);
                }
            })
            .catch(error =>  {                                               
                let errMsg = "ERROR In Get Follow: " + error.message;
                updateStateMsg(errMsg);
            } );
    }

    const sortVacations = (vacs_temp, followed_temp) => {                
        to_follow = [];                
        if (followed_temp.length === 0 || followed_temp.length === vacations.length) {            
            return; // DON'T CHANGE Vacations Data!
        } 
        // else, do sort:
        followed_temp.map(
            (follower, findex) => {                
                vacationToFollow(vacs_temp, follower);                
                return(true);
            });
        
        // push to vacations array head:    
        let newVacations = [...to_follow, ...vacs_temp];
        setFollowed(followed_temp); // for loop on render stage
        setVacations(newVacations);
    }

    const vacationToFollow = (vacs_temp, follower) => {        
        for (let idx = 0; idx < vacs_temp.length ; idx++) {
            let vacationCurrent = vacs_temp[idx];            
            if(vacationCurrent.vac_id === follower.vac_id) {
                vacs_temp.splice(idx, 1);
                to_follow.push(vacationCurrent);
                break;                
            }
        }
    }

    const isFollowed = (vacID) => {
        for (let vacationFollow of followed) {
            if(vacationFollow.vac_id === vacID) {                
                return(true);
            }                
        }                  
        return(false);
    }


    const addFollowed = (vac_id) => {                
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
                    getVacations();                    
                } else {
                    updateStateMsg(res2.message);
                }                
            })
            .catch(error =>  {
                let errMsg = "ERROR In Add Follow: " + error.message;
                updateStateMsg(errMsg);
            } );
    }
 
 const removeFollowed = (vac_id) => {            
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
                getVacations();
            } else {                
                updateStateMsg(res2.message);
            }                
        })
        .catch(error =>  {
            let errMsg = "ERROR In Delete Follow: " + error.message;
            updateStateMsg(errMsg);
        } );      
    }
    
    useEffect(() => {
        setShowMessage(false); setMessageOk(true); setMsgText("");
        const socket = socketIOClient(ENDPOINT);
        socket.on("VacationUpdate", updated => {
            setVacationUpdated(JSON.parse(updated));
            updateVaction(vacationUpdated);
         });
         socket.on("VacationDel", deleted => {
            setVacationToDelete(deleted);
            delVaction(vacationToDelete);
         });
        adminCheck();
        getVacations();
        return () => closeSocket(socket); // => this func. cleans up the effect, like componentWillUnmount()
    }, []);

    const closeSocket = (socket) => {
        socket.disconnect();
        setVacationUpdated(null);
        setVacationToDelete(0);
    }

    const adminCheck = () => {
        let respStatus = 0;          
        fetch('/users/admin_logined')
            .then((res) => {
                respStatus = res.status;
                return res.json();
            })        
            .then((res) => {                
                if (res.success) {
                    setIsAdmin(true);
                    return;
                }
            })
            .catch((err) => {
                let errMsg = err.message + " " + err.data;
                updateStateMsg(errMsg);
            }); 
    }


    const updateVaction = (updated) => { // update vacation in array or add new one.        
        let indxUpd = vacations.findIndex(x => x.vac_id === updated.vac_id);
        vacations_temp = vacations;
        if (indxUpd >= 0) {
            vacations_temp[indxUpd] = updated; // Replace on temp array ..
            setVacations(vacations_temp);            
        } else {
            setVacations(...vacations, updated); // OR: add directly
        }
    }

    const delVaction = (deleted) => { // remove vacation from the array
        let indxDel = vacations.findIndex(x => x.vac_id === deleted);
        vacations_temp = vacations;
        if (indxDel >= 0) {
            vacations_temp.splice(indxDel, 1);
            setVacations(vacations_temp);
        }
    }

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
                    <Link to="/vacations_admin" className={(isAdmin) ? "btn btn-success mb-2 " : "d-none btn btn-success mb-2"} >Manage</Link>
                </div>
                <div className="col-2">
                    <Link to="/logout" className="btn btn-danger mb-2" >Logout</Link>
                </div>
            </div>

            <VacsMsgs success={messageOk} show_msg={showMessage} message={msgText} />
            <div className="row">                
                <div className="col-12">
                                                                                                                                                                        
                    <div id="vacations_cubes">
                        <div className='row inner_vacs'>
                            {
                                (vacations.length === 0) ? (
                                <div>
                                    <h2> No Vacations Found !</h2> 
                                </div>
                                ) :
                                 (vacations.map((vacation, vindex) => {
                                        let isfollowed = isFollowed(vacation.vac_id);                                            
                                        return (   
                                            <div key={vindex} className="col-4 p1 mb1 border border-primary">                                                                                                      
                                                <VacationCube vcube={vacation} userIsAdmin={false} is_followed={isfollowed}
                                                    deleteVacation={null} addFollowed={() => addFollowed(vacation.vac_id)} removeFollowed={() => removeFollowed(vacation.vac_id)} />
                                            </div>
                                        )
                                    }
                                ))
                                }
                        </div>
                        </div>
                </div>                  
            </div>
        </div>
    )
}

export default VacsUser;
