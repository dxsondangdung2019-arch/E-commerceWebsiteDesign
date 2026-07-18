import { Bell, PackageCheck, Tag, Truck } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const notifications = [
  {
    title: "Đơn hàng #SV-2048 đã được xác nhận",
    description:
      "Khách hàng vừa hoàn tất thanh toán và đơn hàng đang chờ chuẩn bị.",
    time: "5 phút trước",
    icon: PackageCheck,
    type: "Đơn hàng",
  },
  {
    title: "Gợi ý giảm giá cho sản phẩm nổi bật",
    description:
      "Tăng chuyển đổi bằng cách áp dụng mã giảm giá trong 24 giờ tới.",
    time: "30 phút trước",
    icon: Tag,
    type: "Khuyến mãi",
  },
  {
    title: "Đơn hàng #SV-2031 đang trên đường giao",
    description:
      "Đơn hàng đã được bàn giao cho đơn vị vận chuyển và đang cập nhật trạng thái.",
    time: "1 giờ trước",
    icon: Truck,
    type: "Vận chuyển",
  },
];

export function NotificationsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-sm text-gray-500">
            Các cập nhật đơn hàng, khuyến mãi và hoạt động gần đây của ShopViet.
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Hộp thư gần đây</CardTitle>
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            3 mới
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-gray-900">
                      {item.title}
                    </h2>
                    <Badge variant="secondary">{item.type}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
