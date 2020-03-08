#!/bin/sh
export NODE_ENV=production

for file in public/stylesheets/*.less; do
	sum=$(sha256sum $file | awk '{print $1}')
	read -r oldsum < "${file}.sha256"
	if [ "$sum" != "$oldsum" ]; then
		echo "$sum" > "${file}.sha256"
		npx lessc $file "${file%.less}.css"
		npx cleancss -O 2 -o "${file%.less}.css" "${file%.less}.css"
	fi
done

for file in public/javascripts/*.js; do
	if [ ${file: -6} != "min.js" ]; then
		sum=$(sha256sum $file | awk '{print $1}')
		read -r oldsum < "${file}.sha256"
		if [ "$sum" != "$oldsum" ]; then
			echo "$sum" > "${file}.sha256"
			npx terser $file -o "${file%.js}.min.js"
		fi
	fi
done

killall node
until node app.js; do
	echo "Crashed with exit code $?. Respawning.." >&2
	sleep 1
done
