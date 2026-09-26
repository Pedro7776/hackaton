// app/_layout.tsx
import { Stack, router, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/auth'; // Importa lá da pasta que criamos

// Esse componente faz a lógica da navegação
function RootLayoutNav() {
  const { isLogged } = useAuth(); // Escuta se tá logado
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login';

    if (!isLogged && !inAuthGroup) {
      router.replace('/login'); // Se não tá logado, chuta pro login
    } else if (isLogged && inAuthGroup) {
      router.replace('/'); // Se tá logado, manda pro feed
    }
  }, [isLogged, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Lobby Fatec' }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="create-post" options={{ title: 'Nova Dúvida', presentation: 'modal' }} />
    </Stack>
  );
}

// O componente principal que exporta tudo enrolado no Provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}