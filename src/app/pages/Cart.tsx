import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { SectionState } from "../components/SectionState";
import type { AppDispatch, RootState } from "../../store/store";
import {
  removeFromCart,
  toggleCartSelection,
  toggleSelectAll,
  updateCartQuantity,
  setVoucherCode,
} from "../../store/slices/cartSlice";

export function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const voucherCode = useSelector((state: RootState) => state.cart.voucherCode);
  const [voucherInput, setVoucherInput] = useState(voucherCode ?? "");
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const selectedItems = useMemo(
    () => cartItems.filter((item) => item.selected),
    [cartItems],
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
    const code = (voucherCode ?? "").toUpperCase();
    if (code === "SAVE10" && subtotal >= 100000)
      return Math.round(subtotal * 0.1);
    if (code === "FREESHIP" && subtotal >= 300000)
      return Math.min(30000, subtotal);
    return 0;
  }, [subtotal, voucherCode]);
  const shippingFee = subtotal === 0 ? 0 : subtotal >= 500000 ? 0 : 30000;
  const total = Math.max(0, subtotal - voucherDiscount + shippingFee);
  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  const updateQuantity = (productId: string, delta: number) => {
    const item = cartItems.find((entry) => entry.productId === productId);
    if (!item) return;
    dispatch(
      updateCartQuantity({ productId, quantity: item.quantity + delta }),
    );
  };

  const removeItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const applyVoucher = () => {
    const normalized = voucherInput.trim().toUpperCase();
    if (!normalized) {
      dispatch(setVoucherCode(null));
      toast.success("Đã bỏ áp dụng voucher");
      return;
    }

    const validCodes = ["SAVE10", "FREESHIP"];
    if (!validCodes.includes(normalized)) {
      dispatch(setVoucherCode(null));
      toast.error("Voucher không hợp lệ");
      return;
    }

    dispatch(setVoucherCode(normalized));
    toast.success(`Áp dụng voucher ${normalized} thành công`);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SectionState
          kind="loading"
          title="Đang tải giỏ hàng"
          message="Đang đồng bộ sản phẩm trong giỏ"
          count={4}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SectionState
          kind="error"
          title="Không thể tải giỏ hàng"
          message={error}
          actionLabel="Thử lại"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-12 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </p>
          <Link to="/">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Mua sắm ngay
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Tiếp tục mua sắm
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 p-4 border-b flex items-center gap-4">
              <Checkbox
                checked={allSelected}
                onCheckedChange={() => dispatch(toggleSelectAll())}
              />
              <span className="font-semibold">
                Tất cả ({cartItems.length} sản phẩm)
              </span>
            </div>

            {/* Items */}
            <div className="divide-y">
              {cartItems.map((item) => (
                <div key={item.productId} className="p-4 flex gap-4">
                  <Checkbox
                    checked={item.selected}
                    onCheckedChange={() =>
                      dispatch(toggleCartSelection(item.productId))
                    }
                  />
                  <div className="flex-1 flex gap-4">
                    <Link
                      to={`/product/${item.productId}`}
                      className="w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0"
                    >
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-medium hover:text-orange-600 line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-2 text-orange-600 font-semibold">
                        ₫{item.product.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="w-12 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                <span>₫{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span
                  className={
                    shippingFee === 0 ? "text-green-600" : "text-gray-900"
                  }
                >
                  {shippingFee === 0
                    ? "Miễn phí"
                    : `₫${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Giảm giá</span>
                <span>-₫{voucherDiscount.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-orange-600">
                  ₫{total.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mb-4 space-y-2">
              <Input
                value={voucherInput}
                onChange={(event) => setVoucherInput(event.target.value)}
                placeholder="Nhập voucher"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={applyVoucher}
              >
                Áp dụng
              </Button>
            </div>
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={selectedItems.length === 0}
              onClick={handleCheckout}
            >
              Mua hàng ({selectedItems.length})
            </Button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Nhấn "Mua hàng" để tiếp tục thanh toán
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
