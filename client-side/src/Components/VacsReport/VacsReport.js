import React from 'react';
import VacsMsgs from '../VacsMsgs/VacsMsgs';

class VacsReport extends React.Component {
    state = {
        show_message: false,
        message_ok: true,
        msg_text: ""
        // reports: [],        
    }

    getReports() {
        console.log("VacsReport.JS - Starting getReports()");
        alert("VacsReport.JS - Starting getReports()");
        /*
        fetch('/reports')
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                if (res.success) {
                    this.setState({ reports: res.data });
                } else {                    
                    this.setState({ msg_text: res.message, message_ok: false, show_message: true});                    
                }

            });
            */
    }

    componentDidMount() {
        this.setState({ error: "", show_warning: false});
        this.getReports();        
    }

    render() {
        return (
            <div className="border border-warning p-1">
               <h1> Vacations Report</h1>
               <VacsMsgs success={this.state.message_ok} show_msg={this.state.show_message} message={this.state.msg_text} />
                <div className="row">
                    <div className="col-md-12">

                        VACATIONS REPORT !
                                                                                                                                                             
                    </div>                  
                </div>
            </div>
        )
    }
}

export default VacsReport;

