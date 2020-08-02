using System.ComponentModel.DataAnnotations;

namespace UVSITCU.Models.DTOs
{
  public class UserRole
  {
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
  }
}