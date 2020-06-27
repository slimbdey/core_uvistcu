using System.ComponentModel.DataAnnotations;

namespace UVSITCU.Models.DTOs
{
    public class Office
    {
        [Key]
        public int Id { get; set; }


        [Required(ErrorMessage = "Поле Наименование обязательно")]
        [Display(Name = "Наименование бюро")]
        public string Name { get; set; }


        [Required(ErrorMessage = "Не указан руководитель бюро")]
        [RegularExpression(@"^\d{1,1000}$", ErrorMessage = "Не верный Id")]
        [Display(Name = "Руководитель бюро")]
        public string ChiefId { get; set; }
    }
}