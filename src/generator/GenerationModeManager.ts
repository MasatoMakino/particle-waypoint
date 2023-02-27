import { EventEmitter } from "eventemitter3";

export type GenerationMode = "sequential" | "loop";

export interface GenerationModeEvent {
  change: GenerationMode;
}
export class GenerationModeManager extends EventEmitter<GenerationModeEvent> {
  private _mode: GenerationMode = "sequential";
  get mode(): GenerationMode {
    return this._mode;
  }
  set mode(value: GenerationMode) {
    if (value === this._mode) return;
    this._mode = value;

    this.emit("change", this._mode);
  }

  constructor() {
    super();
  }
}
