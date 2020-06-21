$env:NODE_ENV = production

$files = Get-ChildItem -Path "${scriptPath}\public\stylesheets" -Recurse -Include *.less
foreach ($file in $files) {
    $sum = Get-FileHash $file -Algorithm SHA256
    $oldsum = Get-Content "${file}.sha256" -First 1
    if($sum -ne $oldsum) {
        $sum | Out-File "${file}.sha256"
        npx lessc $file "${file%.less}.css"
        npx cleancss -O 2 -o "${file%.less}.css" "${file%.less}.css"
    }
}

$files = Get-ChildItem -Path "${scriptPath}\public\javascripts" -Recurse -Include *.js
foreach ($file in $files) {
    if ("${file: -6}" -ne "min.js") {
        $sum = Get-FileHash $file -Algorithm SHA256
        $oldsum = Get-Content "${file}.sha256" -First 1
        if ($sum -ne $oldsum) {
            $sum | Out-File "${file}.sha256"
            npx terser $file -o "${file%.js}.min.js"
        }
    }
}

taskkill /f /im "node.exe"
:start
node app.js
echo "Crashed. Respawning.."
Start-Sleep -m 1
goto start
