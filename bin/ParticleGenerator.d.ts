import { ParticleWay } from "./ParticleWay";
import { Particle } from "./Particle";
/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export declare class ParticleGenerator {
    path: ParticleWay[];
    pathSelectType: PathSelectType;
    private pathSelectionCount;
    private _visible;
    protected _particles: Particle[];
    private isPlaying;
    private _particleInterval;
    speedPerSec: number;
    private _ease;
    private _isLoop;
    private _probability;
    private _isOpenValve;
    private elapsedFromGenerate;
    private isDisposed;
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
     * パーティクル生成を開始する。
     */
    openValve(): void;
    /**
     * パーティクル生成を停止する。
     * アニメーションは続行される。
     */
    closeValve(): void;
    private warnValve;
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
     * パーティクルの位置を経過時間分移動する。
     * @param delta 前回アニメーションが実行されてからの経過時間
     */
    private move;
    /**
     * パーティクルを1つ追加する。
     */
    private generate;
    private getPath;
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
     * 寿命切れのパーティクルを一括で削除する。
     */
    private removeCompletedParticles;
    /**
     * 終端にたどり着いたパーティクルを始点に巻き戻す。
     */
    private rollupParticles;
    /**
     * 指定されたパーティクルを削除する。
     * @param particle
     */
    removeParticle(particle: Particle): void;
    /**
     * 全てのパーティクルを削除する。
     */
    removeAllParticles(): void;
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
    setInterval(speed: number, particleNum: number): void;
    /**
     * パーティクル生成の停止とパーティクルの破棄を行う。
     */
    dispose(): void;
    particleInterval: number;
    visible: boolean;
    isLoop: boolean;
    readonly ease: (number: any) => number;
    probability: number;
    /**
     * 各パーティクルのEase関数を更新する。
     * @param ease イージング関数。
     * @param override 現存するパーティクルのEase関数を上書きするか否か。規定値はtrue。
     */
    updateEase(ease: (number: any) => number, override?: boolean): void;
}
/**
 * パーティクル生成方法を指定するオプション
 */
export interface ParticleGeneratorOption {
    isLoop?: boolean;
    ease?: (number: any) => number;
    probability?: number;
}
export declare enum PathSelectType {
    Random = 0,
    Sequential = 1
}
//# sourceMappingURL=ParticleGenerator.d.ts.map