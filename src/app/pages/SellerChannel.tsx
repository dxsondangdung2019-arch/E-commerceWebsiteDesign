import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  Package,
  ShieldCheck,
  Store,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const benefits = [
  {
    title: "Quản lý gian hàng",
    description:
      "Thiết lập logo, banner và danh mục sản phẩm theo phong cách riêng.",
    icon: Store,
  },
  {
    title: "Theo dõi doanh thu",
    description: "Xem đơn hàng, doanh thu và hiệu suất bán hàng trong một nơi.",
    icon: BarChart3,
  },
  {
    title: "Vận hành an toàn",
    description:
      "Quy trình bán hàng được mô phỏng rõ ràng, dễ thử nghiệm và mở rộng.",
    icon: ShieldCheck,
  },
];

export function SellerChannelPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white shadow-xl">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
          <div>
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">
              Kênh Người Bán
            </Badge>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
              Tạo gian hàng, quản lý sản phẩm và tăng trưởng doanh số như
              Shopee.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-orange-100 md:text-base">
              Trang này là trung tâm cho người bán: theo dõi đơn hàng, tối ưu
              sản phẩm, quản lý khuyến mãi và chuẩn bị bước vào hệ sinh thái bán
              hàng.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                <Link to="/seller/register">
                  Trở thành Người Bán
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                <Link to="/auth">Đăng nhập quản lý</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="border-white/20 bg-white/10 text-white backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Số liệu mô phỏng
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-2xl font-semibold">128</div>
                  <div className="text-orange-100">Đơn hàng</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">₫12,5tr</div>
                  <div className="text-orange-100">Doanh thu</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">96</div>
                  <div className="text-orange-100">Sản phẩm</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/20 bg-white/10 text-white backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Quy trình bán hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-orange-50">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4" />
                  Đăng sản phẩm và thiết lập giá bán
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4" />
                  Xử lý đơn hàng và cập nhật trạng thái
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4" />
                  Theo dõi hiệu quả và tối ưu khuyến mãi
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {benefits.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-0 shadow-sm">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {item.description}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
