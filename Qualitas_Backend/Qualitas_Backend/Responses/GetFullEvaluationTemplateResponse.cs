using Qualitas_Backend.Requests.SubClassesForRequests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class GetFullEvaluationTemplateResponse
    {
        public int id { get; set; }
        public string TemplateName { get; set; }

        public List<Criteria> Criteria { get; set; }

        public List<Topic> Topics { get; set; }
    }
}