"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Grid3x3,
  Monitor,
  Tablet,
  Smartphone,
  Settings,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import usePageBuilderStore from '@/stores/page-builder-store';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

export function Toolbar() {
  const router = useRouter();
  const { currentPage, history, ui, actions } = usePageBuilderStore();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (history.past.length > 0 && !isSaving) {
        handleSave(true); // Silent auto-save
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [history.past.length, isSaving]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBack = () => {
    router.push('/app/cms');
  };

  const handleSave = async (silent = false) => {
    setIsSaving(true);
    try {
      await actions.savePage();
      setLastSaved(new Date());
      if (!silent) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    actions.undo();
  };

  const handleRedo = () => {
    actions.redo();
  };

  const handleTogglePreview = () => {
    actions.togglePreviewMode();
  };

  const handleToggleGrid = () => {
    actions.toggleGrid();
  };

  const handleDeviceModeChange = (mode: 'mobile' | 'tablet' | 'desktop') => {
    actions.setDeviceMode(mode);
  };

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return (
    <TooltipProvider>
      <div
        className="flex items-center justify-between px-4 py-3 border-b bg-background"
        style={{
          padding: 'var(--spacing-3) var(--spacing-4)',
          gap: 'var(--spacing-4)',
        }}
      >
        {/* Left Section */}
        <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-2)' }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to pages list</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex flex-col">
            <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-2)' }}>
              <span className="text-sm font-medium">{currentPage?.name}</span>

              {/* Autosave Indicator */}
              <AnimatePresence mode="wait">
                {isSaving && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Saving...</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                )}
                {saveSuccess && !isSaving && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Saved successfully</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                )}
                {lastSaved && !isSaving && !saveSuccess && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground"
                  >
                    Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="text-xs text-muted-foreground">/{currentPage?.slug}</span>
          </div>
        </div>

        {/* Center Section - Device Mode Switcher */}
        <div
          className="flex items-center gap-1 bg-muted/50 rounded-lg p-1"
          style={{ gap: 'var(--spacing-1)', padding: 'var(--spacing-1)' }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={ui.deviceMode === 'mobile' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleDeviceModeChange('mobile')}
                className="gap-2"
              >
                <Smartphone className="h-4 w-4" />
                Mobile
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview mobile view (375px)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={ui.deviceMode === 'tablet' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleDeviceModeChange('tablet')}
                className="gap-2"
              >
                <Tablet className="h-4 w-4" />
                Tablet
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview tablet view (768px)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={ui.deviceMode === 'desktop' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleDeviceModeChange('desktop')}
                className="gap-2"
              >
                <Monitor className="h-4 w-4" />
                Desktop
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview desktop view (1440px)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-2)' }}>
          {/* Undo/Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (⌘Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={!canRedo}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (⌘⇧Z)</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* View Options */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleGrid}
                className={cn(ui.showGrid && 'bg-accent')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle grid overlay</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTogglePreview}
                className={cn(ui.isPreviewMode && 'bg-accent')}
              >
                {ui.isPreviewMode ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{ui.isPreviewMode ? 'Exit preview mode' : 'Enter preview mode'}</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Page Settings */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Page settings</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Page Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit SEO Metadata</DropdownMenuItem>
              <DropdownMenuItem>Page Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Page History</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Save Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => handleSave()} size="sm" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save changes (⌘S)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
