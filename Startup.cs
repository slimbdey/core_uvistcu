using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using UVSITCU.Models.DTOs;
using UVSITCU.Models.Repositories;

namespace UVSITCU
{
  public class Startup
  {
    public IConfiguration Configuration { get; }
    public Startup(IConfiguration configuration) => Configuration = configuration;



    public void ConfigureServices(IServiceCollection services)
    {
      var conString = Configuration.GetConnectionString("LocalDb");
      services.AddScoped<IUserRepository, UserRepository>(provider => new UserRepository(conString));
      services.AddScoped<IRepository<Office>, TRepository<Office>>(provider => new OfficeRepository(conString));
      services.AddScoped<IRepository<Department>, TRepository<Department>>(provider => new DepartmentRepository(conString));
      services.AddScoped<IRepository<Labour>, LabourRepository>(provider => new LabourRepository(conString));
      services.AddScoped<IRepository<Vacation>, TRepository<Vacation>>(provider => new VacationRepository(conString));
      services.AddScoped<IRepository<Overtime>, TRepository<Overtime>>(provider => new OvertimeRepository(conString));

      services.AddControllersWithViews();

      services.AddSpaStaticFiles(configuration =>
      {
        configuration.RootPath = "ClientApp/build";
      });
    }



    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
        app.UseDeveloperExceptionPage();

      else
      {
        app.UseExceptionHandler("/Error");
        app.UseHsts();
      }

      //app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseSpaStaticFiles();

      app.UseRouting();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
                  name: "default",
                  pattern: "{controller}/{action=Index}/{id?}");
      });

      app.UseSpa(spa =>
      {
        spa.Options.SourcePath = "ClientApp";

        if (env.IsDevelopment())
          spa.UseReactDevelopmentServer(npmScript: "start");
      });
    }
  }
}
