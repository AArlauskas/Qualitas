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
using Qualitas_Backend.Requests;

namespace Qualitas_Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class EvaluationTemplatesController : ApiController
    {
        private QualitasEntities db = new QualitasEntities();

        // GET: api/EvaluationTemplates
        public IQueryable<EvaluationTemplate> GetEvaluationTemplates()
        {
            return db.EvaluationTemplates.Include(template => template.TopicTemplates);
        }

        // GET: api/EvaluationTemplates/5
        [ResponseType(typeof(EvaluationTemplate))]
        public async Task<IHttpActionResult> GetEvaluationTemplate(int id)
        {
            EvaluationTemplate evaluationTemplate = await db.EvaluationTemplates.FindAsync(id);
            if (evaluationTemplate == null)
            {
                return NotFound();
            }

            return Ok(evaluationTemplate);
        }

        // PUT: api/EvaluationTemplates/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutEvaluationTemplate(int id, EvaluationTemplate evaluationTemplate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != evaluationTemplate.id)
            {
                return BadRequest();
            }

            db.Entry(evaluationTemplate).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EvaluationTemplateExists(id))
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
        [HttpPost]
        [Route("api/EvaluationTemplates/full")]
        public async Task<IHttpActionResult> FullEvaluationTemplate(CreateFullEvaluationTemplateRequest request)
        {
            var template = new EvaluationTemplate()
            {
                name = request.TemplateName,
            };
            var listOfTopics = new List<TopicTemplate>();
            foreach (var topic in request.Topics)
            {
                
                var tempTopic = new TopicTemplate()
                {
                    name = topic.name,
                    isCritical = topic.critical,
                    TemplateId = template.id
                };
                var listOfCriteria = new List<CriteriaTemplate>();
                foreach (var criteria in request.Criteria)
                {
                    if(criteria.parentId == topic.id)
                    {
                        var tempCriteria = new CriteriaTemplate()
                        {
                            name = criteria.name,
                            points = criteria.points,
                            TopicId = tempTopic.id
                        };
                        listOfCriteria.Add(tempCriteria);
                        db.CriteriaTemplates.Add(tempCriteria);
                    }
                    
                }

                    listOfTopics.Add(tempTopic);
                db.TopicTemplates.Add(tempTopic);
            }

            db.EvaluationTemplates.Add(template);
            await db.SaveChangesAsync();
            return Ok(1);
        }



        // POST: api/EvaluationTemplates
        [ResponseType(typeof(EvaluationTemplate))]
        public async Task<IHttpActionResult> PostEvaluationTemplate(EvaluationTemplate evaluationTemplate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EvaluationTemplates.Add(evaluationTemplate);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = evaluationTemplate.id }, evaluationTemplate);
        }

        // DELETE: api/EvaluationTemplates/5
        [ResponseType(typeof(EvaluationTemplate))]
        public async Task<IHttpActionResult> DeleteEvaluationTemplate(int id)
        {
            EvaluationTemplate evaluationTemplate = await db.EvaluationTemplates.FindAsync(id);
            if (evaluationTemplate == null)
            {
                return NotFound();
            }

            db.EvaluationTemplates.Remove(evaluationTemplate);
            await db.SaveChangesAsync();

            return Ok(evaluationTemplate);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EvaluationTemplateExists(int id)
        {
            return db.EvaluationTemplates.Count(e => e.id == id) > 0;
        }
    }
}