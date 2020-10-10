import { GenerationMode } from "./GenerationModeManager";
/**
 * パーティクル新規生成のバルブ開閉を行うクラス
 * @see {@link ParticleGenerator}
 */
export class ParticleValve {
    constructor(modeManager) {
        this._isOpen = true;
        this._modeManager = modeManager;
    }
    get isOpen() {
        return this._isOpen;
    }
    /**
     * パーティクル生成を開始する。
     */
    open() {
        if (this._isOpen)
            return;
        this._isOpen = true;
        this.warnUpdateValveMode();
    }
    /**
     * パーティクル生成を停止する。
     * アニメーションは続行される。
     */
    close() {
        if (!this._isOpen)
            return;
        this._isOpen = false;
        this.warnUpdateValveMode();
    }
    warnUpdateValveMode() {
        if (this._modeManager.mode !== GenerationMode.LOOP)
            return;
        console.warn("ParticleGenerator : ループ指定中にバルブ開閉操作を行いました。この操作はループ指定中には反映されません。");
        console.trace();
    }
}
