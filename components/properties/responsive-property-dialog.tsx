"use client"

import * as React from "react"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface ResponsivePropertyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function ResponsivePropertyDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: ResponsivePropertyDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 gap-0">
          <div className="flex-shrink-0 border-b px-6 py-4">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          {footer && (
            <div className="flex-shrink-0 border-t px-6 py-4">{footer}</div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="flex-shrink-0 border-b px-4 py-4">
          <DrawerHeader className="text-left p-0">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-4">{children}</div>
        {footer && (
          <div className="flex-shrink-0 border-t px-4 py-4">
            <DrawerFooter className="p-0">
              {footer}
              <DrawerClose asChild>
                <button className="w-full rounded-md border px-4 py-2 text-sm font-medium">
                  Cancel
                </button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
