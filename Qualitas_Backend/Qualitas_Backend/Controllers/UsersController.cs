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
        private QualitasEntities db = new QualitasEntities();

        // GET: api/Users
        [ResponseType(typeof(List<UserListResponse>))]
        public async Task<IHttpActionResult> GetUsers()
        {
            var list = new List<UserListResponse>();
            await db.Users.Where(user => !user.IsDeleted).ForEachAsync(user =>
            {
                var entry = new UserListResponse
                {
                    id = user.id,
                    name = user.username,
                    firstname = user.firstname,
                    lastname = user.lastname,
                    isArchived = user.IsArchived,
                    role = user.RoleType,
                    teamId = user.TeamId
                };

                list.Add(entry);
            });
            return Ok(list);
        }

        [ResponseType(typeof(void))]
        [Route("api/Users/archive/{id}")]
        public async Task<IHttpActionResult> ArchiveUser([FromUri] int id)
        {
            db.Users.Find(id).IsArchived = true;
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

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUser(int id, CreateUserRequest request)
        {

            db.Users.Find(id).firstname = request.firstname;
            db.Users.Find(id).lastname = request.lastname;
            db.Users.Find(id).RoleType = request.role;
            db.Users.Find(id).TeamId = request.teamId;

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
                username = request.firstname,
                password = request.lastname,
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