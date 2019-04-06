import { ParticleGeneratorUtility } from "../src/ParticleGenerator";

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
