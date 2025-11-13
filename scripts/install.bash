#!/usr/bin/env bash

set -euo pipefail

REPO_ZIP_URL="https://github.com/MAbdullahAhmad/timeline/archive/refs/heads/main.zip"
TMP_DIR="$PWD/tmp"

if ! command -v npm >/dev/null 2>&1; then
  for cand in "$HOME"/Downloads/pkg/node-*/bin; do
    [[ -d "$cand" && -x "$cand/npm" ]] || continue
    export PATH="$cand:$PATH"
    break
  done
fi

abort() {
  echo "[install] $1" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || abort "Missing required command: $1"
}

for cmd in curl unzip npm python3; do
  require_cmd "$cmd"
done

if [[ -e "$TMP_DIR" ]]; then
  read -rp "A tmp directory already exists here. Remove and continue? [y/N]: " resp
  if [[ ! "$resp" =~ ^[Yy]$ ]]; then
    abort "tmp directory already exists. Aborting to avoid data loss."
  fi
  rm -rf "$TMP_DIR"
fi

mkdir -p "$TMP_DIR"
cd "$TMP_DIR"

echo "[install] Downloading repository archive..."
curl -L "$REPO_ZIP_URL" -o timeline.zip

echo "[install] Extracting archive..."
unzip -q timeline.zip

SRC_ROOT="$TMP_DIR/timeline-main"
[[ -d "$SRC_ROOT" ]] || abort "Unable to locate extracted repo at $SRC_ROOT"

echo "[install] Installing UI dependencies and creating production build..."
pushd "$SRC_ROOT/project/ui" >/dev/null
npm install
npm run build
popd >/dev/null

declare -A DATA_FILE_MAP=(
  [json]="items.json"
  [csv]="items.csv"
  [excel]="items.xlsx"
  [url]="items.url"
  [sheets]="sheets.json"
  [drive]="drive.json"
  [api]=""
)

echo "Select a timeline data source method:"
echo "  1) json (local items.json)"
echo "  2) csv (local items.csv)"
echo "  3) excel (local items.xlsx)"
echo "  4) url  (remote items via items.url)"
echo "  5) sheets (Google Sheets / sheets.json)"
echo "  6) drive (Google Drive / drive.json)"
echo "  7) api  (use APIDataService)"
read -rp "Enter choice [1-7, default 1]: " method_choice

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

PUBLIC_DIR="$SRC_ROOT/project/ui/public"
declare -a DATA_FILES=("items.json" "items.csv" "items.xlsx" "items.url" "sheets.json" "drive.json" "items.sqlite3")
KEEP_FILE="${DATA_FILE_MAP[$DATA_METHOD]}"

echo "[install] Applying data method '$DATA_METHOD'..."
for file in "${DATA_FILES[@]}"; do
  [[ "$file" == "$KEEP_FILE" || -z "$KEEP_FILE" ]] && continue
  rm -f "$PUBLIC_DIR/$file"
done

VITE_ENV_FILES=("$SRC_ROOT/project/ui/.env" "$SRC_ROOT/project/ui/public/.env")

update_env_var() {
  local file="$1" key="$2" value="$3"
  python3 - "$file" "$key" "$value" <<'PY'
import sys, pathlib
pathlib.Path(sys.argv[1]).parent.mkdir(parents=True, exist_ok=True)
path = pathlib.Path(sys.argv[1])
key = sys.argv[2]
value = sys.argv[3]
lines = []
if path.exists():
    text = path.read_text()
    lines = text.splitlines()
found = False
for i, line in enumerate(lines):
    if line.startswith(key + "="):
        lines[i] = f"{key}={value}"
        found = True
        break
if not found:
    lines.append(f"{key}={value}")
if lines:
    path.write_text("\n".join(lines) + "\n")
else:
    path.write_text(f"{key}={value}\n")
PY
}

API_BASE_DEFAULT="http://127.0.0.1:8000/api"
API_BASE_VALUE="$API_BASE_DEFAULT"
if [[ "$DATA_METHOD" == "api" ]]; then
  read -rp "Enter API base URL [$API_BASE_DEFAULT]: " input_base
  API_BASE_VALUE="${input_base:-$API_BASE_DEFAULT}"
else
  # Keep default base even if unused for convenience
  API_BASE_VALUE="$API_BASE_DEFAULT"
fi

for env_file in "${VITE_ENV_FILES[@]}"; do
  update_env_var "$env_file" "VITE_TIMELINE_DATA_METHOD" "$DATA_METHOD"
  update_env_var "$env_file" "VITE_TIMELINE_API_BASE" "$API_BASE_VALUE"
done

if [[ "$DATA_METHOD" == "api" ]]; then
  read -rp "Configure HTTP Basic Auth for API? [y/N]: " auth_choice
  if [[ "$auth_choice" =~ ^[Yy]$ ]]; then
    read -rp "API username: " api_user
    read -rsp "API password: " api_pass
    echo
    for env_file in "${VITE_ENV_FILES[@]}"; do
      update_env_var "$env_file" "VITE_TIMELINE_BASIC_AUTH_USER" "$api_user"
      update_env_var "$env_file" "VITE_TIMELINE_BASIC_AUTH_PASS" "$api_pass"
    done
    update_env_var "$SRC_ROOT/project/api/.env" "BASIC_AUTH_USER" "$api_user"
    update_env_var "$SRC_ROOT/project/api/.env" "BASIC_AUTH_PASS" "$api_pass"
  else
    for env_file in "${VITE_ENV_FILES[@]}"; do
      update_env_var "$env_file" "VITE_TIMELINE_BASIC_AUTH_USER" ""
      update_env_var "$env_file" "VITE_TIMELINE_BASIC_AUTH_PASS" ""
    done
  fi
fi

cat >"$SRC_ROOT/setup.bash" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FLAG="$ROOT/.setup_done"
if [[ -f "$FLAG" && "${1:-}" != "--force" ]]; then
  echo "Setup already completed. Use --force to re-run."
  exit 0
fi
for cmd in node npm mysql; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "Missing $cmd" >&2; exit 1; }
done
pushd "$ROOT/project/api" >/dev/null
npm install
npm run db:migrate
npm run db:seed || true
popd >/dev/null
pushd "$ROOT/project/ui" >/dev/null
npm install
npm run build
popd >/dev/null
touch "$FLAG"
echo "Setup complete."
EOF

cat >"$SRC_ROOT/run-api.bash" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT/project/api"
npm run dev "$@"
EOF

cat >"$SRC_ROOT/run-ui.bash" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT/project/ui"
if [[ "${1:-}" == "--preview" ]]; then
  shift
  npm run preview -- "$@"
else
  npm run dev -- "$@"
fi
EOF

chmod +x "$SRC_ROOT"/*.bash

echo "[install] Project ready in $SRC_ROOT"
echo "[install] Next steps:"
echo "  1) cd $SRC_ROOT"
echo "  2) ./setup.bash"
echo "  3) ./run-api.bash (in one terminal)"
echo "  4) ./run-ui.bash (in another terminal)"

echo "[install] Temporary workspace located at $TMP_DIR"
