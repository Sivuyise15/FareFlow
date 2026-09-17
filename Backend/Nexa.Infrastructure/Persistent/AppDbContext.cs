using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Nexa.Infrastructure.Persistent
{
    // This where we will define our DbContext for Entity Framework Core.
    // The DbContext is the main class that coordinates Entity Framework functionality for a given data model.
    // It allows us to query and save instances of our entities to the database.
    internal class AppDbContext
    {
        private readonly string ConnectionString;

        public AppDbContext(IConfiguration configuration)
        {
            ConnectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public void DatabaseConnect()
        {
            // Here we would typically use Entity Framework Core's Database.EnsureCreated() method
            // to create the database if it does not exist. However, since this is a placeholder,
            // we will just simulate this behavior.
            Console.WriteLine($"Connecting to database with connection string: {ConnectionString}");
        }

        public void EnsureDatabaseCreated()
        {
            // Here we would typically use Entity Framework Core's Database.EnsureCreated() method
            // to create the database if it does not exist. However, since this is a placeholder,
            // we will just simulate this behavior.
            Console.WriteLine($"Ensuring database is created with connection string: {ConnectionString}");
        }

    }
}
