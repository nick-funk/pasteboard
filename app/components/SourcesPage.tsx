import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import { NavPage, useNav } from "../contexts/navContext";
import { loadCurrentSource, Source, useSource } from "../contexts/sourceContext";

interface SourceButtonProps {
  source: Source;
  onPress: (source: Source) => void;
}

export const SourceButton: FunctionComponent<SourceButtonProps> = ({ source, onPress }) => {
  const handleOnPress = useCallback(() => {
    onPress(source);
  }, [source, onPress]);

  return <Button title={source.name} onPress={handleOnPress} />
}

export const SourcesPage: FunctionComponent = () => {
  const { setNavState } = useNav();
  const { setSource } = useSource();

  const [sources, setSources] = useState<Source[]>([]);

  const loadSources = useCallback(async () => {
    const previousSource = await loadCurrentSource();
    if (previousSource) {
      setSource(previousSource);
      setNavState(NavPage.Boards, {}, true);
      return;
    }

    setSources([
      {
        id: "localhost",
        name: "localhost",
        url: "http://localhost:3000",
      }
    ])
  }, [setSources, setSource, setNavState]);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const handleOnPress = useCallback((source: Source) => {
    setSource(source);
    setNavState(NavPage.Boards, {}, true);
  }, [setNavState]);

  return <View>
    <Text>Sources</Text>
    <FlatList
      data={sources}
      renderItem={(info) => {
        return <SourceButton onPress={handleOnPress} source={info.item} />
      }}
    />
  </View>
}