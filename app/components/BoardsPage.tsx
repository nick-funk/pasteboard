import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { NavPage, useNav } from "../contexts/navContext";
import { useSource } from "../contexts/sourceContext";
import { clearValue, CurrentSourceKey, storeValue } from "../storage";

interface Board {
  id: string;
  name: string;
}

interface GetBoardsResponse {
  boards: Board[];
}

interface BoartButtonProps {
  id: string;
  name: string;
  onPress?: (id: string) => void;
}

export const BoardButton: FunctionComponent<BoartButtonProps> = ({ id, name, onPress }) => {
  const handlePress = useCallback(() => {
    if (!onPress) {
      return;
    }

    onPress(id);
  }, [id, onPress]);

  return <View>
    <Button onPress={handlePress} title={name} />
  </View>
}

export const BoardsPage: FunctionComponent = () => {
  const { setNavState } = useNav();
  const { source } = useSource();

  const [boards, setBoards] = useState<Board[]>([]);

  const loadBoards = useCallback(async () => {
    if (!source) {
      return;
    }

    const url = new URL("/boards", source.url);
    const response = await fetch(
      url.toString()
    );

    if (!response.ok) {
      return;
    }

    const json = await response.json() as GetBoardsResponse;
    if (!json) {
      return;
    }

    setBoards(json.boards);
  }, [setBoards, source]);

  useEffect(() => {
    void loadBoards();
  }, [loadBoards]);

  const handleSelectBoard = useCallback((id: string) => {
    setNavState(NavPage.Board, { Board: { id } });
  }, [setNavState]);

  const handleViewSources = useCallback(async () => {
    await clearValue(CurrentSourceKey);
    setNavState(NavPage.Sources, {}, true);
  }, [setNavState, clearValue]);

  return <View style={styles.container}>
    <Text style={styles.title}>Boards</Text>
    <View>
      {boards.map((b) =>
        <BoardButton
          key={b.id}
          id={b.id}
          name={b.name}
          onPress={handleSelectBoard}
        />
      )}
    </View>
    <Button title="Sources" onPress={handleViewSources} />
  </View>
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 18,
  }
});