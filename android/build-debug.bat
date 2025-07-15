@echo off
echo.
echo =================================
echo  Building Android DEBUG APK...
echo =================================
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
call gradlew.bat assembleDebug

echo.
echo =================================
echo  Debug build finished.
echo  APK located in: app\build\outputs\apk\debug\
echo =================================
echo.
pause