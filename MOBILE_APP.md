# Mobile App (APK) Guide

Convert React web apps to Android/iOS mobile apps using Capacitor.

## Important Note

**Current apps are React Web Apps, not React Native.** To create APK files, you need to:

1. **Option A:** Wrap web app with Capacitor (WebView-based app)
2. **Option B:** Convert to React Native (requires code rewrite)

## Option A: Capacitor (Recommended - Easier)

Capacitor wraps your existing React web app in a native container, allowing you to build APK/IPA files.

### Step 1: Install Capacitor

#### Admin App

```bash
cd med-rank-flow-admin
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npx cap init
```

When prompted:
- **App name:** Med-Rank-Flow Admin
- **App ID:** com.medrankflow.admin
- **Web dir:** dist

#### Student App

```bash
cd med-rank-flow-student
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npx cap init
```

When prompted:
- **App name:** Med-Rank-Flow Student
- **App ID:** com.medrankflow.student
- **Web dir:** dist

### Step 2: Build Web App

```bash
# Admin
cd med-rank-flow-admin
npm run build

# Student
cd med-rank-flow-student
npm run build
```

### Step 3: Add Android Platform

```bash
# Admin
cd med-rank-flow-admin
npx cap add android

# Student
cd med-rank-flow-student
npx cap add android
```

### Step 4: Configure Capacitor

#### Admin App (`med-rank-flow-admin/capacitor.config.ts`)

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medrankflow.admin',
  appName: 'Med-Rank-Flow Admin',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development, uncomment:
    // url: 'http://localhost:5173',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff"
    }
  }
};

export default config;
```

#### Student App (`med-rank-flow-student/capacitor.config.ts`)

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medrankflow.student',
  appName: 'Med-Rank-Flow Student',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff"
    }
  }
};

export default config;
```

### Step 5: Sync Capacitor

```bash
# Admin
cd med-rank-flow-admin
npm run build
npx cap sync android

# Student
cd med-rank-flow-student
npm run build
npx cap sync android
```

### Step 6: Build APK

#### Option A: Using Android Studio (Recommended)

1. **Install Android Studio**
   - Download from https://developer.android.com/studio
   - Install Android SDK and build tools

2. **Open Project**
   ```bash
   cd med-rank-flow-admin
   npx cap open android
   ```
   This opens Android Studio

3. **Build APK**
   - In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Generate Signed APK (for Play Store)**
   - Build → Generate Signed Bundle / APK
   - Create keystore
   - Follow Play Store guidelines

#### Option B: Using Command Line

```bash
cd med-rank-flow-admin/android
./gradlew assembleDebug
# APK: app/build/outputs/apk/debug/app-debug.apk
```

### Step 7: Update API URL for Mobile

Update environment variables or config to use production backend:

```typescript
// In your API service
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend.onrender.com';
```

### Step 8: Handle CORS

Ensure backend CORS includes your app's origin. For Capacitor apps, you may need to configure:

```python
# In backend CORS_ORIGINS
CORS_ORIGINS=https://your-backend.onrender.com,capacitor://localhost,http://localhost
```

## Option B: React Native (Advanced - Requires Rewrite)

This requires rewriting the entire app in React Native. Not recommended unless you need native features.

### Steps:

1. Create new React Native project
2. Rewrite all components using React Native components
3. Use React Native navigation
4. Build APK using React Native CLI

**Time Estimate:** 2-4 weeks for full rewrite

## Comparison

| Feature | Capacitor (WebView) | React Native |
|---------|-------------------|--------------|
| **Development Time** | 1-2 days | 2-4 weeks |
| **Code Changes** | Minimal | Complete rewrite |
| **Performance** | Good (WebView) | Excellent (Native) |
| **Native Features** | Limited | Full access |
| **Maintenance** | Easy (same codebase) | Separate codebase |

## Recommended Approach

**For Quick APK:** Use Capacitor (Option A)
- Fast to implement
- Reuses existing code
- Good enough for most use cases

**For Production Mobile App:** Consider React Native
- Better performance
- Native feel
- More features

## Capacitor Additional Features

### Add Plugins

```bash
# Camera
npm install @capacitor/camera

# Geolocation
npm install @capacitor/geolocation

# Push Notifications
npm install @capacitor/push-notifications
```

### Update Build Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "cap:sync": "cap sync",
    "cap:android": "cap open android",
    "cap:ios": "cap open ios"
  }
}
```

## iOS Build (Optional)

```bash
# Install iOS dependencies
npx cap add ios

# Open in Xcode
npx cap open ios

# Build in Xcode
```

Requires macOS and Xcode.

## Testing APK

1. **Enable Developer Options** on Android device
2. **Enable USB Debugging**
3. **Install APK:**
   ```bash
   adb install app-debug.apk
   ```
4. Or transfer APK to device and install manually

## Publishing to Play Store

1. Generate signed APK/AAB
2. Create Play Store developer account ($25 one-time)
3. Upload APK/AAB
4. Fill store listing
5. Submit for review

## Troubleshooting

### Build Errors

- Ensure Android SDK is installed
- Check Java version (JDK 11+)
- Verify Gradle version

### CORS Issues

- Configure backend CORS for Capacitor origins
- Use HTTPS for production API

### Network Issues

- Check internet permission in AndroidManifest.xml
- Verify API URL is accessible

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Studio](https://developer.android.com/studio)
- [Play Store Guidelines](https://play.google.com/about/developer-content-policy/)

---

**Recommendation:** Start with Vercel deployment (web), then add Capacitor for mobile if needed.

