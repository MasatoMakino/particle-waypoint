export class BezierPath {
  // 3次元ベジェで正円を描く際のコントロールポイント定数
  public static readonly K = (4 * (Math.sqrt(2) - 1)) / 3;
  public static readonly R = 1.0;

  public static getArcPath() {
    const arc = this.getArc();
    return [arc[0], arc[1].slice(0, 2), arc[1].slice(2, 4), arc[1].slice(-2)];
  }

  public static getArc() {
    return this.getCircle().slice(0, 2);
  }

  public static getCircle() {
    const R = this.R;
    const RK = this.R * this.K;
    return [
      [R, 0],
      [R, RK, RK, R, 0, R],
      [-RK, R, -R, RK, -R, 0],
      [-R, -RK, -RK, -R, 0, -R],
      [RK, -R, R, -RK, R, 0]
    ];
  }
}
