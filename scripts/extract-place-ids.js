/**
 * Script to extract place_ids from Google Maps URLs and update restaurant-places.js
 * 
 * Usage:
 *   1. Place your CSV file with restaurant names and Google Maps URLs
 *   2. Run: node scripts/extract-place-ids.js <path-to-csv>
 * 
 * Note: This script resolves shortened URLs and extracts place_ids.
 * You may need to install dependencies: npm install node-fetch
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For Node.js, you may need to install node-fetch: npm install node-fetch
// For now, we'll create a manual mapping based on the CSV

async function resolveShortUrl(shortUrl) {
  if (!shortUrl || shortUrl === 'null' || shortUrl.trim() === '') {
    return null;
  }
  
  try {
    // Make a HEAD request to resolve the shortened URL
    const response = await fetch(shortUrl, { method: 'HEAD', redirect: 'follow' });
    const finalUrl = response.url || shortUrl;
    
    // Extract place_id from the final URL
    // Google Maps URLs can have place_id in different formats:
    // - ?place_id=ChIJ...
    // - /place/.../data=!4m5!3m4!1sChIJ...
    // - /maps/place/.../@lat,lng,zoom/data=!4m5!3m4!1sChIJ...
    
    let placeId = null;
    
    // Try query parameter first
    const queryMatch = finalUrl.match(/[?&]place_id=([A-Za-z0-9_-]+)/);
    if (queryMatch) {
      placeId = queryMatch[1];
    }
    
    // Try data parameter (encoded)
    if (!placeId) {
      const dataMatch = finalUrl.match(/data=([^&]+)/);
      if (dataMatch) {
        try {
          const decoded = decodeURIComponent(dataMatch[1]);
          const placeIdMatch = decoded.match(/!1s([A-Za-z0-9_-]{27})/);
          if (placeIdMatch) {
            placeId = placeIdMatch[1];
          }
        } catch (e) {
          // Ignore decode errors
        }
      }
    }
    
    return placeId;
  } catch (error) {
    console.error(`Error resolving URL ${shortUrl}:`, error.message);
    return null;
  }
}

async function extractPlaceIdsFromCSV(csvPath) {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  const mapping = {};
  const promises = [];
  
  for (const line of lines) {
    const [name, url] = line.split(',').map(s => s.trim());
    if (!name || !url || url === 'null') {
      mapping[name] = null;
      continue;
    }
    
    promises.push(
      resolveShortUrl(url).then(placeId => {
        mapping[name] = placeId;
        console.log(`${name}: ${placeId || 'NOT FOUND'}`);
      })
    );
  }
  
  await Promise.all(promises);
  return mapping;
}

function updateMappingFile(mapping) {
  const mappingFilePath = path.join(__dirname, '../functions/api/lib/restaurant-places.js');
  let content = fs.readFileSync(mappingFilePath, 'utf-8');
  
  // Update the sunway_square mapping
  const mappingEntries = Object.entries(mapping)
    .map(([name, placeId]) => `    "${name}": ${placeId ? `"${placeId}"` : 'null'}`)
    .join(',\n');
  
  // Replace the sunway_square object
  const newMapping = `  sunway_square: {\n${mappingEntries}\n  },`;
  content = content.replace(
    /sunway_square: \{[\s\S]*?\n  \},/,
    newMapping
  );
  
  fs.writeFileSync(mappingFilePath, content, 'utf-8');
  console.log('\n✅ Updated restaurant-places.js with place_ids');
}

// Main execution
const csvPath = process.argv[2] || path.join(__dirname, '../SunwaySquareURLs.csv');

if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV file not found: ${csvPath}`);
  console.log('Usage: node scripts/extract-place-ids.js <path-to-csv>');
  process.exit(1);
}

console.log(`📖 Reading CSV from: ${csvPath}`);
extractPlaceIdsFromCSV(csvPath)
  .then(mapping => {
    updateMappingFile(mapping);
    console.log('\n✅ Done! Place IDs extracted and mapping file updated.');
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

