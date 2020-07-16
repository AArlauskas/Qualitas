using Qualitas_Backend.Requests.SubClassesForRequests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Requests
{
    public class CreateFullEvaluationTemplateRequest
    {
        public string TemplateName { get; set; }

        public Criteria[] Criteria { get; set; }

        public Topic[] Topics { get; set; }
    }
}