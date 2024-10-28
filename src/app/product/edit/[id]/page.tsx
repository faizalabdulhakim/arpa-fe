"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSession } from "@/app/lib";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  price: z
    .number({
      required_error: "Price is required.",
      invalid_type_error: "Price must be a number.",
    })
    .positive({ message: "Price must be a positive number." })
    .nonnegative({ message: "Price cannot be negative." }),
  stock: z
    .number({
      required_error: "Stock is required.",
      invalid_type_error: "Stock must be a number.",
    })
    .positive({ message: "Stock must be a positive number." })
    .nonnegative({ message: "Stock cannot be negative." }),
  categories: z
    .array(
      z
        .string()
        .min(2, { message: "Category name must be at least 2 characters." })
    )
    .min(1, { message: "At least one category is required." }),
  image: z
    .any()
    .optional()
    .refine(
      (file) =>
        file.length == 1
          ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
            ? true
            : false
          : true,
      "Invalid file. choose either JPEG or PNG image"
    )
    .refine(
      (file) =>
        file.length == 1
          ? file[0]?.size <= MAX_FILE_SIZE
            ? true
            : false
          : true,
      "Max file size allowed is 8MB."
    ),
});

export default function Page({ params }: { params: { id: string } }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categories: [],
      image: undefined,
    },
  });

  const { toast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // Fetch the product details based on the ID
  const fetchProductData = async () => {
    const token = (await getSession())?.access_token;
    const { id } = await params;

    const response = await fetch(`${apiUrl}/products/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const product = await response.json();
    if (response.ok) {
      form.reset(product); // Populate form with fetched product data
    } else {
      toast({
        description: "Failed to fetch product data",
        variant: "destructive",
      });
    }
  };

  // Submit the edited product
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = (await getSession())?.access_token;
    const { id } = await params;

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("stock", values.stock.toString());
    if (values.image) {
      formData.append("image", values.image);
    }
    values.categories.forEach((category) =>
      formData.append("categories", category)
    );

    const response = await fetch(`${apiUrl}/products/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      form.reset();
      toast({
        description: "Product updated successfully",
      });
      router.push("/product");
    } else {
      toast({
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  }

  // GET CATEGORY DATA
  const [data, setData] = useState<{ id: string; name: string }[]>([]);

  const fetchCategoryData = async () => {
    const token = (await getSession())?.access_token;

    const response = await fetch(`${apiUrl}/categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    setData(result.categories);
  };

  useEffect(() => {
    fetchProductData();
    fetchCategoryData();
  }, []);

  console.log(data);

  return (
    <div className="min-h-[100vh] flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              encType="multipart/form-data"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange([value])}
                        value={field.value.length ? field.value[0] : ""}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            {data?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2">
                <Button type="submit">Update Product</Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/product")}
                  type="button"
                >
                  Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
