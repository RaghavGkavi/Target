#!/bin/bash

# App Icon Generator Script for Target Mobile App
# Requires ImageMagick: brew install imagemagick (macOS) or apt-get install imagemagick (Linux)

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is required but not installed."
    echo "Install with: brew install imagemagick (macOS) or apt-get install imagemagick (Linux)"
    exit 1
fi

# Check if source icon exists
if [ ! -f "app-icon-1024.png" ]; then
    echo "❌ Source icon 'app-icon-1024.png' not found."
    echo "Please create a 1024x1024 PNG icon file named 'app-icon-1024.png'"
    exit 1
fi

echo "🎨 Generating app icons for Target mobile app..."

# Create directories
mkdir -p android-icons
mkdir -p ios-icons

# Android Icons
echo "📱 Generating Android icons..."
convert app-icon-1024.png -resize 512x512 android-icons/icon-512.png
convert app-icon-1024.png -resize 192x192 android-icons/icon-192.png
convert app-icon-1024.png -resize 144x144 android-icons/icon-144.png
convert app-icon-1024.png -resize 96x96 android-icons/icon-96.png
convert app-icon-1024.png -resize 72x72 android-icons/icon-72.png
convert app-icon-1024.png -resize 48x48 android-icons/icon-48.png

# iOS Icons
echo "🍎 Generating iOS icons..."
convert app-icon-1024.png -resize 1024x1024 ios-icons/icon-1024.png
convert app-icon-1024.png -resize 180x180 ios-icons/icon-180.png
convert app-icon-1024.png -resize 167x167 ios-icons/icon-167.png
convert app-icon-1024.png -resize 152x152 ios-icons/icon-152.png
convert app-icon-1024.png -resize 120x120 ios-icons/icon-120.png
convert app-icon-1024.png -resize 87x87 ios-icons/icon-87.png
convert app-icon-1024.png -resize 80x80 ios-icons/icon-80.png
convert app-icon-1024.png -resize 76x76 ios-icons/icon-76.png
convert app-icon-1024.png -resize 60x60 ios-icons/icon-60.png
convert app-icon-1024.png -resize 58x58 ios-icons/icon-58.png
convert app-icon-1024.png -resize 40x40 ios-icons/icon-40.png
convert app-icon-1024.png -resize 29x29 ios-icons/icon-29.png
convert app-icon-1024.png -resize 20x20 ios-icons/icon-20.png

echo "✅ Icon generation complete!"
echo ""
echo "📁 Generated files:"
echo "   android-icons/ - Android app icons"
echo "   ios-icons/ - iOS app icons"
echo ""
echo "📝 Next steps:"
echo "   1. Copy Android icons to android/app/src/main/res/mipmap-*/ folders"
echo "   2. Add iOS icons to ios/App/App/Assets.xcassets/AppIcon.appiconset/ in Xcode"
echo "   3. Use the 512x512 icon for Google Play Store listing"
echo "   4. Use the 1024x1024 icon for App Store listing"
