var canvas = document.body.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    W = canvas.width = window.innerWidth,
    H = canvas.height = window.innerHeight,
    pixels = [];

for (var x = -300; x < 400; x += 6) {
  for (var z = -250; z < 350; z += 5) {
    pixels.push({x: x, y: 500, z: z});
  }  
}

function render(ts) {
  var imageData = ctx.getImageData(0, 0, W, H),
      len = pixels.length,
      fov = 60,
      pixel, scale,
      x2d, y2d, c;

  for (var i = 0; i < len; i++) {
    pixel = pixels[i];
    scale = fov / (fov + pixel.z);
    x2d = pixel.x * scale + W / 2;
    y2d = pixel.y * scale + H / 2;
    if(x2d >= 0 && x2d <= W && y2d >= 0 && y2d <= H) {
      c = (Math.round(y2d) * imageData.width + Math.round(x2d)) * 4;
      imageData.data[c] = 209;
      imageData.data[c + 1] = 0;
      imageData.data[c + 2] = 177;
      imageData.data[c + 12] = 250;
      imageData.data[c + 4] = 225;
    }
    pixel.z -= 0.4;
    pixel.y = H / 20 + Math.sin(i / len * 450 + (ts / 2250)) * 210;
    if (pixel.z < -fov) pixel.z += 2 * fov;
  }
  ctx.putImageData(imageData, 0, 0);
}

(function drawFrame(ts){
  requestAnimationFrame(drawFrame, canvas);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  render(ts);
}());
