using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class ProjectScoreResponse
    {
        public int id { get; set; }
        public string name { get; set; }
        public double? overallScore { get; set; }
        public int? overallPoints { get; set; }
        public double? score { get; set; }
        public double? points { get; set; }
        public int userCount { get; set; }

        public int rating { get; set; }
    }
}