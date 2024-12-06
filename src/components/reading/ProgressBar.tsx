import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressBar as PaperProgressBar } from 'react-native-paper';
import { theme } from '../../theme';

interface ProgressBarProps {
  progress: number;
  total: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  color = theme.colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <PaperProgressBar
        progress={progress / total}
        color={color}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default ProgressBar;
