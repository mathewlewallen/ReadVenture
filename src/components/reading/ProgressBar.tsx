/*
Generate a complete implementation for this file that:
1. Follows the project's React Native / TypeScript patterns
2. Uses proper imports and type definitions
3. Implements error handling and loading states
4. Includes JSDoc documentation
5. Follows project ESLint/Prettier rules
6. Integrates with existing app architecture
7. Includes proper testing considerations
8. Uses project's defined components and utilities
9. Handles proper memory management/cleanup
10. Follows accessibility guidelines

File requirements:
- Must integrate with Redux store
- Must use React hooks appropriately
- Must handle mobile-specific considerations
- Must maintain type safety
- Must have proper error boundaries
- Must follow project folder structure
- Must use existing shared components
- Must handle navigation properly
- Must scale well as app grows
- Must follow security best practices
*/
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
