using System.ComponentModel.DataAnnotations;

namespace UVSITCU.Models.DTOs
{
    public class UserLabour
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int LabourId { get; set; }
    }
}