AFRAME.registerComponent('ambiente-3', {
  init: function () {
    var sceneEl = document.querySelector('a-scene');

    // Medidas em Km
    var distanciaVenus = 108200000;
    var distanciaTerra = 149600000;
    var distanciaMarte = 227940000;
    var distanciaJupiter = 778330000;

    var tamanhoSol = 1390000;
    var tamanhoVenus = 12103.6;
    var tamanhoTerra = 12756.2;
    var tamanhoMarte = 6794.4;
    var tamanhoJupiter = 142984;

    var posVenus = (distanciaVenus/distanciaTerra)*75;
    var posTerra = (distanciaTerra/distanciaTerra)*75;
    var posMarte = (distanciaMarte/distanciaTerra)*75;
    var posJupiter = (distanciaJupiter/distanciaTerra)*75;

    var escalaSol = (tamanhoSol/distanciaTerra)*750;
    var escalaVenus = (tamanhoVenus/distanciaTerra)*750;
    var escalaTerra = (tamanhoTerra/distanciaTerra)*750;
    var escalaMarte = (tamanhoMarte/distanciaTerra)*750;
    var escalaJupiter = (tamanhoJupiter/distanciaTerra)*750;

    // 1dia == 24h == 8,64e+7ms(medida do atributo "dur" da animacao)
    // 8,64e+7*0,0001 == 8640 ms ==  8,64s == 0,0024h 
    var earthRotation = 8640;
    var sunRotation = 26.24*earthRotation;
    var venusRotation = -243.02*earthRotation;
    var marsRotation = 1.03*earthRotation;
    var jupiterRotation = 0.41*earthRotation;

    // 1 ano == 12 meses == 365,25 dias == 8766h == 31557600000ms
    // 31557600000 * 0,0001 == 3155760ms == 3155,76s == 0,88h == 0,04 dia == 1,2e-3 mes == e-4 ano
    var earthOrbit = 3155760;//12 meses
    var venusOrbit = 0.583333*earthRotation;//7 meses
    var marsOrbit = 1.92*earthRotation;//23 meses
    var jupiterOrbit = 11.83*earthRotation;//142 meses

    var camera = document.querySelector('#camera');
    camera.setAttribute('position', {x: 0, y: escalaJupiter*2, z: posJupiter});
    
    var sol = document.querySelector('#sol');
    sol.setAttribute('position', {x: 0, y: 0, z: 0});
    sol.setAttribute('scale', {x: escalaSol, y: escalaSol, z: escalaSol});
    sol.setAttribute("animation", "dur", sunRotation);

    var venus = document.querySelector('#venus');
    venus.setAttribute('position', {x: 0, y: 0, z: posVenus});
    venus.setAttribute('scale', {x: escalaVenus, y: escalaVenus, z: escalaVenus});
    venus.setAttribute("animation", "dur", venusRotation);

    var terra = document.querySelector('#terra');
    terra.setAttribute('position', {x: 0, y: 0, z: posTerra});
    terra.setAttribute('scale', {x: escalaTerra, y: escalaTerra, z: escalaTerra});
    terra.setAttribute("animation", "dur", earthRotation);

    var marte = document.querySelector('#marte');
    marte.setAttribute('position', {x: 0, y: 0, z: posMarte});
    marte.setAttribute('scale', {x: escalaMarte, y: escalaMarte, z: escalaMarte});
    marte.setAttribute("animation", "dur", marsRotation);

    var jupiter = document.querySelector('#jupiter');
    jupiter.setAttribute('position', {x: 0, y: 0, z: posJupiter});
    jupiter.setAttribute('scale', {x: escalaJupiter, y: escalaJupiter, z: escalaJupiter});
    jupiter.setAttribute("animation", "dur", jupiterRotation);

    var venusPivot = document.querySelector('#venus-pivot');
    venusPivot.setAttribute("animation", "dur", venusOrbit);

    var terraPivot = document.querySelector('#terra-pivot');
    terraPivot.setAttribute("animation", "dur", earthOrbit);

    var martePivot = document.querySelector('#marte-pivot');
    martePivot.setAttribute("animation", "dur", marsOrbit);

    var jupiterPivot = document.querySelector('#jupiter-pivot');
    jupiterPivot.setAttribute("animation", "dur", jupiterOrbit);

    var cameraPivot = document.querySelector('#camera-pivot');
    cameraPivot.setAttribute("animation", "dur", jupiterOrbit);
  }
});
