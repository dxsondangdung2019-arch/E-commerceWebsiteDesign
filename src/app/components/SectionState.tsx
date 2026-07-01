import { AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";

export type SectionStateKind = "loading" | "empty" | "error";

type SectionStateProps = {
  kind: SectionStateKind;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  count?: number;
};

export function SectionState({
  kind,
  title,
  message,
  actionLabel,
  onAction,
  count = 6,
}: SectionStateProps) {
  if (kind === "loading") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mb-3 h-36 rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  if (kind === "empty") {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
        <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold">
          {title ?? "Không có dữ liệu"}
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {message ?? "Hiện chưa có nội dung để hiển thị."}
        </p>
        {actionLabel && onAction ? (
          <Button onClick={onAction} variant="outline">
            {actionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30">
      <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
      <h3 className="mb-2 text-lg font-semibold">{title ?? "Đã xảy ra lỗi"}</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {message ?? "Không thể tải dữ liệu lúc này."}
      </p>
      {actionLabel && onAction ? (
        <Button
          onClick={onAction}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
