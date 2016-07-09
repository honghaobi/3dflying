// Preset colors
var colors = {
  white: 0xffffff,
  gray: 0x909090,
  black: 0x000000,
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


//For animation frames

var mixers = [];

//Game Setting

var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var birdsPool = [];
var fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle;

var game = {
        speed: 0,
        initSpeed: .00035,
        baseSpeed: .00035,
        targetBaseSpeed: .00035,
        incrementSpeedByTime: .0000025,
        incrementSpeedByLevel: .000005,
        distanceForSpeedUpdate: 100,
        speedLastUpdate: 0,

        distance: 0,
        ratioSpeedDistance: 50,
        energy: 100,
        ratioSpeedEnergy: 3,

        level: 1,
        levelLastUpdate: 0,
        distanceForLevelUpdate: 1000,

        houseDefaultHeight: 100,
        houseAmpHeight: 80,
        houseAmpWidth: 75,
        houseMoveSensivity: 0.005,
        houseRotXSensivity: 0.0008,
        houseRotZSensivity: 0.0004,
        houseFallSpeed: .001,
        houseMinSpeed: 1.2,
        houseMaxSpeed: 1.6,
        houseSpeed: 0,
        houseCollisionDisplacementX: 0,
        houseCollisionSpeedX: 0,

        houseCollisionDisplacementY: 0,
        houseCollisionSpeedY: 0,

        landRadius: 600,

        cameraFarPos: 500,
        cameraNearPos: 150,
        cameraSensivity: 0.002,

        balloonDistanceTolerance:50,
        balloonValue: 3,
        balloonsSpeed: .5,
        balloonLastSpawn: 0,
        distanceForBalloonsSpawn: 100,

        //birds collosion contact tolorance
        birdDistanceTolerance: 60,
        birdValue: 10,
        birdsSpeed: .6,
        birdLastSpawn: 0,
        distanceForBirdsSpawn: 50,

        status : "playing",

}


//Initializing

function init(event){
  document.addEventListener('mousemove', handleMouseMove, false);
  createScene();
  createLights();
  createHouse();
  createGround();
  createSky();
  createBalloons();
  createBirds();
  loop();
}


//Create Screen, Mouse Events and Camera

function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  //Initial creation of the Camera View
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

  camera.position.x = -350;
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

  hemisphereLight = new THREE.HemisphereLight(colors.lavender, colors.black, .6)
  ambientLight = new THREE.AmbientLight(colors.gray);
  shadowLight = new THREE.DirectionalLight(colors.gray, 0.5);
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

  //Testing light source.
  // var lightSource = new THREE.CameraHelper(shadowLight.shadow.camera);
  // scene.add(lightSource);

  scene.add(hemisphereLight);
  scene.add(ambientLight);
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
    var clouds = new Clouds();
    this.clouds.push(clouds);
    var a = stepAngle*i;
    var h = 1500 + Math.random()*200;
    clouds.mesh.position.y = Math.sin(a)*h;
    clouds.mesh.position.x = Math.cos(a)*h;
    clouds.mesh.position.z = Math.random()* (3000 - (-3000)) + (-3000);
    clouds.mesh.rotation.z = a + Math.PI/2;
    var s = 1 + Math.random() * 5;
    clouds.mesh.scale.set(s,s,s);
    this.mesh.add(clouds.mesh);
  }
}

Clouds = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.IcosahedronGeometry(50);
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

Balloon = function(){
  var sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
  var material = new THREE.MeshBasicMaterial({
    color: colors.navy,
    shininess: 20,
    specular: colors.white,
    shading: THREE.FlatShading
  });

  this.mesh = new THREE.Mesh(sphereGeometry, material);
  this.mesh.scale.y = 1.3;
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

BalloonsHolder = function (nBalloons){
  this.mesh = new THREE.Object3D();
  this.balloonsInUse = [];
  this.balloonsPool = [];
  for (var i=0; i<nBalloons; i++){
    var balloon = new Balloon();
    this.balloonsPool.push(balloon);
  }
}

BalloonsHolder.prototype.spawnBalloons = function(){

  var nBalloons = 1 + Math.floor(Math.random()*10);
  var d = game.landRadius + game.houseDefaultHeight + (-1 + Math.random() * 2) * (game.houseAmpHeight-20);
  var amplitude = 10 + Math.round(Math.random()*10);
  for (var i=0; i<nBalloons; i++){
    var balloon;
    if (this.balloonsPool.length) {
      balloon = this.balloonsPool.pop();
    }else{
      balloon = new Balloon();
    }
    this.mesh.add(balloon.mesh);
    this.balloonsInUse.push(balloon);
    balloon.angle = - (i*0.02);
    balloon.distance = d + Math.cos(i*.5)*amplitude;
    balloon.mesh.position.y = -game.landRadius + Math.sin(balloon.angle)*balloon.distance;
    balloon.mesh.position.x = Math.cos(balloon.angle)*balloon.distance;
  }
}

BalloonsHolder.prototype.rotateBalloons = function(){
  for (var i=0; i<this.balloonsInUse.length; i++){
    var balloon = this.balloonsInUse[i];
    if (balloon.exploding) continue;
    balloon.angle += game.speed*deltaTime*game.balloonsSpeed;
    if (balloon.angle>Math.PI*2) balloon.angle -= Math.PI*2;
    balloon.mesh.position.y = -game.landRadius + Math.sin(balloon.angle)*balloon.distance;
    balloon.mesh.position.x = Math.cos(balloon.angle)*balloon.distance;
    balloon.mesh.rotation.z += Math.random()*.1;
    balloon.mesh.rotation.y += Math.random()*.1;

    var diffPos = house.scene.position.clone().sub(balloon.mesh.position.clone());
    var d = diffPos.length();
    if (d<game.balloonDistanceTolerance){
      this.balloonsPool.unshift(this.balloonsInUse.splice(i,1)[0]);
      this.mesh.remove(balloon.mesh);
      // particlesHolder.spawnParticles(balloon.mesh.position.clone(), 5, 0x009999, .8);
      // addEnergy();
      i--;
    } else if (balloon.angle > Math.PI){
      this.balloonsPool.unshift(this.balloonsInUse.splice(i,1)[0]);
      this.mesh.remove(balloon.mesh);
      i--;
    }
  }
}

Bird = function(){
  var self = this;
  var birdsLoader = new THREE.JSONLoader();

  var birdsArray = ["models/flamingo.js", "models/parrot.js", "models/stork.js"];
  birdsRandom = birdsArray[Math.floor(Math.random()*3)];

  birdsLoader.load( birdsRandom, function( geometry ) {
    var material = new THREE.MeshPhongMaterial({
      color: colors.white,
      specular: colors.white,
      shininess: 20,
      morphTargets: true,
      vertexColors: THREE.FaceColors,
      shading: THREE.FlatShading
    });
		self.mesh = new THREE.Mesh( geometry, material );
    var s = 0.35;
		self.mesh.scale.set( s, s, s );
		self.mesh.rotation.y = -1.6;
		self.mesh.castShadow = true;
		self.mesh.receiveShadow = true;
    self.angle = 0;
    self.dist = 0;
		var mixer = new THREE.AnimationMixer( self.mesh );
		mixer.clipAction( geometry.animations[0] ).setDuration( 1 ).play();
		mixers.push( mixer );

  });
}

BirdsHolder = function (){
  this.mesh = new THREE.Object3D();
  this.birdsInUse = [];
}

var counter = 0;

BirdsHolder.prototype.spawnBirds = function(){

    var nBirds = game.level;

    for (var i=0; i<nBirds; i++){
      var bird;
      if (birdsPool.length) {
        bird = birdsPool.pop();
      } else {
        bird = new Bird();
      }

    bird.angle = - (i*0.1);
    bird.distance = game.landRadius + game.houseDefaultHeight + (-1 + Math.random() * 2) * (game.houseAmpHeight-20);
    bird.mesh.position.y = -game.landRadius + Math.sin(bird.angle)*bird.distance;
    bird.mesh.position.x = Math.cos(bird.angle)*bird.distance;
    bird.mesh.position.z = Math.random()* (300 - (-300)) + (-300);

    this.mesh.add(bird.mesh);
    this.birdsInUse.push(bird);
  }
}


BirdsHolder.prototype.rotateBirds = function(){
  for (var i=0; i<this.birdsInUse.length; i++){
    var bird = this.birdsInUse[i];
    bird.angle += game.speed*deltaTime*game.birdsSpeed;

    if (bird.angle > Math.PI*2) bird.angle -= Math.PI*2;

    bird.mesh.position.y = -game.landRadius + Math.sin(bird.angle)*bird.distance;
    bird.mesh.position.x = Math.cos(bird.angle)*bird.distance;


    //Setting the balloons position for collision detection
    var balloonsPos = new THREE.Vector3();

    balloonsPos.x = house.scene.position.x;
    balloonsPos.y = house.scene.position.y + 100;
    balloonsPos.z = house.scene.position.z;

    var diffBalloonsPos = balloonsPos.clone().sub(bird.mesh.position.clone());
    var diffHousePos = house.scene.position.clone().sub(bird.mesh.position.clone());


    var dh = diffHousePos.length();
    var db = diffBalloonsPos.length();

    if (dh < game.birdDistanceTolerance || db < game.birdDistanceTolerance){

      // particlesHolder.spawnParticles(bird.mesh.position.clone(), 15, Colors.red, 3);

      //Birds disapear when collide
      birdsPool.unshift(this.birdsInUse.splice(i,1)[0]);
      this.mesh.remove(bird.mesh);

      //House movement after collision.
      game.houseCollisionSpeedX = 100 * diffHousePos.x / dh;
      game.houseCollisionSpeedY = 100 * diffHousePos.y / dh;

      //Light intensity flashed when collide with birds.
      ambientLight.intensity = 2;

      // removeEnergy();
      i--;
    }else if (bird.angle > Math.PI){
      birdsPool.unshift(this.birdsInUse.splice(i,1)[0]);
      this.mesh.remove(bird.mesh);
      i--;
    }
  }
}

// 3D Models
var ground;
var house;

function createHouse(){
  var loader = new THREE.ColladaLoader();
  loader.load('models/up-house-with-balloons.dae', function (houseCollada) {
    house = houseCollada;
    var s = .25
    houseCollada.scene.scale.set(s, s, s);
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

function createBalloons(){

  balloonsHolder = new BalloonsHolder(20);
  scene.add(balloonsHolder.mesh)
}

function createBirds(){
  for (var i=0; i<10; i++){
    var bird = new Bird();
    birdsPool.push(bird);
  }
  birdsHolder = new BirdsHolder();
  scene.add(birdsHolder.mesh)
}

var clock = new THREE.Clock();

function renderAnimatedModels() {
  var delta = clock.getDelta();
  for ( var i = 0; i < mixers.length; i ++ ) {
    mixers[ i ].update( delta );
  }
}


function loop(){

  //Game Logic

  newTime = new Date().getTime();
  deltaTime = newTime-oldTime;
  oldTime = newTime;


  //light intensity changes back when hit birds.
  ambientLight.intensity += (.5 - ambientLight.intensity)*deltaTime*0.005;


  if (game.status=="playing"){

    if (Math.floor(game.distance)%game.distanceForBalloonsSpawn == 0 && Math.floor(game.distance) > game.balloonLastSpawn){
      game.balloonLastSpawn = Math.floor(game.distance);
      balloonsHolder.spawnBalloons();
    }

    if (Math.floor(game.distance)%game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate){
      game.speedLastUpdate = Math.floor(game.distance);
      game.targetBaseSpeed += game.incrementSpeedByTime*deltaTime;
    }


    if (Math.floor(game.distance)%game.distanceForBirdsSpawn == 0 && Math.floor(game.distance) > game.birdLastSpawn){
      game.birdLastSpawn = Math.floor(game.distance);
      birdsHolder.spawnBirds();
    }

    if (Math.floor(game.distance)%game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate){
      game.levelLastUpdate = Math.floor(game.distance);
      game.level++;
      // fieldLevel.innerHTML = Math.floor(game.level);
      // console.log('game level', game.level);
      game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel*game.level
    }

  updateHouse();
  updateDistance();
  game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
  game.speed = game.baseSpeed * game.houseSpeed;

} else if(game.status=="gameover") {

}

  renderAnimatedModels();
  updateCameraFov();
  balloonsHolder.rotateBalloons();
  birdsHolder.rotateBirds();

  ground.mesh.rotation.z += .005;
  sky.mesh.rotation.z += .005;


  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updateDistance(){
  game.distance += game.speed*deltaTime*game.ratioSpeedDistance;
  // fieldDistance.innerHTML = Math.floor(game.distance);
  // console.log('distance', game.distance);
  var d = 502*(1-(game.distance%game.distanceForLevelUpdate)/game.distanceForLevelUpdate);
  // levelCircle.setAttribute("stroke-dashoffset", d);

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

    game.houseSpeed = normalize(mousePos.x,-.5,.5,game.houseMinSpeed, game.houseMaxSpeed);
    game.houseCollisionDisplacementX += game.houseCollisionSpeedX;
    tx += game.houseCollisionDisplacementX;
    game.houseCollisionDisplacementY += game.houseCollisionSpeedY;
    ty += game.houseCollisionDisplacementY;

    // house.scene.position.y += (ty-house.scene.position.y)*deltaTime*game.houseMoveSensivity;
    // house.scene.position.x += (tx-house.scene.position.x)*deltaTime*game.houseMoveSensivity;

    var targetCameraZ = normalize(game.houseSpeed, game.houseMinSpeed, game.houseMaxSpeed, game.cameraNearPos, game.cameraFarPos);
    camera.fov = normalize(mousePos.x,-1,1,40, 80);

    game.houseCollisionSpeedX += (0-game.houseCollisionSpeedX)*deltaTime * 0.03;
    game.houseCollisionDisplacementX += (0-game.houseCollisionDisplacementX)*deltaTime *0.01;
    game.houseCollisionSpeedY += (0-game.houseCollisionSpeedY)*deltaTime * 0.03;
    game.houseCollisionDisplacementY += (0-game.houseCollisionDisplacementY)*deltaTime *0.01;

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

  game.houseSpeed = normalize(mousePos.x,-.5,.5,game.houseMinSpeed, game.houseMaxSpeed);

}

function updateCameraFov(){

  if (house) {
    //Camera Point to the House
    camera.lookAt( house.scene.position );
  }
  camera.fov = normalize(mousePos.y,-1,1,50,80);
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

// Handle Mouse Events & Touch Events

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

function handleTouchMove(event) {
    event.preventDefault();
    var tx = -1 + (event.touches[0].pageX / WIDTH)*2;
    var ty = 1 - (event.touches[0].pageY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
}


window.addEventListener('load', init, false);
