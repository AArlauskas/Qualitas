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
using System.Web.Routing;
using Qualitas_Backend.Models;
using Qualitas_Backend.Requests;
using Qualitas_Backend.Responses;

namespace Qualitas_Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProjectsController : ApiController
    {
        private DB_QualitasHostedEntities db = new DB_QualitasHostedEntities();

        // GET: api/Projects
        public IQueryable<Project> GetProjects()
        {
            return db.Projects;
        }

        [ResponseType(typeof(List<ProjectsListItem>))]
        [HttpGet]
        [Route("api/Projects/list")]
        public async Task<IHttpActionResult> GetProjectsList()
        {
            var projects = db.Projects.Where(project => !project.isDeleted).Select(project => new
            {
                project.id,
                project.name,
                templates = project.EvaluationTemplates.Where(template => !template.isDeleted).Select(template => new
                {
                    template.id,
                    template.name
                }),
                teams = project.Teams.Select(team => new
                {
                    team.id,
                    team.name
                })
            });

            return Ok(projects);
        }

        [HttpGet]
        [Route("api/Projects/simple")]
        public async Task<IHttpActionResult> GetProjectListSimple()
        {
            var projects = db.Projects.Where(project => !project.isDeleted).Select(project => new
            {
                project.id,
                project.name
            });

            return Ok(projects);
        }

        [HttpGet]
        [Route("api/Projects/review/{id}")]
        public async Task<IHttpActionResult> GetProjectReview(int id)
        {
            var projects = await db.Projects
                .Select(project => new {
                    id = project.id,
                    name = project.name,
                    Users = project.Users.Where(user => !user.IsArchived || !user.IsDeleted).Select(user => new
                    {
                        user.id,
                        user.firstname,
                        user.lastname,
                        teamName = user.Team.name,
                        teamId = (int?)user.Team.id,
                        average = (int?)(user.Evaluations.Where(evaluation => !evaluation.isDeleted).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum() /
                        user.Evaluations.Where(evaluation => !evaluation.isDeleted).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum() * 100)
                    })
                }).FirstOrDefaultAsync(temp => temp.id == id);
            if (projects == null)
            {
                return NotFound();
            }

            return Ok(projects);
        }

        // GET: api/Projects/5
        [ResponseType(typeof(Project))]
        public async Task<IHttpActionResult> GetProject(int id)
        {
            Project project = await db.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        [ResponseType(typeof(Project))]
        [HttpGet]
        [Route("api/Projects/Templates/{id}")]
        public async Task<IHttpActionResult> GetProjectsTemplates(int id)
        {
            var project = await db.Projects
                .Select(temp => new {
                    id = temp.id,
                    nane = temp.name,
                    Templates = temp.EvaluationTemplates.Where(template => !template.isDeleted).Select(template => new
                    {
                        id = template.id,
                        name = template.name
                    })
                }).FirstOrDefaultAsync(temp => temp.id == id);
            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        [ResponseType(typeof(Project))]
        [HttpGet]
        [Route("api/Projects/Users/{id}")]
        public async Task<IHttpActionResult> GetProjectUsers(int id)
        {
            var project = await db.Projects
                .Select(temp => new { 
                    id =  temp.id,
                    nane = temp.name,
                    Users = temp.Users.Where(user => !user.IsDeleted && !user.IsArchived).Select(user => new
                    {
                        id = user.id,
                        name = user.firstname + " " + user.lastname
                    })
                }).FirstOrDefaultAsync(temp => temp.id == id);
            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        [ResponseType(typeof(Project))]
        [HttpGet]
        [Route("api/Projects/Teams/{id}")]
        public async Task<IHttpActionResult> GetProjectTeams(int id)
        {
            var project = await db.Projects
                .Select(temp => new {
                    id = temp.id,
                    nane = temp.name,
                    Teams = temp.Teams.Select(team => new
                    {
                        id = team.id,
                        name = team.name
                    })
                }).FirstOrDefaultAsync(temp => temp.id == id);
            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        // PUT: api/Projects/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutProject(int id, Project project)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != project.id)
            {
                return BadRequest();
            }

            db.Entry(project).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
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
        [Route("api/Projects/adduser/{id}")]
        public async Task<IHttpActionResult> AddTeamMembers(int id, int[] add)
        {
            Project project = await db.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            foreach (int value in add)
            {
                var temp = db.Users.Find(value);
                project.Users.Add(temp);   
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Projects/removeuser/{id}")]
        public async Task<IHttpActionResult> RemoveTeamMembers(int id, int[] remove)
        {
            Project project = await db.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            foreach (int value in remove)
            {
                var temp = db.Users.Find(value);
                project.Users.Remove(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Projects/addTeam/{id}")]
        public async Task<IHttpActionResult> AddTeam(int id, int[] add)
        {
            Project project = await db.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            foreach (int value in add)
            {
                var temp = db.Teams.Find(value);
                project.Teams.Add(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Projects/removeTeam/{id}")]
        public async Task<IHttpActionResult> RemoveTeam(int id, int[] remove)
        {
            Project project = await db.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            foreach (int value in remove)
            {
                var temp = db.Teams.Find(value);
                project.Teams.Remove(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Projects/addTemplate/{id}")]
        public async Task<IHttpActionResult> AddTemplate(int id, int[] add)
        {
            Project project = await db.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            foreach (int value in add)
            {
                var temp = db.EvaluationTemplates.Find(value);
                project.EvaluationTemplates.Add(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Projects/removeTemplate/{id}")]
        public async Task<IHttpActionResult> RemoveTemplate(int id, int[] remove)
        {
            Project project = await db.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            foreach (int value in remove)
            {
                var temp = db.EvaluationTemplates.Find(value);
                project.EvaluationTemplates.Remove(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        // POST: api/Projects
        [ResponseType(typeof(Project))]
        public async Task<IHttpActionResult> PostProject(Project project)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Projects.Add(project);
            await db.SaveChangesAsync();

            return Ok(project.id);
        }

        // DELETE: api/Projects/5
        [ResponseType(typeof(Project))]
        public async Task<IHttpActionResult> DeleteProject(int id)
        {
            Project project = await db.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            db.Projects.Remove(project);
            await db.SaveChangesAsync();

            return Ok(project);
        }

        [ResponseType(typeof(void))]
        [Route("api/Projects/markdeleted/{id}")]
        public async Task<IHttpActionResult> MarkDeleted([FromUri] int id)
        {
            db.Projects.Find(id).isDeleted = true;
            await db.SaveChangesAsync();
            return Ok(id);
        }

        [ResponseType(typeof(void))]
        [Route("api/Projects/name/{id}")]
        public async Task<IHttpActionResult> ChangeProjectName([FromUri] int id, ChangeProjectNameRequest request)
        {
            db.Projects.Find(id).name = request.name;
            await db.SaveChangesAsync();
            return Ok(id);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ProjectExists(int id)
        {
            return db.Projects.Count(e => e.id == id) > 0;
        }
    }
}