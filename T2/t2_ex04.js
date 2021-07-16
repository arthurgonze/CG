AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var sceneEl = document.querySelector('a-scene');
    var lastIndex = -1;
    var COLORS = ['red', 'green', 'blue'];

    var player = document.querySelector("a-camera");
    var aim = document.querySelector("#aim");
    var direction = new THREE.Vector3();

    
    sceneEl.addEventListener('click', function (evt) {
      if(evt && evt.detail && evt.detail.intersection && evt.detail.intersection.point)
      {
        aim.setAttribute('material', 'color', COLORS[0]);
        // console.log('I was clicked at: ', evt.detail.intersection.point);

        // get the cameras world direction
        sceneEl.camera.getWorldDirection(direction);
        // multiply the direction by a "speed" factor
        direction.multiplyScalar(0.1);
        // get the current position
        var pos = player.object3D.position;
        // add the direction vector
        pos.add(direction);
        // set the new position
        player.object3D.position.add(direction)
      }
    });

    sceneEl.addEventListener('touchstart', function (evt) {
      if(evt && evt.detail && evt.detail.intersection && evt.detail.intersection.point)
      {
        aim.setAttribute('material', 'color', COLORS[1]);
        // console.log('I was clicked at: ', evt.detail.intersection.point);

        // get the cameras world direction
        sceneEl.camera.getWorldDirection(direction);
        // multiply the direction by a "speed" factor
        direction.multiplyScalar(0.1);
        // get the current position
        var pos = player.object3D.position;
        // add the direction vector
        pos.add(direction);
        // set the new position
        player.object3D.position.add(direction)
      }
    });

    
    sceneEl.addEventListener('buttondown', function (evt) {
      if(evt && evt.detail && evt.detail.intersection && evt.detail.intersection.point)
      {
        aim.setAttribute('material', 'color', COLORS[2]);
        // console.log('I was clicked at: ', evt.detail.intersection.point);

        // get the cameras world direction
        sceneEl.camera.getWorldDirection(direction);
        // multiply the direction by a "speed" factor
        direction.multiplyScalar(0.1);
        // get the current position
        var pos = player.object3D.position;
        // add the direction vector
        pos.add(direction);
        // set the new position
        player.object3D.position.add(direction)
      }
    });
  }
});