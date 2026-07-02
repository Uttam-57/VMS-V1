/**
 * Generates a consistent hex color from a string (name-based avatar color).
 * Used for user avatars in Navbar and Profile page.
 * @param {string} str - Input string (e.g., user name)
 * @returns {string} Hex color string (e.g., "#A3B1C2")
 */
export const stringToColor = (str) => {
  if (!str) return "#cbd5e1";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};
