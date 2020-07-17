import React from 'react';
import './App.css';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './Components/Login/Login';
import Logout from './Components/Logout/Logout';
import Register from './Components/Register/Register';
import VacsUser from './Components/VacsUser/VacsUser';
import VacsAdmin from './Components/VacsAdmin/VacsAdmin';
import VacationUpdate from './Components/VacationUpdate/VacationUpdate';
import VacsReport from './Components/VacsReport/VacsReport';
// import VacsBanner from './Components/VacsBanner/VacsBanner';
import VacsMsgs from './Components/VacsMsgs/VacsMsgs';

/// TODO:
// 1. Socket.IO
// 2. Vacation Update AS Pop Up
// 3. Dates AS Moment.JS
// 4. Graph Component
// 5. UX improvements
// 6. Web Deploy

class App extends React.Component {
  
  state = {
    show_message: true,
    message_ok: true,
    msg_text: ""   
  }

  render() {
      return (
          <div className="App container">
            <div className="row">
            <div className="col-md-2 col-lg-2 col-xl-2 col-sm-2 col-xs-2"> 
              </div> 
              <div className="col-md-8 col-lg-8 col-xl-8 col-sm-8 col-xs-9"> 
              <h3>
                My Vacations Observer - Tag &amp; Follow
              </h3>   
              </div> 
                      
            </div>
            <div className="row ml-1">           
              <VacsMsgs show_msg={this.state.show_message} success={this.state.message_ok} message={this.state.msg_text}  />
            </div>
            <div className="row">                  
                  <div className="col-md-12 col-lg-12 col-xl-12 col-sm-12 col-xs-12">
                      <Router>
                          <div className="">
                              <Route exact path="/" component={Login} />
                              <Route exact path="/login" component={Login} />
                              <Route exact path="/logout" component={Logout} />
                              <Route exact path="/home" component={Login} />
                              <Route path="/register" component={Register} />
                              <Route path="/vacations_user" component={VacsUser} />
                              <Route path="/vacations_admin" component={VacsAdmin} />
                              <Route path="/vacation_add" component={VacationUpdate} />
                              <Route path="/vacation_update/:vac_id/:vac_desc/:dest/:pic/:price/:date_start/:date_end/:follow_num" component={VacationUpdate} />
                              <Route path="/vacations_report" component={VacsReport} />
                          </div>
                      </Router>
                  </div>                                   
              </div>
          </div>
      );
  }
}

export default App;
