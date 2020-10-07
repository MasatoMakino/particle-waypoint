import {
  GenerationMode,
  ParticleGenerator,
  PathSelectType,
} from "../src/index";
import { getTestGenerators } from "./ParticleGenerator.common";

describe("ParticleGenerator", () => {
  const spyWarn = jest.spyOn(console, "warn");
  spyWarn.mockImplementation((x) => x);
  const spyTrace = jest.spyOn(console, "trace");
  spyTrace.mockImplementation((x) => x);

  const { generator, way } = getTestGenerators();

  test("constructor", () => {
    expect(generator).toBeTruthy();
    expect(generator.animator.speedPerSec).toBe(0.07);
    expect(generator.animator.particleInterval).toBe(300);
    expect(generator.probability).toBe(1.0);
    expect(generator.modeManager).toBeTruthy();
    expect(generator.modeManager.mode).toBe(GenerationMode.SEQUENTIAL);
    expect(generator.particleContainer.visible).toBe(true);
    expect(generator.multipleWays.pathSelectType).toBe(
      PathSelectType.Sequential
    );
  });

  test("constructor : array of way", () => {
    const gen = new ParticleGenerator([way]);
    expect(gen.multipleWays.path.length).toBe([way].length);
  });

  test("constructor : empty option", () => {
    const gen = new ParticleGenerator(way, {});
    expect(gen.modeManager.mode).toBe(GenerationMode.SEQUENTIAL);
    expect(gen.animator.ease).toBeFalsy();
    expect(gen.probability).toBe(1.0);
  });

  test("constructor : option", () => {
    const gen = new ParticleGenerator(way, {
      generationMode: GenerationMode.LOOP,
      ease: (n) => n,
      probability: 0.8,
    });
    expect(gen.modeManager.mode).toBe(GenerationMode.LOOP);
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
      generationMode: GenerationMode.LOOP,
    });
    gen.play();
    expect(gen.isPlaying).toBe(true);
    expect(gen.modeManager.mode).toBe(GenerationMode.LOOP);

    gen.valve.closeValve();
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
    expect(valve.isOpenValve).toBe(true);
    valve.openValve();
    expect(valve.isOpenValve).toBe(true);
    valve.openValve();
    expect(valve.isOpenValve).toBe(true);
    valve.closeValve();
    expect(valve.isOpenValve).toBe(false);
    valve.closeValve();
    expect(valve.isOpenValve).toBe(false);
    valve.openValve();
    expect(valve.isOpenValve).toBe(true);

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
      generationMode: GenerationMode.LOOP,
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
    expect(gen.animator.particleInterval).toBe(300);

    gen.animator.particleInterval = 500;
    expect(spyWarn).toBeCalledTimes(0);
    expect(spyTrace).toBeCalledTimes(0);
    expect(gen.animator.particleInterval).toBe(500);

    gen.modeManager.mode = GenerationMode.LOOP;
    gen.animator.particleInterval = 800;
    expect(spyWarn).toBeCalledTimes(1);
    expect(spyTrace).toBeCalledTimes(1);
    expect(gen.animator.particleInterval).toBe(800);

    spyWarn.mockClear();
    spyTrace.mockClear();
  });

  test("set interval", () => {
    const gen = new ParticleGenerator(way);
    const anim = gen.animator;
    anim.setInterval(0.5, 4);
    expect(anim.particleInterval).toBeCloseTo(500);
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
  visible: boolean
): void {
  expect(generator.particleContainer.visible).toBe(visible);
  generator.particleContainer.particles.forEach((particle) => {
    expect(particle.visible).toBe(visible);
  });
}
