import { describe, test, expect, vi } from "vitest";
import { RAFTicker, RAFTickerEventContext } from "@masatomakino/raf-ticker";
import { getTestGenerators } from "./ParticleGenerator.common.js";

describe("ParticleGenerator", () => {
  test("再生中は生成間隔ごとにパーティクルを生成し、経路上を移動させる", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(200, 200));
    RAFTicker.emit("tick", new RAFTickerEventContext(400, 400));

    expect(container.particles.length).toBe(1);
    expect(container.particles[0].ratio).toBeCloseTo(0.021);
  });

  test("長い経過時間のフレームでは、その間に生成されるはずのパーティクルをまとめて生成する", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(20000, 20000));

    expect(container.particles.length).toBe(47);
    expect(container.particles[0].ratio).toBeCloseTo(0.98);
  });

  test("バルブを閉じている間は、再生中でもパーティクルを生成しない", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();
    generator.valve.close();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(20000, 20000));

    expect(container.particles.length).toBe(0);
  });

  test("loop モードで再生すると、経路を埋めるパーティクルを最初のフレームで生成する", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.modeManager.mode = "loop";
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));

    expect(container.particles.length).toBe(48);
    expect(container.particles[0].ratio).toBeCloseTo(0.0);
  });

  test("再生中にモードを変えると、パーティクルを消して再生を続ける", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();
    generator.generateAll();

    generator.modeManager.mode = "loop";
    expect(generator.isPlaying).toBe(true);
    expect(container.particles.length).toBe(0);

    generator.modeManager.mode = "loop";
    expect(generator.isPlaying).toBe(true);

    generator.modeManager.mode = "sequential";
    expect(generator.isPlaying).toBe(true);
  });

  test("dispose の後は、play してもパーティクルを生成しない", () => {
    const { generator } = getTestGenerators();

    generator.play();
    generator.dispose();
    expect(generator.particleContainer).toBeNull();

    generator.play();
    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    expect(generator.particleContainer).toBeNull();
  });

  test("loop モードでも、dispose の後は play してもパーティクルを生成しない", () => {
    const { generator } = getTestGenerators();
    generator.modeManager.mode = "loop";
    generator.play();
    generator.dispose();
    expect(generator.particleContainer).toBeNull();

    generator.play();
    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    expect(generator.particleContainer).toBeNull();
  });
});
