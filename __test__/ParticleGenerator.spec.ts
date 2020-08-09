import { ParticleGeneratorUtility } from "../src/ParticleGeneratorUtility";
import { ParticleGenerator, ParticleWay, PathSelectType } from "../src/index";

describe("ParticleGeneratorUtility", () => {
  test("interval", () => {
    expect(ParticleGeneratorUtility.getInterval(0.5, 4)).toBeCloseTo(500);
  });
  test("speed", () => {
    expect(ParticleGeneratorUtility.getSpeed(300, 4)).toBeCloseTo(
      (1.0 / 1200) * 1000
    );
  });
});

describe("ParticleGenerator", () => {
  const { generator, way } = getTestGenerators();

  test("constructor", () => {
    expect(generator).toBeTruthy();
    expect(generator.speedPerSec).toBe(0.07);
    expect(generator.particleInterval).toBe(300);
    expect(generator.probability).toBe(1.0);
    expect(generator.isLoop).toBe(false);
    expect(generator.visible).toBe(true);
    expect(generator.pathSelectType).toBe(PathSelectType.Sequential);
  });

  test("play", () => {
    expect(generator.isPlaying).toBe(false);
    generator.play();
    expect(generator.isPlaying).toBe(true);
    generator.play();
    expect(generator.isPlaying).toBe(true);
  });

  test("stop", () => {
    generator.stop();
    expect(generator.isPlaying).toBe(false);
    generator.stop();
    expect(generator.isPlaying).toBe(false);
  });

  test("valve", () => {
    expect(generator.isOpenValve).toBe(true);
    generator.openValve();
    expect(generator.isOpenValve).toBe(true);
    generator.openValve();
    expect(generator.isOpenValve).toBe(true);
    generator.closeValve();
    expect(generator.isOpenValve).toBe(false);
    generator.closeValve();
    expect(generator.isOpenValve).toBe(false);
    generator.openValve();
    expect(generator.isOpenValve).toBe(true);

    //TODO　バルブ閉塞時にアニメーションをして、パーティクルが生成されないことを確認する
  });

  test("generate all", () => {
    generator.generateAll();
    generator.removeAllParticles();

    //TODO generate All時のパーティクルの位置を確認する
  });

  test("visible", () => {
    generator.visible = true;
    expect(generator.visible).toBe(true);
    generator.visible = false;
    expect(generator.visible).toBe(false);
    generator.visible = true;
    expect(generator.visible).toBe(true);

    //TODO generate All時のパーティクルの位置を確認する
  });

  test("dispose", () => {
    generator.dispose();
    expect(generator.path).toBeNull();
  });
});

function getTestGenerators(): {
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
