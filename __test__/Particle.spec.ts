import { describe, test, expect, vi } from "vitest";
import { Particle, ParticleWay } from "../src/index.js";

const spyWarn = vi.spyOn(console, "warn").mockImplementation((x) => x);

//easing function
const sineInOut = (t: number): number => {
  return -0.5 * (Math.cos(Math.PI * t) - 1);
};
const linear = (t: number): number => {
  return t;
};

describe("particle", () => {
  const points = [
    [0, 0],
    [1.0, 0],
    [1.0, 1.0],
  ];
  const way = new ParticleWay(points);
  const particle = new Particle(way);

  test("visible", () => {
    expect(particle.visible).toEqual(true);
    particle.visible = false;
    expect(particle.visible).toEqual(false);
  });
  test("add", () => {
    particle.update(0.0);
    const ratio = 0.33333;
    expect(particle.add(ratio)).toEqual(ratio);
    expect(particle.ratio).toEqual(ratio);
  });

  test("center", () => {
    const ratio = 0.5;
    expect(particle.update(ratio)).toEqual(ratio);
    expect(particle.ratio).toEqual(ratio);
  });
  test("min", () => {
    const ratio = 0.0;
    expect(particle.update(ratio)).toEqual(ratio);
    expect(particle.ratio).toEqual(ratio);
  });

  test("minus", () => {
    expect(particle.update(-10.0)).toEqual(-10.0);
  });
  test("max", () => {
    expect(particle.update(1.0)).toEqual(1.0);
  });
  test("over", () => {
    expect(particle.update(10.0)).toEqual(10.0);
  });
});

describe("linear", () => {
  const points = [
    [0, 0],
    [1.0, 0],
    [1.0, 1.0],
  ];
  const way = new ParticleWay(points);
  const particle = new Particle(way);
  particle.ease = linear;

  test("center", () => {
    expect(particle.update(0.5)).toEqual(0.5);
  });
  test("min", () => {
    expect(particle.update(0.0)).toEqual(0.0);
  });
  test("minus", () => {
    expect(particle.update(-10.0)).toEqual(-10.0);
  });
  test("max", () => {
    expect(particle.update(1.0)).toEqual(1.0);
  });
  test("over", () => {
    expect(particle.update(10.0)).toEqual(10.0);
  });
});

describe("sineInOut", () => {
  const points = [
    [0, 0],
    [1.0, 0],
    [1.0, 1.0],
  ];
  const way = new ParticleWay(points);
  const particle = new Particle(way);
  particle.ease = sineInOut;

  test("0.1", () => {
    expect(particle.update(0.1)).toBeCloseTo(0.024471741852423234);
  });
  test("0.25", () => {
    expect(particle.update(0.25)).toBeCloseTo(0.1464466094067262);
  });
  test("center", () => {
    expect(particle.update(0.5)).toBeCloseTo(0.5);
  });
  test("0.666", () => {
    expect(particle.update(2 / 3)).toBeCloseTo(0.7499999999999999);
  });
  test("0.75", () => {
    expect(particle.update(0.75)).toBeCloseTo(0.8535533905932737);
  });

  test("min", () => {
    expect(particle.update(0.0)).toBeCloseTo(0.0);
  });
  test("minus", () => {
    expect(particle.update(-10.0)).toEqual(-0.0);
  });
  test("max", () => {
    expect(particle.update(1.0)).toBeCloseTo(1.0);
  });
  test("over", () => {
    expect(particle.update(10.0)).toEqual(-0.0);
  });
});
