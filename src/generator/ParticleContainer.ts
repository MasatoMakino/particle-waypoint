import { Particle } from "../Particle";

/**
 * 複数のパーティクルを格納、移動、管理するためのクラスです。
 *
 * 主にParticleGeneratorで生成されたパーティクルを管理します。
 * @see {@link ParticleGenerator}
 */
export class ParticleContainer {
  protected _particles: Particle[] = [];
  get particles(): Particle[] {
    return this._particles;
  }

  private _visible: boolean = true;
  get visible(): boolean {
    return this._visible;
  }
  set visible(value: boolean) {
    this._visible = value;
    this._particles.forEach((p) => {
      p.visible = this._visible;
    });
  }

  constructor() {}

  /**
   * パーティクルを格納する。
   * @param particle
   */
  public add(particle: Particle): void {
    this._particles.push(particle);
    particle.visible = this._visible;
  }

  /**
   * 格納されたすべてのパーティクルを移動させる。
   * @see {@link Particle.add}
   * @param t
   */
  public move(t: number): void {
    this._particles.forEach((p) => {
      p.add(t);
    });
  }
  /**
   * 寿命切れのパーティクルを一括で削除する。
   */
  public removeCompletedParticles(): void {
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
  public remove(particle: Particle): void {
    const i: number = this._particles.indexOf(particle);
    const popped: Particle[] = this._particles.splice(i, 1);
    popped.forEach((val) => {
      val.dispose();
    });
  }

  /**
   * 格納されたすべてのパーティクルを削除する。
   */
  public removeAll(): void {
    this._particles.forEach((p) => {
      p.dispose();
    });
    this._particles = [];
  }

  /**
   * 終端にたどり着いたパーティクルを始点に巻き戻す。
   */
  public rollupParticles(): void {
    this._particles.forEach((p) => {
      p.update(p.ratio % 1);
    });
  }

  public overrideEase(ease: (number) => number): void {
    this._particles.forEach((p) => {
      p.ease = ease;
    });
  }
}
