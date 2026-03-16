import { Request, Response } from "express";
import ejs from "ejs";
import path from "path";
import { ColorService } from "../services/color.service";
import { BrowserService } from "../services/browser.service";
import { HistoryService } from "../services/history.service";
import { imageToBase64 } from "../utils/image.utils";

import { CVData, CVSchema } from "../data/cv.schema";
import { DataService } from "../services/data.service";

export class CVController {
  static async generate(req: Request, res: Response) {
    const start = Date.now();

    let validCV: CVData;
    let targetDomain = req.query.domain as string | undefined;
    let forcedColor = req.query.color as string | undefined;

    // 1. Try from Body (POST) - Client-side state
    if (req.body && req.body.cv) {
      console.log("CV Data received from Client");
      const parseResult = CVSchema.safeParse(req.body.cv);
      if (!parseResult.success) {
        res
          .status(400)
          .json({ error: "Invalid CV data", details: parseResult.error });
        return;
      }
      validCV = parseResult.data;
      if (req.body.settings?.domain) targetDomain = req.body.settings.domain;
      if (req.body.settings?.color) forcedColor = req.body.settings.color;
    } else {
      // 2. Try from Server state (Legacy / Default)
      try {
        validCV = DataService.getData();
      } catch {
        res.status(500).send("Default CV Data not found.");
        return;
      }
    }

    console.log(`\n───────────────────────────────────────────────`);
    console.log(`📋 NEW GENERATION REQUEST RECEIVED`);

    try {
      // 1. Determine Color
      let finalColor = "005eb8";
      if (forcedColor) {
        console.log(`🎨 Using forced color.`);
        finalColor = forcedColor;
      } else if (targetDomain) {
        console.log(`🔍 Analyzing brand color...`);
        finalColor = await ColorService.findBrandColor(targetDomain);
        console.log(`✅ Color selected: ${finalColor}`);
      }

      // 2. Prepare Data
      const base64Image = imageToBase64(validCV.header.picturePath);

      // Format Links
      const linkedinUrl = validCV.header.contact.linkedin.startsWith("http")
        ? validCV.header.contact.linkedin
        : `https://${validCV.header.contact.linkedin}`;
      const githubUrl = validCV.header.contact.github.startsWith("http")
        ? validCV.header.contact.github
        : `https://${validCV.header.contact.github}`;

      let linkedinLabel = validCV.header.contact.linkedin
        .replace(/(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "")
        .replace(/\/$/, "");
      linkedinLabel = linkedinLabel.split("-").slice(0, 2).join("-");

      let githubLabel = validCV.header.contact.github
        .replace(/(https?:\/\/)?(www\.)?github\.com\//, "")
        .replace(/\/$/, "");
      githubLabel = `@${githubLabel}`;

      const theme = (req.query.theme as string) || "light";
      const viewData = {
        ...validCV,
        header: {
          ...validCV.header,
          pictureBase64: base64Image,
          contact: {
            ...validCV.header.contact,
            linkedinUrl,
            linkedinLabel,
            githubUrl,
            githubLabel,
          },
        },
        mainColor: `#${finalColor.replace("#", "")}`,
        theme,
      };

      // 3. Render HTML with EJS
      console.log(`🖨️  Rendering EJS template...`);
      const templatePath = path.join(__dirname, "../views/cv.ejs");
      const htmlContent = (await ejs.renderFile(
        templatePath,
        viewData,
      )) as string;

      // 4. Generate PDF
      console.log(`📄 Generating PDF...`);
      const pdfBuffer = await BrowserService.generatePdf(htmlContent);

      // 5. Send Response
      const sanitizedDomain = targetDomain
        ? targetDomain.replace(/[^a-zA-Z0-9.-]/g, "")
        : null;
      const filename = sanitizedDomain
        ? `cv-${sanitizedDomain}.pdf`
        : `cv-generated.pdf`;
      const duration = ((Date.now() - start) / 1000).toFixed(2);

      console.log(`🎉 SUCCESS! CV generated in ${duration}s.`);
      console.log(`───────────────────────────────────────────────\n`);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Content-Length": pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (error) {
      console.error(`💥 CRITICAL ERROR:`, error);
      res.status(500).send("Error generating CV");
    }
  }

  static async getColor(req: Request, res: Response) {
    const domain = req.query.domain as string;
    if (!domain) {
      res.status(400).json({ error: "Domain required" });
      return;
    }
    const color = await ColorService.findBrandColor(domain);
    res.json({ color });
  }

  static async getHistory(req: Request, res: Response) {
    const files = HistoryService.getList();
    res.json(files);
  }

  static async deleteHistory(req: Request, res: Response) {
    const { filename } = req.params;
    const success = HistoryService.deleteFile(filename);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "File not found or invalid" });
    }
  }
}
