using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace UVSITCU.Models.DTOs
{
    public class Labour
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Необходимо указать дату субботника")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Необходимо указать руководителя")]
        public int ManagerId { get; set; }


        [NotMapped]
        public IEnumerable<int> UserIds { get; set; }
    }
}