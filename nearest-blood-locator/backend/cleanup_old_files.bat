@echo off
echo Cleaning up old JavaScript files...

REM Delete old JavaScript files
del /F /Q "server.js" 2>nul
del /F /Q "package.json" 2>nul
del /F /Q "config\db.js" 2>nul
del /F /Q "config\env.js" 2>nul
del /F /Q "models\Donor.js" 2>nul
del /F /Q "models\BloodBank.js" 2>nul
del /F /Q "models\User.js" 2>nul
del /F /Q "controllers\donorController.js" 2>nul
del /F /Q "controllers\bloodBankController.js" 2>nul
del /F /Q "controllers\authController.js" 2>nul
del /F /Q "routes\donorRoutes.js" 2>nul
del /F /Q "routes\bloodBankRoutes.js" 2>nul
del /F /Q "routes\authRoutes.js" 2>nul
del /F /Q "middleware\authMiddleware.js" 2>nul
del /F /Q "utils\locationHelper.js" 2>nul

echo Done! All old JavaScript files removed.
echo.
echo Backend now contains only Python files.
pause
