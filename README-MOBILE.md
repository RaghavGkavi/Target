# Target - Mobile Goal Tracking App

A powerful mobile application for goal tracking, habit building, and addiction recovery. Built with React and Ionic Capacitor for native mobile performance on iOS and Android.

## 🎯 Features

### Core Functionality
- **Goal Management**: Create, track, and complete personal goals
- **Habit Tracking**: Build positive habits with streak counters
- **Addiction Recovery**: Track clean days and recovery progress
- **Achievement System**: Unlock achievements for reaching milestones
- **Discipline Rankings**: Earn ranks based on consistency and progress
- **Progress Analytics**: View detailed insights and statistics

### Mobile-Optimized Experience
- **Native Performance**: Smooth, responsive interface
- **Haptic Feedback**: Tactile feedback for important actions
- **Safe Area Support**: Perfect display on all device sizes
- **Touch-Optimized**: Large touch targets and thumb-friendly navigation
- **Offline Capable**: Core functionality works without internet
- **Cross-Platform**: Identical experience on iOS and Android

## 📱 Supported Platforms

- **iOS**: iPhone and iPad (iOS 13.0+)
- **Android**: Phones and tablets (API level 22+)
- **Web**: Modern browsers (Chrome, Safari, Firefox, Edge)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- For Android: Android Studio with SDK
- For iOS: Xcode (macOS only)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd target-mobile

# Install dependencies
npm install

# Build for mobile
npm run mobile:build
```

### Development Commands
```bash
# Start web development server
npm run dev

# Build and sync mobile assets
npm run mobile:build

# Open in Android Studio
npm run mobile:android

# Open in Xcode (macOS only)
npm run mobile:ios

# Run on Android device/emulator
npm run mobile:run:android

# Run on iOS simulator/device
npm run mobile:run:ios
```

## 🛠️ Development Setup

### Android Development
1. Install [Android Studio](https://developer.android.com/studio)
2. Configure Android SDK (API level 30+)
3. Enable USB debugging on your device
4. Run: `npm run mobile:android`

### iOS Development
1. Install [Xcode](https://developer.apple.com/xcode/) (macOS only)
2. Install Xcode Command Line Tools
3. Run: `npm run mobile:ios`

## 📂 Project Structure

```
├── android/              # Native Android project
├── ios/                  # Native iOS project
├── client/               # React application source
│   ├── components/       # Reusable UI components
│   ├── pages/           # Application screens
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   └── contexts/        # React contexts
├── server/              # Express API backend
├── shared/              # Shared type definitions
└── capacitor.config.ts  # Mobile app configuration
```

## 🎨 Mobile Features

### Haptic Feedback
- Goal completion: Medium impact
- Achievement unlocked: Success notification
- Button presses: Light selection feedback

### Safe Area Handling
- Automatic safe area insets for all devices
- Proper status bar integration
- Home indicator awareness

### Performance Optimizations
- Lazy loading for better startup time
- Optimized touch handling
- Smooth animations and transitions

## 🔧 Configuration

### App Settings (capacitor.config.ts)
```typescript
{
  appId: 'com.target.mobile',
  appName: 'Target',
  webDir: 'dist/spa',
  // Platform-specific configurations
}
```

### Android Customization
- **App Colors**: `android/app/src/main/res/values/colors.xml`
- **App Name**: `android/app/src/main/res/values/strings.xml`
- **Theme**: `android/app/src/main/res/values/styles.xml`

### iOS Customization
- **App Info**: `ios/App/App/Info.plist`
- **Icons**: `ios/App/App/Assets.xcassets/`

## 📦 Building for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/`

### iOS Archive
```bash
npm run mobile:ios
# In Xcode: Product → Archive
```

## 🚀 Deployment

### Google Play Store
1. Create signed APK/AAB
2. Upload to Google Play Console
3. Complete store listing
4. Submit for review

### Apple App Store
1. Archive in Xcode
2. Upload to App Store Connect
3. Complete app metadata
4. Submit for review

## 🔍 Testing

### Web Testing
```bash
npm run dev
# Open http://localhost:8080
```

### Mobile Testing
```bash
# Test on real devices
npm run mobile:run:android
npm run mobile:run:ios
```

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
- Ensure `dist/spa` exists: `npm run build:client`
- Check Node.js version (18+ required)

**Android Studio Won't Open**
- Verify Android Studio installation
- Check PATH environment variable

**iOS Build Issues**
- Update Xcode to latest version
- Clear derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`

**Capacitor Sync Problems**
```bash
npx cap sync
npx cap doctor
```

### Debug Commands
```bash
# Check Capacitor setup
npx cap doctor

# View device logs
npx cap run android -l
npx cap run ios -l

# Clean build
npx cap sync --deployment
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review [Capacitor documentation](https://capacitorjs.com/docs)
3. Open an issue in the repository

## 🔗 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [iOS Developer Documentation](https://developer.apple.com/documentation/)
- [React Documentation](https://reactjs.org/docs)
