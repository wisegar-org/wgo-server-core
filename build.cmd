@ECHO OFF 
call npx rimraf node_modules
call npm install
call npx rimraf build
call npm run build-service


