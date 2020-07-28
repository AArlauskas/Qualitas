using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class EvaluationTemplateListItem
    {
        public int? id { get; set; }
        public string name { get; set; }
        public List<ProjectsListItem> Projects { get; set; }
    }
}