import { GenerationMode, GenerationModeManager } from "./GenerationModeManager";

/**
 * パーティクル新規生成のバルブ開閉を行うクラス
 * @see {@link ParticleGenerator}
 */
export class ParticleValve {
  get isOpenValve(): boolean {
    return this._isOpenValve;
  }
  private _isOpenValve: boolean = true;
  private _modeManager: GenerationModeManager;

  constructor(modeManager: GenerationModeManager) {
    this._modeManager = modeManager;
  }
  /**
   * パーティクル生成を開始する。
   */
  public openValve(): void {
    if (this._isOpenValve) return;
    this._isOpenValve = true;
    this.warnValve();
  }

  /**
   * パーティクル生成を停止する。
   * アニメーションは続行される。
   */
  public closeValve(): void {
    if (!this._isOpenValve) return;
    this._isOpenValve = false;
    this.warnValve();
  }

  private warnValve(): void {
    if (this._modeManager.mode !== GenerationMode.LOOP) return;
    console.warn(
      "ParticleGenerator : ループ指定中にバルブ開閉操作を行いました。この操作はループ指定中には反映されません。"
    );
    console.trace();
  }
}
