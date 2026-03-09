import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Product Details Screen */}
        <Stack.Screen
          name="product-details/[id]"
          options={{
            title: 'Product',
            headerShown: true,
            presentation: 'card',
          }}
        />
        {/* Brand Profile Screen */}
        <Stack.Screen
          name="brand-profile/[id]"
          options={{
            title: 'Brand',
            headerShown: true,
            presentation: 'card',
          }}
        />
        {/* Review Post Modal */}
        <Stack.Screen
          name="review-post"
          options={{
            title: 'Create Review',
            presentation: 'modal',
            headerShown: true,
          }}
        />
        {/* Legacy Modal */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
