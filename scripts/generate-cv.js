const { exec } = require("child_process");
const os = require("os");

const domain = process.argv[2] || "rockstargames.com";
const timestamp = Math.floor(Date.now() / 1000);
const outputDir = "output";
const filename = `${outputDir}/cv_${timestamp}.pdf`;
const url = `http://localhost:3000/generate-cv?domain=${domain}`;

// Ensure output dir exists (simple check)
const fs = require("fs");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// OS specific command to open file
const openCommand =
  os.platform() === "win32"
    ? "start"
    : os.platform() === "darwin"
      ? "open"
      : "xdg-open";

// Use axios or fetch to download
const http = require("http");
const file = fs.createWriteStream(filename);

console.log(`⬇️  Downloading CV for ${domain}...`);

http
  .get(url, function (response) {
    if (response.statusCode !== 200) {
      console.error(
        `❌ Failed to generate CV. Status Code: ${response.statusCode}`,
      );
      return;
    }
    response.pipe(file);
    file.on("finish", function () {
      console.log(`✅ CV saved to ${filename}`);
      file.close(() => {
        // Open the file
        exec(`${openCommand} ${filename}`, (err) => {
          if (err) console.error("Failed to open file:", err);
        });
      });
    });
  })
  .on("error", function (err) {
    fs.unlink(filename, () => {});
    console.error("❌ Error downloading CV:", err.message);
  });
