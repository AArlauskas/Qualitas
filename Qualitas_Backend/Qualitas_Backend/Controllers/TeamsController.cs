using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Qualitas_Backend.Models;
using Qualitas_Backend.Responses;
using Qualitas_Backend.Responses.Reports;
using Qualitas_Backend.Responses.Reports.Project;

namespace Qualitas_Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class TeamsController : ApiController
    {
        private DB_QualitasHostedEntities db = new DB_QualitasHostedEntities();

        // GET: api/Teams
        public IQueryable<Team> GetTeams()
        {
            return db.Teams;
        }

        [HttpGet]
        [Route("api/Teams/simple")]
        public async Task<IHttpActionResult> GetTeamListSimple()
        {
            var teams = db.Teams.Where(team => !team.isDeleted).Select(team => new
            {
                team.id,
                team.name
            });

            return Ok(teams);
        }


        [ResponseType(typeof(List<TeamListResponse>))]
        [HttpGet]
        [Route("api/Teams/list")]
        public async Task<IHttpActionResult> GetTeamList(DateTime start, DateTime end)
        {
            var teams = db.Teams.Where(team => !team.isDeleted).Select(team => new
            {
                team.id,
                team.name,
                userCount = team.Users.Where(user => !user.IsArchived && !user.IsDeleted).Count(),
                projects = team.Projects.Where(project => !project.isDeleted).Select(project => new
                {
                    project.id,
                    project.name
                }),
                score = team.Users.Where(user => !user.IsDeleted && !user.IsArchived).Select(user => user.Evaluations.Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Where(evaluation => !evaluation.isDeleted).Select(evaluation => evaluation.Topics.Select(topic => topic.Criteria.
                Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum()).Sum(),
                points = team.Users.Where(user => !user.IsDeleted && !user.IsArchived).Select(user => user.Evaluations.Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Where(evaluation => !evaluation.isDeleted).Select(evaluation => evaluation.Topics.Select(topic => topic.Criteria.
                Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum()).Sum()
            }) ;

            return Ok(teams);
        }

        [HttpGet]
        [Route("api/Teams/review/{id}")]
        public async Task<IHttpActionResult> GetTeamReview (int id, DateTime start, DateTime end)
        {
            var teams = await db.Teams.Where(team => !team.isDeleted)
                .Select(team => new {
                    id = team.id,
                    name = team.name,
                    Users = team.Users.Where(user => !user.IsArchived || !user.IsDeleted).Select(user => new
                    {
                        user.id,
                        user.firstname,
                        user.lastname,
                        Projects = user.Projects.Where(project => !project.isDeleted).Select(project => new
                        {
                            project.id,
                            project.name
                        }),
                        evaluationsCount = user.Evaluations.Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Where(evaluation => !evaluation.isDeleted).Count(),
                        score = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),

                        points = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum()
                    })
                }).FirstOrDefaultAsync(temp => temp.id == id);
            if (teams == null)
            {
                return NotFound();
            }

            return Ok(teams);
        }

        [HttpGet]
        [Route("api/Teams/report/{id}")]
        public async Task<IHttpActionResult> GetTeamReport(int id, DateTime start, DateTime end)
        {
            var evaluations = db.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.User.TeamId == id && evaluation.EvaluationTemplateName != null)
                .Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
                {
                    evaluation.id,
                    evaluation.EvaluationTemplateName,
                    evaluation.CategoryName,
                    User = new
                    {
                        evaluation.User.firstname,
                        evaluation.User.lastname,
                        evaluation.User.id
                    },
                    Project = new
                    {
                        evaluation.Project.id,
                        evaluation.Project.name,
                    },
                    Criticals = evaluation.Topics.Where(critical => critical.isCritical).Select(critical => new
                    {
                        critical.name,
                        critical.failed
                    }).ToList(),
                    Topics = evaluation.Topics.Where(topic => !topic.isCritical).Select(topic => new
                    {
                        topic.id,
                        topic.name,
                        crierias = topic.Criteria.Select(criteria => new
                        {
                            criteria.id,
                            criteria.name,
                            criteria.description,
                            criteria.points,
                            criteria.score,
                            comment = new CommentReport()
                            {
                                comment = criteria.comment,
                                id = evaluation.User.id,
                                name = evaluation.User.firstname + " " + evaluation.User.lastname,
                                evaluatedBy = evaluation.Evaluator.firstname + " " + evaluation.Evaluator.lastname
                            }
                        })
                    }).ToList(),
                }).GroupBy(evaluation => evaluation.User.id).ToList();

            var users = new List<UserReport>();

            foreach(var userGroup in evaluations)
            {
                UserReport user = new UserReport()
                {
                    id = userGroup.Key,
                    name = userGroup.FirstOrDefault(temp => temp.User.id == userGroup.Key).User.firstname + " " + userGroup.FirstOrDefault(temp => temp.User.id == userGroup.Key).User.lastname
                };
                var projectGroup = userGroup.GroupBy(temp => temp.Project.id).ToList();
                var projects = new List<ProjectReport>();
                foreach(var project in projectGroup)
                {
                    ProjectReport projectEntry = new ProjectReport()
                    {
                        id = project.Key,
                        name = project.FirstOrDefault(temp => temp.Project.id == project.Key).Project.name
                    };
                    var ProjectTemplateGroup = project.GroupBy(group => group.EvaluationTemplateName).ToList();
                    List<TemplateReport> templates = new List<TemplateReport>();
                    foreach(var evaluationGroup in ProjectTemplateGroup)
                    {
                        var template = new TemplateReport();
                        var evaluationTemplate = db.EvaluationTemplates.Where(temp => !temp.isDeleted).FirstOrDefault(temp => temp.name == evaluationGroup.Key);
                        template.id = evaluationTemplate.id;
                        template.name = evaluationTemplate.name;
                        template.caseCount = evaluationGroup.Count();
                        template.categories = evaluationTemplate.Categories.Select(category => category.name).ToList();

                        var categoryEvaluationGroup = evaluationGroup.GroupBy(temp => temp.CategoryName);
                        template.categoryReports = categoryEvaluationGroup.Select(category => new CategoryReport()
                        {
                            name = category.Key,
                            caseCount = evaluationGroup.Where(group => group.CategoryName == category.Key).Count(),

                            criticals = evaluationTemplate.TopicTemplates.Where(topic => topic.isCritical).Select(topic => new CrititalReport()
                            {
                                name = topic.name,
                                description = topic.description,
                                breachedCount = category.Select(group => group.Criticals.Where(critical => critical.name == topic.name).Where(critical => critical.failed).Count()).Sum()
                            }).ToList(),
                            topics = evaluationTemplate.TopicTemplates.Where(topic => !topic.isCritical).Select(topic => new TopicReport()
                            {
                                name = topic.name,
                                criterias = topic.CriteriaTemplates.Select(criteria => new CriteriaReport()
                                {
                                    name = criteria.name,
                                    description = criteria.description,
                                    score = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.score).Sum()).Sum()).Sum(),
                                    comments = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.comment)).SelectMany(x => x)).SelectMany(x => x).Where(x => x.comment != "").ToList(),
                                    points = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.points).Sum()).Sum()).Sum()
                                }).ToList()
                            }).ToList()
                        }).ToList();

                        templates.Add(template);
                    }
                    projectEntry.templates = templates;
                    projects.Add(projectEntry);
                }
                user.projects = projects;
                users.Add(user);
            }

            foreach(var user in users)
            {
                foreach (var project in user.projects)
                {
                    foreach (var template in project.templates)
                    {
                        foreach (var category in template.categoryReports)
                        {
                            foreach (var topic in category.topics)
                            {
                                topic.score = topic.criterias.Select(criteria => criteria.score).Sum();
                                topic.points = topic.criterias.Select(criteria => criteria.points).Sum();
                            }
                            category.score = category.topics.Select(topic => topic.score).Sum();
                            category.points = category.topics.Select(topic => topic.points).Sum();
                        }
                        template.score = template.categoryReports.Select(category => category.score).Sum();
                        template.points = template.categoryReports.Select(category => category.points).Sum();
                    }
                    project.score = project.templates.Select(temp => temp.score).Sum();
                    project.points = project.templates.Select(temp => temp.points).Sum();
                    project.caseCount = project.templates.Select(temp => temp.caseCount).Sum();
                }
                user.score = user.projects.Select(temp => temp.score).Sum();
                user.points = user.projects.Select(temp => temp.points).Sum();
                user.caseCount = user.projects.Select(temp => temp.caseCount).Sum();
            }

            return Ok(users);
        }

        [ResponseType(typeof(Project))]
        [HttpGet]
        [Route("api/Teams/Projects/{id}")]
        public async Task<IHttpActionResult> GetTeamsProjects(int id)
        {
            var team = await db.Teams.Where(teams => !teams.isDeleted)
                .Select(temp => new {
                    id = temp.id,
                    name = temp.name,
                    Projects = temp.Projects.Select(project => new
                    {
                        id = project.id,
                        name = project.name
                    })
                }).FirstOrDefaultAsync(temp => temp.id == id);
            if (team == null)
            {
                return NotFound();
            }

            return Ok(team);
        }

        [ResponseType(typeof(Project))]
        [HttpGet]
        [Route("api/Teams/users/{id}")]
        public async Task<IHttpActionResult> GetTeamsUsers(int id)
        {
            var team = await db.Teams.Where(teams => !teams.isDeleted)
                .Select(temp => new {
                    id = temp.id,
                    name = temp.name,
                    Users = temp.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new
                    {
                        id = user.id,
                        role = user.RoleType,
                        name = user.firstname + user.lastname
                    })
                }).FirstOrDefaultAsync(temp => temp.id == id);
            if (team == null)
            {
                return NotFound();
            }

            return Ok(team);
        }


        // GET: api/Teams/5
        [ResponseType(typeof(Team))]
        public async Task<IHttpActionResult> GetTeam(int id)
        {
            Team team = await db.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            return Ok(team);
        }

        [HttpPut]
        [Route("api/Teams/add/{id}")]
        public async Task<IHttpActionResult> AddTeamMembers(int id, int[] add)
        {
            Team team = await db.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            foreach(int value in add)
            {
                db.Users.Find(value).Team = team;
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Teams/remove/{id}")]
        public async Task<IHttpActionResult> RemoveTeamMembers(int id, int[] add)
        {
            Team team = await db.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            foreach (int value in add)
            {
                db.Users.Find(value).TeamId = null;
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Teams/addProject/{id}")]
        public async Task<IHttpActionResult> AddTeamProjects(int id, int[] add)
        {
            Team team = await db.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            foreach (int value in add)
            {
                var tempProject = db.Projects.Find(value);
                team.Projects.Add(tempProject);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Teams/removeProject/{id}")]
        public async Task<IHttpActionResult> RemoveTeamProjects(int id, int[] add)
        {
            Team team = await db.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            foreach (int value in add)
            {
                var tempProject = db.Projects.Find(value);
                team.Projects.Remove(tempProject);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        // PUT: api/Teams/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutTeam(int id, Team team)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != team.id)
            {
                return BadRequest();
            }

            db.Entry(team).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Teams
        [ResponseType(typeof(TeamListResponse))]
        public async Task<IHttpActionResult> PostTeam(Team team)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Teams.Add(team);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TeamExists(team.id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            var response = new TeamListResponse()
            {
                id = team.id,
                name = team.name,
                userCount = 0
            };
            return Ok(response.id);
        }

        [ResponseType(typeof(void))]
        [Route("api/Teams/markdeleted/{id}")]
        public async Task<IHttpActionResult> MarkDeleted([FromUri] int id)
        {
            db.Teams.Find(id).isDeleted = true;
            foreach(var user in db.Users.Where(temp => temp.TeamId == id))
            {
                user.TeamId = null;
            }
            await db.SaveChangesAsync();
            return Ok(id);
        }

        // DELETE: api/Teams/5
        [ResponseType(typeof(Team))]
        public async Task<IHttpActionResult> DeleteTeam(int id)
        {
            Team team = await db.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            db.Teams.Remove(team);
            await db.SaveChangesAsync();

            return Ok(team);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TeamExists(int id)
        {
            return db.Teams.Count(e => e.id == id) > 0;
        }
    }
}