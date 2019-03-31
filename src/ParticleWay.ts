/**
 * 中間点の算出が可能な線分を表すクラス
 */
export class ParticleWay {
  public name: string = "";
  protected _points: number[][];
  protected _rateTable: number[];

  constructor(points: number[][]) {
    this.setPoints(points);
  }

  public setPoints(points: number[][]): void {
    this._points = points;

    if (this._points.length === 0) {
      console.warn(
        "ParticleWay : 長さゼロの配列が指定されました。座標が算出できないため、getPoint関数は常にnullを返します。"
      );
    }
    if (this._points.length === 1) {
      console.warn(
        "ParticleWay : 長さ1の配列が指定されました。座標が算出できないため、getPoint関数は常に固定の座標を返します。"
      );
    }

    const sumTable = new Array(this._points.length).fill(0);
    this._points.forEach((val, index, array) => {
      if (index === 0) return;
      sumTable[index] =
        this.getDistance(array[index - 1], val) + sumTable[index - 1];
    });
    const total = sumTable[sumTable.length - 1];

    this._rateTable = sumTable.map(val => {
      return val / total;
    });
  }

  private getDistance(pos1: number[], pos2: number[]): number {
    const dx = pos2[0] - pos1[0];
    const dy = pos2[1] - pos1[1];

    switch (pos1.length) {
      case 3:
        const dz = pos2[2] - pos1[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      case 2:
        return Math.sqrt(dx * dx + dy * dy);
    }
  }

  public getPoint(t: number): number[] | null {
    if (!this._points || this._points.length === 0) {
      return null;
    }
    if (this._points.length === 1) {
      return [...this._points[0]];
    }

    const n = this._points.length;
    t = Math.min(t, 1.0);
    if (t === 1.0) return [...this._points[n - 1]];
    t = Math.max(t, 0.0);
    if (t === 0.0) return [...this._points[0]];

    let i = 1;
    for (i; i < n; i++) {
      if (this._rateTable[i] >= t) break;
    }
    i--;

    const floorPoint = this._points[i];
    const ceilPoint = this._points[i + 1];
    const rateBase = this._rateTable[i];
    return this.getCenterPoint(
      floorPoint,
      ceilPoint,
      (t - rateBase) / (this._rateTable[i + 1] - rateBase)
    );
  }

  private getCenterPoint(pos1, pos2, t): number[] {
    const rt = 1.0 - t;
    let pos = [pos1[0] * rt + pos2[0] * t, pos1[1] * rt + pos2[1] * t];
    switch (pos1.length) {
      case 3:
        pos.push(pos1[2] * rt + pos2[2] * t);
        return pos;
      case 2:
        return pos;
    }
  }
}
