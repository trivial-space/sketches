use js_sys::Uint8Array;
use tvs_libs::prelude::*;
use wasm_bindgen::prelude::*;

mod render;
mod utils;

#[wasm_bindgen]
pub fn setup() {
    utils::set_panic_hook();
}

#[wasm_bindgen]
pub fn render(width: u32, height: u32) -> Uint8Array {
    let arr = Uint8Array::new_with_length((width * height * 4) as u32);
    let mut data: Vec<u8> = Vec::with_capacity((width * height * 4) as usize);
    let img = render::render(width, height);
    for pixel in img {
        data.push(pixel[0]);
        data.push(pixel[1]);
        data.push(pixel[2]);
        data.push(255);
    }
    arr.copy_from(&data);
    arr
}
