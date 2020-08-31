using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using System.Web.Http.Results;
using Qualitas_Backend.Models;
using Qualitas_Backend.Requests;
using Qualitas_Backend.Responses;
using Qualitas_Backend.Responses.Reports;
using System.Runtime.InteropServices;
using Excel = Microsoft.Office.Interop.Excel;
using Microsoft.Office.Interop.Excel;
using System.Drawing;
using Qualitas_Backend.Responses.Reports.Project;

namespace Qualitas_Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        private DB_QualitasHostedEntities db = new DB_QualitasHostedEntities();

        // GET: api/Users
        public async Task<IHttpActionResult> GetUsers(DateTime start, DateTime end)
        {
            var users = db.Users.Where(user => !user.IsDeleted).Where(user => !user.IsArchived).Select(user => new
            {
                user.id,
                user.username,
                user.password,
                user.firstname,
                user.lastname,
                isArchived = user.IsArchived,
                role = user.RoleType,
                teamId = user.TeamId,
                teamName = user.Team.name,
                caseCount = user.Evaluations.Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Where(temp => !temp.isDeleted).Count(),
                projects = user.Projects.Where(project => !project.isDeleted).Select(project => new
                {
                    project.id,
                    project.name,
                }),
                score = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),

                points = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum()
            });

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/archived")]
        public async Task<IHttpActionResult> GetUsersArchived()
        {
            var users = db.Users.Where(user => !user.IsDeleted).Where(user => user.IsArchived).Select(user => new
            {
                user.id,
                user.firstname,
                user.lastname,
                isArchived = user.IsArchived,
                role = user.RoleType
            });

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/simple")]
        public async Task<IHttpActionResult> GetUserListSimple()
        {
            var users = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new
            {
                user.id,
                role = user.RoleType,
                firstname = user.firstname,
                lastname = user.lastname,
            });

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/credentials/{id}")]
        public async Task<IHttpActionResult> GetUserCredentials(int id)
        {
            var users = await db.Users.Select(user => new
            {
                user.id,
                user.username,
                user.password
            }).FirstOrDefaultAsync(user => user.id == id);

            if(users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/Teams/simple/{id}")]
        public async Task<IHttpActionResult> GetUserListSimpleForTeam(int id)
        {
            var users = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).Where(user => user.TeamId == id || user.TeamId == null).Where(user => user.RoleType == "user").Select(user => new
            {
                user.id,
                role = user.RoleType,
                firstname = user.firstname,
                lastname = user.lastname,
            });

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/Projects/Templates/{id}")]
        public async Task<IHttpActionResult> GetUserListSimpleForProjectsTemplates(int id)
        {
            var users = await db.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new
            {
                user.id,
                firstname = user.firstname,
                lastname = user.lastname,
                Projects = user.Projects.Where(project => !project.isDeleted).Select(project => new
                {
                    project.id,
                    project.name,
                    EvaluationTemplates = project.EvaluationTemplates.Where(template => !template.isDeleted).Select(template => new
                    {
                        template.id,
                        template.name
                    })
                })
            }).FirstOrDefaultAsync(user => user.id == id);

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/Client/Projects/simple/{id}")]
        public async Task<IHttpActionResult> GetClientProjectList(int id)
        {
            var projects = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).FirstOrDefault(user => user.id == id).Projects.Where(project => !project.isDeleted)
                .Select(project => new
                {
                    project.id,
                    project.name
                }).ToList();

            return Ok(projects);
        }

        [HttpGet]
        [Route("api/Users/Client/Users/simple/{id}")]
        public async Task<IHttpActionResult> GetClientUserList(int id)
        {
            var users = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).FirstOrDefault(user => user.id == id).Projects.Where(project => !project.isDeleted)
                .Select(project => project.Users.Where(user => !user.IsArchived && !user.IsDeleted).Where(user => user.RoleType == "user").Select(user => new
                {
                    user.id,
                    user.firstname,
                    user.lastname
                }).ToList()).SelectMany(x => x).Distinct().ToList();

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/Client/Projects/list/{id}")]
        public async Task<IHttpActionResult> GetClientProjects(int id, DateTime start, DateTime end)
        {
            var entry = await db.Users.Where(temp => !temp.IsArchived && !temp.IsDeleted).Select(user => new
            {
                user.id,
                Projects = user.Projects.Where(project => !project.isDeleted).Select(project => new
                {
                    project.id,
                    project.name,
                    templates = project.EvaluationTemplates.Where(template => !template.isDeleted).Select(template => new
                    {
                        template.id,
                        template.name
                    }),
                    userCount = project.Users.Where(temp => !temp.IsArchived && !temp.IsDeleted).Where(temp => temp.RoleType == "user").Count(),
                    caseCount = project.Evaluations.Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Count(),
                    score = project.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),

                    points = project.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum(),
                })
            }).FirstOrDefaultAsync(user => user.id == id);

            if(entry == null)
            {
                return NotFound();
            }

            return Ok(entry);
        }

        [HttpGet]
        [Route("api/Users/review/{id}")]
        public async Task<IHttpActionResult> GetUserReview(int id, DateTime start, DateTime end)
        {
            var users = await db.Users
                .Select(user => new UserReviewResponse(){
                    id = user.id,
                    firstname = user.firstname,
                    lastname = user.lastname,
                    teamId = user.TeamId,
                    teamName = user.Team.name,
                    rating = 0,
                    teamUsersCount = user.Team.Users.Count(),
                    valid = user.Projects.Any(project => project.Evaluations.Count() > 0),
                    projectCount = user.Projects.Where(project => !project.isDeleted).Count(),
                    Evaluations = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new EvaluationResponse()
                    {
                        id = evaluation.id,
                        name = evaluation.name,
                        EvaluationTemplateName = evaluation.EvaluationTemplateName,
                        projectName = evaluation.Project.name,
                        projectId = evaluation.Project.id,
                        createdDate = evaluation.createdDate,
                        updatedDate = evaluation.updatedDate,
                        evaluator = evaluation.Evaluator.firstname + " " + evaluation.Evaluator.lastname,
                        score = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum(),
                        points = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum(),

                    }).OrderByDescending(temp => temp.createdDate).ToList()
                }).FirstOrDefaultAsync(temp => temp.id == id);

            if (users == null)
            {
                return NotFound();
            }

            var teams = await db.Teams
            .Select(team => new {
                id = team.id,
                Users = team.Users.Where(user => !user.IsArchived || !user.IsDeleted).Select(user => new
                {
                    user.id,
                    average = (int?)(user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum() / user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum() * 100)
                }).OrderByDescending(temp => temp.average).ToList()
            }).FirstOrDefaultAsync(temp => temp.id == users.teamId);

            if(users.teamId != null)
            {
                users.rating = teams.Users.FindIndex(temp => temp.id == users.id) + 1;
            }

            return Ok(users);
        }

        [HttpGet]
        [Route("api/Users/report/{id}")]
        public async Task<IHttpActionResult> GetUserReport(int id, DateTime start, DateTime end)
        {
            var evaluations = db.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.UserId == id && evaluation.EvaluationTemplateName != null)
                .Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
                {
                    evaluation.id,
                    evaluation.EvaluationTemplateName,
                    evaluation.CategoryName,
                    Project = new 
                    {
                        evaluation.Project.id,
                        evaluation.Project.name,
                    },
                    Criticals = evaluation.Topics.Where(critical => critical.isCritical).Select(critical => new
                    {
                        critical.name,
                        critical.failed,
                        critical.description
                    }).ToList(),
                    Topics = evaluation.Topics.Where(topic => !topic.isCritical).Select(topic => new
                    {
                        topic.id,
                        topic.name,
                        topic.description,
                        crierias = topic.Criteria.Select(criteria => new
                        {
                            criteria.id,
                            criteria.name,
                            criteria.points,
                            criteria.description,
                            criteria.score,
                            comment = new CommentReport()
                            {
                                comment = criteria.comment,
                                id = evaluation.User.id,
                                name = evaluation.User.firstname + " " + evaluation.User.lastname,
                                evaluatedBy = evaluation.Evaluator.firstname + " " + evaluation.Evaluator.lastname
                            }
                        })
                    }).ToList(),
                }).GroupBy(evaluation => evaluation.Project.id).ToList();

            var projects = new List<ProjectReport>();
            foreach(var projectGroup in evaluations)
            {
                ProjectReport project = new ProjectReport()
                {
                    id = projectGroup.Key,
                    name = projectGroup.FirstOrDefault(temp => temp.Project.id == projectGroup.Key).Project.name
                };
                var ProjectTemplateGroup = projectGroup.GroupBy(group => group.EvaluationTemplateName).ToList();
                List<TemplateReport> templates = new List<TemplateReport>();
                foreach(var evaluationGroup in ProjectTemplateGroup)
                {
                    var template = new TemplateReport();
                    var evaluationTemplate = db.EvaluationTemplates.Where(temp => !temp.isDeleted).FirstOrDefault(temp => temp.name == evaluationGroup.Key);
                    template.id = evaluationTemplate.id;
                    template.name = evaluationTemplate.name;
                    template.caseCount = evaluationGroup.Count();
                    template.categories = evaluationTemplate.Categories.Select(category => category.name).ToList();

                    var categoryEvaluationGroup = evaluationGroup.GroupBy(temp => temp.CategoryName);
                    template.categoryReports = categoryEvaluationGroup.Select(category => new CategoryReport()
                    {
                        name = category.Key,
                        caseCount = evaluationGroup.Where(group => group.CategoryName == category.Key).Count(),

                        criticals = evaluationTemplate.TopicTemplates.Where(topic => topic.isCritical).Select(topic => new CrititalReport()
                        {
                            name = topic.name,
                            description = topic.description,
                            breachedCount = category.Select(group => group.Criticals.Where(critical => critical.name == topic.name).Where(critical => critical.failed).Count()).Sum()
                        }).ToList(),
                        topics = evaluationTemplate.TopicTemplates.Where(topic => !topic.isCritical).Select(topic => new TopicReport()
                        {
                            name = topic.name,
                            description = topic.description,
                            criterias = topic.CriteriaTemplates.Select(criteria => new CriteriaReport()
                            {
                                name = criteria.name,
                                description = criteria.description,
                                score = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.score).Sum()).Sum()).Sum(),
                                points = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.points).Sum()).Sum()).Sum(),
                                comments = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.comment)).SelectMany(x => x)).SelectMany(x => x).Where(x => x.comment != "").ToList()
                            }).ToList()
                        }).ToList()
                    }).ToList();

                    templates.Add(template);
                }

                project.templates = templates;
                projects.Add(project);
            }

            foreach(var project in projects)
            {
                foreach (var template in project.templates)
                {
                    foreach (var category in template.categoryReports)
                    {
                        foreach (var topic in category.topics)
                        {
                            topic.score = topic.criterias.Select(criteria => criteria.score).Sum();
                            topic.points = topic.criterias.Select(criteria => criteria.points).Sum();
                        }
                        category.score = category.topics.Select(topic => topic.score).Sum();
                        category.points = category.topics.Select(topic => topic.points).Sum();
                    }
                    template.score = template.categoryReports.Select(category => category.score).Sum();
                    template.points = template.categoryReports.Select(category => category.points).Sum();
                }
                project.score = project.templates.Select(temp => temp.score).Sum();
                project.points = project.templates.Select(temp => temp.points).Sum();
                project.caseCount = project.templates.Select(temp => temp.caseCount).Sum();
            }
            return Ok(projects);
        }

        [HttpGet]
        [Route("api/Users/all/download")]
        public HttpResponseMessage GetAllUsersReport(DateTime start, DateTime end)
        {
            Excel.Application xlApp = new Excel.Application();
            if (xlApp == null)
            {
                Console.WriteLine("No excel");
                return null;
            }

            xlApp.DisplayAlerts = false;

            Excel.Workbook xlWorkBook;
            Excel.Worksheet xlWorkSheet;
            object misValue = System.Reflection.Missing.Value;
            xlWorkBook = xlApp.Workbooks.Add(misValue);
            xlWorkBook.CheckCompatibility = false;
            xlWorkBook.DoNotPromptForConvert = true;

            var users = db.Users.Where(user => !user.IsArchived && !user.IsDeleted && user.RoleType == "user").Select(user => new
            {
                user.id,
                name = user.firstname + " " + user.lastname,
                evaluationCount = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Count(),
                score = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end)
                .Select(evaluation => evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).Sum()).Sum()).Sum(),
                points = user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end)
                .Select(evaluation => evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).Sum()).Sum()).Sum(),
            }).OrderByDescending(temp => temp.evaluationCount).ToList();
            xlWorkSheet = (Excel.Worksheet)xlWorkBook.Worksheets.Add();
            xlWorkSheet.get_Range("A1", "Z400").Cells.VerticalAlignment = Excel.XlHAlign.xlHAlignCenter;
            xlWorkSheet.get_Range("A1", "Z400").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
            xlWorkSheet.get_Range("A1", "Z400").Cells.WrapText = true;
            xlWorkSheet.Range[xlWorkSheet.Cells[1, 1], xlWorkSheet.Cells[1, 5]].Merge();
            xlWorkSheet.Range[xlWorkSheet.Cells[1, 1], xlWorkSheet.Cells[1, 5]].Merge();
            xlWorkSheet.Cells[1,1] = start.ToString("yyyy-MM-dd") + " " + end.ToString("yyyy-MM-dd");
            xlWorkSheet.Range[xlWorkSheet.Cells[1,1], xlWorkSheet.Cells[users.Count() + 3, 5]].Cells.Borders.LineStyle = XlLineStyle.xlContinuous;
            xlWorkSheet.Range[xlWorkSheet.Cells[3, 2], xlWorkSheet.Cells[users.Count() + 2, 5]].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
            xlWorkSheet.Range[xlWorkSheet.Cells[2, 1], xlWorkSheet.Cells[2, 5]].Interior.Color = ColorTranslator.ToOle(Color.LightPink);
            xlWorkSheet.Range[xlWorkSheet.Cells[3, 1], xlWorkSheet.Cells[users.Count() + 2, 1]].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
            xlWorkSheet.Columns[1].ColumnWidth = 22;
            xlWorkSheet.Columns[2].ColumnWidth = 22;
            xlWorkSheet.Columns[3].ColumnWidth = 22;
            xlWorkSheet.Columns[4].ColumnWidth = 22;
            xlWorkSheet.Columns[5].ColumnWidth = 22;

            xlWorkSheet.Name = "All Users";
            xlWorkSheet.Cells[2, 1] = "User";
            xlWorkSheet.Cells[2, 2] = "Evaluated cases";
            xlWorkSheet.Cells[2, 3] = "Max score";
            xlWorkSheet.Cells[2, 4] = "Achieved score";
            xlWorkSheet.Cells[2, 5] = "Total score";

            int startRow = 3;

            foreach(var user in users)
            {
                xlWorkSheet.Cells[startRow, 1] = user.name;
                xlWorkSheet.Cells[startRow, 2] = user.evaluationCount;
                if(user.evaluationCount == 0)
                {
                    xlWorkSheet.Cells[startRow, 3] = 0;
                    xlWorkSheet.Cells[startRow, 4] = 0;
                    xlWorkSheet.Cells[startRow, 5] = "0%";
                }
                else
                {
                    xlWorkSheet.Cells[startRow, 3] = user.points;
                    xlWorkSheet.Cells[startRow, 4] = user.score;
                    try
                    {
                        var average = user.score / user.points * 10000 / 100;
                        xlWorkSheet.Cells[startRow, 5] = average + "%";
                    }
                    catch (DivideByZeroException e)
                    {
                        xlWorkSheet.Cells[startRow, 5] = "0%";
                    }
                }
                startRow++;
            }
            xlWorkSheet.Range[xlWorkSheet.Cells[startRow, 1], xlWorkSheet.Cells[startRow, 5]].Interior.Color = ColorTranslator.ToOle(Color.LightPink);
            xlWorkSheet.Cells[startRow, 1] = "Total:";
            xlWorkSheet.Cells[startRow, 2] = users.Select(user => user.evaluationCount).Sum();
            var score = xlWorkSheet.Cells[startRow, 2] = users.Select(user => user.score).Sum();
            var points = xlWorkSheet.Cells[startRow, 2] = users.Select(user => user.points).Sum();
            xlWorkSheet.Cells[startRow, 3] = score;
            xlWorkSheet.Cells[startRow, 4] = points;
            var Totalaverage = score / points;
            xlWorkSheet.Cells[startRow, 5] = Totalaverage * 10000 / 100 + "%";

            xlWorkBook.SaveAs("d:\\Excel\\csharp-Excel2.xls", Excel.XlFileFormat.xlWorkbookNormal, misValue, misValue, misValue, misValue, Excel.XlSaveAsAccessMode.xlExclusive, misValue, misValue, misValue, misValue, misValue);
            xlWorkBook.Close(true, misValue, misValue);
            xlApp.Quit();

            Marshal.ReleaseComObject(xlWorkBook);
            Marshal.ReleaseComObject(xlApp);
            var fileBytes = File.ReadAllBytes("d:\\Excel\\csharp-Excel2.xls");
            File.Delete("d:\\Excel\\csharp-Excel.xls");
            var response = new HttpResponseMessage(HttpStatusCode.OK);
            var fileMemoryStream = new MemoryStream(fileBytes);
            response.Content = new StreamContent(fileMemoryStream);
            var headers = response.Content.Headers;
            headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            headers.ContentDisposition.FileName = "Report_" + start.Date + "-" + end.Date + ".xls";
            headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
            headers.ContentLength = fileMemoryStream.Length;
            return response;
        }

        [HttpGet]
        [Route("api/Users/Client/report/download/{id}")]
        public HttpResponseMessage GetUserClientReportDownload(int id, int clientId, DateTime start, DateTime end)
        {
            List<int> clientProjectIds = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).FirstOrDefault(user => user.id == clientId).Projects.Select(project => project.id).ToList();
            var evaluations = db.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.UserId == id && evaluation.EvaluationTemplateName != null)
                .Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
                {
                    evaluation.id,
                    evaluation.EvaluationTemplateName,
                    evaluation.CategoryName,
                    Project = new
                    {
                        evaluation.Project.id,
                        evaluation.Project.name,
                    },
                    Criticals = evaluation.Topics.Where(critical => critical.isCritical).Select(critical => new
                    {
                        critical.name,
                        critical.failed
                    }).ToList(),
                    Topics = evaluation.Topics.Where(topic => !topic.isCritical).Select(topic => new
                    {
                        topic.id,
                        topic.name,
                        topic.description,
                        crierias = topic.Criteria.Select(criteria => new
                        {
                            criteria.id,
                            criteria.name,
                            criteria.description,
                            criteria.points,
                            criteria.score
                        })
                    }).ToList(),
                }).Where(evaluation => clientProjectIds.Contains(evaluation.Project.id)).GroupBy(evaluation => evaluation.Project.id).ToList();

            Excel.Application xlApp = new
             Excel.Application();

            if (xlApp == null)
            {
                Console.WriteLine("No excel");
                return null;
            }

            xlApp.DisplayAlerts = false;

            Excel.Workbook xlWorkBook;
            Excel.Worksheet xlWorkSheet;
            object misValue = System.Reflection.Missing.Value;
            xlWorkBook = xlApp.Workbooks.Add(misValue);
            xlWorkBook.CheckCompatibility = false;
            xlWorkBook.DoNotPromptForConvert = true;

            foreach (var ProjectGroup in evaluations)
            {
                xlWorkSheet = (Excel.Worksheet)xlWorkBook.Worksheets.Add();
                xlWorkSheet.Name = ProjectGroup.Select(temp => temp.Project.name).ToList()[0];
                //xlWorkSheet.get_Range("A1", "Z200").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("A1", "Z400").Cells.VerticalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("A1", "A400").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("A1", "Z3").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("D3", "Z400").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("A1", "Z400").Cells.WrapText = true;
                xlWorkSheet.get_Range("A1", "Z200").Cells.Borders.LineStyle = XlLineStyle.xlContinuous;
                xlWorkSheet.Columns[1].ColumnWidth = 16.50;
                xlWorkSheet.Columns[2].ColumnWidth = 21.00;
                xlWorkSheet.Columns[3].ColumnWidth = 88.29;
                xlWorkSheet.Cells[1, 3] = start.ToString("yyyy-MM-dd") + " " + end.ToString("yyyy-MM-dd");
                var categoryGroup = ProjectGroup.GroupBy(group => group.EvaluationTemplateName).ToList();

                int topicStartRow = 3;
                int startColumn = 1;

                foreach (var category in categoryGroup)
                {
                    var evaluationTemplate = db.EvaluationTemplates.Where(temp => !temp.isDeleted).FirstOrDefault(temp => temp.name == category.Key);
                    startColumn = 1;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn + 3]].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "Template";
                    startColumn++;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn + 1]].Merge();
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "Topic/Subcriteria";
                    startColumn++;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "Descriptions";
                    startColumn++;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "Max Points";
                    startColumn++;
                    topicStartRow += 2;


                    for (int i = 1; i <= category.Count(); i++)
                    {
                        xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow - 2, startColumn], xlWorkSheet.Cells[topicStartRow - 1, startColumn]].Merge();
                        xlWorkSheet.Cells[topicStartRow - 2, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                        xlWorkSheet.Cells[topicStartRow - 2, startColumn] = i;
                        startColumn++;
                    }
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow - 2, startColumn], xlWorkSheet.Cells[topicStartRow - 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow - 2, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                    xlWorkSheet.Cells[topicStartRow - 2, startColumn] = "Total MAX";
                    startColumn++;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow - 2, startColumn], xlWorkSheet.Cells[topicStartRow - 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow - 2, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                    xlWorkSheet.Cells[topicStartRow - 2, startColumn] = "Total achieved";
                    int currentCategoryStart = topicStartRow;
                    foreach (var critical in evaluationTemplate.TopicTemplates.Where(topic => topic.isCritical))
                    {
                        startColumn = 5;
                        xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, 2], xlWorkSheet.Cells[topicStartRow, 3]].Merge();
                        xlWorkSheet.Cells[topicStartRow, 2].Interior.Color = ColorTranslator.ToOle(Color.IndianRed);
                        xlWorkSheet.Cells[topicStartRow, 2] = critical.name;
                        xlWorkSheet.Cells[topicStartRow, 4] = "Critical";
                        foreach (var evaluation in category)
                        {
                            bool breached = evaluation.Criticals.FirstOrDefault(tempCritical => tempCritical.name == critical.name).failed;
                            if (breached)
                            {
                                xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.IndianRed);
                                xlWorkSheet.Cells[topicStartRow, startColumn] = "failed";
                            }
                            else
                            {
                                xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                            }
                            startColumn++;
                        }
                        xlWorkSheet.Cells[topicStartRow, startColumn] = "100%";
                        xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                        startColumn++;
                        var totalCount = category.Count();
                        var failedCount = category.Select(temp => temp.Criticals.Where(tempCritical => tempCritical.name == critical.name && tempCritical.failed).Count()).Sum();
                        var succesfullCount = totalCount - failedCount;
                        try
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                            double result = (double)succesfullCount / (double)totalCount;
                            xlWorkSheet.Cells[topicStartRow, startColumn] = result * 100 + "%";
                        }
                        catch (DivideByZeroException e)
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn] = "0%";
                        }

                        topicStartRow += 1;
                    }
                    startColumn = 5;
                    foreach (var topic in evaluationTemplate.TopicTemplates.Where(temp => !temp.isCritical))
                    {
                        xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, 2], xlWorkSheet.Cells[topicStartRow, 3]].Merge();
                        xlWorkSheet.Cells[topicStartRow, 2].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
                        xlWorkSheet.Cells[topicStartRow, 2] = topic.name;

                        foreach (var evaluation in category)
                        {
                            var score = evaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Select(tempCriteria => tempCriteria.score).Sum();
                            xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
                            xlWorkSheet.Cells[topicStartRow, startColumn] = score;
                            startColumn++;
                        }
                        xlWorkSheet.Cells[topicStartRow, startColumn] = "100%";
                        xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
                        startColumn++;
                        try
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
                            var score = category.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Select(tempCriteria => tempCriteria.score).Sum()).Sum();
                            var points = category.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Select(tempCriteria => tempCriteria.points).Sum()).Sum();
                            xlWorkSheet.Cells[topicStartRow, startColumn] = score / points * 100 + "%";
                        }
                        catch (DivideByZeroException e)
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn] = "0%";
                        }

                        startColumn = 5;

                        xlWorkSheet.Cells[topicStartRow, 4] = topic.CriteriaTemplates.Select(temp => temp.points).Sum();
                        foreach (var criteria in topic.CriteriaTemplates)
                        {
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, 2], xlWorkSheet.Cells[topicStartRow + 2, 2]].Merge();
                            xlWorkSheet.Cells[topicStartRow + 1, 2] = criteria.name;
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, 3], xlWorkSheet.Cells[topicStartRow + 2, 3]].Merge();
                            xlWorkSheet.Cells[topicStartRow + 1, 3] = criteria.description;
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, 4], xlWorkSheet.Cells[topicStartRow + 2, 4]].Merge();
                            xlWorkSheet.Cells[topicStartRow + 1, 4] = criteria.points;
                            foreach (var evaluation in category)
                            {
                                var score = evaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.FirstOrDefault(tempCriteria => tempCriteria.name == criteria.name).score;
                                xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, startColumn], xlWorkSheet.Cells[topicStartRow + 2, startColumn]].Merge();
                                try
                                {
                                    xlWorkSheet.Cells[topicStartRow + 1, startColumn] = score;
                                    xlWorkSheet.Cells[topicStartRow + 1, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                                }
                                catch (DivideByZeroException e)
                                {
                                    xlWorkSheet.Cells[topicStartRow + 1, startColumn] = "0%";
                                }
                                startColumn++;
                            }
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, startColumn], xlWorkSheet.Cells[topicStartRow + 2, startColumn]].Merge();
                            xlWorkSheet.Cells[topicStartRow + 1, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                            xlWorkSheet.Cells[topicStartRow + 1, startColumn] = "100%";
                            startColumn++;
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, startColumn], xlWorkSheet.Cells[topicStartRow + 2, startColumn]].Merge();
                            try
                            {
                                xlWorkSheet.Cells[topicStartRow + 1, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                                var score = category.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.score).Sum()).Sum();
                                var points = category.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.points).Sum()).Sum();
                                xlWorkSheet.Cells[topicStartRow + 1, startColumn] = score / points * 100 + "%";
                            }
                            catch (DivideByZeroException e)
                            {
                                xlWorkSheet.Cells[topicStartRow + 1, startColumn] = "0%";
                            }
                            startColumn = 5;
                            topicStartRow += 2;
                        }
                        topicStartRow += 1;
                        xlWorkSheet.Range[xlWorkSheet.Cells[currentCategoryStart, 1], xlWorkSheet.Cells[topicStartRow - 1, 1]].Merge();
                        xlWorkSheet.Cells[currentCategoryStart, 1] = category.Key;
                    }
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, 1], xlWorkSheet.Cells[topicStartRow, 3]].Merge();
                    xlWorkSheet.Cells[topicStartRow, 1] = "Total:";

                    xlWorkSheet.Cells[topicStartRow, startColumn - 1] = evaluationTemplate.TopicTemplates.Select(topic => topic.CriteriaTemplates.Select(criteria => criteria.points).Sum()).Sum();
                    double OverallScore = 0;
                    int OverallPoints = 0;
                    foreach (var evaluation in category)
                    {
                        var score = evaluation.Topics.Select(topic => topic.crierias.Select(criteria => criteria.score).Sum()).Sum();
                        var points = evaluation.Topics.Select(topic => topic.crierias.Select(criteria => criteria.points).Sum()).Sum();
                        try
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn] = score;
                        }
                        catch (DivideByZeroException e)
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn] = "0%";
                        }
                        finally
                        {
                            OverallScore += score;
                            OverallPoints += points;
                        }
                        startColumn++;
                    }
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "100%";
                    try
                    {
                        xlWorkSheet.Cells[topicStartRow, startColumn + 1] = OverallScore / OverallPoints * 100 + "%";
                    }
                    catch (DivideByZeroException e)
                    {
                        xlWorkSheet.Cells[topicStartRow, startColumn] = "0%";
                    }


                    topicStartRow += 2;
                }

            }

            xlWorkBook.SaveAs("d:\\Excel\\csharp-Excel.xls", Excel.XlFileFormat.xlWorkbookNormal, misValue, misValue, misValue, misValue, Excel.XlSaveAsAccessMode.xlExclusive, misValue, misValue, misValue, misValue, misValue);
            xlWorkBook.Close(true, misValue, misValue);
            xlApp.Quit();

            Marshal.ReleaseComObject(xlWorkBook);
            Marshal.ReleaseComObject(xlApp);
            var fileBytes = File.ReadAllBytes("d:\\Excel\\csharp-Excel.xls");
            File.Delete("d:\\Excel\\csharp-Excel.xls");


            var response = new HttpResponseMessage(HttpStatusCode.OK);
            var fileMemoryStream = new MemoryStream(fileBytes);
            response.Content = new StreamContent(fileMemoryStream);
            var headers = response.Content.Headers;
            headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            headers.ContentDisposition.FileName = "Report_" + start.Date + "-" + end.Date + ".xls";
            headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
            headers.ContentLength = fileMemoryStream.Length;
            return response;
        }

        [HttpGet]
        [Route("api/Users/report/download/{id}")]
        public HttpResponseMessage GetUserReportDownload(int id, DateTime start, DateTime end)
        {
            var evaluations = db.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.UserId == id && evaluation.EvaluationTemplateName != null)
                .Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
                {
                    evaluation.id,
                    evaluation.EvaluationTemplateName,
                    evaluation.CategoryName,
                    Project = new
                    {
                        evaluation.Project.id,
                        evaluation.Project.name,
                    },
                    Criticals = evaluation.Topics.Where(critical => critical.isCritical).Select(critical => new
                    {
                        critical.name,
                        critical.failed,
                        critical.description
                    }).ToList(),
                    Topics = evaluation.Topics.Where(topic => !topic.isCritical).Select(topic => new
                    {
                        topic.id,
                        topic.name,
                        topic.description,
                        crierias = topic.Criteria.Select(criteria => new
                        {
                            criteria.id,
                            criteria.name,
                            criteria.points,
                            criteria.score,
                            criteria.comment
                        })
                    }).ToList(),
                }).GroupBy(evaluation => evaluation.Project.name).ToList();

            Excel.Application xlApp = new
             Excel.Application();

            if (xlApp == null)
            {
                Console.WriteLine("No excel");
                return null;
            }

            xlApp.DisplayAlerts = false;

            Excel.Workbook xlWorkBook;
            Excel.Worksheet xlWorkSheet;
            object misValue = System.Reflection.Missing.Value;
            xlWorkBook = xlApp.Workbooks.Add(misValue);
            xlWorkBook.CheckCompatibility = false;
            xlWorkBook.DoNotPromptForConvert = true;

            foreach(var ProjectGroup in evaluations)
            {
                xlWorkSheet = (Excel.Worksheet)xlWorkBook.Worksheets.Add();
                xlWorkSheet.Name = ProjectGroup.Key.ToString();
                //xlWorkSheet.get_Range("A1", "Z200").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("A1", "Z400").Cells.VerticalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("A1", "A400").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("A1", "Z3").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("D3", "Z400").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                xlWorkSheet.get_Range("A1", "Z400").Cells.WrapText = true;
                xlWorkSheet.get_Range("A1", "Z200").Cells.Borders.LineStyle = XlLineStyle.xlContinuous;
                xlWorkSheet.Columns[1].ColumnWidth = 16.50;
                xlWorkSheet.Columns[2].ColumnWidth = 21.00;
                xlWorkSheet.Columns[3].ColumnWidth = 88.29;
                xlWorkSheet.Cells[1, 3] = start.ToString("yyyy-MM-dd") + " " + end.ToString("yyyy-MM-dd");
                var categoryGroup = ProjectGroup.GroupBy(group => group.EvaluationTemplateName).ToList();

                int topicStartRow = 3;
                int startColumn = 1;

                foreach (var category in categoryGroup)
                {
                    var evaluationTemplate = db.EvaluationTemplates.Where(temp => !temp.isDeleted).FirstOrDefault(temp => temp.name == category.Key);
                    startColumn = 1;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn + 3]].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "Template";
                    startColumn++;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn + 1]].Merge();
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "Topic/Subcriteria";
                    startColumn++;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "Descriptions";
                    startColumn++;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "Max Points";
                    startColumn++;
                    topicStartRow += 2;


                    for (int i = 1; i <= category.Count(); i++)
                    {
                        xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow - 2, startColumn], xlWorkSheet.Cells[topicStartRow - 1, startColumn]].Merge();
                        xlWorkSheet.Cells[topicStartRow - 2, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                        xlWorkSheet.Cells[topicStartRow - 2, startColumn] = i;
                        startColumn++;
                    }
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow - 2, startColumn], xlWorkSheet.Cells[topicStartRow - 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow - 2, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                    xlWorkSheet.Cells[topicStartRow - 2, startColumn] = "Total MAX";
                    startColumn++;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow - 2, startColumn], xlWorkSheet.Cells[topicStartRow - 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow - 2, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                    xlWorkSheet.Cells[topicStartRow - 2, startColumn] = "Total achieved";
                    int currentCategoryStart = topicStartRow;
                    foreach (var critical in evaluationTemplate.TopicTemplates.Where(topic => topic.isCritical))
                    {
                        startColumn = 5;
                        xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, 2], xlWorkSheet.Cells[topicStartRow, 3]].Merge();
                        xlWorkSheet.Cells[topicStartRow, 2].Interior.Color = ColorTranslator.ToOle(Color.IndianRed);
                        xlWorkSheet.Cells[topicStartRow, 2] = critical.name;
                        xlWorkSheet.Cells[topicStartRow, 4] = "Critical";
                        foreach (var evaluation in category)
                        {
                            bool breached = evaluation.Criticals.FirstOrDefault(tempCritical => tempCritical.name == critical.name).failed;
                            if (breached)
                            {
                                xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.IndianRed);
                                xlWorkSheet.Cells[topicStartRow, startColumn] = "failed";
                            }
                            else
                            {
                                xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                            }
                            startColumn++;
                        }
                        xlWorkSheet.Cells[topicStartRow, startColumn] = "100%";
                        xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                        startColumn++;
                        var totalCount = category.Count();
                        var failedCount = category.Select(temp => temp.Criticals.Where(tempCritical => tempCritical.name == critical.name && tempCritical.failed).Count()).Sum();
                        var succesfullCount = totalCount - failedCount;
                        try
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                            double result = (double)succesfullCount / (double)totalCount;
                            xlWorkSheet.Cells[topicStartRow, startColumn] = result * 100 + "%";
                        }
                        catch (DivideByZeroException e)
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn] = "0%";
                        }

                        topicStartRow += 1;
                    }
                    startColumn = 5;
                    foreach (var topic in evaluationTemplate.TopicTemplates.Where(temp => !temp.isCritical))
                    {
                        xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, 2], xlWorkSheet.Cells[topicStartRow, 3]].Merge();
                        xlWorkSheet.Cells[topicStartRow, 2].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
                        xlWorkSheet.Cells[topicStartRow, 2] = topic.name;

                        foreach (var evaluation in category)
                        {
                            var score = evaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Select(tempCriteria => tempCriteria.score).Sum();
                            xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
                            xlWorkSheet.Cells[topicStartRow, startColumn] = score;
                            startColumn++;
                        }
                        xlWorkSheet.Cells[topicStartRow, startColumn] = "100%";
                        xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
                        startColumn++;
                        try
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
                            var score = category.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Select(tempCriteria => tempCriteria.score).Sum()).Sum();
                            var points = category.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Select(tempCriteria => tempCriteria.points).Sum()).Sum();
                            xlWorkSheet.Cells[topicStartRow, startColumn] = score / points * 100 + "%";
                        }
                        catch (DivideByZeroException e)
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn] = "0%";
                        }

                        startColumn = 5;

                        xlWorkSheet.Cells[topicStartRow, 4] = topic.CriteriaTemplates.Select(temp => temp.points).Sum();
                        foreach (var criteria in topic.CriteriaTemplates)
                        {
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, 2], xlWorkSheet.Cells[topicStartRow + 2, 2]].Merge();
                            xlWorkSheet.Cells[topicStartRow + 1, 2] = criteria.name;
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, 3], xlWorkSheet.Cells[topicStartRow + 2, 3]].Merge();
                            xlWorkSheet.Cells[topicStartRow + 1, 3] = criteria.description;
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, 4], xlWorkSheet.Cells[topicStartRow + 2, 4]].Merge();
                            xlWorkSheet.Cells[topicStartRow + 1, 4] = criteria.points;
                            foreach (var evaluation in category)
                            {
                                var score = evaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.FirstOrDefault(tempCriteria => tempCriteria.name == criteria.name).score;
                                xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, startColumn], xlWorkSheet.Cells[topicStartRow + 2, startColumn]].Merge();
                                try
                                {
                                    xlWorkSheet.Cells[topicStartRow + 1, startColumn] = score;
                                    xlWorkSheet.Cells[topicStartRow + 1, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                                }
                                catch (DivideByZeroException e)
                                {
                                    xlWorkSheet.Cells[topicStartRow + 1, startColumn] = "0%";
                                }
                                startColumn++;
                            }
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, startColumn], xlWorkSheet.Cells[topicStartRow + 2, startColumn]].Merge();
                            xlWorkSheet.Cells[topicStartRow + 1, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                            xlWorkSheet.Cells[topicStartRow + 1, startColumn] = "100%";
                            startColumn++;
                            xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow + 1, startColumn], xlWorkSheet.Cells[topicStartRow + 2, startColumn]].Merge();
                            try
                            {
                                xlWorkSheet.Cells[topicStartRow + 1, startColumn].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                                var score = category.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.score).Sum()).Sum();
                                var points = category.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.points).Sum()).Sum();
                                xlWorkSheet.Cells[topicStartRow + 1, startColumn] = score / points * 100 + "%";
                            }
                            catch (DivideByZeroException e)
                            {
                                xlWorkSheet.Cells[topicStartRow + 1, startColumn] = "0%";
                            }
                            startColumn = 5;
                            topicStartRow += 2;
                        }
                        topicStartRow += 1;
                        xlWorkSheet.Range[xlWorkSheet.Cells[currentCategoryStart, 1], xlWorkSheet.Cells[topicStartRow - 1, 1]].Merge();
                        xlWorkSheet.Cells[currentCategoryStart, 1] = category.Key;
                    }
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, 1], xlWorkSheet.Cells[topicStartRow, 3]].Merge();
                    xlWorkSheet.Cells[topicStartRow, 1] = "Total:";

                    xlWorkSheet.Cells[topicStartRow, startColumn - 1] = evaluationTemplate.TopicTemplates.Select(topic => topic.CriteriaTemplates.Select(criteria => criteria.points).Sum()).Sum();
                    double OverallScore = 0;
                    int OverallPoints = 0;
                    foreach (var evaluation in category)
                    {
                        var score = evaluation.Topics.Select(topic => topic.crierias.Select(criteria => criteria.score).Sum()).Sum();
                        var points = evaluation.Topics.Select(topic => topic.crierias.Select(criteria => criteria.points).Sum()).Sum();
                        try
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn] = score;
                        }
                        catch (DivideByZeroException e)
                        {
                            xlWorkSheet.Cells[topicStartRow, startColumn] = "0%";
                        }
                        finally
                        {
                            OverallScore += score;
                            OverallPoints += points;
                        }
                        startColumn++;
                    }
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "100%";
                    try
                    {
                        xlWorkSheet.Cells[topicStartRow, startColumn + 1] = OverallScore / OverallPoints * 100 + "%";
                    }
                    catch (DivideByZeroException e)
                    {
                        xlWorkSheet.Cells[topicStartRow, startColumn] = "0%";
                    }


                    topicStartRow += 2;
                }

            }

            xlWorkBook.SaveAs("d:\\Excel\\csharp-Excel.xls", Excel.XlFileFormat.xlWorkbookNormal, misValue, misValue, misValue, misValue, Excel.XlSaveAsAccessMode.xlExclusive, misValue, misValue, misValue, misValue, misValue);
            xlWorkBook.Close(true, misValue, misValue);
            xlApp.Quit();

            Marshal.ReleaseComObject(xlWorkBook);
            Marshal.ReleaseComObject(xlApp);
            var fileBytes = File.ReadAllBytes("d:\\Excel\\csharp-Excel.xls");
            File.Delete("d:\\Excel\\csharp-Excel.xls");


            var response = new HttpResponseMessage(HttpStatusCode.OK);
            var fileMemoryStream = new MemoryStream(fileBytes);
            response.Content = new StreamContent(fileMemoryStream);
            var headers = response.Content.Headers;
            headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            headers.ContentDisposition.FileName = "Report_" + start.Date + "-" + end.Date + ".xls";
            headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
            headers.ContentLength = fileMemoryStream.Length;
            return response;
        }

        [HttpGet]
        [Route("api/Users/Client/report/{id}")]
        public async Task<IHttpActionResult> GetClientUserReport(int id, int clientId, DateTime start, DateTime end)
        {
            List<int> clientProjectIds = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).FirstOrDefault(user => user.id == clientId).Projects.Select(project => project.id).ToList();

            var evaluations = db.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.UserId == id && evaluation.EvaluationTemplateName != null)
                .Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
                {
                    evaluation.id,
                    evaluation.EvaluationTemplateName,
                    evaluation.CategoryName,
                    Project = new
                    {
                        evaluation.Project.id,
                        evaluation.Project.name,
                    },
                    Criticals = evaluation.Topics.Where(critical => critical.isCritical).Select(critical => new
                    {
                        critical.name,
                        critical.failed
                    }).ToList(),
                    Topics = evaluation.Topics.Where(topic => !topic.isCritical).Select(topic => new
                    {
                        topic.id,
                        topic.name,
                        topic.description,
                        crierias = topic.Criteria.Select(criteria => new
                        {
                            criteria.id,
                            criteria.name,
                            criteria.description,
                            criteria.points,
                            criteria.score,
                            comment = new CommentReport()
                            {
                                comment = criteria.comment,
                                id = evaluation.User.id,
                                name = evaluation.User.firstname + " " + evaluation.User.lastname,
                                evaluatedBy = evaluation.Evaluator.firstname + " " + evaluation.Evaluator.lastname
                            }
                        })
                    }).ToList(),
                }).Where(evaluation => clientProjectIds.Contains(evaluation.Project.id)).GroupBy(evaluation => evaluation.Project.id).ToList();

            var projects = new List<ProjectReport>();
            foreach (var projectGroup in evaluations)
            {
                ProjectReport project = new ProjectReport()
                {
                    id = projectGroup.Key,
                    name = projectGroup.FirstOrDefault(temp => temp.Project.id == projectGroup.Key).Project.name
                };
                var ProjectTemplateGroup = projectGroup.GroupBy(group => group.EvaluationTemplateName).ToList();
                List<TemplateReport> templates = new List<TemplateReport>();
                foreach (var evaluationGroup in ProjectTemplateGroup)
                {
                    var template = new TemplateReport();
                    var evaluationTemplate = db.EvaluationTemplates.Where(temp => !temp.isDeleted).FirstOrDefault(temp => temp.name == evaluationGroup.Key);
                    template.id = evaluationTemplate.id;
                    template.name = evaluationTemplate.name;
                    template.caseCount = evaluationGroup.Count();
                    template.categories = evaluationTemplate.Categories.Select(category => category.name).ToList();

                    var categoryEvaluationGroup = evaluationGroup.GroupBy(temp => temp.CategoryName);
                    template.categoryReports = categoryEvaluationGroup.Select(category => new CategoryReport()
                    {
                        name = category.Key,
                        caseCount = evaluationGroup.Where(group => group.CategoryName == category.Key).Count(),

                        criticals = evaluationTemplate.TopicTemplates.Where(topic => topic.isCritical).Select(topic => new CrititalReport()
                        {
                            name = topic.name,
                            description = topic.description,
                            breachedCount = category.Select(group => group.Criticals.Where(critical => critical.name == topic.name).Where(critical => critical.failed).Count()).Sum()
                        }).ToList(),
                        topics = evaluationTemplate.TopicTemplates.Where(topic => !topic.isCritical).Select(topic => new TopicReport()
                        {
                            name = topic.name,
                            criterias = topic.CriteriaTemplates.Select(criteria => new CriteriaReport()
                            {
                                name = criteria.name,
                                description = criteria.description,
                                score = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.score).Sum()).Sum()).Sum(),
                                points = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.points).Sum()).Sum()).Sum(),
                                comments = category.Select(group => group.Topics.Where(tempTopic => tempTopic.name == topic.name).Select(tempTopic => tempTopic.crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.comment)).SelectMany(x => x)).SelectMany(x => x).Where(x => x.comment != "").ToList()
                            }).ToList()
                        }).ToList()
                    }).ToList();

                    templates.Add(template);
                }

                project.templates = templates;
                projects.Add(project);
            }

            foreach (var project in projects)
            {
                foreach (var template in project.templates)
                {
                    foreach (var category in template.categoryReports)
                    {
                        foreach (var topic in category.topics)
                        {
                            topic.score = topic.criterias.Select(criteria => criteria.score).Sum();
                            topic.points = topic.criterias.Select(criteria => criteria.points).Sum();
                        }
                        category.score = category.topics.Select(topic => topic.score).Sum();
                        category.points = category.topics.Select(topic => topic.points).Sum();
                    }
                    template.score = template.categoryReports.Select(category => category.score).Sum();
                    template.points = template.categoryReports.Select(category => category.points).Sum();
                }
                project.score = project.templates.Select(temp => temp.score).Sum();
                project.points = project.templates.Select(temp => temp.points).Sum();
                project.caseCount = project.templates.Select(temp => temp.caseCount).Sum();
            }
            return Ok(projects);
        }

        //[HttpGet]
        //[Route("api/Users/Client/report/download/{id}")]
        //public HttpResponseMessage GetClientUserReportDownload(int id, int clientId, DateTime start, DateTime end)
        //{
        //    var templates = new List<GetFullEvaluationTemplateResponse>();
        //    List<int> clientProjectIds = db.Users.Where(user => !user.IsArchived && !user.IsDeleted).FirstOrDefault(user => user.id == clientId).Projects.Select(project => project.id).ToList();
        //    templates = db.EvaluationTemplates.Where(template => !template.isDeleted).Where()
        //    var response = new HttpResponseMessage(HttpStatusCode.OK);
        //    var fileMemoryStream = new MemoryStream(fileBytes);
        //    response.Content = new StreamContent(fileMemoryStream);
        //    var headers = response.Content.Headers;
        //    headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
        //    headers.ContentDisposition.FileName = "Report.xls";
        //    headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
        //    headers.ContentLength = fileMemoryStream.Length;
        //    return response;
        //}

        [HttpGet]
        [Route("api/Users/Project/review")]
        public async Task<IHttpActionResult> GetUserProjectReview(int userId, int projectId, DateTime start, DateTime end)
        {
            var users = await db.Users
                .Select(user => new UserReviewResponse()
                {
                    id = user.id,
                    firstname = user.firstname,
                    lastname = user.lastname,
                    valid = user.Projects.Any(project => project.Evaluations.Count() > 0),
                    Evaluations = user.Evaluations.Where(evaluation => evaluation.ProjectId == projectId).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new EvaluationResponse()
                    {
                        id = evaluation.id,
                        name = evaluation.name,
                        EvaluationTemplateName = evaluation.EvaluationTemplateName,
                        projectName = evaluation.Project.name,
                        projectId = evaluation.Project.id,
                        createdDate = evaluation.createdDate,
                        updatedDate = evaluation.updatedDate,
                        evaluator = evaluation.Evaluator.firstname + " " + evaluation.Evaluator.lastname,
                        score = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum(),
                        points = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum(),

                    }).ToList()
                }).FirstOrDefaultAsync(temp => temp.id == userId);

            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        [ResponseType(typeof(LoginResponse))]
        [HttpPost]
        [Route("api/Users/login")]
        public async Task<IHttpActionResult> Login(LoginRequest request)
        {
            try
            {
                var user = await db.Users.Where(temp => !temp.IsArchived && !temp.IsDeleted).FirstAsync(temp => temp.username == request.username && temp.password == request.password);
                var response = new LoginResponse
                {
                    Id = user.id,
                    firstname = user.firstname,
                    lastname = user.lastname,
                    role = user.RoleType,
                    username = user.username,
                    projectsCount = user.Projects.Where(project => !project.isDeleted).Count()
                };
                return Ok(response);
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [ResponseType(typeof(void))]
        [Route("api/Users/archive/{id}")]
        public async Task<IHttpActionResult> ArchiveUser([FromUri] int id)
        {
            db.Users.Find(id).IsArchived = true;
            db.Users.Find(id).TeamId = null;
            await db.SaveChangesAsync();
            return Ok(id);
        }

        [ResponseType(typeof(void))]
        [Route("api/Users/unarchive/{id}")]
        public async Task<IHttpActionResult> UnarchiveUser([FromUri] int id)
        {
            db.Users.Find(id).IsArchived = false;
            await db.SaveChangesAsync();
            return Ok(id);
        }

        [ResponseType(typeof(void))]
        [Route("api/Users/markdeleted/{id}")]
        public async Task<IHttpActionResult> MarkDeleted([FromUri] int id)
        {
            db.Users.Find(id).IsDeleted = true;
            await db.SaveChangesAsync();
            return Ok(id);
        }

        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> GetUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [ResponseType(typeof(UserListResponse))]
        [HttpGet]
        [Route("api/Users/projects/{id}")]
        public async Task<IHttpActionResult> GetUserProjects(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var projects = new List<ProjectsListItem>();
            foreach (var project in user.Projects.Where(temp => !temp.isDeleted))
            {
                var item = new ProjectsListItem()
                {
                    id = project.id,
                    name = project.name
                };
                projects.Add(item);
            }

            var entry = new UserListResponse
            {
                id = user.id,
                username = user.username,
                password = user.password,
                firstname = user.firstname,
                lastname = user.lastname,
                isArchived = user.IsArchived,
                role = user.RoleType,
                teamId = user.TeamId,
                projects = projects,
                
            };

            return Ok(entry);
        }

        [HttpGet]
        [Route("api/Users/Projects/review/{id}")]
        public async Task<IHttpActionResult> GetUserProjectsReview (int id, DateTime start, DateTime end)
        {
            var projects = await db.Projects.Where(project => project.Users.FirstOrDefault(user => user.id == id) != null)
                .Select(project => new
                {
                    id = project.id,
                    Users = project.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new
                    {
                        user.id,
                        average = (int?)(user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum() / user.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum() * 100)
                    }).OrderByDescending(temp => temp.average).ToList()
                }).ToListAsync();

            var entries = await db.Users.Where(user => !user.IsArchived && !user.IsDeleted).Select(user => new UserProjectsResponse()
            {
                id = user.id,
                firstname = user.firstname,
                lastname = user.lastname,
                Projects = user.Projects.Where(project => !project.isDeleted).Select(project => new ProjectScoreResponse()
                {
                    id = project.id,
                    name = project.name,
                    overallScore = project.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),
                    overallPoints = project.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum(),

                    score = user.Evaluations.Where(evaluation => evaluation.ProjectId == project.id).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),
                    points = user.Evaluations.Where(evaluation => evaluation.ProjectId == project.id).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                    Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum(),

                    userCount = project.Users.Where(temp => !temp.IsArchived && !temp.IsDeleted).Count(),
                    rating = 0

                }).ToList()

            }).FirstOrDefaultAsync(user => user.id == id);

            foreach(var project in entries.Projects)
            {
                project.rating = projects.FirstOrDefault(temp => temp.id == project.id).Users.FindIndex(temp => temp.id == entries.id) + 1;
            }


            return Ok(entries);
        }

        [ResponseType(typeof(void))]
        [HttpPut]
        [Route("api/Users/credentials/{id}")]
        public async Task<IHttpActionResult> ChangeCredentials (int id, ChangeCredentialsRequest request)
        {
            db.Users.Find(id).username = request.username;
            db.Users.Find(id).password = request.password;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUser(int id, CreateUserRequest request)
        {

            db.Users.Find(id).firstname = request.firstname;
            db.Users.Find(id).lastname = request.lastname;
            db.Users.Find(id).RoleType = request.role;
            db.Users.Find(id).TeamId = request.teamId;
            db.Users.Find(id).username = request.username;
            db.Users.Find(id).password = request.password;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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
        [Route("api/Users/addProject/{id}")]
        public async Task<IHttpActionResult> AddProjectsToUser(int id, int[] add)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            foreach (int value in add)
            {
                var temp = db.Projects.Find(value);
                user.Projects.Add(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        [Route("api/Users/removeProject/{id}")]
        public async Task<IHttpActionResult> RemoveProjectsFromUser(int id, int[] remove)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            foreach (int value in remove)
            {
                var temp = db.Projects.Find(value);
                user.Projects.Remove(temp);
            }

            await db.SaveChangesAsync();

            return Ok();
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> PostUser(CreateUserRequest request)
        {
            var user = new User()
            {
                firstname = request.firstname,
                lastname = request.lastname,
                RoleType = request.role,
                IsArchived = false,
                IsDeleted = false,
                username = request.username,
                password = request.password,
                TeamId = request.teamId
            };

            if(db.Users.FirstOrDefault(temp => temp.username == user.username) != null)
            {
                return Ok();
            }

            db.Users.Add(user);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user.id);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> DeleteUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.id == id) > 0;
        }
    }
}