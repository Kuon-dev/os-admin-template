"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Copy, Trash2, Eye, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import usePageBuilderStore from '@/stores/page-builder-store';
import type { Page } from '@/types/page-builder';

export default function CMSPagesPage() {
  const router = useRouter();
  const { pages, actions } = usePageBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const response = await fetch('/api/cms/pages');
      if (response.ok) {
        const data = await response.json();
        actions.setPages(data);
      }
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePage = () => {
    if (!newPageName || !newPageSlug) return;

    actions.createPage(newPageName, newPageSlug);
    setIsCreateDialogOpen(false);
    setNewPageName('');
    setNewPageSlug('');

    // Navigate to editor
    const newPage = pages[pages.length - 1];
    if (newPage) {
      router.push(`/cms/${newPage.id}`);
    }
  };

  const handleEditPage = (pageId: string) => {
    router.push(`/cms/${pageId}`);
  };

  const handleDuplicatePage = (pageId: string) => {
    actions.duplicatePage(pageId);
  };

  const handleDeletePage = async (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      await actions.deletePage(pageId);
    }
  };

  const handleNameChange = (value: string) => {
    setNewPageName(value);
    // Auto-generate slug from name
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setNewPageSlug(slug);
  };

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading pages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CMS Pages</h1>
          <p className="text-muted-foreground">
            Manage your website pages with the drag-and-drop page builder
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Pages</CardTitle>
              <CardDescription>
                {pages.length} {pages.length === 1 ? 'page' : 'pages'} total
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No pages found matching your search.' : 'No pages yet. Create your first page to get started.'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Page
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.name}</TableCell>
                    <TableCell>
                      <code className="text-sm text-muted-foreground">
                        /{page.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={page.status === 'published' ? 'default' : 'secondary'}
                      >
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPage(page.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicatePage(page.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePage(page.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Create a new page for your website. The slug will be used in the URL.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Page Name</Label>
              <Input
                id="name"
                placeholder="e.g., About Us"
                value={newPageName}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="e.g., about-us"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                URL: /{newPageSlug || 'your-page-slug'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePage}
              disabled={!newPageName || !newPageSlug}
            >
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
