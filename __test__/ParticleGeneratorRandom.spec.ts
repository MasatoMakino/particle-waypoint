import {
  RAFTicker,
  RAFTickerEvent,
  RAFTickerEventType,
} from "@masatomakino/raf-ticker";
import { getTestGenerators } from "./ParticleGenerator.common";
import { ParticleGenerator } from "../src/index";

describe("ParticleGenerator", () => {
  const spyMath = jest.spyOn(Math, "random").mockReturnValue(0.5);

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

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(400, 400));

    expect(generator.particleContainer.particles.length).toBe(0);
  });

  test("generate particle in random : true", () => {
    const { generator } = getTestGenerators();

    generator.probability = 0.8;
    generator.play();

    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(0, 0));
    RAFTicker.emit(RAFTickerEventType.tick, new RAFTickerEvent(400, 400));

    expect(generator.particleContainer.particles.length).toBe(1);
  });
});
