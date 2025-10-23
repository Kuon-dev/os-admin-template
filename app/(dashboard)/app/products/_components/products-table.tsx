"use client";

import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { ProductRow } from './product-row';
import type { Product } from "@/types/product";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onCreateNew: () => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  onCreateNew,
}: ProductsTableProps) {
  const t = useTranslations('products');
  const tableT = useTranslations('products.table');

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t('noProductsFound')}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
            {t('noProducts')}
          </p>
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            {t('createFirstProduct')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{tableT('image')}</TableHead>
                <TableHead>{tableT('name')}</TableHead>
                <TableHead>{tableT('category')}</TableHead>
                <TableHead className="w-[100px]">{tableT('price')}</TableHead>
                <TableHead className="w-[140px]">{tableT('stock')}</TableHead>
                <TableHead className="w-[120px]">{tableT('tags')}</TableHead>
                <TableHead className="w-[70px] text-right">{tableT('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
