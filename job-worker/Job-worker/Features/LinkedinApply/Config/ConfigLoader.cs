using Job_worker.Shared.Models;
using YamlDotNet.Serialization;

namespace Job_worker.Features.LinkedinApply.Config
{
    public static class ConfigLoader
    {
        public static LinkedinConfig LoadConfig(string configFilePath)
        {
            try
            {
                var yamlContent = File.ReadAllText(configFilePath).Trim();
                var deserializer = new DeserializerBuilder().Build();
                var config = deserializer.Deserialize<LinkedinConfig>(yamlContent);

                ValidateConfig(config);
                return config;
            }
            catch (Exception ex)
            {
                // Log the error or output to console
                Console.WriteLine($"Error during YAML deserialization: {ex.Message}");
                throw;
            }
        }


        private static void ValidateConfig(LinkedinConfig config)
        {
            var missingFields = new List<string>();

            // Check required fields (Email, Password)
            if (string.IsNullOrWhiteSpace(config.Email)) missingFields.Add(nameof(config.Email));
            if (string.IsNullOrWhiteSpace(config.Password)) missingFields.Add(nameof(config.Password));

            // Check if ExperienceLevel contains any valid entries
            if (config.ExperienceLevel == null || !config.ExperienceLevel.Values.Any(v => v))
                missingFields.Add(nameof(config.ExperienceLevel));

            // Check if JobTypes contains any valid entries
            if (config.JobTypes == null || !config.JobTypes.Values.Any(v => v))
                missingFields.Add(nameof(config.JobTypes));

            // Ensure DatePosted has a valid value (at least one valid entry)
            if (config.DatePosted == null || !config.DatePosted.Values.Any(v => v))
                missingFields.Add(nameof(config.DatePosted));

            // Check for positions and locations
            if (config.Positions == null || !config.Positions.Any()) missingFields.Add(nameof(config.Positions));
            if (config.Locations == null || !config.Locations.Any()) missingFields.Add(nameof(config.Locations));

            // Ensure 'Resume' is present in Uploads
            if (config.Uploads == null || !config.Uploads.ContainsKey("Resume")) missingFields.Add(nameof(config.Uploads));

            // Validate distance
            if (config.Distance is < 0 or > 100) missingFields.Add(nameof(config.Distance));

            // Validate Checkboxes (required keys)
            if (config.Checkboxes == null ||
                !config.Checkboxes.ContainsKey("driversLicence") ||
                !config.Checkboxes.ContainsKey("requireVisa") ||
                !config.Checkboxes.ContainsKey("legallyAuthorized") ||
                !config.Checkboxes.ContainsKey("urgentFill") ||
                !config.Checkboxes.ContainsKey("commute") ||
                !config.Checkboxes.ContainsKey("backgroundCheck") ||
                !config.Checkboxes.ContainsKey("degreeCompleted"))
            {
                missingFields.Add(nameof(config.Checkboxes));
            }

            // Validate University GPA
            if (config.UniversityGpa <= 0 || config.UniversityGpa > 4)
                missingFields.Add(nameof(config.UniversityGpa));

            // Validate Languages
            if (config.Languages == null || config.Languages.Values.Any(val =>
                    !new[] { "none", "conversational", "professional", "native or bilingual" }
                    .Contains(val.ToLower())))
            {
                missingFields.Add(nameof(config.Languages));
            }

            // Validate Industry (contains "default")
            if (config.Industry == null || !config.Industry.ContainsKey("default"))
                missingFields.Add(nameof(config.Industry));

            // Validate Technology (contains "default")
            if (config.Technology == null || !config.Technology.ContainsKey("default"))
                missingFields.Add(nameof(config.Technology));

            // Validate Personal Info
            if (config.PersonalInfo == null || config.PersonalInfo.Values.Any(string.IsNullOrWhiteSpace))
                missingFields.Add(nameof(config.PersonalInfo));

            // Validate EEO (Equal Employment Opportunity)
            if (config.Eeo == null || config.Eeo.Values.Any(string.IsNullOrWhiteSpace))
                missingFields.Add(nameof(config.Eeo));

            // Throw exception if there are any missing or invalid fields
            if (missingFields.Any())
            {
                var message = "Invalid or missing fields in config: " + string.Join(", ", missingFields);
                throw new Exception(message);
            }
        }
    }
}
