# Trivial space playground

Trivial space started as an art project back in 2012 to explore the
possibilities of current web technologies as presentation platform for virtual
art spaces.

Since a first prototype and exhibition in 2013, the main focus shifted to
improve the technical workflow for creating and developing such virtual spaces.
During a long research and learning period, some interconnected programming
libraries and tools evolved, that improve the creation of web based virtual
reality by code. Together they enable a live coding environment for WebGL
scenes, with hot code and shader reloading as well as controlled application and
WebGL state preservation in live coding sessions.

This workflow builds on following libraries:

- [Painter](https://github.com/trivial-space/painter), a WebGL rendering engine
  tweaked for live coding / hot reloading.
- [Libs](https://github.com/trivial-space/libs), a collection of useful
  functions and helpers.
- [Libs-wasm](https://github.com/trivial-space/libs-wasm), collection of rust
  utilities for creative coding and geometric alorithms targeting web assembly.

This repository is the primary development environment trivial space sketches.
Experiments and works are build here, while working both on the programming
tools as well as on artistic expressions.

Basically everything here is work in progress. Intermediate results are
published frequently to
[sketches.trivialspace.net](https://sketches.trivialspace.net), which is just a
statically hosted version of the `public` folder of this repository.

Eventually, the work evolving here will lead to a relaunch of the
[trivial space](https://trivialspace.net) platform. This playground and the
[trivial space repository](https://github.com/trivial-space) are the main places
where progress and updates can be observed.

## Local development

To install the playground locally and play with the sketches, clone this
repository, and run

    npm run git-init
    npm run install
    npm run dev

The drafts within a live coding environment will be available at
`localhost:8000`.

### Building and watching wasm rust crates

To build a create once run `npx wasm-pack build --target web path/to/crate`

To watch and rebuild a create on rust file changes run
`npm run wasm path/to/crate`

## License

MIT, see the LICENSE file in the repository.

Copyright (c) 2016 - 2023 Thomas Gorny
