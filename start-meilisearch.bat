@echo off
cd /d %~dp0

echo Starting Meilisearch...
echo Using database folder: data.ms
echo.

meilisearch.exe ^
  --db-path data.ms ^
  --master-key your-secure-master-key ^
  --http-addr 127.0.0.1:7700

pause
