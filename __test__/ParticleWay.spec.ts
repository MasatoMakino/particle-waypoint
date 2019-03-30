import { ParticleWay } from "../src/ParticleWay";

describe("2D", () => {
  const points = [[0, 0], [1.0, 0], [1.0, 1.0]];
  const way = new ParticleWay(points);

  test("center", () => {
    isClosePoint(way.getPoint(0.5), [1.0, 0.0]);
  });
  test("0.75", () => {
    isClosePoint(way.getPoint(0.75), [1.0, 0.5]);
  });
  test("0.25", () => {
    isClosePoint(way.getPoint(0.25), [0.5, 0.0]);
  });

  test("min", () => {
    expect(way.getPoint(0.0)).toEqual(points[0]);
  });
  test("minus", () => {
    expect(way.getPoint(-10.0)).toEqual(points[0]);
  });
  test("max", () => {
    expect(way.getPoint(1.0)).toEqual(points[points.length - 1]);
  });
  test("over", () => {
    expect(way.getPoint(10.0)).toEqual(points[points.length - 1]);
  });
});

describe("3D", () => {
  const points = [[0, 0, 0], [1.0, 0, 0], [1.0, 1.0, 0], [1.0, 1.0, 1.0]];
  const way = new ParticleWay(points);

  test("center", () => {
    isClosePoint(way.getPoint(0.5), [1.0, 0.5, 0.0]);
  });
  test("0.75", () => {
    isClosePoint(way.getPoint(0.75), [1.0, 1.0, 0.25]);
  });
  test("0.25", () => {
    isClosePoint(way.getPoint(0.25), [0.75, 0.0, 0.0]);
  });

  test("0.33", () => {
    isClosePoint(way.getPoint(0.3333333), [1.0, 0.0, 0.0]);
  });

  test("min", () => {
    expect(way.getPoint(0.0)).toEqual(points[0]);
  });
  test("minus", () => {
    expect(way.getPoint(-10.0)).toEqual(points[0]);
  });
  test("max", () => {
    expect(way.getPoint(1.0)).toEqual(points[points.length - 1]);
  });
  test("over", () => {
    expect(way.getPoint(10.0)).toEqual(points[points.length - 1]);
  });
});

describe("1Point", () => {
  const points = [[100, 100]];
  const way = new ParticleWay(points);

  test("center", () => {
    expect(way.getPoint(0.5)).toEqual(points[0]);
  });
  test("min", () => {
    expect(way.getPoint(0.0)).toEqual(points[0]);
  });
  test("max", () => {
    expect(way.getPoint(1.0)).toEqual(points[0]);
  });
});

describe("Zero Point", () => {
  const points = [];
  const way = new ParticleWay(points);

  test("center", () => {
    expect(way.getPoint(0.5)).toBeNull();
  });
  test("min", () => {
    expect(way.getPoint(0.0)).toBeNull();
  });
  test("max", () => {
    expect(way.getPoint(1.0)).toBeNull();
  });
});

const isClosePoint = (p1: number[], p2: number[]) => {
  for (let i = 0; i < p1.length; i++) {
    expect(p1[i]).toBeCloseTo(p2[i], 6);
  }
};
