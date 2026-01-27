@echo off
echo Downloading and starting Meilisearch...
echo.

REM Download Meilisearch if not exists
if not exist meilisearch.exe (
    echo Downloading Meilisearch...
    curl -L https://github.com/meilisearch/meilisearch/releases/latest/download/meilisearch-windows-amd64.exe -o meilisearch.exe
)

echo Starting Meilisearch server on http://localhost:7700
echo Press Ctrl+C to stop the server
echo.
meilisearch.exe --master-key your-secure-master-key --http-addr 127.0.0.1:7700