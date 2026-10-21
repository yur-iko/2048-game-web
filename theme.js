(() => {
  'use strict';

  const key = 'good-things-2048-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let choice = null;
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') choice = saved;
  } catch {
    // A blocked storage area should not prevent switching the current page.
  }

  function apply() {
    const theme = choice || (systemTheme.matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#171d1a' : '#f5f3eb';
    const button = document.querySelector('#theme-toggle');
    if (!button) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    button.setAttribute('aria-label', `Switch to ${next} mode`);
    button.title = `Switch to ${next} mode`;
    document.querySelector('#theme-label').textContent = next === 'dark' ? 'Dark mode' : 'Light mode';
  }

  // Apply before the stylesheet paints to avoid a light flash on dark pages.
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelector('#theme-toggle').addEventListener('click', () => {
      choice = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, choice); } catch { /* Keep the in-memory choice. */ }
      apply();
    });
  });
  systemTheme.addEventListener('change', () => { if (!choice) apply(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    choice = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null;
    apply();
  });
})();
