import { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useSecureCard } from 'react-native-yape-card-secure-view';

export default function App() {
  const { openCard, closeCard, isOpen, isRendering, error } = useSecureCard();
  const [logs, setLogs] = useState<string>('');

  const handleOpenSecureView = async () => {
    setLogs('Solicitando apertura...');
    await openCard('card_001', 'token_simulado_123');
    setLogs('Comando enviado al módulo nativo.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard (Mock)</Text>

      <Button title="Ver datos sensibles" onPress={handleOpenSecureView} />

      <View style={styles.statusBox}>
        <Text>Estado: {isOpen ? 'ABIERTO' : 'CERRADO'}</Text>
        <Text>Cargando datos: {isRendering ? 'SÍ' : 'NO'}</Text>
        {error && <Text style={styles.error}>Error: {error.message}</Text>}
      </View>

      <Text style={styles.logs}>{logs}</Text>

      {isOpen && (
        <Button
          title="Cerrar Vista Manualmente"
          onPress={closeCard}
          color="red"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  logs: {
    marginTop: 20,
    color: 'gray',
    fontStyle: 'italic',
  },
});
