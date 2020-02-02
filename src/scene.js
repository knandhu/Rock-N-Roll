// import * as THREE from 'three';


// var worldRadius = 26;
// var pathAngleValues = [1.52, 1.57, 1.62];
// var treesPool = [];
// var rollingGroundSphere;
// var heroSphere;
// var rollingSpeed = 0.008;
// var heroRollingSpeed;
// var worldRadius = 26;
// var heroRadius = 0.2;
// var heroBaseY = 0.8;
// var bounceValue = 0.1;
// var gravity = 0.005;
// var leftLane = -1;
// var rightLane = 1;
// var middleLane = 0;
// var currentLane;
// var clock;
// var jumping;
// var treeReleaseInterval = 0.5;
// var lastTreeReleaseTime = 0;
// var treesInPath = [];
// var particleGeometry;
// var particleCount = 20;
// var explosionPower = 1.06;
// var particles;
// //var stats;
// var scoreText;
// var score;
// var hasCollided;



// var height = 1200;
// var width = 1000;


// function rock() {
//    var scene = new THREE.Scene();

//    //camera
//    var camera = new THREE.PerspectiveCamera(60, height / width, 0.1, 100000);

//    clock = new THREE.Clock();
//    clock.start();
//    heroRollingSpeed = (rollingSpeed * worldRadius) / heroRadius / 5;

//    //WebGL renderer
//    var renderer = new THREE.WebGLRenderer({
//      alpha: true
//      //   antialias: true
//    });
//    renderer.shadowMap.enabled = true;
//    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//    renderer.setSize(height * 0.9, width * 0.7);
//    renderer.setClearColor(0xfffafa, 1);

//    // getting DOM container
//    var dom = document.getElementById("canvas");
//    dom.appendChild(renderer.domElement);
//   var sphereGeometry = new THREE.DodecahedronGeometry(heroRadius, 1);
//   var sphereMaterial = new THREE.MeshStandardMaterial({
//     color: 0xe5f2f2,
//     shading: THREE.FlatShading
//   });
//   jumping = false;
//   heroSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//   heroSphere.receiveShadow = true;
//   heroSphere.castShadow = true;
//   scene.add(heroSphere);

//   //moving rock
//   heroSphere.position.y = heroBaseY;
//   heroSphere.position.z = 4.8;
//   currentLane = middleLane;
//   heroSphere.position.x = currentLane;

//   camera.position.z = 6.5;
//   camera.position.y = 2.5;
//   camera.position.x = 2.5;
// }

// export default rock;