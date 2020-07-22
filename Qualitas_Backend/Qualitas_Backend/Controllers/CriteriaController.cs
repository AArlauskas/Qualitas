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
    public class CriteriaController : ApiController
    {
        private QualitasEntities db = new QualitasEntities();

        // GET: api/Criteria
        public IQueryable<Criterion> GetCriteria()
        {
            return db.Criteria;
        }

        // GET: api/Criteria/5
        [ResponseType(typeof(Criterion))]
        public async Task<IHttpActionResult> GetCriterion(int id)
        {
            Criterion criterion = await db.Criteria.FindAsync(id);
            if (criterion == null)
            {
                return NotFound();
            }

            return Ok(criterion);
        }

        // PUT: api/Criteria/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutCriterion(int id, Criterion criterion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != criterion.id)
            {
                return BadRequest();
            }

            db.Entry(criterion).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CriterionExists(id))
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

        // POST: api/Criteria
        [ResponseType(typeof(Criterion))]
        public async Task<IHttpActionResult> PostCriterion(Criterion criterion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Criteria.Add(criterion);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = criterion.id }, criterion);
        }

        // DELETE: api/Criteria/5
        [ResponseType(typeof(Criterion))]
        public async Task<IHttpActionResult> DeleteCriterion(int id)
        {
            Criterion criterion = await db.Criteria.FindAsync(id);
            if (criterion == null)
            {
                return NotFound();
            }

            db.Criteria.Remove(criterion);
            await db.SaveChangesAsync();

            return Ok(criterion);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CriterionExists(int id)
        {
            return db.Criteria.Count(e => e.id == id) > 0;
        }
    }
}