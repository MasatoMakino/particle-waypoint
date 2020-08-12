import { getTestGenerators } from "./ParticleGenerator.common";
import { ParticleGenerator } from "../src";

describe("ParticleGenerator", () => {
  test("animate", () => {
    const { generator } = getTestGenerators();
    generator.play();
    //TODO emit RAF event
  });
});
