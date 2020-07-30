using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Requests
{
    public class ChangeCredentialsRequest
    {
        public string username { get; set; }
        public string password { get; set; }
    }
}