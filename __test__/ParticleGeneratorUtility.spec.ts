import { ParticleGeneratorUtility } from "../src/generator/ParticleGeneratorUtility";

describe("ParticleGeneratorUtility", () => {
  test("interval", () => {
    expect(ParticleGeneratorUtility.getInterval(0.5, 4)).toBeCloseTo(500);
  });
  test("speed", () => {
    expect(ParticleGeneratorUtility.getSpeed(300, 4)).toBeCloseTo(
      (1.0 / 1200) * 1000
    );
  });
});
