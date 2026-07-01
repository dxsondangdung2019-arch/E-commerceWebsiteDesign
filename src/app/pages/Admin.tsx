import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ShoppingBag, Users, DollarSign, Package } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const analytics = [
  { month: "T1", revenue: 120, orders: 30 },
  { month: "T2", revenue: 140, orders: 35 },
  { month: "T3", revenue: 185, orders: 44 },
  { month: "T4", revenue: 220, orders: 56 },
  { month: "T5", revenue: 260, orders: 68 },
  { month: "T6", revenue: 310, orders: 78 },
];

export function AdminPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const orders = useSelector(
    (state: RootState) => state.orders.lastLoadedUserOrders,
  );
  const [search, setSearch] = useState("");

  const summary = useMemo(
    () => ({
      revenue: 12500000,
      orders: orders.length + 48,
      users: 128,
      products: 96,
    }),
    [orders.length],
  );

  if (auth.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-lg">
        Bạn không có quyền truy cập khu vực quản trị.
      </div>
    );
  }

  const filtered = analytics.filter((item) =>
    item.month.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Xem KPI và xu hướng bán hàng mock.
          </p>
        </div>
        <Input
          placeholder="Tìm thống kê..."
          className="max-w-xs"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              ₫{summary.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">+12.4% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingBag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary.orders}</div>
            <p className="text-xs text-green-600">+8.2% tuần này</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary.users}</div>
            <p className="text-xs text-gray-500">Tăng ổn định</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary.products}</div>
            <p className="text-xs text-gray-500">Đang hoạt động</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Doanh thu & đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: { label: "Doanh thu", color: "hsl(var(--chart-1))" },
              orders: { label: "Đơn hàng", color: "hsl(var(--chart-2))" },
            }}
            className="h-[280px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fill="var(--color-revenue)"
                  fillOpacity={0.25}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  fill="var(--color-orders)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động mới</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="font-medium">{order.id}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <Badge>{order.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái hệ thống</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span>Mock API</span>
              <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span>Redux Store</span>
              <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span>Dark mode</span>
              <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
