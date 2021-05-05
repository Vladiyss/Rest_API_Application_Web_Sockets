import React from 'react';
import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import Navbar from "./component/navbar/Navbar";
import FactsList from "./component/facts/FactsList";
import {Routes} from "./constant/routes";
import CreateFact from "./component/facts/CreateFact";
import Registration from "./component/registration/Registration";
import {AuthContext} from "./component/AuthProvider";
import Login from "./component/logination/Login";

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Navbar/>
                    {this.context.currentUser ?
                        <Switch>
                            <Route exact path={Routes.factCreate} component={CreateFact}/>
                            <Route exact path={Routes.facts} component={FactsList}/>
                            <Route exact path={Routes.login} component={Login}/>
                            <Route exact path={Routes.registration} component={Registration}/>
                            <Redirect to={Routes.facts}/>
                        </Switch>
                        :
                        <Switch>
                            <Route exact path={Routes.facts} component={FactsList}/>
                            <Route exact path={Routes.login} component={Login}/>
                            <Route exact path={Routes.registration} component={Registration}/>
                            <Redirect to={Routes.login}/>
                        </Switch>
                    }
                </BrowserRouter>
            </div>
        );
    }
};
App.contextType = AuthContext;
export default App;
