using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UVSITCU.Models.DTOs
{
    public class Department
    {
        [Key]
        public int Id { get; set; }


        [Required(ErrorMessage = "Поле Наименование обязательно")]
        [Display(Name = "Наименование")]
        public string Name { get; set; }


        [Required(ErrorMessage = "Не указан руководитель отдела")]
        [RegularExpression(@"^\d{1,1000}$", ErrorMessage = "Не верный Id")]
        public string ManagerId { get; set; }
    }
}