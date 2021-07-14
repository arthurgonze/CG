import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        onWindowResize, 
        degreesToRadians, 
        initDefaultBasicLight} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(7, 7, 7)); // Init camera in this position
var trackballControls = new TrackballControls( camera, renderer.domElement );
initDefaultBasicLight(scene);

// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(100, 100);
planeGeometry.translate(0.0, 0.0, 0.0); // To avoid conflict with the axeshelper
planeGeometry.rotateX(90.0*(Math.PI/180));
var planeMaterial = new THREE.MeshPhongMaterial({
    color: "rgba(225, 225, 225)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

var baseOffset = 0.002;
// cilindro da base
var objShininess = 1000;
const materialBase = new THREE.MeshPhongMaterial( {color: "rgb(255,0,0)", shininess:objShininess}  );
const cilindroBaseGeometry = new THREE.CylinderGeometry(0.5, 1, 0.5, 32, 8 );
var cilindroBase = new THREE.Mesh( cilindroBaseGeometry, materialBase );
cilindroBase.position.set(0, 0.25+baseOffset, 0 );
cilindroBase.castShadow = true;
scene.add( cilindroBase );

// cubo 1 da base
const cubo1baseGeometry = new THREE.BoxGeometry( 0.5, 0.125, 0.5 );
const cubo1base = new THREE.Mesh( cubo1baseGeometry, materialBase );
cubo1base.position.set(0.9, -0.18, 0.0);
cubo1base.castShadow = true;
cilindroBase.add( cubo1base );
// cubo 2 da base
const cubo2baseGeometry = new THREE.BoxGeometry( 0.5, 0.125, 0.5 );
const cubo2base = new THREE.Mesh( cubo2baseGeometry, materialBase );
cubo2base.position.set(-0.9, -0.18, 0.0);
cubo2base.castShadow = true;
cilindroBase.add( cubo2base );
// cubo 3 da base
const cubo3baseGeometry = new THREE.BoxGeometry( 0.5, 0.125, 0.5 );
const cubo3base = new THREE.Mesh( cubo3baseGeometry, materialBase );
cubo3base.position.set(0.0, -0.18, 0.9);
cubo3base.castShadow = true;
cilindroBase.add( cubo3base );
// cubo 4 da base
const cubo4baseGeometry = new THREE.BoxGeometry( 0.5, 0.125, 0.5 );
const cubo4base = new THREE.Mesh( cubo4baseGeometry, materialBase );
cubo4base.position.set(0.0, -0.18, -0.9);
cubo4base.castShadow = true;
cilindroBase.add( cubo4base );

// cano da base
const materialTorre = new THREE.MeshPhongMaterial( {color: "rgb(0,255,0)"} );
const torreGeometry = new THREE.CylinderGeometry( 0.2, 0.4, 2.5, 32 );
const torre = new THREE.Mesh( torreGeometry, materialTorre );
torre.position.set(0.0, 1.25, 0.0);
torre.castShadow = true;
cilindroBase.add( torre );

// cubo do motor
const materialMotor = new THREE.MeshPhongMaterial( {color: "rgb(0,0,255)",side: THREE.DoubleSide});
const baseMotorGeometry = new THREE.BoxGeometry( 0.5, 0.5, 2 );
const baseMotor = new THREE.Mesh( baseMotorGeometry, materialMotor );
baseMotor.position.set(0.0, 1.25, -0.25);
baseMotor.castShadow = true;
torre.add( baseMotor );

// cone da ponta do motor
const frenteMotorGeometry = new THREE.CylinderGeometry( 0.198, 0.2, 0.5,32,8, true);
const frenteMotor = new THREE.Mesh( frenteMotorGeometry, materialMotor );
frenteMotor.position.set(0.0, 0, 1.25);
frenteMotor.rotateX(90.0*(Math.PI/180));
frenteMotor.castShadow = true;
baseMotor.add( frenteMotor );

// cone da ponta do motor
const esferafrenteMotorGeometry = new THREE.SphereGeometry( 0.201, 32, 32);
const esferaFrenteMotor = new THREE.Mesh( esferafrenteMotorGeometry, materialMotor );
esferaFrenteMotor.position.set(0.0, 0.2, 0.0);
esferaFrenteMotor.castShadow = true;
frenteMotor.add( esferaFrenteMotor );

// cilindo base helice 1
const baseHelice1Geometry = new THREE.CylinderGeometry( 0.1, 0.05, 0.2, 32);
const materialHelice = new THREE.MeshPhongMaterial( {color: "rgb(255,255,0)",side: THREE.DoubleSide});
const baseHelice1 = new THREE.Mesh( baseHelice1Geometry, materialHelice );
baseHelice1.position.set(0.0, 0.0, -0.25);
baseHelice1.rotateX(90.0*(Math.PI/180));
baseHelice1.castShadow = true;
frenteMotor.add( baseHelice1 );

// cilindo base helice 2
const baseHelice2Geometry = new THREE.CylinderGeometry( 0.1, 0.05, 0.2, 32);
const baseHelice2 = new THREE.Mesh( baseHelice2Geometry, materialHelice );
baseHelice2.position.set(0.25, 0.0, 0.08);
baseHelice2.rotateZ(90.0*(Math.PI/180));
baseHelice2.rotateX(-20.0*(Math.PI/180));
baseHelice2.castShadow = true;
frenteMotor.add( baseHelice2 );

// cilindo base helice 3
const baseHelice3Geometry = new THREE.CylinderGeometry( 0.05, 0.1, 0.2, 32);
const baseHelice3 = new THREE.Mesh( baseHelice3Geometry, materialHelice );
baseHelice3.position.set(-0.25, 0.0, 0.08);
baseHelice3.rotateZ(90.0*(Math.PI/180));
baseHelice3.rotateX(20.0*(Math.PI/180));
baseHelice3.castShadow = true;
frenteMotor.add( baseHelice3 );

// helice 1
const helice1Geometry = new THREE.BoxGeometry( 0.5, 1, 0.1 );
const helice1 = new THREE.Mesh( helice1Geometry, materialHelice );
helice1.position.set(0.0, -0.575, 0.0);
helice1.castShadow = true;
baseHelice1.add( helice1 );

// helice 2
const helice2Geometry = new THREE.BoxGeometry( 0.5, 1, 0.1 );
const helice2 = new THREE.Mesh( helice1Geometry, materialHelice );
helice2.position.set(0.0, -0.575, 0.0);
helice2.castShadow = true;
baseHelice2.add( helice2 );

// helice 3
const helice3Geometry = new THREE.BoxGeometry( 0.5, 1, 0.1 );
const helice3 = new THREE.Mesh( helice1Geometry, materialHelice );
helice3.position.set(0.0, 0.575, 0.0);
helice3.castShadow = true;
baseHelice3.add( helice3 );


var speed = 0.05;
var animationOn = true; // control if animation is on or of
function updateHelicesRotation()
{
  frenteMotor.matrixAutoUptade = false;
  if(animationOn)
  {
    frenteMotor.rotateY(-5*(Math.PI/180)*speed);
  }
}

function buildInterface()
{
  //------------------------------------------------------------
  // Interface
  var controls = new function ()
  {
    this.viewAxes = false;
    this.ambientLight = true;
    this.speed = 0.05;
    this.changeAnimation = true;

    this.onViewAxes = function(){
      axesHelper.visible = this.viewAxes;
    };
    this.onEnableAmbientLight = function(){
      ambientLight.visible = this.ambientLight;
    };
    this.onChangeAnimation = function(){
      animationOn = this.changeAnimation;
    };
    this.changeSpeed = function(){
      speed = this.speed;
    };
  };

  var gui = new GUI();
  gui.add(controls, 'changeAnimation', true)
    .name("Start/Stop")
    .onChange(function(e) { controls.onChangeAnimation() });
  gui.add(controls, 'speed', 0.05, 1.0)
    .name("Change Speed")
    .onChange(function(e) { controls.changeSpeed() });
}



// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
buildInterface();
render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  updateHelicesRotation();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
