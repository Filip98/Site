#!/bin/sh
export NODE_ENV=production
for file in public/stylesheets/*.less; do
	npx lessc $file "${file%.less}.css"
	npx cleancss -O 2 -o "${file%.less}.css" "${file%.less}.css"
done
for file in public/javascripts/*.js; do
	if [ ${file: -6} != "min.js" ]; then
		npx terser $file -o "${file%.js}.min.js"
	fi
done
killall node
until node app.js; do
	echo "Crashed with exit code $?. Respawning.." >&2
	sleep 1
done