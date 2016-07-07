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


//Initializing

function init(event){
  document.addEventListener('mousemove', handleMouseMove, false);
  createScene();
  createLights();
  createPlane();
  createLand();
  createSky();
  loop();
}


//Create Screen, Mouse Events and Camera

function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 80;
  nearPlane = 1;
  farPlane = 10000;

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );

  //Create fog
  scene.fog = new THREE.Fog(0xffffff, 100, 950);

  scene.position.x = 0;
  scene.position.y = 0;
  scene.position.z = 0;

  camera.position.x = -200;
  camera.position.z = 200;
  camera.position.y = 400;

  camera.lookAt( scene.position );

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

}

//Create Lights

var ambientLight,
    hemisphereLight,
    shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(250, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}
