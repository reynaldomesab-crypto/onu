# Instalación de la App en Android

## ✅ Proyecto Android ya configurado

El proyecto Capacitor está listo y sincronizado. Android Studio ya está abierto con el proyecto del juego.

## 📱 Pasos para Ejecutar la App

### 1. En Android Studio

Una vez que Android Studio esté abierto:

1. **Seleccione un dispositivo**:
   - **Emulador**: Si tienes un emulador creado, selecciónalo en la barra superior
   - **Dispositivo real**: Conecta tu Android y selecciónalo

2. **Verifique la configuración**:
   - En la barra de herramientas, asegúrese de que el proyecto Android esté seleccionado
   - El proyecto se llama `el-arte-de-lo-posible`

3. **Ejecute la app**:
   - Presione el botón de **Play** (▶️) en la barra de herramientas
   - O presione `Shift + F10` (Windows/Linux)
   - O haga clic derecho en `app/src/main/AndroidManifest.xml` → Run 'app'

### 2. Si no tienes un emulador

**Crear un emulador nuevo**:

1. En Android Studio, ve a **Tools** → **Device Manager**
2. Haz clic en **Create Device**
3. Selecciona un dispositivo (recomendado: Pixel 6 o similar)
4. Selecciona una imagen del sistema (recomendado: Android 13 o 14)
5. Dale un nombre al emulador (ej. "ONU Game")
6. Haz clic en **Finish**

### 3. Si prefieres build APK manual

1. En Android Studio, ve a **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Espera a que termine el build
3. Se abrirá una ventana mostrando la ubicación del APK
4. Copia el APK a tu dispositivo o instálalo vía USB

## 🎯 Comandos Rápidos (Terminal)

```bash
# Navegar al proyecto
cd /home/reynaldomesab/Proyectos/ONU

# Sincronizar web con Android
npx cap sync

# Abrir en Android Studio
export CAPACITOR_ANDROID_STUDIO_PATH=/home/reynaldomesab/android-studio/bin/studio.sh
npx cap open android

# Ejecutar en emulador (si está configurado)
npx cap run android

# Build APK
npx cap build android
```

## 📋 Verificación de la App

### En Android Studio

1. Ve a **Run** → **Edit Configurations**
2. Verifica que el proyecto esté configurado como **app**
3. Verifica que el dispositivo esté seleccionado
4. Ejecuta la app

### En el Dispositivo

La app debería aparecer como:
- **Nombre**: "El Arte de lo Posible"
- **Icono**: 🌍 (bandera del mundo)

## 🔄 Actualizar la App

Si haces cambios en el código web:

```bash
cd /home/reynaldomesab/Proyectos/ONU

# 1. Actualiza el código web
pnpm build

# 2. Sincroniza con Android
npx cap sync

# 3. Reinicia la app en Android Studio (o reconstruye el APK)
```

## 🐛 Problemas Comunes

### Android Studio no se abre

```bash
# Verificar instalación
ls -la /home/reynaldomesab/android-studio/bin/studio.sh

# Abrir manualmente
/home/reynaldomesab/android-studio/bin/studio.sh
```

### Error de sincronización

```bash
# Limpiar y rehacer
rm -rf android/
npx cap add android
npx cap sync
```

### App no se ejecuta

1. Verifica que el dispositivo/emulador esté seleccionado en Android Studio
2. Revisa los logs en **Run** → **Show Run in Terminal**
3. Asegúrate de que Android Studio esté actualizado

## 📊 Estructura del Proyecto Android

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── assets/          # Archivos web (dist/)
│   │   │   │   ├── public/
│   │   │   │   └── capacitor.config.json
│   │   │   ├── java/            # Código Java nativo
│   │   │   └── res/             # Recursos de Android
│   │   └── androidTest/         # Tests de Android
│   └── build.gradle
├── capacitor-cordova-android-plugins/
└── build.gradle
```

## 🎮 Controles de la App en Android

La app funcionará igual que en el navegador:
1. Seleccione su país E10
2. Revise los eventos (Briefing)
3. Negocie con otros países
4. Redacte una resolución
5. Presente a votación
6. Verifique el resultado

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Android Studio (barra inferior)
2. Verifica la consola del navegador en Chrome DevTools
3. Revisa el archivo `android/app/build/outputs/apk/` por logs de build

---

**Estado**: ✅ Proyecto Android configurado y sincronizado
**Ubicación**: `/home/reynaldomesab/Proyectos/ONU/android`
**Android Studio**: Ya abierto con el proyecto
