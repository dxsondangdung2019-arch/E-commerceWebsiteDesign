import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import type { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";

export function AccountPage() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const orders = useSelector(
    (state: RootState) => state.orders.lastLoadedUserOrders,
  );
  const [profile, setProfile] = useState({
    fullName: auth.user?.fullName ?? "",
    email: auth.user?.email ?? "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const stats = useMemo(
    () => ({
      totalOrders: orders.length,
      latestStatus: orders[0]?.status ?? "NONE",
    }),
    [orders],
  );

  if (!auth.user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">
          Bạn cần đăng nhập để xem tài khoản
        </h1>
        <Link to="/auth" className="mt-4 inline-flex text-orange-600">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <div>
          <h1 className="text-2xl font-semibold">Tài khoản của tôi</h1>
          <p className="text-sm text-gray-500">{auth.user.email}</p>
        </div>
        <Button variant="outline" onClick={() => dispatch(logout())}>
          Đăng xuất
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold">Thông tin cá nhân</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Họ và tên</Label>
                <Input
                  value={profile.fullName}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={profile.email}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => toast.success("Cập nhật hồ sơ thành công")}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold">Đổi mật khẩu</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Mật khẩu hiện tại</Label>
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={(event) =>
                    setPasswords((prev) => ({
                      ...prev,
                      current: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Mật khẩu mới</Label>
                <Input
                  type="password"
                  value={passwords.next}
                  onChange={(event) =>
                    setPasswords((prev) => ({
                      ...prev,
                      next: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Xác nhận mật khẩu mới</Label>
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(event) =>
                    setPasswords((prev) => ({
                      ...prev,
                      confirm: event.target.value,
                    }))
                  }
                />
              </div>
              <Button
                variant="outline"
                onClick={() => toast.success("Đổi mật khẩu thành công")}
              >
                Đổi mật khẩu
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold">Tóm tắt</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">Đơn hàng</p>
                <p className="text-2xl font-semibold">{stats.totalOrders}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">Trạng thái gần nhất</p>
                <p className="text-lg font-semibold">{stats.latestStatus}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold">Đơn hàng gần đây</h2>
            <div className="space-y-3">
              {orders.length > 0 ? (
                orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <Badge>{order.status}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Chưa có đơn hàng nào.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
