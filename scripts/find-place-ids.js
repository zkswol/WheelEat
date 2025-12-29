/**
 * Script to find place_ids for restaurants using Places API Text Search
 * 
 * Usage:
 *   1. Set GOOGLE_PLACES_API_KEY environment variable
 *   2. Update the RESTAURANTS array with restaurant names
 *   3. Run: node scripts/find-place-ids.js
 * 
 * This will search for each restaurant and output the place_id
 */

// List of restaurants to find place_ids for
const RESTAURANTS = [
  "Manjoe Taiwanese Dumplings Sunway Square Mall",
  "JP & CO Sunway Square Mall",
  "Kanteen Sunway Square Mall",
  "Kedai Kopi Malaya Sunway Square Mall",
  "Kha Coffee Roaster Sunway Square Mall",
  "LLAO LLAO Sunway Square Mall",
  "Luckin Coffee Sunway Square Mall",
  "Mix.Store Sunway Square Mall",
  "Missy Sushi Sunway Square Mall",
  "Nasi Lemak Shop Sunway Square Mall",
  "Nine Dragon Char Chan Teng Sunway Square Mall",
  "Nippon Sushi Sunway Square Mall",
  "Odon Beyond Sunway Square Mall",
  "One Dish One Taste Sunway Square Mall",
  "Pak Curry Sunway Square Mall",
  "Ramen Mob Sunway Square Mall",
  "Richeese Factory Sunway Square Mall",
  "Sweetie Sunway Square Mall",
  "Salad Atelier Sunway Square Mall",
  "Super Matcha Sunway Square Mall",
  "Shabuyaki by Nippon Sushi Sunway Square Mall",
  "Stuff'D Sunway Square Mall",
  "Subway Sunway Square Mall",
  "The Public House Sunway Square Mall",
  "Tealive Plus Sunway Square Mall",
  "Tang Gui Fei Tanghulu Sunway Square Mall",
  "The Walking Hotpot Signature Sunway Square Mall",
  "The Chicken Rice Shop Sunway Square Mall",
  "Village Grocer Sunway Square Mall",
  "Yellow Bento Sunway Square Mall",
  "Yonny Sunway Square Mall",
  "Yama by Hojichaya Sunway Square Mall",
  "Yogurt Planet Sunway Square Mall",
  "Zus Coffee Sunway Square Mall",
];

const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('❌ API key not found!');
  console.log('Set it with:');
  console.log('  Windows: $env:GOOGLE_PLACES_API_KEY="your-key"');
  console.log('  Mac/Linux: export GOOGLE_PLACES_API_KEY="your-key"');
  process.exit(1);
}

async function findPlaceId(query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        success: true,
        place_id: result.place_id,
        name: result.name,
        rating: result.rating || null,
        reviews: result.user_ratings_total || null,
      };
    } else {
      return {
        success: false,
        error: data.status,
        error_message: data.error_message || 'No results found',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      error_message: error.message,
    };
  }
}

async function findAllPlaceIds() {
  console.log('🔍 Searching for place_ids...\n');
  console.log(`Found ${RESTAURANTS.length} restaurants to search\n`);
  
  const results = [];
  
  for (const query of RESTAURANTS) {
    // Extract restaurant name (before "Sunway Square Mall")
    const restaurantName = query.replace(' Sunway Square Mall', '').trim();
    
    process.stdout.write(`Searching for "${restaurantName}"... `);
    
    const result = await findPlaceId(query);
    
    if (result.success) {
      console.log(`✅ Found: ${result.place_id}`);
      results.push({
        restaurant: restaurantName,
        place_id: result.place_id,
        name: result.name,
        rating: result.rating,
        reviews: result.reviews,
      });
    } else {
      console.log(`❌ ${result.error}: ${result.error_message}`);
      results.push({
        restaurant: restaurantName,
        place_id: null,
        error: result.error_message,
      });
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n\n📋 Results Summary:\n');
  console.log('='.repeat(80));
  
  // Group by success/failure
  const successful = results.filter(r => r.place_id);
  const failed = results.filter(r => !r.place_id);
  
  console.log(`\n✅ Found ${successful.length} place_ids:\n`);
  successful.forEach(r => {
    console.log(`"${r.restaurant}": "${r.place_id}",`);
  });
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed to find ${failed.length} place_ids:\n`);
    failed.forEach(r => {
      console.log(`"${r.restaurant}": null, // ${r.error || 'Not found'}`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📝 Copy the successful results above and update restaurant-places.js');
  console.log('\n💡 For failed searches, try:');
  console.log('   - Different search queries');
  console.log('   - Manual search on Google Maps');
  console.log('   - Check if restaurant exists on Google Maps');
}

findAllPlaceIds().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

