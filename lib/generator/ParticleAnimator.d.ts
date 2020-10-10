import { ParticleContainer } from "./ParticleContainer";
import { GenerationModeManager } from "./GenerationModeManager";
export declare class ParticleAnimator {
    private _generationInterval;
    get generationInterval(): number;
    set generationInterval(value: number);
    speedPerSec: number;
    private _ease;
    get ease(): (number: any) => number;
    private _modeManager;
    private _particleContainer;
    constructor(modeManager: GenerationModeManager, particleContainer: ParticleContainer);
    /**
     * 生成インターバルと経路上のパーティクル数から移動スピードを算出し設定する。
     * loop時に破綻しない値が得られる。
     * @param interval
     * @param particleNum
     */
    setSpeed(interval: number, particleNum: number): void;
    /**
     * 移動スピードと経路上のパーティクル数から生成インターバルを算出し設定する。
     * loop時に破綻しない値が得られる。
     * @param speed
     * @param particleNum
     */
    setGenerationInterval(speed: number, particleNum: number): void;
    /**
     * パーティクルの位置を経過時間分移動する。
     * @param delta 前回アニメーションが実行されてからの経過時間 単位ms
     */
    move(delta: number): void;
    /**
     * 各パーティクルのEase関数を更新する。
     * @param ease イージング関数。
     * @param override 現存するパーティクルのEase関数を上書きするか否か。規定値はtrue。
     */
    updateEase(ease: (number: any) => number, override?: boolean): void;
}
//# sourceMappingURL=ParticleAnimator.d.ts.map