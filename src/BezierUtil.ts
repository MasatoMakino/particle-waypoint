import { ParticleWay } from "./index.js";

export class BezierUtil {
  /**
   * ベジェ曲線の中間座標を取得する。
   *
   * @param t 媒介変数 0.0 ~ 1.0
   * @param from 始点
   * @param c1 コントロールポイント1
   * @param c2 コントロールポイント2
   * @param to 終点
   */
  public static getPoint(
    t: number,
    from: number[],
    c1: number[],
    c2: number[],
    to: number[],
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

  /**
   * ベジェ曲線描画コマンドから、ベジェ曲線の中間座標を取得する。
   * @param t
   * @param command1 始点側の描画コマンド 要素数2もしくは6の配列
   * @param command2 終点側の描画コマンド 要素数6の配列
   */
  public static getPointFromCommand(
    t: number,
    command1: number[],
    command2: number[],
  ): number[] {
    return this.getPoint(
      t,
      command1.slice(-2),
      command2.slice(0, 2),
      command2.slice(2, 4),
      command2.slice(-2),
    );
  }

  /**
   * ベジェ曲線の長さを取得する。
   * divの数だけベジェ曲線を分割し、直線の集合として距離を測る。
   *
   * @param from 始点
   * @param c1 コントロールポイント1
   * @param c2 コントロールポイント2
   * @param to 終点
   * @param div 分割数 多いほど精度が向上し、計算負荷は上昇する。 既定値16
   */
  public static getLength(
    from: number[],
    c1: number[],
    c2: number[],
    to: number[],
    div: number = 16,
  ): number {
    let result = 0;
    let prevPoint;
    for (let i = 0; i < div + 1; i++) {
      const p = this.getPoint(i / div, from, c1, c2, to);
      if (prevPoint) {
        result += ParticleWay.getDistance(prevPoint, p);
      }
      prevPoint = p;
    }
    return result;
  }

  /**
   * ベジェ曲線描画コマンドから、ベジェ曲線の長さを取得する。
   *
   * @param command1 始点側の描画コマンド 要素数2もしくは6の配列
   * @param command2 終点側の描画コマンド 要素数6の配列
   * @param div 分割数 多いほど精度が向上し、計算負荷は上昇する。 既定値16
   */
  public static getLengthFromCommand(
    command1: number[],
    command2: number[],
    div: number = 16,
  ): number {
    return this.getLength(
      command1.slice(-2),
      command2.slice(0, 2),
      command2.slice(2, 4),
      command2.slice(-2),
      div,
    );
  }

  /**
   * 3次ベジェ曲線を2次元座標の配列に分解する。
   * @param commands
   * @param div 分割数 デフォルトは16
   */
  public static subdivide(commands: number[][], div: number = 16): number[][] {
    const points = [];
    for (let i = 1; i < commands.length; i++) {
      let sub = this.subdivideSubPath(commands[i - 1], commands[i], div);
      if (i !== 1) {
        sub = sub.slice(1);
      }
      points.push(...sub);
    }
    return points;
  }
  private static subdivideSubPath(
    command1: number[],
    command2: number[],
    div: number = 16,
  ): number[][] {
    const points = [];
    for (let i = 0; i < div + 1; i++) {
      points.push(this.getPointFromCommand(i / div, command1, command2));
    }
    return points;
  }
}
