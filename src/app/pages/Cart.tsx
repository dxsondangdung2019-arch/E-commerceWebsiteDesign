import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  selected: boolean;
}

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Tai nghe Bluetooth True Wireless Cao Cấp",
      price: 299000,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
      quantity: 1,
      stock: 150,
      selected: true,
    },
    {
      id: "2",
      name: "Áo Thun Nam Nữ Form Rộng Unisex Chất Cotton",
      price: 89000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      quantity: 2,
      stock: 500,
      selected: true,
    },
    {
      id: "6",
      name: "Đồng Hồ Thông Minh Smartwatch Đo Nhịp Tim",
      price: 599000,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      quantity: 1,
      stock: 120,
      selected: false,
    },
  ]);

  const toggleSelectItem = (id: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = cartItems.every((item) => item.selected);
    setCartItems((items) =>
      items.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(
            1,
            Math.min(item.stock, item.quantity + delta)
          );
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const selectedItems = cartItems.filter((item) => item.selected);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);

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
                onCheckedChange={toggleSelectAll}
              />
              <span className="font-semibold">
                Tất cả ({cartItems.length} sản phẩm)
              </span>
            </div>

            {/* Items */}
            <div className="divide-y">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <Checkbox
                    checked={item.selected}
                    onCheckedChange={() => toggleSelectItem(item.id)}
                  />
                  <div className="flex-1 flex gap-4">
                    <Link
                      to={`/product/${item.id}`}
                      className="w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0"
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-medium hover:text-orange-600 line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-2 text-orange-600 font-semibold">
                        ₫{item.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
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
                <span>₫{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-orange-600">
                  ₫{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={selectedItems.length === 0}
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
