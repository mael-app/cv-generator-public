import axios from "axios";
import { ColorService } from "./color.service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("get-image-colors", () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve([
      {
        hex: () => "#ff0000",
        hsl: () => [0, 1, 0.5],
      },
    ]);
  });
});

describe("ColorService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a color from Clearbit if successful", async () => {
    // Mock axios success for Clearbit
    mockedAxios.get.mockResolvedValueOnce({
      data: Buffer.from("fake-image"),
    });

    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#ff0000");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("logo.clearbit.com"),
      expect.any(Object),
    );
  });

  it("should fallback to Google if Clearbit fails", async () => {
    // Mock Clearbit failure
    mockedAxios.get.mockRejectedValueOnce(new Error("Clearbit failed"));
    // Mock Google success
    mockedAxios.get.mockResolvedValueOnce({
      data: Buffer.from("fake-image"),
    });

    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#ff0000");
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("google.com"),
      expect.any(Object),
    );
  });

  it("should return default color if both fail", async () => {
    // Mock both failure
    mockedAxios.get.mockRejectedValue(new Error("Failed"));

    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#005eb8");
  });
});
