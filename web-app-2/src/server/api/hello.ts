export const helloGraph = () => {
  const root = {
    hello: () => {
      return {
        message: "hiya"
      };
    }
  };

  return root;
}