import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Loader2, FileSpreadsheet, Upload, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { importJobsFromExcel } from "@/services/jobService";

const ExcelImport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    total: number;
    sample: any[];
  } | null>(null);

  const processExcel = (file: File) => {
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError("The Excel file is empty");
          setIsLoading(false);
          return;
        }

        // Validate data format
        const requiredFields = [
          "title",
          "company",
          "location",
          "description",
          "url",
          "date",
        ];
        const firstRow = jsonData[0] as any;

        const missingFields = requiredFields.filter(
          (field) => !(field in firstRow)
        );
        if (missingFields.length > 0) {
          setError(`Missing required fields: ${missingFields.join(", ")}`);
          setIsLoading(false);
          return;
        }

        // Show preview with the total count and sample of first 3 items
        setPreview({
          total: jsonData.length,
          sample: jsonData.slice(0, 3),
        });

        setIsLoading(false);
      } catch (err) {
        setError("Failed to process Excel file: " + (err as Error).message);
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file");
      setIsLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (fileExt !== "xlsx" && fileExt !== "xls") {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    processExcel(file);
  };

  const handleImport = async () => {
    if (!preview) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      const fileInput = document.getElementById(
        "excel-file"
      ) as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (!file) {
        setError("No file selected");
        setIsLoading(false);
        return;
      }

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Process each job to match our Job type format
          const processedJobs = jsonData.map((job: any) => ({
            id: job.id || uuidv4(),
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            url: job.url,
            date: job.date,
            salary: job.salary || undefined,
            skills: job.skills
              ? typeof job.skills === "string"
                ? job.skills.split(",").map((s: string) => s.trim())
                : job.skills
              : [],
            source: job.source || "Excel Import",
            isNew: true,
          }));

          await importJobsFromExcel(processedJobs);

          toast({
            title: "Import successful",
            description: `${processedJobs.length} jobs have been imported from the Excel file`,
          });

          // Reset the form
          setPreview(null);
          if (fileInput) fileInput.value = "";

          setIsLoading(false);
        } catch (err) {
          console.error("Error during import:", err);
          setError("Failed to import jobs: " + (err as Error).message);
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setError("Failed to read the file");
        setIsLoading(false);
      };

      reader.readAsBinaryString(file);
    } catch (err) {
      console.error("Error during import setup:", err);
      setError("Failed to start import: " + (err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Import Jobs from Excel</h3>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium">Select Excel File</span>
          <div className="mt-1 flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById("excel-file")?.click()}
              disabled={isLoading}
              className="relative overflow-hidden"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
            <input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="sr-only"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {preview
                ? `File selected (${preview.total} jobs)`
                : "No file selected"}
            </span>
          </div>
        </label>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>The Excel file should have these columns:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>title (required)</li>
            <li>company (required)</li>
            <li>location (required)</li>
            <li>description (required)</li>
            <li>url (required)</li>
            <li>date (required)</li>
            <li>salary (optional)</li>
            <li>skills (optional, comma-separated)</li>
            <li>source (optional)</li>
          </ul>
        </div>

        {preview && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">
              Preview (showing 3 of {preview.total} jobs):
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-auto max-h-60">
              <pre className="text-xs">
                {JSON.stringify(preview.sample, null, 2)}
              </pre>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleImport} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import {preview.total} Jobs
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelImport;
