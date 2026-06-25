import { ReactNode, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { store } from "../store/store";
import { Toaster } from "../app/components/ui/sonner";
import { setTheme } from "../store/slices/uiSlice";

function ThemeApplier({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((s: RootState) => s.ui.theme);

  useEffect(() => {
    // Apply Tailwind/shadcn dark mode via .dark class
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    // keep slice in sync (in case other flows change localStorage)
    dispatch(setTheme(theme));
  }, [dispatch, theme]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeApplier>
        {children}
        <Toaster position="top-right" richColors />
      </ThemeApplier>
    </Provider>
  );
}
