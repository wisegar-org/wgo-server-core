#!/bin/bash
npx rimraf node_modules
npm install
rm -r build
npm run build-service
cp -r ./assets ./build/assets 2>/dev/null || :
cp -r ./views ./build/views 2>/dev/null || :
cp -r ./modules/core/views ./build/modules/core/views 2>/dev/null || :
cp -r ./modules/identity/views ./build/modules/identity/views 2>/dev/null || :
cp -r ./modules/manage/views ./build/modules/manage/views 2>/dev/null || :
cp -r ./modules/user/views ./build/modules/user/views 2>/dev/null || :
cp -r ./modules/translation/views ./build/modules/translation/views 2>/dev/null || :
cp -r ./modules/settings/views ./build/modules/settings/views 2>/dev/null || :
cp -r ./modules/history/views ./build/modules/history/views 2>/dev/null || :
cp -r ./modules/language/views ./build/modules/language/views 2>/dev/null || :
cp -r ./modules/language/resources ./build/modules/language/resources 2>/dev/null || :
cp -r ./modules/event/views ./build/modules/event/views 2>/dev/null || :
cp -r ./modules/template/views ./build/modules/template/views 2>/dev/null || :