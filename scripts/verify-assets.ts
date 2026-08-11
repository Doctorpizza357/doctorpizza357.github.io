/**
 * Post-build asset verification script.
 * Ensures all source assets are present in the build output.
 * 
 * Usage: npx tsx scripts/verify-assets.ts [build-output-dir]
 * Default build output dir: dist/
 */
import * as path from 'path';
import { runAssetVerification } from '../src/utils/assetVerification';

const buildOutputDir = process.argv[2] || path.resolve(process.cwd(), 'dist');
runAssetVerification(buildOutputDir);
