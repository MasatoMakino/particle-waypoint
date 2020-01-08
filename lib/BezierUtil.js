"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParticleWay_1 = require("./ParticleWay");
var BezierUtil = /** @class */ (function () {
    function BezierUtil() {
    }
    /**
     * ベジェ曲線の中間座標を取得する。
     *
     * @param t 媒介変数 0.0 ~ 1.0
     * @param from 始点
     * @param c1 コントロールポイント1
     * @param c2 コントロールポイント2
     * @param to 終点
     */
    BezierUtil.getPoint = function (t, from, c1, c2, to) {
        var addPoint = function (p1, p2, coefficient) {
            p1[0] += coefficient * p2[0];
            p1[1] += coefficient * p2[1];
        };
        var result = [0, 0];
        var difT = 1 - t;
        var v = Math.pow(difT, 3);
        addPoint(result, from, v);
        v = 3 * Math.pow(difT, 2) * t;
        addPoint(result, c1, v);
        v = 3 * Math.pow(t, 2) * difT;
        addPoint(result, c2, v);
        v = Math.pow(t, 3);
        addPoint(result, to, v);
        return result;
    };
    /**
     * ベジェ曲線描画コマンドから、ベジェ曲線の中間座標を取得する。
     * @param t
     * @param command1 始点側の描画コマンド 要素数2もしくは6の配列
     * @param command2 終点側の描画コマンド 要素数6の配列
     */
    BezierUtil.getPointFromCommand = function (t, command1, command2) {
        return this.getPoint(t, command1.slice(-2), command2.slice(0, 2), command2.slice(2, 4), command2.slice(-2));
    };
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
    BezierUtil.getLength = function (from, c1, c2, to, div) {
        if (div === void 0) { div = 16; }
        var result = 0;
        var prevPoint;
        for (var i = 0; i < div + 1; i++) {
            var p = this.getPoint(i / div, from, c1, c2, to);
            if (prevPoint) {
                result += ParticleWay_1.ParticleWay.getDistance(prevPoint, p);
            }
            prevPoint = p;
        }
        return result;
    };
    /**
     * ベジェ曲線描画コマンドから、ベジェ曲線の長さを取得する。
     *
     * @param command1 始点側の描画コマンド 要素数2もしくは6の配列
     * @param command2 終点側の描画コマンド 要素数6の配列
     * @param div 分割数 多いほど精度が向上し、計算負荷は上昇する。 既定値16
     */
    BezierUtil.getLengthFromCommand = function (command1, command2, div) {
        if (div === void 0) { div = 16; }
        return this.getLength(command1.slice(-2), command2.slice(0, 2), command2.slice(2, 4), command2.slice(-2), div);
    };
    /**
     * 3次ベジェ曲線を2次元座標の配列に分解する。
     * @param commands
     * @param div 分割数 デフォルトは16
     */
    BezierUtil.subdivide = function (commands, div) {
        if (div === void 0) { div = 16; }
        var points = [];
        for (var i = 1; i < commands.length; i++) {
            var sub = this.subdivideSubPath(commands[i - 1], commands[i], div);
            if (i !== 1) {
                sub = sub.slice(1);
            }
            points.push.apply(points, sub);
        }
        return points;
    };
    BezierUtil.subdivideSubPath = function (command1, command2, div) {
        if (div === void 0) { div = 16; }
        var points = [];
        for (var i = 0; i < div + 1; i++) {
            points.push(this.getPointFromCommand(i / div, command1, command2));
        }
        return points;
    };
    return BezierUtil;
}());
exports.BezierUtil = BezierUtil;
