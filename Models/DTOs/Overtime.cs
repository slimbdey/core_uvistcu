using System;
using System.ComponentModel.DataAnnotations;

namespace UVSITCU.Models.DTOs
{
  public class Overtime
  {
    [Key]
    public int Id { get; set; }


    [Required]
    public int UserId { get; set; }


    [Required]
    public DateTime Date { get; set; }


    [Required]
    public int Minutes { get; set; }


    public DateTime? UsedDate { get; set; }
    public int? AppliedPersonId { get; set; }
  }
}