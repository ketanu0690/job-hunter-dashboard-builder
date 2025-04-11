
import { Job } from '@/types';

export const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Mountain View, CA (Remote)',
    description: 'We are looking for a frontend developer with experience in React and TypeScript to join our team.',
    url: 'https://example.com/job/1',
    date: '2025-04-10',
    salary: '$120,000 - $150,000',
    skills: ['React', 'TypeScript', 'CSS', 'HTML'],
    source: 'LinkedIn',
    isNew: true
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'Amazon',
    location: 'Seattle, WA',
    description: 'Join our team to build scalable web applications using modern technologies.',
    url: 'https://example.com/job/2',
    date: '2025-04-09',
    salary: '$130,000 - $160,000',
    skills: ['React', 'Node.js', 'AWS', 'MongoDB'],
    source: 'Indeed'
  },
  {
    id: '3',
    title: 'Backend Developer',
    company: 'Microsoft',
    location: 'Redmond, WA (Hybrid)',
    description: 'Looking for a backend developer with strong .NET experience to join our cloud services team.',
    url: 'https://example.com/job/3',
    date: '2025-04-08',
    skills: ['.NET', 'C#', 'Azure', 'SQL'],
    source: 'Company Website',
    isNew: true
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    description: 'Join our infrastructure team to help build and maintain our cloud-based platform.',
    url: 'https://example.com/job/4',
    date: '2025-04-07',
    salary: '$140,000 - $170,000',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'],
    source: 'LinkedIn'
  },
  {
    id: '5',
    title: 'AI Engineer',
    company: 'Google',
    location: 'New York, NY',
    description: 'Work on cutting-edge AI projects using machine learning and deep learning techniques.',
    url: 'https://example.com/job/5',
    date: '2025-04-06',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
    source: 'Indeed'
  },
  {
    id: '6',
    title: 'Mobile Developer',
    company: 'Apple',
    location: 'Cupertino, CA',
    description: 'Join our team to develop iOS applications using Swift and SwiftUI.',
    url: 'https://example.com/job/6',
    date: '2025-04-05',
    salary: '$125,000 - $155,000',
    skills: ['Swift', 'iOS', 'UIKit', 'SwiftUI'],
    source: 'Company Website'
  }
];
