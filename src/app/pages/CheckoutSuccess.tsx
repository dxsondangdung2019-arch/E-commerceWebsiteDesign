import { Link, useSearchParams } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";

export function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") ?? "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <CheckCircle2 className="w-20 h-20 mx-auto mb-4 text-green-600" />
      <h1 className="text-3xl font-bold mb-3">Đặt hàng thành công!</h1>
      <p className="text-gray-600 mb-6">
        Mã đơn hàng của bạn là{" "}
        <span className="font-semibold">{orderId || "Đang tạo"}</span>.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Tiếp tục mua sắm
          </Button>
        </Link>
        <Link to="/cart">
          <Button variant="outline">Quay lại giỏ hàng</Button>
        </Link>
      </div>
    </div>
  );
}
