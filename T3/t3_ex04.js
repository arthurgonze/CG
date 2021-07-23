import * as THREE from  '../build/three.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {ARjs}    from  '../libs/AR/ar.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../build/jsm/loaders/DRACOLoader.js';
import {InfoBox,
		initDefaultSpotlight,
		getMaxSize,} from "../libs/util/util.js";


var renderer	= new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize( 1920, 1080 );
document.body.appendChild( renderer.domElement );
// init scene and camera
var scene	= new THREE.Scene();
var camera = new THREE.Camera();
scene.add(camera);

// array of functions for the rendering loop
var onRenderFcts= [];

// Show text information onscreen
showInformation();

//----------------------------------------------------------------------------
// Handle arToolkitSource
var arToolkitSource = new ARjs.Source({	
	sourceType : 'webcam',
})

arToolkitSource.init(function onReady(){
	setTimeout(() => {
		onResize()
	}, 2000);
})

// handle resize
window.addEventListener('resize', function(){
	onResize()
})

function onResize(){
	arToolkitSource.onResizeElement()
	arToolkitSource.copyElementSizeTo(renderer.domElement)
	if( arToolkitContext.arController !== null ){
		arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
	}
}

//----------------------------------------------------------------------------
// initialize arToolkitContext
var arToolkitContext = new ARjs.Context({
	cameraParametersUrl: '../libs/AR/data/camera_para.dat',
	detectionMode: 'mono',
})

// initialize it
arToolkitContext.init(function onCompleted(){
	// copy projection matrix to camera
	camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
})

// update artoolkit on every frame
onRenderFcts.push(function(){
	if( arToolkitSource.ready === false )	return
	arToolkitContext.update( arToolkitSource.domElement )
	// update scene.visible if the marker is seen
	scene.visible = camera.visible
})

//----------------------------------------------------------------------------
// Create a ArMarkerControls

// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

////////////////////////////////////////////////////////////
// setup markerRoots
////////////////////////////////////////////////////////////
var markerNames, markerArray, currentMarkerName;


markerNames = ["a", "b", "c", "d", "f", "g"];
markerArray = [];
	
for (let i = 0; i < markerNames.length; i++)
{
	let marker = new THREE.Group();
	scene.add(marker);
	markerArray.push(marker);

	var markerControls = new ARjs.MarkerControls(arToolkitContext, camera, {	
		type : 'pattern',
		patternUrl : './assets/Marcadores/patt.' + markerNames[i],
		changeMatrixMode: 'cameraTransformMatrix' // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
	})
	
	let markerGroup = new THREE.Group();
	marker.add(markerGroup);
}
//----------------------------------------------------------------------------
var playAction = true;
var mixer = new Array();
////////////////////////////////////////////////////////////
// setup scene
////////////////////////////////////////////////////////////
// var objectArray = new Array();
var objeto1 = new THREE.Group();
var objeto2 = new THREE.Group();
var objeto3 = new THREE.Group();
var objeto4 = new THREE.Group();
var objeto5 = new THREE.Group();
var objeto6 = new THREE.Group();
loadGLTFObject('./assets/Gltfs/sauron/scene.gltf', true, 1, objeto1);
loadGLTFObject('./assets/Gltfs/r2d2_-_star_wars/scene.gltf', true, 1, objeto2);
loadGLTFObject('./assets/Gltfs/witch_king/scene.gltf', true, 1, objeto3);
loadGLTFObject('./assets/Gltfs/x-wing/scene.gltf', true, 1, objeto4);
loadGLTFObject('./assets/Gltfs/yoda_rig/scene.gltf', true, 1, objeto5);
loadGLTFObject('./assets/Gltfs/la_renommee_louvre/scene.gltf', true, 1, objeto6);

var activeObject = 0;
// sceneGroup.add(objectArray[0]); 
// markerArray[0].children[0].add( sceneGroup );
// currentMarkerName = markerNames[0];

let pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
camera.add( pointLight );


function loadGLTFObject(path, visibility, desiredScale, group)
{
	const loader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath( '../libs/other/draco/' );
	loader.setDRACOLoader( dracoLoader );
	// Load a glTF resource
	loader.load(path, 
		function ( gltf ) {
			var obj = gltf.scene;
			gltf.animations; // Array<THREE.AnimationClip>
			var obj = gltf.scene; // THREE.Group
			gltf.scenes; // Array<THREE.Group>
			gltf.cameras; // Array<THREE.Camera>
			gltf.asset; // Object
			obj.traverse( function ( child ) {
			if ( child ) {
				child.castShadow = true;
			}
			});
			obj.traverse( function( node )
			{
			if( node.material ) node.material.side = THREE.DoubleSide;
			});

			obj = normalizeAndRescale(obj, desiredScale);
			group.add( obj );
			markerArray[0].children[0].add( group );
			group.visible = false;
			scene.add(group);
		},
		function ( xhr ) {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
		function ( error ) {console.log( 'An error happened' );}
	);
}

// Normalize scale and multiple by the newScale
function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

var controls = new function ()
{
	this.active = 0;
	this.onChooseObject = function()
    {
		activeObject = this.active;
    };
};

// GUI interface
var gui = new GUI();
gui.add(controls, 'active',
  	[0, 1, 2, 3, 4, 5])
    .name("Change Object")
    .onChange(function(e) { controls.onChooseObject(); });

//----------------------------------------------------------------------------
// Render the whole thing on the page
// render the scene
onRenderFcts.push(function(){
	renderer.render( scene, camera );
})

function createTorus()
{
	var light = initDefaultSpotlight(scene, new THREE.Vector3(25, 30, 20)); // Use default light
	var geometry = new THREE.TorusGeometry(0.6, 0.2, 20, 20, Math.PI * 2);
	var objectMaterial = new THREE.MeshPhongMaterial({
		color:"rgb(255,0,0)",     // Main color of the object
		shininess:"200",            // Shininess of the object
		specular:"rgb(255,255,255)" // Color of the specular component
	});
	var object = new THREE.Mesh(geometry, objectMaterial);
		object.position.set(0.0, 0.2, 0.0);
		object.rotation.x = Math.PI/2;

	torus.add(object);
	torus.visible = false;
}

function createCubeKnot()
{
	var geometry	= new THREE.BoxGeometry(1,1,1);
	var material	= new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.5,
		side: THREE.DoubleSide
	});
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= geometry.parameters.height/2
	cubeKnot.add( mesh );

	var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);
	var material	= new THREE.MeshNormalMaterial();
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	cubeKnot.add( mesh );

	onRenderFcts.push(function(delta){
		mesh.rotation.x += Math.PI*delta
	})
}

function showInformation()
{
	// Use this to show information onscreen
	controls = new InfoBox();
		controls.add("T3 - Ex04");
		controls.addParagraph();
		controls.add("Put the 'MULTI' marker in front of the camera.");
		controls.show();
}

function update()
{
	objeto1.visible = false;
	objeto2.visible = false;
	objeto3.visible = false;
	objeto4.visible = false;
	objeto5.visible = false;
	objeto5.visible = false;

	let lerpAmount = 0.5;
	
	for(var i=0; i<6; i++)
	{
		var someVisible = false;
		if(markerArray[i].visible){
			if(i == 0  && activeObject == 0)
			{
				objeto1.visible = true;
				let p = markerArray[i].children[0].getWorldPosition();
				let q = markerArray[i].children[0].getWorldQuaternion();
				let s = markerArray[i].children[0].getWorldScale();
				
				objeto1.position.lerp(p, lerpAmount);
				objeto1.quaternion.slerp(q, lerpAmount);
				objeto1.scale.lerp(s, lerpAmount);
			}
			if(i == 1 && activeObject == 1)
			{
				objeto2.visible = true;
				let p = markerArray[i].children[0].getWorldPosition();
				let q = markerArray[i].children[0].getWorldQuaternion();
				let s = markerArray[i].children[0].getWorldScale();
				
				objeto2.position.lerp(p, lerpAmount);
				objeto2.quaternion.slerp(q, lerpAmount);
				objeto2.scale.lerp(s, lerpAmount);
			}
			if(i == 2 && activeObject == 2)
			{
				objeto3.visible = true;
				let p = markerArray[i].children[0].getWorldPosition();
				let q = markerArray[i].children[0].getWorldQuaternion();
				let s = markerArray[i].children[0].getWorldScale();
				
				objeto3.position.lerp(p, lerpAmount);
				objeto3.quaternion.slerp(q, lerpAmount);
				objeto3.scale.lerp(s, lerpAmount);
			}
			if(i == 3 && activeObject == 3)
			{
				objeto4.visible = true;
				let p = markerArray[i].children[0].getWorldPosition();
				let q = markerArray[i].children[0].getWorldQuaternion();
				let s = markerArray[i].children[0].getWorldScale();
				
				objeto4.position.lerp(p, lerpAmount);
				objeto4.quaternion.slerp(q, lerpAmount);
				objeto4.scale.lerp(s, lerpAmount);
			}
			if(i == 4 && activeObject == 4)
			{
				objeto5.visible = true;
				let p = markerArray[i].children[0].getWorldPosition();
				let q = markerArray[i].children[0].getWorldQuaternion();
				let s = markerArray[i].children[0].getWorldScale();
				
				objeto5.position.lerp(p, lerpAmount);
				objeto5.quaternion.slerp(q, lerpAmount);
				objeto5			}
			if(i == 5 && activeObject == 5)
			{
				objeto6.visible = true;
				let p = markerArray[i].children[0].getWorldPosition();
				let q = markerArray[i].children[0].getWorldQuaternion();
				let s = markerArray[i].children[0].getWorldScale();
				
				objeto6.position.lerp(p, lerpAmount);
				objeto6.quaternion.slerp(q, lerpAmount);
				objeto6.scale.lerp(s, lerpAmount);
			}
		 }
	}
}
// run the rendering loop
requestAnimationFrame(function animate(nowMsec)
{
	var lastTimeMsec= null;	
	// keep looping
	requestAnimationFrame( animate );
	// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec
	// call each update function
	update();
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(deltaMsec/1000, nowMsec/1000)
	})
})
