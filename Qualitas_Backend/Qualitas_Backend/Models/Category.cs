//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Qualitas_Backend.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Category
    {
        public int id { get; set; }
        public string name { get; set; }
        public int EvaluationTemplateId { get; set; }
    
        public virtual EvaluationTemplate EvaluationTemplate { get; set; }
    }
}
