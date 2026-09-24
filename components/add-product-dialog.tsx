"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, Product } from "@/lib/schema";
import { useProductStore } from "@/store/product-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  X,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const STEPS = ["Details", "Pricing", "Images", "Review"] as const;

interface AddProductDialogProps {
  productToEdit?: Product | null;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export function AddProductDialog({
  productToEdit,
  isOpenExternal,
  onCloseExternal,
}: AddProductDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const { addProduct, updateProduct } = useProductStore();

  const isControlled = isOpenExternal !== undefined;
  const open = isControlled ? isOpenExternal : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled && onCloseExternal && !val) onCloseExternal();
    else setInternalOpen(val);
  };

  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: productToEdit || {
      name: "",
      category: "Electronics",
      description: "",
      sku: "SKU-" + Math.floor(1000 + Math.random() * 9000),
      price: 99,
      costPrice: 60,
      taxRate: 5,
      discount: 0,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"],
      status: "ACTIVE",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (productToEdit) {
      form.reset(productToEdit);
    }
  }, [productToEdit, form]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const formValues = watch();

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await trigger(["name", "category", "description", "sku"]);
    } else if (currentStep === 1) {
      isValid = await trigger(["price", "costPrice", "taxRate", "discount"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["images"]);
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Requirement #3: Server Action / FileReader image processing with instant thumbnail preview
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("images", [base64String], { shouldValidate: true });
        toast.success("Image uploaded & preview generated!");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to process image file");
      setIsUploading(false);
    }
  };

  const onSubmit = (data: Product) => {
    if (productToEdit?.id) {
      updateProduct(productToEdit.id, data);
      toast.success(`${data.name} updated successfully!`);
    } else {
      addProduct(data);
      toast.success(`${data.name} added to inventory!`);
    }
    reset();
    setCurrentStep(0);
    setOpen(false);
  };

  return (
    <>
      {!isControlled && (
        <Button
          type="button"
          onClick={() => {
            reset();
            setCurrentStep(0);
            setInternalOpen(true);
          }}
          className="gap-2 font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-card border text-card-foreground shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {productToEdit ? "Edit Product" : "Product Studio"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Step {currentStep + 1} of 4: {STEPS[currentStep]}
              </p>

              <div className="flex items-center justify-between w-full pt-4 pb-2 border-b">
                {STEPS.map((stepName, idx) => (
                  <React.Fragment key={stepName}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all shrink-0 ${
                          idx === currentStep
                            ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                            : idx < currentStep
                            ? "bg-emerald-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {idx < currentStep ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-medium whitespace-nowrap ${
                          idx === currentStep ? "text-foreground font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {stepName}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="h-[2px] flex-1 bg-muted mx-2 min-w-[12px]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" placeholder="e.g. Wireless Noise-Cancelling Headphones" {...register("name")} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU Code</Label>
                      <Input id="sku" {...register("sku")} />
                      {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        defaultValue={formValues.category}
                        onValueChange={(val: any) => setValue("category", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Home">Home</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detail specifications..."
                      rows={3}
                      {...register("description")}
                    />
                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Selling Price ($)</Label>
                      <Input type="number" step="0.01" id="price" {...register("price")} />
                      {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="costPrice">Cost Price ($)</Label>
                      <Input type="number" step="0.01" id="costPrice" {...register("costPrice")} />
                      {errors.costPrice && <p className="text-xs text-destructive">{errors.costPrice.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input type="number" id="taxRate" {...register("taxRate")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input type="number" id="discount" {...register("discount")} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Image (File Upload)</Label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-muted/40 transition-colors">
                        {isUploading ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" /> Processing file...
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <UploadCloud className="h-8 w-8 mb-1 text-primary" />
                            <span className="text-xs font-medium">Click to choose image file</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-url">Or Image URL</Label>
                    <Input
                      id="image-url"
                      placeholder="Public image URL"
                      value={formValues.images?.[0] || ""}
                      onChange={(e) => setValue("images", [e.target.value])}
                    />
                    {errors.images && <p className="text-xs text-destructive">{errors.images.message}</p>}
                  </div>

                  <div className="border rounded-lg p-3 flex flex-col items-center justify-center bg-muted/20">
                    {formValues.images?.[0] ? (
                      <img
                        src={formValues.images[0]}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border shadow-xs"
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10 opacity-40" />
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 border rounded-lg p-4 bg-muted/20 text-sm">
                  <h4 className="font-bold border-b pb-2">Product Summary</h4>
                  <div className="flex gap-4 items-center">
                    <img
                      src={formValues.images?.[0]}
                      alt="Review"
                      className="h-16 w-16 object-cover rounded-md border"
                    />
                    <div>
                      <p className="font-semibold">{formValues.name}</p>
                      <p className="text-xs text-muted-foreground">{formValues.category} • {formValues.sku}</p>
                      <p className="text-sm font-bold text-emerald-600">${Number(formValues.price).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                {currentStep > 0 ? (
                  <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                ) : <div />}

                {currentStep < STEPS.length - 1 ? (
                  <Button type="button" onClick={handleNext} className="gap-2">
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Check className="h-4 w-4" /> {productToEdit ? "Update Product" : "Submit Product"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}