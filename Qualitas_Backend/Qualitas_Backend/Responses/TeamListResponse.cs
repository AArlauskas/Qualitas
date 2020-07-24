using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class TeamListResponse
    {
        public int id { get; set; }
        public string name { get; set; }
        public int? userCount { get; set; }
        public int? score { get; set; }
        public List<ProjectsListItem> projects { get; set;}
    }
}