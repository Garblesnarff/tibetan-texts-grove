import { Action, ToastState } from "@/types/toast";
import { TOAST_REMOVE_DELAY } from "@/constants/toast";
import { dispatch } from "@/hooks/use-toast";

/**
 * Map to store toast timeout IDs
 */
export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Adds a toast to the removal queue
 * @param toastId - ID of the toast to be removed
 * @param delay - Delay in milliseconds before removal
 */
export const addToRemoveQueue = (toastId: string, delay: number = TOAST_REMOVE_DELAY) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, delay);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Reducer function for managing toast state
 * @param state - Current toast state
 * @param action - Action to be performed
 * @returns Updated toast state
 */
export const reducer = (state: ToastState, action: Action): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId, TOAST_REMOVE_DELAY);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id, TOAST_REMOVE_DELAY);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};