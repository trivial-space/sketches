import {tileNoise} from "../../projects/libs/dist/math/noise.js";
function to8Bit(noise) {
  return Math.floor((noise + 1) * 127);
}
export function getNoiseTextureData({
  startX = 1,
  startY = 1,
  width,
  height,
  data = {}
}) {
  const buffer = new Uint8Array(width * height * 4);
  const noise1 = tileNoise(width, height, startX, startY);
  const noise2 = tileNoise(width, height, startX * 2.1, startY * 2.1);
  const noise3 = tileNoise(width, height, startX * 4.2, startY * 4.2);
  const noise4 = tileNoise(width, height, startX * 8.3, startY * 8.3);
  for (let i = 0; i < noise1.length; i++) {
    const i4 = i * 4;
    buffer[i4] = to8Bit(noise1[i]);
    buffer[i4 + 1] = to8Bit(noise2[i]);
    buffer[i4 + 2] = to8Bit(noise3[i]);
    buffer[i4 + 3] = to8Bit(noise4[i]);
  }
  data.data = buffer;
  data.width = width;
  data.height = height;
  return data;
}
