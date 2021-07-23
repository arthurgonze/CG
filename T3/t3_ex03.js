AFRAME.registerComponent('planetas', {
    init: function () {
        var sceneEl = document.querySelector('a-scene');
        var kanji = document.querySelector('#KANJI'); 

        var escalaSol = 0.5;
        var escalaVenus = escalaSol/7;
        var escalaTerra = escalaSol/6;
        var escalaMarte = escalaSol/8;
        var escalaJupiter = escalaSol/4;
    
        var posVenus = escalaSol+escalaVenus+(0.25);
        var posTerra = escalaSol+escalaTerra+(0.25*2);
        var posMarte = escalaSol+escalaMarte+(0.25*3);
        var posJupiter = escalaSol+escalaJupiter+(0.25*4);
    
        // 1dia == 24h == 8,64e+7ms(medida do atributo "dur" da animacao)
        // 8,64e+7*0,0001 == 8640 ms ==  8,64s == 0,0024h 
        var earthRotation = 8640;
        var sunRotation = 26.24*earthRotation;
        var venusRotation = -243.02*earthRotation;
        var marsRotation = 1.03*earthRotation;
        var jupiterRotation = 0.41*earthRotation;
    
        // 1 ano == 12 meses == 365,25 dias == 8766h == 31557600000ms
        // 31557600000 * 0,0001 == 3155760ms == 3155,76s == 0,88h == 0,04 dia == 1,2e-3 mes == e-4 ano
        var earthOrbit = 3155.760;//12 meses
        var venusOrbit = 0.583333*earthOrbit;//7 meses
        var marsOrbit = 1.92*earthOrbit;//23 meses
        var jupiterOrbit = 11.83*earthOrbit;//142 meses
    
        // var camera = document.querySelector('#camera');
        // camera.setAttribute('position', {x: 0, y: escalaJupiter*2, z: posJupiter});
        
        var sol = document.querySelector('#sol');
        sol.setAttribute('position', {x: 0, y: 0, z: 0});
        sol.setAttribute('scale', {x: escalaSol, y: escalaSol, z: escalaSol});
        sol.setAttribute("animation", "dur", sunRotation);
        // kanji.appendChild(sol);
    
        var venus = document.querySelector('#venus');
        venus.setAttribute('position', {x: 0, y: 0, z: posVenus});
        venus.setAttribute('scale', {x: escalaVenus, y: escalaVenus, z: escalaVenus});
        venus.setAttribute("animation", "dur", venusRotation);
        // kanji.appendChild(venus);
    
        var terra = document.querySelector('#terra');
        terra.setAttribute('position', {x: 0, y: 0, z: posTerra});
        terra.setAttribute('scale', {x: escalaTerra, y: escalaTerra, z: escalaTerra});
        terra.setAttribute("animation", "dur", earthRotation);
        // kanji.appendChild(terra);
    
        var marte = document.querySelector('#marte');
        marte.setAttribute('position', {x: 0, y: 0, z: posMarte});
        marte.setAttribute('scale', {x: escalaMarte, y: escalaMarte, z: escalaMarte});
        marte.setAttribute("animation", "dur", marsRotation);
        // kanji.appendChild(marte);
    
        var jupiter = document.querySelector('#jupiter');
        jupiter.setAttribute('position', {x: 0, y: 0, z: posJupiter});
        jupiter.setAttribute('scale', {x: escalaJupiter, y: escalaJupiter, z: escalaJupiter});
        jupiter.setAttribute("animation", "dur", jupiterRotation);
        // kanji.appendChild(jupiter);
    
        var venusPivot = document.querySelector('#venus-pivot');
        venusPivot.setAttribute("animation", "dur", venusOrbit);
    
        var terraPivot = document.querySelector('#terra-pivot');
        terraPivot.setAttribute("animation", "dur", earthOrbit);
    
        var martePivot = document.querySelector('#marte-pivot');
        martePivot.setAttribute("animation", "dur", marsOrbit);
    
        var jupiterPivot = document.querySelector('#jupiter-pivot');
        jupiterPivot.setAttribute("animation", "dur", jupiterOrbit);
    }
  });
  