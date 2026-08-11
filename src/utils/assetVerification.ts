import * as fs from 'fs';
import * as path from 'path';

export interface AssetVerificationResult {
  success: boolean;
  missing: string[];
}

/**
 * List of all expected asset filenames that must exist in the build output.
 * These are the original assets from the source repository that must be preserved.
 */
export const EXPECTED_IMAGES: string[] = [
  'autoTyper.jpg',
  'browser.png',
  'buddy.jpg',
  'directorySorter.png',
  'e5de158d-0eb7-48ff-8e39-74ad9518212e.JPG',
  'folderEncrypter.png',
  'mev3.png',
  'networkTraffic.png',
  'OSMNX.png',
  'pathFinding.png',
  'radicalSimplfier.png',
  'sortingVisualizer.png',
  'ticTacToe.png',
  'treeVisualizer.png',
];

export const EXPECTED_PDF: string = 'Tomas Bentolila Resume.pdf';

export const EXPECTED_FAVICONS: string[] = ['bitmoji.png'];

/**
 * Verifies that all expected asset files exist in the build output directory.
 * This function is designed to be called as a post-build script to ensure
 * no assets are lost during the build process.
 *
 * @param buildOutputDir - The path to the build output directory (e.g., "dist")
 * @param expectedAssets - List of expected asset filenames to check
 * @returns AssetVerificationResult indicating success or listing missing files
 */
export function verifyAssets(
  buildOutputDir: string,
  expectedAssets: string[]
): AssetVerificationResult {
  const missing: string[] = [];

  for (const asset of expectedAssets) {
    const found = findAssetInDirectory(buildOutputDir, asset);
    if (!found) {
      missing.push(asset);
    }
  }

  return {
    success: missing.length === 0,
    missing,
  };
}

/**
 * Recursively searches for a file by name within a directory.
 * This handles cases where Vite may place assets in different subdirectories
 * or add hashes to filenames while preserving the original name portion.
 */
function findAssetInDirectory(dir: string, filename: string): boolean {
  if (!fs.existsSync(dir)) {
    return false;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (findAssetInDirectory(fullPath, filename)) {
        return true;
      }
    } else if (entry.isFile()) {
      // Check exact filename match or Vite hashed filename match
      // Vite hashes look like: filename-abc123.ext
      if (entry.name === filename || matchesHashedFilename(entry.name, filename)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if a hashed filename matches the original filename.
 * Vite typically adds a hash before the extension: "image-abc123.png"
 * Original: "image.png" → Hashed: "image-abc123.png"
 */
function matchesHashedFilename(hashedName: string, originalName: string): boolean {
  const originalExt = path.extname(originalName);
  const originalBase = path.basename(originalName, originalExt);

  // Match pattern: originalBase-<hash>.originalExt
  const hashPattern = new RegExp(
    `^${escapeRegExp(originalBase)}-[a-zA-Z0-9]+\\${originalExt}$`
  );

  return hashPattern.test(hashedName);
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Runs the full asset verification for the portfolio build.
 * Checks images, PDF, and favicons.
 *
 * @param buildOutputDir - The path to the build output directory
 * @returns AssetVerificationResult with all missing assets combined
 */
export function verifyAllAssets(buildOutputDir: string): AssetVerificationResult {
  const allExpected = [
    ...EXPECTED_IMAGES,
    EXPECTED_PDF,
    ...EXPECTED_FAVICONS,
  ];

  return verifyAssets(buildOutputDir, allExpected);
}

/**
 * Post-build script entry point.
 * Call this function to verify assets and exit with code 1 if any are missing.
 */
export function runAssetVerification(buildOutputDir?: string): void {
  const outputDir = buildOutputDir || path.resolve(process.cwd(), 'dist');

  console.log(`\nVerifying assets in: ${outputDir}\n`);

  const result = verifyAllAssets(outputDir);

  if (result.success) {
    console.log('✓ All assets verified successfully.');
  } else {
    console.error('✗ Asset verification FAILED. Missing assets:');
    for (const missing of result.missing) {
      console.error(`  - ${missing}`);
    }
    process.exit(1);
  }
}

// Allow running directly as a script
if (typeof require !== 'undefined' && require.main === module) {
  runAssetVerification(process.argv[2]);
}
