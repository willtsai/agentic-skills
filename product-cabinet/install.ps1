<#
.SYNOPSIS
Installs Product Cabinet skills for GitHub Copilot.

.DESCRIPTION
Installs every Product Cabinet skill by default, or only the skill names
provided as positional arguments.

.PARAMETER Force
Overwrites existing installed copies.

.PARAMETER Skills
Names of Product Cabinet skills to install.

.ENVIRONMENT
COPILOT_SKILLS_DIR overrides the target directory. The default is
~/.copilot/skills.

.EXAMPLE
./install.ps1

.EXAMPLE
./install.ps1 product-ceo product-specification

.EXAMPLE
./install.ps1 -Force
#>
[CmdletBinding()]
param(
    [switch]$Force,

    [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$Skills
)

$ErrorActionPreference = "Stop"

$skillsSource = Join-Path $PSScriptRoot "skills"
$skillsDirectory = if ($env:COPILOT_SKILLS_DIR) {
    $env:COPILOT_SKILLS_DIR
} else {
    Join-Path $HOME ".copilot/skills"
}

$resolvedHome = [System.IO.Path]::GetFullPath($HOME)
$resolvedTarget = [System.IO.Path]::GetFullPath($skillsDirectory)
if (
    $resolvedTarget -eq [System.IO.Path]::GetPathRoot($resolvedTarget) -or
    $resolvedTarget -eq $resolvedHome
) {
    throw "Refusing unsafe skills directory: '$resolvedTarget'."
}

$availableSkills = @(
    Get-ChildItem -LiteralPath $skillsSource -Directory |
        Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName "SKILL.md") } |
        Sort-Object -Property Name |
        Select-Object -ExpandProperty Name
)

if (-not $Skills -or $Skills.Count -eq 0) {
    $Skills = $availableSkills
}

foreach ($skill in $Skills) {
    if (
        [string]::IsNullOrWhiteSpace($skill) -or
        $skill -in @(".", "..") -or
        $skill.Contains("/") -or
        $skill.Contains("\")
    ) {
        throw "Invalid skill name: '$skill'."
    }

    if ($skill -notin $availableSkills) {
        throw "Unknown Product Cabinet skill: '$skill'."
    }
}

New-Item -ItemType Directory -Path $resolvedTarget -Force | Out-Null

$installed = 0
foreach ($skill in $Skills) {
    $sourcePath = Join-Path $skillsSource $skill
    $destination = Join-Path $resolvedTarget $skill

    if (Test-Path -LiteralPath $destination) {
        if (-not $Force) {
            Write-Warning "Skip '$skill': $destination already exists. Re-run with -Force to overwrite."
            continue
        }

        Remove-Item -LiteralPath $destination -Recurse -Force
    }

    Copy-Item -LiteralPath $sourcePath -Destination $destination -Recurse
    Write-Host "Installed '$skill' to $destination"
    $installed++
}

if ($installed -gt 0) {
    Write-Host "Restart Copilot CLI or reload your agent host to load the installed skills."
}
