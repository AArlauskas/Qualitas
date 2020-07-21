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
import UsersProjectsDisplay from './Containers/UsersProjectsDisplay/UsersProjectsDisplay';
import TemplateProjectsDisplay from './Containers/TemplateProjectsDisplay/TemplateProjectsDisplay';
import TeamsProjectsDisplay from './Containers/TeamsProjectsDisplay/TeamsProjectsDisplay';
import TeamMembersDisplay from './Containers/TeamMembersDisplay/TeamMembersDisplay';
import ProjectTeamsDisplay from './Containers/ProjectTeamsDisplay/ProjectTeamsDisplay';
import ProjectsTemplatesDisplay from './Containers/ProjectsTemplatesDisplay/ProjectsTemplatesDisplay';

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
                            <Route exact path="/ProjectTeams/:id">
                                <ProjectTeamsDisplay />
                            </Route>
                            <Route exact path="/ProjectTemplates/:id">
                                <ProjectsTemplatesDisplay />
                            </Route>
                            <Route path="/reports">
                                <ReportsDisplay />
                            </Route>
                            <Route path="/teams">
                                <TeamsDisplay />
                            </Route>
                            <Route exact path="/teamMembers/:id">
                                <TeamMembersDisplay />
                            </Route>
                            <Route exact path="/teamProjects/:id">
                                <TeamsProjectsDisplay />
                            </Route>
                            <Route path="/templates">
                                <TemplatesDisplay />
                            </Route>
                            <Route path="/newTemplate">
                                <TemplateCreatorDisplay />
                            </Route>
                            <Route exact path="/TemplateProjects/:id">
                                <TemplateProjectsDisplay />
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
                            <Route exact path="/UsersProjects/:id">
                                <UsersProjectsDisplay />
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