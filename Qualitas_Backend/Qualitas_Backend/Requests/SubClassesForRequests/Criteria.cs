using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Requests.SubClassesForRequests
{
    public class Criteria
    {
        public string name { get; set; }
        public int points { get; set; }

        public int parentId { get; set; }
    }
}