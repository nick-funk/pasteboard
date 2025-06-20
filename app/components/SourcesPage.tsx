import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { NavPage, useNav } from "../contexts/navContext";
import { loadCurrentSource, Source, useSource } from "../contexts/sourceContext";
import { getSources, storeSources, storeValue } from "../storage";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface SourceButtonProps {
  source: Source;
  onPress: (source: Source) => void;
  onDelete: (source: Source) => void;
}

const actionsWidth = 100;
const rightActionStyles = StyleSheet.create({
  rightAction: {
    width: actionsWidth,
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    backgroundColor: "red",
    fontSize: 8,
  }
});

export const SourceButton: FunctionComponent<SourceButtonProps> =
  ({ source, onPress, onDelete }) => {
    const handleOnPress = useCallback(() => {
      onPress(source);
    }, [source, onPress]);

    const handleOnDelete = useCallback(() => {
      onDelete(source);
    }, [source, onDelete]);

    const RightAction = useCallback(
      (prog: SharedValue<number>, drag: SharedValue<number>) => {
        const styleAnimation = useAnimatedStyle(() => {
          return {
            transform: [{ translateX: drag.value + actionsWidth }],
          };
        });

        return (
          <Reanimated.View style={styleAnimation}>
            <View style={rightActionStyles.rightAction}>
              <Button color="white" title="Delete" onPress={handleOnDelete} />
            </View>
          </Reanimated.View>
        );
      }, [handleOnDelete]);

    return (
      <Swipeable renderRightActions={RightAction}>
        <View style={buttonStyles.sourceButton}>
          <Button
            color={buttonStyles.sourceButton.color}
            title={source.name}
            onPress={handleOnPress}
          />
        </View>
      </Swipeable>
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

  const handleOnDelete = useCallback((source: Source) => {
    const newSources = sources.filter((s) => s.id !== source.id);
    storeSources(newSources);
    setSources(newSources);
  }, [storeSources, setSources]);

  return <GestureHandlerRootView>
    <View>
      <Text style={styles.title}>Sources</Text>
      <FlatList
        style={styles.list}
        data={sources}
        renderItem={(info) => {
          return <SourceButton
            source={info.item}
            onPress={handleOnPress}
            onDelete={handleOnDelete}
          />
        }}
      />
      <Button title="Add new source" onPress={handlOnAddNew} />
    </View>
  </GestureHandlerRootView>
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  list: {
    padding: 8
  }
})