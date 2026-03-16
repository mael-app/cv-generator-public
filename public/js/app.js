document.addEventListener("DOMContentLoaded", () => {
  const domainInput = document.getElementById("domain");
  const colorInput = document.getElementById("color");
  const historyList = document.getElementById("historyList");

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Auto-fetch color
  domainInput.addEventListener(
    "input",
    debounce(async (e) => {
      const domain = e.target.value;
      if (domain.length > 3) {
        try {
          const response = await fetch(`/api/color?domain=${domain}`);
          const data = await response.json();
          if (data.color) {
            colorInput.value = data.color;

            // Update global colors
            const root = document.documentElement;
            root.style.setProperty("--primary", data.color);
            root.style.setProperty("--dynamic-bg", data.color);

            // Update button shadow with new color
            const rgb = hexToRgb(data.color);
            if (rgb) {
              const shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`;
              // We could set a variable for shadow but this is simple enough
            }
          }
        } catch (err) {
          console.error("Failed to fetch color", err);
        }
      }
    }, 500),
  );

  // History Logic
  const loadHistory = async () => {
    try {
      const response = await fetch("/api/history");
      const files = await response.json();

      historyList.innerHTML = files
        .map(
          (file) => `
                <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; padding: 0.5rem; background: #f8fafc; border-radius: 4px;">
                    <div>
                        <a href="/output/${file.filename}" target="_blank" style="text-decoration: none; color: #333; font-weight: 500;">${file.filename}</a>
                        <div style="font-size: 0.8rem; color: #666;">${new Date(file.createdAt).toLocaleString()} - ${(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button onclick="deleteFile('${file.filename}')" style="background: #ef4444; color: white; padding: 0.25rem 0.5rem; font-size: 0.8rem; width: auto;">Suppr.</button>
                </li>
            `,
        )
        .join("");
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  window.deleteFile = async (filename) => {
    if (!confirm("Supprimer ce fichier ?")) return;
    try {
      await fetch(`/api/history/${filename}`, { method: "DELETE" });
      loadHistory();
    } catch (e) {
      alert("Erreur: " + e.message);
    }
  };

  if (historyList) loadHistory();
});

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
