'use client';

import { memo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { PropertyFilters } from '@/types/property';
import { Search, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RangeSlider } from './range-slider';
import { PropertyCombobox } from './property-combobox';

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'land', label: 'Land' },
];

const statuses = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'under_offer', label: 'Under Offer' },
  { value: 'maintenance', label: 'Maintenance' },
];

function PropertyFiltersComponent({
  filters,
  onFiltersChange,
}: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const hasActiveFilters =
    filters.search ||
    filters.propertyType !== 'all' ||
    filters.status !== 'all' ||
    filters.priceMin ||
    filters.priceMax ||
    filters.bedroomsMin > 0 ||
    filters.bathroomsMin > 0 ||
    filters.areaMin ||
    filters.areaMax ||
    filters.facilities.length > 0;

  const handleReset = () => {
    onFiltersChange({
      search: '',
      propertyType: 'all',
      status: 'all',
      bedroomsMin: 0,
      bathroomsMin: 0,
      facilities: [],
      sortBy: 'date',
      sortDirection: 'desc',
    });
  };

  return (
    <Card className="bg-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-sm font-semibold">Filters</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen ? 'rotate-180' : ''
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, address..."
                  value={filters.search}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, search: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
            </div>

            {/* Property Type - Combobox */}
            <PropertyCombobox
              label="Property Type"
              placeholder="All Types"
              options={[
                { value: 'all', label: 'All Types' },
                ...propertyTypes,
              ]}
              value={filters.propertyType}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  propertyType: value as any,
                })
              }
            />

            {/* Status - Combobox */}
            <PropertyCombobox
              label="Status"
              placeholder="All Statuses"
              options={[
                { value: 'all', label: 'All Statuses' },
                ...statuses,
              ]}
              value={filters.status}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  status: value as any,
                })
              }
            />

            {/* Price Range - Slider */}
            <RangeSlider
              label="Price Range"
              min={0}
              max={10000000}
              step={50000}
              minValue={filters.priceMin || 0}
              maxValue={filters.priceMax || 10000000}
              onMinChange={(value) =>
                onFiltersChange({
                  ...filters,
                  priceMin: value || undefined,
                })
              }
              onMaxChange={(value) =>
                onFiltersChange({
                  ...filters,
                  priceMax: value || undefined,
                })
              }
              prefix="$"
            />

            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Bedrooms</label>
              <Select
                value={String(filters.bedroomsMin)}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    bedroomsMin: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num === 0 ? 'Any' : `${num}+`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Bathrooms</label>
              <Select
                value={String(filters.bathroomsMin)}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    bathroomsMin: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num === 0 ? 'Any' : `${num}+`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area Range - Slider */}
            <RangeSlider
              label="Area Range"
              min={0}
              max={100000}
              step={500}
              minValue={filters.areaMin || 0}
              maxValue={filters.areaMax || 100000}
              onMinChange={(value) =>
                onFiltersChange({
                  ...filters,
                  areaMin: value || undefined,
                })
              }
              onMaxChange={(value) =>
                onFiltersChange({
                  ...filters,
                  areaMax: value || undefined,
                })
              }
              suffix="sq ft"
            />

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    sortBy: value as any,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Created</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="bedrooms">Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Direction */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <Select
                value={filters.sortDirection}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    sortDirection: value as any,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Active Filters
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {filters.search}
                      <button
                        onClick={() =>
                          onFiltersChange({ ...filters, search: '' })
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.propertyType !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {propertyTypes.find((t) => t.value === filters.propertyType)
                        ?.label}
                      <button
                        onClick={() =>
                          onFiltersChange({ ...filters, propertyType: 'all' })
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.status !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {statuses.find((s) => s.value === filters.status)?.label}
                      <button
                        onClick={() =>
                          onFiltersChange({ ...filters, status: 'all' })
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="w-full gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export const PropertyFilters = memo(PropertyFiltersComponent);
