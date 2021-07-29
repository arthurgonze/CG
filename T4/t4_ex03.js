//-- IMPORTS ------------------------------------------------------------------------------------------------
import * as THREE from '../build/three.module.js';
import { VRButton } from '../build/jsm/webxr/VRButton.js';
import { onWindowResize,
    degreesToRadians,
    createGroundPlane,
    getMaxSize} from "../libs/util/util.js";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'

//-- GLOBAL VARIABLES ------------------------------------------------------------------------------------------------
// core
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });

// view and interactions
let raycaster = new THREE.Raycaster();	// Raycaster to enable selection and dragging
var camera;
var rectile;
let controller1 = renderer.xr.getController( 0 ); // get the input from controller

// objects
const intersected = [];	// will be used to help controlling the intersected objects
let bars = new THREE.Group();
let statueBase = new THREE.Group();
let controls = [];
var leftBarMin,leftBarMax;
var bottomBarMin,bottomBarMax;

//-- PROGRAM LOOP ------------------------------------------------------------------------------------------------
init();
createScene();
animate();


function init()
{
    //-- Setting renderer ---------------------------------------------------------------------------
	renderer.setClearColor(new THREE.Color("rgb(199, 235, 223)"));
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.xr.enabled = true;
	renderer.xr.setReferenceSpaceType( 'local' );

    //-- Append renderer and create VR button -------------------------------------------------------
    document.body.appendChild( renderer.domElement );
    document.body.appendChild( VRButton.createButton( renderer ) );
    window.addEventListener( 'resize', onWindowResize );

    //-- Setting scene and camera -------------------------------------------------------------------
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const cameraHolder = new THREE.Object3D();
	cameraHolder.position.set(0.0, 2, 0);
    // cameraHolder.rotateY(degreesToRadians(180));
	cameraHolder.add (camera);
    scene.add( cameraHolder );

    // controllers
    controller1.addEventListener( 'selectstart', onSelectStart );
    controller1.addEventListener( 'selectend', onSelectEnd );
    scene.add( controller1 );

    // VR Camera Rectile 
    var ringGeo = new THREE.RingGeometry( .04, .08, 32 );
    var ringMat = new THREE.MeshBasicMaterial( {
        color:"rgb(255,255,0)", 
        opacity: 0.9, 
        transparent: true } );
    rectile = new THREE.Mesh( ringGeo, ringMat );
        rectile.position.set(0, 0, -2);
        camera.add( rectile );
}

//-- CREATE FUNCTIONS ------------------------------------------------------------------------------------------------
function createScene()
{
    createSceneLight();
    createCenario();
    createStatue();
    createLeftBar();
    createBottomBar();
    // scene.add(bars);
    // scene.add(controls);
    console.log(controls);
}

function importGLTF(modelPath, modelName, initialPosition, initialRotation, initialScale)
{
    var loader = new GLTFLoader( );
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
        statueBase.children[0].add(obj);
        return obj;
    }, null, null);
}

function createStatue()
{
    // Create Ground Plane
    scene.add(statueBase);
    var circleGeometry = new THREE.CircleGeometry( 2, 32 );
    var circleMaterial = new THREE.MeshLambertMaterial({color:"rgb(100,100,100)", side:THREE.DoubleSide});
    var circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.translateX(0);
    circle.translateY(0.2);
    circle.translateZ(-6);
    circle.rotateX(degreesToRadians(0));
    circle.rotateY(degreesToRadians(0));
    circle.rotateZ(degreesToRadians(0));
    circle.receiveShadow = true;
    circle.rotateX(degreesToRadians(-90));
    statueBase.add(circle);


    var path = "./assets/models/gltfs/la_renommee_louvre/"
    var name = "scene.gltf"
    var scale = 4;
    var pos = new THREE.Vector3(0, 0, 0);
    var rotation = new THREE.Vector3(90, 0, 0);
    var obj = importGLTF(path, name, pos, rotation, scale);
    
    // statueBase.children[0].add(statue);
}

function createBottomBar()
{
    var barGeometry = new THREE.PlaneGeometry(1.5, 0.05, 100, 100);
    var barMaterial = new THREE.MeshLambertMaterial({color:"rgb(255,0,0)", side:THREE.DoubleSide});
    var bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.translateX(0);
    bar.translateY(1);
    bar.translateZ(-2);
    bars.add(bar);
    scene.add(bar);

    var bottomControllerGeometry = new THREE.CircleGeometry( 0.075, 32 );
    var bottomControllerMaterial = new THREE.MeshLambertMaterial({color:"rgb(100,100,100)", side:THREE.DoubleSide});
    var bottomController = new THREE.Mesh(bottomControllerGeometry, bottomControllerMaterial);
    bottomController.translateX(0);
    bottomController.translateY(1);
    bottomController.translateZ(-1.999);
    
    // bar.add(bottomController);
    bottomController.name = "bottom";
    controls.push(bottomController);
    scene.add(bottomController);

    var bottomLimits = new THREE.Box3().setFromObject( bar );
    bottomController.position.x = bottomLimits.min.x*0.97;
    bottomBarMin = new THREE.Vector3(bottomLimits.min.x*0.97, 1, -1.999);
    bottomBarMax = new THREE.Vector3(bottomLimits.max.x*0.97, 1, -1.999);

    

    bottomController.userData.limit = {
        min: bottomBarMin,
        max: bottomBarMax
    };
    bottomController.userData.update = function(){
        bottomController.position.clamp(bottomController.userData.limit.min, bottomController.userData.limit.max);
        bottomController.rotation.x = 0;
        bottomController.rotation.y = 0;
        bottomController.rotation.z = 0;
        // rotateStatue();
    }
}

function createLeftBar()
{
    var barGeometry = new THREE.PlaneGeometry(1.5, 0.05, 100, 100);
    var barMaterial = new THREE.MeshLambertMaterial({color:"rgb(255,0,0)", side:THREE.DoubleSide});
    var bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.translateX(-1);
    bar.translateY(2);
    bar.translateZ(-2);
    bar.rotateZ(degreesToRadians(-90));
    bars.add(bar);
    scene.add(bar);

    var leftControllerGeometry = new THREE.CircleGeometry( 0.075, 32 );
    var leftControllerMaterial = new THREE.MeshLambertMaterial({color:"rgb(100,100,100)", side:THREE.DoubleSide});
    var leftController = new THREE.Mesh(leftControllerGeometry, leftControllerMaterial);
    leftController.translateX(-1);
    leftController.translateY(2);
    leftController.translateZ(-1.999);
    leftController.rotateZ(degreesToRadians(-90));
    leftController.name = "left";
    controls.push(leftController);
    scene.add(leftController);

    var leftLimits = new THREE.Box3().setFromObject( bar );
    leftController.position.y = 0.5*((leftLimits.max.y*0.97)+(leftLimits.min.y*0.97));
    leftBarMin = new THREE.Vector3(-1, leftLimits.min.y*0.97, -1.999);
    leftBarMax = new THREE.Vector3(-1, leftLimits.max.y*0.97, -1.999);
    var scale = (0.5*2)+0.1;
    statueBase.children[0].scale.x = scale;
    statueBase.children[0].scale.y = scale;
    statueBase.children[0].scale.z = scale;

    leftController.userData.limit = {
        min: leftBarMin,
        max: leftBarMax
    };
    leftController.userData.update = function(){
        leftController.position.clamp(leftController.userData.limit.min, leftController.userData.limit.max);
        leftController.rotation.x = 0;
        leftController.rotation.y = 0;
        leftController.rotation.z = 0;  
    }
}


function createCenario()
{
    // Create Ground Plane
    var planeGeometry = new THREE.PlaneGeometry(60, 60, 100, 100);
    var planeMaterial = new THREE.MeshLambertMaterial({color:"rgb(200,200,200)", side:THREE.DoubleSide});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotateX(degreesToRadians(-90));
    scene.add(plane);
}

function createSceneLight()
{
    const light = new THREE.AmbientLight( 0xffffff, 1); // soft white light 404040
    scene.add( light );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.75 );
    directionalLight.translateZ(2);
    // directionalLight.translateY(0);
    directionalLight.translateX(-2);
    directionalLight.castShadow = true;
    // directionalLight.target = ;
    scene.add( directionalLight );
}

//-- UTILS ------------------------------------------------------------------------------------------------
// Normalize scale and multiple by the newScale
function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function rotateStatue()
{
    var maxAngle = 360;
    var minAngle = 0;

    var bottomControlPos = controls[1].position.x;
    if(bottomControlPos>bottomBarMax.x)
    {
        bottomControlPos=bottomBarMax.x;
    }
    if(bottomControlPos<bottomBarMin.x)
    {
        bottomControlPos=bottomBarMin.x;
    }
    var percent = (Math.abs(bottomControlPos - bottomBarMin.x))/(Math.abs(bottomBarMax.x-bottomBarMin.x));


    // console.log("Percent Rotation: "+ percent);
    var angle = percent*maxAngle;
    // console.log("Angle: "+ angle);
    statueBase.children[0].rotation.z = degreesToRadians(angle);
}

function scaleStatue()
{
    var maxScale = 2;
    var minScale = 0.1;

    var leftControlPos = controls[0].position.y;
    // console.log("LeftControlPos: " + leftControlPos);
    if(leftControlPos > leftBarMax.y)
    {
        leftControlPos = leftBarMax.y;
    }
    if(leftControlPos < leftBarMin.y)
    {
        leftControlPos = leftBarMin.y;
    }

    var percent = (Math.abs(leftControlPos - leftBarMin.y))/(Math.abs(leftBarMax.y-leftBarMin.y));

    // console.log("Percent Scale: "+ percent);
    var scale = (percent*maxScale)+minScale;
    // console.log("Scale: "+ scale);
    statueBase.children[0].scale.x = scale;
    statueBase.children[0].scale.y = scale;
    statueBase.children[0].scale.z = scale;
}

function zeroControlPos(index)
{
    controls[index].position.x = 0;
    controls[index].position.y = 0;
    controls[index].position.z = 0;
}
//-- MAIN LOOP ------------------------------------------------------------------------------------------------
function animate() {
	renderer.setAnimationLoop( render );
}

function render()
{
    cleanIntersected();
	intersectObjects( controller1 );
    controls.forEach(o => {
        o.userData.update();
    })
	renderer.render( scene, camera );
}
//-- INTERSECTIONS ------------------------------------------------------------------------------------------------
function onSelectStart( event ) {
    console.log("SelectStart");
	const controller = event.target;
	const intersections = getIntersections( camera );

	if ( intersections.length > 0) {
		const intersection = intersections[ 0 ];
		const object = intersection.object;
		object.material.emissive.b = 1;
        controller.userData.selected = object;
		rectile.attach( object );
	}
}

function onSelectEnd( event ) {
	const controller = event.target;
	if ( controller.userData.selected !== undefined ) {
		const object = controller.userData.selected;
		object.material.emissive.b = 0;
		scene.attach( object );
		controller.userData.selected = undefined;
	}
    scaleStatue();
    rotateStatue();
}

function getIntersections( controller ) {
	const tempMatrix = new THREE.Matrix4();	
	tempMatrix.identity().extractRotation( controller.matrixWorld );
	raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
	raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );
    var intersections = raycaster.intersectObjects( controls, true);
	return intersections;
}

function intersectObjects( controller ) {
	if ( controller.userData.selected !== undefined ) return;

	const intersections = getIntersections(camera);

	if ( intersections.length > 0 ) {
        var intersection;
        intersection = intersections[ 0 ];
		const object = intersection.object;
		object.material.emissive.r = 1;
		intersected.push( object );
	} 
}

function cleanIntersected() {
	while ( intersected.length ) {
		const object = intersected.pop();
		object.material.emissive.r = 0;
	}
}


