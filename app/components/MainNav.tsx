import { FunctionComponent, useCallback } from "react";
import { NavPage, useNav } from "../contexts/navContext";
import { SourcesPage } from "./SourcesPage";
import { BoardsPage } from "./BoardsPage";
import { BoardPage } from "./BoardPage";
import { Button, StyleSheet, View } from "react-native";

export const MainNav: FunctionComponent = () => {
  const { state: { page }, canGoBack, goBack } = useNav();

  const handleGoBack = useCallback(() => {
    if (!canGoBack) {
      return;
    }

    goBack();
  }, [goBack, canGoBack]);

  return <>
    <View style={styles.page}>
      {page === NavPage.Sources && <SourcesPage />}
      {page === NavPage.Boards && <BoardsPage />}
      {page === NavPage.Board && <BoardPage />}
    </View>
    {canGoBack && <Button onPress={handleGoBack} title="Back" />}
  </>
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  }
});