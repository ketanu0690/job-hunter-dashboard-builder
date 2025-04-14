namespace Job_worker.Models
{
    public class StartJobRequest
    {
        public string ConfigPath { get; set; }
        public string CallbackUrl { get; set; }
    }
}
