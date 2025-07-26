# App Store Deployment Guide

Complete guide to package and deploy your Target mobile app to Google Play Store and Apple App Store.

## 📱 Prerequisites

### For Android (Google Play Store)

- **Android Studio** installed with latest SDK
- **Java Development Kit (JDK)** 11 or higher
- **Google Play Console** developer account ($25 one-time fee)
- **Keystore file** for app signing

### For iOS (Apple App Store)

- **macOS** computer with Xcode
- **Xcode** latest version
- **Apple Developer Program** membership ($99/year)
- **iOS Simulator** or physical iOS device

---

## 🤖 Android Deployment

### Step 1: Prepare for Production Build

#### 1.1 Create a Keystore File

```bash
# Navigate to android directory
cd android

# Generate keystore (replace with your details)
keytool -genkey -v -keystore target-release.keystore -alias target-alias -keyalg RSA -keysize 2048 -validity 10000

# You'll be prompted for:
# - Keystore password (REMEMBER THIS!)
# - Key password (REMEMBER THIS!)
# - Your name and organization details
```

#### 1.2 Configure Signing in Android

Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=target-alias
storeFile=target-release.keystore
```

Update `android/app/build.gradle`:

```gradle
// Add at the top, before android block
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

android {
    // ... existing configuration

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 2: Build Production APK/AAB

#### 2.1 Build the Web App

```bash
# From project root
npm run build:client
npx cap sync
```

#### 2.2 Build Signed APK

```bash
cd android
./gradlew assembleRelease

# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

#### 2.3 Build App Bundle (Recommended for Play Store)

```bash
cd android
./gradlew bundleRelease

# AAB will be at: android/app/build/outputs/bundle/release/app-release.aab
```

### Step 3: Google Play Store Submission

#### 3.1 Create Play Console Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 registration fee
3. Complete developer profile

#### 3.2 Create New App

1. Click "Create app"
2. Fill in app details:
   - **App name**: Target
   - **Default language**: English (US)
   - **App or game**: App
   - **Free or paid**: Free

#### 3.3 Upload App Bundle

1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload your `.aab` file
4. Fill in release notes

#### 3.4 Complete Store Listing

1. **App details**:
   - Short description: "Master your goals, break your chains"
   - Full description: Detailed app description
   - App icon: 512x512 PNG
   - Screenshots: Phone and tablet screenshots

2. **Content rating**:
   - Complete questionnaire
   - Target audience and content

3. **Pricing & distribution**:
   - Select countries
   - Content guidelines compliance

#### 3.5 Submit for Review

1. Review all sections (green checkmarks)
2. Click "Send for review"
3. Wait 1-3 days for approval

---

## 🍎 iOS Deployment

### Step 1: Prepare iOS Project

#### 1.1 Open in Xcode

```bash
npm run mobile:ios
# This opens Xcode with your project
```

#### 1.2 Configure App Identity

In Xcode:

1. Select project root → Target "App"
2. **General** tab:
   - **Display Name**: Target
   - **Bundle Identifier**: com.target.mobile (must be unique)
   - **Version**: 1.0
   - **Build**: 1

#### 1.3 Configure Signing

1. **Signing & Capabilities** tab
2. Check "Automatically manage signing"
3. Select your Apple Developer Team
4. Xcode will create provisioning profiles

### Step 2: Add App Icons and Launch Screen

#### 2.1 App Icons

1. In Xcode Navigator: `ios/App/App/Assets.xcassets/AppIcon.appiconset`
2. Add icons for all required sizes:
   - 20x20, 29x29, 40x40, 58x58, 60x60, 80x80, 87x87, 120x120, 180x180, 1024x1024

#### 2.2 Launch Screen

Customize `ios/App/App/Base.lproj/LaunchScreen.storyboard`

### Step 3: Build for App Store

#### 3.1 Select Destination

1. In Xcode, select "Any iOS Device (arm64)" as destination
2. **NOT** Simulator

#### 3.2 Archive the App

1. Menu: **Product** → **Archive**
2. Wait for build to complete
3. Organizer window opens

#### 3.3 Upload to App Store Connect

1. In Organizer, select your archive
2. Click "Distribute App"
3. Select "App Store Connect"
4. Follow upload wizard

### Step 4: App Store Connect Submission

#### 4.1 Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill details:
   - **Platform**: iOS
   - **Name**: Target
   - **Bundle ID**: com.target.mobile
   - **SKU**: target-mobile-1
   - **Language**: English

#### 4.2 Complete App Information

1. **App Information**:
   - Name, description, keywords
   - Categories: Productivity, Health & Fitness
   - Content rating

2. **Pricing and Availability**:
   - Free app
   - All territories

3. **App Store Information**:
   - Screenshots (required sizes)
   - App preview videos (optional)
   - Description and keywords

#### 4.3 Submit for Review

1. Select your uploaded build
2. Complete all required sections
3. Submit for review
4. Wait 24-48 hours for approval

---

## 📸 Required Assets

### App Icons

Create icons in these sizes:

- **Android**:
  - 48x48, 72x72, 96x96, 144x144, 192x192 (PNG)
  - 512x512 for Play Store
- **iOS**:
  - 20x20 to 1024x1024 (see Xcode requirements)

### Screenshots

- **Android**:
  - Phone: 320px-3840px width/height
  - Tablet: 600px-7680px width/height
- **iOS**:
  - iPhone: 1284x2778, 1170x2532
  - iPad: 2048x2732, 1668x2388

### Sample Icon Creation

```bash
# Install ImageMagick for resizing
# macOS:
brew install imagemagick

# Create icon sizes from master 1024x1024 icon
convert icon-1024.png -resize 512x512 icon-512.png
convert icon-1024.png -resize 192x192 icon-192.png
convert icon-1024.png -resize 144x144 icon-144.png
convert icon-1024.png -resize 96x96 icon-96.png
convert icon-1024.png -resize 72x72 icon-72.png
convert icon-1024.png -resize 48x48 icon-48.png
```

---

## 🚀 Quick Commands Reference

### Android Production Build

```bash
# Complete build and package process
npm run build:client
npx cap sync
cd android
./gradlew bundleRelease
```

### iOS Production Build

```bash
# Build and open Xcode
npm run build:client
npx cap sync
npm run mobile:ios
# Then archive in Xcode: Product → Archive
```

### Testing Builds

```bash
# Test on devices before submission
npm run mobile:run:android --prod
npm run mobile:run:ios --prod
```

---

## ���� Pre-Submission Checklist

### Android

- [ ] Keystore file created and secured
- [ ] App signed with release keystore
- [ ] All required icons added
- [ ] Screenshots captured
- [ ] Play Console account created
- [ ] Store listing completed
- [ ] Content rating completed
- [ ] Privacy policy URL provided

### iOS

- [ ] Apple Developer account active
- [ ] App ID and certificates configured
- [ ] All icon sizes provided
- [ ] Launch screen configured
- [ ] Screenshots for all device types
- [ ] App Store Connect app created
- [ ] Build uploaded and processed
- [ ] Store listing completed

---

## 🔧 Troubleshooting

### Common Android Issues

- **Build fails**: Check Java version and Android SDK
- **Signing errors**: Verify keystore path and passwords
- **Upload rejected**: Ensure AAB format, not APK

### Common iOS Issues

- **Signing errors**: Check Apple Developer account status
- **Archive fails**: Ensure "Any iOS Device" selected
- **Upload fails**: Check bundle ID uniqueness

### Build Optimization

```bash
# Reduce bundle size
npm run build:client -- --minify
npx cap sync

# Clean builds
cd android && ./gradlew clean
# iOS: Product → Clean Build Folder in Xcode
```

---

## 📱 Post-Release

### Version Updates

1. Update version in `package.json`
2. Update version in platform configs
3. Build and upload new version
4. Submit update for review

### Monitoring

- Monitor app performance in store consoles
- Check crash reports and user feedback
- Plan feature updates based on user reviews

## 🎯 Success Metrics

After deployment, track:

- Download numbers
- User ratings and reviews
- Crash reports
- User engagement analytics

Your Target mobile app is now ready for the world! 🚀
