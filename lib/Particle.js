"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * パーティクルを表すクラス。
 * このクラス自体には描画のための機能はない。
 * 各種の描画ライブラリと組み合わせて利用する。
 */
var Particle = /** @class */ (function () {
    /**
     * 指定されたパスに沿って移動するパーティクルを生成する。
     * @param path
     */
    function Particle(path) {
        this._ratio = 0.0;
        this._visible = true;
        this.path = path;
    }
    /**
     * パーティクルの位置を更新する。
     * @param t パーティクルのパス上の位置。入力に制限はないが、ParticleWay側で0.0~1.0の間に丸め込まれる。
     * @return n ease関数で補正済みのt。
     */
    Particle.prototype.update = function (t) {
        this._ratio = t;
        if (this.ease == null) {
            return this._ratio;
        }
        return this.ease(this._ratio);
    };
    /**
     * パーティクル位置を指定された量移動する。
     * @param t 移動量
     */
    Particle.prototype.add = function (t) {
        return this.update(this._ratio + t);
    };
    Object.defineProperty(Particle.prototype, "ratio", {
        /**
         * 現在位置を取得する
         * @return number
         */
        get: function () {
            return this._ratio;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
        },
        enumerable: true,
        configurable: true
    });
    Particle.prototype.dispose = function () { };
    return Particle;
}());
exports.Particle = Particle;
