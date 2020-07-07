import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import ProjectsDisplay from "./Containers/ProjectsDisplay/ProjectsDisplay";
import ReportsDisplay from "./Containers/ReportsDisplay/ReportsDisplay";
import TeamsDisplay from "./Containers/TeamsDisplay/TeamsDisplay";
import TemplatesDisplay from "./Containers/TemplatesDisplay/TemplatesDisplay";
import ArchiveDisplay from "./Containers/ArchiveDisplay/ArchiveDisplay";
import NavigationBreadcrumbs from './Components/NavigationBreadcrumbs/NavigationBreadcrumbs';
import UserListDisplay from './Containers/UserListDisplay/UserListDisplay';
import LoginDisplay from './Containers/LoginDisplay/LoginDisplay';

class Routing extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                {window.localStorage.getItem("role") === "admin" ? <NavigationBreadcrumbs/> : null}
                <Switch>
                    {window.localStorage.getItem("role") === "admin" ? 
                    <React.Fragment>
                    <Route path = "/projects">
                        <ProjectsDisplay />
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
                    <Route path="/archives">
                        <ArchiveDisplay />
                    </Route>
                    <Route path="/users">
                        <UserListDisplay/>
                    </Route>
                     </React.Fragment> : 
                    <React.Fragment>
                         <Route path="/">
                        <LoginDisplay/>
                    </Route>
                    <Route>
                        <Redirect to="/"/>
                    </Route>
                     </React.Fragment>}
                </Switch>
            </div>
         );
    }
}
 
export default Routing;