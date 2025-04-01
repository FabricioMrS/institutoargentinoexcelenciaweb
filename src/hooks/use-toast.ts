
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  useToast as useToastPrimitive,
} from "@/components/ui/use-toast";

export type ToastActionType = ToastActionElement;

export const useToast = useToastPrimitive;

export function toast(props: ToastProps) {
  const { toast } = useToastPrimitive();
  toast(props);
}

export type { ToastProps };
