AFRAME.registerComponent('ambiente-2', {
  init: function () {
    // Solution for Getting Entities.
    var sceneEl = document.querySelector('a-scene'); 
    console.log(sceneEl);

    for (var i = 0; i < 50; i++) {
      var xPos = Math.random() * 50-25;
      var zPos = Math.random() * 50-25;
      var objScale = Math.random() * (4-1)+0.25;
      var tronco = document.createElement('a-cylinder');
      tronco.setAttribute('position', {x: xPos, y: 2.25*objScale, z: zPos});
      tronco.setAttribute('geometry', {
        primitive: 'cylinder',
        height: 4.5,
        radius: 0.15,
      });
      tronco.setAttribute('color', "#9a6565");
      tronco.setAttribute('shadow', "cast", "false");
      tronco.setAttribute('scale', {x: objScale, y: objScale, z: objScale});
      sceneEl.appendChild(tronco);

      var coneBase = document.createElement('a-cone');
      coneBase.setAttribute('position', {x: xPos, y: 2.5*objScale, z: zPos});
      coneBase.setAttribute('geometry', {
        radiusBottom: 1.5,
        radiusTop: 0.1,
        height: 1.5
      });
      coneBase.setAttribute('color', "green" );
      coneBase.setAttribute('shadow', "cast", "false");
      coneBase.setAttribute('scale', {x: objScale, y: objScale, z: objScale});
      sceneEl.appendChild(coneBase);

      var coneMeio = document.createElement('a-cone');
      coneMeio.setAttribute('position', {x: xPos, y: 3.4*objScale, z: zPos});
      coneMeio.setAttribute('geometry', {
        radiusBottom: 1.0,
        radiusTop: 0.1,
        height: 1.5
      });
      coneMeio.setAttribute('color', "green" );
      coneMeio.setAttribute('shadow', "cast", "false");
      coneMeio.setAttribute('scale', {x: objScale, y: objScale, z: objScale});
      sceneEl.appendChild(coneMeio);

      var coneTopo = document.createElement('a-cone');
      coneTopo.setAttribute('position', {x: xPos, y: 4.2*objScale, z: zPos});
      coneTopo.setAttribute('geometry', {
        radiusBottom: 0.75,
        radiusTop: 0.01,
        height: 1.25
      });
      coneTopo.setAttribute('color', "green" );
      coneTopo.setAttribute('shadow', "cast", "false");
      coneTopo.setAttribute('scale', {x: objScale, y: objScale, z: objScale});
      sceneEl.appendChild(coneTopo);
    }
  }
});
