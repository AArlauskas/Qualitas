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
            var teams = db.Teams.Select(team => new
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
            var teams = db.Teams.Select(team => new
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
            var teams = await db.Teams
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

        [ResponseType(typeof(Project))]
        [HttpGet]
        [Route("api/Teams/Projects/{id}")]
        public async Task<IHttpActionResult> GetTeamsProjects(int id)
        {
            var team = await db.Teams
                .Select(temp => new {
                    id = temp.id,
                    nane = temp.name,
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
            var team = await db.Teams
                .Select(temp => new {
                    id = temp.id,
                    nane = temp.name,
                    Users = temp.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new
                    {
                        id = user.id,
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