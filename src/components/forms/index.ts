
const fs = require('fs');
const yaml = require('yaml');
const { validate } = require('email-validator');

function validateYaml() {
  const file = fs.readFileSync('config.yaml', 'utf8');
  const parameters = yaml.parse(file);

  const requiredParams = [
    'email', 'password', 'disableAntiLock', 'remote', 'experienceLevel',
    'jobTypes', 'date', 'positions', 'locations', 'distance',
    'outputFileDirectory', 'checkboxes', 'universityGpa',
    'languages', 'industry', 'technology', 'personalInfo', 'eeo', 'uploads'
  ];

  for (const param of requiredParams) {
    if (!(param in parameters)) {
      throw new Error(`${param} is not inside the YAML file!`);
    }
  }

  if (!validate(parameters.email)) throw new Error('Invalid email');
  if (!parameters.password || parameters.password.length === 0) throw new Error('Invalid password');

  if (typeof parameters.disableAntiLock !== 'boolean') throw new Error('disableAntiLock must be boolean');
  if (typeof parameters.remote !== 'boolean') throw new Error('remote must be boolean');

  const hasExperience = Object.values(parameters.experienceLevel).some(val => Boolean(val));
  if (!hasExperience) throw new Error('No experience level selected');

  const hasJobType = Object.values(parameters.jobTypes).some(val => Boolean(val));
  if (!hasJobType) throw new Error('No job type selected');

  const hasDate = Object.values(parameters.date).some(val => Boolean(val));
  if (!hasDate) throw new Error('No date selected');

  const approvedDistances = [0, 5, 10, 25, 50, 100];
  if (!approvedDistances.includes(parameters.distance)) throw new Error('Invalid distance');

  if (!parameters.positions.length || !parameters.locations.length)
    throw new Error('Positions and Locations must be provided');

  if (!parameters.uploads || !parameters.uploads.resume)
    throw new Error('Resume upload is missing');

  const checkboxes = parameters.checkboxes;
  const checkboxFields = [
    'driversLicence', 'requireVisa', 'legallyAuthorized',
    'urgentFill', 'commute', 'backgroundCheck', 'degreeCompleted'
  ];
  checkboxFields.forEach(field => {
    if (!(field in checkboxes) || typeof checkboxes[field] !== 'boolean') {
      throw new Error(`Invalid or missing checkbox field: ${field}`);
    }
  });

  if (typeof parameters.universityGpa !== 'number') throw new Error('universityGpa must be a number');

  const languageLevels = new Set(['none', 'conversational', 'professional', 'native or bilingual']);
  for (const [lang, level] of Object.entries(parameters.languages)) {
    const levelStr = String(level).toLowerCase();
    if (!languageLevels.has(levelStr)) {
      throw new Error(`Invalid language level for ${lang}`);
    }
  }

  const validateSkillMap = (map: Record<string, any>, name: string) => {
    for (const [skill, value] of Object.entries(map)) {
      if (typeof value !== 'number') throw new Error(`${name} value for ${skill} must be a number`);
    }
    if (!('default' in map)) throw new Error(`${name} must contain a 'default' key`);
  };

  validateSkillMap(parameters.industry, 'Industry');
  validateSkillMap(parameters.technology, 'Technology');

  Object.entries(parameters.personalInfo).forEach(([key, val]) => {
    if (!val || val === '') throw new Error(`Missing value in personalInfo: ${key}`);
  });

  Object.entries(parameters.eeo).forEach(([key, val]) => {
    if (!val || val === '') throw new Error(`Missing value in eeo: ${key}`);
  });

  return parameters;
}

// Simplified function to run the automation through the backend API
async function runLinkedinAutomation() {
  try {
    const parameters = validateYaml();
    console.log('Automation parameters validated, calling backend API...');
    
    // In a real implementation, this would make an API call to the backend
    // For demonstration purposes, we're just logging a message
    console.log('Backend API would be called here with parameters.');
    
    return {
      success: true,
      message: 'Parameters validated. Use the backend API to run the automation.'
    };
  } catch (err) {
    console.error('Error:', err instanceof Error ? err.message : String(err));
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err)
    };
  }
}

module.exports = { validateYaml, runLinkedinAutomation };
