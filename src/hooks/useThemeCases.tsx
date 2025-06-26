export function useThemeUseCase() {
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
    // Update CSS variable
    document.documentElement.style.setProperty("--primary-color", color);

    // Adjust all active filter buttons
    const light = isColorLight(color);
    document.querySelectorAll(".todo-filter-btn.active").forEach((btn) => {
      if (light) {
        btn.classList.add("light-active");
      } else {
        btn.classList.remove("light-active");
      }
    });
  }

  return {
    isColorLight,
    applyThemeColor,
  };
}
