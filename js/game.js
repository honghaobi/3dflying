// Preset colors
var colors = {
  peach: 0xee7261,
  lavender: 0xeadfff,
  navy: 0x3a6dbb,
  avocado: 0xd4f17a,
  mint: 0x61eeaa,
  tree: 0x22a164,

};

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
  createHouse();
  createGround();
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


  //Camera starting postion

  camera.position.x = -300;
  camera.position.z = 0;
  camera.position.y = 200;

  // camera.lookAt( scene.position );

//Create fog

  scene.fog = new THREE.Fog(colors.lavender, 300, 1500);

  scene.position.x = 0;
  scene.position.y = 0;
  scene.position.z = 0;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

}

//Screen resize

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

//Create Lights

var ambientLight,
    hemisphereLight,
    shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .8)
  shadowLight = new THREE.DirectionalLight(0xffffff, .6);
  shadowLight.position.set(-250, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 2000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

Ground = function(){
  var geom = new THREE.SphereGeometry( 1000, 32, 32 );
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  var mat = new THREE.MeshPhongMaterial({
    color:colors.avocado,
    transparent:true,
    opacity:1,
    shading:THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 50;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    var h = 1500 + Math.random()*200;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = Math.random()* (3000 - (-3000)) + (-3000);
    c.mesh.rotation.z = a + Math.PI/2;
    var s = 1 + Math.random() * 5;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.IcosahedronGeometry(50)
  var mat = new THREE.MeshPhongMaterial({
    color:colors.lavender,
    transparent:true,
    opacity:.8,
    shading:THREE.FlatShading
  });

  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*15;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = 0.05 + Math.random()*.9;
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}


// 3D Models
var ground;
var house;

function createHouse(){
  var loader = new THREE.ColladaLoader();
  loader.load('up-house-with-balloons.dae', function (houseCollada) {
    house = houseCollada;
    houseCollada.scene.scale.set(0.15,0.15,0.15);
    houseCollada.scene.position.y = 0;

    houseCollada.scene.rotation.y = 0;
    houseCollada.scene.rotation.x = -1.6;

    var housePartsArray = houseCollada.scene.children[0].children[1].children;
    for (var i = 0; i < housePartsArray.length; i++) {
      housePartsArray[i].castShadow = true;
    }
    scene.add(houseCollada.scene);
  });
}


function createGround(){
  ground = new Ground();
  ground.mesh.position.y = -1000;
  scene.add(ground.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = 0;
  sky.mesh.position.x = 600;
  sky.mesh.position.z = -200;
  scene.add(sky.mesh);
}

function loop(){
  updateHouse();
  updateCameraFov();
  ground.mesh.rotation.z += .005;
  sky.mesh.rotation.z += .005;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updateHouse(){

  //Cursor moving the house direction

  var ty = normalize(mousePos.y,-.75,.75,-100, 100);
  var tx = normalize(mousePos.x,-.75,.75,-100, 100);
  var tz = 0;

  var yMovSpeed = 0.1;
  var xMovSpeed = 0.1;
  var yRotSpeed = 0.005;
  var xRotSpeed = 0.005;

  //House movement & rotation
  if (house) {

    var housePos = house.scene.position;
    var houseRot = house.scene.rotation;

    //limit on z axis (left and right)

    if (housePos.z > 300) {
      housePos.z = 300;
    } else if (housePos.z < -300) {
      housePos.z = -300;
    }

    housePos.y += (ty-housePos.y + 120) * yMovSpeed;
    housePos.z += (tx-housePos.x + 5) * xMovSpeed;

    houseRot.y = -(ty-housePos.y + 120) * yRotSpeed;
    houseRot.z = -(tx-housePos.x) * xRotSpeed;

  }
}

function updateCameraFov(){

  if (house) {
    //Camera Point to the House
    camera.lookAt( house.scene.position );
  }

  camera.fov = normalize(mousePos.y,-1,1,30,80);

  camera.updateProjectionMatrix();
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

// HANDLE MOUSE EVENTS

function handleMouseMove(event) {

  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

window.addEventListener('load', init, false);
