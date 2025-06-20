import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { NavPage, useNav } from "../contexts/navContext";
import { loadCurrentSource, Source, useSource } from "../contexts/sourceContext";
import { getSources } from "../storage";

interface SourceButtonProps {
  source: Source;
  onPress: (source: Source) => void;
}

export const SourceButton: FunctionComponent<SourceButtonProps> = ({ source, onPress }) => {
  const handleOnPress = useCallback(() => {
    onPress(source);
  }, [source, onPress]);

  return (
    <View style={buttonStyles.sourceButton}>
      <Button color={buttonStyles.sourceButton.color} title={source.name} onPress={handleOnPress} />
    </View>
  );
}

const buttonStyles = StyleSheet.create({
  sourceButton: {
    backgroundColor: "lightgrey",
    color: "black",
    borderRadius: 4,
    padding: 8,
  }
});

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

    setSources(await getSources());
  }, [setSources, setSource, setNavState]);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const handleOnPress = useCallback((source: Source) => {
    setSource(source);
    setNavState(NavPage.Boards, {}, true);
  }, [setNavState]);

  const handlOnAddNew = useCallback(() => {
    setNavState(NavPage.AddNewSource, {});
  }, []);

  return <View>
    <Text>Sources</Text>
    <FlatList
      data={sources}
      renderItem={(info) => {
        return <SourceButton onPress={handleOnPress} source={info.item} />
      }}
    />
    <Button title="Add new source" onPress={handlOnAddNew} />
  </View>
}