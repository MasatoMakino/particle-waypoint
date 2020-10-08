# particle-waypoint

> Path module for calculating waypoints.

[![Build Status](https://travis-ci.com/MasatoMakino/particle-waypoint.svg?branch=master)](https://travis-ci.com/MasatoMakino/particle-waypoint)
[![Maintainability](https://api.codeclimate.com/v1/badges/8f61441c3c7b97b4bed8/maintainability)](https://codeclimate.com/github/MasatoMakino/particle-waypoint/maintainability)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## API Documents

[API documents](https://masatomakino.github.io/particle-waypoint/api/)

## Getting Started

### Install

```shell script
npm install https://github.com/MasatoMakino/particle-waypoint.git --save-dev
```

### Import

particle-waypoint is composed of ES6 modules and TypeScript d.ts files.

At first, import classes.

```js
import { ParticleWay, Particle, ParticleGenerator } from "particle-waypoint";
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
npm uninstall https://github.com/MasatoMakino/particle-waypoint.git --save-dev
```

## License

particle-waypoint is [MIT licensed](LICENSE).
