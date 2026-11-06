import { describe, test, expect, vi } from "vitest";
import { RAFTicker, RAFTickerEventContext } from "@masatomakino/raf-ticker";
import { getTestGenerators } from "./ParticleGenerator.common.js";

describe("ParticleGenerator", () => {
  // Math.random を 0.5 に固定し、probability との大小で生成の有無を決める。
  const spyMath = vi.spyOn(Math, "random").mockReturnValue(0.5);

  test("generateAll は乱数が probability 以上のとき生成しない", () => {
    const { generator } = getTestGenerators();
    generator.probability = 0.1;
    generator.generateAll();
    expect(generator.particleContainer.particles.length).toBe(0);
  });

  test("アニメーション中も、乱数が probability 以上のとき生成しない", () => {
    const { generator } = getTestGenerators();

    generator.probability = 0.1;
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(400, 400));

    expect(generator.particleContainer.particles.length).toBe(0);
  });

  test("アニメーション中、乱数が probability 未満のとき生成する", () => {
    const { generator } = getTestGenerators();

    generator.probability = 0.8;
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(400, 400));

    expect(generator.particleContainer.particles.length).toBe(1);
  });
});
