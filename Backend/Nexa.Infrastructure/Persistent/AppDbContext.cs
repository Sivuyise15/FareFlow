using Microsoft.EntityFrameworkCore;
using Nexa.Domain.Entities;

namespace Nexa.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<EmailAccount> EmailAccounts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EmailAccount>()
            .Property(e => e.provider)
            .HasConversion<string>();
    }
}