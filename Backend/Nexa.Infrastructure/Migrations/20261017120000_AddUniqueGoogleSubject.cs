using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Nexa.Infrastructure.Persistence;

#nullable disable

namespace Nexa.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20261017120000_AddUniqueGoogleSubject")]
    public partial class AddUniqueGoogleSubject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Users_google_subject",
                table: "Users",
                column: "google_subject",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_google_subject",
                table: "Users");
        }
    }
}
