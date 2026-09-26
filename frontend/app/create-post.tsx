import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Aqui você salvaria os dados no estado global, context ou API
    console.log("Post salvo:", { title, description });
    
    // Volta para a tela anterior (Lobby)
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nova Dúvida</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Título (ex: Erro no Expo)" 
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Descreva o problema com detalhes..." 
        multiline
        numberOfLines={6}
        value={description}
        onChangeText={setDescription}
        textAlignVertical="top"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e4e4e7' },
  textArea: { minHeight: 120 },
  button: { backgroundColor: '#9d0c0c', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});