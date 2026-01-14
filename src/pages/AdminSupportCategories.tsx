import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Tag, Shield, AlertTriangle } from "lucide-react";

interface SupportCategory {
  id: number;
  name: string;
  description: string;
  ticketCount: number;
  isActive: boolean;
  createdAt: string;
  color: string;
}

const AdminSupportCategories = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SupportCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3B82F6"
  });

  // Mock categories data
  const [categories, setCategories] = useState<SupportCategory[]>([
    {
      id: 1,
      name: "Account",
      description: "Account registration, login, and profile issues",
      ticketCount: 45,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#3B82F6"
    },
    {
      id: 2,
      name: "Payment",
      description: "Payment processing, refunds, and billing issues",
      ticketCount: 32,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#10B981"
    },
    {
      id: 3,
      name: "Technical",
      description: "Technical issues, bugs, and platform errors",
      ticketCount: 67,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#F59E0B"
    },
    {
      id: 4,
      name: "Project",
      description: "Project management, milestones, and deliverables",
      ticketCount: 28,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#8B5CF6"
    },
    {
      id: 5,
      name: "Verification",
      description: "Identity verification and document approval",
      ticketCount: 15,
      isActive: true,
      createdAt: "2024-01-01",
      color: "#EF4444"
    },
    {
      id: 6,
      name: "General",
      description: "General inquiries and miscellaneous issues",
      ticketCount: 23,
      isActive: false,
      createdAt: "2024-01-01",
      color: "#6B7280"
    }
  ]);

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      // In a real app, this would make an API call
      const category: SupportCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: newCategory.name,
        description: newCategory.description,
        ticketCount: 0,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        color: newCategory.color
      };

      setCategories(prev => [...prev, category]);
      setNewCategory({ name: "", description: "", color: "#3B82F6" });
      setIsCreateDialogOpen(false);

      alert("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      // In a real app, this would make an API call
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id
            ? { ...editingCategory }
            : cat
        )
      );

      setIsEditDialogOpen(false);
      setEditingCategory(null);

      alert("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (category.ticketCount > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${category.ticketCount} associated tickets. Please reassign or close all tickets first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // In a real app, this would make an API call
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleToggleStatus = async (categoryId: number) => {
    try {
      // In a real app, this would make an API call
      setCategories(prev =>
        prev.map(cat =>
          cat.id === categoryId
            ? { ...cat, isActive: !cat.isActive }
            : cat
        )
      );
    } catch (error) {
      console.error("Error updating category status:", error);
      alert("Failed to update category status. Please try again.");
    }
  };

  const openEditDialog = (category: SupportCategory) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/support')}
                className="flex items-center space-x-2"
                aria-label="Back to Support"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Support</span>
              </Button>
              <div className="block sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">Support Categories</h1>
                <p className="text-xs text-gray-500">Manage support ticket categories</p>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">Support Categories</h1>
                <p className="text-sm text-gray-500">Manage support ticket categories</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Category</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>
                      Add a new support ticket category to organize tickets better.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Category Name *</Label>
                      <Input
                        id="name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the category"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCategory} className="bg-red-600 hover:bg-red-700">
                      Create Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Card key={category.id} className={`relative ${!category.isActive ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {category.ticketCount} tickets
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs text-gray-500">
                    Created: {category.createdAt}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(category.id)}
                    className="self-start sm:self-auto w-full sm:w-auto"
                  >
                    {category.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details and settings.
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Category Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="Brief description of the category"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-color">Color</Label>
                  <Input
                    id="edit-color"
                    type="color"
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory(prev => prev ? { ...prev, color: e.target.value } : null)}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory} className="bg-red-600 hover:bg-red-700">
                Update Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first support category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportCategories;