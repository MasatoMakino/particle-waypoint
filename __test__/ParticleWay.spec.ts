import { ParticleWay } from "../src/index";
import { BezierPath } from "./BezierPath";

const spyWarn = jest.spyOn(console, "warn").mockImplementation((x) => x);

describe("2D", () => {
  const points = [
    [0, 0],
    [1.0, 0],
    [1.0, 1.0],
  ];
  const way = new ParticleWay(points);

  test("center", () => {
    isNear(way.getPoint(0.5), [1.0, 0.0]);
  });
  test("0.75", () => {
    isNear(way.getPoint(0.75), [1.0, 0.5]);
  });
  test("0.25", () => {
    isNear(way.getPoint(0.25), [0.5, 0.0]);
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
  const points = [
    [0, 0, 0],
    [1.0, 0, 0],
    [1.0, 1.0, 0],
    [1.0, 1.0, 1.0],
  ];
  const way = new ParticleWay(points);

  test("center", () => {
    isNear(way.getPoint(0.5), [1.0, 0.5, 0.0]);
  });
  test("0.75", () => {
    isNear(way.getPoint(0.75), [1.0, 1.0, 0.25]);
  });
  test("0.25", () => {
    isNear(way.getPoint(0.25), [0.75, 0.0, 0.0]);
  });

  test("0.33", () => {
    isNear(way.getPoint(0.3333333), [1.0, 0.0, 0.0]);
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

describe("Bezier", () => {
  const points = BezierPath.getCircle();
  const way = new ParticleWay(points);

  test("center", () => {
    isNear(way.getPoint(0.5), [-1.0, 0.0]);
  });
  test("0.75", () => {
    isNear(way.getPoint(0.75), [0, -1.0]);
  });
  test("0.25", () => {
    isNear(way.getPoint(0.25), [0.0, 1.0]);
  });

  test("30", () => {
    isNear(
      way.getPoint(0.25 / 3),
      [Math.cos((Math.PI / 180) * 30), Math.sin((Math.PI / 180) * 30)],
      2
    );
  });

  test("min", () => {
    expect(way.getPoint(0.0)).toEqual(points[0]);
  });
  test("minus", () => {
    expect(way.getPoint(-10.0)).toEqual(points[0]);
  });

  const maxPoint = points[points.length - 1].slice(-2);
  test("max", () => {
    expect(way.getPoint(1.0)).toEqual(maxPoint);
  });
  test("over", () => {
    expect(way.getPoint(10.0)).toEqual(maxPoint);
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

/**
 * 2点が近似であるか判定する。
 * @param p1 点を表す座標
 * @param p2 点を表す座標
 */
const isNear = (p1: number[], p2: number[], precision: number = 6) => {
  for (let i = 0; i < p1.length; i++) {
    expect(p1[i]).toBeCloseTo(p2[i], precision);
  }
};
