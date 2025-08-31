import * as React from 'react';
import { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

type Action = typeof actionTypes[keyof typeof actionTypes];

type State = {
  toasts: ToasterToast[];
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type ReducerAction = {
  type: ActionType['ADD_TOAST'];
  toast: ToasterToast;
} | {
  type: ActionType['UPDATE_TOAST'];
  toast: Partial<ToasterToast>;
} | {
  type: ActionType['DISMISS_TOAST'];
  toastId?: string;
} | {
  type: ActionType['REMOVE_TOAST'];
  toastId?: string;
};

const reducer = (state: State, action: ReducerAction): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST:
      const { toastId } = action;

      // ! Side effects ! - This is not typical in a reducer, but we need to remove the toast from the DOM after it's dismissed.
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        };
      } else {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({ ...t, open: false })),
        };
      }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

const listeners: ((state: State) => void)[] = [];

let memoryState: State = { toasts: [] };

function dispatch(action: ReducerAction) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

type Toast = ({ ...props }: Omit<ToasterToast, 'id'>) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void; };

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
    toast: React.useCallback(({
      ...props
    }: Omit<ToasterToast, 'id'>) => {
      const id = genId();

      const update = (props: ToasterToast) => dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: { ...props,
          id
        }
      });
      const dismiss = () => dispatch({
        type: actionTypes.DISMISS_TOAST,
        toastId: id
      });

      dispatch({
        type: actionTypes.ADD_TOAST,
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
    }, []),
  };
}

export { useToast, reducer as toastReducer };