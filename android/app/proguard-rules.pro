# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:


# React Native core
-keep class com.facebook.react.** { *; }
-keep class com.facebook.soloader.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**

# Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-keepattributes *Annotation*
-keepattributes Signature

# Firebase Messaging
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# React Native SVG
-keep class com.horcrux.svg.** { *; }
-dontwarn com.horcrux.svg.**

# React Native PDF
-keep class com.rnfs.** { *; }
-dontwarn com.rnfs.**

# React Native WebView
-keep class com.reactnativecommunity.webview.** { *; }
-dontwarn com.reactnativecommunity.webview.**

# Stripe React Native
-keep class com.stripe.** { *; }
-dontwarn com.stripe.**

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# RN Fetch Blob
-keep class com.RNFetchBlob.** { *; }
-dontwarn com.RNFetchBlob.**

# Moment.js (for date handling)
-keep class org.joda.** { *; }
-dontwarn org.joda.**

# Prevent warnings for androidx.lifecycle
-dontwarn androidx.lifecycle.**

# Prevent warnings for OkHttp (used internally by many libraries)
-dontwarn okhttp3.**

# Keep Gson if used for JSON parsing
-keep class com.google.gson.** { *; }
-dontwarn com.google.gson.**

# General Android ProGuard rules
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Parcelable and native methods
-keepclassmembers class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}
-keepclasseswithmembers class * {
    native <methods>;
}
