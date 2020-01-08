export declare class BezierUtil {
    /**
     * ベジェ曲線の中間座標を取得する。
     *
     * @param t 媒介変数 0.0 ~ 1.0
     * @param from 始点
     * @param c1 コントロールポイント1
     * @param c2 コントロールポイント2
     * @param to 終点
     */
    static getPoint(t: number, from: number[], c1: number[], c2: number[], to: number[]): number[];
    /**
     * ベジェ曲線描画コマンドから、ベジェ曲線の中間座標を取得する。
     * @param t
     * @param command1 始点側の描画コマンド 要素数2もしくは6の配列
     * @param command2 終点側の描画コマンド 要素数6の配列
     */
    static getPointFromCommand(t: number, command1: number[], command2: number[]): number[];
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
    static getLength(from: number[], c1: number[], c2: number[], to: number[], div?: number): number;
    /**
     * ベジェ曲線描画コマンドから、ベジェ曲線の長さを取得する。
     *
     * @param command1 始点側の描画コマンド 要素数2もしくは6の配列
     * @param command2 終点側の描画コマンド 要素数6の配列
     * @param div 分割数 多いほど精度が向上し、計算負荷は上昇する。 既定値16
     */
    static getLengthFromCommand(command1: number[], command2: number[], div?: number): number;
    /**
     * 3次ベジェ曲線を2次元座標の配列に分解する。
     * @param commands
     * @param div 分割数 デフォルトは16
     */
    static subdivide(commands: number[][], div?: number): number[][];
    private static subdivideSubPath;
}
//# sourceMappingURL=BezierUtil.d.ts.map