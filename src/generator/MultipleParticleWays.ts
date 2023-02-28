import { ParticleWay } from "../ParticleWay";
export type WaySelectType = "random" | "sequential";

/**
 * このクラスは、ParticleGeneratorに設定された複数の経路を管理するためのものです。
 */
export class MultipleParticleWays {
  public ways: ParticleWay[];
  public waySelectType: WaySelectType;
  private waySelectionCount: number = 0;

  constructor(option?: MultipleParticleWaysOption) {
    MultipleParticleWaysOption.initOption(option);
    this.ways = option.ways as ParticleWay[];
    this.waySelectType = option.type;
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

export class MultipleParticleWaysOption {
  ways?: ParticleWay | ParticleWay[];
  type?: WaySelectType;

  public static initOption(
    option?: MultipleParticleWaysOption
  ): MultipleParticleWaysOption {
    option ??= {};

    option.ways ??= [];
    if (!Array.isArray(option.ways)) {
      option.ways = [option.ways];
    }
    option.type ??= "sequential";
    return option;
  }
}
