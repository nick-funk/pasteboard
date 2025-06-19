import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export enum NavPage {
  Sources = "Sources",
  Boards = "Boards",
  Board = "Board",
};

export interface NavParams {
  Sources?: {},
  Boards?: {},
  Board?: {
    id: string;
  }
}

export interface NavState {
  page: NavPage;
  params: NavParams;
}

const defaultNavState = { page: NavPage.Sources, params: {} };

export interface NavContextData {
  state: NavState;
  setNavState: (page: NavPage, params: NavParams) => void;
  canGoBack?: boolean;
  goBack: () => void;
}

const NavContext =
  createContext<NavContextData>({
    state: { ...defaultNavState },
    setNavState: () => { },
    goBack: () => { }
  });

interface InitialNavStateParams {
  page: NavPage;
  params: NavParams;
}

interface NavContextProviderProps {
  children?: ReactNode;
  initialValue?: InitialNavStateParams;
}

export const NavContextProvider: FunctionComponent<NavContextProviderProps> =
  ({ children, initialValue }) => {
    const [state, setState] = useState<NavState>(initialValue ?? defaultNavState);
    const [stateStack, setStateStack] = useState<NavState[]>([state]);
    const [canGoBack, setCanGoBack] = useState<boolean>(false);

    const handleSetState = useCallback((page: NavPage, params?: NavParams) => {
      const effectiveParams = params ?? defaultNavState.params;
      const newState = { page, params: effectiveParams };

      setState(newState);
      setStateStack((value) => [newState, ...value]);
    }, [setState, setStateStack]);

    const handleGoBack = useCallback(() => {
      if (stateStack.length <= 1) {
        return;
      }

      const newState = stateStack[1];
      const newStack = stateStack.slice(1, stateStack.length);

      setState(newState);
      setStateStack(newStack);
    }, [stateStack, setStateStack, setState]);

    useEffect(() => {
      setCanGoBack(stateStack.length > 1);
    }, [stateStack, setCanGoBack]);

    return (
      <NavContext.Provider
        value={
          { state, setNavState: handleSetState, goBack: handleGoBack, canGoBack }
        }>
        {children}
      </NavContext.Provider>
    );
  }

export const useNav = () => {
  const data = useContext(NavContext);
  if (!data) {
    throw new Error("nav context not found, is this component a child of a `NavContextProvider`?");
  }

  return data;
}