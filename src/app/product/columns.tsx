"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getSession } from "@/app/lib";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type Category = {
  category: {
    name: string;
  };
};

export type Product = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  categories: Category[];
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={`${process.env.NEXT_PUBLIC_APP_URL}/uploads/${row.original.image}`}
        alt={row.original.name}
        width={50}
        height={50}
        className="object-cover rounded-md"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return `Rp ${row.original.price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.categories.map((categories) => (
          <Badge key={categories.category.name} variant="default">
            {categories.category.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

const ActionCell = ({ row }: { row: Row<Product> }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { toast } = useToast();

  const editProduct = async () => {
    router.push(`/product/edit/${row.original.id}`);
  };

  const deleteProduct = async () => {
    const token = (await getSession())?.access_token;
    const id = row.original.id;
    fetch(`${apiUrl}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast({ description: "Product Deleted" });
          location.reload();
        } else {
          toast({
            description: "Error Deleting Product",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex gap-2">
      <Badge
        variant="secondary"
        onClick={editProduct}
        className="cursor-pointer"
      >
        Edit
      </Badge>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Badge variant="destructive" className="cursor-pointer">
            Delete
          </Badge>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete this
              product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
