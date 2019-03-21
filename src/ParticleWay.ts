/**
 * 中間点の算出が可能な線分を表すクラス
 */
export class ParticleWay {
  public name: string = "";
  protected _points: number[][];
  protected _total: number;

  constructor(points: number[][]) {
    this.setPoints(points);
  }

  public setPoints(points: number[][]): void {
    this._points = points;
    this._total = 0;

    const n = this._points.length;
    for (let i = 1; i < n; i++) {
      this._total += this.getDistance(this._points[i - 1], this._points[i]);
    }
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

  public getPoint(t: number): number[] {
    t = Math.min(t, 1.0);
    t = Math.max(t, 0.0);
    let position = this._total * t;

    let i = 1;
    const n = this._points.length;
    for (i; i < n; i++) {
      position -= this.getDistance(this._points[i - 1], this._points[i]);
      if (position < 0.0) {
        break;
      }
    }

    i--;
    if (i === n - 1) return this._points[i];

    const floorPoint = this._points[i];
    const ceilPoint = this._points[i + 1];

    if (floorPoint === undefined || ceilPoint === undefined) {
      return this._points[0];
    }

    let distance = this.getDistance(floorPoint, ceilPoint);
    return this.getCenterPoint(
      floorPoint,
      ceilPoint,
      (distance + position) / distance
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
