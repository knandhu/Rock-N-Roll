
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

  export default handleKeyDown;

