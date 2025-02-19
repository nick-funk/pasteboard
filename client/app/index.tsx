import { Text, View } from "react-native";
import Link from "expo-router/link";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/boards">Boards</Link>
      <Text>Home</Text>
    </View>
  );
}
