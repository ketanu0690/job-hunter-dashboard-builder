using YamlDotNet.Serialization;

namespace Job_worker.Models
{
    public class LinkedinConfig
    {
        // Authentication
        [YamlMember(Alias = "email")]
        public string Email { get; set; }

        [YamlMember(Alias = "password")]
        public string Password { get; set; }

        [YamlMember(Alias = "date")]
        public Dictionary<string, bool> Date { get; set; }

        // Job Search Parameters
        [YamlMember(Alias = "positions")]
        public List<string> Positions { get; set; }

        [YamlMember(Alias = "locations")]
        public List<string> Locations { get; set; }

        [YamlMember(Alias = "distance")]
        public int Distance { get; set; }

        [YamlMember(Alias = "remote")]
        public bool Remote { get; set; }

        // Filters
        [YamlMember(Alias = "experienceLevel")]
        public Dictionary<string, bool> ExperienceLevel { get; set; }

        [YamlMember(Alias = "jobTypes")]
        public Dictionary<string, bool> JobTypes { get; set; }

        [YamlMember(Alias = "datePosted")]
        public Dictionary<string, bool> DatePosted { get; set; }

        // Application Behavior
        [YamlMember(Alias = "disableAntiLock")]
        public bool DisableAntiLock { get; set; }

        [YamlMember(Alias = "maxApplicationsPerDay")]
        public int MaxApplicationsPerDay { get; set; }

        [YamlMember(Alias = "minDelaySeconds")]
        public int MinDelaySeconds { get; set; }

        [YamlMember(Alias = "maxDelaySeconds")]
        public int MaxDelaySeconds { get; set; }

        // Application Content
        [YamlMember(Alias = "personalInfo")]
        public Dictionary<string, string> PersonalInfo { get; set; }

        [YamlMember(Alias = "eeo")]
        public Dictionary<string, string> Eeo { get; set; }

        [YamlMember(Alias = "uploads")]
        public Dictionary<string, string> Uploads { get; set; }

        [YamlMember(Alias = "universityGpa")]
        public double UniversityGpa { get; set; }

        // Technical Preferences
        [YamlMember(Alias = "checkboxes")]
        public Dictionary<string, bool> Checkboxes { get; set; }

        [YamlMember(Alias = "industry")]
        public Dictionary<string, int> Industry { get; set; }

        [YamlMember(Alias = "technology")]
        public Dictionary<string, int> Technology { get; set; }

        [YamlMember(Alias = "languages")]
        public Dictionary<string, string> Languages { get; set; }

        // Output Configuration
        [YamlMember(Alias = "outputFileDirectory")]
        public string OutputFileDirectory { get; set; }

        // Browser Configuration
        [YamlMember(Alias = "headlessMode")]
        public bool HeadlessMode { get; set; }

        [YamlMember(Alias = "userAgent")]
        public string UserAgent { get; set; }

        [YamlMember(Alias = "pageLoadTimeout")]
        public int PageLoadTimeout { get; set; }

        [YamlMember(Alias = "resumePath")]
        public string? ResumePath { get; set; }

        [YamlMember(Alias = "coverLetterPath")]
        public string? CoverLetterPath { get; set; }

        public LinkedinConfig()
        {
        }

        public LinkedinConfig(
            string? email = null,
            string password = null,
            List<string> positions = null,
            List<string> locations = null,
            int distance = 25,
            bool remote = false,
            Dictionary<string, bool> experienceLevel = null,
            Dictionary<string, bool> jobTypes = null,
            Dictionary<string, bool> datePosted = null,
            bool disableAntiLock = false,
            int maxApplicationsPerDay = 30,
            int minDelaySeconds = 5,
            int maxDelaySeconds = 15,
            Dictionary<string, string> personalInfo = null,
            Dictionary<string, string> eeo = null,
            Dictionary<string, string> uploads = null,
            double universityGpa = 3.5,
            Dictionary<string, bool> checkboxes = null,
            Dictionary<string, int> industry = null,
            Dictionary<string, int> technology = null,
            Dictionary<string, string> languages = null,
            string outputFileDirectory = "./output",
            bool headlessMode = false,
            string userAgent = null,
            int pageLoadTimeout = 30)
        {
            // Required fields
            Email = email;
            Password = password;
            Positions = positions ?? new List<string>();
            Locations = locations ?? new List<string>();

            // Optional fields with defaults
            Distance = distance;
            Remote = remote;
            ExperienceLevel = experienceLevel ?? new Dictionary<string, bool>();
            JobTypes = jobTypes ?? new Dictionary<string, bool>();
            DatePosted = datePosted ?? new Dictionary<string, bool>();
            DisableAntiLock = disableAntiLock;
            MaxApplicationsPerDay = maxApplicationsPerDay;
            MinDelaySeconds = minDelaySeconds;
            MaxDelaySeconds = maxDelaySeconds;
            PersonalInfo = personalInfo ?? new Dictionary<string, string>();
            Eeo = eeo ?? new Dictionary<string, string>();
            Uploads = uploads ?? new Dictionary<string, string>();
            UniversityGpa = universityGpa;
            Checkboxes = checkboxes ?? new Dictionary<string, bool>();
            Industry = industry ?? new Dictionary<string, int>();
            Technology = technology ?? new Dictionary<string, int>();
            Languages = languages ?? new Dictionary<string, string>();
            OutputFileDirectory = outputFileDirectory;
            HeadlessMode = headlessMode;
            UserAgent = userAgent ?? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36";
            PageLoadTimeout = pageLoadTimeout;

            // Ensure required uploads
            if (!Uploads.ContainsKey("Resume"))
            {
                throw new ArgumentException("Uploads must contain at least a 'Resume' entry");
            }
        }
    }
}
