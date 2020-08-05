using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class UserReviewResponse
    {
        public int id { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string teamName { get; set; }
        public int? teamId { get; set; }
        public int rating { get; set; }
        public int teamUsersCount { get; set; }
        public bool valid { get; set; }
        public int projectCount { get; set; }
        public List<EvaluationResponse> Evaluations { get; set; }
    }
}