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
using System.Web.Http.Results;
using Qualitas_Backend.Models;
using Qualitas_Backend.Requests;
using Qualitas_Backend.Responses;

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

                    }).ToList()
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


            users.rating = teams.Users.FindIndex(temp => temp.id == users.id) + 1;

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
                    clientProjectId = user.ClientProjectId
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

            ProjectsListItem clientProject = null;

            if(user.ClientProjectId != null)
            {
                clientProject = new ProjectsListItem()
                {
                    id = user.Project.id,
                    name = user.Project.name
                };
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
                clientProject = clientProject
                
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

        [HttpPut]
        [Route("api/Users/addClientProject/{id}")]
        public async Task<IHttpActionResult> AddClientProject(int id, [FromBody]int add)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.ClientProjectId = add;

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Users/removeClientProject/{id}")]
        public async Task<IHttpActionResult> RemoveClientProject(int id, [FromBody]int remove)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.ClientProjectId = null;

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
    }
}