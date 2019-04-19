import { ParticleWay } from "./ParticleWay";
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
    static getPointOnBezierCurve(t, from, c1, c2, to) {
        const addPoint = (p1, p2, coefficient) => {
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
    static getPointFromCommand(t, command1, command2) {
        return this.getPointOnBezierCurve(t, command1.slice(-2), command2.slice(0, 2), command2.slice(2, 4), command2.slice(-2));
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
    static getLengthOfBezierCurve(from, c1, c2, to, div = 16) {
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
    /**
     * ベジェ曲線描画コマンドから、ベジェ曲線の長さを取得する。
     *
     * @param command1 始点側の描画コマンド 要素数2もしくは6の配列
     * @param command2 終点側の描画コマンド 要素数6の配列
     * @param div 分割数 多いほど精度が向上し、計算負荷は上昇する。 既定値16
     */
    static getLengthFromCommand(command1, command2, div = 16) {
        return this.getLengthOfBezierCurve(command1.slice(-2), command2.slice(0, 2), command2.slice(2, 4), command2.slice(-2), div);
    }
}
