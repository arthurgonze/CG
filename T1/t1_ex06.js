import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians,
        createLightSphere} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(2.18, 1.62, 3.31);
  camera.up.set( 0, 1, 0 );

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(4.0, 2.5, 50, 50); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

// Show text information onscreen
showInformation();
var infoBox = new SecondaryBox("");

// Teapot
var objColor = "rgb(255,255,255)";
var objShininess = 200;
var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({color:objColor, shininess:objShininess});
  material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Default light position, color, ambient color and intensity
var leftLightIntensity = 1.0;
var frontLightIntensity = 1.0;
var rightLightIntensity = 1.0;

var leftLightPosition = new THREE.Vector3(1.7, 1, 1.1);
var frontLightPosition = new THREE.Vector3(1.7, 1, 0);
var rightLightPosition = new THREE.Vector3(1.7, 1, -1.1);

var leftLightColor = "rgb(0,0,255)";
var frontLightColor = "rgb(0,255,0)";
var rightLightColor = "rgb(255,0,0)";
var ambientColor = "rgb(50,50,50)";

// Sphere to represent the light
var leftLightSphere = createColoredLightSphere(scene, 0.05, 10, 10, leftLightPosition, leftLightColor);
var frontLightSphere = createColoredLightSphere(scene, 0.05, 10, 10, frontLightPosition, frontLightColor);
var rightLightSphere = createColoredLightSphere(scene, 0.05, 10, 10, rightLightPosition, rightLightColor);


//---------------------------------------------------------
// Create and set all lights. Only Spot and ambient will be visible at first
var spotLightLeft = new THREE.SpotLight(leftLightColor);
setSpotLight(leftLightPosition, spotLightLeft);

var spotLightFront = new THREE.SpotLight(frontLightColor);
setSpotLight(frontLightPosition, spotLightFront);

var spotLightRight = new THREE.SpotLight(rightLightColor);
setSpotLight(rightLightPosition, spotLightRight);

var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add( ambientLight );

buildInterface();
render();

// Set Spotlight
// More info here: https://threejs.org/docs/#api/en/lights/SpotLight
function setSpotLight(position, spotLight)
{
  spotLight.position.copy(position);
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.angle = degreesToRadians(40);    
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.5;
  spotLight.name = "Spot Light"

  scene.add(spotLight);
}

//---------------------------------------------------------
// Setting the scene metal bars
var barWidth = 0.025;
var barHeight = 1;
var barPosition = new THREE.Vector3(1.7, 0.5, 1.1);
var barRotation = new THREE.Vector3(0.0, 0.0, 0.0);
// var barRotation = new THREE.Vector3(90.0*(Math.PI/180), 0.0, 0.0);
setBar(barWidth, barHeight, barPosition, barRotation);
barPosition = new THREE.Vector3(-1.7, 0.5, 1.1);
setBar(barWidth, barHeight, barPosition, barRotation);
barPosition = new THREE.Vector3(1.7, 0.5, -1.1);
setBar(barWidth, barHeight, barPosition, barRotation);
barPosition = new THREE.Vector3(-1.7, 0.5, -1.1);
setBar(barWidth, barHeight, barPosition, barRotation);

barHeight = 3.45;
barPosition = new THREE.Vector3(0, 1, 1.1);
var barRotation = new THREE.Vector3(0.0, 0.0, 90.0*(Math.PI/180));
setBar(barWidth, barHeight, barPosition, barRotation);
barPosition = new THREE.Vector3(0, 1, -1.1);
setBar(barWidth, barHeight, barPosition, barRotation);

barHeight = 2.25;
barPosition = new THREE.Vector3(1.7, 1, 0);
var barRotation = new THREE.Vector3(90.0*(Math.PI/180), 0.0, 0.0);
setBar(barWidth, barHeight, barPosition, barRotation);



// Set Bar
function setBar(width, height, position, rotation)
{
  // create the cylinder
  const cylinderGeometry = new THREE.CylinderGeometry( width, width, height, 32 );
  const cylinderMaterial = new THREE.MeshNormalMaterial();
  const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
  // cylinder position
  cylinder.position.set(position.x,position.y,position.z);
  // cylinder rotation
  cylinder.rotation.set(rotation.x,rotation.y,rotation.z);
  // add the sphere to the scene
  scene.add( cylinder );
}

function createColoredLightSphere(scene, radius, widthSegments, heightSegments, position, color)
{
  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
  var material = new THREE.MeshBasicMaterial({color:color});
  var object = new THREE.Mesh(geometry, material);
    object.visible = true;
    object.position.copy(position);
  scene.add(object);

  return object;
}

// Update light position of the current light
function updateLeftLightPosition()
{
  spotLightLeft.position.copy(leftLightPosition);
  leftLightSphere.position.copy(leftLightPosition);
  infoBox.changeMessage("Left Light Position: " + leftLightPosition.x.toFixed(2) + ", " +
  leftLightPosition.y.toFixed(2) + ", " + leftLightPosition.z.toFixed(2));
}
function updateFrontLightPosition()
{
  spotLightFront.position.copy(frontLightPosition);
  frontLightSphere.position.copy(frontLightPosition);
  infoBox.changeMessage("Front Light Position: " + frontLightPosition.x.toFixed(2) + ", " +
  frontLightPosition.y.toFixed(2) + ", " + frontLightPosition.z.toFixed(2));
}
function updateRightLightPosition()
{
  spotLightRight.position.copy(rightLightPosition);
  rightLightSphere.position.copy(rightLightPosition);
  infoBox.changeMessage("Right Light Position: " + rightLightPosition.x.toFixed(2) + ", " +
  rightLightPosition.y.toFixed(2) + ", " + rightLightPosition.z.toFixed(2));
}

// Update light intensity of the current light
function updateLeftLightIntensity()
{
  spotLightLeft.intensity = leftLightIntensity;
}
function updateFrontLightIntensity()
{
  spotLightFront.intensity = frontLightIntensity;
}
function updateRightLightIntensity()
{
  spotLightRight.intensity = rightLightIntensity;
}

var speed = 0.05;
var animationOn = true; // control if animation is on or of
function updateObjRotation()
{
  obj.matrixAutoUptade = false;
  if(animationOn)
  {
    obj.rotateY(5*(Math.PI/180)*speed);
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
    this.shininess = objShininess;

    this.leftLightIntensity = leftLightIntensity;
    this.frontLightIntensity = frontLightIntensity;
    this.rightLightIntensity = rightLightIntensity;

    this.showLeftLight = true;
    this.showFrontLight = true;
    this.showRightLight = true;

    this.speed = 0.05;
    this.changeAnimation = true;

    this.onViewAxes = function(){
      axesHelper.visible = this.viewAxes;
    };
    this.onEnableAmbientLight = function(){
      ambientLight.visible = this.ambientLight;
    };
    this.onUpdateShininess = function(){
      material.shininess = this.shininess;
    };

    this.onUpdateLeftLightIntensity = function(){
      leftLightIntensity = this.leftLightIntensity;
      updateLeftLightIntensity();
    };
    this.onUpdateFrontLightIntensity = function(){
      frontLightIntensity = this.frontLightIntensity;
      updateFrontLightIntensity();
    };
    this.onUpdateRightLightIntensity = function(){
      rightLightIntensity = this.rightLightIntensity;
      updateRightLightIntensity();
    };

    this.onShowLeftLight = function(){
      spotLightLeft.visible = this.showLeftLight;
      leftLightSphere.visible= this.showLeftLight;
    };
    this.onShowFrontLight = function(){
      spotLightFront.visible = this.showFrontLight;
      frontLightSphere.visible= this.showFrontLight;
    };
    this.onShowRightLight = function(){
      spotLightRight.visible = this.showRightLight;
      rightLightSphere.visible= this.showRightLight;
    };

    this.onChangeAnimation = function(){
      animationOn = this.changeAnimation;
    };
    this.changeSpeed = function(){
      speed = this.speed;
    };
  };

  var gui = new GUI();
  gui.add(controls, 'shininess', 0, 1000)
    .name("Obj Shininess")
    .onChange(function(e) { controls.onUpdateShininess() });
  gui.add(controls, 'leftLightIntensity', 0, 5)
    .name("Left Light Intensity")
    .onChange(function(e) { controls.onUpdateLeftLightIntensity() });
  gui.add(controls, 'frontLightIntensity', 0, 5)
    .name("Front Light Intensity")
    .onChange(function(e) { controls.onUpdateFrontLightIntensity() });
  gui.add(controls, 'rightLightIntensity', 0, 5)
    .name("Right Light Intensity")
    .onChange(function(e) { controls.onUpdateRightLightIntensity() });
  gui.add(controls, 'viewAxes', false)
    .name("View Axes")
    .onChange(function(e) { controls.onViewAxes() });
  gui.add(controls, 'ambientLight', true)
    .name("Ambient Light")
    .onChange(function(e) { controls.onEnableAmbientLight() });
  gui.add(controls, 'showLeftLight', true)
    .name("Show Left Light")
    .onChange(function(e) { controls.onShowLeftLight() });
  gui.add(controls, 'showFrontLight', true)
    .name("Show Front Light")
    .onChange(function(e) { controls.onShowFrontLight() });
  gui.add(controls, 'showRightLight', true)
    .name("Show Right Light")
    .onChange(function(e) { controls.onShowRightLight() });

  gui.add(controls, 'changeAnimation', true)
    .name("Animation On/Off")
    .onChange(function(e) { controls.onChangeAnimation() });
  gui.add(controls, 'speed', 0.05, 0.5)
    .name("Change Speed")
    .onChange(function(e) { controls.changeSpeed() });
}

function keyboardUpdate()
{
  keyboard.update();
  // control left light
  if ( keyboard.pressed("W") && leftLightPosition.x < 1.7)
  {
    leftLightPosition.x += 0.05;
    updateLeftLightPosition();
  }else if (keyboard.pressed("W") && leftLightPosition.x >= 1.7)
  {
    leftLightPosition.x = 1.7;
    updateLeftLightPosition();
  }

  if ( keyboard.pressed("S") && leftLightPosition.x >= -1.7)
  {
    leftLightPosition.x -= 0.05;
    updateLeftLightPosition();
  }else if(keyboard.pressed("W") && leftLightPosition.x < -1.7)
  {
    leftLightPosition.x = -1.7;
    updateLeftLightPosition();
  }

  // control front light 
  if ( keyboard.pressed("A") && frontLightPosition.z < 1.1)
  {
    frontLightPosition.z += 0.05;
    updateFrontLightPosition();
  }else if(keyboard.pressed("A") && frontLightPosition.z >= 1.1)
  {
    frontLightPosition.z = 1.1;
    updateFrontLightPosition();
  }


  if ( keyboard.pressed("D") && frontLightPosition.z > -1.1)
  {
    frontLightPosition.z -= 0.05;
    updateFrontLightPosition();
  }else if(keyboard.pressed("D") && frontLightPosition.z >= -1.1)
  {
    frontLightPosition.z = -1.1;
    updateFrontLightPosition();
  }

  // control right light
  if ( keyboard.pressed("Q") && rightLightPosition.x > -1.7)
  {
    rightLightPosition.x -= 0.05;
    updateRightLightPosition();
  }else if(keyboard.pressed("Q") && rightLightPosition.x >= -1.7)
  {
    leftLightPosition.x = -1.7;
    updateRightLightPosition();
  }
  if ( keyboard.pressed("E") && rightLightPosition.x < 1.7)
  {
    rightLightPosition.x += 0.05;
    updateRightLightPosition();
  }else if(keyboard.pressed("E") && rightLightPosition.x <= 1.7)
  {
    leftLightPosition.x = 1.7;
    updateRightLightPosition();
  }
}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Lighting - RGB spotlights");
    controls.addParagraph();
    controls.add("Use the *W,S* keys to move the left light, *A,D* to move front light and *Q,E* to move right light");
    controls.show();
}

function render()
{
  stats.update();
  trackballControls.update();
  keyboardUpdate();
  updateObjRotation();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
