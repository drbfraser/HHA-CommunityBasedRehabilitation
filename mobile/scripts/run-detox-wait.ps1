param(
    [string]$AvdName = 'Pixel_6',
    [int]$WaitForBootSeconds = 120
)

Write-Host "Running Detox helper: AVD=$AvdName, waitBoot=$WaitForBootSeconds s"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$mobileRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path

function Kill-Emulators {
    Write-Host "Killing existing emulator.exe processes (if any)..."
    Get-Process emulator -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force }
}

function Start-Avd {
    param($name)
    $emulatorPath = Join-Path $Env:ANDROID_SDK_ROOT 'emulator\emulator.exe'
    if (-Not (Test-Path $emulatorPath)) {
        Write-Error "Emulator binary not found at $emulatorPath. Ensure ANDROID_SDK_ROOT is set correctly."
        exit 1
    }
    Write-Host "Starting AVD: $name"
    Start-Process -FilePath $emulatorPath -ArgumentList "-avd $name" -WindowStyle Normal
}

function Wait-For-Boot {
    param($timeoutSeconds)
    $start = Get-Date
    while (((Get-Date) - $start).TotalSeconds -lt $timeoutSeconds) {
        try {
            $val = (& adb shell getprop sys.boot_completed 2>$null).Trim()
        } catch { $val = '' }
        if ($val -eq '1') { Write-Host "Emulator boot completed."; return $true }
        Write-Host "Waiting for emulator boot... (elapsed $([math]::Round(((Get-Date)-$start).TotalSeconds))s)"
        Start-Sleep -Seconds 2
    }
    Write-Error "Timed out waiting for emulator to boot after $timeoutSeconds seconds."
    return $false
}

function Ensure-Metro {
    try {
        $status = Invoke-RestMethod http://localhost:8081/status -ErrorAction Stop
        if ($status -eq 'packager-status:running') { Write-Host 'Metro packager already running.'; return }
    } catch {
        Write-Host 'Metro not running — starting a new Metro window...'
        $args = @('-NoExit','-Command',"cd '$mobileRoot'; npx react-native start --port 8081")
        Start-Process -FilePath "powershell" -ArgumentList $args -WorkingDirectory $mobileRoot
        Start-Sleep -Seconds 4
    }
}

function Setup-Reverse {
    Write-Host 'Setting adb reverse tcp:8081 -> tcp:8081'
    adb reverse tcp:8081 tcp:8081 | Out-Null
    adb reverse --list
}

function Build-And-Install {
    Write-Host 'Building APKs (gradle)...'
    $androidDir = Join-Path $mobileRoot 'android'
    if (-not (Test-Path $androidDir)) {
        Write-Error "Android project not found at $androidDir. Ensure you're using a native Android project under 'mobile/android'."
        exit 1
    }
    $gradlew = Join-Path $androidDir 'gradlew.bat'
    if (-not (Test-Path $gradlew)) { $gradlew = Join-Path $androidDir 'gradlew' }
    if (-not (Test-Path $gradlew)) { Write-Error 'Gradle wrapper not found in android directory.'; exit 1 }

    Push-Location $androidDir
    & $gradlew assembleDebug assembleAndroidTest
    $rc = $LASTEXITCODE
    Pop-Location
    if ($rc -ne 0) { Write-Error 'Gradle build failed.'; exit $rc }

    Write-Host 'Installing APKs...'
    $apk1 = Join-Path $androidDir 'app\build\outputs\apk\debug\app-debug.apk'
    $apk2 = Join-Path $androidDir 'app\build\outputs\apk\androidTest\debug\app-debug-androidTest.apk'
    if (Test-Path $apk1) { adb install -r $apk1 } else { Write-Host "APK not found: $apk1" }
    if (Test-Path $apk2) { adb install -r $apk2 } else { Write-Host "Test APK not found: $apk2" }
}

function Run-Detox {
    Write-Host 'Running Detox (trace)...'
    Push-Location $mobileRoot
    npx detox test -c android.emu.debug --loglevel trace
    $rc = $LASTEXITCODE
    Pop-Location
    return $rc
}

# Main flow
Kill-Emulators
Start-Avd -name $AvdName
if (-not (Wait-For-Boot -timeoutSeconds $WaitForBootSeconds)) { exit 1 }
Ensure-Metro
Setup-Reverse
Build-And-Install
$exitCode = Run-Detox
exit $exitCode
