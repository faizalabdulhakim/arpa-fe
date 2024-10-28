"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getSession } from "@/app/lib";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

const ActionCell = ({ row }: { row: Row<User> }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { toast } = useToast();

  const promoteUser = async () => {
    const token = (await getSession())?.access_token;
    const id = row.original.id;
    fetch(`${apiUrl}/users/${id}/promote`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast({ description: "User Promoted to Admin" });
          router.refresh();
        } else {
          toast({
            description: "Error Promoting User",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {row.original.role === "USER" && (
        <Badge
          variant="default"
          onClick={promoteUser}
          className="cursor-pointer"
        >
          Promote
        </Badge>
      )}
    </>
  );
};
