import { Outlet, Link, useNavigate } from "react-router";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Bell,
  Store,
  BadgePlus,
  Laptop,
  Shirt,
  Sparkles,
  Home,
  Dumbbell,
  Book,
  Gamepad2,
  UtensilsCrossed,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { categories } from "../data/products";
import type { RootState } from "../../store/store";

const iconMap: Record<string, any> = {
  Laptop,
  Shirt,
  Sparkles,
  Home,
  Dumbbell,
  Book,
  Gamepad2,
  UtensilsCrossed,
};

export function Layout() {
  const [searchQuery, setSearchQuery] = useState("");
  const auth = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-4">
              <Link
                to="/seller/channel"
                className="hover:opacity-80 flex items-center gap-1"
              >
                <Store className="w-4 h-4" />
                Kênh Người Bán
              </Link>
              <Link
                to="/seller/register"
                className="hover:opacity-80 flex items-center gap-1"
              >
                <BadgePlus className="w-4 h-4" />
                Trở thành Người Bán
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/notifications"
                className="hover:opacity-80 flex items-center gap-1"
              >
                <Bell className="w-4 h-4" />
                Thông báo
              </Link>
              <Link
                to={auth.token ? "/account" : "/auth"}
                className="hover:opacity-80 flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                {auth.token
                  ? auth.user?.fullName || "Tài khoản"
                  : "Đăng ký / Đăng nhập"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8 pt-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
              <ShoppingCart className="w-8 h-8" />
              <span>ShopViet</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pr-12 bg-white text-gray-900"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-0 top-0 h-10 rounded-l-none bg-orange-600 hover:bg-orange-700"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2 text-xs">
                <Link to="/search?q=tai nghe" className="hover:opacity-80">
                  Tai Nghe
                </Link>
                <Link to="/search?q=áo thun" className="hover:opacity-80">
                  Áo Thun
                </Link>
                <Link to="/search?q=giày" className="hover:opacity-80">
                  Giày Dép
                </Link>
                <Link to="/search?q=đồng hồ" className="hover:opacity-80">
                  Đồng Hồ
                </Link>
              </div>
            </form>

            {/* Cart */}
            <Link to="/cart" className="relative hover:opacity-80">
              <ShoppingCart className="w-7 h-7" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-white text-orange-600 hover:bg-white">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 h-12 overflow-x-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Menu className="w-4 h-4" />
                  Danh mục
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="space-y-2 mt-6">
                  {categories.map((cat) => {
                    const Icon = iconMap[cat.icon];
                    return (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                      >
                        <Icon className="w-5 h-5 text-orange-600" />
                        <span>{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon];
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="flex items-center gap-2 px-3 py-2 hover:text-orange-600 transition-colors whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Chăm sóc khách hàng</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/" className="hover:text-orange-600">
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-600">
                    Hướng dẫn mua hàng
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-600">
                    Chính sách vận chuyển
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Về ShopViet</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/" className="hover:text-orange-600">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-600">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-600">
                    Điều khoản
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Thanh toán</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>COD</li>
                <li>Visa, MasterCard</li>
                <li>Ví điện tử</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Theo dõi chúng tôi</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/" className="hover:text-orange-600">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-600">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-600">
                    YouTube
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            © 2026 ShopViet. Tất cả các quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </div>
  );
}
