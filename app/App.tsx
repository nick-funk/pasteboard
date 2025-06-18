import { Button, StyleSheet, View } from 'react-native';
import { Boards } from './components/Boards';
import { useCallback, useState } from 'react';
import { BoardPage } from './components/BoardPage';

export default function App() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  const handleSelectBoard = useCallback((id: string) => {
    setSelectedBoard(id);
  }, [setSelectedBoard]);

  const handleGoBack = useCallback(() => {
    setSelectedBoard(null);
  }, [setSelectedBoard]);

  return (
    <View style={styles.container}>
      {selectedBoard && <Button onPress={handleGoBack} title="Back" />}
      {selectedBoard === null && <Boards onSelectBoard={handleSelectBoard} />}
      {selectedBoard && <>
        <BoardPage id={selectedBoard} />
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
