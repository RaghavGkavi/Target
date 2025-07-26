# GitHub Secrets Setup Guide

To use the mobile build workflow, you need to configure these secrets in your GitHub repository.

## 🔧 Setting Up Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

## 📱 iOS Secrets (Required for Production Builds)

### 1. iOS Certificate and Provisioning Profile

#### Generate Certificate (.p12 file):

1. Open Keychain Access on a Mac
2. Go to Certificate Assistant → Request a Certificate from a Certificate Authority
3. Enter your email and name, select "Save to disk"
4. Upload the .certSigningRequest to Apple Developer Portal
5. Download the certificate and import to Keychain
6. Export as .p12 file with password

#### Get Provisioning Profile:

1. Go to Apple Developer Portal
2. Create App ID with your bundle identifier: `com.target.mobile`
3. Create provisioning profile for distribution
4. Download the .mobileprovision file

#### Convert to Base64:

```bash
# Convert certificate to base64
base64 -i YourCertificate.p12 | pbcopy

# Convert provisioning profile to base64
base64 -i YourProfile.mobileprovision | pbcopy
```

#### Required iOS Secrets:

- `BUILD_CERTIFICATE_BASE64`: Base64 encoded .p12 certificate
- `P12_PASSWORD`: Password for the .p12 certificate
- `BUILD_PROVISION_PROFILE_BASE64`: Base64 encoded .mobileprovision file
- `KEYCHAIN_PASSWORD`: Any password for temporary keychain (e.g., "temp123")

### 2. App Store Connect API (For TestFlight Upload)

#### Create API Key:

1. Go to App Store Connect → Users and Access → Keys
2. Click "Generate API Key"
3. Give it "App Manager" role
4. Download the .p8 file
5. Note the Key ID and Issuer ID

#### Convert API Key:

```bash
base64 -i AuthKey_XXXXXXXXXX.p8 | pbcopy
```

#### Required App Store Secrets:

- `APP_STORE_CONNECT_API_KEY_ID`: The Key ID from App Store Connect
- `APP_STORE_CONNECT_API_ISSUER_ID`: The Issuer ID from App Store Connect
- `APP_STORE_CONNECT_API_KEY_BASE64`: Base64 encoded .p8 API key file

## 🤖 Android Secrets (Optional for Signed Builds)

For signed Android releases, you'll need:

### Generate Keystore:

```bash
keytool -genkey -v -keystore target-release.keystore -alias target-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Convert to Base64:

```bash
base64 -i target-release.keystore | pbcopy
```

#### Android Secrets:

- `ANDROID_KEYSTORE_BASE64`: Base64 encoded keystore file
- `ANDROID_KEYSTORE_PASSWORD`: Keystore password
- `ANDROID_KEY_ALIAS`: Key alias (e.g., "target-alias")
- `ANDROID_KEY_PASSWORD`: Key password

## 🎯 Minimal Setup (Development Only)

For development builds, you only need:

- No secrets required!
- Workflow will build unsigned development versions
- Perfect for testing and internal distribution

## 🚀 Production Setup Checklist

- [ ] iOS Distribution Certificate (.p12) generated and converted to base64
- [ ] iOS Provisioning Profile created and converted to base64
- [ ] App Store Connect API key created and converted to base64
- [ ] All iOS secrets added to GitHub repository
- [ ] Android keystore generated (optional)
- [ ] All Android secrets added (optional)
- [ ] Workflow tested with manual trigger

## 🔍 Testing Your Setup

1. Go to Actions tab in your GitHub repo
2. Click "Mobile App Build & Deploy"
3. Click "Run workflow"
4. Select "development" build type
5. Select platform to test
6. Monitor the build process

## 📋 Secret Names Reference

Copy these exact names into GitHub Secrets:

### iOS (Production):

```
BUILD_CERTIFICATE_BASE64
P12_PASSWORD
BUILD_PROVISION_PROFILE_BASE64
KEYCHAIN_PASSWORD
APP_STORE_CONNECT_API_KEY_ID
APP_STORE_CONNECT_API_ISSUER_ID
APP_STORE_CONNECT_API_KEY_BASE64
```

### Android (Optional):

```
ANDROID_KEYSTORE_BASE64
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
```

## 🆘 Troubleshooting

### Common Issues:

- **Base64 encoding**: Make sure there are no line breaks
- **Certificate expired**: Generate new certificate and provisioning profile
- **Wrong team ID**: Update ExportOptions.plist with your Apple Team ID
- **Bundle ID mismatch**: Ensure same bundle ID everywhere

### Getting Help:

1. Check GitHub Actions logs for specific errors
2. Verify all secrets are correctly named and formatted
3. Test with development build first
4. Ensure Apple Developer account is active

## 💡 Pro Tips

1. **Start Simple**: Begin with development builds only
2. **Test Locally**: Verify builds work locally before setting up CI
3. **Backup Certificates**: Keep secure backups of your certificates
4. **Team Access**: Only give necessary team members access to secrets
5. **Regular Updates**: Renew certificates before they expire

Your workflow is now ready to build iOS apps without a Mac! 🎉
