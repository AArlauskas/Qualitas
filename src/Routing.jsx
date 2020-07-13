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
import TemplateCreatorDisplay from "./Containers/TemplateCreatorDisplay/TemplateCreatorDisplay";
import TemplateEditorDisplay from "./Containers/TemplateEditorDisplay/TemplateEditorDisplay";
import ProjectDetailsDisplay from './Containers/ProjectDetailsDisplay/ProjectDetailsDisplay';

class Routing extends Component {
    state = {}
    render() {
        return (
            <div>
                {window.localStorage.getItem("role") === "admin" ? <NavigationBreadcrumbs /> : null}

                {window.localStorage.getItem("role") === "admin" ?
                    <React.Fragment>
                        <Switch>
                            <Route path="/projects">
                                <ProjectsDisplay />
                            </Route>
                            <Route exact path="/ProjectDetails/:id">
                                <ProjectDetailsDisplay />
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
                            <Route path="/newTemplate">
                                <TemplateCreatorDisplay />
                            </Route>
                            <Route exact path="/EditTemplate/:id">
                                <TemplateEditorDisplay />
                            </Route>
                            <Route path="/archives">
                                <ArchiveDisplay />
                            </Route>
                            <Route path="/users">
                                <UserListDisplay />
                            </Route>
                            <Route>
                                <Redirect to="/projects" />
                            </Route>
                        </Switch>
                    </React.Fragment> :
                    <React.Fragment>
                        <Switch>
                            <Route path="/">
                                <LoginDisplay />
                            </Route>
                            <Route>
                                <Redirect to="/" />
                            </Route>
                        </Switch>
                    </React.Fragment>}

            </div>
        );
    }
}

export default Routing;