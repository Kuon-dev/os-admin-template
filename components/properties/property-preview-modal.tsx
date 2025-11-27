'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyCarousel } from './property-carousel';
import { PropertyStatusBadge } from './property-status-badge';
import type { Property } from '@/types/property';
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Car,
  Home,
  Calendar,
  Star,
  Edit2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyPreviewModalProps {
  property?: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (property: Property) => void;
}

const facilityIcons: Record<string, string> = {
  pool: '🏊',
  gym: '🏋️',
  security: '🔒',
  garden: '🌳',
  balcony: '🏞️',
  elevator: '🛗',
  air_conditioning: '❄️',
  heating: '🔥',
  furnished: '🛋️',
  pet_friendly: '🐕',
  internet: '📡',
  cable_tv: '📺',
  laundry: '🧺',
  storage: '📦',
  fireplace: '🔥',
  view: '🌊',
  playground: '🎪',
  bbq: '🍖',
  concierge: '🎩',
  guest_parking: '🅿️',
};

const facilityLabels: Record<string, string> = {
  pool: 'Swimming Pool',
  gym: 'Gym',
  security: '24/7 Security',
  garden: 'Garden',
  balcony: 'Balcony',
  elevator: 'Elevator',
  air_conditioning: 'Air Conditioning',
  heating: 'Heating',
  furnished: 'Furnished',
  pet_friendly: 'Pet Friendly',
  internet: 'High-Speed Internet',
  cable_tv: 'Cable TV',
  laundry: 'Laundry Room',
  storage: 'Storage',
  fireplace: 'Fireplace',
  view: 'View',
  playground: 'Playground',
  bbq: 'BBQ Area',
  concierge: 'Concierge',
  guest_parking: 'Guest Parking',
};

export function PropertyPreviewModal({
  property,
  open,
  onOpenChange,
  onEdit,
}: PropertyPreviewModalProps) {
  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 bg-black/40 hover:bg-black/60 text-white rounded-lg p-2 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="space-y-3 pb-4 border-b">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {property.title}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {property.city}, {property.state}, {property.country}
                </span>
              </div>
            </div>
            {property.featured && (
              <Badge className="gap-1 bg-amber-500 text-white whitespace-nowrap">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: property.currency,
                maximumFractionDigits: 0,
              }).format(property.price)}
            </div>
            <div className="flex items-center gap-3">
              <PropertyStatusBadge status={property.status} />
              <span className="text-muted-foreground text-xs">
                {property.priceType === 'rent_monthly'
                  ? 'per month'
                  : property.priceType === 'rent_yearly'
                    ? 'per year'
                    : 'asking price'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-transparent p-0 h-auto">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary px-4 py-3"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary px-4 py-3"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="facilities"
                className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary px-4 py-3"
              >
                Facilities
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary px-4 py-3"
              >
                Media
              </TabsTrigger>
            </TabsList>

            {/* Tab: Overview */}
            <TabsContent value="overview" className="space-y-6 p-6 m-0">
              {/* Quick Facts */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Bedrooms</span>
                  </div>
                  <p className="text-xl font-bold">{property.bedrooms}</p>
                </div>

                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Bathrooms</span>
                  </div>
                  <p className="text-xl font-bold">
                    {property.bathrooms}
                    {property.halfBathrooms > 0 && `.${property.halfBathrooms}`}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Area</span>
                  </div>
                  <p className="text-xl font-bold">
                    {property.totalArea.toLocaleString()}
                    <span className="text-xs ml-1">{property.areaUnit}</span>
                  </p>
                </div>

                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Parking</span>
                  </div>
                  <p className="text-xl font-bold">{property.parkingSpaces}</p>
                </div>

                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Type</span>
                  </div>
                  <p className="text-lg font-bold capitalize">
                    {property.propertyType}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Year Built</span>
                  </div>
                  <p className="text-xl font-bold">
                    {property.yearBuilt || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-semibold">About This Property</h3>
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            </TabsContent>

            {/* Tab: Details */}
            <TabsContent value="details" className="space-y-6 p-6 m-0">
              {/* Building Details */}
              {(property.totalFloors || property.floorNumber) && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Building Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {property.floorNumber && (
                      <div className="rounded-lg border border-border p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Floor Number
                        </p>
                        <p className="font-semibold">{property.floorNumber}</p>
                      </div>
                    )}
                    {property.totalFloors && (
                      <div className="rounded-lg border border-border p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Total Floors
                        </p>
                        <p className="font-semibold">{property.totalFloors}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="space-y-3">
                <h3 className="font-semibold">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Address</p>
                    <p className="font-medium text-sm">{property.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {property.city}, {property.state} {property.postalCode}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="font-medium text-sm">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {property.availableFrom && (
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Available From
                      </p>
                      <p className="font-medium text-sm">
                        {new Date(property.availableFrom).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Land Area
                    </p>
                    <p className="font-medium text-sm">
                      {property.landArea
                        ? `${property.landArea.toLocaleString()} ${property.areaUnit}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Facilities */}
            <TabsContent value="facilities" className="space-y-4 p-6 m-0">
              {property.facilities.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {property.facilities.map((facility) => (
                    <div
                      key={facility}
                      className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-lg">
                        {facilityIcons[facility] || '✓'}
                      </span>
                      <span className="text-sm font-medium">
                        {facilityLabels[facility] || facility}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No facilities listed for this property.
                </p>
              )}
            </TabsContent>

            {/* Tab: Media */}
            <TabsContent value="media" className="space-y-6 p-6 m-0">
              {/* Carousel */}
              <div className="space-y-3">
                <h3 className="font-semibold">Images</h3>
                <PropertyCarousel
                  images={property.images}
                  mainImageIndex={property.mainImageIndex}
                />
              </div>

              {/* Virtual Tour */}
              {property.virtualTourUrl && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Virtual Tour</h3>
                  <a
                    href={property.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    View 3D Tour
                  </a>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t pt-4 mt-auto">
          {onEdit && (
            <Button
              onClick={() => {
                onEdit(property);
                onOpenChange(false);
              }}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Property
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
