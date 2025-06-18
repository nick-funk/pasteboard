import { FunctionComponent, useCallback } from "react";
import { View, Button } from "react-native";

interface Props {
  id: string;
  name: string;
  onPress?: (id: string) => void;
}

export const BoardButton: FunctionComponent<Props> = ({ id, name, onPress }) => {
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