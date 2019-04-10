/**
 * 中間点の座標の算出が可能な経路を表すクラス
 */
export declare class ParticleWay {
    name: string;
    protected _points: number[][];
    protected _ratioTable: number[];
    /**
     * コンストラクタ
     * @param points 経路を表す座標の配列。各座標は要素2なら2次元パス、要素3なら3次元パスとして扱われる。
     */
    constructor(points: number[][]);
    /**
     * 経路の座標配列を更新する。
     * @param points
     */
    setPoints(points: number[][]): void;
    /**
     * 2点間の距離を取得する。
     * @param pos1
     * @param pos2
     */
    private getDistance;
    /**
     * 経路上の中間点座標を取得する。
     * @param t 算出する座標の位置。0.0(始点) ~ 1.0(終点)の間。
     */
    getPoint(t: number): number[] | null;
    /**
     * 線分上の中間点座標を取得する
     * @param pos1 線分の始点
     * @param pos2 線分の終点
     * @param t 算出する座標の位置。0.0(始点) ~ 1.0(終点)の間。
     */
    private getCenterPoint;
}
//# sourceMappingURL=ParticleWay.d.ts.map