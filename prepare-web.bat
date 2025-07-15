@echo off
echo.
echo =================================
echo  Preparing Web Assets...
echo =================================
echo.

echo Running npm run build...
npm run build

echo.
echo Running npx cap sync android...
npx cap sync android

echo.
echo =================================
echo  Web Assets Ready.
echo =================================
echo.
