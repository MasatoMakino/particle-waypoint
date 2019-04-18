import { BezierUtil } from "../src/BezierUtil";
const spyWarn = jest.spyOn(console, "warn").mockImplementation(x => x);

describe("BezierUtil.arc", () => {
  const R = 1;
  const K = 0.55228474983;
  const path = [[R, 0], [R, R * K], [R * K, R], [0, R]];

  test("0.0", () => {
    const p = BezierUtil.getPointOnBezierCurve(
      0.0,
      path[0],
      path[1],
      path[2],
      path[3]
    );
    expect(p[0]).toEqual(R);
    expect(p[1]).toEqual(0);
  });

  test("1.0", () => {
    const p = BezierUtil.getPointOnBezierCurve(
      1.0,
      path[0],
      path[1],
      path[2],
      path[3]
    );
    expect(p[0]).toEqual(0);
    expect(p[1]).toEqual(R);
  });

  test("0.5", () => {
    const p = BezierUtil.getPointOnBezierCurve(
      0.5,
      path[0],
      path[1],
      path[2],
      path[3]
    );
    expect(p[0]).toBeCloseTo(R * Math.cos(Math.PI * 0.5 * 0.5));
    expect(p[1]).toBeCloseTo(R * Math.sin(Math.PI * 0.5 * 0.5));
  });

  //イラストレーターによるベジェ曲線分割を基準とするため、正円とは誤差がでる。
  test("0.25", () => {
    const p = BezierUtil.getPointOnBezierCurve(
      0.25,
      path[0],
      path[1],
      path[2],
      path[3]
    );
    expect(p[0]).toBeCloseTo((46.071 / 50) * R);
    expect(p[1]).toBeCloseTo((19.462 / 50) * R);
  });
  test("0.75", () => {
    const p = BezierUtil.getPointOnBezierCurve(
      0.75,
      path[0],
      path[1],
      path[2],
      path[3]
    );
    expect(p[0]).toBeCloseTo((19.462 / 50) * R);
    expect(p[1]).toBeCloseTo((46.071 / 50) * R);
  });

  //円弧を二分割して線分の長さの合計を求める。
  test("length 2", () => {
    const length = BezierUtil.getLengthOfBezierCurve(
      path[0],
      path[1],
      path[2],
      path[3],
      2
    );
    const halfP = (35.355 / 50) * R;
    const dif = R - halfP;

    expect(length).toBeCloseTo(Math.sqrt(dif * dif + halfP * halfP) * 2);
  });

  //円弧を細分化して円周の長さの近似値が取れるかの確認。
  test("length", () => {
    const length = BezierUtil.getLengthOfBezierCurve(
      path[0],
      path[1],
      path[2],
      path[3],
      64
    );
    expect(length).toBeCloseTo(R * 2 * Math.PI /4, 3);
  });

});
