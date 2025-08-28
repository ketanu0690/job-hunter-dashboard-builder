import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/shared/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(
        ({ id, title, description, action, variant = "default", ...props }) => {
          return (
            <Toast
              key={id}
              {...props}
              className={`
              relative flex items-start gap-3 rounded-xl p-4 shadow-lg border
              transition-all duration-300
              ${
                variant === "success"
                  ? "bg-green-50 border-green-200"
                  : variant === "error"
                    ? "bg-red-50 border-red-200"
                    : variant === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-white border-gray-200"
              }
            `}
            >
              <div className="grid gap-1 pr-6">
                {title && (
                  <ToastTitle
                    className={`
                    font-medium text-sm
                    ${
                      variant === "success"
                        ? "text-green-800"
                        : variant === "error"
                          ? "text-red-800"
                          : variant === "warning"
                            ? "text-yellow-800"
                            : "text-gray-900"
                    }
                  `}
                  >
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm text-gray-600">
                    {description}
                  </ToastDescription>
                )}
              </div>
              {action}
              <ToastClose className="absolute right-2 top-2 text-gray-400 hover:text-gray-600" />
            </Toast>
          );
        }
      )}
      <ToastViewport className="fixed bottom-4 right-4 flex flex-col gap-3 w-80 max-w-full outline-none" />
    </ToastProvider>
  );
}
