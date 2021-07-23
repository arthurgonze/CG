AFRAME.registerComponent('detect-markers-handler', {
  init: function () {
    // Solution for Getting Entities.
    var sceneEl = document.querySelector('a-scene'); 
    console.log(sceneEl);
    var hiro = document.querySelector('#HIRO'); 
    var kanji = document.querySelector('#KANJI'); 

    var a = document.querySelector('#A'); 
    var b = document.querySelector('#B'); 
    var c = document.querySelector('#C'); 
    var d = document.querySelector('#D'); 
    var g = document.querySelector('#G'); 
    var f = document.querySelector('#F'); 
    
    var tronco_00 = document.createElement('a-cylinder');
      tronco_00.setAttribute('position', {x: 0, y: 0, z: 0});
      tronco_00.setAttribute('geometry', {primitive: 'cylinder', height: 1.25/2, radius: 1.25/4});
      tronco_00.setAttribute('material', 'transparent', true);
      tronco_00.setAttribute('material', 'opacity', 0.5);
      tronco_00.setAttribute('shadow', "cast", "true");
      tronco_00.setAttribute('material', 'color', "red");
    var tronco_01 = document.createElement('a-cylinder');
      tronco_01.setAttribute('position', {x: 0, y: 0, z: 0});
      tronco_01.setAttribute('geometry', {primitive: 'cylinder', height: 1.25/2, radius: 1.25/4});
      tronco_01.setAttribute('material', 'transparent', true);
      tronco_01.setAttribute('material', 'opacity', 0.5);
      tronco_01.setAttribute('shadow', "cast", "true");
      tronco_01.setAttribute('material', 'color', "green");
    var tronco_02 = document.createElement('a-cylinder');
      tronco_02.setAttribute('position', {x: 0, y: 0, z: 0});
      tronco_02.setAttribute('geometry', {primitive: 'cylinder', height: 1.25/2, radius: 1.25/4});
      tronco_02.setAttribute('material', 'transparent', true);
      tronco_02.setAttribute('material', 'opacity', 0.5);
      tronco_02.setAttribute('shadow', "cast", "true");
      tronco_02.setAttribute('material', 'color', "blue");
    var tronco_03 = document.createElement('a-cylinder');
      tronco_03.setAttribute('position', {x: 0, y: 0, z: 0});
      tronco_03.setAttribute('geometry', {primitive: 'cylinder', height: 1.25/2, radius: 1.25/4});
      tronco_03.setAttribute('material', 'transparent', true);
      tronco_03.setAttribute('material', 'opacity', 0.5);
      tronco_03.setAttribute('shadow', "cast", "true");
      tronco_03.setAttribute('material', 'color', "yellow");
    var tronco_04 = document.createElement('a-cylinder');
      tronco_04.setAttribute('position', {x: 0, y: 0, z: 0});
      tronco_04.setAttribute('geometry', {primitive: 'cylinder', height: 1.25/2, radius: 1.25/4});
      tronco_04.setAttribute('material', 'transparent', true);
      tronco_04.setAttribute('material', 'opacity', 0.5);
      tronco_04.setAttribute('shadow', "cast", "true");
      tronco_04.setAttribute('material', 'color', "cyan");
    var tronco_05 = document.createElement('a-cylinder');
      tronco_05.setAttribute('position', {x: 0, y: 0, z: 0});
      tronco_05.setAttribute('geometry', {primitive: 'cylinder', height: 1.25/2, radius: 1.25/4});
      tronco_05.setAttribute('material', 'transparent', true);
      tronco_05.setAttribute('material', 'opacity', 0.5);
      tronco_05.setAttribute('shadow', "cast", "true");
      tronco_05.setAttribute('material', 'color', "magenta");
    
    tronco_00.setAttribute('visible',false);
    tronco_01.setAttribute('visible',false);
    tronco_02.setAttribute('visible',false);
    tronco_03.setAttribute('visible',false);
    tronco_04.setAttribute('visible',false);
    tronco_05.setAttribute('visible',false);
    a.appendChild(tronco_00);
    b.appendChild(tronco_01);
    c.appendChild(tronco_02);
    d.appendChild(tronco_03);
    f.appendChild(tronco_04);
    g.appendChild(tronco_05);

    var caixa = document.createElement('a-box');
    var gZ =  g.object3D.position.z;
    var bZ =  b.object3D.position.z;
    var bX =  b.object3D.position.x;
    var newZ = (bZ+gZ)/2;
    caixa.setAttribute('position', {x: bX, y: 0, z: newZ});
    caixa.setAttribute('scale', {x: 2, y: 3, z: 0.5});
    caixa.setAttribute('rotation', {x: 70, y: 180, z: 145});
    caixa.setAttribute('geometry', {primitive: 'box'});
    caixa.setAttribute('material', 'transparent', true);
    caixa.setAttribute('material', 'opacity', 0.75);
    caixa.setAttribute('shadow', "cast", "true");
    caixa.setAttribute('material', 'color', "black");
    sceneEl.appendChild(caixa);
    
    caixa.setAttribute('visible',false);

    sceneEl.addEventListener("markerFound", (e) => {
      // cubo.isVisible = true;
      console.log("DETECTOU QUE ENTROU");
      // a.getAttribute("position","x")
      if(hiro.getAttribute('visible'))
      {
        console.log("DETECTOU HIRO");
        tronco_00.setAttribute('visible', {x: 0, y: 0, z: 0});
        tronco_01.setAttribute('visible', true);
        tronco_02.setAttribute('visible', true);
        tronco_03.setAttribute('visible', true);
        tronco_04.setAttribute('visible', true);
        tronco_05.setAttribute('visible', true);
      }else if(kanji.getAttribute('visible'))
      {
          var gZ =  g.object3D.position.z;
          var bZ =  b.object3D.position.z;
          var bX =  b.object3D.position.x;
          var newZ = (bZ+gZ)/2;
          if(a.getAttribute('visible'))
          {
            caixa.setAttribute('visible', true);
            caixa.setAttribute('position', {x: bX, y: 0, z: newZ});
            // caixa.setAttribute('position', {x: a.object3D.position.x, y: a.object3D.position.y, z: a.object3D.position.z});
          }
          else if(b.getAttribute('visible'))
          {
            caixa.setAttribute('visible', true);
            caixa.setAttribute('position', {x: bX, y: 0, z: newZ});
            // caixa.setAttribute('position', {x: b.object3D.position.x, y: b.object3D.position.y, z: b.object3D.position.z});
          }
          else if(c.getAttribute('visible'))
          {
            caixa.setAttribute('visible', true);
            caixa.setAttribute('position', {x: bX, y: 0, z: newZ});
            // caixa.setAttribute('position', {x: c.object3D.position.x, y: c.object3D.position.y, z: c.object3D.position.z});
          }
          else if(d.getAttribute('visible'))
          {
            caixa.setAttribute('visible', true);
            caixa.setAttribute('position', {x: bX, y: 0, z: newZ});
            // caixa.setAttribute('position', {x: d.object3D.position.x, y: d.object3D.position.y, z: d.object3D.position.z});
          }
          else if(f.getAttribute('visible'))
          {
            caixa.setAttribute('visible', true);
            caixa.setAttribute('position', {x: bX, y: 0, z: newZ});
            // caixa.setAttribute('position', {x: f.object3D.position.x, y: f.object3D.position.y, z: f.object3D.position.z});
          }
          else if(g.getAttribute('visible'))
          {
            caixa.setAttribute('visible', true);
            caixa.setAttribute('position', {x: bX, y: 0, z: newZ});
            // caixa.setAttribute('position', {x: g.object3D.position.x, g: a.object3D.position.y, g: a.object3D.position.z});
          }else
          {
            caixa.setAttribute('visible', false);
          }
      }
      else{
        tronco_00.setAttribute('visible', false);
        tronco_01.setAttribute('visible', false);
        tronco_02.setAttribute('visible', false);
        tronco_03.setAttribute('visible', false);
        tronco_04.setAttribute('visible', false);
        tronco_05.setAttribute('visible', false);
        caixa.setAttribute('visible', false);
      }
      
    });

    sceneEl.addEventListener("markerLost", (e) => {
      console.log("DETECTOU QUE SAIU");
      if(!hiro.getAttribute('visible'))
      {
        tronco_00.setAttribute('visible', false);
        tronco_01.setAttribute('visible', false);
        tronco_02.setAttribute('visible', false);
        tronco_03.setAttribute('visible', false);
        tronco_04.setAttribute('visible', false);
        tronco_05.setAttribute('visible', false);
      }
      if(!kanji.getAttribute('visible'))
      {
        caixa.setAttribute('visible', false);
      }
      if(kanji.getAttribute('visible') && 
      !a.getAttribute('visible')  && 
      !b.getAttribute('visible') && 
      !c.getAttribute('visible') && 
      !d.getAttribute('visible') && 
      !f.getAttribute('visible') && 
      !g.getAttribute('visible'))
      {
        caixa.setAttribute('visible', false);
      }
    });
  }
});
