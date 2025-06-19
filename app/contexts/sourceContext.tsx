import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { loadValue, storeValue } from "../storage";

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
  children?: ReactNode;
}

export const loadCurrentSource = async () => {
  const value = await loadValue("currentSource");
  if (!value) {
    return null;
  }


  const loadedSource = JSON.parse(value) as Source;
  return loadedSource
}

export const SourceContextProvider: FunctionComponent<SourceContextProviderProps> =
  ({ children }) => {
    const [source, setSource] = useState<Source>(emptySource);

    const handleSetSource = useCallback((source: Source) => {
      setSource(source);
      storeValue("currentSource", JSON.stringify(source));
    }, [setSource, storeValue]);

    const loadSource = useCallback(async () => {
      const loadedSource = await loadCurrentSource();
      if (!loadedSource) {
        return;
      }

      setSource(loadedSource);
    }, [loadValue, setSource]);

    useEffect(() => {
      void loadSource();
    }, [loadSource]);

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