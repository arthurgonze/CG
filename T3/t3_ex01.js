import * as THREE from  '../build/three.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {ARjs}    from  '../libs/AR/ar.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../build/jsm/loaders/DRACOLoader.js';
import {InfoBox,
		initDefaultSpotlight} from "../libs/util/util.js";

var renderer	= new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize( 720, 480 );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
	// to read from the webcam
	sourceType : 'webcam',

	// to read from an image
	//sourceType : 'image',
	//sourceUrl : '../assets/AR/kanjiScene.jpg',

	// to read from a video
	// sourceType : 'video',
	// sourceUrl : '../assets/AR/kanjiScene.mp4'
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
// Adding object to the scene
// Optional: Provide a DRACOLoader instance to decode compressed mesh data
let patternArray = ["kanji", "hiro"];
for (let i = 0; i < 2; i++)
{
	let markerRoot = new THREE.Group();
	scene.add(markerRoot);
	let markerControls = new ARjs.MarkerControls(arToolkitContext, markerRoot, {
		type : 'pattern', patternUrl : "../libs/AR/data/patt." + patternArray[i],
	});

	if(i == 0)
	{
		loadGLTFObject('./assets/Gltfs/sauron/scene.gltf', markerRoot)
		var floorGeometry = new THREE.PlaneGeometry( 20,20 );
		var floorMaterial = new THREE.ShadowMaterial();
		floorMaterial.opacity = 1;
		var floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );
		floorMesh.rotation.x = -Math.PI/2;
		floorMesh.receiveShadow = true;
		scene.add( floorMesh );
	}else
	{
		var lightPosition = new THREE.Vector3(0, 1, 0);
		var lightColor = "rgb(255, 255, 255)";
		var pointLight = new THREE.PointLight(lightColor);
		setPointLight(markerRoot, lightPosition, pointLight);
		createColoredLightSphere(markerRoot, 0.05, 10, 10, lightPosition, lightColor);
		pointLight.intensity = 2;
	}
}

function loadGLTFObject(path, markerRoot)
{
	const loader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath( '../libs/other/draco/' );
	loader.setDRACOLoader( dracoLoader );
	// Load a glTF resource
	loader.load(path, 
		function ( gltf ) {
			markerRoot.add(gltf.scene);
			gltf.animations; // Array<THREE.AnimationClip>
			gltf.scene; // THREE.Group
			gltf.scenes; // Array<THREE.Group>
			gltf.cameras; // Array<THREE.Camera>
			gltf.asset; // Object
			gltf.scene.scale.set(0.005,0.005,0.005,);},
		function ( xhr ) {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
		function ( error ) {console.log( 'An error happened' );}
	);
}

function setPointLight(markerRoot, position, pointLight)
{
	pointLight.position.copy(position);
	pointLight.shadow.mapSize.width = 512;
  	pointLight.shadow.mapSize.height = 512;
//   spotLight.angle = degreesToRadians(40);    
	pointLight.castShadow = true;
	pointLight.decay = 2;
	pointLight.penumbra = 0.5;
	pointLight.name = "Spot Light"

  	markerRoot.add(pointLight);
}

function degreesToRadians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function createColoredLightSphere(marker, radius, widthSegments, heightSegments, position, color)
{
  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
  var material = new THREE.MeshBasicMaterial({color:color});
  var object = new THREE.Mesh(geometry, material);
    object.visible = true;
    object.position.copy(position);
    marker.add(object);
}

var controls = new function (){};
var gui = new GUI();

onRenderFcts.push(function(){
	renderer.render( scene, camera );
})

function showInformation()
{
	// Use this to show information onscreen
	controls = new InfoBox();
		controls.add("Put the 'KANJI' & 'Hiro' markers in front of the camera.");
		controls.show();
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
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(deltaMsec/1000, nowMsec/1000)
	})
})
