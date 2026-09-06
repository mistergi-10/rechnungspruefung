# Download Model Script for Windows (PowerShell)
# Prompts for a Hugging Face model repo id and downloads it into ./models using hf_transfer.
# Requires: Python + pip + hf-transfer (or huggingface-cli + git-lfs as a fallback).

param(
  [string]$ModelId = $(Read-Host 'Enter HF model id (e.g. meta-llama/Llama-2-7b-chat-hf or mistralai/mistral-7b-instruct)')
)

if (-not $ModelId) { Write-Error 'Model id is required'; exit 1 }

Write-Host "Downloading model: $ModelId to ./models/$ModelId"

# Ensure models directory exists
New-Item -ItemType Directory -Force -Path .\models | Out-Null

# Try hf_transfer (recommended)
try {
  python -c "import importlib,sys; importlib.import_module('hf_transfer')" 2>$null
  if ($LASTEXITCODE -ne 0) {
    Write-Host 'Installing hf-transfer...'
    python -m pip install --user hf-transfer
  }
  Write-Host 'Using hf_transfer to download the model...'
  python -m hf_transfer download $ModelId --cache-dir ./models/$($ModelId -replace '/', '_')
  Write-Host 'Download finished (check ./models)'
  exit 0
} catch {
  Write-Warning 'hf-transfer not available or failed. Trying huggingface-cli + git lfs fallback.'
}

# Fallback: huggingface-cli + git lfs
try {
  git --version > $null
  git lfs version > $null
} catch {
  Write-Error 'git or git-lfs not installed. Install git-lfs or hf-transfer and retry.'
  exit 1
}

$repoUrl = "https://huggingface.co/$ModelId"
$dest = "./models/$($ModelId -replace '/', '_')"
Write-Host "Cloning $repoUrl to $dest (with git-lfs)..."

git clone $repoUrl $dest
Write-Host 'Clone finished. Large files may still be downloading via LFS.'
Write-Host 'Done. If the model is large, ensure LFS pulled all files.'
