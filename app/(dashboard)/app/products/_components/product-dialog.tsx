"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Product, ProductCategory, DietaryTag } from "@/types/product";
import {
  Info,
  Image as ImageIcon,
  DollarSign,
  Package,
  Check,
  Loader2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

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

      if (product.image) {
        setImagePreview(product.image);
        setImageError(false);
      }
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
      setImagePreview(null);
      setImageError(false);
    }
  }, [open, product, form]);

  // Watch image URL changes for preview
  const imageUrl = form.watch('image');
  useEffect(() => {
    if (imageUrl && imageUrl.trim() !== '') {
      const img = new Image();
      img.onload = () => {
        setImagePreview(imageUrl);
        setImageError(false);
      };
      img.onerror = () => {
        setImagePreview(null);
        setImageError(true);
      };
      img.src = imageUrl;
    } else {
      setImagePreview(null);
      setImageError(false);
    }
  }, [imageUrl]);

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit(data);
    setIsSubmitting(false);
    form.reset();
  };

  const dietaryOptions: { value: DietaryTag; label: string; description: string }[] = [
    { value: 'vegan', label: 'Vegan', description: 'No animal products' },
    { value: 'vegetarian', label: 'Vegetarian', description: 'No meat' },
    { value: 'gluten-free', label: 'Gluten-Free', description: 'No gluten' },
    { value: 'dairy-free', label: 'Dairy-Free', description: 'No dairy' },
    { value: 'nut-free', label: 'Nut-Free', description: 'No nuts' },
    { value: 'organic', label: 'Organic', description: 'Organic ingredients' },
  ];

  const specialAttributes = [
    { name: 'isNew' as const, label: 'New', icon: Sparkles, description: 'New product' },
    { name: 'isSpecial' as const, label: 'Special', icon: Sparkles, description: 'Special item' },
    { name: 'limitedQuantity' as const, label: 'Limited', icon: AlertCircle, description: 'Limited quantity' },
    { name: 'bakedToday' as const, label: 'Fresh', icon: Check, description: 'Baked today' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[820px] max-w-[calc(100%-2rem)] max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header - Fixed */}
        <DialogHeader className="px-8 pt-8 pb-6 border-b">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <DialogTitle className="text-2xl font-semibold">
              {product ? t('editTitle') : t('createTitle')}
            </DialogTitle>
            <DialogDescription className="text-sm mt-2">
              {product ? t('editDescription') : t('createDescription')}
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="px-8 pb-8">
              {/* Image Preview Section */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-start gap-6">
                  {/* Image Preview */}
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-32 h-32 rounded-xl border-2 border-dashed overflow-hidden transition-all duration-300",
                      imagePreview ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30",
                      imageError && "border-destructive/50 bg-destructive/5"
                    )}>
                      <AnimatePresence mode="wait">
                        {imagePreview && !imageError ? (
                          <motion.img
                            key={imagePreview}
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          />
                        ) : (
                          <motion.div
                            key="placeholder"
                            className="w-full h-full flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ImageIcon className={cn(
                              "w-8 h-8",
                              imageError ? "text-destructive/50" : "text-muted-foreground/30"
                            )} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Image URL Field */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-sm font-medium">
                              {t('imageUrl')}
                            </FormLabel>
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-xs">
                                  <p className="text-xs">Enter a valid image URL. The preview will update automatically.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              className="h-10"
                              {...field}
                            />
                          </FormControl>
                          {imageError && (
                            <p className="text-xs text-destructive flex items-center gap-1.5 mt-1.5">
                              <AlertCircle className="w-3 h-3" />
                              Unable to load image from this URL
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Basic Information */}
              <motion.div
                className="mt-8 space-y-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div>
                  <h3 className="text-sm font-semibold mb-1">Basic Information</h3>
                  <p className="text-xs text-muted-foreground">Essential product details</p>
                </div>

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t('productName')}
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('productNamePlaceholder')}
                            className="h-10"
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
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-medium">
                            {t('description')}
                            <span className="text-destructive ml-1">*</span>
                          </FormLabel>
                          <span className="text-xs text-muted-foreground">
                            {field.value?.length || 0} / 500
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder={t('descriptionPlaceholder')}
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              {/* Category Selection - Visual Cards */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-3">
                        <FormLabel className="text-sm font-medium">
                          Category
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p className="text-xs">Select the category that best describes your product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <div className="grid grid-cols-5 gap-3">
                          {PRODUCT_CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = field.value === cat.id;
                            return (
                              <TooltipProvider key={cat.id} delayDuration={300}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <motion.button
                                      type="button"
                                      onClick={() => field.onChange(cat.id)}
                                      className={cn(
                                        "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 min-h-[100px]",
                                        isSelected
                                          ? "border-primary/30 bg-primary/[0.03] shadow-sm"
                                          : "border-border hover:border-primary/20 hover:bg-accent/30"
                                      )}
                                      whileHover={{ scale: 1.02, y: -2 }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                      {Icon && (
                                        <Icon className={cn(
                                          "w-5 h-5 transition-colors flex-shrink-0",
                                          isSelected ? "text-primary/80" : "text-muted-foreground"
                                        )} />
                                      )}
                                      <span className={cn(
                                        "text-[11px] font-medium transition-colors text-center leading-tight px-1 break-words hyphens-auto max-w-full",
                                        isSelected ? "text-primary/90" : "text-foreground"
                                      )}>
                                        {cat.name}
                                      </span>
                                      {isSelected && (
                                        <motion.div
                                          className="absolute top-2 right-2"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                        >
                                          <div className="w-4 h-4 rounded-full bg-primary/80 flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                                          </div>
                                        </motion.div>
                                      )}
                                    </motion.button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">{cat.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Price and Stock */}
              <motion.div
                className="mt-8 grid grid-cols-2 gap-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        {t('price')}
                        <span className="text-destructive ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="h-10 pl-7"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </div>
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
                      <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" />
                        {t('stockQuantity')}
                        <span className="text-destructive ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="h-10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Dietary Tags - Toggle Pills */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <FormField
                  control={form.control}
                  name="dietaryTags"
                  render={() => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-3">
                        <FormLabel className="text-sm font-medium">{t('dietaryTags')}</FormLabel>
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p className="text-xs">Select all dietary restrictions that apply to this product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormDescription className="text-xs mb-3">
                        {t('dietaryTagsDescription')}
                      </FormDescription>
                      <div className="flex flex-wrap gap-2">
                        {dietaryOptions.map((option) => (
                          <FormField
                            key={option.value}
                            control={form.control}
                            name="dietaryTags"
                            render={({ field }) => {
                              const isSelected = field.value?.includes(option.value);
                              return (
                                <TooltipProvider delayDuration={300}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <motion.button
                                        type="button"
                                        onClick={() => {
                                          const newValue = isSelected
                                            ? field.value?.filter((v) => v !== option.value)
                                            : [...(field.value || []), option.value];
                                          field.onChange(newValue);
                                        }}
                                        className={cn(
                                          "px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border-2",
                                          isSelected
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-background border-border hover:border-primary/50 hover:bg-accent"
                                        )}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                      >
                                        {isSelected && (
                                          <Check className="w-3 h-3 inline mr-1.5" />
                                        )}
                                        {option.label}
                                      </motion.button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">{option.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Special Attributes - Badge Toggles */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-3">
                  <h3 className="text-sm font-medium mb-1">Special Attributes</h3>
                  <p className="text-xs text-muted-foreground">Mark special features for this product</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {specialAttributes.map((attr) => {
                    const Icon = attr.icon;
                    return (
                      <FormField
                        key={attr.name}
                        control={form.control}
                        name={attr.name}
                        render={({ field }) => {
                          const isSelected = field.value;
                          return (
                            <TooltipProvider delayDuration={300}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.button
                                    type="button"
                                    onClick={() => field.onChange(!field.value)}
                                    className={cn(
                                      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2",
                                      isSelected
                                        ? "bg-primary/10 text-primary border-primary/30"
                                        : "bg-background border-border hover:border-primary/30 hover:bg-accent"
                                    )}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                  >
                                    <Icon className={cn(
                                      "w-4 h-4 transition-colors",
                                      isSelected ? "text-primary" : "text-muted-foreground"
                                    )} />
                                    {attr.label}
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                      >
                                        <Check className="w-3.5 h-3.5 text-primary" />
                                      </motion.div>
                                    )}
                                  </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{attr.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        }}
                      />
                    );
                  })}
                </div>
              </motion.div>

              {/* Additional Details */}
              <motion.div
                className="mt-8 space-y-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div>
                  <h3 className="text-sm font-medium mb-1">Additional Details</h3>
                  <p className="text-xs text-muted-foreground">Optional information (can be added later)</p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">{t('ingredients')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('ingredientsPlaceholder')}
                            className="resize-none min-h-[80px] text-sm"
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
                        <FormLabel className="text-sm font-medium">{t('allergens')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('allergensPlaceholder')}
                            className="resize-none min-h-[80px] text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              {/* Action Buttons - Fixed at bottom */}
              <motion.div
                className="mt-8 pt-6 border-t flex items-center justify-end gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.45 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="h-10 px-5"
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 min-w-[100px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{product ? t('save') : t('create')}</>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
