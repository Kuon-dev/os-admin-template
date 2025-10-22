"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Plus,
  FileText,
  Settings,
  Search,
  Trash2,
  Copy,
  Edit,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import type { Page } from '@/types/page-builder';

interface CommandPaletteProps {
  pages: Page[];
  onCreatePage: () => void;
  onEditPage: (pageId: string) => void;
  onDuplicatePage?: (pageId: string) => void;
  onDeletePage?: (pageId: string) => void;
}

export function CommandPalette({
  pages,
  onCreatePage,
  onEditPage,
  onDuplicatePage,
  onDeletePage,
}: CommandPaletteProps) {
  const t = useTranslations('cms');
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (callback: () => void) => {
    callback();
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('commandPalette.placeholder') || 'Type a command or search...'} />
      <CommandList>
        <CommandEmpty>{t('commandPalette.noResults') || 'No results found.'}</CommandEmpty>

        <CommandGroup heading={t('commandPalette.actions') || 'Actions'}>
          <CommandItem onSelect={() => handleSelect(onCreatePage)}>
            <Plus className="mr-2 h-4 w-4" />
            <span>{t('newPage') || 'Create New Page'}</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => router.push('/cms/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('commandPalette.settings') || 'CMS Settings'}</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => router.push('/cms'))}>
            <Search className="mr-2 h-4 w-4" />
            <span>{t('commandPalette.viewAll') || 'View All Pages'}</span>
          </CommandItem>
        </CommandGroup>

        {pages.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t('commandPalette.pages') || 'Pages'}>
              {pages.slice(0, 10).map((page) => (
                <CommandItem
                  key={page.id}
                  onSelect={() => handleSelect(() => onEditPage(page.id))}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{page.name}</span>
                    <span className="text-xs text-muted-foreground">/{page.slug}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
