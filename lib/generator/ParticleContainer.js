"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleContainer = void 0;
var GenerationModeManager_1 = require("./GenerationModeManager");
/**
 * 複数のパーティクルを格納、移動、管理するためのクラスです。
 *
 * 主にParticleGeneratorで生成されたパーティクルを管理します。
 * @see {@link ParticleGenerator}
 */
var ParticleContainer = /** @class */ (function () {
    function ParticleContainer(modeManager) {
        var _this = this;
        this._particles = [];
        this._visible = true;
        modeManager.on(GenerationModeManager_1.GenerationModeEventType.change, function (mode) {
            if (mode === GenerationModeManager_1.GenerationMode.LOOP) {
                _this.removeAll();
            }
        });
    }
    Object.defineProperty(ParticleContainer.prototype, "particles", {
        get: function () {
            return this._particles;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParticleContainer.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            var _this = this;
            this._visible = value;
            this._particles.forEach(function (p) {
                p.visible = _this._visible;
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * パーティクルを格納する。
     * @param particle
     */
    ParticleContainer.prototype.add = function (particle) {
        this._particles.push(particle);
        particle.visible = this._visible;
    };
    /**
     * 格納されたすべてのパーティクルを移動させる。
     * @see {@link Particle.add}
     * @param t
     */
    ParticleContainer.prototype.move = function (t) {
        this._particles.forEach(function (p) {
            p.add(t);
        });
    };
    /**
     * 寿命切れのパーティクルを一括で削除する。
     */
    ParticleContainer.prototype.removeCompletedParticles = function () {
        var removed = this._particles
            .filter(function (p) {
            return p.ratio >= 1.0;
        })
            .forEach(function (p) {
            p.dispose();
        });
        this._particles = this._particles.filter(function (p) {
            return p.ratio < 1.0;
        });
    };
    /**
     * 指定されたパーティクルを削除する。
     * @param particle
     */
    ParticleContainer.prototype.remove = function (particle) {
        var i = this._particles.indexOf(particle);
        var popped = this._particles.splice(i, 1);
        popped.forEach(function (val) {
            val.dispose();
        });
    };
    /**
     * 格納されたすべてのパーティクルを削除する。
     */
    ParticleContainer.prototype.removeAll = function () {
        this._particles.forEach(function (p) {
            p.dispose();
        });
        this._particles = [];
    };
    /**
     * 終端にたどり着いたパーティクルを始点に巻き戻す。
     */
    ParticleContainer.prototype.rollupParticles = function () {
        this._particles.forEach(function (p) {
            p.update(p.ratio % 1);
        });
    };
    ParticleContainer.prototype.overrideEase = function (ease) {
        this._particles.forEach(function (p) {
            p.ease = ease;
        });
    };
    return ParticleContainer;
}());
exports.ParticleContainer = ParticleContainer;
