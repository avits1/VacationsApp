import React from 'react';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import { BrowserRouter as Router,  Link } from "react-router-dom";
import VacationCube from '../VacationCube/VacationCube';
import VacationPopup from '../VacationPopup/VacationPopup'

class VacsAdmin extends React.Component {
    state = {
        show_message: false,
        message_ok: true,
        msg_text: "",
        vacations: [],
        modalOpen: false,
        user_id: 0
    }

    curr_date = Date.now(); 
    vacation_edit =  {
        vac_id: 0,
        vac_desc: "",
        dest: "",       
        pic: "",            
        date_start: this.curr_date,             
        date_end: this.curr_date,
        price: 0.0,
        follow_num: 0
    }
    
    getVacationsAdmin = () => {        
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
    
    componentDidMount = () => {
        this.setState({ msg_text: "", show_message: false, message_ok: true});        
        this.getVacationsAdmin();
    }
    
    // to open or close Modal Wrapper Component based on reactjs-popup lib.
    handleModalOpen = (clearOnClose=false, refresh=false) => {
        this.setState({ modalOpen: !this.state.modalOpen });
        if (clearOnClose) {
            this.clearVacation();
        }
        if (refresh) {
            this.componentDidMount();
        }
    }

    clearVacation = () => {
        this.vacation_edit.vac_id = 0; 
        this.vacation_edit.vac_desc = "";
        this.vacation_edit.dest = "";
        this.vacation_edit.pic = "";
        this.vacation_edit.price = 0.0;
        this.vacation_edit.date_start = this.curr_date;
        this.vacation_edit.date_end = this.curr_date;
        this.vacation_edit.follow_num = 0;  
    }
   
    editVacation = (vacation) => { // pop-up with vacation datails:
        this.vacation_edit.vac_id = vacation.vac_id;
        this.vacation_edit.vac_desc = vacation.vac_desc;
        this.vacation_edit.dest = vacation.dest;
        this.vacation_edit.pic = vacation.pic;
        this.vacation_edit.price = vacation.price;
        this.vacation_edit.date_start = vacation.date_start;
        this.vacation_edit.date_end = vacation.date_end;
        this.vacation_edit.follow_num = vacation.follow_num;

        this.handleModalOpen();            
    }
          
    addVacation = () => {  // use JS Arrow Function for *this* in the right context (!!) 
        this.clearVacation();
        this.handleModalOpen();       
    }
    
    deleteVacation = (vac_id) => {
            
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

    logout = () => {          
        this.props.mainLogout();
        // this.props.history.push('/logout');
    }

    render() {       
        return (
            <div className="border border-primary p-4">

                <VacationPopup modalOpen={this.state.modalOpen} vacation_obj={this.vacation_edit} handleModalOpen={this.handleModalOpen} />
                <div className="row">

                    <div className="col-4">
                        <div className="btn btn-primary mb-2 mr-2" onClick={this.addVacation}>Add Vacation</div>
                        <Link to="/vacations_user" className="btn btn-success mb-2 mr-2" >Tag Vacation</Link>
                    </div>
                    <div className="col-4">                            
                        <h3>Manage Vacations</h3>                        
                    </div>
                    <div className="col-4">
                        <Link to="/vacations_report" className="btn btn-info mb-2 mr-2" >Report</Link>
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
