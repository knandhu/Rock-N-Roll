import * as THREE from "three";
import win_logic from './game_logic';
// const PORT = process.env.PORT || 5000;
// http.createServer(onRequest).listen(process.env.PORT || 6000);
var worldRadius = 26;
var pathAngleValues = [1.52, 1.57, 1.62];
var treesPool = [];
var rollingGroundSphere;
var heroSphere;
var rollingSpeed = 0.008;
var heroRollingSpeed;
var worldRadius = 26;
var heroRadius = 0.2;
var heroBaseY = 1.9;
var bounceValue = 0.1;
var gravity = 0.005;
var leftLane = -1;
var rightLane = 1;
var middleLane = 0;
var currentLane;
var clock;
var jumping;
var treeReleaseInterval = 0.5;
var lastTreeReleaseTime = 0;
var treesInPath = [];
var particleGeometry;
var particleCount = 20;
var explosionPower = 1.06;
var particles;
var GameId;
//var stats;
var scoreText;
var score = 0;
var hasCollided;
//scene creation
var sceneHeight;
var sceneWidth;
var height = 1000;
var width = 1000;
var scene = new THREE.Scene();

//camera
var camera = new THREE.PerspectiveCamera(60, height / width, 0.1, 100000);

clock = new THREE.Clock();
clock.start();
heroRollingSpeed = (rollingSpeed * worldRadius) / heroRadius / 5;

//WebGL renderer
var renderer = new THREE.WebGLRenderer({
  alpha: true
  //   antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(height * 0.9, width * 0.7);
renderer.setClearColor(0xfffafa, 1);

// getting DOM container
var dom = document.getElementById("canvas");
var scoreBoard = document.getElementById("score");
dom.appendChild(renderer.domElement);

rock();
sunLight();
createTreesPool();

var sphericalHelper = new THREE.Spherical();
addWorld();

addExplosion();

update();

// window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  //resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}

document.onkeydown = handleKeyDown;
scoreText = document.createElement("div");
scoreText.style.position = "fixed";
scoreText.style.zIndex = 1; // if you still don't see the label, try uncommenting this
scoreText.style.width = 100;
scoreText.style.height = 100;
//scoreText.style.backgroundColor = "blue";
scoreText.innerHTML = "0";
scoreText.style.top = 295 + "px";
scoreText.style.left = 25 + "%";
// document.body.appendChild(scoreText);
scoreBoard.appendChild(scoreText);

function addExplosion() {
  particleGeometry = new THREE.Geometry();
  for (var i = 0; i < particleCount; i++) {
    var vertex = new THREE.Vector3();
    particleGeometry.vertices.push(vertex);
  }
  var pMaterial = new THREE.ParticleBasicMaterial({
    color: 0xfffafa,
    size: 0.2
  });
  particles = new THREE.Points(particleGeometry, pMaterial);
  scene.add(particles);
  particles.visible = false;
}

function addPathTree() {
  var options = [0, 1, 2];
  var lane = Math.floor(Math.random() * 3);
  addTree(true, lane);
  options.splice(lane, 1);
  if (Math.random() > 0.5) {
    lane = Math.floor(Math.random() * 2);
    addTree(true, options[lane]);
  }
}

//Rock
function rock() {
  var sphereGeometry = new THREE.DodecahedronGeometry(heroRadius, 1);
  var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xe5f2f2,
    shading: THREE.FlatShading
  });
  jumping = false;
  heroSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  heroSphere.receiveShadow = true;
  heroSphere.castShadow = true;
  scene.add(heroSphere);

  //moving rock
  heroSphere.position.y = 6.8;
  heroSphere.position.z = 2.8;
  currentLane = middleLane;
  heroSphere.position.x = currentLane;

  camera.position.z = 7.5;
  camera.position.y = 2.5;
  camera.position.x = 0.5;
}

//Fog environment
scene.fog = new THREE.FogExp2(0xf0fff0, 0.14);

//environment Sunlight effect
function sunLight() {
  var hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
  scene.add(hemisphereLight);
  var sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
  sun.position.set(12, 6, -7);
  sun.castShadow = true;
  scene.add(sun);
}

//create tree

function createTree() {
  var sides = 8;
  var tiers = 6;
  var scalarMultiplier = Math.random() * (0.25 - 0.1) + 0.05;
  var midPointVector = new THREE.Vector3();
  var vertexVector = new THREE.Vector3();
  var treeGeometry = new THREE.ConeGeometry(0.5, 1, sides, tiers);
  var treeMaterial = new THREE.MeshStandardMaterial({
    color: 0x33ff33,
    shading: THREE.FlatShading
  });
  var offset;
  midPointVector = treeGeometry.vertices[0].clone();
  var currentTier = 0;
  var vertexIndex;
  blowUpTree(treeGeometry.vertices, sides, 0, scalarMultiplier);
  tightenTree(treeGeometry.vertices, sides, 1);
  blowUpTree(treeGeometry.vertices, sides, 2, scalarMultiplier * 1.1, true);
  tightenTree(treeGeometry.vertices, sides, 3);
  blowUpTree(treeGeometry.vertices, sides, 4, scalarMultiplier * 1.2);
  tightenTree(treeGeometry.vertices, sides, 5);
  var treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
  treeTop.castShadow = true;
  treeTop.receiveShadow = false;
  treeTop.position.y = 0.9;
  treeTop.rotation.y = Math.random() * Math.PI;
  var treeTrunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
  var trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x886633,
    shading: THREE.FlatShading
  });
  var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
  treeTrunk.position.y = 0.25;
  var tree = new THREE.Object3D();
  tree.add(treeTrunk);
  tree.add(treeTop);
  return tree;
}

function blowUpTree(vertices, sides, currentTier, scalarMultiplier, odd) {
  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var midPointVector = vertices[0].clone();
  var offset;
  for (var i = 0; i < sides; i++) {
    vertexIndex = currentTier * sides + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    if (odd) {
      if (i % 2 === 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y =
          vertices[i + vertexIndex + sides].y + 0.05;
      }
    } else {
      if (i % 2 !== 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y =
          vertices[i + vertexIndex + sides].y + 0.05;
      }
    }
  }
}
function tightenTree(vertices, sides, currentTier) {
  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var midPointVector = vertices[0].clone();
  var offset;
  for (var i = 0; i < sides; i++) {
    vertexIndex = currentTier * sides + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    offset.normalize().multiplyScalar(0.06);
    vertices[i + vertexIndex].sub(offset);
  }
}

// // create an AudioListener and add it to the camera
// var listener = new THREE.AudioListener();
// camera.add( listener );

// // create a global audio source
// var sound = new THREE.Audio( listener );

// // load a sound and set it as the Audio object's buffer
// var audioLoader = new THREE.AudioLoader();
// audioLoader.load("sounds/beltHandle1.ogg", function(buffer) {
//   sound.setBuffer(buffer);
//   sound.setLoop(true);
//   sound.setVolume(0.5);
//   sound.play();
// });

function addWorld() {
  var sides = 40;
  var tiers = 40;
  var sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
  var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xfffafa,
    shading: THREE.FlatShading
  });

  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var nextVertexVector = new THREE.Vector3();
  var firstVertexVector = new THREE.Vector3();
  var offset = new THREE.Vector3();
  var currentTier = 1;
  var lerpValue = 0.5;
  var heightValue;
  var maxHeight = 0.07;
  for (var j = 1; j < tiers - 2; j++) {
    currentTier = j;
    for (var i = 0; i < sides; i++) {
      vertexIndex = currentTier * sides + 1;
      vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
      if (j % 2 !== 0) {
        if (i == 0) {
          firstVertexVector = vertexVector.clone();
        }
        nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
        if (i == sides - 1) {
          nextVertexVector = firstVertexVector;
        }
        lerpValue = Math.random() * (0.75 - 0.25) + 0.25;
        vertexVector.lerp(nextVertexVector, lerpValue);
      }
      heightValue = Math.random() * maxHeight - maxHeight / 2;
      offset = vertexVector
        .clone()
        .normalize()
        .multiplyScalar(heightValue);
      sphereGeometry.vertices[i + vertexIndex] = vertexVector.add(offset);
    }
  }
  rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  rollingGroundSphere.receiveShadow = true;
  rollingGroundSphere.castShadow = false;
  rollingGroundSphere.rotation.z = -Math.PI / 2;
  scene.add(rollingGroundSphere);
  rollingGroundSphere.position.y = -24;
  rollingGroundSphere.position.z = 2;
  addWorldTrees();
}

function addWorldTrees() {
  var numTrees = 36;
  var gap = 6.28 / 36;
  for (var i = 0; i < numTrees; i++) {
    addTree(false, i * gap, true);
    addTree(false, i * gap, false);
  }
}
function addTree(inPath, row, isLeft) {
  var newTree;
  if (inPath) {
    if (treesPool.length == 0) return;
    newTree = treesPool.pop();
    newTree.visible = true;
    //console.log("add tree");
    treesInPath.push(newTree);
    sphericalHelper.set(
      worldRadius - 0.3,
      pathAngleValues[row],
      -rollingGroundSphere.rotation.x + 4
    );
  } else {
    newTree = createTree();
    var forestAreaAngle = 0; //[1.52,1.57,1.62];
    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTree.position.setFromSpherical(sphericalHelper);
  var rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  var treeVector = newTree.position.clone().normalize();
  newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
  newTree.rotation.x += Math.random() * ((2 * Math.PI) / 10) + -Math.PI / 10;

  rollingGroundSphere.add(newTree);
}

function createTreesPool() {
  var maxTreesInPool = 10;
  var newTree;
  for (var i = 0; i < maxTreesInPool; i++) {
    newTree = createTree();
    treesPool.push(newTree);
  }
}

function update() {
  rollingGroundSphere.rotation.x += rollingSpeed;
  heroSphere.rotation.x -= heroRollingSpeed;
  if (heroSphere.position.y <= heroBaseY) {
    jumping = false;
    bounceValue = Math.random() * 0.04 + 0.005;
  }
  heroSphere.position.y += bounceValue;
  heroSphere.position.x = THREE.Math.lerp(
    heroSphere.position.x,
    currentLane,
    2 * clock.getDelta()
  ); //clock.getElapsedTime());
  bounceValue -= gravity;
  // console.log(clock.getElapsedTime());
  if (clock.getElapsedTime() > treeReleaseInterval) {
    clock.start();
    addPathTree();
    // if (!hasCollided) {
    //   score += 2 * treeReleaseInterval;
    //   scoreText.innerHTML = score.toString();
    // }
  }
  doTreeLogic();
  doExplosionLogic();
  // var startGame = true;
  //   var start = document.getElementById("start");
  // start.onclick = function startAnimation() {
  //   if(startGame) {
  //        render();
  //   }
  // }
   render();
    if (score < 50) {
      GameId = requestAnimationFrame(update);
    } else {
      GameId = requestAnimationFrame(update);
      cancelAnimationFrame(GameId);
      alert("Congrats! Level 1 completed!");
    }

   //request next update
}

function doTreeLogic() {
  var oneTree;
  var treePos = new THREE.Vector3();
  var treesToRemove = [];
  treesInPath.forEach(function(element, index) {
    oneTree = treesInPath[index];
    treePos.setFromMatrixPosition(oneTree.matrixWorld);
    if (treePos.z > 6 && oneTree.visible) {
      //gone out of our view zone
      treesToRemove.push(oneTree);
    } else {
      //check collision
      if (treePos.distanceTo(heroSphere.position) <= 0.6) {
        // console.log("hit");
        hasCollided = true;
        score += 1;
        // win_logic(score, GameId);
        scoreText.innerHTML = (score.toString());
        explode();
      }
    }
  });
  var fromWhere;
  treesToRemove.forEach(function(element, index) {
    oneTree = treesToRemove[index];
    fromWhere = treesInPath.indexOf(oneTree);
    treesInPath.splice(fromWhere, 1);
    treesPool.push(oneTree);
    oneTree.visible = false;
    // console.log("remove tree");
  });
}
function doExplosionLogic() {
  if (!particles.visible) return;
  for (var i = 0; i < particleCount; i++) {
    particleGeometry.vertices[i].multiplyScalar(explosionPower);
  }
  if (explosionPower > 1.005) {
    explosionPower -= 0.001;
  } else {
    particles.visible = false;
  }
  particleGeometry.verticesNeedUpdate = true;
}
function explode() {
  particles.position.y = 2;
  particles.position.z = 4.8;
  particles.position.x = heroSphere.position.x;
  for (var i = 0; i < particleCount; i++) {
    var vertex = new THREE.Vector3();
    vertex.x = -0.2 + Math.random() * 0.4;
    vertex.y = -0.2 + Math.random() * 0.4;
    vertex.z = -0.2 + Math.random() * 0.4;
    particleGeometry.vertices[i] = vertex;
  }
  explosionPower = 1.07;
  particles.visible = true;
}

function render() {
  renderer.render(scene, camera); //draw
}

function handleKeyDown(keyEvent) {
  if (jumping) return;
  var validMove = true;
  if (keyEvent.keyCode === 37) {
    //left
    if (currentLane == middleLane) {
      currentLane = leftLane;
    } else if (currentLane == rightLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else if (keyEvent.keyCode === 39) {
    //right
    if (currentLane == middleLane) {
      currentLane = rightLane;
    } else if (currentLane == leftLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else {
    if (keyEvent.keyCode === 38) {
      //up, jump
      bounceValue = 0.1;
      jumping = true;
    }
    validMove = false;
  }
  //heroSphere.position.x=currentLane;
  if (validMove) {
    jumping = true;
    bounceValue = 0.06;
  }
}
