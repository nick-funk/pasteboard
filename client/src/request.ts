import { Config } from "./config";

export const makeApiRequest = async (url: string, init?: RequestInit) => {
  const serverUrl = Config.serverUrl;
  const formattedUrl =
    serverUrl !== "/" ? new URL(url, Config.serverUrl).toString() : url;
  
  const response = await fetch(formattedUrl, {
    ...init,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    }
  });

  return response;
};
