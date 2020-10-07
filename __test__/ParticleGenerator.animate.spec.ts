import { RAFTicker, RAFTickerEvent, RAFTickerEventType } from "raf-ticker";
import { GenerationMode, ParticleGenerator } from "../src";
import { getTestGenerators } from "./ParticleGenerator.common";

describe("ParticleGenerator", () => {
  test("animate", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(200, 200));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(400, 400));

    expect(container.particles.length).toBe(1);
    expect(container.particles[0].ratio).toBeCloseTo(0.021);
  });

  test("animate : skip generate", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(20000, 20000));

    expect(container.particles.length).toBe(47);
    expect(container.particles[0].ratio).toBeCloseTo(0.98);
  });

  test("animate : close valve", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();
    generator.valve.closeValve();

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(20000, 20000));

    expect(container.particles.length).toBe(0);
  });

  test("loop", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.modeManager.mode = GenerationMode.LOOP;
    generator.play();

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));

    expect(container.particles.length).toBe(48);
    expect(container.particles[0].ratio).toBeCloseTo(0.0);
  });

  test("play and loop", () => {
    const { generator } = getTestGenerators();
    const container = generator.particleContainer;
    generator.play();
    generator.generateAll();

    generator.modeManager.mode = GenerationMode.LOOP;
    expect(generator.isPlaying).toBe(true);
    expect(container.particles.length).toBe(0);

    generator.modeManager.mode = GenerationMode.LOOP;
    expect(generator.isPlaying).toBe(true);

    generator.modeManager.mode = GenerationMode.SEQUENTIAL;
  });

  test("dispose and play", () => {
    const { generator } = getTestGenerators();

    generator.play();
    generator.dispose();
    expect(generator.particleContainer).toBeNull();

    generator.play();
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    expect(generator.particleContainer).toBeNull();
  });

  test("dispose and play loop", () => {
    const { generator } = getTestGenerators();
    generator.modeManager.mode = GenerationMode.LOOP;
    generator.play();
    generator.dispose();
    expect(generator.particleContainer).toBeNull();

    generator.play();
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    expect(generator.particleContainer).toBeNull();
  });
});
