// src/components/index.ts
// Common Components
export { default as Button } from './common/Button';
export { default as Header } from './common/Header';

// Reading Components
export { default as ProgressBar } from './reading/ProgressBar';
export { default as TextDisplay } from './reading/TextDisplay';

// Component Types
export interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface HeaderProps {
  title: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  onBack?: () => void;
}

export interface ProgressBarProps {
  progress: number;
  total: number;
  showPercentage?: boolean;
  color?: string;
}

export interface TextDisplayProps {
  text: string;
  fontSize: number;
  lineHeight?: number;
  fontFamily?: string;
  color?: string;
}
