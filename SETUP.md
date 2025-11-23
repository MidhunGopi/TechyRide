# TechyRide - Detailed Setup Guide

This guide will help you set up TechyRide for development and production use.

## Prerequisites Setup

### 1. Node.js and npm

**Windows/macOS/Linux:**
```bash
# Download and install from https://nodejs.org/
# Verify installation
node --version  # Should be >= 16.x
npm --version
```

### 2. React Native Development Environment

#### For Android Development

**Install Android Studio:**
1. Download from https://developer.android.com/studio
2. During installation, ensure these components are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device

**Configure Android SDK:**
1. Open Android Studio
2. Go to Settings > Appearance & Behavior > System Settings > Android SDK
3. Install SDK Platform for Android 13 (API Level 33)
4. Go to SDK Tools tab and install:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

**Set Environment Variables:**

Windows:
```powershell
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator"
```

macOS/Linux:
```bash
# Add to ~/.bash_profile or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### For iOS Development (macOS only)

**Install Xcode:**
1. Install from Mac App Store
2. Open Xcode and install additional required components
3. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```

**Install CocoaPods:**
```bash
sudo gem install cocoapods
```

### 3. Install Java Development Kit (JDK)

**Windows/macOS/Linux:**
```bash
# Download JDK 11 from https://adoptopenjdk.net/
# Verify installation
java -version
```

## Project Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/MidhunGopi/TechyRide.git
cd TechyRide

# Install dependencies
npm install

# For iOS (macOS only)
cd ios
pod install
cd ..
```

### 2. Google Maps API Setup

#### Get API Key:
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Directions API
   - Distance Matrix API

4. Create credentials (API Key)
5. Restrict the API key:
   - For Android: Add your app's package name and SHA-1 certificate
   - For iOS: Add your app's bundle identifier

#### Configure Android:

Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_ACTUAL_API_KEY_HERE"/>
```

#### Configure iOS:

1. Open `ios/TechyRide/AppDelegate.m`
2. Add at the top:
   ```objective-c
   #import <GoogleMaps/GoogleMaps.h>
   ```
3. In `didFinishLaunchingWithOptions`, add:
   ```objective-c
   [GMSServices provideAPIKey:@"YOUR_ACTUAL_API_KEY_HERE"];
   ```

### 3. Running on Emulator/Simulator

#### Android Emulator:

1. Open Android Studio
2. Go to Tools > AVD Manager
3. Create a new Virtual Device (Recommended: Pixel 4, Android 13)
4. Start the emulator

Then run:
```bash
npm run android
```

#### iOS Simulator (macOS only):

```bash
npm run ios
```

To run on a specific device:
```bash
npm run ios -- --simulator="iPhone 14 Pro"
```

### 4. Running on Physical Device

#### Android:

1. Enable Developer Options on your device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   
2. Enable USB Debugging:
   - Go to Settings > Developer Options
   - Enable "USB Debugging"

3. Connect device via USB
4. Verify connection:
   ```bash
   adb devices
   ```

5. Run:
   ```bash
   npm run android
   ```

#### iOS:

1. Open `ios/TechyRide.xcworkspace` in Xcode
2. Select your device from the device dropdown
3. Click Run button or press Cmd+R

## Configuration Options

### Environment Variables

Create `.env` file in project root:
```
API_BASE_URL=https://api.yourdomain.com
GOOGLE_MAPS_API_KEY=your_api_key_here
UPI_PAYMENT_GATEWAY=your_payment_gateway
```

### App Configuration

Edit `app.json` for app metadata:
```json
{
  "name": "TechyRide",
  "displayName": "TechyRide",
  "version": "1.0.0",
  "description": "Carpooling made easy"
}
```

## Troubleshooting

### Common Issues

#### Metro Bundler Issues:
```bash
# Clear cache
npm start -- --reset-cache

# Or
watchman watch-del-all
rm -rf node_modules
npm install
```

#### Android Build Issues:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### iOS Build Issues:
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

#### Port Already in Use:
```bash
# Kill process on port 8081
npx react-native start --port=8082
```

### Android Debug Keystore

Location: `~/.android/debug.keystore`

To get SHA-1 fingerprint:
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## Production Build

### Android Release Build

1. Generate a signing key:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Place keystore in `android/app/`

3. Edit `android/gradle.properties`:
   ```
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   ```

4. Build:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

5. APK location: `android/app/build/outputs/apk/release/`

### iOS Release Build

1. Open `ios/TechyRide.xcworkspace` in Xcode
2. Select "Any iOS Device"
3. Product > Archive
4. Follow distribution wizard

## Performance Optimization

### Enable Hermes (Already enabled)

Hermes improves app performance and reduces app size.

Verify in `android/gradle.properties`:
```
hermesEnabled=true
```

### Bundle Size Optimization

```bash
# Analyze bundle
npx react-native-bundle-visualizer

# Enable ProGuard (Android)
# Edit android/app/build.gradle
minifyEnabled true
shrinkResources true
```

## Next Steps

1. Set up backend API
2. Configure push notifications
3. Set up analytics (Firebase, etc.)
4. Implement crash reporting
5. Set up CI/CD pipeline
6. Configure app distribution (TestFlight, Google Play Console)

## Support

- React Native Docs: https://reactnative.dev/
- React Navigation: https://reactnavigation.org/
- Google Maps Platform: https://developers.google.com/maps

For project-specific issues, create an issue on GitHub.
