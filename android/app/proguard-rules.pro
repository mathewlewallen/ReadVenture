# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt

# Keep BuildConfig
-keep class com.readventure.BuildConfig { *; }

# React Native Config rules
-keep class com.readventure.ReactNativeConfig { *; }
-keepclassmembers class com.readventure.ReactNativeConfig {
    public static <fields>;
}

# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep Firebase classes
-keep class com.google.firebase.** { *; }
-keepclassmembers class com.google.firebase.** { *; }

# Keep native methods
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}