"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ParticleGeneratorで利用する各種の値を算出するヘルパークラス
 */
var ParticleGeneratorUtility = /** @class */ (function () {
    function ParticleGeneratorUtility() {
    }
    /**
     * パーティクルの生成インターバルと経路上の数から、移動速度を算出する
     * @param interval
     * @param particleNum
     */
    ParticleGeneratorUtility.getSpeed = function (interval, particleNum) {
        return (1.0 / (interval * particleNum)) * 1000;
    };
    /**
     * パーティクルの移動速度と経路上の数から、生成インターバルを算出する
     * @param speed
     * @param particleNum
     */
    ParticleGeneratorUtility.getInterval = function (speed, particleNum) {
        return (1.0 / speed / particleNum) * 1000;
    };
    return ParticleGeneratorUtility;
}());
exports.ParticleGeneratorUtility = ParticleGeneratorUtility;
