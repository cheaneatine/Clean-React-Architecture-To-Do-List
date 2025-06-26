export function useThemeUseCase() {
  const THEME_COLOR_KEY = "theme-color";

  function isColorLight(hex: string) {
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 186;
  }

  function applyThemeColor(color: string) {
    document.documentElement.style.setProperty("--primary-color", color);
    localStorage.setItem(THEME_COLOR_KEY, color);
  }

  function loadThemeColor(): string {
    return localStorage.getItem(THEME_COLOR_KEY) || "#3b82f6";
  }

  return {
    isColorLight,
    applyThemeColor,
    loadThemeColor,
  };
}
