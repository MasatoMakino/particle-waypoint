import { RAFTicker, RAFTickerEventType } from "raf-ticker";
import { Particle } from "../Particle";
import { GenerationMode, GenerationModeEventType, GenerationModeManager, } from "./GenerationModeManager";
import { MultipleParticleWays } from "./MultipleParticleWays";
import { ParticleAnimator } from "./ParticleAnimator";
import { ParticleContainer } from "./ParticleContainer";
import { ParticleValve } from "./ParticleValve";
/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export class ParticleGenerator {
    /**
     * コンストラクタ
     * @param path
     * @param option
     */
    constructor(path, option) {
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
        this.animate = (e) => {
            if (this._isDisposed)
                return;
            this.animator.move(e.delta);
            this.particleContainer.removeCompletedParticles();
            this.addParticle(e.delta);
        };
        /**
         * パーティクルをループアニメーションさせる。
         * @param e
         */
        this.loop = (e) => {
            if (this._isDisposed)
                return;
            if (this.particleContainer.particles.length === 0) {
                this.generateAll();
            }
            this.animator.move(e.delta);
            this.particleContainer.rollupParticles();
        };
        this.modeManager = new GenerationModeManager();
        this.multipleWays = new MultipleParticleWays({ ways: path });
        this.particleContainer = new ParticleContainer(this.modeManager);
        this.valve = new ParticleValve(this.modeManager);
        this.animator = new ParticleAnimator(this.modeManager, this.particleContainer);
        this.modeManager.on(GenerationModeEventType.change, (val) => {
            if (this._isPlaying) {
                this.stop();
                this.play();
            }
        });
        option = ParticleGeneratorOption.initOption(option);
        this.modeManager.mode = option.generationMode;
        this.animator.updateEase(option.ease);
        this.probability = option.probability;
    }
    get isPlaying() {
        return this._isPlaying;
    }
    /**
     * パーティクルアニメーションを開始する。
     */
    play() {
        if (this._isPlaying)
            return;
        this._isPlaying = true;
        switch (this.modeManager.mode) {
            case GenerationMode.LOOP:
                RAFTicker.addListener(RAFTickerEventType.tick, this.loop);
                break;
            case GenerationMode.SEQUENTIAL:
                RAFTicker.addListener(RAFTickerEventType.tick, this.animate);
                break;
        }
    }
    /**
     * パーティクルアニメーションを停止する。
     */
    stop() {
        if (!this._isPlaying)
            return;
        this._isPlaying = false;
        RAFTicker.removeListener(RAFTickerEventType.tick, this.loop);
        RAFTicker.removeListener(RAFTickerEventType.tick, this.animate);
    }
    /**
     * アニメーションに伴い、新規パーティクルを追加する。
     * @param delta
     */
    addParticle(delta) {
        if (!this.valve.isOpen)
            return;
        const anim = this.animator;
        this.elapsedFromGenerate += delta;
        while (this.elapsedFromGenerate > anim.generationInterval) {
            this.elapsedFromGenerate -= anim.generationInterval;
            const move = (this.elapsedFromGenerate * anim.speedPerSec) / 1000;
            //すでに寿命切れのパーティクルは生成をスキップ。
            if (move > Particle.MAX_RATIO) {
                continue;
            }
            const particle = this.generate();
            particle === null || particle === void 0 ? void 0 : particle.add(move);
        }
    }
    /**
     * パーティクルを1つ追加する。
     */
    generate() {
        this.multipleWays.countUp();
        //発生確率に応じて生成の可否を判定する。
        if (this.probability !== 1.0) {
            if (Math.random() > this.probability)
                return null;
        }
        const path = this.multipleWays.getParticleWay();
        const particle = this.generateParticle(path);
        if (this.animator.ease != null) {
            particle.ease = this.animator.ease;
        }
        this.particleContainer.add(particle);
        return particle;
    }
    /**
     * パーティクルを生成する。
     * generate関数の内部処理。
     * @param path
     */
    generateParticle(path) {
        const particle = new Particle(path);
        //TODO ここでコンテナに挿入。
        return particle;
    }
    /**
     * 経路上にパーティクルを敷き詰める。
     */
    generateAll() {
        //パーティクルの最大生存期間 単位ミリ秒
        let lifeTime = 1000.0 / this.animator.speedPerSec;
        while (lifeTime > 0.0) {
            const particle = this.generate();
            if (particle)
                particle.update((lifeTime / 1000) * this.animator.speedPerSec);
            lifeTime -= this.animator.generationInterval;
        }
        this.elapsedFromGenerate = 0;
    }
    /**
     * パーティクル生成の停止とパーティクルの破棄を行う。
     */
    dispose() {
        this.stop();
        this._isDisposed = true;
        this.particleContainer.removeAll();
        this.particleContainer = null;
        this.multipleWays = null;
    }
}
/**
 * パーティクル生成方法を指定するオプション
 */
export class ParticleGeneratorOption {
    static initOption(option) {
        var _a, _b;
        option !== null && option !== void 0 ? option : (option = {});
        (_a = option.generationMode) !== null && _a !== void 0 ? _a : (option.generationMode = GenerationMode.SEQUENTIAL);
        (_b = option.probability) !== null && _b !== void 0 ? _b : (option.probability = 1.0);
        return option;
    }
}
