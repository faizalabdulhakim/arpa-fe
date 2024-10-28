"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { getSession } from "@/app/lib";
import { useCallback, useState } from "react";
import { DataTable } from "@/components/data-table/DataTable";

export default function User() {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchData = useCallback(async (pageNumber = 1, pageSize = 10) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = (await getSession())?.access_token;
    const offset = (pageNumber - 1) * pageSize;

    const response = await fetch(
      `${apiUrl}/users?offset=${offset}&limit=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    setData(result.users);
    setTotalRecords(result.total_record_count);
  }, []);

  return (
    <div className="min-h-[100vh] flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>User</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            totalRecords={totalRecords}
            fetchData={fetchData}
            filter="name"
            name="User"
            create={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
