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
    protected lastParticleTime: number;
    protected lastAnimateTime: number;
    ease: (number: any) => number;
    protected _isLoop: boolean;
    private isDisposed;
    speedPerSec: number;
    /**
     * @param path
     * @param option
     */
    constructor(path: ParticleWay, option?: ParticleGeneratorOption);
    play(): void;
    stop(): void;
    /**
     * パーティクルをアニメーションさせる。
     * @param timestamp
     */
    protected animate: (timestamp: number) => void;
    /**
     * パーティクルをループアニメーションさせる。
     * @param timestamp
     */
    protected loop: (timestamp: number) => void;
    /**
     * パーティクルの位置を経過時間分移動する。
     * @param timestamp
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
     * パーティクル生成の停止とパーティクルの破棄を行う。
     */
    dispose(): void;
    visible: boolean;
}
export interface ParticleGeneratorOption {
    isLoop?: boolean;
    ease?: (number: any) => number;
}
//# sourceMappingURL=ParticleGenerator.d.ts.map