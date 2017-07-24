import { val } from 'tvs-flow/dist/lib/utils/entity-reference'


export interface TileSpec {
	file: string,
	connections: [number, number, number, number]
}


export const specs = val({
	lbA1: {
		file: 'tile_lb_A_1',
		connections: [0, 0, 1, 1]
	},
	lbA2: {
		file: 'tile_lb_A_2',
		connections: [0, 0, 1, 1]
	},
	lbA3: {
		file: 'tile_lb_A_3',
		connections: [0, 0, 1, 1]
	},
	lbB1: {
		file: 'tile_lb_B_1',
		connections: [0, 0, 1, 1]
	},
	lbB2: {
		file: 'tile_lb_B_2',
		connections: [0, 0, 1, 1]
	},
	lbB3: {
		file: 'tile_lb_B_3',
		connections: [0, 0, 1, 1]
	},
	lrA1: {
		file: 'tile_lr_A_1',
		connections: [0, 1, 0, 1]
	},
	lrB1: {
		file: 'tile_lr_B_1',
		connections: [0, 1, 0, 1]
	},
	lrC1: {
		file: 'tile_lr_C_1',
		connections: [0, 1, 0, 1]
	},
	lrD1: {
		file: 'tile_lr_D_1',
		connections: [0, 1, 0, 1]
	},
	lrD2: {
		file: 'tile_lr_D_2',
		connections: [0, 1, 0, 1]
	},
	lrD3: {
		file: 'tile_lr_D_3',
		connections: [0, 1, 0, 1]
	},
	lrE1: {
		file: 'tile_lr_E_1',
		connections: [0, 1, 0, 1]
	},
	lrE2: {
		file: 'tile_lr_E_2',
		connections: [0, 1, 0, 1]
	},
	lrE3: {
		file: 'tile_lr_E_3',
		connections: [0, 1, 0, 1]
	},
	lrtbA1: {
		file: 'tile_lrtb_A_1',
		connections: [1, 1, 1, 1]
	},
	lrtbB1: {
		file: 'tile_lrtb_B_1',
		connections: [1, 1, 1, 1]
	},
	lrtbC1: {
		file: 'tile_lrtb_C_1',
		connections: [1, 1, 1, 1]
	},
	ltbA1: {
		file: 'tile_ltb_A_1',
		connections: [1, 0, 1, 1]
	},
	ltbB1: {
		file: 'tile_ltb_B_1',
		connections: [1, 0, 1, 1]
	}
} as { [k: string]: TileSpec })


export const sets = val([{
	lbA1: 1,
	lbA2: 1,
	lbA3: 1,
	lbB1: 1,
	lbB2: 1,
	lbB3: 1,
	lrD1: 1,
	lrD2: 1,
	lrD3: 1,
	lrE1: 1,
	lrE2: 1,
	lrE3: 1,
	lrtbA1: 1,
	lrtbB1: 1,
	lrtbC1: 1,
	ltbA1: 1,
	ltbB1: 1
}])
