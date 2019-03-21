import Container = createjs.Container;
import DisplayObject = createjs.DisplayObject;

import { CanvasParticle } from "./CanvasParticle";
import { ParticleGenerator } from "../ParticleGenerator";
import { Particle } from "../Particle";
import { ParticleWay } from "../ParticleWay";

export class CanvasParticleGenerator extends ParticleGenerator {
  protected parent: Container;
  protected map: DisplayObject;

  constructor(parent: Container, path: ParticleWay, map: DisplayObject) {
    super(path);
    this.parent = parent;
    this.map = map;
  }

  protected generateParticle(path: ParticleWay): Particle {
    const particle = new CanvasParticle(this.path);
    particle.init(this.parent, this.map);
    return particle;
  }
}
