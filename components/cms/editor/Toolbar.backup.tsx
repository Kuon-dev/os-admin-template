"use client";

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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import usePageBuilderStore from '@/stores/page-builder-store';

export function Toolbar() {
  const router = useRouter();
  const { currentPage, history, ui, actions } = usePageBuilderStore();

  const handleBack = () => {
    router.push('/cms');
  };

  const handleSave = async () => {
    await actions.savePage();
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
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex flex-col">
          <span className="text-sm font-medium">{currentPage?.name}</span>
          <span className="text-xs text-muted-foreground">
            /{currentPage?.slug}
          </span>
        </div>
      </div>

      {/* Center Section - Device Mode Switcher */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
        <Button
          variant={ui.deviceMode === 'mobile' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => handleDeviceModeChange('mobile')}
          className="gap-2"
        >
          <Smartphone className="h-4 w-4" />
          Mobile
        </Button>
        <Button
          variant={ui.deviceMode === 'tablet' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => handleDeviceModeChange('tablet')}
          className="gap-2"
        >
          <Tablet className="h-4 w-4" />
          Tablet
        </Button>
        <Button
          variant={ui.deviceMode === 'desktop' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => handleDeviceModeChange('desktop')}
          className="gap-2"
        >
          <Monitor className="h-4 w-4" />
          Desktop
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          disabled={!canUndo}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRedo}
          disabled={!canRedo}
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* View Options */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleGrid}
          className={cn(ui.showGrid && 'bg-accent')}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>

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

        <Separator orientation="vertical" className="h-6" />

        {/* Page Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Page Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Edit SEO Metadata
            </DropdownMenuItem>
            <DropdownMenuItem>
              Page Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              View Page History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Save Button */}
        <Button onClick={handleSave} size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
