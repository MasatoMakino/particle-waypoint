import { RAFTicker, RAFTickerEventContext } from "@masatomakino/raf-ticker";
import { GenerationMode, ParticleGenerator } from "../src";
import { getTestGenerators } from "./ParticleGenerator.common";

describe("ParticleGenerator", () => {
  test("animate", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(200, 200));
    RAFTicker.emit("tick", new RAFTickerEventContext(400, 400));

    expect(container.particles.length).toBe(1);
    expect(container.particles[0].ratio).toBeCloseTo(0.021);
  });

  test("animate : skip generate", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(20000, 20000));

    expect(container.particles.length).toBe(47);
    expect(container.particles[0].ratio).toBeCloseTo(0.98);
  });

  test("animate : close valve", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();
    generator.valve.close();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    RAFTicker.emit("tick", new RAFTickerEventContext(20000, 20000));

    expect(container.particles.length).toBe(0);
  });

  test("loop", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.modeManager.mode = "loop";
    generator.play();

    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));

    expect(container.particles.length).toBe(48);
    expect(container.particles[0].ratio).toBeCloseTo(0.0);
  });

  test("play and loop", () => {
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
  });

  test("dispose and play", () => {
    const { generator } = getTestGenerators();

    generator.play();
    generator.dispose();
    expect(generator.particleContainer).toBeNull();

    generator.play();
    RAFTicker.emit("tick", new RAFTickerEventContext(0, 0));
    expect(generator.particleContainer).toBeNull();
  });

  test("dispose and play loop", () => {
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
