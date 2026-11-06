import { describe, test, expect, vi } from "vitest";
import { ParticleWay } from "../src/index.js";
import { BezierPath } from "./BezierPath.js";

const spyWarn = vi.spyOn(console, "warn").mockImplementation((x) => x);

describe("2D", () => {
  const points = [
    [0, 0],
    [1.0, 0],
    [1.0, 1.0],
  ];
  const way = new ParticleWay(points);

  test("t は経路の長さに比例した位置を指す : 中間点", () => {
    isNear(way.getPoint(0.5), [1.0, 0.0]);
  });
  test("t は経路の長さに比例した位置を指す : 2 本目の線分の途中", () => {
    isNear(way.getPoint(0.75), [1.0, 0.5]);
  });
  test("t は経路の長さに比例した位置を指す : 1 本目の線分の途中", () => {
    isNear(way.getPoint(0.25), [0.5, 0.0]);
  });

  test("t = 0 は始点を返す", () => {
    expect(way.getPoint(0.0)).toEqual(points[0]);
  });
  test("0 未満の t は始点に丸める", () => {
    expect(way.getPoint(-10.0)).toEqual(points[0]);
  });
  test("t = 1 は終点を返す", () => {
    expect(way.getPoint(1.0)).toEqual(points[points.length - 1]);
  });
  test("1 を超える t は終点に丸める", () => {
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

  test("3 次元の経路でも t は長さに比例した位置を指す : 中間点", () => {
    isNear(way.getPoint(0.5), [1.0, 0.5, 0.0]);
  });
  test("3 次元の経路でも t は長さに比例した位置を指す : 3 本目の線分の途中", () => {
    isNear(way.getPoint(0.75), [1.0, 1.0, 0.25]);
  });
  test("3 次元の経路でも t は長さに比例した位置を指す : 1 本目の線分の途中", () => {
    isNear(way.getPoint(0.25), [0.75, 0.0, 0.0]);
  });
  test("線分の境界の t は中継点を返す", () => {
    isNear(way.getPoint(0.3333333), [1.0, 0.0, 0.0]);
  });

  test("t = 0 は始点を返す", () => {
    expect(way.getPoint(0.0)).toEqual(points[0]);
  });
  test("0 未満の t は始点に丸める", () => {
    expect(way.getPoint(-10.0)).toEqual(points[0]);
  });
  test("t = 1 は終点を返す", () => {
    expect(way.getPoint(1.0)).toEqual(points[points.length - 1]);
  });
  test("1 を超える t は終点に丸める", () => {
    expect(way.getPoint(10.0)).toEqual(points[points.length - 1]);
  });
});

describe("Bezier", () => {
  const points = BezierPath.getCircle();
  const way = new ParticleWay(points);

  test("ベジェ曲線の経路でも t は長さに比例した位置を指す : 半周", () => {
    isNear(way.getPoint(0.5), [-1.0, 0.0]);
  });
  test("ベジェ曲線の経路でも t は長さに比例した位置を指す : 4 分の 3 周", () => {
    isNear(way.getPoint(0.75), [0, -1.0]);
  });
  test("ベジェ曲線の経路でも t は長さに比例した位置を指す : 4 分の 1 周", () => {
    isNear(way.getPoint(0.25), [0.0, 1.0]);
  });

  // 曲線の長さは分割による近似で求めるため、精度を 2 桁にしている。
  test("ベジェ曲線の途中でも t は長さに比例した位置を指す : 30 度", () => {
    isNear(
      way.getPoint(0.25 / 3),
      [Math.cos((Math.PI / 180) * 30), Math.sin((Math.PI / 180) * 30)],
      2,
    );
  });

  test("t = 0 は始点を返す", () => {
    expect(way.getPoint(0.0)).toEqual(points[0]);
  });
  test("0 未満の t は始点に丸める", () => {
    expect(way.getPoint(-10.0)).toEqual(points[0]);
  });

  const maxPoint = points[points.length - 1].slice(-2);
  test("t = 1 は最後のベジェコマンドの終点を返す", () => {
    expect(way.getPoint(1.0)).toEqual(maxPoint);
  });
  test("1 を超える t は最後のベジェコマンドの終点に丸める", () => {
    expect(way.getPoint(10.0)).toEqual(maxPoint);
  });
});

describe("1Point", () => {
  const points = [[100, 100]];
  const way = new ParticleWay(points);

  test("点が 1 つの経路は、どの t でもその点を返す : 中間", () => {
    expect(way.getPoint(0.5)).toEqual(points[0]);
  });
  test("点が 1 つの経路は、どの t でもその点を返す : 始点", () => {
    expect(way.getPoint(0.0)).toEqual(points[0]);
  });
  test("点が 1 つの経路は、どの t でもその点を返す : 終点", () => {
    expect(way.getPoint(1.0)).toEqual(points[0]);
  });
});

describe("invalid points", () => {
  test("空の座標の配列は、生成時に例外を投げる", () => {
    expect(() => new ParticleWay([])).toThrow();
  });
  test("要素数が 2、3、6 以外の座標を含む配列は、生成時に例外を投げる", () => {
    expect(
      () =>
        new ParticleWay([
          [0, 0],
          [1, 1, 1, 1],
        ]),
    ).toThrow();
  });
  test("getDistance は要素数が 2、3、6 以外の座標に例外を投げる", () => {
    expect(() => ParticleWay.getDistance([0, 0], [1, 1, 1, 1])).toThrow();
  });
});

const isNear = (p1: number[], p2: number[], precision: number = 6) => {
  for (let i = 0; i < p1.length; i++) {
    expect(p1[i]).toBeCloseTo(p2[i], precision);
  }
};
