using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Requests.SubClassesForRequests
{
    public class Topic
    {
        public int id { get; set; }
        public string name { get; set; }
        public bool critical { get; set; }
        public int parentId { get; set; }
    }
}