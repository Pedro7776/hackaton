// app/login.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/auth'; // <-- Puxa o nosso gancho!

export default function LoginScreen() {
  const { login } = useAuth(); // <-- Pega a função de login

  const handleLogin = () => {
    login(); // <-- Só chamar isso! O _layout vai ouvir e mudar de tela sozinho.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login QG.F</Text>
      
      <TextInput style={styles.input} placeholder="E-mail Fatec" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f5' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e4e4e7' },
  button: { backgroundColor: '#006FEE', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});