pub fn render(width: u32, height: u32) -> Vec<[u8; 3]> {
    let mut pixels = vec![[0, 0, 0]; (width * height) as usize];
    let mut index = 0;
    for j in (0..height).rev() {
        for i in 0..width {
            let r = i as f32 / width as f32;
            let g = j as f32 / height as f32;
            let b = 0.2;
            pixels[index] = [(255.99 * r) as u8, (255.99 * g) as u8, (255.99 * b) as u8];
            index += 1;
        }
    }
    pixels
}
