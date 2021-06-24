import React, { useState, useEffect } from 'react';
import VacsMsgs from '../VacsMsgs/VacsMsgs';
import { BrowserRouter as Router,  Link } from "react-router-dom";
import {Bar} from 'react-chartjs-2';

const VacsReport = (props) =>  { 

    const [reportData, setReportData] = useState([]);
    const [arrDesc, setArrDesc] = useState([]);

    const [showMessage, setShowMessage] = useState(false); 
    const [messageOk, setMessageOk] = useState(true); 
    const [msgText, setMsgText] = useState("");

    var desc_temp = [];
    var data_temp = [];

    const updateStateMsg = (newMsg, msgOK = false) => {
        setShowMessage(true);
        setMessageOk(msgOK);
        setMsgText(newMsg);
    }

    useEffect(() => {
        setShowMessage(false); setMessageOk(true); setMsgText("");
        getReports();
        return;
    }, []);

    const fillReportData = (vacsReport) => {
        for (let vacValue of vacsReport) {    
            data_temp.push(vacValue.follow_num);
            desc_temp.push(vacValue.vac_desc);
        }
    }

    const getReports = () => {
        fetch('/report' , {'cache':'no-store'})
            .then(res => res.json())
            .then((res) => {
                if (res.success) {
                    fillReportData(res.data);
                    setArrDesc(desc_temp);
                    setReportData(data_temp);
                } else {
                    updateStateMsg(res.message);
                }
            });
        
    }

    return (
        <div className="border border-warning p-1">
            <div className="row">
                <div className="col-3">
                </div>
                <div className="col-6">
                    <h1> Vacations By Followers </h1>
                </div>
                <div className="col-3">
                    <Link to="/vacations_admin" className= "btn btn-success mt-2 " >Manage</Link>
                    <Link to="/logout" className="btn btn-danger mt-2 ml-1" >Logout</Link>
                </div>
            </div>
           <VacsMsgs success={messageOk} show_msg={showMessage} message={msgText} />
            <div className="row">
                <div className="col-md-12">
                    <div className="border border-success p-1">                        
                    { 
                        (reportData.length === 0) ?
                        <h2> No Data Found !</h2> 
                        :         
                        <Bar
                            data={{
                                labels: arrDesc,
                                datasets: [
                                    {
                                       label: 'Vacations By Followers',
                                       data: reportData,
                                       backgroundColor: 'lightblue',
                                       borderColor: 'lightgrey',
                                       borderWidth: 5
                                    }
                                ]
                            }}
                            width={400}
                            height={300}
                            options={{
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Vacation Description",
                                            color: "dark-grey",
                                            font: {
                                                size: 20
                                            },
                                            padding: 4
                                        } 
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: "Followers",
                                            color: "purple",
                                            font: {
                                                size: 20
                                            },
                                            padding: 4
                                        } 
                                    }
                                },
                                maintainAspectration: false,
                            }}
                        />
                    }
                    </div>
                </div>                  
            </div>
        </div>
    )
}

export default VacsReport;
