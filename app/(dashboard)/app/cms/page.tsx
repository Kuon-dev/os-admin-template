"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  Search,
  Command as CommandIcon,
  FileText,
  Check,
  Clock,
  SortAsc,
  Grid3x3,
  Table as TableIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import usePageBuilderStore from '@/stores/page-builder-store';
import { CommandPalette } from '@/components/cms/command-palette';
import type { Page } from '@/types/page-builder';

export default function CMSPagesPage() {
  const t = useTranslations('cms');
  const router = useRouter();
  const { pages, actions } = usePageBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogPage, setDeleteDialogPage] = useState<Page | null>(null);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCreateDialogOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
      toast.error('Failed to load pages');
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

    toast.success('Page created', {
      description: `${newPageName} has been created successfully`,
    });

    // Navigate to editor
    const newPage = pages[pages.length - 1];
    if (newPage) {
      router.push(`/app/cms/${newPage.id}`);
    }
  };

  const handleEditPage = (pageId: string) => {
    router.push(`/app/cms/${pageId}`);
  };

  const handleDuplicatePage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    actions.duplicatePage(pageId);
    toast.success('Page duplicated', {
      description: `${page?.name} has been duplicated`,
    });
  };

  const handleDeletePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    await actions.deletePage(pageId);
    setDeleteDialogPage(null);

    toast.success('Page deleted', {
      description: `${page?.name} has been deleted`,
      action: {
        label: 'Undo',
        onClick: () => {
          // Implement undo functionality
          toast.info('Undo functionality coming soon');
        },
      },
    });
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

  // Filter and sort pages
  const filteredPages = pages
    .filter((page) => {
      const matchesSearch =
        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || page.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const publishedCount = pages.filter(p => p.status === 'published').length;
  const draftCount = pages.filter(p => p.status === 'draft').length;

  // Loading State
  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden !p-0">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-7 w-12" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card className="overflow-hidden !p-0">
          <div className="p-4">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <CommandPalette
        pages={pages}
        onCreatePage={() => setIsCreateDialogOpen(true)}
        onEditPage={handleEditPage}
        onDuplicatePage={handleDuplicatePage}
        onDeletePage={(id) => setDeleteDialogPage(pages.find(p => p.id === id) || null)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mx-auto flex max-w-5xl flex-col gap-6"
      >
        {/* Enhanced Header with Stats */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('description')}
              </p>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                  >
                    <CommandIcon className="mr-2 h-4 w-4" />
                    Commands
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open command palette (⌘K)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('newPage')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new page (⌘N)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Quick Stats Cards - Compact Mac-OS style */}
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden !p-0">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">Total Pages</p>
                    <p className="text-2xl font-semibold tracking-tight">{pages.length}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden !p-0">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">Published</p>
                    <p className="text-2xl font-semibold tracking-tight text-green-600">{publishedCount}</p>
                  </div>
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden !p-0">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground">Drafts</p>
                    <p className="text-2xl font-semibold tracking-tight text-orange-600">{draftCount}</p>
                  </div>
                  <div className="rounded-lg bg-orange-500/10 p-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          className="flex items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Filter Tabs */}
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="all">
                All <Badge variant="secondary" className="ml-2">{pages.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="published">
                Published <Badge variant="secondary" className="ml-2">{publishedCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="draft">
                Draft <Badge variant="secondary" className="ml-2">{draftCount}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search & Sort */}
          <div className="flex gap-2" style={{ gap: 'var(--spacing-2)' }}>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPages') || 'Search pages...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SortAsc className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort pages</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Sort by Name {sortBy === 'name' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date')}>
                  Sort by Date {sortBy === 'date' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('status')}>
                  Sort by Status {sortBy === 'status' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                >
                  {viewMode === 'table' ? (
                    <Grid3x3 className="h-4 w-4" />
                  ) : (
                    <TableIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle view</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>

        {/* Pages Table/Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4" style={{ padding: 'var(--spacing-4)' }}>
              {filteredPages.length === 0 ? (
                <div className="text-center py-12" style={{ padding: 'var(--spacing-12) 0' }}>
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? t('noPagesFound') : t('noPages')}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t('createFirstPage')}
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('table.name')}</TableHead>
                      <TableHead>{t('table.slug')}</TableHead>
                      <TableHead>{t('table.status')}</TableHead>
                      <TableHead>{t('table.lastUpdated')}</TableHead>
                      <TableHead className="text-right">{t('table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredPages.map((page, index) => (
                        <motion.tr
                          key={page.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{
                            duration: 0.2,
                            delay: index * 0.05,
                            ease: 'easeOut',
                          }}
                          className="group border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
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
                              {page.status === 'published' ? t('status.published') : t('status.draft')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(page.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2" style={{ gap: 'var(--spacing-2)' }}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditPage(page.id)}
                                    className="h-8 w-8"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit page</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDuplicatePage(page.id)}
                                    className="h-8 w-8"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Duplicate page</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeleteDialogPage(page)}
                                    className="h-8 w-8"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete page</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Create Page Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialog.createTitle')}</DialogTitle>
            <DialogDescription>
              {t('dialog.createDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4" style={{ gap: 'var(--spacing-4)', padding: 'var(--spacing-4) 0' }}>
            <div className="grid gap-2" style={{ gap: 'var(--spacing-2)' }}>
              <Label htmlFor="name">{t('dialog.pageName')}</Label>
              <Input
                id="name"
                placeholder={t('dialog.pageNamePlaceholder') || 'My Page'}
                value={newPageName}
                onChange={(e) => handleNameChange(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-2" style={{ gap: 'var(--spacing-2)' }}>
              <Label htmlFor="slug">{t('dialog.slug')}</Label>
              <Input
                id="slug"
                placeholder={t('dialog.slugPlaceholder') || 'my-page'}
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t('dialog.urlPreview', { slug: newPageSlug || 'your-page-slug' })}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              {t('dialog.cancel')}
            </Button>
            <Button
              onClick={handleCreatePage}
              disabled={!newPageName || !newPageSlug}
            >
              {t('dialog.createPage')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogPage !== null} onOpenChange={() => setDeleteDialogPage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteDialogPage?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogPage && handleDeletePage(deleteDialogPage.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
