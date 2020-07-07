import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import ProjectsDisplay from "./Containers/ProjectsDisplay/ProjectsDisplay";
import ReportsDisplay from "./Containers/ReportsDisplay/ReportsDisplay";
import TeamsDisplay from "./Containers/TeamsDisplay/TeamsDisplay";
import TemplatesDisplay from "./Containers/TemplatesDisplay/TemplatesDisplay";
import ArchiveDisplay from "./Containers/ArchiveDisplay/ArchiveDisplay";
import NavigationBreadcrumbs from './Components/NavigationBreadcrumbs/NavigationBreadcrumbs';

class Routing extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                <NavigationBreadcrumbs/>
                <Switch>
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
                    <Route>
                        <Redirect to="/projects"/>
                    </Route>
                </Switch>
            </div>
         );
    }
}
 
export default Routing;