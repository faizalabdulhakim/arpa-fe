"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getSession } from "@/app/lib";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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

export type Category = {
  id: string;
  name: string;
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

const ActionCell = ({ row }: { row: Row<Category> }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { toast } = useToast();

  const editCategory = async () => {
    router.push(`/category/edit/${row.original.id}`);
  };

  const deleteCategory = async () => {
    const token = (await getSession())?.access_token;
    const id = row.original.id;
    fetch(`${apiUrl}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast({ description: "Category Deleted" });
          location.reload();
        } else {
          toast({
            description: "Error Deleting Category",
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
        onClick={editCategory}
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
            <AlertDialogAction onClick={deleteCategory}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
