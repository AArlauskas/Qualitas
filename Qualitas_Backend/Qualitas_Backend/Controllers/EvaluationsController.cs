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
    public class EvaluationsController : ApiController
    {
        private QualitasEntities db = new QualitasEntities();

        // GET: api/Evaluations
        public IQueryable<Evaluation> GetEvaluations()
        {
            return db.Evaluations;
        }

        // GET: api/Evaluations/5
        [ResponseType(typeof(Evaluation))]
        public async Task<IHttpActionResult> GetEvaluation(int id)
        {
            Evaluation evaluation = await db.Evaluations.FindAsync(id);
            if (evaluation == null)
            {
                return NotFound();
            }

            return Ok(evaluation);
        }

        // PUT: api/Evaluations/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutEvaluation(int id, Evaluation evaluation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != evaluation.id)
            {
                return BadRequest();
            }

            db.Entry(evaluation).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EvaluationExists(id))
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

        // POST: api/Evaluations
        [ResponseType(typeof(Evaluation))]
        public async Task<IHttpActionResult> PostEvaluation(Evaluation evaluation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            evaluation.createdDate = DateTime.Today;

            db.Evaluations.Add(evaluation);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = evaluation.id }, evaluation);
        }

        // DELETE: api/Evaluations/5
        [ResponseType(typeof(Evaluation))]
        public async Task<IHttpActionResult> DeleteEvaluation(int id)
        {
            Evaluation evaluation = await db.Evaluations.FindAsync(id);
            if (evaluation == null)
            {
                return NotFound();
            }

            db.Evaluations.Remove(evaluation);
            await db.SaveChangesAsync();

            return Ok(evaluation);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EvaluationExists(int id)
        {
            return db.Evaluations.Count(e => e.id == id) > 0;
        }
    }
}