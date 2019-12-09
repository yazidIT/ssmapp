echo " ============> Removing old signed and zipaligned apk >================ "
rm ./myssmapp.apk
echo " ============> Copy unsigned apk from build folder to project root folder  >================ "
cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk .
echo " ============> Sign unsigned apk in project root folder  >================ "
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk myssm
echo " ============> Zipalign and produce final release apk  >================ "
$ANDROID_SDK_ROOT/build-tools/29.0.2/zipalign -v 4 app-release-unsigned.apk myssmapp.apk
$ANDROID_SDK_ROOT/build-tools/29.0.2/apksigner sign --ks my-release-key.keystore --ks-key-alias myssm myssmapp.apk

