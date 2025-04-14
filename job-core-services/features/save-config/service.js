const fs = require('fs');
const path = require('path');

async function saveConfig(yamlContent) {
  try {
    const filePath = path.join(__dirname, 'config.yml');
    fs.writeFileSync(filePath, yamlContent);
    return { message: 'Configuration saved to config.yml' };
  } catch (error) {
    console.error('Error saving configuration:', error);
    throw new Error('Failed to save configuration.');
  }
}

async function getConfig() {
  try {
    const filePath = path.join(__dirname, 'config.yml');

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      const yamlContent = fs.readFileSync(filePath, 'utf8');
      return { config: yamlContent };
    } else {
      return { message: 'Configuration file not found' };
    }
  } catch (error) {
    console.error('Error reading configuration:', error);
    // Return an error message instead of throwing an error
    return { message: 'Error reading config.yml: ' + error.message };
  }
}

module.exports = { saveConfig, getConfig };