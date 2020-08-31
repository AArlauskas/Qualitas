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
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using System.Web.Routing;
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
        public async Task<IHttpActionResult> GetProjectsList(DateTime start, DateTime end)
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
                }),
                caseCount = project.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.EvaluationTemplateName != null).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Count(),
                score = project.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.EvaluationTemplateName != null).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),

                points = project.Evaluations.Where(evaluation => !evaluation.isDeleted && evaluation.EvaluationTemplateName != null).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum(),
            });

            return Ok(projects);
        }


        [HttpGet]
        [Route("api/Projects/report/{id}")]
        public async Task<IHttpActionResult> GetProjectReport(int id, DateTime start, DateTime end)
        {
            var evaluations = db.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.ProjectId == id && evaluation.EvaluationTemplateName != null)
                .Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
            {
                evaluation.id,
                evaluation.EvaluationTemplateName,
                evaluation.CategoryName,
                User = new 
                {
                    evaluation.User.id,
                    evaluation.User.firstname,
                    evaluation.User.lastname
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
                    crierias = topic.Criteria.Select(criteria => new
                    {
                        criteria.id,
                        criteria.name,
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
            }).GroupBy(evaluation => evaluation.EvaluationTemplateName).ToList();

            List<TemplateReport> templates = new List<TemplateReport>();
            foreach(var evaluationGroup in evaluations)
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
                    users = category.Select(temp => new UserReportListItem
                    {
                        id = temp.User.id,
                        firstname = temp.User.firstname,
                        lastname = temp.User.lastname,
                        caseCount = category.Where(userGroup => userGroup.User.id == temp.User.id).Count(),
                        score = category.Where(userGroup => userGroup.User.id == temp.User.id).Select(group => group.Topics.Select(topic => topic.crierias.Select(criteria => criteria.score).Sum()).Sum()).Sum(),
                        points = category.Where(userGroup => userGroup.User.id == temp.User.id).Select(group => group.Topics.Select(topic => topic.crierias.Select(criteria => criteria.points).Sum()).Sum()).Sum()
                    }).GroupBy(temp => temp.id).Select(temp => temp.First()).ToList(),
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

            foreach(var template in templates)
            {
                foreach(var category in template.categoryReports)
                {
                    foreach(var topic in category.topics)
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

            return Ok(templates);
        }

        [HttpGet]
        [Route("api/Projects/all/download")]
        public HttpResponseMessage GetAllProjectsReport(DateTime start, DateTime end)
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

            var projects = db.Projects.Where(project => !project.isDeleted).Where(project => project.Users.Count() != 0).Select(project => new
            {
                project.id,
                project.name,
                users = project.Users.Where(user => !user.IsArchived && !user.IsDeleted && user.RoleType == "user").Select(user => new
                {
                    user.id,
                    name = user.firstname + " " + user.lastname,
                    evaluations = user.Evaluations.Where(evaluation => evaluation.ProjectId == project.id).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
                    {
                        evaluation.id,
                        evaluation.name,
                        score = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).Sum()).Sum(),
                        points = evaluation.Topics.Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).Sum()).Sum(),
                    }).ToList()
                }).OrderBy(temp => temp.evaluations.Count()).ToList()
            }).ToList();

            var maxCount = projects.Select(project => project.users.Select(user => user.evaluations.Count()).Max()).Max();

            xlWorkSheet = (Excel.Worksheet)xlWorkBook.Worksheets.Add();
            xlWorkSheet.get_Range("A1", "Z400").Cells.VerticalAlignment = Excel.XlHAlign.xlHAlignCenter;
            xlWorkSheet.get_Range("A1", "Z400").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
            xlWorkSheet.get_Range("A1", "Z400").Cells.WrapText = true;

            xlWorkSheet.Range[xlWorkSheet.Cells[1, 1], xlWorkSheet.Cells[1, maxCount + 6]].Merge();
            xlWorkSheet.Cells[1,1] = start.ToString("yyyy-MM-dd") + " " + end.ToString("yyyy-MM-dd");
            xlWorkSheet.Columns[1].ColumnWidth = 17;
            xlWorkSheet.Columns[2].ColumnWidth = 22;
            xlWorkSheet.Columns[maxCount + 3].ColumnWidth = 17;
            xlWorkSheet.Columns[maxCount + 4].ColumnWidth = 17;
            xlWorkSheet.Columns[maxCount + 5].ColumnWidth = 17;
            xlWorkSheet.Columns[maxCount + 6].ColumnWidth = 17;
            xlWorkSheet.Cells[2, 1] = "Project";
            xlWorkSheet.Cells[2, 2] = "Users";
            xlWorkSheet.Cells[2, maxCount + 3] = "Evaluated cases";
            xlWorkSheet.Cells[2, maxCount + 4] = "Max score";
            xlWorkSheet.Cells[2, maxCount + 5] = "Achieved score";
            xlWorkSheet.Cells[2, maxCount + 6] = "Total score";
            int column = 3;
            for(int i = 1; i <= maxCount; i++ )
            {
                xlWorkSheet.Cells[2, column] = i;
                column++;
            }
            column = 3;
            xlWorkSheet.Range[xlWorkSheet.Cells[2, 1], xlWorkSheet.Cells[2, maxCount + 6]].Interior.Color = ColorTranslator.ToOle(Color.LightPink);

            int row = 3;
            foreach(var project in projects)
            {
                xlWorkSheet.Range[xlWorkSheet.Cells[row, 1], xlWorkSheet.Cells[row + project.users.Count() - 1, 1]].Merge();
                xlWorkSheet.Cells[row, 1] = project.name;
                foreach(var user in project.users)
                {
                    xlWorkSheet.Cells[row, 2] = user.name;
                    column = 3;
                    foreach(var evaluation in user.evaluations)
                    {
                        xlWorkSheet.Cells[row, column] = evaluation.score;
                        column++;
                    }
                    if(user.evaluations.Count() == 0)
                    {
                        xlWorkSheet.Cells[row, maxCount + 3] = 0;
                        column++;
                        xlWorkSheet.Cells[row, maxCount + 4] = 0;
                        column++;
                        xlWorkSheet.Cells[row, maxCount + 5] = 0;
                        column++;
                        xlWorkSheet.Cells[row, maxCount + 6] = "0%";
                    }
                    else
                    {
                        xlWorkSheet.Cells[row, maxCount + 3] = user.evaluations.Count();
                        column++;
                        xlWorkSheet.Cells[row, maxCount + 4] = user.evaluations.Select(temp => temp.points).Sum();
                        column++;
                        xlWorkSheet.Cells[row, maxCount + 5] = user.evaluations.Select(temp => temp.score).Sum();
                        column++;
                        try
                        {
                            var average = user.evaluations.Select(temp => temp.score).Sum() / user.evaluations.Select(temp => temp.points).Sum();
                            xlWorkSheet.Cells[row, maxCount + 6] = average * 10000 / 100 + "%";
                        }
                        catch (DivideByZeroException e)
                        {
                            xlWorkSheet.Cells[row, column] = "0%";
                        }
                    }
                    row++;
                }
            }
            xlWorkSheet.Range[xlWorkSheet.Cells[3, 1], xlWorkSheet.Cells[row - 1, 1]].Interior.Color = ColorTranslator.ToOle(Color.LightGreen);
            xlWorkSheet.Range[xlWorkSheet.Cells[3, 2], xlWorkSheet.Cells[row - 1, 2]].Interior.Color = ColorTranslator.ToOle(Color.SandyBrown);
            xlWorkSheet.Range[xlWorkSheet.Cells[3, 3], xlWorkSheet.Cells[row - 1, maxCount + 6]].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
            xlWorkSheet.Range[xlWorkSheet.Cells[row, 1], xlWorkSheet.Cells[row, maxCount + 6]].Interior.Color = ColorTranslator.ToOle(Color.LightPink);
            xlWorkSheet.Range[xlWorkSheet.Cells[row, 1], xlWorkSheet.Cells[row, maxCount + 2]].Merge();
            xlWorkSheet.Cells[row, 1] = "Total:";
            xlWorkSheet.Cells[row, maxCount + 3] = projects.Select(project => project.users.Select(user => user.evaluations.Count()).Sum()).Sum();
            var score = projects.Select(project => project.users.Select(user => user.evaluations.Select(evaluation => evaluation.score).Sum()).Sum()).Sum();
            var points = projects.Select(project => project.users.Select(user => user.evaluations.Select(evaluation => evaluation.points).Sum()).Sum()).Sum();
            xlWorkSheet.Cells[row, maxCount + 4] = score;
            xlWorkSheet.Cells[row, maxCount + 5] = points;
            try
            {
                var average = score / points;
                xlWorkSheet.Cells[row, maxCount + 6] = average * 10000 / 100 + "%";
            }
            catch
            {
                xlWorkSheet.Cells[row, maxCount + 6] = "0%";
            }
           

            xlWorkSheet.Range[xlWorkSheet.Cells[1,1], xlWorkSheet.Cells[row, maxCount + 6]].Cells.Borders.LineStyle = XlLineStyle.xlContinuous;


            xlWorkBook.SaveAs("d:\\Excel\\csharp-Excel3.xls", Excel.XlFileFormat.xlWorkbookNormal, misValue, misValue, misValue, misValue, Excel.XlSaveAsAccessMode.xlExclusive, misValue, misValue, misValue, misValue, misValue);
            xlWorkBook.Close(true, misValue, misValue);
            xlApp.Quit();

            Marshal.ReleaseComObject(xlWorkBook);
            Marshal.ReleaseComObject(xlApp);
            var fileBytes = File.ReadAllBytes("d:\\Excel\\csharp-Excel3.xls");
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
        [Route("api/Projects/report/download/{id}")]
        public HttpResponseMessage GetProjectReportDownload(int id, DateTime start, DateTime end)
        {
            var evaluations = db.Evaluations.Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.ProjectId == id && evaluation.EvaluationTemplateName != null)
                .Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => new
                {
                    evaluation.id,
                    evaluation.EvaluationTemplateName,
                    evaluation.CategoryName,
                    User = new
                    {
                        evaluation.User.id,
                        evaluation.User.firstname,
                        evaluation.User.lastname
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
                        crierias = topic.Criteria.Select(criteria => new
                        {
                            criteria.id,
                            criteria.name,
                            criteria.comment,
                            criteria.points,
                            criteria.score
                        })
                    }).ToList(),
                }).GroupBy(evaluation => evaluation.EvaluationTemplateName).ToList();


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
            foreach (var evaluationGroup in evaluations)
            {
                xlWorkSheet = (Excel.Worksheet)xlWorkBook.Worksheets.Add();
                xlWorkSheet.Name = evaluationGroup.Key;
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
                var evaluationTemplate = db.EvaluationTemplates.Where(temp => !temp.isDeleted).FirstOrDefault(temp => temp.name == evaluationGroup.Key);
                var categoryGroup = evaluationGroup.GroupBy(group => group.CategoryName).ToList();

                xlWorkSheet.Cells[1, 3] = start.ToString("yyyy-MM-dd") + " " + end.ToString("yyyy-MM-dd");
                
                int topicStartRow = 3;
                int startColumn = 1;
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

                for (int i = 1; i <= evaluationGroup.Count(); i++)
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
                    foreach (var evaluation in evaluationGroup)
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
                    var totalCount = evaluationGroup.Count();
                    var failedCount = evaluationGroup.Select(temp => temp.Criticals.Where(tempCritical => tempCritical.name == critical.name && tempCritical.failed).Count()).Sum();
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

                    foreach (var evaluation in evaluationGroup)
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
                        var score = evaluationGroup.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Select(tempCriteria => tempCriteria.score).Sum()).Sum();
                        var points = evaluationGroup.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Select(tempCriteria => tempCriteria.points).Sum()).Sum();
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
                        foreach (var evaluation in evaluationGroup)
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
                            var score = evaluationGroup.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.score).Sum()).Sum();
                            var points = evaluationGroup.Select(tempEvaluation => tempEvaluation.Topics.FirstOrDefault(tempTopic => tempTopic.name == topic.name).crierias.Where(tempCriteria => tempCriteria.name == criteria.name).Select(tempCriteria => tempCriteria.points).Sum()).Sum();
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
                    xlWorkSheet.Cells[currentCategoryStart, 1] = evaluationGroup.Key;
                }

                xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, 1], xlWorkSheet.Cells[topicStartRow, 3]].Merge();
                xlWorkSheet.Cells[topicStartRow, 1] = "Total:";

                xlWorkSheet.Cells[topicStartRow, startColumn - 1] = evaluationTemplate.TopicTemplates.Select(topic => topic.CriteriaTemplates.Select(criteria => criteria.points).Sum()).Sum();
                double OverallScore = 0;
                int OverallPoints = 0;
                foreach (var evaluation in evaluationGroup)
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


                foreach (var category in categoryGroup)
                {
                    startColumn = 1;
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn + 3]].Interior.Color = ColorTranslator.ToOle(Color.PaleGoldenrod);
                    xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, startColumn], xlWorkSheet.Cells[topicStartRow + 1, startColumn]].Merge();
                    xlWorkSheet.Cells[topicStartRow, startColumn] = "Category";
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
                    currentCategoryStart = topicStartRow;
                    foreach(var critical in evaluationTemplate.TopicTemplates.Where(topic => topic.isCritical))
                    {
                        startColumn = 5;
                        xlWorkSheet.Range[xlWorkSheet.Cells[topicStartRow, 2], xlWorkSheet.Cells[topicStartRow, 3]].Merge();
                        xlWorkSheet.Cells[topicStartRow, 2].Interior.Color = ColorTranslator.ToOle(Color.IndianRed);
                        xlWorkSheet.Cells[topicStartRow, 2] = critical.name;
                        xlWorkSheet.Cells[topicStartRow, 4] = "Critical";
                        foreach(var evaluation in category)
                        {
                            bool breached = evaluation.Criticals.FirstOrDefault(tempCritical => tempCritical.name == critical.name).failed;
                            if(breached)
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

                        foreach(var evaluation in category)
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
                    OverallScore = 0;
                    OverallPoints = 0;
                    foreach(var evaluation in category)
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
        public async Task<IHttpActionResult> GetProjectReview(int id, DateTime start, DateTime end)
        {
            var projects = await db.Projects
                .Select(project => new {
                    id = project.id,
                    name = project.name,
                    Users = project.Users.Where(user => !user.IsArchived && !user.IsDeleted).Where(user => user.RoleType == "user").Select(user => new
                    {
                        user.id,
                        user.firstname,
                        user.lastname,
                        teamName = user.Team.name,
                        teamId = (int?)user.Team.id,
                        caseCount = user.Evaluations.Where(temp => temp.ProjectId == id).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Count(),

                        score = user.Evaluations.Where(temp => temp.ProjectId == id).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (double?)criteria.score).ToList().Sum()).Sum()).Sum(),

                        points = user.Evaluations.Where(temp => temp.ProjectId == id).Where(evaluation => !evaluation.isDeleted).Where(evaluation => evaluation.createdDate >= start && evaluation.createdDate <= end).Select(evaluation => evaluation.Topics.
                        Select(topic => topic.Criteria.Select(criteria => (int?)criteria.points).ToList().Sum()).Sum()).Sum()
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
                    name = temp.name,
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
                    name = temp.name,
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
                    name = temp.name,
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