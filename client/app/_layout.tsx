import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.screen name="index" options={{ title: "Home" }} />
      <Stack.screen name="boards" options={{ title: "Boards" }} />
    </Stack>
  );
}
