import { ParticleWay } from "./ParticleWay";
import { Particle } from "./Particle";
/**
 * 一定間隔でパーティクルを生成し、アニメーションさせるクラス。
 * パーティクルインスタンスの生成と管理を行う。
 */
export declare class ParticleGenerator {
    path: ParticleWay;
    private _visible;
    private particles;
    private renderID;
    private _particleInterval;
    speedPerSec: number;
    private _ease;
    private _isLoop;
    private _probability;
    private _isOpenValve;
    private elapsedFromGenerate;
    private lastAnimateTime;
    private isDisposed;
    /**
     * コンストラクタ
     * @param path
     * @param option
     */
    constructor(path: ParticleWay, option?: ParticleGeneratorOption);
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
     * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
     */
    private animate;
    /**
     * アニメーションに伴い、新規パーティクルを追加する。
     * @param delta
     */
    private addParticle;
    /**
     * パーティクルをループアニメーションさせる。
     * @param timestamp requestAnimationFrameのタイムスタンプ。単位ミリ秒。
     */
    private loop;
    /**
     * 前回アニメーション実行時からの経過時間を取得する。
     * @param timestamp
     */
    private getDelta;
    /**
     * パーティクルの位置を経過時間分移動する。
     * @param delta 前回アニメーションが実行されてからの経過時間
     */
    private move;
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
    particleInterval: number;
    visible: boolean;
    isLoop: boolean;
    readonly ease: (number: any) => number;
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