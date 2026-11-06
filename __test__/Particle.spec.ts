import { describe, test, expect, vi } from "vitest";
import { Particle, ParticleWay } from "../src/index.js";

const spyWarn = vi.spyOn(console, "warn").mockImplementation((x) => x);

const sineInOut = (t: number): number => {
  return -0.5 * (Math.cos(Math.PI * t) - 1);
};

describe("particle", () => {
  const points = [
    [0, 0],
    [1.0, 0],
    [1.0, 1.0],
  ];
  const way = new ParticleWay(points);
  const particle = new Particle(way);

  test("add は現在の位置に移動量を足した位置を返し、ratio に記録する", () => {
    particle.update(0.0);
    const ratio = 0.33333;
    expect(particle.add(ratio)).toEqual(ratio);
    expect(particle.ratio).toEqual(ratio);
  });

  test("ease がないとき、update は渡された t をそのまま返し、ratio に記録する", () => {
    const ratio = 0.5;
    expect(particle.update(ratio)).toEqual(ratio);
    expect(particle.ratio).toEqual(ratio);
  });
  test("update は t = 0 をそのまま返す", () => {
    const ratio = 0.0;
    expect(particle.update(ratio)).toEqual(ratio);
    expect(particle.ratio).toEqual(ratio);
  });

  // 範囲外の t の丸め込みは ParticleWay の責務であり、Particle は丸めない。
  test("update は 0 未満の t を丸めずに返す", () => {
    expect(particle.update(-10.0)).toEqual(-10.0);
  });
  test("update は t = 1 をそのまま返す", () => {
    expect(particle.update(1.0)).toEqual(1.0);
  });
  test("update は 1 を超える t を丸めずに返す", () => {
    expect(particle.update(10.0)).toEqual(10.0);
  });
});

describe("ease", () => {
  const points = [
    [0, 0],
    [1.0, 0],
    [1.0, 1.0],
  ];
  const way = new ParticleWay(points);
  const particle = new Particle(way);
  particle.ease = sineInOut;

  test("ease を設定すると、update は ease(t) を返す", () => {
    expect(particle.update(0.25)).toBeCloseTo(sineInOut(0.25));
  });
});
