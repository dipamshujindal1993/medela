# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# react-native-svg
-keep public class com.horcrux.svg.** {*;}

# react-native-config
-keep class com.medela.mymedela.live.BuildConfig { *; }
-keep class io.realm.react.**
-keep class com.amazonaws.** { *; }
-keep class com.amazon.** { *; }
-keep class com.amazonaws.services.**.*Handler
-keep public class com.masslight.pacify.framework.core.model.** { *; }
-dontwarn com.polidea.reactnativeble.**
