import React from 'react';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import { BrowserRouter as Router,  Link } from "react-router-dom";
import VacationCube from '../VacationCube/VacationCube';

class VacsAdmin extends React.Component {
    state = {
        show_message: false,
        message_ok: true,
        msg_text: "",
        vacations: [],
        user_id: 99
    }

    getVacationsAdmin() {        
        let respStatus = 0;          
        fetch('/vacations/admin')
            .then((res) => {
                respStatus = res.status;
                return res.json();
            })        
            .then((res) => {                
                if (res.success) {
                    this.setState({ vacations: res.data });                    
                } else if (respStatus === 401 || respStatus === 403) { /// not admin ! (or not logined)
                    this.props.history.push('/login'); // back to login
                } else { // some error occured ..
                    let total_msg = res.message + " " + res.data;
                    this.setState({ msg_text: total_msg, message_ok: false, show_message: true});                    
                }                
            })
            .catch((err) => {
                let err_msg = err.message + " " + err.data;
                this.setState({ msg_text: err_msg, message_ok: false, show_message: true});                    
            }); 
    }


    editVacation(vacation) {                
        this.props.history.push('/vacation_update/' + vacation.vac_id + '/'  + vacation.vac_desc + '/' + vacation.dest + '/' +  vacation.pic
             + '/' + vacation.price + '/' + vacation.date_start + '/' + vacation.date_end + '/' + vacation.follow_num);
    }

    deleteVacation(vac_id) {
            
        fetch('/vacations/', {
            method: "DELETE",
            body: JSON.stringify({vac_id: vac_id}),
            headers: {
                'Content-Type': 'application/json'                                
            }
            })
            .then((res) => {               
                return res.json();
            })            
            .then((res) => {                
                this.setState({ msg_text: res.message, message_ok: res.success, show_message: true});
                this.getVacationsAdmin();                
            })
            .catch((err) => {                
                let err_msg = "Error In Delete Vacation: " +  err;
                this.setState({ msg_text: err_msg, message_ok: false, show_message: true});                
            })
        
    }

    componentDidMount() {
        this.setState({ error: "", show_warning: false});        
        this.getVacationsAdmin();
    }

    addVacation() {        
        this.props.history.push('/vacation_update');
    }
    
    logout() {          
        this.props.mainLogout();
        // this.props.history.push('/logout');
    }

    render() {
        return (
            <div className="border border-primary p-4">
                <div className="row">

                    <div className="col-3">
                        <Link className="btn btn-primary mb-2" to="/vacation_add">Add Vacation</Link>
                    </div>
                    <div className="col-7">                            
                        <h3>Manage Vacations</h3>                        
                    </div>
                    <div className="col-2">                            
                        <Link to="/logout" className="btn btn-danger mb-2" >Logout</Link>                        
                    </div>                    
                </div>                
               
               <VacsMsgs success={this.state.message_ok} show_msg={this.state.show_message} message={this.state.msg_text} />               
               
                <div className="row">                    
                    <div className="col-12">
                                                                                                                                                                                                             
                        <div id="vacations_cubes">                                                        
                            <div className='row inner_vacs ml-1'>
                                { (this.state.vacations.length === 0) ?
                                   <h2> No Vacations Found !</h2> 
                                   :                                 
                                    this.state.vacations.map(
                                        (vacation, vindex) => {
                                            return (
                                                <div key={vindex} className="col-4 p1 mb1 border border-primary">
                                                    <VacationCube vcube={vacation} is_admin={true} user_id={this.state.user_id} is_followed={null} addFollowed={null} removeFollowed={null}
                                                      deleteVacation={(e) => this.deleteVacation(vacation.vac_id)} editVacation={(e) => this.editVacation(vacation)} />                                                       
                                                </div>
                                            )
                                        }
                                )}
                            </div>
                        </div>
                    </div>                  
                </div>
            </div>
        )
    }
}

export default VacsAdmin;
