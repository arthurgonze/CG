import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

var ambientColor = "rgb(255,255,255)";
var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add( ambientLight );

function createCylinderBody()
{
  // GEOMETRY PROPERTIES
  var cylinderWidth = 4;
  var cylinderHeight = 8;
  var cylinderRadialSegments = 32;
  var cylinderHeightSegments = 32;
  var cylinderIsOpenEnded = true;
  const cylinderBodyGeometry = new THREE.CylinderGeometry(cylinderWidth,cylinderWidth,cylinderHeight,
    cylinderRadialSegments,cylinderHeightSegments,cylinderIsOpenEnded);

  // MATERIAL PROPERTIES
  const cylinderBodyMaterial  = new THREE.MeshPhongMaterial({color:"rgb(255,255,255)", shininess:"100"});
  cylinderBodyMaterial.side = THREE.DoubleSide;

  const cylinderBody = new THREE.Mesh( cylinderBodyGeometry, cylinderBodyMaterial );
  
  // position the cylinder
  var position = new THREE.Vector3(0.0,0.0,0.0);
  cylinderBody.position.set(position.x, position.y, position.z);
  cylinderBody.rotation.set(90.0*(Math.PI/180), 0.0, 0.0);

  loadTexture('../assets/textures/wood.png', cylinderBody,2);
  // add the cylinder to the scene
  scene.add( cylinderBody );

  createCylinderEnds(cylinderWidth,cylinderHeight,position);
}

function createCylinderEnds(radius,cylinderHeight,position)
{
  var segments = 32;
  const circleGeometry = new THREE.CircleGeometry(radius, segments);
  const circleMaterial  = new THREE.MeshPhongMaterial({color:"rgb(255,255,255)", shininess:"100"});
  circleMaterial.side = THREE.DoubleSide;
  const topCircle = new THREE.Mesh( circleGeometry, circleMaterial );
  const bottomCircle = new THREE.Mesh( circleGeometry, circleMaterial );
  scene.add( topCircle );
  scene.add( bottomCircle );
  loadTexture('../assets/textures/woodtop.png', topCircle, 1);
  loadTexture('../assets/textures/woodtop.png', bottomCircle, 1);
  topCircle.position.set(position.x,position.y,position.z+cylinderHeight/2);
  bottomCircle.position.set(position.x,position.y,position.z-cylinderHeight/2);
}

function loadTexture(texturePath, object, repeatFactor)
{
  var textureLoader = new THREE.TextureLoader();
  var textureFile  = textureLoader.load(texturePath);
  var wrapModeS  = THREE.RepeatWrapping;
  var wrapModeT  = THREE.RepeatWrapping;
  var minFilter = THREE.LinearFilter;
  var magFilter = THREE.LinearFilter;

  object.material.map = textureFile;
  object.material.map.repeat.set(repeatFactor,repeatFactor);
  object.material.map.wrapS = wrapModeS;
  object.material.map.wrapT = wrapModeT;
  object.material.map.minFilter = minFilter;
  object.material.map.magFilter = magFilter;
}

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );


createCylinderBody();
render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}