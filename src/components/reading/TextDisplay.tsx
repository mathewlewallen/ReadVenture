import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

interface TextDisplayProps {
  text: string;
  highlightedWord?: string;
  fontSize?: number;
  onWordPress?: (word: string) => void;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  highlightedWord,
  fontSize = 20,
  onWordPress,
}) => {
  const words = text.split(' ');

  return (
    <View style={styles.container}>
      {words.map((word, index) => (
        <Text
          key={`${word}-${index}`}
          style={[
            styles.word,
            { fontSize },
            word === highlightedWord && styles.highlighted,
          ]}
          onPress={() => onWordPress?.(word)}
        >
          {word}{' '}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  word: {
    color: theme.colors.text,
    marginRight: 4,
  },
  highlighted: {
    backgroundColor: 'yellow',
    fontWeight: 'bold',
  },
});

export default TextDisplay;
