import { BezierUtil } from "../src/BezierUtil";
import { BezierPath } from "./BezierPath";
import { ParticleWay } from "../src/ParticleWay";
const spyWarn = jest.spyOn(console, "warn").mockImplementation(x => x);

describe("BezierUtil : arc", () => {
  const R = 1.0;
  const path = BezierPath.getArcPath();
  const command = BezierPath.getArc();

  //getPointOnBezierCurveの結果とgetPointFromArrayの結果が同じであることを確認する。
  const getPoint = t => {
    return BezierUtil.getPoint(t, path[0], path[1], path[2], path[3]);
  };
  const equalCommand = (t, point) => {
    const pC = BezierUtil.getPointFromCommand(t, command[0], command[1]);
    expect(point[0]).toEqual(pC[0]);
    expect(point[1]).toEqual(pC[1]);
  };

  test("0.0", () => {
    const t = 0.0;
    const p = getPoint(t);
    expect(p[0]).toEqual(R);
    expect(p[1]).toEqual(0);
    equalCommand(t, p);
  });

  test("1.0", () => {
    const t = 1.0;
    const p = getPoint(t);
    expect(p[0]).toEqual(0);
    expect(p[1]).toEqual(R);
    equalCommand(t, p);
  });

  //0、45, 90度のそれぞれの点は、ベジェ曲線でも数学的に正しい座標が取得できる。
  test("0.5", () => {
    const t = 0.5;
    const p = getPoint(t);
    expect(p[0]).toBeCloseTo(R * Math.cos(Math.PI * 0.5 * t));
    expect(p[1]).toBeCloseTo(R * Math.sin(Math.PI * 0.5 * t));
    equalCommand(t, p);
  });

  //イラストレーターによるベジェ曲線分割を基準とするため、正円とは誤差がでる。
  test("0.25", () => {
    const t = 0.25;
    const p = getPoint(t);
    expect(p[0]).toBeCloseTo((46.071 / 50) * R);
    expect(p[1]).toBeCloseTo((19.462 / 50) * R);
    equalCommand(t, p);
  });
  test("0.75", () => {
    const t = 0.75;
    const p = getPoint(t);
    expect(p[0]).toBeCloseTo((19.462 / 50) * R);
    expect(p[1]).toBeCloseTo((46.071 / 50) * R);
    equalCommand(t, p);
  });

  const getLength = div => {
    return BezierUtil.getLength(path[0], path[1], path[2], path[3], div);
  };
  const equalLengthWithCommand = (div, length) => {
    const lengthC = BezierUtil.getLengthFromCommand(
      command[0],
      command[1],
      div
    );
    expect(length).toEqual(lengthC);
  };

  //円弧を二分割して線分の長さの合計を求める。
  test("length div 2", () => {
    const div = 2;
    const length = getLength(div);
    const halfP = (35.355 / 50) * R;
    const dif = R - halfP;
    expect(length).toBeCloseTo(Math.sqrt(dif * dif + halfP * halfP) * 2);
    equalLengthWithCommand(div, length);
  });

  //円弧を細分化して円周の長さの近似値が取れるかの確認。
  test("length div 64", () => {
    const div = 64;
    const length = getLength(div);
    expect(length / ((R * 2 * Math.PI) / 4)).toBeCloseTo(1.0, 3);
    equalLengthWithCommand(div, length);
  });
});

describe("BezierUtil : circle", () => {
  const R = 1.0;
  const circle = BezierPath.getCircle();

  test("length div 64", () => {
    const div = 64;
    let length = 0;
    for (let i = 1; i < circle.length; i++) {
      length += BezierUtil.getLengthFromCommand(circle[i - 1], circle[i], div);
    }
    expect(length / (R * 2 * Math.PI)).toBeCloseTo(1.0, 3);
  });
});

describe("BezierUtil : differentiate", () => {
  const circle = BezierPath.getCircle();

  test("div 1", () => {
    const div = 1;
    const points = BezierUtil.differentiate(circle, div);
    expect(points).toEqual([[1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]]);
  });

  test("div 2", () => {
    const div = 2;
    const q = 0.7071067811865476;
    const points = BezierUtil.differentiate(circle, div);
    expect(points).toEqual([
      [1, 0],
      [q, q],
      [0, 1],
      [-q, q],
      [-1, 0],
      [-q, -q],
      [0, -1],
      [q, -q],
      [1, 0]
    ]);
  });

  test("div 64", () => {
    const div = 64;
    const points = BezierUtil.differentiate(circle, div);
    const way = new ParticleWay(circle);
    const differWay = new ParticleWay(points);

    const isCloseTo = t => {
      const p1 = way.getPoint(t);
      const p2 = differWay.getPoint(t);
      expect(p1[0]).toBeCloseTo(p2[0]);
      expect(p1[1]).toBeCloseTo(p2[1]);
    };

    const isNear = t => {
      const p1 = way.getPoint(t);
      const p2 = differWay.getPoint(t);
      expect(p1[0]).toBeCloseTo(p2[0], 2);
      expect(p1[1]).toBeCloseTo(p2[1], 2);
    };

    isCloseTo(0.0);
    isCloseTo(0.25);
    isCloseTo(0.5);
    isCloseTo(0.75);
    isCloseTo(1.0);
    isNear(0.1);
    isNear(1 / 3);
  });
});
