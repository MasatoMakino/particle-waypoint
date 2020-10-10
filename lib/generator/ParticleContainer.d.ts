import { Particle } from "../Particle";
import { GenerationModeManager } from "./GenerationModeManager";
/**
 * 複数のパーティクルを格納、移動、管理するためのクラスです。
 *
 * 主にParticleGeneratorで生成されたパーティクルを管理します。
 * @see {@link ParticleGenerator}
 */
export declare class ParticleContainer {
    protected _particles: Particle[];
    get particles(): Particle[];
    private _visible;
    get visible(): boolean;
    set visible(value: boolean);
    constructor(modeManager: GenerationModeManager);
    /**
     * パーティクルを格納する。
     * @param particle
     */
    add(particle: Particle): void;
    /**
     * 格納されたすべてのパーティクルを移動させる。
     * @see {@link Particle.add}
     * @param t
     */
    move(t: number): void;
    /**
     * 寿命切れのパーティクルを一括で削除する。
     */
    removeCompletedParticles(): void;
    /**
     * 指定されたパーティクルを削除する。
     * @param particle
     */
    remove(particle: Particle): void;
    /**
     * 格納されたすべてのパーティクルを削除する。
     */
    removeAll(): void;
    /**
     * 終端にたどり着いたパーティクルを始点に巻き戻す。
     */
    rollupParticles(): void;
    overrideEase(ease: (number: any) => number): void;
}
//# sourceMappingURL=ParticleContainer.d.ts.map