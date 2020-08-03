using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Requests.SubClassesForRequests
{
    public class TopicRequest
    {
        public int id { get; set; }
        public string name { get; set; }
        public bool critical { get; set; }
        public string description { get; set; }
        public int parentId { get; set; }
    }
}