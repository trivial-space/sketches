export const graph =
{
	"entities": {
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
					"x": 150.72890365448507,
					"y": -527.960620847176
				}
			}
		},
		"screen-box-geometry": {
			"id": "screen-box-geometry",
			"meta": {
				"ui": {
					"x": 85,
					"y": -56
				}
			}
		},
		"window-size": {
			"id": "window-size",
			"meta": {
				"ui": {
					"x": 90,
					"y": -702
				},
				"type": "evaled-JSON"
			}
		},
		"plane-shader-frag": {
			"id": "plane-shader-frag",
			"value": "uniform sampler2D video;\n\nvarying vec2 vUv;\n\nvoid main() {\n\tgl_FragColor = texture2D(video, vUv);\n}",
			"meta": {
				"ui": {
					"x": -393.9045555555556,
					"y": -621.2427951388889
				},
				"type": "code"
			}
		},
		"plane-shader-vert": {
			"id": "plane-shader-vert",
			"value": "attribute vec3 position;\nattribute vec2 uv;\n\nuniform mat4 transform;\nuniform mat4 perspective;\nuniform mat4 camera;\n\nvarying vec2 vUv;\n\nvoid main() {\n\tvUv = uv;\n\tgl_Position = perspective * camera * transform * vec4(position, 1.0);\n}",
			"meta": {
				"ui": {
					"x": -295.0854444444445,
					"y": -729.702795138889
				},
				"type": "code"
			}
		},
		"videos": {
			"id": "videos",
			"meta": {
				"ui": {
					"x": 290,
					"y": -385
				}
			}
		},
		"canvas": {
			"id": "canvas",
			"meta": {
				"ui": {
					"x": -118,
					"y": -780
				}
			}
		},
		"video-factory": {
			"id": "video-factory",
			"meta": {
				"ui": {
					"x": 338,
					"y": -590
				}
			}
		},
		"screen-box-objects": {
			"id": "screen-box-objects",
			"meta": {
				"ui": {
					"x": -437,
					"y": -440
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
		"screen-plane-objects": {
			"id": "screen-plane-objects",
			"meta": {
				"ui": {
					"x": -378,
					"y": -312
				},
				"type": "evaled-JSON"
			}
		},
		"screen-plane-geometry": {
			"id": "screen-plane-geometry",
			"meta": {
				"ui": {
					"x": 286,
					"y": -130
				}
			}
		}
	},
	"processes": {
		"update-video-layers": {
			"id": "update-video-layers",
			"ports": {
				"ctx": "accumulator",
				"names": "hot",
				"videos": "hot"
			},
			"code": "function(ports) {\n\tports.names.forEach(name => {\n\t\tthis.renderer.updateLayer(ports.ctx, name + \"-video\", {asset: ports.videos[name]})\n\t})\n\treturn ports.ctx\n}",
			"meta": {
				"ui": {
					"x": 45,
					"y": -509
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
					"x": 97,
					"y": 54
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
					"x": 52,
					"y": -583
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
					"x": 206,
					"y": -813
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
					"x": 72,
					"y": -167
				}
			}
		},
		"video-factory": {
			"id": "video-factory",
			"ports": {},
			"code": "function(ports) {\n\treturn function createVideo(src) {\n\t\tvar video = document.createElement('video')\n\t\tvideo.loop = \"loop\"\n\t\tvar source1 = document.createElement('source')\n\t\tvar source2 = document.createElement('source')\n\t\tsource1.src = src + \".webm\"\n\t\tsource1.type = \"video/webm\"\n\t\tsource2.src = src + \".mp4\"\n\t\tsource2.type = \"video/mp4\"\n\t\tvideo.appendChild(source1)\n\t\tvideo.appendChild(source2)\n\t\tvideo.play()\n\t\treturn video\n\t}\n}",
			"autostart": true,
			"meta": {
				"ui": {
					"x": 414,
					"y": -665
				}
			}
		},
		"create-video-layers": {
			"id": "create-video-layers",
			"ports": {
				"createVideo": "hot",
				"names": "hot"
			},
			"code": "function(ports) {\n\treturn ports.names.reduce((obj, name) => {\n\t\tobj[name] = ports.createVideo(\"//s3.eu-central-1.amazonaws.com/trivialspace.net/tvs1/\" + name)\n\t\treturn obj\n\t}, {})\n}",
			"meta": {
				"ui": {
					"x": 244,
					"y": -509
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
					"x": 187,
					"y": -248
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
					"x": 368,
					"y": -12
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
					"x": 8,
					"y": -640
				}
			}
		},
		"video-factory-test": {
			"id": "video-factory-test",
			"ports": {
				"createVideo": "hot"
			},
			"code": "function(ports, send) {\n \tvar video = ports.createVideo(\"//s3.eu-central-1.amazonaws.com/trivialspace.net/tvs1/nanofuzz\")\n\tconsole.log(video)\n\tdocument.body.appendChild(video)\n\treturn function stop() {\n\t\tdocument.body.removeChild(video)\n\t}\n}",
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
					"x": -118,
					"y": -902
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
					"x": -228,
					"y": -607
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
					"x": -122,
					"y": -647
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
		"video-factory->video-factory-test::createVideo": {
			"id": "video-factory->video-factory-test::createVideo",
			"entity": "video-factory",
			"process": "video-factory-test",
			"port": "createVideo",
			"meta": {}
		},
		"canvas->create-context::canvas": {
			"id": "canvas->create-context::canvas",
			"entity": "canvas",
			"process": "create-context",
			"port": "canvas",
			"meta": {}
		},
		"screen-names->create-video-layers::names": {
			"id": "screen-names->create-video-layers::names",
			"entity": "screen-names",
			"process": "create-video-layers",
			"port": "names",
			"meta": {}
		},
		"screen-names->update-video-layers::names": {
			"id": "screen-names->update-video-layers::names",
			"entity": "screen-names",
			"process": "update-video-layers",
			"port": "names",
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
		"window-size-source->window-size": {
			"id": "window-size-source->window-size",
			"entity": "window-size",
			"process": "window-size-source",
			"meta": {}
		},
		"create-canvas->canvas": {
			"id": "create-canvas->canvas",
			"entity": "canvas",
			"process": "create-canvas",
			"meta": {}
		},
		"screen-box-geometry->update-screen-box-geometry::box": {
			"id": "screen-box-geometry->update-screen-box-geometry::box",
			"entity": "screen-box-geometry",
			"process": "update-screen-box-geometry",
			"port": "box",
			"meta": {}
		},
		"plane-shader-frag->update-plane-shader::frag": {
			"id": "plane-shader-frag->update-plane-shader::frag",
			"entity": "plane-shader-frag",
			"process": "update-plane-shader",
			"port": "frag",
			"meta": {}
		},
		"screen-plane-geometry->update-screen-plane-geometry::plane": {
			"id": "screen-plane-geometry->update-screen-plane-geometry::plane",
			"entity": "screen-plane-geometry",
			"process": "update-screen-plane-geometry",
			"port": "plane",
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
		"update-screen-plane-geometry->render-context": {
			"id": "update-screen-plane-geometry->render-context",
			"entity": "render-context",
			"process": "update-screen-plane-geometry",
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
			"layout": [
				{
					"id": "window-size-source",
					"type": "process"
				},
				{
					"id": "window-size",
					"type": "entity"
				},
				{
					"id": "plane-shader-frag",
					"type": "entity"
				},
				{
					"id": "plane-shader-vert",
					"type": "entity"
				},
				{
					"id": "update-plane-shader",
					"type": "process"
				},
				{
					"id": "render-context",
					"type": "entity",
					"minified": true
				},
				{
					"id": "update-objects-layer",
					"type": "process"
				},
				{
					"id": "update-video-layers",
					"type": "process"
				},
				{
					"id": "videos",
					"type": "entity"
				},
				{
					"id": "screen-names",
					"type": "entity"
				},
				{
					"id": "create-video-layers",
					"type": "process"
				},
				{
					"id": "video-factory",
					"type": "entity"
				},
				{
					"id": "video-factory-test",
					"type": "process"
				},
				{
					"id": "video-factory",
					"type": "process"
				}
			]
		}
	}
}
