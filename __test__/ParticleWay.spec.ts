import { ParticleWay } from "../src/ParticleWay";

describe("2D", () => {
  const points = [[0, 0], [1.0, 0], [1.0, 1.0]];
  const way = new ParticleWay(points);

  test("center", () => {
    expect(way.getPoint(0.5)).toEqual([1.0, 0.0]);
  });
  test("0.75", () => {
    expect(way.getPoint(0.75)).toEqual([1.0, 0.5]);
  });
  test("0.25", () => {
    expect(way.getPoint(0.25)).toEqual([0.5, 0.0]);
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
    expect(way.getPoint(0.5)).toEqual([1.0, 0.5, 0.0]);
  });
  test("0.75", () => {
    expect(way.getPoint(0.75)).toEqual([1.0, 1.0, 0.25]);
  });
  test("0.25", () => {
    expect(way.getPoint(0.25)).toEqual([0.75, 0.0, 0.0]);
  });

  test("0.33", () => {
    const result = way.getPoint(0.3333333);
    const expected = [1.0, 0.0, 0.0];
    expect(expected[0]).toBeCloseTo(result[0]);
    expect(expected[1]).toBeCloseTo(result[1]);
    expect(expected[2]).toBeCloseTo(result[2]);
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
