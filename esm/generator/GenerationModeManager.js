import { EventEmitter } from "eventemitter3";
export var GenerationMode;
(function (GenerationMode) {
    /**
     * パーティクルを随時生成する
     */
    GenerationMode[GenerationMode["SEQUENTIAL"] = 0] = "SEQUENTIAL";
    /**
     * 終端にたどり着いたパーティクルを巻き戻して再利用する
     */
    GenerationMode[GenerationMode["LOOP"] = 1] = "LOOP";
})(GenerationMode || (GenerationMode = {}));
export var GenerationModeEventType;
(function (GenerationModeEventType) {
    GenerationModeEventType["change"] = "GenerationModeEventType_Change";
})(GenerationModeEventType || (GenerationModeEventType = {}));
export class GenerationModeManager extends EventEmitter {
    constructor() {
        super();
        this._mode = GenerationMode.SEQUENTIAL;
    }
    get mode() {
        return this._mode;
    }
    set mode(value) {
        if (value === this._mode)
            return;
        this._mode = value;
        this.emit(GenerationModeEventType.change, this._mode);
    }
}
