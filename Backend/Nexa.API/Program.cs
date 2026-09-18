using Microsoft.EntityFrameworkCore;
using Nexa.Core.Services;
using Nexa.Domain.Interfaces;
using Nexa.Infrastructure.Email;
using Nexa.Infrastructure.Persistence;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using System;

namespace Nexa.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // register the DbContext with PostgreSQL provider
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Repositories
            builder.Services.AddScoped<IEmailAccountRepository, EmailAccountRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();

            // Services
            builder.Services.AddScoped<ConnectEmailAccountService>();
            //builder.Services.AddScoped<ProcessEmailReceiptsService>();

            // Gmail
            builder.Services.AddScoped<IGmailClient, GmailClient>();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            //app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
