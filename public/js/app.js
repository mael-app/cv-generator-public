function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
        .map((file) => {
          const safeName = escapeHtml(file.filename);
          return `
                <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; padding: 0.5rem; background: #f8fafc; border-radius: 4px;">
                    <div>
                        <a href="/output/${safeName}" target="_blank" style="text-decoration: none; color: #333; font-weight: 500;">${safeName}</a>
                        <div style="font-size: 0.8rem; color: #666;">${new Date(file.createdAt).toLocaleString()} - ${(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button onclick="deleteFile('${safeName}')" style="background: #ef4444; color: white; padding: 0.25rem 0.5rem; font-size: 0.8rem; width: auto;">Delete</button>
                </li>
            `;
        })
        .join("");
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  window.deleteFile = async (filename) => {
    if (!confirm("Delete this file?")) return;
    try {
      await fetch(`/api/history/${filename}`, { method: "DELETE" });
      loadHistory();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  if (historyList) loadHistory();
});
