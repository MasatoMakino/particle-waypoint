import { EventEmitter } from "eventemitter3";
export declare enum GenerationMode {
    /**
     * パーティクルを随時生成する
     */
    SEQUENTIAL = 0,
    /**
     * 終端にたどり着いたパーティクルを巻き戻して再利用する
     */
    LOOP = 1
}
export declare enum GenerationModeEventType {
    change = "GenerationModeEventType_Change"
}
export declare class GenerationModeManager extends EventEmitter {
    private _mode;
    get mode(): GenerationMode;
    set mode(value: GenerationMode);
    constructor();
}
//# sourceMappingURL=GenerationModeManager.d.ts.map