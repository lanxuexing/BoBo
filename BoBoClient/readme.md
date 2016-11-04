
##环境要求
* python2(python3不支持)
* node
* react-native-cli
```
npm install react-native-cli -g
```
* Android Studio
* ANDROID_HOME环境变量

详情查看[官网](http://facebook.github.io/react-native/docs/getting-started.html)


##运行debug版本

1. react-native run-android

adb logcat *:S ReactNative:V ReactNativeJS:V

##运行release版本

1. 运行build_android.bat
2. cd android&&gradlew assembleRelease


