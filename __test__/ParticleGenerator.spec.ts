import { describe, test, expect, vi } from "vitest";
import { ParticleGenerator } from "../src/index.js";
import { getTestGenerators } from "./ParticleGenerator.common.js";

describe("ParticleGenerator", () => {
  const spyWarn = vi.spyOn(console, "warn");
  spyWarn.mockImplementation((x) => x);
  const spyTrace = vi.spyOn(console, "trace");
  spyTrace.mockImplementation((x) => x);

  const { generator, way } = getTestGenerators();

  test("constructor", () => {
    expect(generator).toBeTruthy();
    expect(generator.animator.speedPerSec).toBe(0.07);
    expect(generator.animator.generationInterval).toBe(300);
    expect(generator.probability).toBe(1.0);
    expect(generator.modeManager).toBeTruthy();
    expect(generator.modeManager.mode).toBe("sequential");
    expect(generator.particleContainer.visible).toBe(true);
    expect(generator.multipleWays.waySelectType).toBe("sequential");
  });

  test("constructor : array of way", () => {
    const gen = new ParticleGenerator([way]);
    expect(gen.multipleWays.ways.length).toBe([way].length);
  });

  test("constructor : empty option", () => {
    const gen = new ParticleGenerator(way, {});
    expect(gen.modeManager.mode).toBe("sequential");
    expect(gen.animator.ease).toBeFalsy();
    expect(gen.probability).toBe(1.0);
  });

  test("constructor : option", () => {
    const gen = new ParticleGenerator(way, {
      generationMode: "loop",
      ease: (n) => n,
      probability: 0.8,
    });
    expect(gen.modeManager.mode).toBe("loop");
    expect(gen.animator.ease).toBeTruthy();
    expect(gen.probability).toBe(0.8);
  });

  test("play", () => {
    expect(generator.isPlaying).toBe(false);
    generator.play();
    expect(generator.isPlaying).toBe(true);
    generator.play();
    expect(generator.isPlaying).toBe(true);
  });

  test("play : loop", () => {
    const gen = new ParticleGenerator(way, {
      generationMode: "loop",
    });
    gen.play();
    expect(gen.isPlaying).toBe(true);
    expect(gen.modeManager.mode).toBe("loop");

    gen.valve.close();
    expect(spyWarn).toBeCalled();
    expect(spyTrace).toBeCalled();
    spyWarn.mockClear();
    spyTrace.mockClear();
  });

  test("stop", () => {
    generator.stop();
    expect(generator.isPlaying).toBe(false);
    generator.stop();
    expect(generator.isPlaying).toBe(false);
  });

  test("valve", () => {
    const valve = generator.valve;
    expect(valve.isOpen).toBe(true);
    valve.open();
    expect(valve.isOpen).toBe(true);
    valve.open();
    expect(valve.isOpen).toBe(true);
    valve.close();
    expect(valve.isOpen).toBe(false);
    valve.close();
    expect(valve.isOpen).toBe(false);
    valve.open();
    expect(valve.isOpen).toBe(true);

    //TODO バルブ閉塞時にアニメーションをして、パーティクルが生成されないことを確認する
  });

  test("generate all", () => {
    generator.generateAll();
    const n = 48;
    const container = generator.particleContainer;
    expect(container.particles.length).toBe(n);
    expect(container.particles[0].ratio).toBe(1.0);
    expect(container.particles[n - 1].ratio).toBeCloseTo(0.0129);

    container.removeAll();
    expect(container.particles.length).toBe(0);
  });

  test("visible", () => {
    const container = generator.particleContainer;
    generator.generateAll();
    container.visible = true;
    testParticleVisible(generator, true);
    container.visible = false;
    testParticleVisible(generator, false);
    container.visible = true;
    testParticleVisible(generator, true);
    container.removeAll();
  });

  test("update ease", () => {
    const gen = new ParticleGenerator(way);
    const container = gen.particleContainer;
    const easing = (n) => {
      return n;
    };
    gen.generateAll();
    gen.animator.updateEase(easing);
    container.particles.forEach((p) => {
      expect(p.ease).toBe(easing);
    });
  });

  test("update ease : loop", () => {
    const gen = new ParticleGenerator(way, {
      generationMode: "loop",
    });
    const easing = (n) => {
      return n;
    };
    gen.generateAll();
    gen.animator.updateEase(easing, false);

    expect(spyWarn).toBeCalledTimes(1);
    expect(spyTrace).toBeCalledTimes(1);
    spyWarn.mockClear();
    spyTrace.mockClear();
  });

  test("interval", () => {
    const gen = new ParticleGenerator(way);

    //default value
    expect(gen.animator.generationInterval).toBe(300);

    gen.animator.generationInterval = 500;
    expect(spyWarn).toBeCalledTimes(0);
    expect(spyTrace).toBeCalledTimes(0);
    expect(gen.animator.generationInterval).toBe(500);

    gen.modeManager.mode = "loop";
    gen.animator.generationInterval = 800;
    expect(spyWarn).toBeCalledTimes(1);
    expect(spyTrace).toBeCalledTimes(1);
    expect(gen.animator.generationInterval).toBe(800);

    spyWarn.mockClear();
    spyTrace.mockClear();
  });

  test("set interval", () => {
    const gen = new ParticleGenerator(way);
    const anim = gen.animator;
    anim.setGenerationInterval(0.5, 4);
    expect(anim.generationInterval).toBeCloseTo(500);
  });

  test("set speed", () => {
    const gen = new ParticleGenerator(way);
    const anim = gen.animator;
    anim.setSpeed(300, 4);
    expect(anim.speedPerSec).toBeCloseTo((1.0 / 1200) * 1000);
  });

  test("dispose", () => {
    generator.dispose();
    expect(generator.multipleWays).toBeNull();
    expect(generator.particleContainer).toBeNull();
  });
});

function testParticleVisible(
  generator: ParticleGenerator,
  visible: boolean,
): void {
  expect(generator.particleContainer.visible).toBe(visible);
  generator.particleContainer.particles.forEach((particle) => {
    expect(particle.visible).toBe(visible);
  });
}
