#!/bin/bash

# Run Slither security analysis and save reports to audit folder

echo "🔍 Running Slither security analysis..."

# Generate reports in root directory (continue even if Slither finds issues)
slither . --compile-force-framework hardhat --checklist > slither-checklist.md || true
slither . --compile-force-framework hardhat --json slither-report.json || true

# Create audit directory structure
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
YEAR_MONTH=$(date +%Y-%m)
ARCHIVE_DIR="audit/archive/${YEAR_MONTH}"
mkdir -p "${ARCHIVE_DIR}"

# Save latest reports (overwrite)
if [ -f slither-checklist.md ]; then
  cp slither-checklist.md audit/LATEST.md
  cp slither-checklist.md "${ARCHIVE_DIR}/slither-checklist-${TIMESTAMP}.md"
  echo "✅ Checklist saved to audit/LATEST.md and archived"
fi

if [ -f slither-report.json ]; then
  cp slither-report.json audit/LATEST.json
  cp slither-report.json "${ARCHIVE_DIR}/slither-report-${TIMESTAMP}.json"
  echo "✅ JSON report saved to audit/LATEST.json and archived"
fi

echo ""
echo "📁 Reports location:"
echo "   Latest: audit/LATEST.md and audit/LATEST.json"
echo "   Archive: audit/archive/${YEAR_MONTH}/"

