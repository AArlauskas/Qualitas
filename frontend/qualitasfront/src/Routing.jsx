import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import HomePageDisplay from "./Containers/HomePageDisplay/HomePageDisplay";
import ReportsDisplay from "./Containers/ReportsDisplay/ReportsDisplay";
import TeamsDisplay from "./Containers/TeamsDisplay/TeamsDisplay";
import TemplatesDisplay from "./Containers/TemplatesDisplay/TemplatesDisplay";

class Routing extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                <Switch>
                    <Route exact path = "/">
                        <HomePageDisplay />
                    </Route>
                    <Route path="/reports">
                        <ReportsDisplay />
                    </Route>
                    <Route path="/teams">
                        <TeamsDisplay />
                    </Route>
                    <Route path="/templates">
                        <TemplatesDisplay />
                    </Route>
                    <Route>
                        <Redirect to="/"/>
                    </Route>
                </Switch>
            </div>
         );
    }
}
 
export default Routing;