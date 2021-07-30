//-- Imports -------------------------------------------------------------------------------------
import * as THREE from '../build/three.module.js';
import { VRButton } from '../build/jsm/webxr/VRButton.js';
import {onWindowResize,
		degreesToRadians,
		createGroundPlane,
        getMaxSize} from "../libs/util/util.js";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js'
import {DRACOLoader} from '../build/jsm/loaders/DRACOLoader.js'
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js'

//-----------------------------------------------------------------------------------------------
//-- MAIN SCRIPT --------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//--  General globals ---------------------------------------------------------------------------
window.addEventListener( 'resize', onWindowResize );
//-- Renderer settings ---------------------------------------------------------------------------
let renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color("rgb(70, 150, 240)"));
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.xr.enabled = true;
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;

//-- Setting scene and camera -------------------------------------------------------------------
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, .1, 1000 );
let moveCamera; // Move when a button is pressed 

//-- 'Camera Holder' to help moving the camera
const cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0.0, 1.6, 10.0);
// cameraHolder.position.set(20, 1.60, 10);
cameraHolder.add(camera);
scene.add( cameraHolder );
//-- Create VR button and settings ---------------------------------------------------------------
document.body.appendChild( VRButton.createButton( renderer ) );

// controllers
var controller1 = renderer.xr.getController( 0 );
	controller1.addEventListener( 'selectstart', onSelectStart );
	controller1.addEventListener( 'selectend', onSelectEnd );
camera.add( controller1 );

//-- Creating Scene and calling the main loop ----------------------------------------------------
createScene();
animate();

//------------------------------------------------------------------------------------------------
//-- FUNCTIONS -----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
function move()
{
	if(moveCamera)
	{
		// Get Camera Rotation
		let quaternion = new THREE.Quaternion();
		quaternion = camera.quaternion;

		// Get direction to translate from quaternion
		var moveTo = new THREE.Vector3(0, 0, -0.01);
		moveTo.applyQuaternion(quaternion);

		// Move the camera Holder to the computed direction
		cameraHolder.translateX(moveTo.x);
		cameraHolder.translateY(0);
		cameraHolder.translateZ(moveTo.z);	

        
        if( cameraHolder.position.x < 15)
        {
            // check ambiente 1 - exit 1 & 2
            if(cameraHolder.position.z > 3.6 && ((cameraHolder.position.x<-3.5)||(cameraHolder.position.x>3.5)) )
            {
                console.log("Teleport sala 2");
                teleportToScene2();
            }

            // check ambiente 1 - exit 1 & 2
            if(cameraHolder.position.z > 12.4 && ((cameraHolder.position.x<-3.5)||(cameraHolder.position.x>3.5)))
            {
                console.log("Teleport sala 2");
                teleportToScene2();
            }
        }else
        {
            // check ambiente 2
            if(cameraHolder.position.z > 7.4 && cameraHolder.position.x > 23)
            {
                console.log("Teleport sala 1");
                teleportToScene1();
            }
        }
        
        
	}
}

function teleportToScene2()
{
    moveCamera = false;
    cameraHolder.position.set(20, 1.60, 10);
}

function teleportToScene1()
{
    moveCamera = false;
    cameraHolder.position.set(0.0, 1.6, 10.0);
}

function onSelectStart( ) 
{
	moveCamera = true;
}

function onSelectEnd( ) 
{
	moveCamera = false;
    console.log(cameraHolder.position);
}

//-- Main loop -----------------------------------------------------------------------------------
function animate() 
{
	renderer.setAnimationLoop( render );
}

function render() {
	move();
	renderer.render( scene, camera );
}

//------------------------------------------------------------------------------------------------
//-- Scene and auxiliary functions ---------------------------------------------------------------
//------------------------------------------------------------------------------------------------

//-- Create Scene --------------------------------------------------------------------------------
function createScene()
{
    createMuseumAmbient1();
    createMuseumAmbient2();
}

function createSceneLight()
{
    const light = new THREE.AmbientLight( 0xffffff, 1); // soft white light 404040
    scene.add( light );

    // const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.75 );
    // directionalLight.translateZ(2);
    // // directionalLight.translateY(0);
    // directionalLight.translateX(-2);
    // directionalLight.castShadow = true;
    // // directionalLight.target = ;
    // scene.add( directionalLight );
}

function createMuseumAmbient1()
{
    createSceneLight();
    // ambiente 1
    var modelPath = "./assets/models/gltfs/"
    var modelName = "instamuseum_for_geologypage/scene.gltf";
    var initialScale = 10;
    var initialPosition = new THREE.Vector3(0, 3, 8);
    var initialRotation = new THREE.Vector3(0, 0, 0);
    importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale);

    // Create Ground Plane
    var planeGeometry = new THREE.PlaneGeometry(8, 8, 100, 100);
    var planeMaterial = new THREE.MeshLambertMaterial({color:"rgb(0,0,0)", side:THREE.DoubleSide, transparent:true, opacity: 0});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.translateY(2.1);
    plane.translateZ(8);
    plane.rotateX(degreesToRadians(-90));
    plane.name = "ground";
    scene.add(plane);
    

    // ambiente 1 exit
    const geometry = new THREE.BoxGeometry( 1, 2, 1 );
    const material = new THREE.MeshLambertMaterial( {color: 0x00ff00, side:THREE.DoubleSide, transparent:true, opacity: 0} );
    const cube = new THREE.Mesh( geometry, material );
    cube.translateY(3);
    cube.translateX(-3.5);
    cube.translateZ(3.6);
    cube.name = "exit_scene_01";
    scene.add( cube );

    const cube2 = new THREE.Mesh( geometry, material );
    cube2.translateY(3);
    cube2.translateX(3.5);
    cube2.translateZ(3.6);
    cube2.name = "exit_scene_01";
    scene.add( cube2 );

    const cube3 = new THREE.Mesh( geometry, material );
    cube3.translateY(3);
    cube3.translateX(-3.5);
    cube3.translateZ(12.4);
    cube3.name = "exit_scene_01";
    scene.add( cube3 );

    const cube4 = new THREE.Mesh( geometry, material );
    cube4.translateY(3);
    cube4.translateX(3.5);
    cube4.translateZ(12.4);
    cube4.name = "exit_scene_01";
    scene.add( cube4 );

    // ambiente 1 estatua
    modelPath = "./assets/models/gltfs/"
    modelName = "la_renommee_louvre/scene.gltf";
    initialScale = 2;
    initialPosition = new THREE.Vector3(0, 2, 8);
    initialRotation = new THREE.Vector3(0, 0, 0);
    importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale);
}

function createMuseumAmbient2()
{
    // createSceneLight();
    // ambiente 1
    var modelPath = "./assets/models/objs/";
    var mtlName = "chapelle/chapelle-cluny-def-5x8k.mtl";
    var modelName = "chapelle/chapelle-cluny-def-5x8k.obj";
    var initialScale = 10;
    var initialPosition = new THREE.Vector3(20.7, 2.5, 11);
    var initialRotation = new THREE.Vector3(-90, 0, 90); 
    importOBJ(modelPath, modelName, mtlName, initialPosition, initialRotation, initialScale);

    // Create Ground Plane
    modelPath = "./assets/models/gltfs/"
    var planeGeometry = new THREE.PlaneGeometry(10, 10, 100, 100);
    var planeMaterial = new THREE.MeshLambertMaterial({color:"rgb(0,0,0)", side:THREE.DoubleSide, transparent:true, opacity: 0});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.translateY(2.5);
    plane.translateX(20);
    plane.translateZ(10);
    plane.rotateX(degreesToRadians(-90));
    plane.name = "ground";
    scene.add(plane);

    // ambiente 2 exit
    const geometry = new THREE.BoxGeometry( 0.5, 4, 1.5 );
    const material = new THREE.MeshLambertMaterial( {color: 0x00ff00, side:THREE.DoubleSide, transparent:true, opacity: 0} );
    const cube = new THREE.Mesh( geometry, material );
    cube.translateY(4);
    cube.translateX(23.76);
    cube.translateZ(7.7);
    cube.name = "exit_scene_02";
    scene.add( cube );
    
    // statue
    var modelName = "artemis_fountain/scene.gltf";
    initialScale = 2;
    initialPosition = new THREE.Vector3(20, 4.6, 3.5);
    initialRotation = new THREE.Vector3(0, 0, 0);
    importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale);

    // quadro 1
    var modelName = "monalisa/scene.gltf";
    initialScale = 1;
    initialPosition = new THREE.Vector3(18, 3, 14.65);
    initialRotation = new THREE.Vector3(0, 180, 0);
    importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale);

    // quadro 2
    var modelName = "painting_by_zdzislaw_beksinski_2/scene.gltf";
    initialScale = 1;
    initialPosition = new THREE.Vector3(16.65, 3.5, 9.25);
    initialRotation = new THREE.Vector3(0, 0, 0);
    importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale);

    // quadro 3
    var modelName = "painting_by_zdzislaw_beksinski_3/scene.gltf";
    initialScale = 1;
    initialPosition = new THREE.Vector3(16.65, 3.5, 13.75);
    initialRotation = new THREE.Vector3(0, 90, 0);
    importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale);

    // quadro 4
    var modelName = "painting_by_zdzislaw_beksinski_4/scene.gltf";
    initialScale = 1;
    initialPosition = new THREE.Vector3(23.475, 3.5, 10);
    initialRotation = new THREE.Vector3(0, -90, 0);
    importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale);

    // quadro 5
    var modelName = "de_sterrennacht__nit_estelada__the_starry_night/scene.gltf";
    initialScale = 1;
    initialPosition = new THREE.Vector3(23.45, 3.5, 12);
    initialRotation = new THREE.Vector3(0, -90, 0);
    importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale);

    // quadro 6
    var modelName = "abendmahl_jesu/scene.gltf";
    initialScale = 1;
    initialPosition = new THREE.Vector3(15, 5, 14.85);
    initialRotation = new THREE.Vector3(0, 180, 0);
    importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale);
}

//-- UTILS --------------------------------------------------------------------------------------------------------------
function importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale)
{
    var loader = new GLTFLoader( );
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
    loader.setDRACOLoader( dracoLoader )

    loader.load( modelPath + modelName, function ( gltf ) {
        var obj = gltf.scene;

        obj.traverse( function ( child ) {
            if ( child ) { 
                child.castShadow = true; 
                child.receiveShadow = true;
            }
        });

        obj = normalizeAndRescale(obj, initialScale);
        obj.translateX(initialPosition.x);
        obj.translateY(initialPosition.y);
        obj.translateZ(initialPosition.z);
        obj.rotateX(degreesToRadians(initialRotation.x));
        obj.rotateY(degreesToRadians(initialRotation.y));
        obj.rotateZ(degreesToRadians(initialRotation.z));
        scene.add(obj);
        return obj;
    }, function ( xhr ) {

		console.log( "GLTF "+( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	}, function ( error ) {

		console.log( 'An error happened' );

	});
}

function importOBJ(modelPath, modelName, mtlName, initialPosition, initialRotation, initialScale)
{
    var mtlLoader = new MTLLoader( );

    mtlLoader.load( modelPath + mtlName, function ( materials ) {
            materials.preload();

            var objLoader = new OBJLoader();
            objLoader.setMaterials( materials )
            objLoader.load( modelPath + modelName, function ( obj ) {
                    obj = normalizeAndRescale(obj, initialScale);
                    obj.translateX(initialPosition.x);
                    obj.translateY(initialPosition.y);
                    obj.translateZ(initialPosition.z);
                    obj.rotateX(degreesToRadians(initialRotation.x));
                    obj.rotateY(degreesToRadians(initialRotation.y));
                    obj.rotateZ(degreesToRadians(initialRotation.z));
                    scene.add( obj );
                }, function ( xhr ) {

                    console.log( "Obj "+( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                }, function ( error ) {
            
                    console.log( 'An error happened' );
            
                });

        });
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