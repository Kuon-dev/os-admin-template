import { NextResponse } from 'next/server';
import type { Property, PropertyFormData } from '@/types/property';

// Image URLs for mock properties (using Unsplash for variety)
const mockImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1500595046891-3a5e2b3c5d5b?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f7cbb8f0d?w=800&q=80',
  'https://images.unsplash.com/photo-1512027564390-269cf5b9e8de?w=800&q=80',
  'https://images.unsplash.com/photo-1555321586-643d8b3cdac1?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c52e57?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1576821971629-7c4f4b1db919?w=800&q=80',
];

// In-memory storage for mock data
let properties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Stunning 2-bedroom apartment in the heart of downtown with floor-to-ceiling windows and a private balcony. Recently renovated with high-end finishes, this property offers the perfect blend of style and comfort.',
    propertyType: 'apartment',
    status: 'available',
    price: 1250000,
    currency: 'USD',
    priceType: 'sale',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'California',
    country: 'USA',
    postalCode: '94102',
    latitude: 37.7749,
    longitude: -122.4194,
    totalArea: 1200,
    builtUpArea: 1200,
    areaUnit: 'sqft',
    bedrooms: 2,
    bathrooms: 2,
    halfBathrooms: 0,
    livingRooms: 1,
    kitchens: 1,
    parkingSpaces: 2,
    floorNumber: 15,
    totalFloors: 28,
    yearBuilt: 2020,
    facilities: ['gym', 'security', 'internet', 'air_conditioning', 'view'],
    images: [
      { id: '1-1', url: mockImages[0], caption: 'Main living area', order: 0 },
      { id: '1-2', url: mockImages[1], caption: 'Bedroom view', order: 1 },
      { id: '1-3', url: mockImages[2], caption: 'Modern kitchen', order: 2 },
    ],
    mainImageIndex: 0,
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-10-23T08:15:00Z',
    featured: true,
  },
  {
    id: '2',
    title: 'Luxury Beachfront Villa',
    description: 'Exclusive 5-bedroom villa with direct beach access. Features infinity pool, private spa, and spectacular ocean views. Perfect for families seeking coastal luxury living.',
    propertyType: 'villa',
    status: 'available',
    price: 4500000,
    currency: 'USD',
    priceType: 'sale',
    address: '456 Ocean Boulevard',
    city: 'Malibu',
    state: 'California',
    country: 'USA',
    postalCode: '90265',
    latitude: 34.0195,
    longitude: -118.6819,
    totalArea: 8500,
    builtUpArea: 7200,
    landArea: 15000,
    areaUnit: 'sqft',
    bedrooms: 5,
    bathrooms: 5,
    halfBathrooms: 2,
    livingRooms: 3,
    kitchens: 2,
    parkingSpaces: 4,
    floorNumber: undefined,
    totalFloors: 2,
    yearBuilt: 2018,
    facilities: ['pool', 'garden', 'security', 'internet', 'view', 'guest_parking'],
    images: [
      { id: '2-1', url: mockImages[3], caption: 'Ocean view', order: 0 },
      { id: '2-2', url: mockImages[4], caption: 'Infinity pool', order: 1 },
      { id: '2-3', url: mockImages[5], caption: 'Master suite', order: 2 },
      { id: '2-4', url: mockImages[6], caption: 'Patio area', order: 3 },
    ],
    mainImageIndex: 0,
    createdAt: '2025-08-20T14:30:00Z',
    updatedAt: '2025-10-22T16:45:00Z',
    featured: true,
  },
  {
    id: '3',
    title: 'Cozy Studio in Arts District',
    description: 'Charming studio apartment perfect for young professionals or artists. Located in the vibrant arts district with easy access to galleries, restaurants, and cafes.',
    propertyType: 'studio',
    status: 'rented',
    price: 1800,
    currency: 'USD',
    priceType: 'rent_monthly',
    address: '789 Arts Way',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    postalCode: '90028',
    latitude: 34.1008,
    longitude: -118.3287,
    totalArea: 450,
    builtUpArea: 450,
    areaUnit: 'sqft',
    bedrooms: 0,
    bathrooms: 1,
    halfBathrooms: 0,
    livingRooms: 1,
    kitchens: 1,
    parkingSpaces: 1,
    floorNumber: 3,
    totalFloors: 5,
    yearBuilt: 2015,
    facilities: ['furnished', 'internet', 'pet_friendly', 'air_conditioning'],
    images: [
      { id: '3-1', url: mockImages[7], caption: 'Studio overview', order: 0 },
      { id: '3-2', url: mockImages[8], caption: 'Kitchen area', order: 1 },
    ],
    mainImageIndex: 0,
    createdAt: '2025-07-10T09:00:00Z',
    updatedAt: '2025-10-20T14:30:00Z',
    featured: false,
  },
  {
    id: '4',
    title: 'Modern Suburban House',
    description: 'Beautiful 4-bedroom house in quiet residential neighborhood. Features updated kitchen, spacious backyard with mature trees, and two-car garage.',
    propertyType: 'house',
    status: 'available',
    price: 750000,
    currency: 'USD',
    priceType: 'sale',
    address: '321 Maple Drive',
    city: 'Portland',
    state: 'Oregon',
    country: 'USA',
    postalCode: '97201',
    latitude: 45.5152,
    longitude: -122.6784,
    totalArea: 2500,
    builtUpArea: 2500,
    landArea: 8000,
    areaUnit: 'sqft',
    bedrooms: 4,
    bathrooms: 3,
    halfBathrooms: 1,
    livingRooms: 2,
    kitchens: 1,
    parkingSpaces: 2,
    floorNumber: undefined,
    totalFloors: 2,
    yearBuilt: 2012,
    facilities: ['garden', 'heating', 'internet', 'laundry', 'fireplace'],
    images: [
      { id: '4-1', url: mockImages[9], caption: 'Front exterior', order: 0 },
      { id: '4-2', url: mockImages[0], caption: 'Backyard', order: 1 },
      { id: '4-3', url: mockImages[1], caption: 'Living room', order: 2 },
    ],
    mainImageIndex: 0,
    createdAt: '2025-06-05T11:00:00Z',
    updatedAt: '2025-10-21T10:20:00Z',
    featured: false,
  },
  {
    id: '5',
    title: 'Luxury Penthouse',
    description: 'Exclusive penthouse with panoramic city views. Features smart home technology, wine cellar, and private rooftop terrace.',
    propertyType: 'penthouse',
    status: 'under_offer',
    price: 8500000,
    currency: 'USD',
    priceType: 'sale',
    address: '888 Sky Tower',
    city: 'New York',
    state: 'New York',
    country: 'USA',
    postalCode: '10022',
    latitude: 40.7580,
    longitude: -73.9855,
    totalArea: 5600,
    builtUpArea: 5600,
    areaUnit: 'sqft',
    bedrooms: 4,
    bathrooms: 4,
    halfBathrooms: 1,
    livingRooms: 2,
    kitchens: 2,
    parkingSpaces: 2,
    floorNumber: 50,
    totalFloors: 52,
    yearBuilt: 2019,
    facilities: ['gym', 'pool', 'security', 'concierge', 'view', 'air_conditioning'],
    images: [
      { id: '5-1', url: mockImages[2], caption: 'City view', order: 0 },
      { id: '5-2', url: mockImages[3], caption: 'Terrace', order: 1 },
      { id: '5-3', url: mockImages[4], caption: 'Master bedroom', order: 2 },
    ],
    mainImageIndex: 0,
    createdAt: '2025-05-12T15:30:00Z',
    updatedAt: '2025-10-19T12:00:00Z',
    featured: true,
  },
  {
    id: '6',
    title: 'Modern Downtown Condo',
    description: '3-bedroom condo with premium finishes. Building amenities include fitness center, rooftop garden, and concierge service.',
    propertyType: 'condo',
    status: 'sold',
    price: 1950000,
    currency: 'USD',
    priceType: 'sale',
    address: '555 Urban Plaza',
    city: 'Chicago',
    state: 'Illinois',
    country: 'USA',
    postalCode: '60611',
    latitude: 41.8781,
    longitude: -87.6298,
    totalArea: 1800,
    builtUpArea: 1800,
    areaUnit: 'sqft',
    bedrooms: 3,
    bathrooms: 2,
    halfBathrooms: 1,
    livingRooms: 1,
    kitchens: 1,
    parkingSpaces: 2,
    floorNumber: 22,
    totalFloors: 35,
    yearBuilt: 2016,
    facilities: ['gym', 'pool', 'security', 'elevator', 'internet', 'concierge'],
    images: [
      { id: '6-1', url: mockImages[5], caption: 'Living room', order: 0 },
      { id: '6-2', url: mockImages[6], caption: 'Kitchen', order: 1 },
    ],
    mainImageIndex: 0,
    createdAt: '2025-04-08T10:00:00Z',
    updatedAt: '2025-10-18T09:30:00Z',
    featured: false,
  },
  {
    id: '7',
    title: 'Spacious Townhouse',
    description: 'Contemporary 3-level townhouse with private patio and garage. Close to schools and shopping centers.',
    propertyType: 'townhouse',
    status: 'available',
    price: 2200,
    currency: 'USD',
    priceType: 'rent_monthly',
    address: '222 Residential Lane',
    city: 'Seattle',
    state: 'Washington',
    country: 'USA',
    postalCode: '98101',
    latitude: 47.6062,
    longitude: -122.3321,
    totalArea: 2100,
    builtUpArea: 2100,
    landArea: 2000,
    areaUnit: 'sqft',
    bedrooms: 3,
    bathrooms: 2,
    halfBathrooms: 1,
    livingRooms: 1,
    kitchens: 1,
    parkingSpaces: 2,
    floorNumber: undefined,
    totalFloors: 3,
    yearBuilt: 2010,
    facilities: ['patio', 'laundry', 'storage', 'pet_friendly'],
    images: [
      { id: '7-1', url: mockImages[7], caption: 'Front view', order: 0 },
      { id: '7-2', url: mockImages[8], caption: 'Backyard patio', order: 1 },
    ],
    mainImageIndex: 0,
    createdAt: '2025-03-20T13:45:00Z',
    updatedAt: '2025-10-17T11:15:00Z',
    featured: false,
  },
  {
    id: '8',
    title: 'Historic Victorian House',
    description: 'Beautifully restored Victorian home with original hardwood floors, crown molding, and fireplace. Perfect for history enthusiasts.',
    propertyType: 'house',
    status: 'available',
    price: 1200000,
    currency: 'USD',
    priceType: 'sale',
    address: '777 Heritage Street',
    city: 'Boston',
    state: 'Massachusetts',
    country: 'USA',
    postalCode: '02108',
    latitude: 42.3601,
    longitude: -71.0589,
    totalArea: 3200,
    builtUpArea: 3200,
    landArea: 5000,
    areaUnit: 'sqft',
    bedrooms: 4,
    bathrooms: 3,
    halfBathrooms: 0,
    livingRooms: 2,
    kitchens: 1,
    parkingSpaces: 2,
    floorNumber: undefined,
    totalFloors: 3,
    yearBuilt: 1890,
    facilities: ['fireplace', 'garden', 'storage'],
    images: [
      { id: '8-1', url: mockImages[9], caption: 'Exterior', order: 0 },
      { id: '8-2', url: mockImages[0], caption: 'Living room with fireplace', order: 1 },
      { id: '8-3', url: mockImages[1], caption: 'Parlor', order: 2 },
    ],
    mainImageIndex: 0,
    createdAt: '2025-02-14T09:20:00Z',
    updatedAt: '2025-10-16T14:40:00Z',
    featured: false,
  },
];

// Helper function to generate unique IDs
function generateId(): string {
  return crypto.randomUUID();
}

// GET /api/properties - List all properties
export async function GET() {
  return NextResponse.json(properties);
}

// POST /api/properties - Create a new property
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newProperty: Property = {
      id: generateId(),
      title: body.title,
      description: body.description,
      propertyType: body.propertyType,
      status: body.status || 'available',
      price: body.price,
      currency: body.currency || 'USD',
      priceType: body.priceType || 'sale',
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country,
      postalCode: body.postalCode,
      latitude: body.latitude,
      longitude: body.longitude,
      totalArea: body.totalArea,
      builtUpArea: body.builtUpArea,
      landArea: body.landArea,
      areaUnit: body.areaUnit || 'sqft',
      bedrooms: body.bedrooms || 0,
      bathrooms: body.bathrooms || 0,
      halfBathrooms: body.halfBathrooms || 0,
      livingRooms: body.livingRooms || 1,
      kitchens: body.kitchens || 1,
      parkingSpaces: body.parkingSpaces || 0,
      floorNumber: body.floorNumber,
      totalFloors: body.totalFloors,
      yearBuilt: body.yearBuilt,
      facilities: body.facilities || [],
      images: body.images || [],
      mainImageIndex: body.mainImageIndex || 0,
      availableFrom: body.availableFrom,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      agentId: body.agentId,
      featured: body.featured || false,
      virtualTourUrl: body.virtualTourUrl,
    };

    properties = [newProperty, ...properties];

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update a property
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    const index = properties.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const updatedProperty: Property = {
      ...properties[index],
      ...body,
      id: properties[index].id, // Preserve ID
      createdAt: properties[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(), // Update modification date
    };

    properties[index] = updatedProperty;

    return NextResponse.json(updatedProperty);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete a property
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID required' },
        { status: 400 }
      );
    }

    const index = properties.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const deletedProperty = properties[index];
    properties = properties.filter((p) => p.id !== id);

    return NextResponse.json(deletedProperty);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
