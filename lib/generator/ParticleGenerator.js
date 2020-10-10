"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleGeneratorOption = exports.ParticleGenerator = void 0;
var raf_ticker_1 = require("raf-ticker");
var Particle_1 = require("../Particle");
var GenerationModeManager_1 = require("./GenerationModeManager");
var MultipleParticleWays_1 = require("./MultipleParticleWays");
var ParticleAnimator_1 = require("./ParticleAnimator");
var ParticleContainer_1 = require("./ParticleContainer");
var ParticleValve_1 = require("./ParticleValve");
/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
var ParticleGenerator = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param path
     * @param option
     */
    function ParticleGenerator(path, option) {
        var _this = this;
        this._isPlaying = false;
        /**
         * 前回パーティクル生成時からの経過時間 単位ms
         * @private
         */
        this.elapsedFromGenerate = 0;
        this._isDisposed = false;
        /**
         * パーティクルをアニメーションさせる。
         * @param e
         */
        this.animate = function (e) {
            if (_this._isDisposed)
                return;
            _this.animator.move(e.delta);
            _this.particleContainer.removeCompletedParticles();
            _this.addParticle(e.delta);
        };
        /**
         * パーティクルをループアニメーションさせる。
         * @param e
         */
        this.loop = function (e) {
            if (_this._isDisposed)
                return;
            if (_this.particleContainer.particles.length === 0) {
                _this.generateAll();
            }
            _this.animator.move(e.delta);
            _this.particleContainer.rollupParticles();
        };
        this.modeManager = new GenerationModeManager_1.GenerationModeManager();
        this.multipleWays = new MultipleParticleWays_1.MultipleParticleWays({ ways: path });
        this.particleContainer = new ParticleContainer_1.ParticleContainer(this.modeManager);
        this.valve = new ParticleValve_1.ParticleValve(this.modeManager);
        this.animator = new ParticleAnimator_1.ParticleAnimator(this.modeManager, this.particleContainer);
        this.modeManager.on(GenerationModeManager_1.GenerationModeEventType.change, function (val) {
            if (_this._isPlaying) {
                _this.stop();
                _this.play();
            }
        });
        option = ParticleGeneratorOption.initOption(option);
        this.modeManager.mode = option.generationMode;
        this.animator.updateEase(option.ease);
        this.probability = option.probability;
    }
    Object.defineProperty(ParticleGenerator.prototype, "isPlaying", {
        get: function () {
            return this._isPlaying;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * パーティクルアニメーションを開始する。
     */
    ParticleGenerator.prototype.play = function () {
        if (this._isPlaying)
            return;
        this._isPlaying = true;
        switch (this.modeManager.mode) {
            case GenerationModeManager_1.GenerationMode.LOOP:
                raf_ticker_1.RAFTicker.addListener(raf_ticker_1.RAFTickerEventType.tick, this.loop);
                break;
            case GenerationModeManager_1.GenerationMode.SEQUENTIAL:
                raf_ticker_1.RAFTicker.addListener(raf_ticker_1.RAFTickerEventType.tick, this.animate);
                break;
        }
    };
    /**
     * パーティクルアニメーションを停止する。
     */
    ParticleGenerator.prototype.stop = function () {
        if (!this._isPlaying)
            return;
        this._isPlaying = false;
        raf_ticker_1.RAFTicker.removeListener(raf_ticker_1.RAFTickerEventType.tick, this.loop);
        raf_ticker_1.RAFTicker.removeListener(raf_ticker_1.RAFTickerEventType.tick, this.animate);
    };
    /**
     * アニメーションに伴い、新規パーティクルを追加する。
     * @param delta
     */
    ParticleGenerator.prototype.addParticle = function (delta) {
        if (!this.valve.isOpen)
            return;
        var anim = this.animator;
        this.elapsedFromGenerate += delta;
        while (this.elapsedFromGenerate > anim.generationInterval) {
            this.elapsedFromGenerate -= anim.generationInterval;
            var move = (this.elapsedFromGenerate * anim.speedPerSec) / 1000;
            //すでに寿命切れのパーティクルは生成をスキップ。
            if (move > Particle_1.Particle.MAX_RATIO) {
                continue;
            }
            var particle = this.generate();
            particle === null || particle === void 0 ? void 0 : particle.add(move);
        }
    };
    /**
     * パーティクルを1つ追加する。
     */
    ParticleGenerator.prototype.generate = function () {
        this.multipleWays.countUp();
        //発生確率に応じて生成の可否を判定する。
        if (this.probability !== 1.0) {
            if (Math.random() > this.probability)
                return null;
        }
        var path = this.multipleWays.getParticleWay();
        var particle = this.generateParticle(path);
        if (this.animator.ease != null) {
            particle.ease = this.animator.ease;
        }
        this.particleContainer.add(particle);
        return particle;
    };
    /**
     * パーティクルを生成する。
     * generate関数の内部処理。
     * @param path
     */
    ParticleGenerator.prototype.generateParticle = function (path) {
        var particle = new Particle_1.Particle(path);
        //TODO ここでコンテナに挿入。
        return particle;
    };
    /**
     * 経路上にパーティクルを敷き詰める。
     */
    ParticleGenerator.prototype.generateAll = function () {
        //パーティクルの最大生存期間 単位ミリ秒
        var lifeTime = 1000.0 / this.animator.speedPerSec;
        while (lifeTime > 0.0) {
            var particle = this.generate();
            if (particle)
                particle.update((lifeTime / 1000) * this.animator.speedPerSec);
            lifeTime -= this.animator.generationInterval;
        }
        this.elapsedFromGenerate = 0;
    };
    /**
     * パーティクル生成の停止とパーティクルの破棄を行う。
     */
    ParticleGenerator.prototype.dispose = function () {
        this.stop();
        this._isDisposed = true;
        this.particleContainer.removeAll();
        this.particleContainer = null;
        this.multipleWays = null;
    };
    return ParticleGenerator;
}());
exports.ParticleGenerator = ParticleGenerator;
/**
 * パーティクル生成方法を指定するオプション
 */
var ParticleGeneratorOption = /** @class */ (function () {
    function ParticleGeneratorOption() {
    }
    ParticleGeneratorOption.initOption = function (option) {
        var _a, _b;
        option !== null && option !== void 0 ? option : (option = {});
        (_a = option.generationMode) !== null && _a !== void 0 ? _a : (option.generationMode = GenerationModeManager_1.GenerationMode.SEQUENTIAL);
        (_b = option.probability) !== null && _b !== void 0 ? _b : (option.probability = 1.0);
        return option;
    };
    return ParticleGeneratorOption;
}());
exports.ParticleGeneratorOption = ParticleGeneratorOption;
