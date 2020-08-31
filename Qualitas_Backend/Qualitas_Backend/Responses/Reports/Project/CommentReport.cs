using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses.Reports.Project
{
    public class CommentReport
    {
        public int id { get; set; }
        public string comment { get; set; }
        public string name { get; set; }
        public string evaluatedBy { get; set; }
    }
}