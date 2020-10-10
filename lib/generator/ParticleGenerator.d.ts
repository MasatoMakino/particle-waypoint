import { Particle } from "../Particle";
import { ParticleWay } from "../ParticleWay";
import { GenerationMode, GenerationModeManager } from "./GenerationModeManager";
import { MultipleParticleWays } from "./MultipleParticleWays";
import { ParticleAnimator } from "./ParticleAnimator";
import { ParticleContainer } from "./ParticleContainer";
import { ParticleValve } from "./ParticleValve";
/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export declare class ParticleGenerator {
    multipleWays: MultipleParticleWays;
    particleContainer: ParticleContainer;
    valve: ParticleValve;
    animator: ParticleAnimator;
    modeManager: GenerationModeManager;
    private _isPlaying;
    get isPlaying(): boolean;
    probability: number;
    /**
     * 前回パーティクル生成時からの経過時間 単位ms
     * @private
     */
    private elapsedFromGenerate;
    private _isDisposed;
    /**
     * コンストラクタ
     * @param path
     * @param option
     */
    constructor(path: ParticleWay | ParticleWay[], option?: ParticleGeneratorOption);
    /**
     * パーティクルアニメーションを開始する。
     */
    play(): void;
    /**
     * パーティクルアニメーションを停止する。
     */
    stop(): void;
    /**
     * パーティクルをアニメーションさせる。
     * @param e
     */
    private animate;
    /**
     * アニメーションに伴い、新規パーティクルを追加する。
     * @param delta
     */
    private addParticle;
    /**
     * パーティクルをループアニメーションさせる。
     * @param e
     */
    private loop;
    /**
     * パーティクルを1つ追加する。
     */
    private generate;
    /**
     * パーティクルを生成する。
     * generate関数の内部処理。
     * @param path
     */
    protected generateParticle(path: ParticleWay): Particle;
    /**
     * 経路上にパーティクルを敷き詰める。
     */
    generateAll(): void;
    /**
     * パーティクル生成の停止とパーティクルの破棄を行う。
     */
    dispose(): void;
}
/**
 * パーティクル生成方法を指定するオプション
 */
export declare class ParticleGeneratorOption {
    generationMode?: GenerationMode;
    ease?: (number: any) => number;
    probability?: number;
    static initOption(option?: ParticleGeneratorOption): ParticleGeneratorOption;
}
//# sourceMappingURL=ParticleGenerator.d.ts.map