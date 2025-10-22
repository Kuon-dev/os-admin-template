import { NextResponse } from 'next/server';
import type { Page } from '@/types/page-builder';

// In-memory storage for demo (in production, this would be a database)
let pages: Page[] = [
  {
    id: 'demo-home',
    name: 'Home Page',
    slug: 'home',
    components: [
      {
        id: 'heading-1',
        type: 'heading',
        props: {
          content: 'Welcome to Our Website',
          level: 'h1',
          fontSize: '3rem',
          alignment: 'center',
        },
      },
      {
        id: 'text-1',
        type: 'text',
        props: {
          content: 'This is a demo page created with the CMS Page Builder. You can edit this content by clicking on it.',
          fontSize: '18px',
          alignment: 'center',
        },
      },
      {
        id: 'button-1',
        type: 'button',
        props: {
          text: 'Get Started',
          variant: 'default',
          size: 'lg',
        },
      },
    ],
    metadata: {
      title: 'Home Page',
      description: 'Welcome to our website',
      keywords: ['home', 'welcome'],
    },
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-about',
    name: 'About Us',
    slug: 'about',
    components: [
      {
        id: 'heading-2',
        type: 'heading',
        props: {
          content: 'About Us',
          level: 'h1',
          alignment: 'left',
        },
      },
      {
        id: 'text-2',
        type: 'text',
        props: {
          content: 'Learn more about our company and mission.',
          fontSize: '16px',
          alignment: 'left',
        },
      },
    ],
    metadata: {
      title: 'About Us',
      description: 'Learn more about our company',
      keywords: ['about', 'company'],
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/cms/pages - List all pages
export async function GET() {
  return NextResponse.json(pages);
}

// POST /api/cms/pages - Create a new page
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPage: Page = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    pages.push(newPage);

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
