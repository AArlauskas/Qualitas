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
        private QualitasEntities db = new QualitasEntities();

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
            var projectList = new List<ProjectsListItem>();
            await db.Projects.Where(project => !project.isDeleted).ForEachAsync(project =>
            {
                var tempProject = new ProjectsListItem()
                {
                    id = project.id,
                    name = project.name
                };
                projectList.Add(tempProject);
            });
            return Ok(projectList);
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

            return CreatedAtRoute("DefaultApi", new { id = project.id }, project);
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