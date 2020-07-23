import React from 'react';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import { BrowserRouter as Router, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";// local installed => npm i 


class VacationUpdate extends React.Component {

    
    constructor(props) {
        super(props);
        
        if (this.props?.match?.params) {
            this.state.inner_vacation.vac_id = this.props.match.params.vac_id;
            this.state.inner_vacation.vac_desc = this.props.match.params.vac_desc;
            this.state.inner_vacation.dest = this.props.match.params.dest;
            this.state.inner_vacation.pic = this.props.match.params.pic;
            // new Date(..).getTime()  / Number(new Date(..))
            this.state.inner_vacation.date_start = new Date(this.props.match.params.date_start).getTime();
            this.state.inner_vacation.date_end = new Date(this.props.match.params.date_end).getTime();
            this.state.inner_vacation.price = this.props.match.params.price;
            this.state.inner_vacation.follow_num = this.props.match.params.follow_num;
            if (this.state.inner_vacation.vac_id > 0) {
                this.state.in_update = true;
            } else {
                this.state.in_update = false;
            }

        }
        
    }
    
    curr_date = Date.now();        
    state = {
        show_message: false,
        message_ok: true,
        msg_text: "",        
        inner_vacation: {
            vac_id: 0,
            vac_desc: "",
            dest: "",       
            pic: "",            
            date_start: this.curr_date,             
            date_end: this.curr_date,
            price: 0,
            follow_num: 0
        },        
        in_update: false
    }

    updateStateMsg(newMsg) {
        this.setState({
            show_message: true,
            message_ok: false,
            msg_text: newMsg
        })    
    }

    validateUpdate() {                
        if (!this.state.inner_vacation.vac_desc || this.state.inner_vacation.vac_desc === undefined) {
            this.updateStateMsg("Vacation Description IS EMPTY !");
            return(false);
        }
        
        if (!this.state.inner_vacation.dest || this.state.inner_vacation.dest === undefined) {
            this.updateStateMsg("Vacation Destination IS EMPTY !");
            return(false);
        }

        if (!this.state.inner_vacation.pic || this.state.inner_vacation.pic === undefined) {
            this.updateStateMsg("Picture Path / Filename IS EMPTY !");
             return(false);
         }
                
        if (!this.state.inner_vacation.date_start || this.state.inner_vacation.date_start === 0
                || this.state.inner_vacation.date_start === undefined || this.state.inner_vacation.date_start === NaN) {
            this.updateStateMsg("Date of Start IS EMPTY !");
            return(false);
        }
        
        if (!this.state.inner_vacation.date_end || this.state.inner_vacation.date_end === 0
                || this.state.inner_vacation.date_end === undefined || this.state.inner_vacation.date_end === NaN) {
            this.updateStateMsg("Date of End IS EMPTY !");
            return(false);
        }
        
        let curr_date =  new Date();
        if (this.state.inner_vacation.date_start < curr_date 
            || this.state.inner_vacation.date_start >= this.state.inner_vacation.date_end) {
            this.updateStateMsg("Dates Are Wrong !");                
            return(false);
        }        

        if (!this.state.inner_vacation.price || this.state.inner_vacation.price === undefined
            || this.state.inner_vacation.price === 0.0 || this.state.inner_vacation.price <= 0) {        
            this.updateStateMsg("Price Must Be POSITIVE !");                
            return(false);
        }
               
        return(true);
    }

    addVacation() {
        // in_update == false;
        let ret = this.validateUpdate();
        if (!ret) {
            console.log("addVacation() - Validate Update failed !");            
            return;
        }
                
        fetch("/vacations/", {
            method: "POST", 
            body: JSON.stringify(this.state.inner_vacation),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res1) => {                                                
                return res1.json()
            })
            .then((res2) => {                                          
                if (res2.success) {                     
                    this.clear_form();
                    this.props.history.push('/vacations_admin'); // OR pop up close ..                                       
                }
                else {
                    let total_msg = res2.message + " " + res2.data;
                    console.log(total_msg);
                    this.setState({ msg_text: total_msg, message_ok: false, show_message: true});
                }                
            })
            .catch(error =>  {
                let total_msg = error.message + " " + error.data;
                console.log(total_msg);
                this.setState({msg_text: "ERROR !! " + total_msg, message_ok: false, show_message: true});
            } );
    }

    update_vacation() {
        this.setState({}); // save both date picker (!)
        let ret = this.validateUpdate();
        if (!ret) {
            console.log("update_vacation() - Validate Update failed !");            
            return;
        }
                
        fetch("/vacations", {            
            method: "PUT",
            body: JSON.stringify(this.state.inner_vacation),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res1) => {                                                
                return res1.json()
            })
            .then((res2) => {                                          
                if (res2.success) {                    
                    this.clear_form();
                    this.props.history.push('/vacations_admin'); // OR pop up close ..                                       
                }
                else {
                    let total_msg = res2.message + " " + res2.data;
                    console.log(total_msg);
                    this.setState({ msg_text: total_msg, message_ok: false, show_message: true});
                }                
            })
            .catch(error =>  {
                let total_msg = error.message + " " + error.data;
                console.log(total_msg);
                this.setState({msg_text: "ERROR !! " + total_msg, message_ok: false, show_message: true});
            } );            
    }


    componentDidMount() {
        // TODO:  for update as Routed Component - add admin check && redirect        
    }

    handleChange(event) {        
        this.state.inner_vacation[event.target.name] = event.target.value;
        this.setState({});        
    }

    picSelect(event) {           
        this.state.inner_vacation["pic"] = event.target.files[0].name;
        this.setState({});
    }

    clear_form() {
        this.setState(prevState => ({
            show_message: false,
            message_ok: true,
            msg_text: "",
            inner_vacation: {
                vac_id: prevState.inner_vacation.vac_id,
                vac_desc: "",
                dest: "",
                pic: "",
                date_start: this.curr_date,
                date_end: this.curr_date,
                price: 0.0,
                follow_num: prevState.inner_vacation.follow_num
            },
            in_update: prevState.in_update
        }) );        
    }

    setDateStart(dateStart) {
        if (!dateStart) {
            this.state.inner_vacation["date_start"] = null;
            return;
        }
        dateStart.setHours(dateStart.getHours() + 3);
        this.state.inner_vacation["date_start"] = dateStart;
        this.setState({});
    }

    setDateEnd(dateEnd) {
        if (!dateEnd) {
            this.state.inner_vacation["date_end"] = null;
            return;
        }
        dateEnd.setHours(dateEnd.getHours() + 3);
        this.state.inner_vacation["date_end"] = dateEnd;
        this.setState({});
    }

    render() {

        return (
            <div className="row">
                <div className="col-12 border border-success p-1">              
                    <div className="form">
                        <h3>Add/Update Vacation</h3>
                        
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="dest" className="col-form-label col-form-label-md">Destination</label>
                                <input type="text"  id="dest" name="dest" onChange={(e) => this.handleChange(e)}  className="form-control" placeholder="Destination.." value={this.state.inner_vacation.dest} />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="vac_desc" className="col-form-label col-form-label-md">Description</label>
                                <input type="text" id="vac_desc" name="vac_desc" onChange={(e) => this.handleChange(e)}  className="form-control" placeholder="Description.." value={this.state.inner_vacation.vac_desc} /> 
                            </div>        
                        </div>  

                        <div className="form-row">

                            <div className="form-group col-md-6">
                                <label htmlFor="pic" className="col-form-label col-form-label-md">Picture Link</label>
                                <input type="file" id="pic" onChange={(e) => this.picSelect(e)} name="pic" className="form-control" placeholder="Picture Link.."  />                                 
                            </div>
                            
                            <div className="form-group col-md-3">
                                <label htmlFor="date-start" className="col-form-label col-form-label-md">Date Start</label>
                                <DatePicker locale="en-US" name="date_start" dateFormat="dd/MM/yyyy"                                                                                 
                                   selected={this.state.inner_vacation.date_start}                                          
                                   onChange={date1 => this.setDateStart(date1)} />
                            </div>
                            
                            <div className="form-group col-md-3">
                                <label htmlFor="date-end" className="col-form-label col-form-label-md">Date End</label>
                                <DatePicker locale="en-US" name="date_end" dateFormat="dd/MM/yyyy"                                                                             
                                    selected={this.state.inner_vacation.date_end}                                          
                                    onChange={date2 => { this.setDateEnd(date2)}} />                                     
                            </div> 

                        </div>
                        
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="price" className="col-form-label col-form-label-md">Price</label>
                                <input type="number" id="price" onChange={(e) => this.handleChange(e)} name="price" className="form-control" placeholder="Price .." value={this.state.inner_vacation.price} />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="follow_num" className="col-form-label col-form-label-md">Follow Number</label>
                                <input type="number" id="follow_num" readOnly name="follow_num" className="form-control"  value={this.state.inner_vacation.follow_num} />
                            </div>
                        </div>                        
                                                
                        <VacsMsgs success={this.state.message_ok} show_msg={this.state.show_message} message={this.state.msg_text} />                                                                                        
                        <div className={(this.state.in_update) ? "d-none btn btn-primary mb-2 mr-2" : "btn btn-primary mb-2 mr-2"} 
                                onClick={ (e) => this.addVacation(e)}>Add Vacation</div>
                        <div className={(this.state.in_update) ? "btn btn-success mb-2 mr-2" : "d-none btn btn-success mb-2 mr-2"} 
                                onClick={ (e) => this.update_vacation(e)}>Edit Vacation</div>
                        <div className="btn btn-danger mb-2" onClick={ (e) => this.clear_form(e)}>Clear Form</div>                                            
                    </div>
                    <Link to="/vacations_admin" >Back To Manage Vacations</Link>
                </div>                  
            </div>            
        )
    }
}

export default VacationUpdate;