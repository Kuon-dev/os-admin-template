"use client";

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Product, ProductCategory, DietaryTag } from "@/types/product";

// Define the form schema first
const productFormSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  category: z.enum(['breads', 'pastries', 'viennoiseries', 'cakes', 'specials']),
  price: z.number().positive(),
  image: z.string().optional(),
  stockRemaining: z.number().min(0),
  dietaryTags: z.array(z.enum(['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'organic'])),
  isNew: z.boolean(),
  isSpecial: z.boolean(),
  limitedQuantity: z.boolean(),
  bakedToday: z.boolean(),
  ingredients: z.string().optional(),
  allergens: z.string().optional(),
});

// Infer the type from the schema
export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: ProductFormData) => void;
}

export function ProductDialog({ open, onOpenChange, product, onSubmit }: ProductDialogProps) {
  const t = useTranslations('products.form');
  const validationT = useTranslations('products.form.validation');

  // Use the validation messages in the schema
  const formSchema = productFormSchema
    .extend({
      name: z.string()
        .min(1, validationT('nameRequired'))
        .max(100, validationT('nameMax')),
      description: z.string()
        .min(10, validationT('descriptionMin'))
        .max(500, validationT('descriptionMax')),
      price: z.number()
        .positive(validationT('pricePositive')),
      stockRemaining: z.number()
        .min(0, validationT('stockMin')),
    });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'breads',
      price: 0,
      image: '',
      stockRemaining: 0,
      dietaryTags: [],
      isNew: false,
      isSpecial: false,
      limitedQuantity: false,
      bakedToday: false,
      ingredients: '',
      allergens: '',
    },
  });

  // Reset form when product changes or dialog opens/closes
  useEffect(() => {
    if (open && product) {
      // Edit mode - populate form
      const ingredients = Array.isArray(product.ingredients)
        ? product.ingredients.join(', ')
        : product.ingredients || '';
      const allergens = Array.isArray(product.allergens)
        ? product.allergens.join(', ')
        : product.allergens || '';

      form.reset({
        name: product.name,
        description: product.description,
        category: product.category as ProductCategory,
        price: product.price,
        image: product.image || '',
        stockRemaining: product.stockRemaining,
        dietaryTags: product.dietaryTags,
        isNew: product.isNew || false,
        isSpecial: product.isSpecial || false,
        limitedQuantity: product.limitedQuantity || false,
        bakedToday: product.bakedToday || false,
        ingredients,
        allergens,
      });
    } else if (open && !product) {
      // Create mode - reset to defaults
      form.reset({
        name: '',
        description: '',
        category: 'breads',
        price: 0,
        image: '',
        stockRemaining: 0,
        dietaryTags: [],
        isNew: false,
        isSpecial: false,
        limitedQuantity: false,
        bakedToday: false,
        ingredients: '',
        allergens: '',
      });
    }
  }, [open, product, form]);

  const handleSubmit = (data: ProductFormData) => {
    onSubmit(data);
    form.reset();
  };

  const dietaryOptions: DietaryTag[] = [
    'vegan',
    'vegetarian',
    'gluten-free',
    'dairy-free',
    'nut-free',
    'organic',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">
            {product ? t('editTitle') : t('createTitle')}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {product ? t('editDescription') : t('createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Basic Information</h3>
                <p className="text-xs text-muted-foreground">Essential product details</p>
              </div>

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">{t('productName')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('productNamePlaceholder')}
                          className="h-9 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">{t('description')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('descriptionPlaceholder')}
                          className="resize-none min-h-[80px] text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">{t('category')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder={t('categoryPlaceholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PRODUCT_CATEGORIES.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id} className="text-sm">
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">{t('price')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder={t('pricePlaceholder')}
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">{t('imageUrl')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('imageUrlPlaceholder')}
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stockRemaining"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">{t('stockQuantity')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t('stockPlaceholder')}
                            className="h-9 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Product Attributes Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-0.5">Product Attributes</h3>
                <p className="text-xs text-muted-foreground">Dietary tags and special features</p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="dietaryTags"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">{t('dietaryTags')}</FormLabel>
                      <FormDescription className="text-[11px]">{t('dietaryTagsDescription')}</FormDescription>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {dietaryOptions.map((tag) => (
                          <FormField
                            key={tag}
                            control={form.control}
                            name="dietaryTags"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(tag)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, tag])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== tag)
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-xs font-normal capitalize cursor-pointer">
                                  {tag.replace('-', ' ')}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('specialAttributes')}</FormLabel>
                  <FormDescription className="text-[11px]">{t('specialAttributesDescription')}</FormDescription>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <FormField
                      control={form.control}
                      name="isNew"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-normal cursor-pointer">New</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isSpecial"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-normal cursor-pointer">Special</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="limitedQuantity"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-normal cursor-pointer">Limited Quantity</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bakedToday"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-normal cursor-pointer">Baked Today</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </FormItem>
              </div>
            </div>

            <Separator />

            {/* Additional Details - Collapsible Section */}
            <Accordion type="single" collapsible className="border-none">
              <AccordionItem value="details" className="border-none">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline py-0">
                  Additional Details (Optional)
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-3">
                  <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">{t('ingredients')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('ingredientsPlaceholder')}
                            className="resize-none min-h-[60px] text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allergens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">{t('allergens')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('allergensPlaceholder')}
                            className="resize-none min-h-[60px] text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 px-4 text-sm"
              >
                {t('cancel')}
              </Button>
              <Button type="submit" className="h-9 px-4 text-sm">
                {product ? t('save') : t('create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
