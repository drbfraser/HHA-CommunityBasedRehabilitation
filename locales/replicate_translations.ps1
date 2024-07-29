# Copy the translations from the source folder to the locales folders for common/web/mobile
# 
# Run via PowerShell (in project root)
#   .\locales\replicate_translations.ps1
# (Can be run from any directory)

# Get the source code folder of these files
$sourceCodeFolder = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Set array of target folders
$targetFolders = @(
    "$sourceCodeFolder\..\mobile\src\locales",
    "$sourceCodeFolder\..\common\src\locales",
    "$sourceCodeFolder\..\web\src\locales"
)

# For each target folder
foreach ($targetFolder in $targetFolders) {
    # Copy the translations
    Copy-Item -Path "$sourceCodeFolder\*.json" -Destination $targetFolder -Force

    # Change first line of each copied file to warn not to edit.
    Get-ChildItem -Path "$targetFolder\*.json" | ForEach-Object {
        # Get the first line
        $firstLine = Get-Content $_.FullName -TotalCount 1

        # Create a temporary file
        $tempFile = "$($_.FullName).tmp"

        # Write the warning to the temporary file
        Set-Content -Path $tempFile -Value $firstLine
        Add-Content -Path $tempFile -Value '    "COPIED_WARNING": "DO NOT EDIT THIS FILE; it is copied by replicate_translations script",'
        # Write rest of the file to the temporary file
        Get-Content $_.FullName | Select-Object -Skip 1 | Add-Content -Path $tempFile

        # Move the temporary file to the original file
        Move-Item -Path $tempFile -Destination $_.FullName -Force
    }

    # Add warning to output folder
    Set-Content -Path $targetFolder\ATTENTION-DO_NOT_EDIT.md -Value "DO NOT EDIT THESE FILES; they are copied by replicate_translations script"
}