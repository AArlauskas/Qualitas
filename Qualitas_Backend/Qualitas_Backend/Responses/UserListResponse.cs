using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses
{
    public class UserListResponse
    {
        public int id { get; set; }
        public string name { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string role { get; set; }
        public int? teamId { get; set; }
        public bool isArchived { get; set; }
        public bool isDeleted { get; set; }

    }
}