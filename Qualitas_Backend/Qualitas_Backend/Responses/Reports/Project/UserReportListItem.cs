﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Qualitas_Backend.Responses.Reports
{
    public class UserReportListItem
    {
        public int id { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public double? score { get; set; }
        public int? points { get; set; }
        public int caseCount { get; set; }
    }
}