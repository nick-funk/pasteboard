import App from "./app";
import EnvironmentVariables from "./environmentVariables";

const run = async () => {
    const env = new EnvironmentVariables();
    const app = new App(env);
    await app.run();
};

void run();