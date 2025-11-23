#!/bin/bash

# Run Slither security analysis and save reports to audit folder

echo "🔍 Running Slither security analysis..."

# Create audit directory structure
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
YEAR_MONTH=$(date +%Y-%m)
ARCHIVE_DIR="audit/archive/${YEAR_MONTH}"
mkdir -p "${ARCHIVE_DIR}"

# Generate reports directly to temp files (continue even if Slither finds issues)
TEMP_CHECKLIST=$(mktemp)
TEMP_REPORT=$(mktemp)

slither . --compile-force-framework hardhat --checklist > "${TEMP_CHECKLIST}" 2>&1 || true
slither . --compile-force-framework hardhat --json "${TEMP_REPORT}" 2>&1 || true

# Save latest reports (overwrite)
if [ -s "${TEMP_CHECKLIST}" ]; then
  cp "${TEMP_CHECKLIST}" audit/slither-checklist-latest.md
  cp "${TEMP_CHECKLIST}" "${ARCHIVE_DIR}/slither-checklist-${TIMESTAMP}.md"
  echo "✅ Checklist saved to audit/slither-checklist-latest.md and archived"
fi

if [ -s "${TEMP_REPORT}" ]; then
  cp "${TEMP_REPORT}" audit/slither-report-latest.json
  cp "${TEMP_REPORT}" "${ARCHIVE_DIR}/slither-report-${TIMESTAMP}.json"
  echo "✅ JSON report saved to audit/slither-report-latest.json and archived"
fi

# Clean up temp files
rm -f "${TEMP_CHECKLIST}" "${TEMP_REPORT}"

echo ""
echo "📁 Reports location:"
echo "   Latest: audit/slither-checklist-latest.md and audit/slither-report-latest.json"
echo "   Archive: audit/archive/${YEAR_MONTH}/"

