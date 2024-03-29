﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class ProjectsListItem
    {
        public int id { get; set; }
        public string name { get; set;}
        public List<TemplateListResponse> templates { get; set; }
        public List<TeamListResponse> teams { get; set; }
    }
}