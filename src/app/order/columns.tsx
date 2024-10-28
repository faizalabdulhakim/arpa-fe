"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSession } from "@/app/lib";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Order = {
  id: string;
  user: {
    name: string;
  };
  total_price: number;
  status: string;
  products: {
    quantity: number;
    product: {
      name: string;
      price: number;
      image: string;
    };
  }[];
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "user",
    header: "User Name",
    cell: ({ row }) => row.original.user.name,
  },
  {
    accessorKey: "total_price",
    header: "Total Price",
    cell: ({ row }) => {
      return `Rp ${row.original.total_price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.status === "PROCESSING"
              ? "secondary"
              : row.original.status === "SHIPPED"
              ? "outline"
              : "default"
          }
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

const ActionCell = ({ row }: { row: Row<Order> }) => {
  return (
    <div className="flex gap-2">
      <ViewOrder id={row.original.id} />
      <UpdateStatus id={row.original.id} />
    </div>
  );
};

const ViewOrder = ({ id }: { id: string }) => {
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = (await getSession())?.access_token;

      try {
        const response = await fetch(`${apiUrl}/orders/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }

        const order = await response.json();
        setData(order);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function formatToRupiah(amount: number) {
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge className="cursor-pointer">
          <Eye size={18} />
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Items</DialogTitle>
          <DialogDescription>Order ID: {id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            data?.products.map((product, index) => (
              <div key={index}>
                <div className="mb-4 flex items-center gap-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/uploads/${product.product.image}`}
                    alt={product.product.name}
                    width={100}
                    height={100}
                    className="w-16 rounded-md"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {product.product.name}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      x{product.quantity}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {formatToRupiah(product.product.price)}
                    </p>
                  </div>
                </div>
                <Separator orientation="horizontal" />
              </div>
            ))
          )}
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FormSchema = z.object({
  status: z.string().optional(),
});

type UpdateStatusProps = {
  id: string;
};

export function UpdateStatus({ id }: UpdateStatusProps) {
  const [status, setStatus] = useState<
    "PROCESSING" | "SHIPPED" | "DELIVERED" | ""
  >("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleUpdateStatus = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = (await getSession())?.access_token;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/orders/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast({
        description: `Order updated to ${status} `,
      });
      location.reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Update Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateStatus)}
            className="space-y-6"
          >
            <div className="my-4">
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as "PROCESSING" | "SHIPPED" | "DELIVERED")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem key="processing" value="PROCESSING">
                      Processing
                    </SelectItem>
                    <SelectItem key="shipped" value="SHIPPED">
                      Shipped
                    </SelectItem>
                    <SelectItem key="delivered" value="DELIVERED">
                      Delivered
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!status || loading}>
                {loading ? "Updating..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
