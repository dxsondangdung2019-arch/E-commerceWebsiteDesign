import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
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

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden bg-gradient-to-br from-orange-500 to-red-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              Chào mừng bạn đến ShopViet
            </h1>
            <p className="mt-3 text-sm text-orange-100">
              Đăng nhập hoặc tạo tài khoản để theo dõi đơn hàng, wishlist và ưu
              đãi độc quyền.
            </p>
          </div>
          <div className="text-sm text-orange-100">
            Mọi trải nghiệm đều dùng dữ liệu mock để demo đầy đủ.
          </div>
        </div>
        <div className="p-8 sm:p-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                {mode === "login"
                  ? "Đăng nhập"
                  : mode === "register"
                    ? "Đăng ký"
                    : "Quên mật khẩu"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {mode === "forgot"
                  ? "Nhập email để nhận hướng dẫn"
                  : "Điền thông tin để tiếp tục"}
              </p>
            </div>
            {auth.token ? (
              <Button variant="outline" onClick={() => dispatch(logout())}>
                Đăng xuất
              </Button>
            ) : null}
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
                />
              </div>
            ) : null}
            {mode === "login" ? (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={() => setRemember((prev) => !prev)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <button
                  type="button"
                  className="text-orange-600"
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
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            {mode === "login" ? (
              <span>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  className="text-orange-600"
                  onClick={() => setMode("register")}
                >
                  Đăng ký ngay
                </button>
              </span>
            ) : (
              <button
                type="button"
                className="text-orange-600"
                onClick={() => setMode("login")}
              >
                Quay lại đăng nhập
              </button>
            )}
            <Link to="/" className="text-orange-600">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
