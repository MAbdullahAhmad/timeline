#!/usr/bin/env bash

set -euo pipefail

REPO_ZIP_URL="https://github.com/MAbdullahAhmad/timeline/releases/download/v1.0.0/project.zip"
CWD="$(pwd)"
TMP_DIR="$CWD/tmp"
OUTPUT_DEFAULT="$CWD/timeline-bundle"

if ! command -v npm >/dev/null 2>&1; then
  for cand in "$HOME"/Downloads/pkg/node-*/bin; do
    [[ -d "$cand" && -x "$cand/npm" ]] || continue
    export PATH="$cand:$PATH"
    break
  done
fi

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "[install] Missing required command: $1" >&2; exit 1; }
}

for cmd in curl unzip npm python3; do
  require_cmd "$cmd"
done

if [[ -e "$TMP_DIR" ]]; then
  read -rp "[install] tmp directory exists. Remove it? [y/N]: " resp
  [[ "$resp" =~ ^[Yy]$ ]] || { echo "[install] Aborting."; exit 1; }
  rm -rf "$TMP_DIR"
fi
mkdir -p "$TMP_DIR"

read -rp "[install] Output directory [$OUTPUT_DEFAULT]: " OUTPUT_DIR
OUTPUT_DIR="${OUTPUT_DIR:-$OUTPUT_DEFAULT}"
if [[ -e "$OUTPUT_DIR" ]]; then
  read -rp "[install] $OUTPUT_DIR exists. Overwrite? [y/N]: " resp
  [[ "$resp" =~ ^[Yy]$ ]] || { echo "[install] Aborting."; exit 1; }
  rm -rf "$OUTPUT_DIR"
fi
mkdir -p "$OUTPUT_DIR"

cd "$TMP_DIR"
echo "[install] Downloading repository..."
curl -L "$REPO_ZIP_URL" -o timeline.zip

echo "[install] Extracting..."
unzip -q timeline.zip
rm -f timeline.zip

SRC_ROOT="$TMP_DIR/timeline-main"
[[ -d "$SRC_ROOT" ]] || { echo "[install] Extraction failed." >&2; exit 1; }

PUBLIC_DIR="$SRC_ROOT/project/ui/public"
UI_ENV_FILES=("$SRC_ROOT/project/ui/.env" "$SRC_ROOT/project/ui/public/.env")
declare -A DATA_FILE_MAP=(
  [json]="items.json"
  [csv]="items.csv"
  [excel]="items.xlsx"
  [url]="items.url"
  [sheets]="sheets.json"
  [drive]="drive.json"
  [api]=""
)
declare -a DATA_FILES=("items.json" "items.csv" "items.xlsx" "items.url" "sheets.json" "drive.json" "items.sqlite3")

echo "Select a timeline data source method:"
echo "  1) json"
echo "  2) csv"
echo "  3) excel"
echo "  4) url"
echo "  5) sheets"
echo "  6) drive"
echo "  7) api"
read -rp "Choice [1-7, default 1]: " method_choice
case "${method_choice:-1}" in
  1|json|JSON) DATA_METHOD="json" ;;
  2|csv|CSV) DATA_METHOD="csv" ;;
  3|excel|xlsx|XLSX) DATA_METHOD="excel" ;;
  4|url|URL) DATA_METHOD="url" ;;
  5|sheets|sheet|gsheet) DATA_METHOD="sheets" ;;
  6|drive|gdrive) DATA_METHOD="drive" ;;
  7|api|API) DATA_METHOD="api" ;;
  *) DATA_METHOD="json" ;;
esac

API_BASE_DEFAULT="http://127.0.0.1:4000/api"
read -rp "[install] API base URL [$API_BASE_DEFAULT]: " api_base_input
API_BASE="${api_base_input:-$API_BASE_DEFAULT}"
API_PORT=$(python3 - "$API_BASE" <<'PY'
import sys, urllib.parse
url = urllib.parse.urlparse(sys.argv[1])
if url.port:
    print(url.port)
elif url.scheme == 'https':
    print(443)
else:
    print(80)
PY
)

DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="timeline_app"
DB_USER="root"
DB_PASS="root"
if [[ "$DATA_METHOD" == "api" ]]; then
  read -rp "[install] DB host [$DB_HOST]: " tmp && DB_HOST="${tmp:-$DB_HOST}"
  read -rp "[install] DB port [$DB_PORT]: " tmp && DB_PORT="${tmp:-$DB_PORT}"
  read -rp "[install] DB name [$DB_NAME]: " tmp && DB_NAME="${tmp:-$DB_NAME}"
  read -rp "[install] DB user [$DB_USER]: " tmp && DB_USER="${tmp:-$DB_USER}"
  read -rsp "[install] DB password [$DB_PASS]: " tmp && echo && DB_PASS="${tmp:-$DB_PASS}"
fi

read -rp "[install] Configure HTTP Basic Auth? [y/N]: " auth_choice
if [[ "$auth_choice" =~ ^[Yy]$ ]]; then
  read -rp "[install] API username: " API_USER
  read -rsp "[install] API password: " API_PASS; echo
else
  API_USER=""
  API_PASS=""
fi

update_env_var() {
  local file="$1" key="$2" value="$3"
  python3 - "$file" "$key" "$value" <<'PY'
import sys, pathlib
path = pathlib.Path(sys.argv[1])
path.parent.mkdir(parents=True, exist_ok=True)
key, value = sys.argv[2], sys.argv[3]
lines = []
if path.exists():
    lines = path.read_text().splitlines()
for i, line in enumerate(lines):
    if line.startswith(key + "="):
        lines[i] = f"{key}={value}"
        break
else:
    lines.append(f"{key}={value}")
path.write_text("\n".join(lines) + "\n")
PY
}

for env_file in "${UI_ENV_FILES[@]}"; do
  update_env_var "$env_file" "VITE_TIMELINE_DATA_METHOD" "$DATA_METHOD"
  update_env_var "$env_file" "VITE_TIMELINE_API_BASE" "$API_BASE"
  update_env_var "$env_file" "VITE_TIMELINE_BASIC_AUTH_USER" "$API_USER"
  update_env_var "$env_file" "VITE_TIMELINE_BASIC_AUTH_PASS" "$API_PASS"
done

KEEP_FILE="${DATA_FILE_MAP[$DATA_METHOD]}"
for file in "${DATA_FILES[@]}"; do
  [[ -n "$KEEP_FILE" && "$file" == "$KEEP_FILE" ]] && continue
  rm -f "$PUBLIC_DIR/$file"
done

echo "[install] Building UI..."
pushd "$SRC_ROOT/project/ui" >/dev/null
npm install
npm run build
popd >/dev/null

echo "[install] Preparing api directory..."
cp -R "$SRC_ROOT/project/api" "$OUTPUT_DIR/api"
rm -rf "$OUTPUT_DIR/api/node_modules"
pushd "$OUTPUT_DIR/api" >/dev/null
update_env_var ".env" "PORT" "$API_PORT"
if [[ "$DATA_METHOD" == "api" ]]; then
  update_env_var ".env" "DB_HOST" "$DB_HOST"
  update_env_var ".env" "DB_PORT" "$DB_PORT"
  update_env_var ".env" "DB_NAME" "$DB_NAME"
  update_env_var ".env" "DB_USER" "$DB_USER"
  update_env_var ".env" "DB_PASSWORD" "$DB_PASS"
fi
update_env_var ".env" "BASIC_AUTH_USER" "$API_USER"
update_env_var ".env" "BASIC_AUTH_PASS" "$API_PASS"
npm install --omit=dev
popd >/dev/null

echo "[install] Preparing db directory..."
cp -R "$SRC_ROOT/project/db" "$OUTPUT_DIR/db"

echo "[install] Preparing ui directory..."
cp -R "$SRC_ROOT/project/ui/dist" "$OUTPUT_DIR/ui"

cat >"$OUTPUT_DIR/run-api.bash" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT/api"
npm start "$@"
EOF

cat >"$OUTPUT_DIR/run-ui.bash" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
npx --yes serve -s ui "$@"
EOF

chmod +x "$OUTPUT_DIR"/run-*.bash

cd "$CWD"
rm -rf "$TMP_DIR"

echo "[install] Done. Deliverable available at $OUTPUT_DIR"
echo "[install] Use ./run-api.bash and ./run-ui.bash to start the services."
