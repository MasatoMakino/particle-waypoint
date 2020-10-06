import { ParticleWay } from "./ParticleWay";

/**
 * パーティクルを表すクラス。
 * このクラス自体には描画のための機能はない。
 * 各種の描画ライブラリと組み合わせて利用する。
 */
export class Particle {
  private _ratio: number = 0.0;
  protected path: ParticleWay;
  private _visible: boolean = true;
  public ease: (number) => number;

  public static MAX_RATIO: number = 1.0;
  public static MIN_RATIO: number = 0.0;

  /**
   * 指定されたパスに沿って移動するパーティクルを生成する。
   * @param path
   */
  constructor(path: ParticleWay) {
    this.path = path;
  }

  /**
   * パーティクルの位置を更新する。
   * @param t パーティクルのパス上の位置。入力に制限はないが、ParticleWay側で0.0~1.0の間に丸め込まれる。
   * @return n ease関数で補正済みのt。
   */
  update(t: number): number {
    this._ratio = t;
    if (this.ease == null) {
      return this._ratio;
    }
    return this.ease(this._ratio);
  }

  /**
   * パーティクル位置を指定された量移動する。
   * @param t 移動量 0.0 ~ 1.0
   */
  add(t: number): number {
    return this.update(this._ratio + t);
  }

  /**
   * 現在位置を取得する
   * @return number
   */
  get ratio(): number {
    return this._ratio;
  }

  get visible() {
    return this._visible;
  }
  set visible(value: boolean) {
    this._visible = value;
  }
  dispose(): void {}
}
