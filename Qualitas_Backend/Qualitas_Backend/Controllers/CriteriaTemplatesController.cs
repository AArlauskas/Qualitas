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

namespace Qualitas_Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CriteriaTemplatesController : ApiController
    {
        private DB_QualitasHostedEntities db = new DB_QualitasHostedEntities();

        // GET: api/CriteriaTemplates
        public IQueryable<CriteriaTemplate> GetCriteriaTemplates()
        {
            return db.CriteriaTemplates;
        }

        // GET: api/CriteriaTemplates/5
        [ResponseType(typeof(CriteriaTemplate))]
        public async Task<IHttpActionResult> GetCriteriaTemplate(int id)
        {
            CriteriaTemplate criteriaTemplate = await db.CriteriaTemplates.FindAsync(id);
            if (criteriaTemplate == null)
            {
                return NotFound();
            }

            return Ok(criteriaTemplate);
        }

        // PUT: api/CriteriaTemplates/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutCriteriaTemplate(int id, CriteriaTemplate criteriaTemplate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != criteriaTemplate.id)
            {
                return BadRequest();
            }

            db.Entry(criteriaTemplate).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CriteriaTemplateExists(id))
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

        // POST: api/CriteriaTemplates
        [ResponseType(typeof(CriteriaTemplate))]
        public async Task<IHttpActionResult> PostCriteriaTemplate(CriteriaTemplate criteriaTemplate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CriteriaTemplates.Add(criteriaTemplate);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = criteriaTemplate.id }, criteriaTemplate);
        }

        // DELETE: api/CriteriaTemplates/5
        [ResponseType(typeof(CriteriaTemplate))]
        public async Task<IHttpActionResult> DeleteCriteriaTemplate(int id)
        {
            CriteriaTemplate criteriaTemplate = await db.CriteriaTemplates.FindAsync(id);
            if (criteriaTemplate == null)
            {
                return NotFound();
            }

            db.CriteriaTemplates.Remove(criteriaTemplate);
            await db.SaveChangesAsync();

            return Ok(criteriaTemplate);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CriteriaTemplateExists(int id)
        {
            return db.CriteriaTemplates.Count(e => e.id == id) > 0;
        }
    }
}