# Documentación del Proyecto WebSocket React + Node.js

## Descripción
Este proyecto implementa una comunicación en tiempo real usando WebSockets.  
El frontend está desarrollado en React y se conecta al servidor WebSocket implementado con Node.js.

---

## Tecnologías utilizadas
- **Frontend:** React.js  
- **Backend:** Node.js con la librería `ws` para WebSocket  
- **Comunicación:** Protocolo WebSocket

---

## Estructura del proyecto
```
/server
├── index.js # Servidor WebSocket en Node.js
/clienteSocket
├── src
      ├── App.tsx # Componente principal React que maneja WebSocket

```

---

## Instalación

### Backend

1. Navega a la carpeta `/server`
2. Ejecuta `npm install` para instalar dependencias
3. Inicia el servidor con `node index.js`

### Frontend

1. Navega a la carpeta `/clienteSocket`
2. Ejecuta `npm install` para instalar dependencias
3. Inicia la app React con `npm run dev`

