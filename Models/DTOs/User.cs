using System.ComponentModel.DataAnnotations;


namespace UVSITCU.Models.DTOs
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Поле ФИО обязательно")]
        [RegularExpression(@"^[А-Я][а-я]{1,20}\s[А-Я][а-я]{1,20}\s[А-Я][а-я]{1,20}$", ErrorMessage = "Неверно заполнено поле ФИО")]
        [Display(Name = "ФИО", Prompt = "Первые буквы заглавные")]
        public string FullName { get; set; }


        [Required(ErrorMessage = "Поле Таб. № обязательно")]
        [RegularExpression(@"^\d{7}$", ErrorMessage = "Таб № состоит из 7 цифр")]
        [Display(Name = "Табельный номер", Prompt = "7 цифр")]
        public string TabNum { get; set; }


        public int OfficeId { get; set; }
    }
}
