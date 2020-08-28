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
        private DB_QualitasHostedEntities db = new DB_QualitasHostedEntities();

        // GET: api/Evaluations
        public IQueryable<Evaluation> GetEvaluations()
        {
            return db.Evaluations.Where(temp => !temp.isDeleted);
        }

        // GET: api/Evaluations/5
        [ResponseType(typeof(Evaluation))]
        public async Task<IHttpActionResult> GetEvaluation(int id)
        {
            var evaluationResult = await db.Evaluations.Where(evaluation => !evaluation.isDeleted).Select(evaluation => new
            {
                evaluation.id,
                evaluation.name,
                evaluation.comment,
                evaluation.createdDate,
                evaluation.updatedDate,
                evaluation.CategoryName,
                userId = evaluation.User.id,
                projectId = evaluation.Project.id,
                evaluator = evaluation.Evaluator.firstname + " " + evaluation.Evaluator.lastname,
                Topics = evaluation.Topics.Select(topic => new
                {
                    topic.id,
                    topic.name,
                    topic.failed,
                    topic.isCritical,
                    topic.description,
                    Criteria = topic.Criteria.Select(criteria => new
                    {
                        criteria.id,
                        criteria.name,
                        criteria.points,
                        criteria.description,
                        criteria.score,
                        criteria.comment
                    })
                }),
            }).FirstOrDefaultAsync(evaluation => evaluation.id == id);

            if(evaluationResult == null)
            {
                return NotFound();
            }

            return Ok(evaluationResult);
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

            db.Evaluations.Find(id).name = evaluation.name;
            db.Evaluations.Find(id).updatedDate = DateTime.Now;
            db.Evaluations.Find(id).comment = evaluation.comment;
            db.Evaluations.Find(id).EvaluatorId = evaluation.EvaluatorId;
            foreach(var topic in evaluation.Topics)
            {
                db.Topics.Find(topic.id).failed = topic.failed;
                foreach(var criteria in topic.Criteria)
                {
                    db.Criteria.Find(criteria.id).score = criteria.score;
                    db.Criteria.Find(criteria.id).comment = criteria.comment;
                }
            }

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

        [ResponseType(typeof(void))]
        [Route("api/Evaluations/markdeleted/{id}")]
        public async Task<IHttpActionResult> MarkDeleted([FromUri] int id)
        {
            db.Evaluations.Find(id).isDeleted = true;
            await db.SaveChangesAsync();
            return Ok(id);
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