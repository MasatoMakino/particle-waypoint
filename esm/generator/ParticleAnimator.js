import { GenerationMode } from "./GenerationModeManager";
import { ParticleGeneratorUtility } from "./ParticleGeneratorUtility";
export class ParticleAnimator {
    constructor(modeManager, particleContainer) {
        this._generationInterval = 300;
        this.speedPerSec = 0.07;
        this._particleContainer = particleContainer;
        this._modeManager = modeManager;
    }
    get generationInterval() {
        return this._generationInterval;
    }
    set generationInterval(value) {
        if (this._generationInterval === value)
            return;
        this._generationInterval = value;
        if (this._modeManager.mode === GenerationMode.LOOP) {
            console.warn("ParticleGenerator : ループ指定中にパーティクル生成間隔を再設定しても反映されません。設定を反映するためにパーティクルを削除して再生成してください。");
            console.trace();
        }
    }
    get ease() {
        return this._ease;
    }
    /**
     * 生成インターバルと経路上のパーティクル数から移動スピードを算出し設定する。
     * loop時に破綻しない値が得られる。
     * @param interval
     * @param particleNum
     */
    setSpeed(interval, particleNum) {
        this._generationInterval = interval;
        this.speedPerSec = ParticleGeneratorUtility.getSpeed(interval, particleNum);
    }
    /**
     * 移動スピードと経路上のパーティクル数から生成インターバルを算出し設定する。
     * loop時に破綻しない値が得られる。
     * @param speed
     * @param particleNum
     */
    setGenerationInterval(speed, particleNum) {
        this.speedPerSec = speed;
        this._generationInterval = ParticleGeneratorUtility.getInterval(speed, particleNum);
    }
    /**
     * パーティクルの位置を経過時間分移動する。
     * @param delta 前回アニメーションが実行されてからの経過時間 単位ms
     */
    move(delta) {
        const movement = (delta / 1000) * this.speedPerSec;
        this._particleContainer.move(movement);
    }
    /**
     * 各パーティクルのEase関数を更新する。
     * @param ease イージング関数。
     * @param override 現存するパーティクルのEase関数を上書きするか否か。規定値はtrue。
     */
    updateEase(ease, override = true) {
        this._ease = ease;
        if (!override && this._modeManager.mode === GenerationMode.LOOP) {
            console.warn("ParticleGenerator : ループ指定中にEase関数を再設定すると、既存のパーティクルのEase関数は常に上書きされます。");
            console.trace();
        }
        if (override || this._modeManager.mode === GenerationMode.LOOP) {
            this._particleContainer.overrideEase(ease);
        }
    }
}
