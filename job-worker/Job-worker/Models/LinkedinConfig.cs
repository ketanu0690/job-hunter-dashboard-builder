using YamlDotNet.Serialization;

namespace Job_worker.Models
{
    public class LinkedinConfig
    {
        // Authentication
        [YamlMember(Alias = "email")]
        public string Email { get; set; } = string.Empty;

        [YamlMember(Alias = "password")]
        public string Password { get; set; } = string.Empty;

        // Job Search Parameters
        [YamlMember(Alias = "positions")]
        public List<string> Positions { get; set; } = new();

        [YamlMember(Alias = "locations")]
        public List<string> Locations { get; set; } = new();

        [YamlMember(Alias = "distance")]
        public int Distance { get; set; } = 25;

        [YamlMember(Alias = "remote")]
        public bool Remote { get; set; } = false;

        // Filters
        [YamlMember(Alias = "experienceLevel")]
        public Dictionary<string, bool> ExperienceLevel { get; set; } = new();

        [YamlMember(Alias = "jobTypes")]
        public Dictionary<string, bool> JobTypes { get; set; } = new();

        [YamlMember(Alias = "datePosted")]
        public Dictionary<string, bool> DatePosted { get; set; } = new();

        // Application Behavior
        [YamlMember(Alias = "disableAntiLock")]
        public bool DisableAntiLock { get; set; } = false;

        [YamlMember(Alias = "maxApplicationsPerDay")]
        public int MaxApplicationsPerDay { get; set; } = 30;

        [YamlMember(Alias = "minDelaySeconds")]
        public int MinDelaySeconds { get; set; } = 5;

        [YamlMember(Alias = "maxDelaySeconds")]
        public int MaxDelaySeconds { get; set; } = 15;

        // Application Content
        [YamlMember(Alias = "personalInfo")]
        public Dictionary<string, string> PersonalInfo { get; set; } = new()
        {
            ["First name"] = string.Empty,
            ["Last name"] = string.Empty,
            ["Phone country code"] = string.Empty,
            ["Mobile number"] = string.Empty,
            ["Email"] = string.Empty,
            ["Location"] = string.Empty
        };

        [YamlMember(Alias = "eeo")]
        public Dictionary<string, string> Eeo { get; set; } = new();

        [YamlMember(Alias = "uploads")]
        public Dictionary<string, string> Uploads { get; set; } = new();

        [YamlMember(Alias = "universityGpa")]
        public double UniversityGpa { get; set; } = 3.5;

        // Technical Preferences
        [YamlMember(Alias = "checkboxes")]
        public Dictionary<string, bool> Checkboxes { get; set; } = new();

        [YamlMember(Alias = "industry")]
        public Dictionary<string, int> Industry { get; set; } = new();

        [YamlMember(Alias = "technology")]
        public Dictionary<string, int> Technology { get; set; } = new();

        [YamlMember(Alias = "languages")]
        public Dictionary<string, string> Languages { get; set; } = new();

        // Output Configuration
        [YamlMember(Alias = "outputFileDirectory")]
        public string OutputFileDirectory { get; set; } = "./output";

        // Browser Configuration
        [YamlMember(Alias = "headlessMode")]
        public bool HeadlessMode { get; set; } = false;

        [YamlMember(Alias = "userAgent")]
        public string UserAgent { get; set; } = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

        [YamlMember(Alias = "pageLoadTimeout")]
        public int PageLoadTimeout { get; set; } = 30;

        [YamlMember(Alias = "resumePath")]
        public string? ResumePath { get; set; }

        [YamlMember(Alias = "coverLetterPath")]
        public string? CoverLetterPath { get; set; }

        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new ArgumentException("Email must be provided.");
            if (string.IsNullOrWhiteSpace(Password))
                throw new ArgumentException("Password must be provided.");
            if (!Uploads.ContainsKey("Resume"))
                throw new ArgumentException("Uploads must contain a 'Resume' entry.");
        }
    }
}
