﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses.Reports
{
    public class CrititalReport
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int breachedCount { get; set; }
    }
}