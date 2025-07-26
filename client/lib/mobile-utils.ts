import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';

export class MobileUtils {
  static async initializeMobileApp() {
    try {
      // Hide splash screen after app loads
      await SplashScreen.hide();
      
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Configure keyboard behavior
      Keyboard.addListener('keyboardWillShow', () => {
        document.body.classList.add('keyboard-open');
      });
      
      Keyboard.addListener('keyboardWillHide', () => {
        document.body.classList.remove('keyboard-open');
      });
      
    } catch (error) {
      console.log('Mobile initialization skipped (running on web):', error);
    }
  }

  static async setStatusBarStyle(isDark: boolean) {
    try {
      await StatusBar.setStyle({ 
        style: isDark ? Style.Light : Style.Dark 
      });
    } catch (error) {
      // Silently fail on web
    }
  }

  static async triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
    try {
      let style: ImpactStyle;
      switch (type) {
        case 'light':
          style = ImpactStyle.Light;
          break;
        case 'medium':
          style = ImpactStyle.Medium;
          break;
        case 'heavy':
          style = ImpactStyle.Heavy;
          break;
      }
      await Haptics.impact({ style });
    } catch (error) {
      // Silently fail on web
    }
  }

  static async triggerNotificationHaptic() {
    try {
      await Haptics.notification({ type: 'success' });
    } catch (error) {
      // Silently fail on web
    }
  }

  static async triggerSelectionHaptic() {
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      // Silently fail on web
    }
  }
}
