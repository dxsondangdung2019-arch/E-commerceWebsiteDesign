import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { ShoppingBag, ShieldCheck, Truck, BadgePercent } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { mockApi } from "../../services/mockApi";
import { setAuthFromMe, logout } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store/store";

function isValidEmail(value: string) {
  return /.+@.+\..+/.test(value);
}

export function AuthPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from || "/";
  }, [location.state]);

  useEffect(() => {
    const saved = window.localStorage.getItem("shopviet_remember");
    if (saved !== null) {
      setRemember(saved === "true");
    }
  }, []);

  useEffect(() => {
    if (remember) {
      window.localStorage.setItem("shopviet_remember", "true");
    } else {
      window.localStorage.removeItem("shopviet_remember");
    }
  }, [remember]);

  if (auth.token) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === "login") {
      if (!form.email.trim() || !form.password.trim()) {
        toast.error("Vui lòng nhập email và mật khẩu");
        return;
      }
      if (!isValidEmail(form.email)) {
        toast.error("Email không hợp lệ");
        return;
      }
      setLoading(true);
      try {
        const data = await mockApi.auth.login({
          email: form.email,
          password: form.password,
        });
        dispatch(
          setAuthFromMe({
            token: data.token,
            user: data.user,
            role: data.user.role,
          }),
        );
        toast.success("Đăng nhập thành công");
        navigate(redirectPath);
      } catch (error: unknown) {
        const message =
          error && typeof error === "object" && "message" in error
            ? String((error as { message?: string }).message)
            : "Đăng nhập thất bại";
        toast.error(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "register") {
      if (
        !form.fullName.trim() ||
        !form.email.trim() ||
        !form.password.trim()
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }
      if (!isValidEmail(form.email)) {
        toast.error("Email không hợp lệ");
        return;
      }
      if (form.password.length < 6) {
        toast.error("Mật khẩu tối thiểu 6 ký tự");
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }
      setLoading(true);
      try {
        const data = await mockApi.auth.register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });
        dispatch(
          setAuthFromMe({
            token: data.token,
            user: data.user,
            role: data.user.role,
          }),
        );
        toast.success("Đăng ký thành công");
        navigate(redirectPath);
      } catch (error: unknown) {
        const message =
          error && typeof error === "object" && "message" in error
            ? String((error as { message?: string }).message)
            : "Đăng ký thất bại";
        toast.error(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!form.email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }
    setLoading(true);
    try {
      await Promise.resolve({ ok: true });
      toast.success("Đã gửi hướng dẫn khôi phục mật khẩu về email của bạn");
      setMode("login");
    } finally {
      setLoading(false);
    }
  };

  const tabButtonClass = (value: typeof mode) =>
    `flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      mode === value
        ? "bg-orange-600 text-white shadow-sm"
        : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_80px_rgba(249,115,22,0.18)] dark:border-gray-700 dark:bg-gray-900 lg:grid-cols-[1fr_0.95fr]">
        <div className="hidden bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              <ShoppingBag className="h-4 w-4" />
              ShopViet
            </div>
            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Mua sắm nhanh, đăng nhập gọn, giao diện quen như Shopee.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-orange-100">
              Tạo tài khoản để theo dõi đơn hàng, wishlist và ưu đãi. Trải
              nghiệm này giữ luồng đăng nhập đơn giản, dễ nhận diện và tập trung
              vào chuyển đổi.
            </p>
          </div>
          <div className="space-y-4 text-sm text-orange-50">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              Bảo mật thông tin và đăng nhập an toàn
            </div>
            <div className="flex items-center gap-3">
              <BadgePercent className="h-5 w-5" />
              Ưu đãi, mã giảm giá và flash sale nổi bật
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5" />
              Theo dõi đơn hàng và trạng thái giao hàng
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {mode === "login"
                  ? "Đăng nhập"
                  : mode === "register"
                    ? "Đăng ký"
                    : "Quên mật khẩu"}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {mode === "forgot"
                  ? "Nhập email để nhận hướng dẫn khôi phục"
                  : "Chọn tab và hoàn tất chỉ trong vài bước"}
              </p>
            </div>
            {auth.token ? (
              <Button variant="outline" onClick={() => dispatch(logout())}>
                Đăng xuất
              </Button>
            ) : null}
          </div>

          <div className="mb-6 flex rounded-full bg-gray-100 p-1 dark:bg-gray-800">
            <button
              type="button"
              className={tabButtonClass("login")}
              onClick={() => setMode("login")}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={tabButtonClass("register")}
              onClick={() => setMode("register")}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" ? (
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
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="name@example.com"
              />
            </div>
            {mode !== "forgot" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder="••••••••"
                />
              </div>
            ) : null}
            {mode === "register" ? (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                  placeholder="••••••••"
                />
              </div>
            ) : null}
            {mode === "login" ? (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={() => setRemember((prev) => !prev)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <button
                  type="button"
                  className="font-medium text-orange-600"
                  onClick={() => setMode("forgot")}
                >
                  Quên mật khẩu?
                </button>
              </div>
            ) : null}
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : mode === "login"
                  ? "Đăng nhập"
                  : mode === "register"
                    ? "Đăng ký"
                    : "Gửi hướng dẫn"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
            {mode === "login" ? (
              <span>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  className="font-medium text-orange-600"
                  onClick={() => setMode("register")}
                >
                  Đăng ký ngay
                </button>
              </span>
            ) : (
              <button
                type="button"
                className="font-medium text-orange-600"
                onClick={() => setMode("login")}
              >
                Quay lại đăng nhập
              </button>
            )}
            <Link to="/" className="font-medium text-orange-600">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
