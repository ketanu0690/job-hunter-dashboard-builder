namespace Job_worker.Shared.Models
{
    public class StartJobRequest
    {
        public string ConfigPath { get; set; }
        public string CallbackUrl { get; set; }
    }
}
