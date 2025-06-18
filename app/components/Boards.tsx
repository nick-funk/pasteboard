import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";

import { EnvConfig } from "../envConfig";
import { BoardButton } from "./BoardButton";

interface Board {
  id: string;
  name: string;
}

interface GetBoardsResponse {
  boards: Board[];
}

interface Props {
  onSelectBoard: (id: string) => void;
}

export const Boards: FunctionComponent<Props> = ({ onSelectBoard }) => {
  const [boards, setBoards] = useState<Board[]>([]);

  const loadBoards = useCallback(async () => {
    const config = EnvConfig.instance();
    const url = new URL("/boards", config.apiURL);
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
  }, [setBoards]);

  useEffect(() => {
    void loadBoards();
  }, [loadBoards]);

  const handleSelectBoard = useCallback((id: string) => {
    onSelectBoard(id);
  }, [onSelectBoard]);

  return <View>
    <Text>Boards</Text>
    {boards.map((b) => <View key={b.id}>
      <BoardButton id={b.id} name={b.name} onPress={handleSelectBoard} />
    </View>)}
  </View>
}