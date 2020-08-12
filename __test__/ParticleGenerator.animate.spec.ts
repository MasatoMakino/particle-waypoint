import { RAFTicker, RAFTickerEvent, RAFTickerEventType } from "raf-ticker";
import { ParticleGenerator } from "../src";
import { getTestGenerators } from "./ParticleGenerator.common";

describe("ParticleGenerator", () => {
  test("animate", () => {
    const { generator } = getTestGenerators();
    generator.play();

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(200, 200));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(400, 400));

    expect(generator.particles.length).toBe(1);
    expect(generator.particles[0].ratio).toBeCloseTo(0.021);
  });

  test("animate : skip generate", () => {
    const { generator } = getTestGenerators();
    generator.play();

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(20000, 20000));

    expect(generator.particles.length).toBe(47);
    expect(generator.particles[0].ratio).toBeCloseTo(0.98);
  });

  test("animate : close valve", () => {
    const { generator } = getTestGenerators();
    generator.play();
    generator.closeValve();

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(20000, 20000));

    expect(generator.particles.length).toBe(0);
  });

  test("loop", () => {
    const { generator } = getTestGenerators();
    generator.isLoop = true;
    generator.play();

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));

    expect(generator.particles.length).toBe(48);
    expect(generator.particles[0].ratio).toBeCloseTo(0.0);
  });

  test("dispose and play", () => {
    const { generator } = getTestGenerators();
    generator.play();
    generator.dispose();
    expect(generator.particles).toBeNull();

    generator.play();
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    expect(generator.particles).toBeNull();
  });

  test("dispose and play loop", () => {
    const { generator } = getTestGenerators();
    generator.isLoop = true;
    generator.play();
    generator.dispose();
    expect(generator.particles).toBeNull();

    generator.play();
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    expect(generator.particles).toBeNull();
  });
});
