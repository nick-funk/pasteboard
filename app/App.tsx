import { StyleSheet, View, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavContextProvider } from "./contexts/navContext";
import { MainNav } from "./components/MainNav";
import { SourceContextProvider } from "./contexts/sourceContext";

export default function App() {
  return (
    <View style={styles.root}>
      <NavContextProvider>
        <SourceContextProvider>
          <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
              <MainNav />
            </SafeAreaView>
          </SafeAreaProvider>
        </SourceContextProvider>
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
