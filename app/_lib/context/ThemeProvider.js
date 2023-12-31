'use client';

// chakra-ui
import { ChakraProvider } from '@chakra-ui/react';

// local
import { theme } from '../styles/theme';

export function ThemeProvider({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
