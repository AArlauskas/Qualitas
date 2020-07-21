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

namespace Qualitas_Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class TeamsController : ApiController
    {
        private QualitasEntities db = new QualitasEntities();

        // GET: api/Teams
        public IQueryable<Team> GetTeams()
        {
            return db.Teams;
        }

        [ResponseType(typeof(List<TeamListResponse>))]
        [HttpGet]
        [Route("api/Teams/list")]
        public async Task<IHttpActionResult> GetTeamList()
        {
            var list = new List<TeamListResponse>();
            await db.Teams.Include(team => team.Users).Include(team => team.Projects).ForEachAsync(team =>
            {
                var entry = new TeamListResponse
                {
                    id = team.id,
                    name = team.name,
                    userCount = team.Users.Where(user => !user.IsDeleted && !user.IsArchived).Count()
                };
                entry.projects = new List<ProjectsListItem>();
                foreach(var project in team.Projects)
                {
                    var tempProject = new ProjectsListItem()
                    {
                        id = project.id,
                        name = project.name
                    };
                    entry.projects.Add(tempProject);
                }

                list.Add(entry);
            });
            return Ok(list);
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
            return Ok(response);
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