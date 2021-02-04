import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
// import Login from './Components/Login/LoginAsClass';
import Login from './Components/Login/Login';
import Logout from './Components/Logout/Logout';
import Register from './Components/Register/Register';
import VacsUser from './Components/VacsUser/VacsUser';
import VacsAdmin from './Components/VacsAdmin/VacsAdmin';
// import VacsAdminToUpdate from './Components/VacsAdmin/VacsAdminToUpdate'; // for Update As Route
// import VacationUpdate from './Components/VacationUpdate/VacationUpdate';
import VacsReport from './Components/VacsReport/VacsReport';
import VacsMsgs from './Components/VacsMsgs/VacsMsgs';

// const ENDPOINT = "http://127.0.0.1:4001";
/// TODO:
// * Code Improves. Done.
// ** vacation sort - check & fix. Done.
// 1. Socket.IO - Done. // NodeJS Session checked in parallel on regular Chrome Browser & Incognito Mode.
// 2. Vacation Add/Update with Admin Check. Done.
// 3. Wrap some SQL Commands with Try/Catch. Done.
// 4. Apply Async/Await in NodeJS multiple DB Calls (using mysql2). Done.
// 5. Vacation Update AS Pop Up. Split & Save VacsAdminToUpdate . Done.
// 5.1 Link "Tag Vacation" from Admin Scn to User Scn. Done.
// 5.2 Link "Manage" from User Scn (if it's admin) to Admin Scn. Done.
// 5.3 Login As Func. Component with Hooks. Done.
// 5.4 VacsUser As Func. Component with Hooks.
// 6. Dates AS Moment.JS & AS Local Time (IL).
// 6.1 Code CleanUp.
// 7.0 Graph Component & Report Scn (with Material-UI ?) , connected with a Link/Button .
// ** END PHASE 2 - ready for GitHub display

// ** update react to 16.13 + ??
// 8.0 Client Side: Apply some Redux/useReducer/(Saga ??)
// 8.1 Server Side: Update NodeJS (to after 14.2.0)
// 8.2 Server Side: Use Optional Chaining => [ if (arg1?.arg2?.foo .. ) ]
// 9.0 Optional: Apply AUTH Passport
// 10 UX improvements: Spiner Admin, Forms , ..
// 11 Web Deploy/Hosting
// 12 Optional: Hosting includes AUTH with SSH
// ** END PHASE 3 - ready to show

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
            <div className="col-2">
              </div>               
              <div className="col-8 col-xs-9"> 
              <h3>
                My Vacations Observer - Tag &amp; Follow
              </h3>   
              </div> 
                      
            </div>
            <div className="row ml-1">           
              <VacsMsgs show_msg={this.state.show_message} success={this.state.message_ok} message={this.state.msg_text}  />
            </div>
            <div className="row">                                    
                  <div className="col-12">
                      <Router>
                          <div className="">
                              <Route exact path="/" component={Login} />
                              <Route exact path="/login" component={Login} />
                              <Route exact path="/logout" component={Logout} />
                              <Route exact path="/home" component={Login} />
                              <Route path="/register" component={Register} />
                              <Route path="/vacations_user" component={VacsUser} />
                              {/* // for update in popup: */}
                              <Route path="/vacations_admin" component={VacsAdmin} />
                              {/* // for update as route: */}
                              {/* <Route path="/vacations_admin" component={VacsAdminToUpdate} /> */}
                              {/* <Route path="/vacation_add" component={VacationUpdate} /> */}
                              {/* <Route path="/vacation_update/:vac_id/:vac_desc/:dest/:pic/:price/:date_start/:date_end/:follow_num" component={VacationUpdate} /> */}
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
