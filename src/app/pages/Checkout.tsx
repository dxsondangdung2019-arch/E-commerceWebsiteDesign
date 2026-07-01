import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { clearCart } from "../../store/slices/cartSlice";
import { addOrder } from "../../store/slices/ordersSlice";
import type { AppDispatch, RootState } from "../../store/store";
import type { Order } from "../../mock-data/types";
import { SectionState } from "../components/SectionState";

const voucherRules: Record<
  string,
  { type: "PERCENT" | "FIXED"; value: number; minSubtotal: number }
> = {
  SAVE10: { type: "PERCENT", value: 10, minSubtotal: 100000 },
  FREESHIP: { type: "FIXED", value: 30000, minSubtotal: 300000 },
};

export function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.cart.items);
  const voucherCode = useSelector((state: RootState) => state.cart.voucherCode);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    district: "",
    city: "",
    paymentMethod: "COD" as Order["paymentMethod"],
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items],
  );
  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [selectedItems],
  );
  const voucherDiscount = useMemo(() => {
    if (!voucherCode) return 0;
    const rule = voucherRules[voucherCode.toUpperCase()];
    if (!rule) return 0;
    if (subtotal < rule.minSubtotal) return 0;
    if (rule.type === "PERCENT")
      return Math.round(subtotal * (rule.value / 100));
    return Math.min(rule.value, subtotal);
  }, [subtotal, voucherCode]);
  const shippingFee = subtotal === 0 ? 0 : subtotal >= 500000 ? 0 : 30000;
  const total = Math.max(0, subtotal - voucherDiscount + shippingFee);

  if (submitting) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SectionState
          kind="loading"
          title="Đang đặt hàng"
          message="Vui lòng chờ trong giây lát"
          count={4}
        />
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-3">
          Không có sản phẩm nào để thanh toán
        </h1>
        <p className="text-gray-600 mb-6">
          Vui lòng chọn lại sản phẩm trong giỏ hàng trước khi thanh toán.
        </p>
        <Link to="/cart">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Quay lại giỏ hàng
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.district.trim() ||
      !form.city.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    setSubmitting(true);
    try {
      const order: Order = {
        id: `order_${Date.now()}`,
        userId: "guest",
        items: selectedItems.map((item) => ({
          id: `order_item_${item.productId}`,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        })),
        voucherDiscount,
        shippingFee,
        paymentMethod: form.paymentMethod,
        status: "PENDING",
        address: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.address,
          district: form.district,
          city: form.city,
        },
        total,
        createdAt: Date.now(),
      };

      dispatch(addOrder(order));
      dispatch(clearCart());
      toast.success("Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.");
      navigate(`/checkout/success?order=${order.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Thanh toán</h1>
        <p className="text-gray-600">
          Kiểm tra giỏ hàng và điền thông tin giao nhận.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện</Label>
                <Input
                  id="district"
                  value={form.district}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      district: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Tỉnh/Thành phố</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, city: event.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(["COD", "CARD", "WALLET"] as Order["paymentMethod"][]).map(
                (method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, paymentMethod: method }))
                    }
                    className={`rounded-lg border px-4 py-3 text-left ${form.paymentMethod === method ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}
                  >
                    <div className="font-medium">
                      {method === "COD"
                        ? "Thanh toán khi nhận hàng"
                        : method === "CARD"
                          ? "Thẻ tín dụng"
                          : "Ví điện tử"}
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={submitting}
          >
            {submitting ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </form>

        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Đơn hàng</h2>
          <div className="space-y-3">
            {selectedItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-medium">{item.product.name}</div>
                  <div className="text-sm text-gray-600">x{item.quantity}</div>
                </div>
                <div className="text-sm font-semibold">
                  ₫{(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>₫{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>
                {shippingFee === 0
                  ? "Miễn phí"
                  : `₫${shippingFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>-₫{voucherDiscount.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-base font-semibold">
              <span>Tổng cộng</span>
              <span className="text-orange-600">₫{total.toLocaleString()}</span>
            </div>
          </div>
          {voucherCode && (
            <Badge className="mt-4 bg-green-100 text-green-700 hover:bg-green-100">
              Đã áp dụng voucher: {voucherCode}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
