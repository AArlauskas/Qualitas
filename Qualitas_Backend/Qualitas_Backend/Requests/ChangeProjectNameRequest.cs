using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Requests
{
    public class ChangeProjectNameRequest
    {
        public int id { get; set; }
        public string name { get; set; }
    }
}