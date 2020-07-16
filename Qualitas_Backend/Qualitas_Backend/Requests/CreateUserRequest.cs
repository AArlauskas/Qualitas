﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Requests
{
    public class CreateUserRequest
    {
        public string role { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }

        public int? teamId { get; set; }
    }
}