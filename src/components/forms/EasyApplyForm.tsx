
import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import yaml from 'js-yaml';
import { toast } from 'sonner';

interface EasyApplyFormProps {
  platform: 'LinkedIn' | 'Naukri' | null;
  onClose: () => void;
}

interface ConfigData {
  platform?: string;
  email: string;
  password: string;
  positions: string[];
  locations: string[];
  personalInfo: {
    'First Name': string;
    'Last Name': string;
    'Mobile Phone Number': string;
    Linkedin: string;
  };
  uploads: {
    resume: string;
  };
}

const EasyApplyForm: React.FC<EasyApplyFormProps> = ({ platform, onClose }) => {
  const [mode, setMode] = useState<'manual' | 'upload'>('manual');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [automationLogs, setAutomationLogs] = useState<string[]>([]);
  const [configData, setConfigData] = useState<ConfigData>({
    platform: platform || undefined,
    email: '',
    password: '',
    positions: [],
    locations: [],
    personalInfo: {
      'First Name': '',
      'Last Name': '',
      'Mobile Phone Number': '',
      Linkedin: '',
    },
    uploads: {
      resume: '',
    },
  });

  const handleFieldChange = (field: keyof ConfigData, value: any) => {
    setConfigData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePersonalInfoChange = (field: keyof ConfigData['personalInfo'], value: string) => {
    setConfigData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/parse-resume`, formData);

      setConfigData((prev) => ({
        ...prev,
        ...res.data,
        uploads: { resume: file.name },
      }));
      setMessage('Resume parsed and fields pre-filled!');
      toast.success('Resume parsed successfully!');
    } catch (err: any) {
      setMessage('Failed to parse resume');
      toast.error('Failed to parse resume');
    } finally {
      setLoading(false);
    }
  };

  const generateAndDownloadYaml = () => {
    const yamlContent = yaml.dump(configData);
    const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' });
    saveAs(blob, 'config.yml');
    toast.success('config.yml generated!');
    setMessage('config.yml generated!');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    setAutomationLogs([]);
    try {
      // Send the JSON data directly without converting to YAML
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/apply-config`, 
        configData
      );
      
      setMessage('✅ Configuration saved and automation triggered!');
      
      // Display automation logs if available
      if (response.data.logs && Array.isArray(response.data.logs)) {
        setAutomationLogs(response.data.logs);
      }
      
      toast.success('Configuration applied successfully!');
    } catch (err: any) {
      console.error(err);
      setMessage('❌ Failed to save configuration');
      toast.error('Failed to apply configuration');
    } finally {
      setLoading(false);
    }
  };

  const messageColor = message.startsWith('✅') ? 'text-green-500' : 'text-red-500';

  if (!platform) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold">Easy Apply - {platform}</h2>

        <div className="flex gap-4">
          <Button variant={mode === 'manual' ? 'default' : 'outline'} onClick={() => setMode('manual')}>
            Fill Manually
          </Button>
          <Button variant={mode === 'upload' ? 'default' : 'outline'} onClick={() => setMode('upload')}>
            Upload Resume
          </Button>
        </div>

        {mode === 'upload' ? (
          <div>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Email"
              value={configData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className="input"
            />
            <input
              placeholder="Password"
              type="password"
              value={configData.password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              className="input"
            />
            <input
              placeholder="Position (comma separated)"
              onChange={(e) => handleFieldChange('positions', e.target.value.split(','))}
              className="input"
            />
            <input
              placeholder="Locations (comma separated)"
              onChange={(e) => handleFieldChange('locations', e.target.value.split(','))}
              className="input"
            />
            <input
              placeholder="First Name"
              value={configData.personalInfo['First Name']}
              onChange={(e) => handlePersonalInfoChange('First Name', e.target.value)}
              className="input"
            />
            <input
              placeholder="Last Name"
              value={configData.personalInfo['Last Name']}
              onChange={(e) => handlePersonalInfoChange('Last Name', e.target.value)}
              className="input"
            />
            <input
              placeholder="Mobile Number"
              value={configData.personalInfo['Mobile Phone Number']}
              onChange={(e) => handlePersonalInfoChange('Mobile Phone Number', e.target.value)}
              className="input"
            />
            <input
              placeholder="LinkedIn URL"
              value={configData.personalInfo.Linkedin}
              onChange={(e) => handlePersonalInfoChange('Linkedin', e.target.value)}
              className="input"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={generateAndDownloadYaml} variant="outline">
            Download YAML
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Apply Configuration'}
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>

        {message && <p className={`text-sm ${messageColor}`}>{message}</p>}
        
        {automationLogs.length > 0 && (
          <div className="mt-4 border rounded p-3 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-md font-semibold mb-2">Automation Logs:</h3>
            <div className="text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
              {automationLogs.map((log, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 py-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EasyApplyForm;
