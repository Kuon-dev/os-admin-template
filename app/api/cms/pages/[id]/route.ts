import { NextResponse } from 'next/server';
import type { Page } from '@/types/page-builder';

// Note: In a real application, this would be stored in a database
// For this demo, we're using a simple in-memory array that's shared with the parent route

let pages: Page[] = [];

// Helper to load pages (simulating database)
function loadPages() {
  // This is a workaround for the demo - in production, use a real database
  if (pages.length === 0) {
    pages = [
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
              content: 'This is a demo page created with the CMS Page Builder. You can edit this content by selecting it.',
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
  }
  return pages;
}

// GET /api/cms/pages/[id] - Get a specific page
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const allPages = loadPages();
  const page = allPages.find((p) => p.id === id);

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return NextResponse.json(page);
}

// PUT /api/cms/pages/[id] - Update a specific page
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const allPages = loadPages();
    const index = allPages.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const updatedPage: Page = {
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    pages[index] = updatedPage;

    return NextResponse.json(updatedPage);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/pages/[id] - Delete a specific page
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const allPages = loadPages();
    const index = allPages.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    pages.splice(index, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
