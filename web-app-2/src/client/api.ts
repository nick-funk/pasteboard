export const req = async (query: string, variables: any = {}) => {
  const response = await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables,
    })
  });

  const json = await response.json();

  if (!json.data) {
    return null;
  }

  return json.data;
};