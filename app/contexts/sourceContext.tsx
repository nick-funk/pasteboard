import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useState } from "react";

export interface Source {
  id: string;
  name: string;
  url: string;
}

export interface SourceContextData {
  source: Source;
  setSource: (source: Source) => void;
}

const emptySource: Source = {
  id: "empty",
  name: "",
  url: "",
}

const SourceContext = createContext<SourceContextData>({ source: emptySource, setSource: () => {} });

interface SourceContextProviderProps {
  initialValue?: Source;
  children?: ReactNode;
}

export const SourceContextProvider: FunctionComponent<SourceContextProviderProps> =
  ({ initialValue, children }) => {
    const [source, setSource] = useState<Source>(initialValue ?? emptySource);

    const handleSetSource = useCallback((source: Source) => {
      setSource(source);
    }, [setSource]);

    return <SourceContext.Provider value={{ source, setSource: handleSetSource }}>
      {children}
    </SourceContext.Provider>
  };

export const useSource = () => {
  const data = useContext(SourceContext);
  if (!data) {
    throw new Error("source context not found, is this component a child of a `SourceContextProvider`?");
  }

  return data;
}