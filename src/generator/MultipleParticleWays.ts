import { ParticleWay } from "../index.js";
export type WaySelectType = "random" | "sequential";

/**
 * このクラスは、ParticleGeneratorに設定された複数の経路を管理するためのものです。
 */
export class MultipleParticleWays {
  public ways: ParticleWay[];
  public waySelectType: WaySelectType;
  private waySelectionCount: number = 0;

  constructor(option: MultipleParticleWaysOption) {
    const { ways, type = "sequential" } = option;
    this.ways = Array.isArray(ways) ? ways : [ways];
    this.waySelectType = type;
  }

  public countUp(): void {
    this.waySelectionCount = (this.waySelectionCount + 1) % this.ways.length;
  }

  public getParticleWay(): ParticleWay {
    let index;
    switch (this.waySelectType) {
      case "sequential":
        index = this.waySelectionCount;
        break;
      case "random":
        index = Math.floor(Math.random() * this.ways.length);
        break;
    }
    return this.ways[index];
  }
}

export interface MultipleParticleWaysOption {
  ways: ParticleWay | ParticleWay[];
  type?: WaySelectType;
}
