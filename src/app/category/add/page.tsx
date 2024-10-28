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
import { getSession } from "@/app/lib";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export default function AddProduct() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { toast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // SUBMIT FORM
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = (await getSession())?.access_token;

    const response = await fetch(`${apiUrl}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: values.name }),
    });

    if (response.ok) {
      toast({
        description: "Category added successfully",
      });
      router.push("/category");
    } else {
      toast({
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-[100vh] flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

              <div className="flex items-center gap-2">
                <Button type="submit">Add Category</Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/category")}
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
