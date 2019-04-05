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
    private isDisposed;
    speedPerSec: number;
    /**
     * @param path
     */
    constructor(path: ParticleWay);
    play(): void;
    stop(): void;
    protected animate: (timestamp: number) => void;
    protected generate(): Particle;
    /**
     * パーティクルを生成する。
     * generate関数の内部処理。
     * @param path
     */
    protected generateParticle(path: ParticleWay): Particle;
    generateAll(): void;
    /**
     * 寿命切れのパーティクルを一括で削除する。
     */
    private removeCompletedParticles;
    /**
     * 指定されたパーティクルを削除する。
     * @param particle
     */
    private removeParticle;
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
//# sourceMappingURL=ParticleGenerator.d.ts.map