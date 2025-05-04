import React, { useState } from "react";
import { APIHelper } from "../../utils/axios";
import yaml from "js-yaml";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { Button } from "../ui/button";
import {
  runLinkedinAutomation,
  LinkedinConfig,
} from "../../services/linkedinService";

interface EasyApplyFormProps {
  platform: "LinkedIn" | "Naukri" | null;
  onClose: () => void;
}

const EasyApplyForm: React.FC<EasyApplyFormProps> = ({ platform, onClose }) => {
  const [mode, setMode] = useState<"json" | "manual" | "upload">("json");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [automationLogs, setAutomationLogs] = useState<string[]>([]);
  const [configData, setConfigData] = useState<LinkedinConfig>({
    platform: platform || undefined,
    email: "",
    password: "",
    disableAntiLock: false,
    remote: false,
    experienceLevel: {},
    jobTypes: {},
    date: {},
    positions: [],
    locations: [],
    distance: 25,
    checkboxes: {
      driversLicence: false,
      requireVisa: false,
      legallyAuthorized: true,
      urgentFill: false,
      commute: false,
      backgroundCheck: true,
      degreeCompleted: true,
    },
    universityGpa: 3.0,
    languages: {},
    industry: {},
    technology: {},
    personalInfo: {
      "First Name": "",
      "Last Name": "",
      "Mobile Phone Number": "",
      Linkedin: "",
      "Phone Country Code": "+1",
      City: "",
      State: "",
      Zip: "",
      "Street address": "",
      Website: "",
    },
    eeo: {},
    uploads: {
      resume: "",
    },
  });

  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(configData, null, 2)
  );

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      const res = await APIHelper.post<any, FormData>(
        `${
          import.meta?.env?.VITE_BACKEND_URL || "http://localhost:3000"
        }/api/parse-resume`,
        formData
      );

      setConfigData((prev) => ({
        ...prev,
        ...res.data,
        uploads: { resume: file.name },
      }));
      setMessage("✅ Resume parsed and fields pre-filled!");
      toast.success("Resume parsed successfully!");
    } catch (err) {
      setMessage("❌ Failed to parse resume");
      toast.error("Failed to parse resume");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    setAutomationLogs([]);

    let finalConfig = configData;

    if (mode === "json") {
      try {
        finalConfig = JSON.parse(jsonInput);
      } catch (err) {
        toast.error("Invalid JSON format");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await runLinkedinAutomation(finalConfig);

      if (response.success) {
        setMessage("✅ Automation triggered successfully!");
        toast.success("LinkedIn automation started!");
      } else {
        setMessage(`❌ Automation failed: ${response.message}`);
        toast.error("LinkedIn automation failed");
      }

      if (response.logs) setAutomationLogs(response.logs);
    } catch (err) {
      console.error(err);
      toast.error("Failed to run automation");
      setMessage("❌ Failed to run automation");
    } finally {
      setLoading(false);
    }
  };

  const generateAndDownloadYaml = () => {
    try {
      const yamlContent = yaml.dump(configData);
      const blob = new Blob([yamlContent], { type: "text/yaml;charset=utf-8" });
      saveAs(blob, "config.yml");
      toast.success("config.yml downloaded!");
    } catch {
      toast.error("Failed to generate YAML");
    }
  };

  const messageColor = message.startsWith("✅")
    ? "text-green-500"
    : "text-red-500";

  if (!platform) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background dark:bg-gray-900 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4">
        <h2 className="text-xl font-bold">Easy Apply - {platform}</h2>

        <div className="flex gap-4">
          <Button
            variant={mode === "json" ? "default" : "outline"}
            onClick={() => setMode("json")}
          >
            Enter JSON
          </Button>
          <Button
            variant={mode === "manual" ? "default" : "outline"}
            onClick={() => setMode("manual")}
          >
            Fill Manually
          </Button>
          <Button
            variant={mode === "upload" ? "default" : "outline"}
            onClick={() => setMode("upload")}
          >
            Upload Resume
          </Button>
        </div>

        {mode === "json" && (
          <textarea
            className="w-full h-80 p-2 font-mono border rounded dark:bg-gray-800 dark:text-white"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        )}

        {mode === "upload" && (
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />
        )}

        {/* Manual fields mode (optional, hidden behind button) */}
        {mode === "manual" && (
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Email"
              value={configData.email}
              onChange={(e) =>
                setConfigData({ ...configData, email: e.target.value })
              }
              className="input"
            />
            <input
              placeholder="Password"
              type="password"
              value={configData.password}
              onChange={(e) =>
                setConfigData({ ...configData, password: e.target.value })
              }
              className="input"
            />
            {/* Add more inputs as needed */}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={generateAndDownloadYaml} variant="outline">
            Download YAML
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Apply Configuration"}
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
                <div
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 py-1"
                >
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
