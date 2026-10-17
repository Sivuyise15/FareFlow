using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Nexa.Infrastructure.Persistence;

#nullable disable

namespace Nexa.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20261018120000_AddUniqueEmailAccountUserId")]
    public partial class AddUniqueEmailAccountUserId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_EmailAccounts_userid",
                table: "EmailAccounts");

            migrationBuilder.CreateIndex(
                name: "IX_EmailAccounts_userid",
                table: "EmailAccounts",
                column: "userid",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_EmailAccounts_userid",
                table: "EmailAccounts");

            migrationBuilder.CreateIndex(
                name: "IX_EmailAccounts_userid",
                table: "EmailAccounts",
                column: "userid");
        }
    }
}
