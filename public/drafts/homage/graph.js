export const graph =
{
	"entities": {
		"screen-plane-geometry": {
			"id": "screen-plane-geometry",
			"meta": {
				"ui": {
					"x": 79,
					"y": -362
				}
			}
		},
		"screen-box-geometry": {
			"id": "screen-box-geometry",
			"meta": {
				"ui": {
					"x": -129,
					"y": -321
				}
			}
		},
		"render-context": {
			"id": "render-context",
			"meta": {
				"ui": {
					"x": -123,
					"y": -543.078125
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
		"window-size": {
			"id": "window-size",
			"meta": {
				"ui": {
					"x": 90,
					"y": -702
				}
			}
		}
	},
	"processes": {
		"create-screen-box-geometry": {
			"id": "create-screen-box-geometry",
			"ports": {},
			"code": "function(ports) {\n\treturn this.renderUtils.stackgl.convertStackGLGeometry(\n\t\tthis.box({size: [10, 10, 1], segments: [5, 5, 1]})\n\t)\n}",
			"autostart": true,
			"meta": {
				"ui": {
					"x": -138,
					"y": -218
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
					"x": 138,
					"y": -269
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
		"update-size": {
			"id": "update-size",
			"ports": {
				"ctx": "accumulator",
				"size": "hot"
			},
			"code": "function(ports) {\n\treturn this.renderer.updateSize(ports.ctx, ports.size.width, ports.size.heigth)\n}",
			"meta": {
				"ui": {
					"x": -13,
					"y": -618
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
					"x": -124,
					"y": -435
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
					"x": 32,
					"y": -454
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
		"canvas->create-context::canvas": {
			"id": "canvas->create-context::canvas",
			"entity": "canvas",
			"process": "create-context",
			"port": "canvas",
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
		"update-screen-plane-geometry->render-context": {
			"id": "update-screen-plane-geometry->render-context",
			"entity": "render-context",
			"process": "update-screen-plane-geometry",
			"meta": {}
		}
	},
	"meta": {
		"ui": {
			"layout": [
				{
					"id": "update-screen-plane-geometry",
					"type": "process"
				},
				{
					"id": "update-screen-box-geometry",
					"type": "process"
				},
				{
					"id": "update-size",
					"type": "process"
				},
				{
					"id": "create-screen-plane-geometry",
					"type": "process"
				},
				{
					"id": "create-screen-box-geometry",
					"type": "process"
				},
				{
					"id": "screen-box-geometry",
					"type": "entity",
					"minified": true
				},
				{
					"id": "screen-plane-geometry",
					"type": "entity",
					"minified": true
				}
			]
		}
	}
}
