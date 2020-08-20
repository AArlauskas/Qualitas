using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses.Reports
{
    public class ProjectReport
    {
        public int id { get; set; }
        public string name { get; set; }
        public int caseCount { get; set; }
        public double? score { get; set; }
        public int? points { get; set; }

        public double? overallScore { get; set; }
        public int? overallPoints { get; set; }
        public List<TemplateReport> templates { get; set; }
    }
}