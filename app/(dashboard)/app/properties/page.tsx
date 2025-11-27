'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Property, PropertyFormData } from '@/types/property';
import { usePropertyStore, usePropertyActions } from '@/stores/property-store';
import { PropertyStats } from '@/components/properties/property-stats';
import { PropertyTable } from '@/components/properties/property-table';
import { PropertyFilters } from '@/components/properties/property-filters';
import { PropertyDialog } from '@/components/properties/property-dialog';
import { PropertyPreviewModal } from '@/components/properties/property-preview-modal';

export default function PropertiesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const [previewProperty, setPreviewProperty] = useState<Property | undefined>();
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | undefined>();

  const properties = usePropertyStore((state) => state.properties);
  const filters = usePropertyStore((state) => state.filters);
  const isLoading = usePropertyStore((state) => state.isLoading);
  const actions = usePropertyActions();

  // Fetch properties on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { fetchProperties } = usePropertyStore.getState().actions;
    fetchProperties();
  }, []);

  // Stable filter change handler to prevent infinite loop
  const handleFiltersChange = useCallback(
    (newFilters: typeof filters) => {
      actions.setFilters(newFilters);
    },
    [actions]
  );

  // Memoized callbacks for PropertyTable to prevent infinite loop
  const handlePreviewProperty = useCallback(
    (property: Property) => {
      setPreviewProperty(property);
      setPreviewOpen(true);
    },
    []
  );

  const handleEditPropertyClick = useCallback(
    (property: Property) => {
      setEditingProperty(property);
      setDialogOpen(true);
    },
    []
  );

  const handleSelectionChange = useCallback(
    (count: number, selected: Property[]) => {
      setSelectedCount(count);
      setSelectedProperties(selected);
    },
    []
  );

  const handlePreviewEdit = useCallback(
    (property: Property) => {
      setEditingProperty(property);
      setPreviewOpen(false);
      setDialogOpen(true);
    },
    []
  );

  // Calculate statistics
  const stats = {
    total: properties.length,
    available: properties.filter((p) => p.status === 'available').length,
    sold: properties.filter((p) => p.status === 'sold').length,
    rented: properties.filter((p) => p.status === 'rented').length,
    averagePrice:
      properties.length > 0
        ? Math.round(
            properties.reduce((sum, p) => sum + p.price, 0) / properties.length
          )
        : 0,
    totalRevenue: properties.reduce((sum, p) => sum + p.price, 0),
    featured: properties.filter((p) => p.featured).length,
  };

  // Filter properties based on filters
  const filteredProperties = properties.filter((property) => {
    // Search filter
    if (
      filters.search &&
      !property.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !property.address.toLowerCase().includes(filters.search.toLowerCase()) &&
      !property.city.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Property type filter
    if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && property.status !== filters.status) {
      return false;
    }

    // Price range filter
    if (filters.priceMin !== undefined && property.price < filters.priceMin) {
      return false;
    }
    if (filters.priceMax !== undefined && property.price > filters.priceMax) {
      return false;
    }

    // Bedrooms filter
    if (property.bedrooms < filters.bedroomsMin) {
      return false;
    }

    // Bathrooms filter
    if (property.bathrooms < filters.bathroomsMin) {
      return false;
    }

    // Area range filter
    if (filters.areaMin !== undefined && property.totalArea < filters.areaMin) {
      return false;
    }
    if (filters.areaMax !== undefined && property.totalArea > filters.areaMax) {
      return false;
    }

    // Facilities filter
    if (
      filters.facilities.length > 0 &&
      !filters.facilities.every((f) => property.facilities.includes(f))
    ) {
      return false;
    }

    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    let aVal: any = a[filters.sortBy as keyof Property];
    let bVal: any = b[filters.sortBy as keyof Property];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return filters.sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return filters.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleCreateProperty = async (data: PropertyFormData) => {
    try {
      if (editingProperty) {
        await actions.updateProperty(editingProperty.id, data);
        toast.success('Property updated successfully');
      } else {
        await actions.createProperty(data);
        toast.success('Property created successfully');
      }
      setDialogOpen(false);
      setEditingProperty(undefined);
    } catch (error) {
      toast.error('Failed to save property');
      console.error(error);
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    setPropertyToDelete(property);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      try {
        await actions.deleteProperty(propertyToDelete.id);
        toast.success('Property deleted successfully');
        setDeleteConfirmOpen(false);
        setPropertyToDelete(undefined);
      } catch (error) {
        toast.error('Failed to delete property');
        console.error(error);
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      await actions.deleteProperties(selectedProperties.map((p) => p.id));
      toast.success(`${selectedProperties.length} properties deleted`);
      actions.clearSelection();
      setSelectedCount(0);
    } catch (error) {
      toast.error('Failed to delete properties');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-1">
            Manage your property listings
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProperty(undefined);
            setDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Stats */}
      <PropertyStats stats={stats} />

      {/* Bulk Delete Button */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex-1">
            <p className="font-medium">
              {selectedCount} propert{selectedCount === 1 ? 'y' : 'ies'} selected
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Properties {sortedProperties.length > 0 && `(${sortedProperties.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyTable
                properties={sortedProperties}
                onPreviewProperty={handlePreviewProperty}
                onEditProperty={handleEditPropertyClick}
                onDeleteProperty={handleDeleteProperty}
                onSelectionChange={handleSelectionChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Property Dialog */}
      <PropertyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        property={editingProperty}
        onSubmit={handleCreateProperty}
      />

      {/* Property Preview Modal */}
      <PropertyPreviewModal
        property={previewProperty}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onEdit={handlePreviewEdit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Property</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{propertyToDelete?.title}"? This
            action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
