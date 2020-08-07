import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import ProjectsDisplay from "./Containers/ProjectsDisplay/ProjectsDisplay";
import ReportsDisplay from "./Containers/ReportsDisplay/ReportsDisplay";
import TeamsDisplay from "./Containers/TeamsDisplay/TeamsDisplay";
import TemplatesDisplay from "./Containers/TemplatesDisplay/TemplatesDisplay";
import ArchiveDisplay from "./Containers/ArchiveDisplay/ArchiveDisplay";
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
import UserReviewDisplay from './Containers/UserReviewDisplay/UserReviewDisplay';
import CaseCreatorDisplay from './Containers/CaseCreatorDisplay/CaseCreatorDisplay';
import CaseEditorDisplay from './Containers/CaseEditorDisplay/CaseEditorDisplay';
import TeamReviewDisplay from './Containers/TeamReviewDisplay/TeamReviewDisplay';
import ProjectsReviewDisplay from './Containers/ProjectsReviewDisplay/ProjectsReviewDisplay';
import EvaluationsDisplay from './Containers/User/EvaluationsDisplay/EvaluationsDisplay';
import NavigationBreadcrumbsAdmin from './Components/NavigationBreadcrumbsAdmin/NavigationBreadcrumbsAdmin';
import CredentialsDisplay from './Containers/User/CredentialsDisplay/CredentialsDisplay';
import NavigationBreadcrumbsUser from './Components/User/NavigationBreadcrumbsUser';
import CaseViewDisplay from './Containers/User/CaseViewDisplay/CaseViewDisplay';
import UserProjectsListDisplay from './Containers/User/UserProjectsListDisplay/UserProjectsListDisplay';
import NavigationBreadcrumbsClient from './Components/Client/NavigationBreadcrumbsClient';
import ClientProjectsDisplay from './Containers/Client/ClientProjectsDisplay/ClientProjectsDisplay';
import ClientProjectReviewDisplay from './Containers/Client/ClientProjectReviewDisplay/ClientProjectReviewDisplay';
import ClientUserReviewDisplay from './Containers/Client/ClientUserReviewDisplay/ClientUserReviewDisplay';
import ClientTemplatesDisplay from './Containers/Client/ClientTemplatesDisplay/ClientTemplatesDisplay';
import TemplateViewerDisplay from './Containers/Client/TemplateViewerDisplay/TemplateViewerDisplay';
import ClientReportsDisplay from './Containers/Client/ClientReportsDisplay/ClientReportsDisplay';

class Routing extends Component {
    state = {}
    render() {
        let role = window.localStorage.getItem('role');
        if (role === "admin") {
            return (
                <div>
                    <NavigationBreadcrumbsAdmin />
                    <React.Fragment>
                        <Switch>
                            <Route path="/projects">
                                <ProjectsDisplay />
                            </Route>
                            <Route exact path="/ProjectReview/:id">
                                <ProjectsReviewDisplay />
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
                            <Route exact path="/teamDetails/:id">
                                <TeamReviewDisplay />
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
                            <Route path="/ArchivedUser/:id" component={EvaluationsDisplay}>
                            </Route>
                            <Route exact path="/viewCase/:id">
                                <CaseViewDisplay />
                            </Route>
                            <Route path="/users">
                                <UserListDisplay />
                            </Route>
                            <Route exact path="/userDetails/:id">
                                <UserReviewDisplay />
                            </Route>
                            <Route exact path="/UsersProjects/:id">
                                <UsersProjectsDisplay />
                            </Route>
                            <Route exact path="/newCase/:userId">
                                <CaseCreatorDisplay />
                            </Route>
                            <Route exact path="/editCase/:id">
                                <CaseEditorDisplay />
                            </Route>
                            <Route>
                                <Redirect to="/projects" />
                            </Route>
                        </Switch>
                    </React.Fragment>
                </div>
            );
        }
        else if (role === "user") {
            return (
                <div>
                    <NavigationBreadcrumbsUser />
                    <Switch>
                        <Route path="/evaluations">
                            <EvaluationsDisplay />
                        </Route>
                        <Route path="/credentials">
                            <CredentialsDisplay />
                        </Route>
                        <Route exact path="/viewCase/:id">
                            <CaseViewDisplay />
                        </Route>
                        <Route path="/projects">
                            <UserProjectsListDisplay />
                        </Route>
                        <Route>
                            <Redirect to="/evaluations" />
                        </Route>
                    </Switch>
                </div>
            );
        }
        else if (role === "client") {
            return (
                <div>
                    <NavigationBreadcrumbsClient />
                    <Switch>
                        <Route path="/projects">
                            <ClientProjectsDisplay />
                        </Route>
                        <Route exact path="/projectReview/:id" component={ClientProjectReviewDisplay}>
                        </Route>
                        <Route exact path="/userDetails/:userId/:projectId" component={ClientUserReviewDisplay}>
                        </Route>
                        <Route exact path="/viewCase/:id">
                            <CaseViewDisplay />
                        </Route>
                        <Route path="/templates">
                            <ClientTemplatesDisplay />
                        </Route>
                        <Route path="/viewTemplate/:id" component={TemplateViewerDisplay}>
                        </Route>
                        <Route path="/reports">
                            <ClientReportsDisplay />
                        </Route>
                        <Route>
                            <Redirect to="/projects" />
                        </Route>
                    </Switch>
                </div>
            );
        }
        else {
            return (
                <React.Fragment>
                    <Switch>
                        <Route path="/">
                            <LoginDisplay />
                        </Route>
                        <Route>
                            <Redirect to="/" />
                        </Route>
                    </Switch>
                </React.Fragment>
            );
        }

    }
}

export default Routing;