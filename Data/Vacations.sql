with
    t
    as
    (
        select *
        from core_uvsitcu.dbo.Users
    )
select
    (select Id from t where FullName=u.Surname + ' ' + u.Name + ' ' + u.Patronic) as UserId,
    CAST(LTRIM(v.Year) + '-' + LTRIM(v.Month) + '-' + '01' as DATETIME) as BeginDate,
    CAST(LTRIM(v.Year) + '-' + LTRIM(v.Month) + '-' + '01' as DATETIME) + v.Duration as EndDate
from Vacations v
    join AspNetUsers u
    on v.UsrId=u.Id
where v.Year=2019;