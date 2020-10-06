import { ParticleWay } from "../ParticleWay";
export enum PathSelectType {
  Random,
  Sequential,
}
/**
 * このクラスは、ParticleGeneratorに設定された複数の経路を管理するためのものです。
 */
export class MultipleParticleWays {
  public path: ParticleWay[];
  public pathSelectType: PathSelectType;
  private pathSelectionCount: number = 0;

  constructor(option?: GeneratorWaysOption) {
    GeneratorWaysOption.initOption(option);
    this.path = option.ways as ParticleWay[];
    this.pathSelectType = option.type;
  }

  public countUp(): void {
    this.pathSelectionCount = (this.pathSelectionCount + 1) % this.path.length;
  }

  public getPath(): ParticleWay {
    let index;
    switch (this.pathSelectType) {
      case PathSelectType.Sequential:
        index = this.pathSelectionCount;
        break;
      case PathSelectType.Random:
        index = Math.floor(Math.random() * this.path.length);
        break;
    }
    return this.path[index];
  }
}

export class GeneratorWaysOption {
  ways?: ParticleWay | ParticleWay[];
  type?: PathSelectType;

  public static initOption(option?: GeneratorWaysOption): GeneratorWaysOption {
    option ??= {};

    option.ways ??= [];
    if (!Array.isArray(option.ways)) {
      option.ways = [option.ways];
    }
    option.type ??= PathSelectType.Sequential;
    return option;
  }
}
