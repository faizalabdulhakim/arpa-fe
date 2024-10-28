"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { getSession } from "@/app/lib";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const formSchema = z.object({
  user_id: z.string().nonempty("User ID is required"),
  products: z
    .array(
      z.object({
        product_id: z.string().nonempty("Product ID is required"),
        quantity: z.string().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one product is required"),
});

export default function AddOrder() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
      products: [{ product_id: "", quantity: 1 }],
    },
  });

  const { toast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { fields, append, remove } = useFieldArray({
    name: "products",
    control: form.control,
  });

  interface User {
    id: string;
    name: string;
  }

  const [userData, setUserData] = useState<User[]>([]);
  const [user_id, setUser_id] = useState("");

  const fetchUserData = async () => {
    const token = (await getSession())?.access_token;

    const response = await fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    setUserData(result.users);
  };

  // SUBMIT FORM
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = (await getSession())?.access_token;

    console.log(values);

    const response = await fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      toast({ description: "Order added successfully" });
      router.push("/order");
    } else {
      toast({ description: "Failed to add order", variant: "destructive" });
    }
  }

  // GET PRODUCT
  interface Product {
    id: string;
    name: string;
  }

  const [productData, setProductData] = useState<Product[]>([]);
  const fetchProductData = async () => {
    const token = (await getSession())?.access_token;

    const response = await fetch(`${apiUrl}/products`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    setProductData(result.products);
  };

  useEffect(() => {
    fetchUserData();
    fetchProductData();
  }, []);

  return (
    <div className="min-h-[100vh] flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Order</CardTitle>
          <CardDescription>
            THIS FEATURE IS DEMO PURPOSE (TODO: IMPLEMENT ON STOREFRONT)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setUser_id(value as string);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select User Name" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>User Name</SelectLabel>
                            {userData.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
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

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name={`products.${index}.product_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="w-[300px]">
                              <SelectValue placeholder="Select Product ID" />
                            </SelectTrigger>
                            <SelectContent className="">
                              <SelectGroup>
                                <SelectLabel>Product ID</SelectLabel>
                                {productData.map((product) => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id}
                                  >
                                    {product.name}
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

                  <FormField
                    control={form.control}
                    name={`products.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="mt-8"
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant={"secondary"}
                onClick={() => append({ product_id: "", quantity: 1 })}
              >
                <Plus />
                Add Product
              </Button>

              <div className="flex items-center gap-2">
                <Button type="submit">Add Order</Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/order")}
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
