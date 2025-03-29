"use client";

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

/**
 * Constant defining the maximum number of toasts to be displayed at once.
 */
const TOAST_LIMIT = 1;

/**
 * Constant defining the delay (in milliseconds) before a toast is removed from the state.
 */
const TOAST_REMOVE_DELAY = 1000000;

/**
 * Type representing a toast in the toaster.
 *
 * Combines the standard ToastProps with additional fields such as id, title,
 * description, and an optional action element.
 *
 * @typedef {Object} ToasterToast
 * @property {string} id - Unique identifier for the toast.
 * @property {React.ReactNode} [title] - Optional title of the toast.
 * @property {React.ReactNode} [description] - Optional description of the toast.
 * @property {ToastActionElement} [action] - Optional action element for the toast.
 */
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

/**
 * Enum-like object for toast action types.
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
} as const;

let count = 0;

/**
 * Generates a unique id for a toast.
 *
 * @returns {string} A unique id as a string.
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

/**
 * Union type for all possible actions for the toast reducer.
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

/**
 * State type for the toaster, consisting of an array of toasts.
 */
interface State {
  toasts: ToasterToast[];
}

/**
 * A map to hold timeout handles for toast removal delays.
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Adds a toast to the removal queue, setting a timeout after which the toast will be removed.
 *
 * @param {string} toastId - The id of the toast to remove.
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Reducer function to manage the state of the toasts.
 *
 * Handles adding, updating, dismissing, and removing toasts.
 *
 * @param {State} state - The current state.
 * @param {Action} action - The action to perform.
 * @returns {State} The new state after applying the action.
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        // Add the new toast and ensure we don't exceed the TOAST_LIMIT.
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        // Update the toast matching the id with new properties.
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;
      // Side-effect: Queue to remove toast after delay.
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }
      return {
        ...state,
        // Mark toasts as closed.
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false
              }
            : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        // Filter out the toast with the matching id.
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};

/**
 * Listeners array to notify subscribers when the state changes.
 */
const listeners: Array<(state: State) => void> = [];

/**
 * In-memory state for the toasts.
 */
let memoryState: State = { toasts: [] };

/**
 * Dispatches an action to update the in-memory state and notifies all listeners.
 *
 * @param {Action} action - The action to dispatch.
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

/**
 * Creates a new toast.
 *
 * Accepts toast properties, generates a unique id, and dispatches an ADD_TOAST action.
 * Returns an object containing the toast id along with functions to update or dismiss the toast.
 *
 * @param {Toast} props - The properties for the new toast (without id).
 * @returns {object} An object with the toast id, and functions to dismiss or update the toast.
 */
function toast({ ...props }: Toast) {
  const id = genId();

  /**
   * Updates the toast with new properties.
   *
   * @param {ToasterToast} props - The new properties to merge into the toast.
   */
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id }
    });

  /**
   * Dismisses the toast.
   */
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Dispatch the action to add the toast with an open state.
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });

  return {
    id: id,
    dismiss,
    update
  };
}

/**
 * Custom hook to manage and access toast state.
 *
 * Subscribes to changes in the toast state and returns the current state along with
 * helper functions to create and dismiss toasts.
 *
 * @returns {object} An object containing the current toast state, the toast function, and a dismiss function.
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

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
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}

export { useToast, toast };
