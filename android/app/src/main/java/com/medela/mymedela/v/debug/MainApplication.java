package com.medela.mymedela.v.debug;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import chat.rocket.userdefaults.RNUserDefaultsModule;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.ibits.react_native_in_app_review.AppReviewPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import com.facebook.react.modules.i18nmanager.I18nUtil;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          packages.add(new PacifySDKPackage());
          packages.add(new AppReviewPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    //Getting Device language
    String deviceLanguage = Locale.getDefault().getLanguage();

    //Getting local app language data if changed by user
    SharedPreferences languagePreferences = getApplicationContext().getSharedPreferences("react-native",Context.MODE_PRIVATE);
    String appLanguage = languagePreferences.getString("selected_language_locale", "");
    String prevDeviceLanguage = languagePreferences.getString("device_lang_when_changed_from_app", "");
    String userLocale = languagePreferences.getString("app_visibility_changed_at_the_time_of_signup_or_login", "");

    // All RTL Languages Supported by our our
    String[] rtl = this.getResources().getStringArray(R.array.all_rtl_languages);
    ArrayList<String> rtlLangs = new ArrayList<String>(Arrays.asList(rtl));

    // All Languages Supported by our our
    String[] categoryReasons = this.getResources().getStringArray(R.array.all_spported_languages);
    ArrayList<String> allSupportedLanguages = new ArrayList<String>(Arrays.asList(categoryReasons));
    if(userLocale!=null&&userLocale!=""&&allSupportedLanguages.contains(userLocale.substring(0,2)) ){
      appLanguage=userLocale.substring(0,2);
    }else if(prevDeviceLanguage!=null&&prevDeviceLanguage!=""&&deviceLanguage!=null&&deviceLanguage!=""){
      if(prevDeviceLanguage!=deviceLanguage){
        appLanguage=deviceLanguage;
      }
    }

    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
      if(allSupportedLanguages.contains(deviceLanguage)){
        if(appLanguage!=null&&appLanguage!=""){
          if(rtlLangs.contains(appLanguage)){
            sharedI18nUtilInstance.forceRTL(getApplicationContext(), true);
          }else{
            sharedI18nUtilInstance.forceRTL(getApplicationContext(), false);
          }
        }else{
          if(rtlLangs.contains(deviceLanguage)){
            sharedI18nUtilInstance.forceRTL(getApplicationContext(), true);
          }else{
            sharedI18nUtilInstance.forceRTL(getApplicationContext(), false);
          }
        }
      }else{
        sharedI18nUtilInstance.forceRTL(getApplicationContext(), false);
      }



    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
     * Loads Flipper in React Native templates.
     *
     * @param context
     */
    private static void initializeFlipper(Context context) {
      if (BuildConfig.DEBUG) {
          try {
      /*
       We use reflection here to pick up the class that initializes Flipper,
      since Flipper library is not available in release mode
      */
              Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
              aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
          } catch (ClassNotFoundException e) {
              e.printStackTrace();
          } catch (NoSuchMethodException e) {
              e.printStackTrace();
          } catch (IllegalAccessException e) {
              e.printStackTrace();
          } catch (InvocationTargetException e) {
              e.printStackTrace();
          }
      }
  }
}
