# react-native-yape-card-secure-view

Librería para validar tokens y mostrar data sensible de tarjetas.

## Características de Seguridad

- **Android:** Implementa `FLAG_SECURE` directamente en la ventana nativa para bloquear screenshots y grabaciones de pantalla.
- **iOS:** Aplica capas de protección y vistas seguras de UI.
- **Control de Sesión (Timeout):** Cierre automático por inactividad configurable (por defecto 30 segundos).
- **Gestión de Ciclo de Vida:** Destrucción automática de estados y limpieza de memoria al pasar a segundo plano (_Background_).

### Autenticación local

Crea un archivo llamado `.npmrc` en la raíz con el siguiente contenido:

```bash
//registry.npmjs.org/:_authToken=TU_ACCESS_TOKEN
```

## Instalación

Instala la librería localmente desde la ruta de tu proyecto:

```bash
yarn add file:../path-to-library/react-native-yape-card-secure-view
```

o mediante yarn

```bash
yarn add react-native-yape-card-secure-view
```

## Usage

```js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSecureCard } from 'react-native-yape-card-secure-view';

export const SecureCardScreen = () => {
  const { openCard, closeCard, isRendering, isOpen, error } = useSecureCard();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Error de Seguridad', error.message, [{ text: 'Entendido' }]);
      setIsLoading(false);
    }
  }, [error]);

  const handleToggleSecureView = async () => {
    if (isOpen) {
      closeCard();
      return;
    }

    setIsLoading(true);
    try {
      const secureToken = 'sk_test_secure_token_abc123';
      const cardId = 'card_001';

      await openCard(cardId, secureToken);
    } catch (err) {
      Alert.alert('Error', 'No se pudo procesar la solicitud de seguridad');
    } finally {
      setIsLoading(false);
    }
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
};
```

#### API Reference

#### `useSecureCard()`

- **`openCard(cardId: string, secureToken: string): Promise<void>`**  
  Envía el identificador de tarjeta y el token de autorización al módulo nativo para desplegar la capa de seguridad y activar los bloqueos del sistema operativo.

- **`closeCard(): void`**  
  Cierra la sesión segura de forma manual, desactivando los mecanismos nativos y limpiando los estados.

- **`isOpen: boolean`**  
  Indica si la capa de visualización protegida se encuentra activa actualmente.

- **`isRendering: boolean`**  
  Bandera transitoria que indica si el componente nativo está terminando de procesar el renderizado en pantalla.

- **`error: { code: string; message: string } | null`**  
  Objeto que captura errores de validación emitidos por el bridge.

## License

Juan Alberto Espinoza Verano

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
