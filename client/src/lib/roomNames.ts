/**
 * Room name translation utility.
 * DB stores room names in Vietnamese (e.g. "Phòng Superior").
 * When UI is in EN mode, we translate them to English (e.g. "Superior Room").
 */

const roomNameMap: Record<string, string> = {
  "Phòng Superior": "Superior Room",
  "Phòng Deluxe": "Deluxe Room",
  "Phòng Deluxe Balcony": "Deluxe Balcony Room",
  "Phòng Premier": "Premier Room",
  "Phòng Junior Suite": "Junior Suite",
  "Phòng Imperial Suite": "Imperial Suite",
};

/**
 * Translate a room name based on the current language.
 * If lang is "en", returns the English name.
 * If lang is "vi" or the name is not found in the map, returns the original name.
 */
export function translateRoomName(name: string, lang: "vi" | "en"): string {
  if (lang === "vi") return name;
  return roomNameMap[name] || name.replace(/^Phòng\s+/, "") + " Room";
}
