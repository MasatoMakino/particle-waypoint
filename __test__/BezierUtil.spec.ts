import { BezierUtil } from "../src/BezierUtil";
const spyWarn = jest.spyOn(console, "warn").mockImplementation(x => x);

// 3次元ベジェで正円を描く際のコントロールポイント定数
const K = (4 * (Math.sqrt(2) - 1)) / 3;

describe("BezierUtil : arc", () => {
  const R = 1;
  const path = [[R, 0], [R, R * K], [R * K, R], [0, R]];
  const command = [path[0], [...path[1], ...path[2], ...path[3]]];

  //getPointOnBezierCurveの結果とgetPointFromArrayの結果が同じであることを確認する。
  const getPoint = t => {
    return BezierUtil.getPointOnBezierCurve(
      t,
      path[0],
      path[1],
      path[2],
      path[3]
    );
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
    return BezierUtil.getLengthOfBezierCurve(
      path[0],
      path[1],
      path[2],
      path[3],
      div
    );
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
  const circle = [
    [R, 0],
    [R, R * K, R * K, R, 0, R],
    [-R * K, R, -R, R * K, -R, 0],
    [-R, -R * K, -R * K, -R, 0, -R],
    [R * K, -R, R, -R * K, R, 0]
  ];

  test("length div 64", () => {
    const div = 64;
    let length = 0;
    for (let i = 1; i < circle.length; i++) {
      length += BezierUtil.getLengthFromCommand(circle[i - 1], circle[i], div);
    }
    expect(length / (R * 2 * Math.PI)).toBeCloseTo(1.0, 3);
  });
});
