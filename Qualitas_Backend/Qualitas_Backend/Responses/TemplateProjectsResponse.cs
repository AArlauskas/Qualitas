using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class TemplateProjectsResponse
    {
        public int id { get; set; }
        public string name { get; set; }
        public List<ProjectsListItem> projects { get; set; }
    }
}