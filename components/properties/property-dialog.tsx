'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { Property, PropertyFormData } from '@/types/property';
import { PropertyTypeSelector } from './property-type-selector';
import { FacilitySelector } from './facility-selector';
import { RoomConfig } from './room-config';
import { ImageUploadZone } from './image-upload-zone';
import { ImagePreviewGrid } from './image-preview-grid';
import { ResponsivePropertyDialog } from './responsive-property-dialog';
import { Loader2 } from 'lucide-react';

// Validation schema
const propertyFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  propertyType: z.enum([
    'apartment',
    'condo',
    'house',
    'villa',
    'townhouse',
    'studio',
    'penthouse',
    'land',
  ]),
  status: z.enum(['available', 'sold', 'rented', 'under_offer', 'maintenance']),
  price: z.number().positive('Price must be positive'),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  priceType: z.enum(['sale', 'rent_monthly', 'rent_yearly']),
  address: z.string().min(3, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  country: z.string().min(2, 'Country required'),
  postalCode: z.string().min(2, 'Postal code required'),
  totalArea: z.number().positive('Total area must be positive'),
  builtUpArea: z.number().positive('Built-up area must be positive'),
  landArea: z.number().positive('Land area must be positive').optional(),
  areaUnit: z.enum(['sqft', 'sqm']),
  bedrooms: z.number().min(0, 'Cannot be negative'),
  bathrooms: z.number().min(0, 'Cannot be negative'),
  halfBathrooms: z.number().min(0, 'Cannot be negative'),
  livingRooms: z.number().min(0, 'Cannot be negative'),
  kitchens: z.number().min(0, 'Cannot be negative'),
  parkingSpaces: z.number().min(0, 'Cannot be negative'),
  floorNumber: z.number().min(1, 'Floor number must be positive').optional(),
  totalFloors: z.number().min(1, 'Total floors must be positive').optional(),
  yearBuilt: z.number().min(1800, 'Invalid year').max(new Date().getFullYear() + 1).optional(),
  facilities: z.array(z.string()),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string().url(),
      caption: z.string().optional(),
      order: z.number(),
    })
  ),
  mainImageIndex: z.number().min(0),
  availableFrom: z.string().optional(),
  featured: z.boolean(),
  virtualTourUrl: z.string().url().optional().or(z.literal('')),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property;
  onSubmit: (data: PropertyFormData) => Promise<void>;
}

export function PropertyDialog({
  open,
  onOpenChange,
  property,
  onSubmit,
}: PropertyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: property || {
      title: '',
      description: '',
      propertyType: 'apartment',
      status: 'available',
      price: 0,
      currency: 'USD',
      priceType: 'sale',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      totalArea: 0,
      builtUpArea: 0,
      areaUnit: 'sqft',
      bedrooms: 0,
      bathrooms: 0,
      halfBathrooms: 0,
      livingRooms: 1,
      kitchens: 1,
      parkingSpaces: 0,
      facilities: [],
      images: [],
      mainImageIndex: 0,
      featured: false,
    },
  });

  const handleSubmit = async (values: PropertyFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(values as PropertyFormData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const images = form.watch('images');

  return (
    <ResponsivePropertyDialog
      open={open}
      onOpenChange={onOpenChange}
      title={property ? 'Edit Property' : 'Create New Property'}
      description="Organize property details across tabs for easier management"
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {property ? 'Update Property' : 'Create Property'}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Modern Downtown Apartment"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / 200 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the property..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / 2000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={() => (
                    <FormItem>
                      <FormLabel>Property Type *</FormLabel>
                      <PropertyTypeSelector control={form.control} name="propertyType" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                            <SelectItem value="under_offer">Under Offer</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <FormLabel>Featured Listing</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Pricing & Location */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sale">For Sale</SelectItem>
                            <SelectItem value="rent_monthly">Rent (Monthly)</SelectItem>
                            <SelectItem value="rent_yearly">Rent (Yearly)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <h3 className="font-semibold mt-6">Location Information</h3>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main Street"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="Postal Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Rooms & Dimensions */}
            <TabsContent value="rooms" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Area Information</h3>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="totalArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Area *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="builtUpArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Built-up Area *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="areaUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sqft">Square Feet</SelectItem>
                            <SelectItem value="sqm">Square Meters</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="landArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Area (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h3 className="font-semibold mt-6">Room Configuration</h3>
                <RoomConfig control={form.control} />

                <h3 className="font-semibold mt-6">Building Information</h3>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="floorNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalFloors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Floors</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearBuilt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Built</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2020"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: Facilities */}
            <TabsContent value="facilities" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select all facilities and amenities available in this property.
                </p>
                <FormField
                  control={form.control}
                  name="facilities"
                  render={() => (
                    <FormItem>
                      <FacilitySelector control={form.control} name="facilities" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Tab 5: Images & Media */}
            <TabsContent value="images" className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <FormLabel>Property Images</FormLabel>
                      <ImageUploadZone onImagesAdd={(newImages) => {
                        const currentImages = form.getValues('images') || [];
                        const updatedImages = [
                          ...currentImages,
                          ...newImages.map((img, idx) => ({
                            id: `${Date.now()}-${idx}`,
                            url: img.url,
                            caption: '',
                            order: currentImages.length + idx,
                          })),
                        ];
                        form.setValue('images', updatedImages);
                      }} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {images && images.length > 0 && (
                  <FormField
                    control={form.control}
                    name="mainImageIndex"
                    render={() => (
                      <FormItem>
                        <FormLabel>Manage Images</FormLabel>
                        <ImagePreviewGrid
                          images={images}
                          onMainImageChange={(index) =>
                            form.setValue('mainImageIndex', index)
                          }
                          onImageRemove={(index) => {
                            const updatedImages = images.filter((_, i) => i !== index);
                            form.setValue('images', updatedImages);
                          }}
                          onImagesReorder={(reorderedImages) =>
                            form.setValue('images', reorderedImages)
                          }
                          mainImageIndex={form.getValues('mainImageIndex')}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <h3 className="font-semibold mt-6">Additional Information</h3>

                <FormField
                  control={form.control}
                  name="availableFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available From</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="virtualTourUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Virtual Tour URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/tour"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to a 3D virtual tour or video walkthrough
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </ResponsivePropertyDialog>
  );
}
