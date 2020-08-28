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
        public List<string> otherTemplateName { get; set; }
        public List<CriteriaRequest> Criteria { get; set; }
        public bool isEditable { get; set; }
        public List<TopicRequest> Topics { get; set; }

        public List<string> Categories { get; set; }
    }
}