import * as React from "react";
import { ToastActionElement, ToastProps } from "@/components/ui/toast";

/**
 * Represents a toast notification with additional properties
 */
export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

/**
 * State interface for toast management
 */
export interface ToastState {
  toasts: ToasterToast[];
}

/**
 * Action types for toast state management
 */
export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

/**
 * Type for toast actions
 */
export type Action =
  | {
      type: typeof actionTypes["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: typeof actionTypes["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: typeof actionTypes["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: typeof actionTypes["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

/**
 * Type for toast configuration without ID
 */
export type Toast = Omit<ToasterToast, "id">;