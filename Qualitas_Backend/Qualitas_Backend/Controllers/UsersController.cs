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
        [ResponseType(typeof(List<UserListResponse>))]
        public async Task<IHttpActionResult> GetUsers()
        {
            var list = new List<UserListResponse>();
            await db.Users.Include(user => user.Projects).Where(user => !user.IsDeleted).ForEachAsync(user =>
            {
                var projects = new List<ProjectsListItem>();
                foreach(var project in user.Projects)
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
                    projects = projects
                };

                list.Add(entry);
            });
            return Ok(list);
        }

        [ResponseType(typeof(LoginResponse))]
        [HttpGet]
        [Route("api/Users/login")]

        public async Task<IHttpActionResult> Login(LoginRequest request)
        {
            try
            {
                var user = await db.Users.FirstAsync(temp => temp.username == request.username && temp.password == request.password);
                var response = new LoginResponse
                {
                    Id = user.id,
                    firstname = user.firstname,
                    lastname = user.lastname,
                    role = user.RoleType,
                    username = user.username
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
                projects = projects
            };

            return Ok(entry);
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
    }
}