'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations();

  // Split the pathname into segments, removing empty strings and locale
  const segments = pathname.split('/').filter((segment) => segment && segment !== 'en' && segment !== 'cn');

  // Create breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;

    // Get the label for the segment
    let label = segment;

    // Try to get translation based on segment
    if (segment === 'app') {
      label = t('common.dashboard');
    } else if (segment === 'settings') {
      label = t('common.settings');
    } else if (segment === 'products') {
      label = t('sidebar.management.products');
    } else if (segment === 'users') {
      label = t('sidebar.management.users');
    } else if (segment === 'orders') {
      label = t('sidebar.management.orders');
    } else if (segment === 'cms') {
      label = t('sidebar.cms.title');
    } else if (segment === 'pages') {
      label = t('sidebar.cms.pages');
    } else if (segment === 'overview') {
      label = t('sidebar.dashboard.overview');
    } else if (segment === 'analytics') {
      label = t('sidebar.dashboard.analytics');
    } else if (segment === 'reports') {
      label = t('sidebar.dashboard.reports');
    } else {
      // Capitalize first letter as fallback
      label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    return { segment, href, label, isLast };
  });

  // If we're at the root dashboard (/app), show a simple breadcrumb
  if (breadcrumbItems.length === 0 || (breadcrumbItems.length === 1 && breadcrumbItems[0].segment === 'app')) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{t('common.dashboard')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="contents">
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
