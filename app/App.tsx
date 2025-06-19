import { StyleSheet, View, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavContextProvider, NavPage } from "./contexts/navContext";
import { MainNav } from "./components/MainNav";

export default function App() {
  return (
    <View style={styles.root}>
      <NavContextProvider initialValue={{ page: NavPage.Boards, params: {} }}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <MainNav />
          </SafeAreaView>
        </SafeAreaProvider>
      </NavContextProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "lightgrey",
    marginTop: StatusBar.currentHeight || 0,
  },
  container: {
    flex: 1,
  },
});
