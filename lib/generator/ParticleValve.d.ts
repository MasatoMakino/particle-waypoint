import { GenerationModeManager } from "./GenerationModeManager";
/**
 * パーティクル新規生成のバルブ開閉を行うクラス
 * @see {@link ParticleGenerator}
 */
export declare class ParticleValve {
    get isOpen(): boolean;
    private _isOpen;
    private _modeManager;
    constructor(modeManager: GenerationModeManager);
    /**
     * パーティクル生成を開始する。
     */
    open(): void;
    /**
     * パーティクル生成を停止する。
     * アニメーションは続行される。
     */
    close(): void;
    private warnUpdateValveMode;
}
//# sourceMappingURL=ParticleValve.d.ts.map