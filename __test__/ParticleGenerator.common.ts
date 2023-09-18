import { ParticleGenerator, ParticleWay } from "../src/index.js";

export function getTestGenerators(): {
  generator: ParticleGenerator;
  way: ParticleWay;
} {
  const points = [
    [0, 0],
    [1.0, 0],
    [1.0, 1.0],
  ];
  const way = new ParticleWay(points);
  const generator = new ParticleGenerator(way);

  return {
    generator,
    way,
  };
}
