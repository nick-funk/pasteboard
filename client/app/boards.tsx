import { Text, View } from "react-native";
import Link from "expo-router/link";

export default function BoardsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Boards</Text>
      <Link href="/">Home</Link>
    </View>
  );
}
