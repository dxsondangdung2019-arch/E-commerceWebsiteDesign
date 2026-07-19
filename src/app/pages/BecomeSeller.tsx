import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

export function BecomeSellerPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shopName: "",
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success("Đã ghi nhận yêu cầu trở thành Người Bán");

    setForm({
      shopName: "",
      fullName: "",
      email: "",
      phone: "",
      note: "",
    });

    navigate("/seller/channel");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3 text-orange-600">
        <Store className="h-6 w-6" />
        <h1 className="text-3xl font-bold text-gray-900">
          Trở thành Người Bán
        </h1>
      </div>
      <p className="mb-8 max-w-3xl text-sm leading-6 text-gray-600">
        Điền thông tin để mô phỏng quy trình đăng ký gian hàng. Giao diện này
        được thiết kế theo tinh thần Shopee: rõ ràng, ngắn gọn và tập trung vào
        bước bắt đầu bán hàng.
      </p>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Điều gì có sẵn cho người bán?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
              Thiết lập gian hàng, logo và banner riêng.
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
              Quản lý đơn hàng, thông báo và trạng thái vận chuyển.
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
              Mô phỏng luồng bán hàng để kiểm tra trước khi tích hợp thật.
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Đăng ký thông tin cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Tên cửa hàng</Label>
                <Input
                  id="shopName"
                  value={form.shopName}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      shopName: event.target.value,
                    }))
                  }
                  placeholder="ShopViet Store"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="seller@shopviet.test"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="0987 654 321"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  value={form.note}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, note: event.target.value }))
                  }
                  placeholder="Mô tả ngành hàng hoặc nhu cầu triển khai"
                />
              </div>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                type="submit"
              >
                Gửi đăng ký
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
