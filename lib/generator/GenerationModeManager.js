"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationModeManager = exports.GenerationModeEventType = exports.GenerationMode = void 0;
var eventemitter3_1 = require("eventemitter3");
var GenerationMode;
(function (GenerationMode) {
    /**
     * パーティクルを随時生成する
     */
    GenerationMode[GenerationMode["SEQUENTIAL"] = 0] = "SEQUENTIAL";
    /**
     * 終端にたどり着いたパーティクルを巻き戻して再利用する
     */
    GenerationMode[GenerationMode["LOOP"] = 1] = "LOOP";
})(GenerationMode = exports.GenerationMode || (exports.GenerationMode = {}));
var GenerationModeEventType;
(function (GenerationModeEventType) {
    GenerationModeEventType["change"] = "GenerationModeEventType_Change";
})(GenerationModeEventType = exports.GenerationModeEventType || (exports.GenerationModeEventType = {}));
var GenerationModeManager = /** @class */ (function (_super) {
    __extends(GenerationModeManager, _super);
    function GenerationModeManager() {
        var _this = _super.call(this) || this;
        _this._mode = GenerationMode.SEQUENTIAL;
        return _this;
    }
    Object.defineProperty(GenerationModeManager.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (value) {
            if (value === this._mode)
                return;
            this._mode = value;
            this.emit(GenerationModeEventType.change, this._mode);
        },
        enumerable: false,
        configurable: true
    });
    return GenerationModeManager;
}(eventemitter3_1.EventEmitter));
exports.GenerationModeManager = GenerationModeManager;
