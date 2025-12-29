// Restaurant to Google Places place_id mapping
// This maps restaurant names to their Google Places place_id for accurate rating/review fetching
// Format: { mallId: { restaurantName: place_id } }

export const RESTAURANT_PLACE_IDS = {
  sunway_square: {
    "103 Coffee": null, // Will be populated from CSV or manual entry
    "A'Decade": null,
    "Armoury Steakhouse": null,
    "BESTORE": null,
    "Black Canyon": null,
    "Ba Shu Jia Yan": null,
    "Beutea": null,
    "Bread History": null,
    "Chagee": null,
    "Coffee Bean": null,
    "Christine's Bakery Cafe": null,
    "CHUCHAT": null,
    "ChaPanda": null,
    "CU Mart": null,
    "Come Buy Yakiniku": null,
    "Count (Flower Drum)": null,
    "Chatramue": null,
    "DOZO": null,
    "Empire Sushi": null,
    "Far Coffee": null,
    "Fong Woh Tong": null,
    "Gong Luck Cafe": null,
    "Gokoku Japanese Bakery": null,
    "Gong Cha": null,
    "Hock Kee Kopitiam": null,
    "Han Bun Sik": null,
    "Happy Potato": null,
    "I'm Bagel": null,
    "I LIKE & Yogurt In A Can": null,
    "JP & CO": null,
    "Kanteen": null,
    "Kenangan Coffee": null,
    "Kedai Kopi Malaya": null,
    "Kha Coffee Roaster": null,
    "LLAO LLAO": null,
    "Luckin": null,
    "Manjoe": null,
    "Mix.Store": null,
    "Mr. Wu": null,
    "Missy Sushi": null,
    "Nasi Lemak Shop": null,
    "Nine Dragon Char Chan Teng (Kowloon Cafe)": null,
    "Nippon Sushi": null,
    "Odon Beyond": null,
    "One Dish One Taste": null,
    "Pak Curry": null,
    "Ramen Mob": null,
    "Richeese Factory": null,
    "Sweetie": null,
    "Salad Atelier": null,
    "Super Matcha": null,
    "Shabuyaki by Nippon Sushi": null,
    "Stuff'D": null,
    "Subway": null,
    "The Public House": null,
    "Tealive Plus": null,
    "Tang Gui Fei Tanghulu": null,
    "The Walking Hotpot Signature": null,
    "The Chicken Rice Shop": null,
    "Village Grocer": null,
    "Yellow Bento": null,
    "Yonny": null,
    "Yama by Hojichaya": null,
    "Yogurt Planet": null,
    "Zus Coffee": null,
    "Zok Noodle House": null,
  },
};

/**
 * Get place_id for a restaurant
 * @param {string} restaurantName - Name of the restaurant
 * @param {string} mallId - Mall ID (default: 'sunway_square')
 * @returns {string|null} - place_id or null if not found
 */
export function getPlaceId(restaurantName, mallId = 'sunway_square') {
  const mallMapping = RESTAURANT_PLACE_IDS[mallId];
  if (!mallMapping) return null;
  return mallMapping[restaurantName] || null;
}

/**
 * Extract place_id from a Google Maps URL (shortened or full)
 * This function attempts to resolve shortened URLs and extract place_id
 * @param {string} url - Google Maps URL
 * @returns {Promise<string|null>} - place_id or null
 */
export async function extractPlaceIdFromUrl(url) {
  if (!url || url === 'null' || url.trim() === '') return null;
  
  try {
    // If it's already a place_id format, return it
    if (url.startsWith('Ch') || /^[A-Za-z0-9_-]{27}$/.test(url)) {
      return url;
    }
    
    // If it's a shortened URL, we need to resolve it
    // For now, we'll return null and let the user manually add place_ids
    // In production, you could make a HEAD request to resolve the shortened URL
    // and extract place_id from the Location header or final URL
    
    // Check if it's a full Google Maps URL with place_id
    const placeIdMatch = url.match(/[?&]place_id=([A-Za-z0-9_-]+)/);
    if (placeIdMatch) {
      return placeIdMatch[1];
    }
    
    // Check if it's a maps.google.com URL with data parameter
    const dataMatch = url.match(/data=([^&]+)/);
    if (dataMatch) {
      // Try to decode and extract place_id
      try {
        const decoded = decodeURIComponent(dataMatch[1]);
        const placeIdInData = decoded.match(/place_id[=:]([A-Za-z0-9_-]+)/);
        if (placeIdInData) {
          return placeIdInData[1];
        }
      } catch (e) {
        // Ignore decode errors
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error extracting place_id from URL ${url}:`, error);
    return null;
  }
}

