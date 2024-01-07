import { describe, test, expect, vi } from "vitest";
import { RAFTicker, RAFTickerEventContext } from "@masatomakino/raf-ticker";
import { getTestGenerators } from "./ParticleGenerator.common.js";

describe("ParticleGenerator", () => {
  const spyMath = vi.spyOn(Math, "random").mockReturnValue(0.5);

  test("generate particle in random : generateAll", () => {
    const { generator } = getTestGenerators();
    generator.probability = 0.1;
    generator.generateAll();
    expect(generator.particleContainer.particles.length).toBe(0);
  });

  test("generate particle in random : false", () => {
    const { generator } = getTestGenerators();

    generator.probability = 0.1;
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(400, 400));

    expect(generator.particleContainer.particles.length).toBe(0);
  });

  test("generate particle in random : true", () => {
    const { generator } = getTestGenerators();

    generator.probability = 0.8;
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(400, 400));

    expect(generator.particleContainer.particles.length).toBe(1);
  });
});
