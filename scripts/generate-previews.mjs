import fs from "fs";
import puppeteer from "puppeteer";

const templates = fs
  .readdirSync("./src/views")
  .filter((fileName) => fileName.endsWith(".ejs"))
  .map((fileName) => fileName.replace(/\.ejs$/, ""))
  .sort();
const cvJson = fs.readFileSync("./cv.example.json", "utf8");

const placeholderImage = "public/default.jpg";
if (!fs.existsSync(placeholderImage)) {
  console.error(
    `Placeholder image ${placeholderImage} not found. Please add a placeholder image at ${placeholderImage}.`,
  );
  process.exit(1);
}

const placeholderImageData = fs.readFileSync(placeholderImage);
const placeholderImageBase64 = `data:image/jpeg;base64,${placeholderImageData.toString(
  "base64",
)}`;

async function checkApi() {
  try {
    const res = await fetch("http://localhost:3000/api/preview", {
      method: "POST",
      body: new FormData(), // Empty form data just to check if the endpoint is responsive
    });

    if (res.status === 400) {
      return true;
    }

    console.warn(
      `API responded with status ${res.status}. It might be running but not responding correctly.`,
    );
    return false;
  } catch {
    return false;
  }
}

async function main(templateName) {
  console.log("Checking if API is running...");
  const apiRunning = await checkApi();
  if (!apiRunning) {
    console.error(
      "API is not running. Please start the API server before generating previews.",
    );
    process.exit(1);
  }

  if (!fs.existsSync("./public/templates")) {
    fs.mkdirSync("./public/templates", { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: true });
  const failedTemplates = [];

  async function processTemplate(template) {
    console.log(`Generating preview for ${template}...`);

    const formData = new FormData();
    formData.append("cv", cvJson);
    formData.append("cvTemplate", template);
    formData.append("theme", "light");
    formData.append("photo", placeholderImageBase64);

    const res = await fetch("http://localhost:3000/api/preview", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch preview for ${template}`,
        await res.text(),
      );
      failedTemplates.push(template);
      return;
    }

    const html = await res.text();

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.setViewport({ width: 800, height: 1131, deviceScaleFactor: 1 });

    await page.screenshot({
      path: `./public/templates/${template}.png`,
      clip: { x: 0, y: 0, width: 800, height: 1131 },
    });
    await page.close();
    console.log(`Saved public/templates/${template}.png`);
  }

  if (templateName) {
    await processTemplate(templateName);
  } else {
    for (const template of templates) {
      await processTemplate(template);
    }
  }

  await browser.close();

  if (failedTemplates.length > 0) {
    throw new Error(
      `Preview generation failed for: ${failedTemplates.join(", ")}`,
    );
  }
}

const templateName = process.argv[2];
if (templateName) {
  if (!templates.includes(templateName)) {
    console.error(
      `Template ${templateName} not found. Available templates: ${templates.join(
        ", ",
      )}`,
    );
    process.exit(1);
  }
  console.log(`Generating preview for template: ${templateName}`);
  main(templateName).catch(console.error);
} else {
  console.log("Generating previews for all templates...");
  main().catch(console.error);
}
