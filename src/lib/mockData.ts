/**
 * Mock Data for Admin Dashboard
 * This file contains mock data for development/demonstration purposes
 * Replace with real API calls when backend endpoints are ready
 */

export interface Developer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  rating?: number;
  bio?: string;
  website?: string;
  completed_projects?: number;
  is_active: boolean;
  years_experience?: number;
  specializations?: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  client_id: number;
  developer_id?: number;
  status: string;
  budget: number;
  created_at: string;
  updated_at: string;
  client_name?: string;
  developer_name?: string;
}

export interface Contract {
  id: number;
  project_id: number;
  developer_id: number;
  agreed_amount: number;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  project_title?: string;
  developer_name?: string;
}

// Mock Developers
export const mockDevelopers: Developer[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1-555-0101",
    location: "San Francisco, CA",
    rating: 4.8,
    bio: "Senior Full Stack Developer with 8+ years of experience in web development",
    website: "https://johnsmith.dev",
    completed_projects: 24,
    is_active: true,
    years_experience: 8,
    specializations: ["React", "Node.js", "Python", "PostgreSQL"],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1-555-0102",
    location: "New York, NY",
    rating: 4.9,
    bio: "Frontend Specialist - React, Vue, and modern CSS frameworks",
    website: "https://sarahjohnson.design",
    completed_projects: 18,
    is_active: true,
    years_experience: 6,
    specializations: ["React", "Vue.js", "CSS", "TypeScript"],
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1-555-0103",
    location: "Seattle, WA",
    rating: 4.7,
    bio: "Backend Developer specializing in scalable microservices",
    website: "https://mchen.tech",
    completed_projects: 31,
    is_active: true,
    years_experience: 10,
    specializations: ["Node.js", "Docker", "AWS", "MongoDB"],
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    phone: "+1-555-0104",
    location: "Austin, TX",
    rating: 4.6,
    bio: "Mobile app developer with expertise in React Native and Flutter",
    website: "https://emmadavis.app",
    completed_projects: 15,
    is_active: true,
    years_experience: 5,
    specializations: ["React Native", "Flutter", "JavaScript"],
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "+1-555-0105",
    location: "Boston, MA",
    rating: 4.5,
    bio: "DevOps Engineer and Cloud Infrastructure Specialist",
    website: "https://dwilson.cloud",
    completed_projects: 28,
    is_active: false,
    years_experience: 7,
    specializations: ["Kubernetes", "AWS", "CI/CD", "Linux"],
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone: "+1-555-0106",
    location: "Denver, CO",
    rating: 4.8,
    bio: "Full Stack Developer with focus on AI and machine learning integration",
    website: "https://lisaanderson.ai",
    completed_projects: 20,
    is_active: true,
    years_experience: 7,
    specializations: ["Python", "TensorFlow", "Machine Learning", "FastAPI"],
  },
  {
    id: 7,
    name: "Robert Martinez",
    email: "robert.martinez@example.com",
    phone: "+1-555-0107",
    location: "Los Angeles, CA",
    rating: 4.7,
    bio: "UI/UX Developer and designer with strong creative background",
    website: "https://rmartinez.design",
    completed_projects: 22,
    is_active: true,
    years_experience: 6,
    specializations: ["React", "Figma", "CSS", "Web Design"],
  },
  {
    id: 8,
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    phone: "+1-555-0108",
    location: "Miami, FL",
    rating: 4.9,
    bio: "E-commerce specialist with expertise in conversion optimization",
    website: "https://jlee.commerce",
    completed_projects: 19,
    is_active: true,
    years_experience: 5,
    specializations: ["Next.js", "Shopify", "E-commerce", "Analytics"],
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform Redesign",
    description: "Complete redesign and modernization of the existing e-commerce platform",
    client_id: 101,
    developer_id: 1,
    status: "in_progress",
    budget: 15000,
    created_at: "2025-11-15T10:30:00Z",
    updated_at: "2026-02-03T14:20:00Z",
    client_name: "TechStore Inc.",
    developer_name: "John Smith",
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Native iOS and Android app for fitness tracking",
    client_id: 102,
    developer_id: 4,
    status: "in_progress",
    budget: 22000,
    created_at: "2025-12-01T09:00:00Z",
    updated_at: "2026-02-02T11:45:00Z",
    client_name: "FitLife Corp",
    developer_name: "Emma Davis",
  },
  {
    id: 3,
    title: "Dashboard Analytics System",
    description: "Real-time analytics dashboard with data visualization",
    client_id: 103,
    developer_id: 2,
    status: "completed",
    budget: 18000,
    created_at: "2025-09-20T13:15:00Z",
    updated_at: "2026-01-15T16:30:00Z",
    client_name: "DataViz Solutions",
    developer_name: "Sarah Johnson",
  },
  {
    id: 4,
    title: "Backend API Refactoring",
    description: "Refactor monolithic backend to microservices architecture",
    client_id: 104,
    developer_id: 3,
    status: "in_progress",
    budget: 25000,
    created_at: "2025-10-10T08:20:00Z",
    updated_at: "2026-02-01T09:15:00Z",
    client_name: "CloudBase Systems",
    developer_name: "Michael Chen",
  },
  {
    id: 5,
    title: "Website Optimization",
    description: "Performance optimization and SEO improvements",
    client_id: 105,
    developer_id: 7,
    status: "open",
    budget: 8500,
    created_at: "2026-01-25T11:00:00Z",
    updated_at: "2026-02-03T10:30:00Z",
    client_name: "StartupHub",
    developer_name: "Robert Martinez",
  },
  {
    id: 6,
    title: "CRM System Implementation",
    description: "Custom CRM system for sales and customer management",
    client_id: 106,
    developer_id: 1,
    status: "open",
    budget: 28000,
    created_at: "2026-01-30T14:45:00Z",
    updated_at: "2026-02-03T15:20:00Z",
    client_name: "SalesPro Ltd",
    developer_name: "John Smith",
  },
  {
    id: 7,
    title: "Inventory Management System",
    description: "Warehouse inventory tracking and management system",
    client_id: 107,
    developer_id: 8,
    status: "in_progress",
    budget: 19000,
    created_at: "2025-11-05T10:00:00Z",
    updated_at: "2026-02-02T13:30:00Z",
    client_name: "LogisticsPro",
    developer_name: "Jennifer Lee",
  },
  {
    id: 8,
    title: "AI Chatbot Integration",
    description: "Implement AI-powered chatbot for customer support",
    client_id: 108,
    developer_id: 6,
    status: "completed",
    budget: 12000,
    created_at: "2025-08-15T09:30:00Z",
    updated_at: "2026-01-28T12:00:00Z",
    client_name: "TechSupport Pro",
    developer_name: "Lisa Anderson",
  },
];

// Mock Contracts
export const mockContracts: Contract[] = [
  {
    id: 1,
    project_id: 1,
    developer_id: 1,
    agreed_amount: 15000,
    status: "active",
    start_date: "2025-11-15",
    end_date: "2026-02-15",
    created_at: "2025-11-15T10:30:00Z",
    project_title: "E-commerce Platform Redesign",
    developer_name: "John Smith",
  },
  {
    id: 2,
    project_id: 2,
    developer_id: 4,
    agreed_amount: 22000,
    status: "active",
    start_date: "2025-12-01",
    end_date: "2026-04-01",
    created_at: "2025-12-01T09:00:00Z",
    project_title: "Mobile App Development",
    developer_name: "Emma Davis",
  },
  {
    id: 3,
    project_id: 3,
    developer_id: 2,
    agreed_amount: 18000,
    status: "completed",
    start_date: "2025-09-20",
    end_date: "2026-01-15",
    created_at: "2025-09-20T13:15:00Z",
    project_title: "Dashboard Analytics System",
    developer_name: "Sarah Johnson",
  },
  {
    id: 4,
    project_id: 4,
    developer_id: 3,
    agreed_amount: 25000,
    status: "active",
    start_date: "2025-10-10",
    end_date: "2026-03-10",
    created_at: "2025-10-10T08:20:00Z",
    project_title: "Backend API Refactoring",
    developer_name: "Michael Chen",
  },
  {
    id: 5,
    project_id: 7,
    developer_id: 8,
    agreed_amount: 19000,
    status: "active",
    start_date: "2025-11-05",
    end_date: "2026-03-05",
    created_at: "2025-11-05T10:00:00Z",
    project_title: "Inventory Management System",
    developer_name: "Jennifer Lee",
  },
  {
    id: 6,
    project_id: 8,
    developer_id: 6,
    agreed_amount: 12000,
    status: "completed",
    start_date: "2025-08-15",
    end_date: "2026-01-28",
    created_at: "2025-08-15T09:30:00Z",
    project_title: "AI Chatbot Integration",
    developer_name: "Lisa Anderson",
  },
];

/**
 * Helper functions to get mock data
 * These can be replaced with real API calls
 */

export const getAllDevelopers = (): Developer[] => {
  return mockDevelopers;
};

export const getDeveloperById = (id: number): Developer | undefined => {
  return mockDevelopers.find(dev => dev.id === id);
};

export const getAllProjects = (): Project[] => {
  return mockProjects;
};

export const getProjectById = (id: number): Project | undefined => {
  return mockProjects.find(proj => proj.id === id);
};

export const getAllContracts = (): Contract[] => {
  return mockContracts;
};

export const getContractById = (id: number): Contract | undefined => {
  return mockContracts.find(contract => contract.id === id);
};

export const getContractsByProjectId = (projectId: number): Contract[] => {
  return mockContracts.filter(contract => contract.project_id === projectId);
};

export const updateProject = (id: number, updates: Partial<Project>): Project | undefined => {
  const project = mockProjects.find(p => p.id === id);
  if (project) {
    Object.assign(project, updates, { updated_at: new Date().toISOString() });
  }
  return project;
};

export const updateDeveloper = (id: number, updates: Partial<Developer>): Developer | undefined => {
  const developer = mockDevelopers.find(d => d.id === id);
  if (developer) {
    Object.assign(developer, updates);
  }
  return developer;
};

export const updateContract = (id: number, updates: Partial<Contract>): Contract | undefined => {
  const contract = mockContracts.find(c => c.id === id);
  if (contract) {
    Object.assign(contract, updates);
  }
  return contract;
};
