"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleValve = void 0;
var GenerationModeManager_1 = require("./GenerationModeManager");
/**
 * パーティクル新規生成のバルブ開閉を行うクラス
 * @see {@link ParticleGenerator}
 */
var ParticleValve = /** @class */ (function () {
    function ParticleValve(modeManager) {
        this._isOpen = true;
        this._modeManager = modeManager;
    }
    Object.defineProperty(ParticleValve.prototype, "isOpen", {
        get: function () {
            return this._isOpen;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * パーティクル生成を開始する。
     */
    ParticleValve.prototype.open = function () {
        if (this._isOpen)
            return;
        this._isOpen = true;
        this.warnUpdateValveMode();
    };
    /**
     * パーティクル生成を停止する。
     * アニメーションは続行される。
     */
    ParticleValve.prototype.close = function () {
        if (!this._isOpen)
            return;
        this._isOpen = false;
        this.warnUpdateValveMode();
    };
    ParticleValve.prototype.warnUpdateValveMode = function () {
        if (this._modeManager.mode !== GenerationModeManager_1.GenerationMode.LOOP)
            return;
        console.warn("ParticleGenerator : ループ指定中にバルブ開閉操作を行いました。この操作はループ指定中には反映されません。");
        console.trace();
    };
    return ParticleValve;
}());
exports.ParticleValve = ParticleValve;
