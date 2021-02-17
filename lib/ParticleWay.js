"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleWay = void 0;
/**
 * 中間点の座標の算出が可能な経路を表すクラス
 */
var Particle_1 = require("./Particle");
var BezierUtil_1 = require("./BezierUtil");
var ParticleWay = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param points 経路を表す座標の配列。要素数によってどのようなパスかが判定される。
     *   要素数2 : 2次元パス
     *   要素数3 : 3次元パス
     *   要素数6 : 平面3次元ベジェ曲線
     */
    function ParticleWay(points) {
        this.name = "";
        this.points = points;
    }
    Object.defineProperty(ParticleWay.prototype, "points", {
        get: function () {
            return this._points;
        },
        /**
         * 経路の座標配列を更新する。
         * @param points
         */
        set: function (points) {
            this._points = points;
            this.onSetPoints();
        },
        enumerable: false,
        configurable: true
    });
    ParticleWay.prototype.warnPoints = function () {
        if (this._points.length === 0) {
            console.warn("ParticleWay : 長さゼロの配列が指定されました。座標が算出できないため、getPoint関数は常にnullを返します。");
        }
        if (this._points.length === 1) {
            console.warn("ParticleWay : 長さ1の配列が指定されました。座標が算出できないため、getPoint関数は常に固定の座標を返します。");
        }
    };
    /**
     * pointsが更新された際の処理。
     * set pointsをトリガーにして実行される。
     */
    ParticleWay.prototype.onSetPoints = function () {
        this.warnPoints();
        var sumTable = new Array(this._points.length).fill(0);
        this._points.forEach(function (val, index, array) {
            if (index === 0)
                return;
            sumTable[index] =
                ParticleWay.getDistance(array[index - 1], val) + sumTable[index - 1];
        });
        var total = sumTable[sumTable.length - 1];
        this._ratioTable = sumTable.map(function (val) {
            return val / total;
        });
    };
    /**
     * 2点間の距離を取得する。
     * @param pos1
     * @param pos2
     */
    ParticleWay.getDistance = function (pos1, pos2) {
        var dx = pos2[0] - pos1[0];
        var dy = pos2[1] - pos1[1];
        switch (pos2.length) {
            case 6:
                return BezierUtil_1.BezierUtil.getLengthFromCommand(pos1, pos2);
            case 3:
                var dz = pos2[2] - pos1[2];
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            case 2:
                return Math.sqrt(dx * dx + dy * dy);
        }
    };
    /**
     * 経路上の中間点座標を取得する。
     * @param t 算出する座標の位置。0.0(始点) ~ 1.0(終点)の間。
     */
    ParticleWay.prototype.getPoint = function (t) {
        t = ParticleWayUtil.clampRatio(t);
        var limited = this.getLimitPoint(t);
        if (limited !== false)
            return limited;
        var i = ParticleWayUtil.getTIndex(t, this._ratioTable);
        var floorPoint = this._points[i];
        var ceilPoint = this._points[i + 1];
        var ratioBase = this._ratioTable[i];
        return this.getCenterPoint(floorPoint, ceilPoint, (t - ratioBase) / (this._ratioTable[i + 1] - ratioBase));
    };
    /**
     * getPointのうち、制限にかかる値を取得する。
     * @param t
     * @private
     */
    ParticleWay.prototype.getLimitPoint = function (t) {
        if (!this._points || this._points.length === 0) {
            return null;
        }
        if (t === Particle_1.Particle.MAX_RATIO) {
            return ParticleWayUtil.getPositionWithMaxT(this._points);
        }
        if (this._points.length === 1 || t === Particle_1.Particle.MIN_RATIO) {
            return __spreadArrays(this._points[0]);
        }
        return false;
    };
    /**
     * 線分上の中間点座標を取得する
     * @param pos1 線分の始点
     * @param pos2 線分の終点
     * @param t 算出する座標の位置。0.0(始点) ~ 1.0(終点)の間。
     */
    ParticleWay.prototype.getCenterPoint = function (pos1, pos2, t) {
        var rt = 1.0 - t;
        var pos = [pos1[0] * rt + pos2[0] * t, pos1[1] * rt + pos2[1] * t];
        switch (pos2.length) {
            case 6:
                return BezierUtil_1.BezierUtil.getPointFromCommand(t, pos1, pos2);
            case 3:
                pos.push(pos1[2] * rt + pos2[2] * t);
                return pos;
            case 2:
                return pos;
        }
    };
    return ParticleWay;
}());
exports.ParticleWay = ParticleWay;
var ParticleWayUtil = /** @class */ (function () {
    function ParticleWayUtil() {
    }
    ParticleWayUtil.clamp = function (val, max, min) {
        return Math.min(Math.max(val, min), max);
    };
    ParticleWayUtil.clampRatio = function (val) {
        return this.clamp(val, Particle_1.Particle.MAX_RATIO, Particle_1.Particle.MIN_RATIO);
    };
    ParticleWayUtil.getPositionWithMaxT = function (points) {
        var n = points.length;
        var result = points[n - 1];
        if (result.length === 6) {
            result = result.slice(-2);
        }
        return __spreadArrays(result);
    };
    ParticleWayUtil.getTIndex = function (t, ratioTable) {
        var i = 1;
        var n = ratioTable.length;
        for (i; i < n; i++) {
            if (ratioTable[i] >= t)
                break;
        }
        i--;
        return i;
    };
    return ParticleWayUtil;
}());
