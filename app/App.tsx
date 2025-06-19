import { Button, StyleSheet, View, StatusBar } from "react-native";
import { BoardsPage } from "./components/BoardsPage";
import { useCallback, useState } from "react";
import { BoardPage } from "./components/BoardPage";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  const handleSelectBoard = useCallback((id: string) => {
    setSelectedBoard(id);
  }, [setSelectedBoard]);

  const handleGoBack = useCallback(() => {
    setSelectedBoard(null);
  }, [setSelectedBoard]);

  return (
    <View style={styles.root}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {selectedBoard === null && <BoardsPage onSelectBoard={handleSelectBoard} />}
            {selectedBoard && <>
              <BoardPage id={selectedBoard} />
            </>}
          </View>
          <View style={styles.bottomBar}>
            {selectedBoard && <Button color={styles.backButton.color} onPress={handleGoBack} title="Back" />}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
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
  content: {
    flexGrow: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  bottomBar: {
    height: 35,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 16,
  },
  backButton: {
    color: "black",
  }
});
