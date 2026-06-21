
public class ProcessEmailReceipt
{
    private readonly IEmailReceiptRepository _emailReceiptRepository;
    private readonly IEmailParser _emailParser;

    public ProcessEmailReceipt(IEmailReceiptRepository emailReceiptRepository, IEmailService emailService)
    {
        _emailReceiptRepository = emailReceiptRepository;
        _emailService = emailService;
    }

    public async Task HandleEmailReceiptAsync(EmailReceipt receipt)
    {
        // Save the email receipt to the database
        await _emailReceiptRepository.SaveAsync(receipt);

        // Optionally, send a notification or perform additional processing
        await _emailService.NotifyAsync($"Received email from {receipt.Sender} with subject: {receipt.Subject}");
    }
}