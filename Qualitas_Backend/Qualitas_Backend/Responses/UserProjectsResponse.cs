using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class UserProjectsResponse
    {
        public int id { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public List<ProjectScoreResponse> Projects { get; set; }
    }
}