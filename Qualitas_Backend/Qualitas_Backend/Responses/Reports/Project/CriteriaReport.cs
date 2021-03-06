﻿using Qualitas_Backend.Responses.Reports.Project;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses.Reports
{
    public class CriteriaReport
    {
        public int id { get; set; }
        public string name { get; set; }
        public double? score { get; set; }
        public int? points { get; set; }
        public string description { get; set; }
        public List<CommentReport> comments { get; set; }
    }
}