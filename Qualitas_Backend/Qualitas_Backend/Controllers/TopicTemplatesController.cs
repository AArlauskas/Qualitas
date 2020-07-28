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
    public class TopicTemplatesController : ApiController
    {
        private DB_QualitasHostedEntities db = new DB_QualitasHostedEntities();

        // GET: api/TopicTemplates
        public IQueryable<TopicTemplate> GetTopicTemplates()
        {
            return db.TopicTemplates;
        }

        // GET: api/TopicTemplates/5
        [ResponseType(typeof(TopicTemplate))]
        public async Task<IHttpActionResult> GetTopicTemplate(int id)
        {
            TopicTemplate topicTemplate = await db.TopicTemplates.FindAsync(id);
            if (topicTemplate == null)
            {
                return NotFound();
            }

            return Ok(topicTemplate);
        }

        // PUT: api/TopicTemplates/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutTopicTemplate(int id, TopicTemplate topicTemplate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != topicTemplate.id)
            {
                return BadRequest();
            }

            db.Entry(topicTemplate).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TopicTemplateExists(id))
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

        // POST: api/TopicTemplates
        [ResponseType(typeof(TopicTemplate))]
        public async Task<IHttpActionResult> PostTopicTemplate(TopicTemplate topicTemplate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TopicTemplates.Add(topicTemplate);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = topicTemplate.id }, topicTemplate);
        }

        // DELETE: api/TopicTemplates/5
        [ResponseType(typeof(TopicTemplate))]
        public async Task<IHttpActionResult> DeleteTopicTemplate(int id)
        {
            TopicTemplate topicTemplate = await db.TopicTemplates.FindAsync(id);
            if (topicTemplate == null)
            {
                return NotFound();
            }

            db.TopicTemplates.Remove(topicTemplate);
            await db.SaveChangesAsync();

            return Ok(topicTemplate);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TopicTemplateExists(int id)
        {
            return db.TopicTemplates.Count(e => e.id == id) > 0;
        }
    }
}