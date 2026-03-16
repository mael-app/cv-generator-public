import { DataService } from "./data.service";
import fs from "fs";
import { CVData, CVSchema } from "../data/cv.schema";

jest.mock("fs");
jest.mock("../data/cv.schema", () => ({
  CVSchema: {
    parse: jest.fn(),
  },
}));

// Mock cv.data module to avoid loading actual files
jest.mock("../data/cv.data", () => ({
  myCV: {
    header: {
      picturePath: "test.png",
      name: "Test User",
      title: "Test Developer",
      jobSearchGoal: "Test goal",
      age: "25 ans",
      contact: {
        location: "Test City",
        email: "test@example.com",
        github: "github.com/test",
        linkedin: "linkedin.com/in/test",
        phone: "+33 6 00 00 00 00",
      },
    },
    experiences: [],
    projects: [],
    education: [],
    skills: [],
    languages: [],
    softSkills: [],
  },
}));

const mockCVData: CVData = {
  header: {
    picturePath: "test.png",
    name: "Test User",
    title: "Test Developer",
    jobSearchGoal: "Test goal",
    age: "25 ans",
    contact: {
      location: "Test City",
      email: "test@example.com",
      github: "github.com/test",
      linkedin: "linkedin.com/in/test",
      phone: "+33 6 00 00 00 00",
    },
  },
  experiences: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
  softSkills: [],
};

describe("DataService", () => {
  const mockExistsSync = fs.existsSync as jest.Mock;
  const mockReadFileSync = fs.readFileSync as jest.Mock;
  const mockWriteFileSync = fs.writeFileSync as jest.Mock;
  const mockParse = CVSchema.parse as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getData", () => {
    it("should seed data if file does not exist", () => {
      mockExistsSync.mockReturnValue(false);
      mockParse.mockReturnValue(mockCVData); // validation pass
      mockReadFileSync.mockReturnValue(JSON.stringify(mockCVData));

      const data = DataService.getData();

      expect(mockWriteFileSync).toHaveBeenCalled(); // Seeding happened
      expect(data).toEqual(mockCVData);
    });

    it("should return parsed data if file exists", () => {
      mockExistsSync.mockReturnValue(true);
      const testData = { ...mockCVData, test: true };
      mockReadFileSync.mockReturnValue(JSON.stringify(testData));

      const data = DataService.getData();

      expect(mockWriteFileSync).not.toHaveBeenCalled();
      expect(data).toEqual(testData);
    });

    it("should throw error if JSON is invalid", () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue("invalid-json");

      expect(() => DataService.getData()).toThrow();
    });
  });

  describe("saveData", () => {
    it("should validate and save data", () => {
      const newData = { ...mockCVData, updated: true };
      mockParse.mockReturnValue(newData); // Zod validation pass

      DataService.saveData(newData as unknown as CVData);

      expect(mockParse).toHaveBeenCalledWith(newData);
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        expect.stringContaining("cv.json"),
        JSON.stringify(newData, null, 2),
      );
    });

    it("should throw if validation fails", () => {
      mockParse.mockImplementation(() => {
        throw new Error("Validation failed");
      });

      expect(() => DataService.saveData({} as unknown as CVData)).toThrow(
        "Validation failed",
      );
      expect(mockWriteFileSync).not.toHaveBeenCalled();
    });
  });
});
