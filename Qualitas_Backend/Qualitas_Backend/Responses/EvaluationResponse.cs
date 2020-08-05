using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class EvaluationResponse
    {
        public int id { get; set; }
        public string name { get; set; }
        public string EvaluationTemplateName { get; set; }
        public string projectName { get; set; }
        public int projectId { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? updatedDate { get; set; }
        public string evaluator { get; set; }
        public double? score { get; set; }
        public int? points { get; set; }
    }
}