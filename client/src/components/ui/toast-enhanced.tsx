import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const getIcon = () => {
          switch (variant) {
            case "default":
              return <Info className="h-5 w-5 text-blue-500" />
            case "destructive":
              return <XCircle className="h-5 w-5 text-red-500" />
            default:
              return <CheckCircle className="h-5 w-5 text-green-500" />
          }
        }

        return (
          <Toast 
            key={id} 
            variant={variant}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
              "animate-fade-in",
              variant === "destructive" 
                ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
                : "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200"
            )}
            {...props}
          >
            <div className="flex items-center space-x-3">
              {getIcon()}
              <div className="grid gap-1">
                {title && (
                  <ToastTitle className="text-sm font-semibold leading-none tracking-tight">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm opacity-90">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100">
              <X className="h-4 w-4" />
            </ToastClose>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}