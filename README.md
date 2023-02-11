# particle-waypoint

> Path module for calculating waypoints.

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![CI](https://github.com/MasatoMakino/particle-waypoint/actions/workflows/ci_main.yml/badge.svg)](https://github.com/MasatoMakino/particle-waypoint/actions/workflows/ci_main.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/8f61441c3c7b97b4bed8/maintainability)](https://codeclimate.com/github/MasatoMakino/particle-waypoint/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8f61441c3c7b97b4bed8/test_coverage)](https://codeclimate.com/github/MasatoMakino/particle-waypoint/test_coverage)

## API Documents

[API documents](https://masatomakino.github.io/particle-waypoint/api/)

## Getting Started

### Install

```shell
npm install @masatomakino/particle-waypoint --save-dev
```

### Import

particle-waypoint is composed of ES6 modules and TypeScript d.ts files.

At first, import classes.

```js
import {
  ParticleWay,
  Particle,
  ParticleGenerator,
} from "@masatomakino/particle-waypoint";
```

### Create particle way

```js
const points = [
  [100, 100],
  [100, 200],
  [200, 200],
  [200, 300],
];
const wayPoint = new ParticleWay(points);
```

### Create generator

```js
const generator = new ParticleGenerator(wayPoint, {
  generationMode: GenerationMode.LOOP,
});
generator.animator.setSpeed(600, 20);
generator.play();
```

Particles animate on `wayPoint`.

## Uninstall

```shell script
npm uninstall @masatomakino/particle-waypoint --save-dev
```

## License

particle-waypoint is [MIT licensed](LICENSE).
