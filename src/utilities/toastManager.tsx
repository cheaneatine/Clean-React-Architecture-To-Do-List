import { toast } from "react-hot-toast";

const activeToasts: string[] = [];
const MAX_TOASTS = 2;

type ToastType = "success" | "error" | "loading" | "default";

export function showLimitedToast(
  message: string,
  type: ToastType = "default"
): void {
  // Dismiss the oldest toast if limit reached
  if (activeToasts.length >= MAX_TOASTS) {
    const oldest = activeToasts.shift();
    if (oldest) toast.dismiss(oldest);
  }

  let id: string;

  switch (type) {
    case "success":
      id = toast.success(message);
      break;
    case "error":
      id = toast.error(message);
      break;
    case "loading":
      id = toast.loading(message);
      break;
    default:
      id = toast(message); // default/neutral
  }

  activeToasts.push(id);
}
