﻿using Qualitas_Backend.Requests.SubClassesForRequests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Requests
{
    public class CreateFullEvaluationTemplateRequest
    {
        public string TemplateName { get; set; }

        public CriteriaRequest[] Criteria { get; set; }

        public TopicRequest[] Topics { get; set; }

        public List<string> Categories { get; set; }
    }
}