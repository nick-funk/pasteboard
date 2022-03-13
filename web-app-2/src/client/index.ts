import { req } from "./api";

document.addEventListener("DOMContentLoaded", async () => {
  const data = await req(
    `
      query HelloQuery {
        hello {
          message
        }
      }
    `,
  );
  
  console.log(data);

}, false);