using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Nexa.Core.Services;
using Nexa.Domain.Interfaces;
using Nexa.Infrastructure.Email;
using Nexa.Infrastructure.Persistence;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using System;
using System.Text;
using Nexa.API.Services;

namespace Nexa.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var jwtSigningKey = builder.Configuration["Jwt:SigningKey"];
            if (string.IsNullOrWhiteSpace(jwtSigningKey) || Encoding.UTF8.GetByteCount(jwtSigningKey) < 32)
                throw new InvalidOperationException("Configure Jwt:SigningKey with at least 32 bytes using user-secrets or an environment variable.");

            var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "Nexa.API";
            var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "Nexa.Mobile";

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtIssuer,
                        ValidateAudience = true,
                        ValidAudience = jwtAudience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSigningKey)),
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromSeconds(30)
                    };
                });

            // register the DbContext with PostgreSQL provider
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add services to the container.

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ExpoWeb", policy =>
                    policy.WithOrigins("http://localhost:8081")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });

            builder.Services.AddControllers();
            builder.Services.AddAuthorization();
            builder.Services.AddMemoryCache();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Repositories
            builder.Services.AddScoped<IEmailAccountRepository, EmailAccountRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();

            // Services
            builder.Services.AddScoped<ConnectEmailAccountService>();
            builder.Services.AddScoped<NexaSessionIssuer>();
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

            app.UseCors("ExpoWeb");
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
