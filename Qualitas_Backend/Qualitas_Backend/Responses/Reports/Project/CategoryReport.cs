using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses.Reports
{
    public class CategoryReport
    {
        public string name { get; set; }
        public int? points { get; set; }
        public double? score { get; set; }
        public int caseCount { get; set; }
        public List<CrititalReport> criticals { get; set; }
        public List<TopicReport> topics { get; set; }
        public List<UserReportListItem> users { get; set; }
    }
}