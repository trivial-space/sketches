export const graph =

{
	"entities": {
		"camera-perspective": {
			"id": "camera-perspective",
			"meta": {
				"ui": {
					"x": -305,
					"y": 17
				}
			}
		},
		"screen-names": {
			"id": "screen-names",
			"value": [
				"tworooms",
				"behindglass",
				"nanofuzz",
				"balloon",
				"threescreens"
			],
			"meta": {
				"ui": {
					"x": 222,
					"y": -474
				}
			}
		},
		"frame": {
			"id": "frame",
			"isEvent": true,
			"meta": {
				"ui": {
					"x": 37,
					"y": -820
				}
			}
		},
		"screen-box-geometry": {
			"id": "screen-box-geometry",
			"meta": {
				"ui": {
					"x": -498,
					"y": -498
				}
			}
		},
		"window-size": {
			"id": "window-size",
			"value": {
				"width": 1,
				"heigth": 1
			},
			"meta": {
				"ui": {
					"x": 22,
					"y": -82
				},
				"type": "evaled-JSON"
			}
		},
		"screen-plane-positions": {
			"id": "screen-plane-positions",
			"value": {
				"tworooms": [
					-30,
					0,
					-10
				],
				"behindglass": [
					-15,
					0,
					-10
				],
				"nanofuzz": [
					0,
					0,
					-10
				],
				"balloon": [
					15,
					0,
					-10
				],
				"threescreens": [
					30,
					0,
					-10
				]
			},
			"meta": {
				"ui": {
					"x": 167,
					"y": -163
				}
			}
		},
		"plane-shader-frag": {
			"id": "plane-shader-frag",
			"value": "uniform sampler2D video;\n\nvarying vec2 vUv;\n\nvoid main() {\n\tgl_FragColor = texture2D(video, vUv);\n\t//gl_FragColor = vec4(vUv, 1.0, 1.0);\n}",
			"meta": {
				"ui": {
					"x": -471,
					"y": -637
				},
				"type": "code"
			}
		},
		"plane-shader-vert": {
			"id": "plane-shader-vert",
			"value": "attribute vec3 position;\nattribute vec2 uv;\n\nuniform mat4 transform;\nuniform mat4 perspective;\nuniform mat4 camera;\n\nvarying vec2 vUv;\n\nvoid main() {\n\tvUv = uv;\n\tgl_Position = perspective * camera * transform * vec4(position, 1.0);\n}",
			"meta": {
				"ui": {
					"x": -343,
					"y": -757
				},
				"type": "code"
			}
		},
		"screen-plane-transforms": {
			"id": "screen-plane-transforms",
			"meta": {
				"ui": {
					"x": -160,
					"y": -207
				}
			}
		},
		"videos": {
			"id": "videos",
			"meta": {
				"ui": {
					"x": 187,
					"y": -749
				}
			}
		},
		"perspective": {
			"id": "perspective",
			"value": {
				"fovy": 1.88,
				"near": 0.1,
				"far": 1000
			},
			"meta": {
				"ui": {
					"x": -260.99992576646036,
					"y": 320.47229899889317
				}
			}
		},
		"canvas": {
			"id": "canvas",
			"meta": {
				"ui": {
					"x": -194,
					"y": -846
				}
			}
		},
		"video-factory": {
			"id": "video-factory",
			"meta": {
				"ui": {
					"x": 370,
					"y": -605
				}
			}
		},
		"camera-transform": {
			"id": "camera-transform",
			"meta": {
				"ui": {
					"x": -459,
					"y": -30
				}
			}
		},
		"screen-box-objects": {
			"id": "screen-box-objects",
			"meta": {
				"ui": {
					"x": -660,
					"y": 25
				}
			}
		},
		"render-context": {
			"id": "render-context",
			"meta": {
				"ui": {
					"x": -123,
					"y": -543.078125
				},
				"type": "evaled-JSON"
			}
		},
		"screen-rotations": {
			"id": "screen-rotations",
			"meta": {
				"ui": {
					"x": 395,
					"y": -285
				}
			}
		},
		"screen-plane-objects": {
			"id": "screen-plane-objects",
			"meta": {
				"ui": {
					"x": -295,
					"y": -292
				},
				"type": "evaled-JSON"
			}
		},
		"screen-plane-geometry": {
			"id": "screen-plane-geometry",
			"meta": {
				"ui": {
					"x": -445,
					"y": -401
				}
			}
		}
	},
	"processes": {
		"update-video-layers": {
			"id": "update-video-layers",
			"ports": {
				"ctx": "accumulator",
				"videos": "hot",
				"frame": "hot"
			},
			"code": "function(ports) {\n\tif (ports.videos) {\n\t\tObject.keys(ports.videos).forEach(name => {\n\t\t\tthis.renderer.updateLayer(ports.ctx, name + \"-video\", {\n\t\t\t\tasset: ports.videos[name],\n\t\t\t\tminFilter: \"LINEAR\",\n\t\t\t\twrap: \"CLAMP_TO_EDGE\",\n\t\t\t\tflipY: true\n\t\t\t})\n\t\t})\n\t}\n\treturn ports.ctx\n}",
			"meta": {
				"ui": {
					"x": 32,
					"y": -634
				}
			}
		},
		"create-screen-box-geometry": {
			"id": "create-screen-box-geometry",
			"ports": {},
			"code": "function(ports) {\n\treturn this.renderUtils.stackgl.convertStackGLGeometry(\n\t\tthis.box({size: [10, 10, 1], segments: [5, 5, 1]})\n\t)\n}",
			"autostart": true,
			"meta": {
				"ui": {
					"x": -656,
					"y": -480
				}
			}
		},
		"update-objects-layer": {
			"id": "update-objects-layer",
			"ports": {
				"ctx": "accumulator",
				"names": "hot"
			},
			"code": "function(ports) {\n\tvar objects = ports.names.map(name => name + \"-plane\")//.concat(ports.names.map(name => name + \"-box\"))\n\treturn this.renderer.updateLayer(ports.ctx, \"objects\", {objects: objects})\n}",
			"meta": {
				"ui": {
					"x": 55,
					"y": -541
				}
			}
		},
		"create-camera-transform": {
			"id": "create-camera-transform",
			"ports": {},
			"code": "function(ports) {\n\treturn this.mat4.create()\n}",
			"autostart": true,
			"meta": {
				"ui": {
					"x": -477,
					"y": 114
				}
			}
		},
		"update-plane-objects": {
			"id": "update-plane-objects",
			"ports": {
				"objs": "hot",
				"ctx": "accumulator"
			},
			"code": "function(ports) {\n\tfor(var o in ports.objs) {\n\t\tthis.renderer.updateObject(ports.ctx, o + \"-plane\", ports.objs[o])\n\t}\n\treturn ports.ctx\n}",
			"meta": {
				"ui": {
					"x": -187,
					"y": -394
				}
			}
		},
		"create-screen-rotations": {
			"id": "create-screen-rotations",
			"ports": {
				"names": "hot"
			},
			"code": "function(ports) {\n\treturn ports.names.reduce((acc, n, i) => {\n\t\tacc[n] = i * Math.PI * 2 / ports.names.length\n\t\treturn acc\n\t}, {})\n}",
			"meta": {
				"ui": {
					"x": 508,
					"y": -343
				}
			}
		},
		"create-plane-positions": {
			"id": "create-plane-positions",
			"ports": {
				"names": "hot",
				"rotations": "hot"
			},
			"code": "function(ports) {\n\treturn this._.mapValues(r => {\n\t\tconst [x, z] = this.libs.math.coords.polarToCartesian2D([20, r])\n\t\treturn [x, 0, z]\n\t})(ports.rotations)\n}",
			"meta": {
				"ui": {
					"x": 337,
					"y": -149
				}
			}
		},
		"create-screen-plane-objects": {
			"id": "create-screen-plane-objects",
			"ports": {
				"perspective": "hot",
				"camera": "hot",
				"transforms": "hot"
			},
			"code": "function(ports) {\n\treturn this._.mapValues((t, name) => {\n\t\treturn {\n\t\t\tshader: \"plane-shader\",\n\t\t\tgeometry: \"screen-plane-geometry\",\n\t\t\tuniforms: {\n\t\t\t\ttransform: t,\n\t\t\t\tvideo: name + \"-video\",\n\t\t\t\tperspective: ports.perspective,\n\t\t\t\tcamera: ports.camera\n\t\t\t}\n\t\t}\n\t})(ports.transforms)\n}",
			"meta": {
				"ui": {
					"x": -349,
					"y": -177
				}
			}
		},
		"amimate": {
			"id": "amimate",
			"ports": {
				"videos": "hot"
			},
			"code": "function(ports, send) {\n\treturn this.libs.flow.sources.animation.animation(send)\n}",
			"async": true,
			"meta": {
				"ui": {
					"x": 242,
					"y": -959
				}
			}
		},
		"window-size-source": {
			"id": "window-size-source",
			"ports": {},
			"code": "function(ports, send) {\n\treturn this.libs.flow.sources.dom.windowSize(send)\n}",
			"autostart": true,
			"async": true,
			"meta": {
				"ui": {
					"x": 80,
					"y": 31
				}
			}
		},
		"update-screen-box-geometry": {
			"id": "update-screen-box-geometry",
			"ports": {
				"ctx": "accumulator",
				"box": "hot"
			},
			"code": "function(ports) {\n\treturn this.renderer.updateGeometry(ports.ctx, \"screen-box-geometry\", ports.box)\n}",
			"meta": {
				"ui": {
					"x": -306,
					"y": -503
				}
			}
		},
		"video-factory": {
			"id": "video-factory",
			"ports": {},
			"code": "function(ports) {\n\treturn function createVideo(src) {\n\t\tvar video = document.createElement('video')\n\t\tvideo.crossOrigin = \"anonymous\"\n\t\tvideo.loop = \"loop\"\n\t\tvar source1 = document.createElement('source')\n\t\tvar source2 = document.createElement('source')\n\t\tsource1.src = src + \".webm\"\n\t\tsource1.type = \"video/webm\"\n\t\tsource2.src = src + \".mp4\"\n\t\tsource2.type = \"video/mp4\"\n\t\tvideo.appendChild(source1)\n\t\tvideo.appendChild(source2)\n\t\tvideo.play()\n\t\treturn video\n\t}\n}",
			"autostart": true,
			"meta": {
				"ui": {
					"x": 457,
					"y": -706
				}
			}
		},
		"create-video-layers": {
			"id": "create-video-layers",
			"ports": {
				"createVideo": "hot",
				"names": "hot"
			},
			"code": "function(ports, send) {\n\tvar videos = ports.names.map(name => ports.createVideo(\n\t\t\"//s3.eu-central-1.amazonaws.com/trivialspace.net/tvs1/\" + name\n\t))\n\t\n\tPromise.all(videos.map(v => new Promise((res, rej) => {\n\t\tv.addEventListener('canplaythrough', e => { res(v) })\n\t\tsetTimeout(() => rej(\"Video timeout \" + v.src), 10000)\n\t}))).then(vs => {\n\t\tvar vObj = {} \n\t\tports.names.forEach((n, i) => {vObj[n] = vs[i]})\n\t\tsend(vObj)\n\t}).catch(e => console.warn(e))\n}",
			"async": true,
			"meta": {
				"ui": {
					"x": 239,
					"y": -605
				}
			}
		},
		"render": {
			"id": "render",
			"ports": {
				"ctx": "cold",
				"frame": "hot"
			},
			"code": "function(ports) {\n\tthis.renderer.renderLayers(ports.ctx, ['objects'])\n}",
			"meta": {
				"ui": {
					"x": -37,
					"y": -714
				}
			}
		},
		"update-screen-plane-geometry": {
			"id": "update-screen-plane-geometry",
			"ports": {
				"plane": "hot",
				"ctx": "accumulator"
			},
			"code": "function(ports) {\n\treturn this.renderer.updateGeometry(ports.ctx, \"screen-plane-geometry\", ports.plane)\n}",
			"meta": {
				"ui": {
					"x": -281,
					"y": -436
				}
			}
		},
		"create-screen-plane-geometry": {
			"id": "create-screen-plane-geometry",
			"ports": {},
			"code": "function(ports) {\n\treturn this.renderUtils.geometry.plane(10, 10, 5, 5)\n}",
			"autostart": true,
			"meta": {
				"ui": {
					"x": -600,
					"y": -372
				}
			}
		},
		"create-camera-perspective": {
			"id": "create-camera-perspective",
			"ports": {
				"window": "hot",
				"p": "hot"
			},
			"code": "function(ports) {\n\tvar aspect = ports.window.width / ports.window.heigth\n\treturn this.mat4.perspective(\n\t\tthis.mat4.create(),\n\t\tports.p.fovy,\n\t\taspect,\n\t\tports.p.near,\n\t\tports.p.far\n\t)\n}",
			"meta": {
				"ui": {
					"x": -157,
					"y": 95
				}
			}
		},
		"create-screen-plane-tranfroms": {
			"id": "create-screen-plane-tranfroms",
			"ports": {
				"pos": "hot",
				"names": "hot",
				"rot": "hot"
			},
			"code": "function(ports) {\n\treturn this._.mapValues((pos, n) => {\n\t\tvar m = this.mat4.fromTranslation(this.mat4.create(), pos)\n\t\tthis.mat4.rotateY(m, m, ports.rot[n])\n\t\treturn this.mat4.scale(m, m, [1.6, 1, 1])\n\t})(ports.pos)\n}",
			"meta": {
				"ui": {
					"x": 88,
					"y": -272
				}
			}
		},
		"update-size": {
			"id": "update-size",
			"ports": {
				"ctx": "accumulator",
				"size": "hot"
			},
			"code": "function(ports) {\n\treturn this.renderer.updateSize(ports.ctx, ports.size.width, ports.size.heigth)\n}",
			"meta": {
				"ui": {
					"x": -87,
					"y": -409
				}
			}
		},
		"video-factory-test": {
			"id": "video-factory-test",
			"ports": {
				"createVideo": "cold"
			},
			"code": "function(ports, send) {\n \tvar video = ports.createVideo(\n\t\t\"//s3.eu-central-1.amazonaws.com/trivialspace.net/tvs1/nanofuzz\"\n\t)\n\tconsole.log(video)\n\tdocument.body.appendChild(video)\n\treturn function stop() {\n\t\tdocument.body.removeChild(video)\n\t}\n}",
			"async": true,
			"meta": {
				"ui": {
					"x": 461,
					"y": -504
				}
			}
		},
		"create-canvas": {
			"id": "create-canvas",
			"ports": {},
			"code": "function(ports, send) {\n\tvar canvas = document.createElement('canvas')\n\tdocument.body.appendChild(canvas)\n\t\n\tsend(canvas)\n\t\n\treturn function() {\n\t\tdocument.body.removeChild(canvas)\n\t}\n}",
			"autostart": true,
			"async": true,
			"meta": {
				"ui": {
					"x": -215,
					"y": -970
				}
			}
		},
		"update-plane-shader": {
			"id": "update-plane-shader",
			"ports": {
				"vert": "hot",
				"frag": "hot",
				"ctx": "accumulator"
			},
			"code": "function(ports) {\n\treturn this.renderer.updateShader(ports.ctx, \"plane-shader\", {\n\t\tvert: ports.vert,\n\t\tfrag: ports.frag,\n\t\tattribs: {\n\t\t\tposition: \"f 3\",\n\t\t\tuv: \"f 2\"\n\t\t},\n\t\tuniforms: {\n\t\t\tvideo: \"t\",\n\t\t\ttransform: \"m 4\",\n\t\t\tperspective: \"m 4\",\n\t\t\tcamera: \"m 4\"\n\t\t}\n\t})\n}",
			"meta": {
				"ui": {
					"x": -299,
					"y": -617
				}
			}
		},
		"create-context": {
			"id": "create-context",
			"ports": {
				"canvas": "hot"
			},
			"code": "function(ports) {\n\treturn this.renderer.create(ports.canvas)\n}",
			"meta": {
				"ui": {
					"x": -161,
					"y": -673
				}
			}
		}
	},
	"arcs": {
		"window-size->update-size::size": {
			"id": "window-size->update-size::size",
			"entity": "window-size",
			"process": "update-size",
			"port": "size",
			"meta": {}
		},
		"frame->render::frame": {
			"id": "frame->render::frame",
			"entity": "frame",
			"process": "render",
			"port": "frame",
			"meta": {}
		},
		"update-plane-objects->render-context": {
			"id": "update-plane-objects->render-context",
			"entity": "render-context",
			"process": "update-plane-objects",
			"meta": {}
		},
		"video-factory->video-factory-test::createVideo": {
			"id": "video-factory->video-factory-test::createVideo",
			"entity": "video-factory",
			"process": "video-factory-test",
			"port": "createVideo",
			"meta": {}
		},
		"create-screen-rotations->screen-rotations": {
			"id": "create-screen-rotations->screen-rotations",
			"entity": "screen-rotations",
			"process": "create-screen-rotations",
			"meta": {}
		},
		"canvas->create-context::canvas": {
			"id": "canvas->create-context::canvas",
			"entity": "canvas",
			"process": "create-context",
			"port": "canvas",
			"meta": {}
		},
		"screen-rotations->create-plane-positions::rotations": {
			"id": "screen-rotations->create-plane-positions::rotations",
			"entity": "screen-rotations",
			"process": "create-plane-positions",
			"port": "rotations",
			"meta": {}
		},
		"screen-names->create-video-layers::names": {
			"id": "screen-names->create-video-layers::names",
			"entity": "screen-names",
			"process": "create-video-layers",
			"port": "names",
			"meta": {}
		},
		"plane-positions->create-screen-plane-tranfroms::pos": {
			"id": "plane-positions->create-screen-plane-tranfroms::pos",
			"entity": "screen-plane-positions",
			"process": "create-screen-plane-tranfroms",
			"port": "pos",
			"meta": {}
		},
		"screen-plane-objects->update-plane-objects::objs": {
			"id": "screen-plane-objects->update-plane-objects::objs",
			"entity": "screen-plane-objects",
			"process": "update-plane-objects",
			"port": "objs",
			"meta": {}
		},
		"amimate->frame": {
			"id": "amimate->frame",
			"entity": "frame",
			"process": "amimate",
			"meta": {}
		},
		"screen-names->create-screen-plane-tranfroms::names": {
			"id": "screen-names->create-screen-plane-tranfroms::names",
			"entity": "screen-names",
			"process": "create-screen-plane-tranfroms",
			"port": "names",
			"meta": {}
		},
		"screen-names->create-screen-rotations::names": {
			"id": "screen-names->create-screen-rotations::names",
			"entity": "screen-names",
			"process": "create-screen-rotations",
			"port": "names",
			"meta": {}
		},
		"screen-names->create-plane-positions::names": {
			"id": "screen-names->create-plane-positions::names",
			"entity": "screen-names",
			"process": "create-plane-positions",
			"port": "names",
			"meta": {}
		},
		"screen-plane-transforms->create-screen-plane-objects::transforms": {
			"id": "screen-plane-transforms->create-screen-plane-objects::transforms",
			"entity": "screen-plane-transforms",
			"process": "create-screen-plane-objects",
			"port": "transforms",
			"meta": {}
		},
		"create-screen-box-geometry->screen-box-geometry": {
			"id": "create-screen-box-geometry->screen-box-geometry",
			"entity": "screen-box-geometry",
			"process": "create-screen-box-geometry",
			"meta": {}
		},
		"create-context->render-context": {
			"id": "create-context->render-context",
			"entity": "render-context",
			"process": "create-context",
			"meta": {}
		},
		"create-camera-transform->camera-transform": {
			"id": "create-camera-transform->camera-transform",
			"entity": "camera-transform",
			"process": "create-camera-transform",
			"meta": {}
		},
		"create-video-layers->videos": {
			"id": "create-video-layers->videos",
			"entity": "videos",
			"process": "create-video-layers",
			"meta": {}
		},
		"video-factory->video-factory": {
			"id": "video-factory->video-factory",
			"entity": "video-factory",
			"process": "video-factory",
			"meta": {}
		},
		"plane-shader-vert->update-plane-shader::vert": {
			"id": "plane-shader-vert->update-plane-shader::vert",
			"entity": "plane-shader-vert",
			"process": "update-plane-shader",
			"port": "vert",
			"meta": {}
		},
		"create-camera-perspective->camera-perspective": {
			"id": "create-camera-perspective->camera-perspective",
			"entity": "camera-perspective",
			"process": "create-camera-perspective",
			"meta": {}
		},
		"frame->update-video-layers::frame": {
			"id": "frame->update-video-layers::frame",
			"entity": "frame",
			"process": "update-video-layers",
			"port": "frame",
			"meta": {}
		},
		"window-size-source->window-size": {
			"id": "window-size-source->window-size",
			"entity": "window-size",
			"process": "window-size-source",
			"meta": {}
		},
		"camera-perspective->create-screen-plane-objects::perspective": {
			"id": "camera-perspective->create-screen-plane-objects::perspective",
			"entity": "camera-perspective",
			"process": "create-screen-plane-objects",
			"port": "perspective",
			"meta": {}
		},
		"create-canvas->canvas": {
			"id": "create-canvas->canvas",
			"entity": "canvas",
			"process": "create-canvas",
			"meta": {}
		},
		"create-plane-positions->screen-plane-positions": {
			"id": "create-plane-positions->screen-plane-positions",
			"entity": "screen-plane-positions",
			"process": "create-plane-positions",
			"meta": {}
		},
		"screen-box-geometry->update-screen-box-geometry::box": {
			"id": "screen-box-geometry->update-screen-box-geometry::box",
			"entity": "screen-box-geometry",
			"process": "update-screen-box-geometry",
			"port": "box",
			"meta": {}
		},
		"camera-transform->create-screen-plane-objects::camera": {
			"id": "camera-transform->create-screen-plane-objects::camera",
			"entity": "camera-transform",
			"process": "create-screen-plane-objects",
			"port": "camera",
			"meta": {}
		},
		"create-screen-plane-objects->screen-plane-objects": {
			"id": "create-screen-plane-objects->screen-plane-objects",
			"entity": "screen-plane-objects",
			"process": "create-screen-plane-objects",
			"meta": {}
		},
		"plane-shader-frag->update-plane-shader::frag": {
			"id": "plane-shader-frag->update-plane-shader::frag",
			"entity": "plane-shader-frag",
			"process": "update-plane-shader",
			"port": "frag",
			"meta": {}
		},
		"render-context->render::ctx": {
			"id": "render-context->render::ctx",
			"entity": "render-context",
			"process": "render",
			"port": "ctx",
			"meta": {}
		},
		"screen-plane-geometry->update-screen-plane-geometry::plane": {
			"id": "screen-plane-geometry->update-screen-plane-geometry::plane",
			"entity": "screen-plane-geometry",
			"process": "update-screen-plane-geometry",
			"port": "plane",
			"meta": {}
		},
		"perspective->create-camera-perspective::p": {
			"id": "perspective->create-camera-perspective::p",
			"entity": "perspective",
			"process": "create-camera-perspective",
			"port": "p",
			"meta": {}
		},
		"window-size->create-camera-perspective::window": {
			"id": "window-size->create-camera-perspective::window",
			"entity": "window-size",
			"process": "create-camera-perspective",
			"port": "window",
			"meta": {}
		},
		"create-screen-plane-geometry->screen-plane-geometry": {
			"id": "create-screen-plane-geometry->screen-plane-geometry",
			"entity": "screen-plane-geometry",
			"process": "create-screen-plane-geometry",
			"meta": {}
		},
		"update-size->render-context": {
			"id": "update-size->render-context",
			"entity": "render-context",
			"process": "update-size",
			"meta": {}
		},
		"update-screen-box-geometry->render-context": {
			"id": "update-screen-box-geometry->render-context",
			"entity": "render-context",
			"process": "update-screen-box-geometry",
			"meta": {}
		},
		"create-screen-plane-tranfroms->screen-plane-transforms": {
			"id": "create-screen-plane-tranfroms->screen-plane-transforms",
			"entity": "screen-plane-transforms",
			"process": "create-screen-plane-tranfroms",
			"meta": {}
		},
		"update-objects-layer->render-context": {
			"id": "update-objects-layer->render-context",
			"entity": "render-context",
			"process": "update-objects-layer",
			"meta": {}
		},
		"update-plane-shader->render-context": {
			"id": "update-plane-shader->render-context",
			"entity": "render-context",
			"process": "update-plane-shader",
			"meta": {}
		},
		"videos->update-video-layers::videos": {
			"id": "videos->update-video-layers::videos",
			"entity": "videos",
			"process": "update-video-layers",
			"port": "videos",
			"meta": {}
		},
		"videos->amimate::videos": {
			"id": "videos->amimate::videos",
			"entity": "videos",
			"process": "amimate",
			"port": "videos",
			"meta": {}
		},
		"update-screen-plane-geometry->render-context": {
			"id": "update-screen-plane-geometry->render-context",
			"entity": "render-context",
			"process": "update-screen-plane-geometry",
			"meta": {}
		},
		"screen-rotations->create-screen-plane-tranfroms::rot": {
			"id": "screen-rotations->create-screen-plane-tranfroms::rot",
			"entity": "screen-rotations",
			"process": "create-screen-plane-tranfroms",
			"port": "rot",
			"meta": {}
		},
		"update-video-layers->render-context": {
			"id": "update-video-layers->render-context",
			"entity": "render-context",
			"process": "update-video-layers",
			"meta": {}
		},
		"video-factory->create-video-layers::createVideo": {
			"id": "video-factory->create-video-layers::createVideo",
			"entity": "video-factory",
			"process": "create-video-layers",
			"port": "createVideo",
			"meta": {}
		},
		"screen-names->update-objects-layer::names": {
			"id": "screen-names->update-objects-layer::names",
			"entity": "screen-names",
			"process": "update-objects-layer",
			"port": "names",
			"meta": {}
		}
	},
	"meta": {
		"ui": {
			"layout": []
		}
	}
}