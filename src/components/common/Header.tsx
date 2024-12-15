/**
 * Header Component
 *
 * Reusable app header component that provides navigation controls,
 * title display, and optional action buttons. Integrates with the app's
 * navigation system and maintains accessibility standards.
 *
 * @packageDocumentation
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';

import { toggleSettings } from '@/store/slices/settingsSlice';
import theme from '@/theme/theme';
import type { RootState } from '@/types/RootState';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface HeaderProps {
  /** Title to display in the header */
  title: string;
  /** Whether to show back button */
  showBack?: boolean;
  /** Whether to show settings button */
  showSettings?: boolean;
  /** Optional right-aligned action button */
  actionButton?: {
    icon: string;
    onPress: () => void;
    accessibilityLabel: string;
  };
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showSettings = false,
  actionButton,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.app.isLoading);

  /**
   * Handles navigation back
   */
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  /**
   * Handles settings navigation
   */
  const handleSettings = useCallback(() => {
    dispatch(toggleSettings());
    navigation.navigate('Settings');
  }, [dispatch, navigation]);

  return (
    <ErrorBoundary>
      <Appbar.Header style={styles.header}>
        {showBack && (
          <Appbar.BackAction
            onPress={handleBack}
            accessibilityLabel="Go back"
            testID="header-back-button"
          />
        )}

        <Appbar.Content
          title={title}
          titleStyle={styles.title}
          accessibilityRole="header"
          testID="header-title"
        />

        {!isLoading && actionButton && (
          <Appbar.Action
            icon={() => (
              <MaterialIcons
                name={actionButton.icon}
                size={24}
                color={theme.colors.text}
              />
            )}
            onPress={actionButton.onPress}
            accessibilityLabel={actionButton.accessibilityLabel}
            testID="header-action-button"
          />
        )}

        {showSettings && (
          <Appbar.Action
            icon="settings"
            onPress={handleSettings}
            accessibilityLabel="Open settings"
            testID="header-settings-button"
          />
        )}
      </Appbar.Header>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontSize: 20,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontWeight: 'bold',
      },
    }),
  },
});

export default Header;
