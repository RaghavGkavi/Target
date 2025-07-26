# GitHub Actions Mobile Build Workflow

🎉 **Congratulations!** You now have a complete CI/CD pipeline that builds iOS and Android apps in the cloud without needing a Mac!

## 🚀 Quick Start

### 1. Immediate Usage (No Setup Required)

```bash
# Push your code to trigger automatic builds
git push origin mobile-app

# Or manually trigger from GitHub:
# 1. Go to Actions tab
# 2. Select "Mobile App Build & Deploy"
# 3. Click "Run workflow"
# 4. Choose your options and run
```

### 2. What You Get For Free

- ✅ **Android APK builds** (debug & release)
- ✅ **iOS app builds** (development)
- ✅ **Automatic testing** before builds
- ✅ **Build artifacts** stored for 30 days
- ✅ **Cross-platform support**

## 📱 Workflow Features

### Automatic Triggers

- **Push to `mobile-app` branch**: Development builds
- **Push to `main` branch**: Production builds
- **Pull requests**: Testing builds
- **Manual dispatch**: On-demand builds with options

### Build Types

| Build Type  | Android         | iOS        | Signing | Distribution     |
| ----------- | --------------- | ---------- | ------- | ---------------- |
| Development | Debug APK       | Unsigned   | No      | Internal testing |
| Production  | Release APK/AAB | Signed IPA | Yes     | App Store ready  |

### Platform Options

- **iOS only**: Build just iOS app
- **Android only**: Build just Android app
- **Both**: Build both platforms (default)

## 🛠️ How to Use

### Development Workflow

```bash
# 1. Make changes to your app
# 2. Commit and push
git add .
git commit -m "Add new feature"
git push origin mobile-app

# 3. Check GitHub Actions tab for build status
# 4. Download APK/iOS build from artifacts
# 5. Test on devices
```

### Manual Build Trigger

1. Go to GitHub → Actions tab
2. Select "Mobile App Build & Deploy"
3. Click "Run workflow"
4. Choose options:
   - **Branch**: mobile-app or main
   - **Build type**: development or production
   - **Platforms**: ios, android, or both
5. Click "Run workflow"

### Production Release

```bash
# 1. Merge mobile-app to main for production
git checkout main
git merge mobile-app
git push origin main

# 2. Workflow automatically builds production versions
# 3. iOS: Uploaded to TestFlight (if secrets configured)
# 4. Android: Release APK/AAB ready for Play Store
```

## 📋 Build Status & Artifacts

### Monitoring Builds

- **Real-time logs**: Watch builds in Actions tab
- **Email notifications**: GitHub sends build status emails
- **Status badges**: Add to README for build status

### Downloading Builds

1. Go to completed workflow run
2. Scroll to "Artifacts" section
3. Download:
   - `android-apk`: Android installation files
   - `ios-build`: iOS app for Xcode/device deployment
   - `web-build`: Built web application

### Installing Builds

```bash
# Android (APK):
# 1. Download APK to Android device
# 2. Enable "Install from unknown sources"
# 3. Tap APK file to install

# iOS (Development):
# 1. Download iOS build
# 2. Use Xcode to deploy to device/simulator
# 3. Or use Apple Configurator 2
```

## 🔧 Configuration Options

### Customizing the Workflow

Edit `.github/workflows/mobile-build.yml` to:

- Change Node.js version
- Modify build commands
- Add additional testing steps
- Customize artifact retention

### Environment Variables

```yaml
env:
  NODE_VERSION: "18" # Node.js version
  JAVA_VERSION: "11" # Java version for Android
```

### Branch Protection

Recommended GitHub settings:

- Require status checks before merging
- Require branches to be up to date
- Require review from code owners

## 📊 Workflow Jobs Breakdown

### 1. `build-web` (Ubuntu)

- ⏱️ **Duration**: ~2-3 minutes
- 🔧 **Actions**: Install deps, run tests, build React app
- 📦 **Output**: Web assets for mobile apps

### 2. `build-android` (Ubuntu)

- ⏱️ **Duration**: ~5-8 minutes
- 🔧 **Actions**: Setup Android SDK, build APK/AAB
- 📦 **Output**: Android installation files

### 3. `build-ios` (macOS)

- ⏱️ **Duration**: ~8-12 minutes
- 🔧 **Actions**: Setup Xcode, build iOS app
- 📦 **Output**: iOS app bundle/IPA

### 4. `deploy-testflight` (macOS)

- ⏱️ **Duration**: ~3-5 minutes
- 🔧 **Actions**: Upload to TestFlight
- 📦 **Output**: App available for beta testing

### 5. `deploy-internal` (Ubuntu)

- ⏱️ **Duration**: ~1-2 minutes
- 🔧 **Actions**: Create GitHub release with builds
- 📦 **Output**: Downloadable releases

## 💰 GitHub Actions Usage

### Free Tier Limits

- **Linux/Windows**: 2000 minutes/month
- **macOS**: 10x multiplier (200 minutes/month)
- **Storage**: 500MB artifacts

### Estimated Usage Per Build

- **Development build**: ~15-20 minutes (macOS time)
- **Production build**: ~25-30 minutes (macOS time)
- **Android only**: ~8-10 minutes (Linux time)

### Optimization Tips

```yaml
# Cache dependencies
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# Skip iOS for draft PRs
if: github.event.pull_request.draft == false
```

## 🚨 Troubleshooting

### Common Issues

#### Build Fails

```bash
# Check logs in Actions tab
# Common causes:
# - Dependency conflicts
# - Test failures
# - Capacitor sync issues
```

#### iOS Certificate Issues

```bash
# Verify secrets are correctly set
# Check certificate expiration
# Ensure provisioning profile matches bundle ID
```

#### Android Build Issues

```bash
# Check Java/Android SDK versions
# Verify Gradle configuration
# Review Android manifest
```

### Debug Commands

```bash
# Local testing before pushing
npm run build:client
npx cap sync
npx cap doctor

# Check workflow syntax
cd .github/workflows
cat mobile-build.yml | head -20
```

## 🎯 Next Steps

### For Development

1. ✅ Push code → automatic builds
2. ✅ Download and test on devices
3. ✅ Iterate based on feedback

### For Production (Optional Setup)

1. 📝 Set up iOS certificates ([guide](.github/workflows/setup-secrets.md))
2. 🔑 Configure GitHub secrets
3. 🚀 Enable automatic App Store deployment
4. 📱 Set up beta testing with TestFlight

### Advanced Features

- **Slack notifications** for build status
- **Automatic version bumping**
- **Multiple environment deployments**
- **Performance monitoring integration**

## 📞 Support

### Resources

- **GitHub Actions Docs**: [docs.github.com/actions](https://docs.github.com/actions)
- **Capacitor Docs**: [capacitorjs.com/docs](https://capacitorjs.com/docs)
- **iOS Certificate Guide**: `.github/workflows/setup-secrets.md`

### Getting Help

1. Check workflow logs for specific errors
2. Review this guide and setup instructions
3. Test builds locally first
4. Open GitHub issue with error details

---

🎉 **You're all set!** Your mobile app now builds automatically in the cloud. No Mac required for iOS development!

**Next**: Push some code and watch your first automated mobile build! 🚀
