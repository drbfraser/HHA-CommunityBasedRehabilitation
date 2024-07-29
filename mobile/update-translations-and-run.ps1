# Copy all translations
../locales/replicate_translations.ps1

# Make mobile use the new common
npm run refresh-common 

# Start mobile, clearing the cache
npm start -- --reset-cache