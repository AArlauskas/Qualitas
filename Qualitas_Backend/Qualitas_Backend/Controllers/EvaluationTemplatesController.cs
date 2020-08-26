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
using Qualitas_Backend.Requests.SubClassesForRequests;
using Qualitas_Backend.Responses;

namespace Qualitas_Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class EvaluationTemplatesController : ApiController
    {
        private DB_QualitasHostedEntities db = new DB_QualitasHostedEntities();

        // GET: api/EvaluationTemplates
        public IQueryable<EvaluationTemplate> GetEvaluationTemplates()
        {
            return db.EvaluationTemplates.Include(template => template.TopicTemplates).Where(template => !template.isDeleted);
        }

        [HttpGet]
        [Route("api/EvaluationTemplates/list")]
        public async Task<IHttpActionResult> GetEvaluationList()
        {
            var templates = db.EvaluationTemplates.Where(template => !template.isDeleted).Select(template => new
            {
                template.id,
                template.name,
                Projects = template.Projects.Where(project => !project.isDeleted).Select(project => new
                {
                    project.id,
                    project.name
                })
            });

            return Ok(templates);
        }

        [HttpGet]
        [Route("api/EvaluationTemplates/Client/list/{id}")]
        public async Task<IHttpActionResult> GetClientEvaluationList(int id)
        {
            var ClientProjects = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).FirstOrDefault(user => user.id == id).Projects.Select(project => new
            {
                project.id
            }).ToList();
            var templates = await db.EvaluationTemplates.Where(template => !template.isDeleted).Select(template => new
            {
                template.id,
                template.name,
                Projects = template.Projects.Where(project => !project.isDeleted).Select(project => new
                {
                    project.id,
                    project.name
                })
            }).ToListAsync();
            List<EvaluationTemplateListItem> list = new List<EvaluationTemplateListItem>();
            foreach(var entry in templates)
            {
                var projects = entry.Projects.Select(project => new
                {
                    project.id
                });
                if(projects.Intersect(ClientProjects).Any())
                {
                    list.Add(new EvaluationTemplateListItem()
                    {
                        id = entry.id,
                        name = entry.name,
                    });
                }
            }
            
            return Ok(list);
        }

        // GET: api/EvaluationTemplates/5
        [ResponseType(typeof(GetFullEvaluationTemplateResponse))]
        public async Task<IHttpActionResult> GetEvaluationTemplate(int id)
        {
            EvaluationTemplate evaluationTemplate = await db.EvaluationTemplates.FindAsync(id);
            if (evaluationTemplate == null)
            {
                return NotFound();
            }

            var response = new GetFullEvaluationTemplateResponse
            {
                id = evaluationTemplate.id,
                TemplateName = evaluationTemplate.name,
                Criteria = new List<CriteriaRequest>(),
                Topics = new List<TopicRequest>(),
                Categories = evaluationTemplate.Categories.Select(temp => temp.name).ToList()
            };
            foreach (var topic in evaluationTemplate.TopicTemplates)
            {
                var tempTopic = new TopicRequest()
                {
                    id = topic.id,
                    name = topic.name,
                    critical = topic.isCritical,
                    description = topic.description,
                    parentId = topic.TemplateId
                };
                response.Topics.Add(tempTopic);
                foreach(var criteria in topic.CriteriaTemplates)
                {
                    var tempCriteria = new CriteriaRequest()
                    {
                        id = criteria.id,
                        name = criteria.name,
                        points = criteria.points,
                        description = criteria.description,
                        parentId = tempTopic.id,
                    };
                    response.Criteria.Add(tempCriteria);
                }
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("api/EvaluationTemplates/case/{id}")]
        public async Task<IHttpActionResult> GetEvaluationTemplateForCase(int id)
        {
            var templates = await db.EvaluationTemplates.Where(temp => !temp.isDeleted).Select(template => new
            {
                template.id,
                template.name,
                categories = template.Categories.Select(temp => temp.name).ToList(),
                TopicTemplates = template.TopicTemplates.Select(topic => new
                {
                    topic.id,
                    topic.name,
                    topic.description,
                    topic.isCritical,
                    CriteriaTemplates = topic.CriteriaTemplates.Select(criteria => new
                    {
                        criteria.id,
                        criteria.name,
                        criteria.description,
                        criteria.points,
                    })
                })

            }).FirstOrDefaultAsync(template => template.id == id);

            if(templates == null)
            {
                return NotFound();
            }

            return Ok(templates);
        }

        [ResponseType(typeof(UserListResponse))]
        [HttpGet]
        [Route("api/EvaluationTemplates/projects/{id}")]
        public async Task<IHttpActionResult> GetTemplateProjects(int id)
        {
            EvaluationTemplate template = await db.EvaluationTemplates.FindAsync(id);
            if (template == null)
            {
                return NotFound();
            }

            var projects = new List<ProjectsListItem>();
            foreach (var project in template.Projects)
            {
                var item = new ProjectsListItem()
                {
                    id = project.id,
                    name = project.name
                };
                projects.Add(item);
            }

            var entry = new TemplateProjectsResponse
            {
                id = template.id,
                name = template.name,
                projects = projects
            };

            return Ok(entry);
        }

        // PUT: api/EvaluationTemplates/5
        [ResponseType(typeof(void))]
        [HttpPut]
        [Route("api/EvaluationTemplates/full/{id}")]
        public async Task<IHttpActionResult> PutEvaluationTemplate(int id, CreateFullEvaluationTemplateRequest request)
        {
            var template = new EvaluationTemplate()
            {
                name = request.TemplateName,
            };

            foreach (var category in request.Categories)
            {
                template.Categories.Add(new Category()
                {
                    name = category
                });
            }

            var listOfTopics = new List<TopicTemplate>();
            foreach (var topic in request.Topics)
            {
                var tempTopic = new TopicTemplate()
                {
                    name = topic.name,
                    isCritical = topic.critical,
                    description = topic.description,
                    TemplateId = template.id,
                };
                var listOfCriteria = new List<CriteriaTemplate>();
                foreach (var criteria in request.Criteria.Where(temp => temp.parentId == topic.id))
                {
                    var tempCriteria = new CriteriaTemplate()
                    {
                        name = criteria.name,
                        description = criteria.description,
                        points = criteria.points
                    };
                    listOfCriteria.Add(tempCriteria);
                }
                tempTopic.CriteriaTemplates = listOfCriteria;
                listOfTopics.Add(tempTopic);
            }
            template.TopicTemplates = listOfTopics;
            db.EvaluationTemplates.Find(id).isDeleted = true;
            var originalTemplate = db.EvaluationTemplates.Find(id);
            template.Projects = originalTemplate.Projects;

            db.EvaluationTemplates.Add(template);
            await db.SaveChangesAsync();
            return Ok(1);
        }

        [HttpPut]
        [Route("api/EvaluationTemplates/addProject/{id}")]
        public async Task<IHttpActionResult> AddProjectsToUser(int id, int[] add)
        {
            EvaluationTemplate template = await db.EvaluationTemplates.FindAsync(id);
            if (template == null)
            {
                return NotFound();
            }

            foreach (int value in add)
            {
                var temp = db.Projects.Find(value);
                template.Projects.Add(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/EvaluationTemplates/removeProject/{id}")]
        public async Task<IHttpActionResult> RemoveProjectsFromUser(int id, int[] remove)
        {
            EvaluationTemplate template = await db.EvaluationTemplates.FindAsync(id);
            if (template == null)
            {
                return NotFound();
            }

            foreach (int value in remove)
            {
                var temp = db.Projects.Find(value);
                template.Projects.Remove(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
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

            foreach(var category in request.Categories)
            {
                template.Categories.Add(new Category()
                {
                    name = category
                });
            }

            var listOfTopics = new List<TopicTemplate>();
            foreach(var topic in request.Topics)
            {
                var tempTopic = new TopicTemplate()
                {
                    name = topic.name,
                    isCritical = topic.critical,
                    description = topic.description,
                    TemplateId = template.id,
                };
                var listOfCriteria = new List<CriteriaTemplate>();
                foreach(var criteria in request.Criteria.Where(temp => temp.parentId == topic.id))
                {
                    var tempCriteria = new CriteriaTemplate()
                    {
                        name = criteria.name,
                        points = criteria.points,
                        description = criteria.description
                    };
                    listOfCriteria.Add(tempCriteria);
                }
                tempTopic.CriteriaTemplates = listOfCriteria;
                listOfTopics.Add(tempTopic);
            }
            template.TopicTemplates = listOfTopics;
            db.EvaluationTemplates.Add(template);
            await db.SaveChangesAsync();
            return Ok(1);
        }

        [ResponseType(typeof(void))]
        [HttpPost]
        [Route("api/EvaluationTemplates/copy/{id}")]
        public async Task<IHttpActionResult> CopyEvaluationTemplate([FromUri]int id)
        {
            var oldTemplate = await db.EvaluationTemplates.Where(template => !template.isDeleted).FirstOrDefaultAsync(template => template.id == id);
            if (oldTemplate == null)
            {
                return NotFound();
            }

            var newTemplate = new EvaluationTemplate()
            {
                Categories = oldTemplate.Categories.Select(temp => new Category
                {
                    name = temp.name
                }).ToList(),
                isDeleted = false,
                name = oldTemplate.name + "-Copy",
                TopicTemplates = oldTemplate.TopicTemplates.Select(temp => new TopicTemplate
                {
                    description = temp.description,
                    name = temp.name,
                    isCritical = temp.isCritical,
                    CriteriaTemplates = temp.CriteriaTemplates.Select(criteria => new CriteriaTemplate
                    {
                        name = criteria.name,
                        points = criteria.points
                    }).ToList()
                }).ToList()
            };

            db.EvaluationTemplates.Add(newTemplate);
            await db.SaveChangesAsync();
            return Ok(newTemplate.id);
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

        [ResponseType(typeof(void))]
        [HttpPut]
        [Route("api/EvaluationTemplates/markdeleted/{id}")]
        public async Task<IHttpActionResult> MarkDeleted(int id)
        {
            db.EvaluationTemplates.Find(id).isDeleted = true;
            await db.SaveChangesAsync();
            return Ok(id);
        }

        private bool EvaluationTemplateExists(int id)
        {
            return db.EvaluationTemplates.Count(e => e.id == id) > 0;
        }
    }
}