import { ParticleWay } from "./ParticleWay";

/**
 * パーティクルを表すクラス。
 * このクラス自体には描画のための機能はない。
 * 各種の描画ライブラリと組み合わせて利用する。
 */
export class Particle {
  private _pathPosition: number;
  protected path: ParticleWay;
  private _visible: boolean = true;
  public ease: (number) => number;

  /**
   * 指定されたパスに沿って移動するパーティクルを生成する。
   * @param path
   */
  constructor(path: ParticleWay) {
    this.path = path;
    this._pathPosition = 0.0;
  }

  /**
   * パーティクルの位置を更新する。
   * @param t パーティクルのパス上の位置。入力に制限はないが、ParticleWay側で0.0~1.0の間に丸め込まれる。
   * @return n ease関数で補正済みのt。
   */
  update(t: number): number {
    this._pathPosition = t;

    let n = this._pathPosition;
    if (this.ease != null) {
      n = this.ease(n);
    }
    return n;
  }

  /**
   * パーティクル位置を指定された量移動する。
   * @param t 移動量
   */
  add(t: number): void {
    this.update(this._pathPosition + t);
  }

  /**
   * 現在位置を取得する
   * @return number
   */
  get pathPosition(): number {
    return this._pathPosition;
  }

  set visible(value: boolean) {
    this._visible = value;
  }
  dispose(): void {}
}
