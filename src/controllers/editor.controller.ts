import { Request, Response } from "express";
import { DataService } from "../services/data.service";
import { myCV } from "../data/cv.data"; // For initial seed check if needed

export class EditorController {
  static async editor(req: Request, res: Response) {
    try {
      const data = DataService.getData();
      res.render("editor", { data });
    } catch {
      // Seed if missing
      DataService.seed(myCV);
      res.render("editor", { data: myCV });
    }
  }
}
