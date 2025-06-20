import AsyncStorage from "@react-native-async-storage/async-storage";
import { Source } from "./contexts/sourceContext";

export const storeValue = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log("async storage store error", e);
  }
}

export const loadValue = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.log("async storage load error", e);
  }
}

export const clearValue = async (key: string) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log("async storage clear error", e);
  }
}

export const CurrentSourceKey = "currentSource";
export const SourcesKey = "sources";

interface PersistedSources {
  sources: Source[];
}

export const storeSources = async (sources: Source[]) => {
  await storeValue(SourcesKey, JSON.stringify({
    sources
  }));

  return await getSources();
}

export const getSources = async () => {
  const rawValue = await loadValue(SourcesKey);
  if (!rawValue) {
    return [];
  }

  const json = JSON.parse(rawValue) as PersistedSources;
  if (!json || !json.sources) {
    return [];
  }

  return json.sources;
}

export const storeNewSource = async (source: Source): Promise<Source[]> => {
  const sources = await getSources();

  await storeValue(SourcesKey, JSON.stringify({
    sources: [...sources, source]
  }));

  return await getSources();
}
