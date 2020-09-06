echo " ============> Removing old signed and zipaligned apk >================ "
rm ./myssmapp.apk
echo " ============> Copy unsigned apk from build folder to project root folder  >================ "
cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk .
echo " ============> Sign unsigned apk in project root folder  >================ "
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk myssm
echo " ============> Zipalign and produce final release apk  >================ "
$ANDROID_SDK_ROOT/build-tools/28.0.3/zipalign -v 4 app-release-unsigned.apk myssmapp.apk
$ANDROID_SDK_ROOT/build-tools/28.0.3/apksigner sign --ks my-release-key.keystore --ks-key-alias myssm myssmapp.apk

echo " ============> Removing old signed and zipaligned aab >================ "
rm ./myssmapp.aab
echo " ============> Copy unsigned aab from build folder to project root folder  >================ "
cp platforms/android/app/build/outputs/bundle/release/app.aab .
echo " ============> Sign unsigned aab in project root folder  >================ "
$JAVA_HOME/bin/jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app.aab myssm
# echo " ============> Zipalign and produce final release aab  >================ "
# $ANDROID_SDK_ROOT/build-tools/28.0.3/zipalign -v 4 aap.aab myssmaap.aab
# $ANDROID_SDK_ROOT/build-tools/28.0.3/apksigner sign --ks my-release-key.keystore --ks-key-alias myssm myssmaap.aab
