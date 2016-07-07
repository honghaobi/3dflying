// Preset colors
var colors = {
  peach: #ee7261,
  lavender: #eadfff,
  navy: #3a6dbb;
  avocado: #d4f17a;
  mint: #61eeaa;
  tree: #22a164;
}

// ThreeJs Varibles

var scene,
    camera,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    renderer,
    container;

//Screen & Mouse Variables

var HEIGHT,
    WIDTH,
    mousePos = { x: 0, y: 0 };
