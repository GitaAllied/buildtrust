
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Camera, Video, FileText } from "lucide-react";

const UploadUpdate = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState("");
  const [milestone, setMilestone] = useState("");
  const [description, setDescription] = useState("");

  const projects = [
    { id: 1, name: "Family Duplex - Chioma Adeleke" },
    { id: 2, name: "Office Complex - James Okonkwo" },
    { id: 3, name: "Modern Villa - Ada Nwosu" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Upload Progress Update</h1>
              <p className="text-gray-500">Share project progress with your clients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Project Progress Update
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project">Select Project</Label>
                <select 
                  id="project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="milestone">Milestone/Phase</Label>
                <Input 
                  id="milestone"
                  placeholder="e.g., Foundation Complete, Roofing Started"
                  value={milestone}
                  onChange={(e) => setMilestone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Progress Description</Label>
              <Textarea 
                id="description"
                placeholder="Describe the completed work, any challenges, and next steps..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>Upload Media</Label>
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-dashed border-2 border-gray-300 hover:border-green-500 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload Photos</p>
                    <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed border-2 border-gray-300 hover:border-green-500 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Video className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload Videos</p>
                    <p className="text-xs text-gray-400">MP4, MOV up to 50MB</p>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed border-2 border-gray-300 hover:border-green-500 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload Documents</p>
                    <p className="text-xs text-gray-400">PDF, DOC up to 5MB</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <div className="space-x-3">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadUpdate;
