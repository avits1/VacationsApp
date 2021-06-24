import React, { useState, useEffect  } from 'react';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";// local installed => npm i 
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './VacationPopup.css';

  // PopUp Stuff:
  // {...{ modal, closeOnDocumentClick, contentStyle, overlayStyle, arrowStyle }}
  // CSS classes: popup-content, popup-overlay, popup-arrow
  // close the popup: closeOnDocumentClick, closeOnEscape          

  const VacationPopup = (props) =>  { 

    const adjustDates = (vacObj)  => {
        let newVacObj = vacObj;
        if (newVacObj.vac_id > 0) {
            newVacObj.date_start = new Date(newVacObj.date_start).getTime();
            newVacObj.date_end = new Date(newVacObj.date_end).getTime();
        }
        return newVacObj;
    }

    const [opened, toggleModal] = useState(props.modalOpen); // false as default
    // adjust dates before initial vacation Object is set ..
    const [vacationInner, setVacation] = useState(adjustDates(props.vacation_obj)); 

    const [showMessage, setShowMessage] = useState(false); 
    const [messageOk, setMessageOk] = useState(true); 
    const [msgText, setMsgText] = useState(""); 

    // To read about Updating Component State from props:
    // https://www.robinwieruch.de/react-derive-state-props
    // https://stackoverflow.com/questions/55299298/react-functional-component-props-changed-getderivedstatefromprops    

    useEffect(() => {
        toggleModal(props.modalOpen);
        setVacation(adjustDates(props.vacation_obj));
    }, [props.modalOpen, props.vacation_obj.vac_id]);        

    const currDate = Date.now();        
    if (!opened) { // Hide when Modal is closed (!)
        return null;
    }

    const modalClosing = (doClearForm = false, refresh = false) => {
        if (doClearForm) {
            clearForm();
        }
        props.handleModalOpen(true, refresh);
    }

    const picSelect = (event) => {           
        setVacation({...vacationInner, pic: event.target.files[0].name});
    }

    const setDateStart = (dateStart) => {
        if (!dateStart) {
            setVacation({...vacationInner, date_start: null});
            return;
        }
        dateStart.setHours(dateStart.getHours() + 3);
        setVacation({...vacationInner, date_start: dateStart});
    }

    const setDateEnd = (dateEnd) => {
        if (!dateEnd) {
            setVacation({...vacationInner, date_end: null});
            return;
        }
        dateEnd.setHours(dateEnd.getHours() + 3);
        setVacation({...vacationInner, date_end: dateEnd});
    }
  
    const clearForm = () => {
        setShowMessage(false);
        setMessageOk(true);
        setMsgText("");

        setVacation({
            vac_id: vacationInner.vac_id,
            vac_desc: "",
            dest: "",
            pic: "",
            date_start: currDate,
            date_end: currDate,
            price: 0.0,
            follow_num: vacationInner.follow_num
        });
    }
    
   const addVacation = () => {
    let ret = validateUpdate();
    if (!ret) {
        return;
    }
            
    fetch("/vacations/", {
        method: "POST", 
        body: JSON.stringify(vacationInner),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res1) => {                                                
        return res1.json()
    })
    .then((res2) => {                                          
        if (res2.success) {                     
            clearForm();
            modalClosing(false,true);// 2nd param = true => do refresh on VacsAdmin
            }
            else {                    
                let total_msg = res2.message + " " + res2.data;
                console.log(total_msg);
                updateStateMsg(total_msg);
            }                
        })
        .catch(error =>  {                
            let total_msg = error.message + " " + error.data;
            console.log(total_msg);
            updateStateMsg("ERROR !! " + total_msg);
        } );
    }


    const validateUpdate = () => {                
        if (!vacationInner.vac_desc || vacationInner.vac_desc === undefined) {
            updateStateMsg("Vacation Description IS EMPTY !");
            return(false);
        }
        
        if (!vacationInner.dest || vacationInner.dest === undefined) {
            updateStateMsg("Vacation Destination IS EMPTY !");
            return(false);
        }

        if (!vacationInner.pic || vacationInner.pic === undefined) {
            updateStateMsg("Picture Path / Filename IS EMPTY !");
            return(false);
        }
                
        if (!vacationInner.date_start || vacationInner.date_start === 0
                || vacationInner.date_start === undefined || isNaN(vacationInner.date_start)) {
                    
            updateStateMsg("Date of Start IS EMPTY !");
            return(false);
        }
        
        if (!vacationInner.date_end || vacationInner.date_end === 0
                || vacationInner.date_end === undefined || isNaN(vacationInner.date_end)) {                    
            updateStateMsg("Date of End IS EMPTY !");
            return(false);
        }
        
        let currDate =  new Date();
        if (vacationInner.date_start < currDate 
            || vacationInner.date_start >= vacationInner.date_end) {
            updateStateMsg("Dates Are Wrong !");                
            return(false);
        }        

        if (!vacationInner.price || vacationInner.price === undefined
            || vacationInner.price === 0.0 || vacationInner.price <= 0) {        
            updateStateMsg("Price Must Be POSITIVE !");                
            return(false);
        }
            
        return(true);

    }

    const updateStateMsg = (newMsg) => {
        setShowMessage(true);
        setMessageOk(false);
        setMsgText(newMsg);
    }

    const updateVacation = () => {
        let ret = validateUpdate();
        if (!ret) {
            return;
        }
        
        fetch("/vacations", {            
            method: "PUT",
            body: JSON.stringify(vacationInner),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res1) => {                                                
            return res1.json()
        })
        .then((res2) => {                                          
            if (res2.success) {                    
                clearForm();
                modalClosing(false,true);// 2nd param = true => do refresh on VacsAdmin
            }
            else {
                let total_msg = res2.message + " " + res2.data;
                console.log(total_msg);
                updateStateMsg(total_msg);
            }                
        })
        .catch(error =>  {
            let total_msg = error.message + " " + error.data;
            console.log(total_msg);
            updateStateMsg("ERROR !! " + total_msg);
        } );            
    }

    return (

        <div>
            <Popup open={opened}  onClose={modalClosing} modal closeOnDocumentClick>
            {close => (
                <div className="row">
                    <div className="col-12">              
                        <div className="form">
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                </div>
                                <div className="form-group col-md-6">
                                    <h3>Add/Update Vacation</h3>
                                </div>
                            </div> 

                            <div className="content">

                                <div className="form-row">
                                <div className="form-group col-md-6 col-sm-6">
                                    <label htmlFor="dest" className="labelStyle col-form-label col-form-label-md col-form-label-sm">Destination</label>
                                    <input type="text"  id="dest" name="dest"  className="form-control" placeholder="Destination.."
                                            onChange={(e) => setVacation({...vacationInner, dest: e.target.value})} value={vacationInner.dest} />
                                </div>

                                <div className="form-group col-md-6 col-sm-6">
                                    <label htmlFor="vac_desc" className="labelStyle col-form-label col-form-label-md col-form-label-sm">Description</label>
                                    <input type="text" id="vac_desc" name="vac_desc"   className="form-control" placeholder="Description.."
                                            onChange={(e) => setVacation({...vacationInner, vac_desc: e.target.value})} value={vacationInner.vac_desc} /> 
                                </div>        
                                </div> 
   
                                <div className="form-row">
                                    <div className="form-group col-md-6 col-sm-6">
                                        <label htmlFor="pic" className="labelStyle col-form-label col-form-label-md col-form-label-sm">Picture Link</label>
                                        <input type="file" id="pic" onChange={(e) => picSelect(e)} name="pic" className="form-control" placeholder="Picture Link.."  />                                 
                                    </div>

                                    <div className="form-group col-lg-3 col-md-4 col-sm-6">
                                        <label htmlFor="date-start" className="labelStyle col-form-label col-form-label-md col-form-label-sm">Date Start</label>
                                        <DatePicker locale="en-US" name="date_start" dateFormat="dd/MM/yyyy"                                                                                 
                                            selected={vacationInner.date_start} onChange={date1 => setDateStart(date1)} />
                                    </div>

                                    <div className="form-group col-lg-3 col-md-4 col-sm-6">
                                        <label htmlFor="date-end" className="labelStyle col-form-label col-form-label-md col-form-label-sm">Date End</label>
                                        <DatePicker locale="en-US" name="date_end" dateFormat="dd/MM/yyyy"                                                                             
                                            selected={vacationInner.date_end} onChange={date2 => { setDateEnd(date2)}} /> 
                                    </div> 
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6 col-sm-6">
                                        <label htmlFor="price" className="labelStyle col-form-label col-form-label-md col-form-label-sm">Price</label>
                                        <input type="number" id="price" onChange={(e) => setVacation({...vacationInner, price: e.target.value})} name="price" className="form-control" placeholder="Price .." value={vacationInner.price} />
                                    </div>
                                    <div className="form-group col-md-6 col-sm-6">
                                        <label htmlFor="follow_num" className="labelStyle col-form-label col-form-label-md col-form-label-sm">Follow Number</label>
                                        <input type="number" id="follow_num" readOnly name="follow_num" className="form-control"  value={vacationInner.follow_num} />
                                    </div>
                                </div>                        

                                <VacsMsgs success={messageOk} show_msg={showMessage} message={msgText} />                                                                                        
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-4"></div>
                                <div className="form-group col-md-8">
                                    <div className={(vacationInner.vac_id > 0) ? "d-none btn btn-primary mb-2 mr-2" : "btn btn-primary mb-2 mr-2"} 
                                            onClick={ (e) => addVacation(e)}>Add Vacation</div>
                                    <div className={(vacationInner.vac_id > 0) ? "btn btn-success mb-2 mr-2" : "d-none btn btn-success mb-2 mr-1"} 
                                            onClick={ (e) => updateVacation(e)}>Edit Vacation</div>
                                            
                                    <div className="btn btn-warning mb-2 mr-2" onClick={ (e) => modalClosing(true)}>Exit</div>
                                    <div className="btn btn-danger mb-2" onClick={ (e) => clearForm(e)}>Clear Form</div>
                                </div>
                            </div> 
                        </div> 
                    </div>                  
                </div>      
            )}
            </Popup>
        </div>   
    );
};

export default VacationPopup;
