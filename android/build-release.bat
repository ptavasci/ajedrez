@echo off
echo.
echo ==================================
echo  Building Android RELEASE APK...
echo ==================================
echo.

REM --- Prepare Web Assets ---
call ..\prepare-web.bat

REM Check if web preparation was successful (optional, basic check)
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Web asset preparation failed. Aborting build.
    pause
    exit /b %errorlevel%
)

REM --- Build Android App ---
REM Navigate to the script's directory to ensure gradlew is found
cd /d "%~dp0"

REM Run the Gradle command
call gradlew.bat assembleRelease

echo.
echo ==================================
echo  Release build finished.
echo  APK located in: app\build\outputs\apk\release\
echo ==================================
echo.
pause