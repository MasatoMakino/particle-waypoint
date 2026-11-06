import { describe, test, expect, vi } from "vitest";
import { ParticleGenerator } from "../src/index.js";
import { getTestGenerators } from "./ParticleGenerator.common.js";

describe("ParticleGenerator", () => {
  const spyWarn = vi.spyOn(console, "warn");
  spyWarn.mockImplementation((x) => x);
  const spyTrace = vi.spyOn(console, "trace");
  spyTrace.mockImplementation((x) => x);

  const { generator, way } = getTestGenerators();

  test("オプションなしで生成すると、既定の速度・間隔・確率・モードになる", () => {
    expect(generator.animator.speedPerSec).toBe(0.07);
    expect(generator.animator.generationInterval).toBe(300);
    expect(generator.probability).toBe(1.0);
    expect(generator.modeManager.mode).toBe("sequential");
    expect(generator.particleContainer.visible).toBe(true);
    expect(generator.multipleWays.waySelectType).toBe("sequential");
  });

  test("経路の配列を渡すと、すべての経路を使う", () => {
    const gen = new ParticleGenerator([way]);
    expect(gen.multipleWays.ways.length).toBe([way].length);
  });

  test("空のオプションでは、各項目が既定値になり ease は設定されない", () => {
    const gen = new ParticleGenerator(way, {});
    expect(gen.modeManager.mode).toBe("sequential");
    expect(gen.animator.ease).toBeFalsy();
    expect(gen.probability).toBe(1.0);
  });

  test("オプションで指定したモード・ease・確率を使う", () => {
    const gen = new ParticleGenerator(way, {
      generationMode: "loop",
      ease: (n) => n,
      probability: 0.8,
    });
    expect(gen.modeManager.mode).toBe("loop");
    expect(gen.animator.ease).toBeTruthy();
    expect(gen.probability).toBe(0.8);
  });

  test("play は再生状態にし、2 回呼んでも再生状態のままにする", () => {
    expect(generator.isPlaying).toBe(false);
    generator.play();
    expect(generator.isPlaying).toBe(true);
    generator.play();
    expect(generator.isPlaying).toBe(true);
  });

  test("loop モードでの再生中にバルブを閉じると、効果がないことを警告する", () => {
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

  test("stop は停止状態にし、2 回呼んでも停止状態のままにする", () => {
    generator.stop();
    expect(generator.isPlaying).toBe(false);
    generator.stop();
    expect(generator.isPlaying).toBe(false);
  });

  test("バルブは初期状態で開いており、open と close を繰り返しても指定した状態になる", () => {
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
  });

  test("generateAll は経路を埋めるパーティクルを生成し、removeAll はすべて消す", () => {
    generator.generateAll();
    const n = 48;
    const container = generator.particleContainer;
    expect(container.particles.length).toBe(n);
    expect(container.particles[0].ratio).toBe(1.0);
    expect(container.particles[n - 1].ratio).toBeCloseTo(0.0129);

    container.removeAll();
    expect(container.particles.length).toBe(0);
  });

  test("コンテナの visible は、すべてのパーティクルの visible に反映される", () => {
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

  test("updateEase は既存のパーティクルの ease を上書きする", () => {
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

  test("loop モードで上書きしない updateEase を呼ぶと、常に上書きされることを警告する", () => {
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

  test("loop モードで生成間隔を変えたときだけ、反映されないことを警告する", () => {
    const gen = new ParticleGenerator(way);

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

  test("setGenerationInterval は、速度と経路上の個数から生成間隔を決める", () => {
    const gen = new ParticleGenerator(way);
    const anim = gen.animator;
    anim.setGenerationInterval(0.5, 4);
    expect(anim.generationInterval).toBeCloseTo(500);
  });

  test("setSpeed は、生成間隔と経路上の個数から速度を決める", () => {
    const gen = new ParticleGenerator(way);
    const anim = gen.animator;
    anim.setSpeed(300, 4);
    expect(anim.speedPerSec).toBeCloseTo((1.0 / 1200) * 1000);
  });

  test("dispose は、コンテナと経路の参照を null にして解放する", () => {
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
