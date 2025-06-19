import AsyncStorage from "@react-native-async-storage/async-storage";

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