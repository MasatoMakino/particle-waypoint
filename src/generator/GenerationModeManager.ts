import { EventEmitter } from "eventemitter3";

export enum GenerationMode {
  /**
   * パーティクルを随時生成する
   */
  SEQUENTIAL,
  /**
   * 終端にたどり着いたパーティクルを巻き戻して再利用する
   */
  LOOP,
}

export enum GenerationModeEventType {
  change = "GenerationModeEventType_Change",
}
export class GenerationModeManager extends EventEmitter {
  private _mode: GenerationMode = GenerationMode.SEQUENTIAL;
  get mode(): GenerationMode {
    return this._mode;
  }
  set mode(value: GenerationMode) {
    if (value === this._mode) return;
    this._mode = value;

    this.emit(GenerationModeEventType.change, this._mode);
  }

  constructor() {
    super();
  }
}
