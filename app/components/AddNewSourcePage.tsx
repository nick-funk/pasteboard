import { FunctionComponent, useCallback, useState } from "react";
import { TextInput, Text, View, NativeSyntheticEvent, TextInputChangeEventData, Button, StyleSheet } from "react-native";
import { Source } from "../contexts/sourceContext";
import { storeNewSource } from "../storage";
import { NavPage, useNav } from "../contexts/navContext";

export const AddNewSourcePage: FunctionComponent = () => {
  const { goBack, canGoBack, setNavState } = useNav();

  const [name, setName] = useState<string>("");
  const [url, setURL] = useState<string>("");

  const onChangeName = useCallback((
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setName(e.nativeEvent.text);
  }, [setName]);

  const onChangeURL = useCallback((
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setURL(e.nativeEvent.text);
  }, [setURL]);

  const onSave = useCallback(async () => {
    const newSource: Source = {
      id: name,
      name,
      url,
    };

    await storeNewSource(newSource);

    if (canGoBack) {
      goBack();
    } else {
      setNavState(NavPage.Sources, {}, true);
    }
  }, [name, url]);
  
  return <View style={styles.root}>
    <Text>Name</Text>
    <TextInput 
      style={styles.textInput} 
      onChange={onChangeName}
      spellCheck={false}
      keyboardType={"default"}
      textContentType={"none"}
    />
    <Text>URL</Text>
    <TextInput
      style={styles.textInput}
      onChange={onChangeURL}
      spellCheck={false}
      keyboardType={"url"}
      textContentType={"URL"}
    />
    <Button title="Save" onPress={onSave} />
  </View>
}

const styles = StyleSheet.create({
  root: {
    minHeight: 300,
  },
  textInput: {
    borderRadius: 3,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 8,
    margin: 8,
  }
});