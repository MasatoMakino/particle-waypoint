import { ParticleWay } from "./ParticleWay";

export class BezierUtil {
  /**
   * ベジェ曲線の中間座標を取得する。
   * t 0.0 ~ 1.0
   **/
  public static getPointOnBezierCurve(
    t: number,
    from: number[],
    c1: number[],
    c2: number[],
    to: number[]
  ): number[] {
    const addPoint = (p1: number[], p2: number[], coefficient) => {
      p1[0] += coefficient * p2[0];
      p1[1] += coefficient * p2[1];
    };

    const result = [0, 0];
    const difT = 1 - t;

    let v = Math.pow(difT, 3);
    addPoint(result, from, v);

    v = 3 * Math.pow(difT, 2) * t;
    addPoint(result, c1, v);

    v = 3 * Math.pow(t, 2) * difT;
    addPoint(result, c2, v);

    v = Math.pow(t, 3);
    addPoint(result, to, v);

    return result;
  }

  public static getLengthOfBezierCurve(
    from: number[],
    c1: number[],
    c2: number[],
    to: number[],
    div: number = 16
  ): number {
    let result = 0;
    let prevPoint;
    for (let i = 0; i < div + 1; i++) {
      const p = this.getPointOnBezierCurve(i / div, from, c1, c2, to);
      if (prevPoint) {
        result += ParticleWay.getDistance(prevPoint, p);
      }
      prevPoint = p;
    }

    return result;
  }
}
