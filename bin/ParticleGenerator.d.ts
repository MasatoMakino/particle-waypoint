import { ParticleWay } from "./ParticleWay";
import { Particle } from "./Particle";
/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export declare class ParticleGenerator {
    path: ParticleWay;
    protected _visible: boolean;
    protected particles: Particle[];
    protected renderID: any;
    particleInterval: number;
    speedPerSec: number;
    ease: (number: any) => number;
    protected _isLoop: boolean;
    private lastParticleTime;
    private lastAnimateTime;
    private isDisposed;
    /**
     * コンストラクタ
     * @param path
     * @param option
     */
    constructor(path: ParticleWay, option?: ParticleGeneratorOption);
    /**
     * パーティクルの生成を開始する。
     */
    play(): void;
    /**
     * パーティクルの生成を停止する。
     */
    stop(): void;
    /**
     * パーティクルをアニメーションさせる。
     * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
     */
    protected animate: (timestamp: number) => void;
    /**
     * パーティクルをループアニメーションさせる。
     * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
     */
    protected loop: (timestamp: number) => void;
    /**
     * パーティクルの位置を経過時間分移動する。
     * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
     */
    protected move(timestamp: number): void;
    /**
     * パーティクルを1つ追加する。
     */
    protected generate(): Particle;
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
     * 終端にたどり着いたパーティクルを視点に巻き戻す。
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
    visible: boolean;
}
/**
 * パーティクル生成方法を指定するオプション
 */
export interface ParticleGeneratorOption {
    isLoop?: boolean;
    ease?: (number: any) => number;
}
/**
 * ParticleGeneratorで利用する各種の値を算出するヘルパークラス
 */
export declare class ParticleGeneratorUtility {
    /**
     * パーティクルの生成インターバルと経路上の数から、移動速度を算出する
     * @param interval
     * @param particleNum
     */
    static getSpeed(interval: number, particleNum: number): number;
    /**
     * パーティクルの移動速度と経路上の数から、生成インターバルを算出する
     * @param speed
     * @param particleNum
     */
    static getInterval(speed: number, particleNum: number): number;
}
//# sourceMappingURL=ParticleGenerator.d.ts.map