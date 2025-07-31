import { Job } from "@/shared/types";

export const sampleJobs: Job[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title: "Frontend Developer",
    company: "Google",
    location: "Mountain View, CA (Remote)",
    description:
      "We are looking for a frontend developer with experience in React and TypeScript to join our team.",
    url: "https://example.com/job/1",
    date: "2025-04-10",
    salary: "$120,000 - $150,000",
    skills: ["React", "TypeScript", "CSS", "HTML"],
    source: "LinkedIn",
    isNew: true,
  },
  {
    id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    title: "Full Stack Engineer",
    company: "Amazon",
    location: "Seattle, WA",
    description:
      "Join our team to build scalable web applications using modern technologies.",
    url: "https://example.com/job/2",
    date: "2025-04-09",
    salary: "$130,000 - $160,000",
    skills: ["React", "Node.js", "AWS", "MongoDB"],
    source: "Indeed",
  },
  {
    id: "3e7c3f6d-bdf5-46ae-8d90-171300f27ae2",
    title: "Backend Developer",
    company: "Microsoft",
    location: "Redmond, WA (Hybrid)",
    description:
      "Looking for a backend developer with strong .NET experience to join our cloud services team.",
    url: "https://example.com/job/3",
    date: "2025-04-08",
    skills: [".NET", "C#", "Azure", "SQL"],
    source: "Company Website",
    isNew: true,
  },
  {
    id: "d4e8ca4b-fe4a-4a64-9fda-a1d5df2a68ef",
    title: "DevOps Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    description:
      "Join our infrastructure team to help build and maintain our cloud-based platform.",
    url: "https://example.com/job/4",
    date: "2025-04-07",
    salary: "$140,000 - $170,000",
    skills: ["Kubernetes", "Docker", "AWS", "Terraform"],
    source: "LinkedIn",
  },
  {
    id: "b5c67fd9-24d4-448d-a31f-cab5eb2604dc",
    title: "AI Engineer",
    company: "Google",
    location: "New York, NY",
    description:
      "Work on cutting-edge AI projects using machine learning and deep learning techniques.",
    url: "https://example.com/job/5",
    date: "2025-04-06",
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning"],
    source: "Indeed",
  },
  {
    id: "8a1d5826-5e8f-44c3-9efe-53b5b36360ea",
    title: "Mobile Developer",
    company: "Apple",
    location: "Cupertino, CA",
    description:
      "Join our team to develop iOS applications using Swift and SwiftUI.",
    url: "https://example.com/job/6",
    date: "2025-04-05",
    salary: "$125,000 - $155,000",
    skills: ["Swift", "iOS", "UIKit", "SwiftUI"],
    source: "Company Website",
  },
];
