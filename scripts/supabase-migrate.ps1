param(
  [string]$DatabaseUrl = $env:SUPABASE_DB_URL,
  [string]$SchemaPath = "supabase\\schema.sql"
)

if (-not $DatabaseUrl) {
  Write-Host "SUPABASE_DB_URL is not set. Add it to your environment or .env file." -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path $SchemaPath)) {
  Write-Host "Schema file not found at $SchemaPath" -ForegroundColor Red
  exit 1
}

$psql = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psql) {
  Write-Host "psql is required to run migrations. Install Postgres client tools first." -ForegroundColor Yellow
  exit 1
}

Write-Host "Applying Supabase schema..." -ForegroundColor Cyan
& psql $DatabaseUrl -v ON_ERROR_STOP=1 -f $SchemaPath
if ($LASTEXITCODE -ne 0) {
  Write-Host "Migration failed." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Migration completed." -ForegroundColor Green
