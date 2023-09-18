import { GenerationModeManager } from "./GenerationModeManager.js";

/**
 * パーティクル新規生成のバルブ開閉を行うクラス
 * @see {@link ParticleGenerator}
 */
export class ParticleValve {
  get isOpen(): boolean {
    return this._isOpen;
  }
  private _isOpen: boolean = true;
  private _modeManager: GenerationModeManager;

  constructor(modeManager: GenerationModeManager) {
    this._modeManager = modeManager;
  }
  /**
   * パーティクル生成を開始する。
   */
  public open(): void {
    if (this._isOpen) return;
    this._isOpen = true;
    this.warnUpdateValveMode();
  }

  /**
   * パーティクル生成を停止する。
   * アニメーションは続行される。
   */
  public close(): void {
    if (!this._isOpen) return;
    this._isOpen = false;
    this.warnUpdateValveMode();
  }

  private warnUpdateValveMode(): void {
    if (this._modeManager.mode !== "loop") return;
    console.warn(
      "ParticleGenerator : ループ指定中にバルブ開閉操作を行いました。この操作はループ指定中には反映されません。",
    );
    console.trace();
  }
}
