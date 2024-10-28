"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getSession } from "@/app/lib";
import { Box, NotebookText, Tag, User } from "lucide-react";

export default function Dashboard() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [totalUser, setTotalUser] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = (await getSession())?.access_token;
      const response = await fetch(`${apiUrl}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setTotalUser(result.total_record_count);
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    const fetchData = async () => {
      const token = (await getSession())?.access_token;
      const response = await fetch(`${apiUrl}/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setTotalProduct(result.total_record_count);
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    const fetchData = async () => {
      const token = (await getSession())?.access_token;
      const response = await fetch(`${apiUrl}/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setTotalOrder(result.total_record_count);
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    const fetchData = async () => {
      const token = (await getSession())?.access_token;
      const response = await fetch(`${apiUrl}/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setTotalCategory(result.total_record_count);
    };
    fetchData();
  }, [apiUrl]);

  return (
    <div className="min-h-[100vh] flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col basis-1/4 rounded-md border p-5 gap-2">
              <div className="flex w-full justify-between">
                <div className="text-sm">Total Users</div>
                <div className="text-xs font-thin">
                  <User size={18} className="text-blue-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-lg">{totalUser} User</div>
                <div className="font-thin text-sm text-gray-500"></div>
              </div>
            </div>
            <div className="flex flex-col basis-1/4 rounded-md border p-5 gap-2">
              <div className="flex w-full justify-between">
                <div className="text-sm">Total Products</div>
                <div className="text-xs font-thin">
                  <Box size={18} className="text-orange-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-lg">{totalProduct} Product</div>
                <div className="font-thin text-sm text-gray-500"></div>
              </div>
            </div>
            <div className="flex flex-col basis-1/4 rounded-md border p-5 gap-2">
              <div className="flex w-full justify-between">
                <div className="text-sm">Total Category</div>
                <div className="text-xs font-thin">
                  <Tag size={18} className="text-green-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-lg">
                  {totalCategory} Category
                </div>
                <div className="font-thin text-sm text-gray-500"></div>
              </div>
            </div>
            <div className="flex flex-col basis-1/4 rounded-md border p-5 gap-2">
              <div className="flex w-full justify-between">
                <div className="text-sm">Total Order</div>
                <div className="text-xs font-thin">
                  <NotebookText size={18} className="text-red-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-lg">{totalOrder} Order</div>
                <div className="font-thin text-sm text-gray-500"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
