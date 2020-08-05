using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class ProjectAverageResult
    {
        public int userId { get; set; }
        public int projectId { get; set; }
        public int? average { get; set; }
    }
}