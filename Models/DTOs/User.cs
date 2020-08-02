using System;
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

    public string Password { get; set; }

    public int RoleId { get; set; }


    [Required(ErrorMessage = "Поле Таб. № обязательно")]
    [RegularExpression(@"^\d{7}$", ErrorMessage = "Таб № состоит из 7 цифр")]
    [Display(Name = "Табельный номер", Prompt = "7 цифр")]
    public string TabNum { get; set; }

    public int DeptId { get; set; }
    public int OfficeId { get; set; }

    [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$", ErrorMessage = "Не корректный Email")]
    public string Email { get; set; }

    [RegularExpression(@"^\d{11}$", ErrorMessage = "Номер телефона состоит из 11 цифр")]
    public string PhoneNum { get; set; }
    public bool ParticipateInLabour { get; set; }
    public DateTime? MedExam { get; set; }
    public DateTime? LabourSecurityExam { get; set; }
    public DateTime? IndustrialSecurityExam { get; set; }
    public DateTime? GotHelmet { get; set; }
    public DateTime? GotSuit { get; set; }
    public DateTime? GotBoots { get; set; }
    public DateTime? GotCoat { get; set; }

    public double? VacationRating { get; set; }

  }
}
