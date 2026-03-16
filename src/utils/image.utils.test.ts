import { imageToBase64 } from "./image.utils";
import fs from "fs";

jest.mock("fs");

describe("imageToBase64", () => {
  const mockExistsSync = fs.existsSync as jest.Mock;
  const mockReadFileSync = fs.readFileSync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return base64 string for existing image", () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(Buffer.from("fake-image-content"));

    // Allow path.resolve to work normally, we only mock fs
    const result = imageToBase64("test.png");

    expect(result).toBe("data:image/png;base64,ZmFrZS1pbWFnZS1jb250ZW50"); // 'ZmFrZS...' is base64 of 'fake-image-content'
    expect(mockExistsSync).toHaveBeenCalled();
    expect(mockReadFileSync).toHaveBeenCalled();
  });

  it("should return empty string if file does not exist", () => {
    mockExistsSync.mockReturnValue(false);
    const result = imageToBase64("non-existent.png");
    expect(result).toBe("");
  });

  it("should return empty string on error", () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockImplementation(() => {
      throw new Error("Read error");
    });
    const result = imageToBase64("error.png");
    expect(result).toBe("");
  });
});
