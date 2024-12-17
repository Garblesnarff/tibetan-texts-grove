import * as React from "react";
import { Toast, ToasterToast, ToastState } from "@/types/toast";
import { reducer } from "@/reducers/toastReducer";
import { TOAST_REMOVE_DELAY } from "@/constants/toast";

/**
 * Counter for generating unique toast IDs
 */
let count = 0;

/**
 * Generates a unique ID for toasts
 * @returns A unique string ID
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

/**
 * Array of state change listeners
 */
const listeners: Array<(state: ToastState) => void> = [];

/**
 * In-memory state for toasts
 */
let memoryState: ToastState = { toasts: [] };

/**
 * Dispatches an action to update toast state
 * @param action - Action to be dispatched
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/**
 * Creates and shows a new toast notification
 * @param props - Toast configuration
 * @returns Object containing toast ID and control functions
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * Hook for managing toast notifications
 * @returns Object containing toast state and control functions
 */
function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };