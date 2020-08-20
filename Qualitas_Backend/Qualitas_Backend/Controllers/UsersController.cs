using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using System.Web.Http.Results;
using Qualitas_Backend.Models;
using Qualitas_Backend.Requests;
using Qualitas_Backend.Responses;
using Qualitas_Backend.Responses.Reports;

namespace Qualitas_Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        private DB_QualitasHostedEntities db = new DB_QualitasHostedEntities();

        // GET: api/Users
        public async Task<IHttpActionResult> GetUsers(DateTime start, DateTime end)
        {
            var users = db.Users.Where(user => !user.IsDeleted).Where(user => !user.IsArchived).Select(user => new
            {
                user.id,
                user.username,
                user.password,
                user.firstname,
                user.lastname,
                isArchived = user.IsArchived,
                role = user.RoleType,
                teamId = user.TeamId,
                teamName = user.Team.name,
                caseCount = user.Evaluations.Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Where(temp => !temp.isDeleted).Count(),
                projects = user.Projects.Where(project => !project.isDeleted).Select(project => new
                {
                    project.id,
                    project.name,
                }),
                score = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),

                points = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum()
            });

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/archived")]
        public async Task<IHttpActionResult> GetUsersArchived()
        {
            var users = db.Users.Where(user => !user.IsDeleted).Where(user => user.IsArchived).Select(user => new
            {
                user.id,
                user.firstname,
                user.lastname,
                isArchived = user.IsArchived,
                role = user.RoleType
            });

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/simple")]
        public async Task<IHttpActionResult> GetUserListSimple()
        {
            var users = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new
            {
                user.id,
                firstname = user.firstname,
                lastname = user.lastname,
            });

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/credentials/{id}")]
        public async Task<IHttpActionResult> GetUserCredentials(int id)
        {
            var users = await db.Users.Select(user => new
            {
                user.id,
                user.username,
                user.password
            }).FirstOrDefaultAsync(user => user.id == id);

            if(users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/Teams/simple/{id}")]
        public async Task<IHttpActionResult> GetUserListSimpleForTeam(int id)
        {
            var users = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).Where(user => user.TeamId == id || user.TeamId == null).Select(user => new
            {
                user.id,
                firstname = user.firstname,
                lastname = user.lastname,
            });

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/Projects/Templates/{id}")]
        public async Task<IHttpActionResult> GetUserListSimpleForProjectsTemplates(int id)
        {
            var users = await db.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new
            {
                user.id,
                firstname = user.firstname,
                lastname = user.lastname,
                Projects = user.Projects.Where(project => !project.isDeleted).Select(project => new
                {
                    project.id,
                    project.name,
                    EvaluationTemplates = project.EvaluationTemplates.Where(template => !template.isDeleted).Select(template => new
                    {
                        template.id,
                        template.name
                    })
                })
            }).FirstOrDefaultAsync(user => user.id == id);

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/Client/Projects/simple/{id}")]
        public async Task<IHttpActionResult> GetClientProjectList(int id)
        {
            var projects = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).FirstOrDefault(user => user.id == id).Projects.Where(project => !project.isDeleted)
                .Select(project => new
                {
                    project.id,
                    project.name
                }).ToList();

            return Ok(projects);
        }

        [HttpGet]
        [Route("api/Users/Client/Users/simple/{id}")]
        public async Task<IHttpActionResult> GetClientUserList(int id)
        {
            var users = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).FirstOrDefault(user => user.id == id).Projects.Where(project => !project.isDeleted)
                .Select(project => project.Users.Where(user => !user.IsArchived && !user.IsDeleted).Where(user => user.RoleType == "user").Select(user => new
                {
                    user.id,
                    user.firstname,
                    user.lastname
                }).ToList()).SelectMany(x => x).Distinct().ToList();

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/Client/Projects/list/{id}")]
        public async Task<IHttpActionResult> GetClientProjects(int id, DateTime start, DateTime end)
        {
            var entry = await db.Users.Where(temp => !temp.IsArchived && !temp.IsDeleted).Select(user => new
            {
                user.id,
                Projects = user.Projects.Where(project => !project.isDeleted).Select(project => new
                {
                    project.id,
                    project.name,
                    templates = project.EvaluationTemplates.Where(template => !template.isDeleted).Select(template => new
                    {
                        template.id,
                        template.name
                    }),
                    userCount = project.Users.Where(temp => !temp.IsArchived && !temp.IsDeleted).Where(temp => temp.RoleType == "user").Count(),
                    caseCount = project.Evaluations.Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Count(),
                    score = project.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),

                    points = project.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum(),
                })
            }).FirstOrDefaultAsync(user => user.id == id);

            if(entry == null)
            {
                return NotFound();
            }

            return Ok(entry);
        }

        [HttpGet]
        [Route("api/Users/review/{id}")]
        public async Task<IHttpActionResult> GetUserReview(int id, DateTime start, DateTime end)
        {
            var users = await db.Users
                .Select(user => new UserReviewResponse(){
                    id = user.id,
                    firstname = user.firstname,
                    lastname = user.lastname,
                    teamId = user.TeamId,
                    teamName = user.Team.name,
                    rating = 0,
                    teamUsersCount = user.Team.Users.Count(),
                    valid = user.Projects.Any(project => project.Evaluations.Count() > 0),
                    projectCount = user.Projects.Where(project => !project.isDeleted).Count(),
                    Evaluations = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new EvaluationResponse()
                    {
                        id = evaluation.id,
                        name = evaluation.name,
                        EvaluationTemplateName = evaluation.EvaluationTemplateName,
                        projectName = evaluation.Project.name,
                        projectId = evaluation.Project.id,
                        createdDate = evaluation.createdDate,
                        updatedDate = evaluation.updatedDate,
                        evaluator = evaluation.Evaluator.firstname + " " + evaluation.Evaluator.lastname,
                        score = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum(),
                        points = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum(),

                    }).OrderByDescending(temp => temp.createdDate).ToList()
                }).FirstOrDefaultAsync(temp => temp.id == id);

            if (users == null)
            {
                return NotFound();
            }

            var teams = await db.Teams
            .Select(team => new {
                id = team.id,
                Users = team.Users.Where(user => !user.IsArchived || !user.IsDeleted).Select(user => new
                {
                    user.id,
                    average = (int?)(user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum() / user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum() * 100)
                }).OrderByDescending(temp => temp.average).ToList()
            }).FirstOrDefaultAsync(temp => temp.id == users.teamId);

            if(users.teamId != null)
            {
                users.rating = teams.Users.FindIndex(temp => temp.id == users.id) + 1;
            }

            return Ok(users);
        }
        [HttpGet]
        [Route("api/Users/report/{id}")]
        public async Task<IHttpActionResult> GetUserReport(int id, DateTime start, DateTime end)
        {
            var evaluations = db.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.UserId == id && evaluation.EvaluationTemplateName != null)
                .Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
                {
                    evaluation.id,
                    evaluation.EvaluationTemplateName,
                    evaluation.CategoryName,
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
                            criteria.points,
                            criteria.score
                        })
                    }).ToList(),
                }).GroupBy(evaluation => evaluation.Project.id).ToList();

            var projects = new List<ProjectReport>();
            foreach(var projectGroup in evaluations)
            {
                ProjectReport project = new ProjectReport()
                {
                    id = projectGroup.Key,
                    name = projectGroup.FirstOrDefault(temp => temp.Project.id == projectGroup.Key).Project.name
                };
                var ProjectTemplateGroup = projectGroup.GroupBy(group => group.EvaluationTemplateName).ToList();
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
                            breachedCount = category.Select(group => group.Criticals.Where(critical => critical.name == topic.name).Where(critical => critical.failed).Count()).Sum()
                        }).ToList(),
                        topics = evaluationTemplate.TopicTemplates.Where(topic => !topic.isCritical).Select(topic => new TopicReport()
                        {
                            name = topic.name,
                            criterias = topic.CriteriaTemplates.Select(criteria => new CriteriaReport()
                            {
                                name = criteria.name,
                                score = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.score).Sum()).Sum()).Sum(),
                                points = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.points).Sum()).Sum()).Sum()
                            }).ToList()
                        }).ToList()
                    }).ToList();

                    templates.Add(template);
                }

                project.templates = templates;
                projects.Add(project);
            }

            foreach(var project in projects)
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

            return Ok(projects);
        }

        [HttpGet]
        [Route("api/Users/Client/report/{id}")]
        public async Task<IHttpActionResult> GetClientUserReport(int id, int clientId, DateTime start, DateTime end)
        {
            var projects = GenerateUserReport(id, clientId, start, end);
            return Ok(projects);
        }

        [HttpGet]
        [Route("api/Users/Client/report/download/")]
        public HttpResponseMessage GetClientUserReportDownload()
        {
            var response = new HttpResponseMessage(HttpStatusCode.OK);
            var filePath = HttpContext.Current.Server.MapPath($"~/App_Data/file.xls");
            var fileBytes = File.ReadAllBytes(filePath);
            var fileMemoryStream = new MemoryStream(fileBytes);
            response.Content = new StreamContent(fileMemoryStream);
            var headers = response.Content.Headers;
            headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            headers.ContentDisposition.FileName = "file.xls";
            headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
            headers.ContentLength = fileMemoryStream.Length;
            return response;
        }

        [HttpGet]
        [Route("api/Users/Project/review")]
        public async Task<IHttpActionResult> GetUserProjectReview(int userId, int projectId, DateTime start, DateTime end)
        {
            var users = await db.Users
                .Select(user => new UserReviewResponse()
                {
                    id = user.id,
                    firstname = user.firstname,
                    lastname = user.lastname,
                    valid = user.Projects.Any(project => project.Evaluations.Count() > 0),
                    Evaluations = user.Evaluations.Where(evaluation => evaluation.ProjectId == projectId).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new EvaluationResponse()
                    {
                        id = evaluation.id,
                        name = evaluation.name,
                        EvaluationTemplateName = evaluation.EvaluationTemplateName,
                        projectName = evaluation.Project.name,
                        projectId = evaluation.Project.id,
                        createdDate = evaluation.createdDate,
                        updatedDate = evaluation.updatedDate,
                        evaluator = evaluation.Evaluator.firstname + " " + evaluation.Evaluator.lastname,
                        score = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum(),
                        points = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum(),

                    }).ToList()
                }).FirstOrDefaultAsync(temp => temp.id == userId);

            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        [ResponseType(typeof(LoginResponse))]
        [HttpPost]
        [Route("api/Users/login")]
        public async Task<IHttpActionResult> Login(LoginRequest request)
        {
            try
            {
                var user = await db.Users.Where(temp => !temp.IsArchived && !temp.IsDeleted).FirstAsync(temp => temp.username == request.username && temp.password == request.password);
                var response = new LoginResponse
                {
                    Id = user.id,
                    firstname = user.firstname,
                    lastname = user.lastname,
                    role = user.RoleType,
                    username = user.username,
                    projectsCount = user.Projects.Where(project => !project.isDeleted).Count()
                };
                return Ok(response);
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [ResponseType(typeof(void))]
        [Route("api/Users/archive/{id}")]
        public async Task<IHttpActionResult> ArchiveUser([FromUri] int id)
        {
            db.Users.Find(id).IsArchived = true;
            db.Users.Find(id).TeamId = null;
            await db.SaveChangesAsync();
            return Ok(id);
        }

        [ResponseType(typeof(void))]
        [Route("api/Users/unarchive/{id}")]
        public async Task<IHttpActionResult> UnarchiveUser([FromUri] int id)
        {
            db.Users.Find(id).IsArchived = false;
            await db.SaveChangesAsync();
            return Ok(id);
        }

        [ResponseType(typeof(void))]
        [Route("api/Users/markdeleted/{id}")]
        public async Task<IHttpActionResult> MarkDeleted([FromUri] int id)
        {
            db.Users.Find(id).IsDeleted = true;
            await db.SaveChangesAsync();
            return Ok(id);
        }

        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> GetUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [ResponseType(typeof(UserListResponse))]
        [HttpGet]
        [Route("api/Users/projects/{id}")]
        public async Task<IHttpActionResult> GetUserProjects(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var projects = new List<ProjectsListItem>();
            foreach (var project in user.Projects)
            {
                var item = new ProjectsListItem()
                {
                    id = project.id,
                    name = project.name
                };
                projects.Add(item);
            }

            var entry = new UserListResponse
            {
                id = user.id,
                username = user.username,
                password = user.password,
                firstname = user.firstname,
                lastname = user.lastname,
                isArchived = user.IsArchived,
                role = user.RoleType,
                teamId = user.TeamId,
                projects = projects,
                
            };

            return Ok(entry);
        }

        [HttpGet]
        [Route("api/Users/Projects/review/{id}")]
        public async Task<IHttpActionResult> GetUserProjectsReview (int id, DateTime start, DateTime end)
        {
            var projects = await db.Projects.Where(project => project.Users.FirstOrDefault(user => user.id == id) != null)
                .Select(project => new
                {
                    id = project.id,
                    Users = project.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new
                    {
                        user.id,
                        average = (int?)(user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum() / user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum() * 100)
                    }).OrderByDescending(temp => temp.average).ToList()
                }).ToListAsync();

            var entries = await db.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new UserProjectsResponse()
            {
                id = user.id,
                firstname = user.firstname,
                lastname = user.lastname,
                Projects = user.Projects.Where(project => !project.isDeleted).Select(project => new ProjectScoreResponse()
                {
                    id = project.id,
                    name = project.name,
                    overallScore = project.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),
                    overallPoints = project.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum(),

                    score = user.Evaluations.Where(evaluation => evaluation.ProjectId == project.id).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),
                    points = user.Evaluations.Where(evaluation => evaluation.ProjectId == project.id).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum(),

                    userCount = project.Users.Where(temp => !temp.IsArchived && !temp.IsDeleted).Count(),
                    rating = 0

                }).ToList()

            }).FirstOrDefaultAsync(user => user.id == id);

            foreach(var project in entries.Projects)
            {
                project.rating = projects.FirstOrDefault(temp => temp.id == project.id).Users.FindIndex(temp => temp.id == entries.id) + 1;
            }


            return Ok(entries);
        }

        [ResponseType(typeof(void))]
        [HttpPut]
        [Route("api/Users/credentials/{id}")]
        public async Task<IHttpActionResult> ChangeCredentials (int id, ChangeCredentialsRequest request)
        {
            db.Users.Find(id).username = request.username;
            db.Users.Find(id).password = request.password;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUser(int id, CreateUserRequest request)
        {

            db.Users.Find(id).firstname = request.firstname;
            db.Users.Find(id).lastname = request.lastname;
            db.Users.Find(id).RoleType = request.role;
            db.Users.Find(id).TeamId = request.teamId;
            db.Users.Find(id).username = request.username;
            db.Users.Find(id).password = request.password;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        [HttpPut]
        [Route("api/Users/addProject/{id}")]
        public async Task<IHttpActionResult> AddProjectsToUser(int id, int[] add)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            foreach (int value in add)
            {
                var temp = db.Projects.Find(value);
                user.Projects.Add(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Users/removeProject/{id}")]
        public async Task<IHttpActionResult> RemoveProjectsFromUser(int id, int[] remove)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            foreach (int value in remove)
            {
                var temp = db.Projects.Find(value);
                user.Projects.Remove(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> PostUser(CreateUserRequest request)
        {
            var user = new User()
            {
                firstname = request.firstname,
                lastname = request.lastname,
                RoleType = request.role,
                IsArchived = false,
                IsDeleted = false,
                username = request.username,
                password = request.password,
                TeamId = request.teamId
            };

            db.Users.Add(user);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> DeleteUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.id == id) > 0;
        }

        private List<ProjectReport> GenerateUserReport(int id, int clientId, DateTime start, DateTime end)
        {
            List<int> clientProjectIds = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).FirstOrDefault(user => user.id == clientId).Projects.Select(project => project.id).ToList();

            var evaluations = db.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.UserId == id && evaluation.EvaluationTemplateName != null)
                .Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
                {
                    evaluation.id,
                    evaluation.EvaluationTemplateName,
                    evaluation.CategoryName,
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
                            criteria.points,
                            criteria.score
                        })
                    }).ToList(),
                }).Where(evaluation => clientProjectIds.Contains(evaluation.Project.id)).GroupBy(evaluation => evaluation.Project.id).ToList();

            var projects = new List<ProjectReport>();
            foreach (var projectGroup in evaluations)
            {
                ProjectReport project = new ProjectReport()
                {
                    id = projectGroup.Key,
                    name = projectGroup.FirstOrDefault(temp => temp.Project.id == projectGroup.Key).Project.name
                };
                var ProjectTemplateGroup = projectGroup.GroupBy(group => group.EvaluationTemplateName).ToList();
                List<TemplateReport> templates = new List<TemplateReport>();
                foreach (var evaluationGroup in ProjectTemplateGroup)
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
                            breachedCount = category.Select(group => group.Criticals.Where(critical => critical.name == topic.name).Where(critical => critical.failed).Count()).Sum()
                        }).ToList(),
                        topics = evaluationTemplate.TopicTemplates.Where(topic => !topic.isCritical).Select(topic => new TopicReport()
                        {
                            name = topic.name,
                            criterias = topic.CriteriaTemplates.Select(criteria => new CriteriaReport()
                            {
                                name = criteria.name,
                                score = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.score).Sum()).Sum()).Sum(),
                                points = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.points).Sum()).Sum()).Sum()
                            }).ToList()
                        }).ToList()
                    }).ToList();

                    templates.Add(template);
                }

                project.templates = templates;
                projects.Add(project);
            }

            foreach (var project in projects)
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

            return projects;
        }
    }
}