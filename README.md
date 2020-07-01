# Rock-N-Roll

[Live Game](https://knandhu.github.io/dist/)

# Table of Contents

  1.Introduction
  
  2.Features
  
  3.Technologies

  4.Future Enhancements

# Introduction
  
   Rock-N-Roll, is a 3D game with Rock moving on the mountainside with trees as obstacles. 
Controller to move the rock left/right makes the player to use and not to hit the trees to continue the game. It's an endless loop game and the collision detects the end of the game.

  
# Features

* 3D scene of a stage with sliding Rock, mountain environment with trees
* User interaction to move the rock left, right and jump
* Game over logic based on collision of rock with tree.

## Adding trees

```
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
```

## To create HeroSphere

```
function rock() {

  var sphereGeometry = new THREE.DodecahedronGeometry(heroRadius, 1);
  var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xe5f2f2,
    flatShading: THREE.FlatShading,
  });
  jumping = false;
  heroSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  setTimeout(function () {
    // heroSphere.material.emissive.setRGB(255, 0, 0);
  }, 100);
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
```

 ![gamePlay](./readme/rock_roll.png)
  
# Technologies

* Three.js


# Future Enhancements

* Implement more levels
* User to select on the environment to play the game, mountain with rain, fog effects


