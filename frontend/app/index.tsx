import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function LobbyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lobby Fatec 🚀</Text>

      {/* Card da Pergunta feito do zero (estilo HeroUI) */}
      <View style={styles.card}>
        {/* Header do Card */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' }} 
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>João Silva (Ads - 3º Semestre)</Text>
            <Text style={styles.timeAgo}>Há 10 minutos</Text>
          </View>
        </View>
        
        {/* Corpo do Card */}
        <View style={styles.body}>
          <Text style={styles.questionTitle}>Erro de compilação no Expo</Text>
          <Text style={styles.questionText}>
            Alguém sabe como resolver o erro "EACCES: permission denied" 
            quando tento rodar o app no Mac?
          </Text>
        </View>
        
        {/* Footer do Card com Botões */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>💡 3 Respostas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FAB - Botão Flutuante de Nova Pergunta */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}
        onPress={() => router.push('/create-post')}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f4f4f5' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#11181C' 
  },
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 14, 
    padding: 16, 
    marginBottom: 16,
    // Sombra suave estilo HeroUI
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20 
  },
  userInfo: { 
    marginLeft: 12 
  },
  userName: { 
    fontWeight: 'bold', 
    fontSize: 14, 
    color: '#11181C' 
  },
  timeAgo: { 
    fontSize: 12, 
    color: '#71717A' 
  },
  body: { 
    marginBottom: 16 
  },
  questionTitle: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    color: '#11181C', 
    marginBottom: 6 
  },
  questionText: { 
    fontSize: 15, 
    color: '#3F3F46', 
    lineHeight: 22 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  primaryButton: { 
    backgroundColor: '#006FEE', 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 8 
  },
  primaryButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  secondaryButton: { 
    backgroundColor: '#F4F4F5', 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 8 
  },
  secondaryButtonText: { 
    color: '#71717A', 
    fontWeight: 'bold' 
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#006FEE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#006FEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -2 // Ajuste fino pro "+" ficar centralizado
  }
});