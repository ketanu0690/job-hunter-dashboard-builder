
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const automationService = require('./automation');

async function applyConfig(configData) {
  try {
    // Convert JSON to YAML
    const yamlContent = yaml.dump(configData);
    
    // Define the path for config.yml
    const filePath = path.join(__dirname, 'config.yml');
    
    // Save YAML to file
    fs.writeFileSync(filePath, yamlContent);
    
    // Trigger automation logic
    const automationResult = await automationService.runAutomation(configData);
    
    return {
      status: 'success',
      message: 'Configuration saved and automation triggered successfully',
      automationSummary: {
        platform: configData.platform || 'Not specified',
        positions: configData.positions || [],
        locations: configData.locations || [],
        resumePath: configData.uploads?.resume || 'Not uploaded'
      },
      logs: automationResult.logs
    };
  } catch (error) {
    console.error('Error applying configuration:', error);
    throw new Error(`Failed to apply configuration: ${error.message}`);
  }
}

module.exports = { applyConfig };
