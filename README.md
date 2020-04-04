# Trivial space playground

Trivial space started as an art project back in 2012 to explore the
possibilities of current web technologies as presentation platform for digital
art artefacts.

Since a first prototype and exhibition in 2013, the main focus shifted to
improve the technical workflow for creating and developing virtual exhibition
spaces. During a long research period, some interconnected programming libraries
and tools evolved, that improve the creation of web based virtual reality spaces
dramatically. Together they enable a live coding environment for WebGL scenes,
that allows hot JavaScript and shader code reloading, application state
inspection and manipulation, reactive data flow definitions as well as visual
debugging tools.

The core of this workflow consists of the trivial space library collection:

- [Flow](https://github.com/trivial-space/flow), the reactive data flow runtime
  environment.
- [Flow tools](https://github.com/trivial-space/flow-tools), visual inspection
  and manipulation tools for flow graphs.
- [Painter](https://github.com/trivial-space/painter), a WebGL rendering engine
  for live coding.
- [Libs](https://github.com/trivial-space/libs), a collection of useful
  functions and helpers.

This playground is the primary testing environment for these libraries. Here
first sketches and experiments are tested, while working both on the programming
tools as well as on new artistic expressions.

Basically everything here is work in progress, probably incomplete, or not fully
functional. There are some satisfying intermediate results though. These are
published frequently to
[construction.trivialspace.net](https://construction.trivialspace.net), which is
just a statically hosted version of the `public` folder of this repository.

Eventually, the work evolving here will lead to a relaunch of the
[trivial space](https://trivialspace.net) platform. Until then, this playground
and the [trivial space repository](https://github.com/trivial-space) are the
main places where progress and updates can be observed.

## Local development

To install the playground locally and play with the sketches and technologies,
clone this repository, and run

    git submodule init
    git submodule update
    yarn install
    yarn start

The drafts within a (hopefully) working live coding environment will be
available at `localhost:8080`.

## Credits

A special thanks goes to the people and teams behind
[TypeScript](https://github.com/Microsoft/TypeScript) and
[Webpack](https://github.com/webpack/webpack). These tools provided a major
upgrade in terms of productivity and development comfort, and build the
foundation which the trivial space workflow can stand upon.

Great inspiration was drawn from the creative and encouraging communities behind
[Three.js](https://threejs.org/), [Stack.gl](https://github.com/stackgl) and
others pioneering immersive WebGL experiences.

## License

MIT, see the LICENSE file in the repository.

Copyright (c) 2016 - 2017 Thomas Gorny
