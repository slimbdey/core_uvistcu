using System;
using System.ComponentModel.DataAnnotations;

namespace UVSITCU.Models.DTOs
{
    public class Vacation
    {
        [Key]
        public int Id { get; set; }


        [Required]
        public int UserId { get; set; }


        [Required]
        public DateTime BeginDate { get; set; }


        [Required]
        public DateTime EndDate { get; set; }


        public decimal? Score { get; set; }
    }
}