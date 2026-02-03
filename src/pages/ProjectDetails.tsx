import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, User } from "lucide-react";
import Logo from "../assets/Logo.png";

const mockProject = {
  id: 1,
  title: "Modern Duplex in Lekki",
  developer_name: "Engr. Adewale Structures",
  status: "In Progress",
  progress: 45,
  start_date: "2024-08-15",
  expected_completion: "2025-02-15",
  budget: "8.5",
  location: "Lekki, Lagos",
  image:
    "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=800&fit=crop",
  description:
    "A contemporary duplex project with modern finishes, 4 bedrooms, open plan living and sustainable features.",
  media: [
    {
      id: 1,
      url: 
        "https://images.unsplash.com/photo-1560184897-6af27d7b5a0b?w=1200&h=800&fit=crop",
    },
  ],
  milestones: [
    { id: 1, title: "Foundation", status: "completed" },
    { id: 2, title: "Block Work", status: "in_progress" },
    { id: 3, title: "Roofing", status: "pending" },
  ],
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any | null>(null);

  useEffect(() => {
    // For now use mock data. In future replace with apiClient.getProject(id)
    if (!id) return;
    // If id matches mock, show it; otherwise still show mock but with id
    setProject({ ...mockProject, id: Number(id) });
  }, [id]);

  if (!project) return null;

  const formatBudget = (b: any) => {
    if (b === null || b === undefined || b === "") return "—";
    const s = typeof b === "number" ? String(b) : String(b).trim();
    return /[Mm]/.test(s) ? s : `${s}M`;
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-700 hover:opacity-80">
              ← Back
            </button>
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="text-sm">{project.status}</Badge>
            <Button onClick={() => navigate('/projects')} variant="ghost">All Projects</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                <img src={project.image} alt={project.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Developer</p>
                    <p className="font-semibold">{project.developer_name}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                      <Calendar className="h-4 w-4 ml-4" />
                      <span>{project.start_date} — {project.expected_completion}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-semibold text-green-600 text-lg">{formatBudget(project.budget)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Project Description</h3>
                  <p className="text-sm text-gray-700">{project.description}</p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Progress</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Progress value={project.progress || 0} className="h-3" />
                    </div>
                    <div className="text-sm text-gray-600">{project.progress || 0}%</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Milestones</h4>
                  <ul className="space-y-2">
                    {project.milestones.map((m: any) => (
                      <li key={m.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{m.title}</p>
                          <p className="text-xs text-gray-500 capitalize">{m.status.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <Badge className="text-xs">{m.status === 'completed' ? 'Done' : m.status === 'in_progress' ? 'In Progress' : 'Pending'}</Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <img src={Logo} alt="logo" className="mx-auto w-28 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">Project actions</p>
                  <div className="space-y-2">
                    <Button className="w-full">Message Developer</Button>
                    <Button variant="outline" className="w-full">Download Report</Button>
                    <Button variant="ghost" className="w-full">Share</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
