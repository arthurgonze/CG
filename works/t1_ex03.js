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

// create the ground plane
var planeSize = 20.0;
var planeXposition = 0.0;
var planeYposition = 0.0;

var planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
planeGeometry.translate(planeXposition, planeYposition, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);


var i,j;
var lado = planeSize/5;
var xInicial = (planeXposition-(planeSize/2)+(lado/2));
var yInicial = (planeYposition-(planeSize/2)+(lado/2));
var xAtual = xInicial;
var yAtual = yInicial;
for(i = 1; i <= 3; i++)
{
  xAtual = xInicial;
  for(j = 1; j <= 3; j++)
  {
    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(lado, lado, lado);
    var cubeMaterial = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // position the cube
    cube.position.set(xAtual, yAtual, lado/2);
    // add the cube to the scene
    scene.add(cube);
    xAtual = xInicial+j*(lado*2);
  }
  yAtual = yInicial+i*(lado*2);
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

render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}