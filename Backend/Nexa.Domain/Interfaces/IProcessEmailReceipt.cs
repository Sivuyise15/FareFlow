using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IProcessEmailReceipt
{
    void ProcessEmailReceipt(EmailAccount emailAccount);
}