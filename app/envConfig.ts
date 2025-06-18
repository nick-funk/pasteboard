export class EnvConfig {
  public readonly serverURL: string;
  public readonly apiURL: string;

  private static _instance: EnvConfig;

  private constructor() {
    this.serverURL = process.env.EXPO_PUBLIC_SERVER_URL ?? "http://localhost:3000";
    this.apiURL = new URL("/api", this.serverURL).toString();
  }

  public static instance(): EnvConfig {
    if (!EnvConfig._instance) {
      EnvConfig._instance = new EnvConfig();
    }

    return EnvConfig._instance;
  }
}