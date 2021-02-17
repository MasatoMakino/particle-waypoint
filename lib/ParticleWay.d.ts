export declare class ParticleWay {
    name: string;
    private _points;
    protected _ratioTable: number[];
    /**
     * コンストラクタ
     * @param points 経路を表す座標の配列。要素数によってどのようなパスかが判定される。
     *   要素数2 : 2次元パス
     *   要素数3 : 3次元パス
     *   要素数6 : 平面3次元ベジェ曲線
     */
    constructor(points: number[][]);
    /**
     * 経路の座標配列を更新する。
     * @param points
     */
    set points(points: number[][]);
    private warnPoints;
    /**
     * pointsが更新された際の処理。
     * set pointsをトリガーにして実行される。
     */
    protected onSetPoints(): void;
    get points(): number[][];
    /**
     * 2点間の距離を取得する。
     * @param pos1
     * @param pos2
     */
    static getDistance(pos1: number[], pos2: number[]): number;
    /**
     * 経路上の中間点座標を取得する。
     * @param t 算出する座標の位置。0.0(始点) ~ 1.0(終点)の間。
     */
    getPoint(t: number): number[] | null;
    /**
     * getPointのうち、制限にかかる値を取得する。
     * @param t
     * @private
     */
    private getLimitPoint;
    /**
     * 線分上の中間点座標を取得する
     * @param pos1 線分の始点
     * @param pos2 線分の終点
     * @param t 算出する座標の位置。0.0(始点) ~ 1.0(終点)の間。
     */
    private getCenterPoint;
}
//# sourceMappingURL=ParticleWay.d.ts.map