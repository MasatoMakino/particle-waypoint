import { GenerationMode, GenerationModeEventType, } from "./GenerationModeManager";
/**
 * 複数のパーティクルを格納、移動、管理するためのクラスです。
 *
 * 主にParticleGeneratorで生成されたパーティクルを管理します。
 * @see {@link ParticleGenerator}
 */
export class ParticleContainer {
    constructor(modeManager) {
        this._particles = [];
        this._visible = true;
        modeManager.on(GenerationModeEventType.change, (mode) => {
            if (mode === GenerationMode.LOOP) {
                this.removeAll();
            }
        });
    }
    get particles() {
        return this._particles;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        this._particles.forEach((p) => {
            p.visible = this._visible;
        });
    }
    /**
     * パーティクルを格納する。
     * @param particle
     */
    add(particle) {
        this._particles.push(particle);
        particle.visible = this._visible;
    }
    /**
     * 格納されたすべてのパーティクルを移動させる。
     * @see {@link Particle.add}
     * @param t
     */
    move(t) {
        this._particles.forEach((p) => {
            p.add(t);
        });
    }
    /**
     * 寿命切れのパーティクルを一括で削除する。
     */
    removeCompletedParticles() {
        const removed = this._particles
            .filter((p) => {
            return p.ratio >= 1.0;
        })
            .forEach((p) => {
            p.dispose();
        });
        this._particles = this._particles.filter((p) => {
            return p.ratio < 1.0;
        });
    }
    /**
     * 指定されたパーティクルを削除する。
     * @param particle
     */
    remove(particle) {
        const i = this._particles.indexOf(particle);
        const popped = this._particles.splice(i, 1);
        popped.forEach((val) => {
            val.dispose();
        });
    }
    /**
     * 格納されたすべてのパーティクルを削除する。
     */
    removeAll() {
        this._particles.forEach((p) => {
            p.dispose();
        });
        this._particles = [];
    }
    /**
     * 終端にたどり着いたパーティクルを始点に巻き戻す。
     */
    rollupParticles() {
        this._particles.forEach((p) => {
            p.update(p.ratio % 1);
        });
    }
    overrideEase(ease) {
        this._particles.forEach((p) => {
            p.ease = ease;
        });
    }
}
