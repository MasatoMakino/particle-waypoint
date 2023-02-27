import { EventEmitter } from "eventemitter3";

export type GenerationMode = "sequential" | "loop";

export enum GenerationModeEventType {
  change = "GenerationModeEventType_Change",
}
export class GenerationModeManager extends EventEmitter {
  private _mode: GenerationMode = "sequential";
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
