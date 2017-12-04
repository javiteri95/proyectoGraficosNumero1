
/*
Intento de replicacion del tutorial de internet, hay cosas q fallan

*/




// Se necesitan 3 cosas esenciales: un escenario (scene), una cámara (camera) y un renderizador (renderer)
var scene, renderer, camera;
var objects = [];

var sbVertexShader = [
"varying vec3 vWorldPosition;",
"void main() {",
"  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
"  vWorldPosition = worldPosition.xyz;",
"  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
"}",
].join("\n");

var sbFragmentShader = [
"uniform vec3 topColor;",
"uniform vec3 bottomColor;",
"uniform float offset;",
"uniform float exponent;",
"varying vec3 vWorldPosition;",
"void main() {",
"  float h = normalize( vWorldPosition + offset ).y;",
"  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );",
"}",
].join("\n");

var raycaster = new THREE.Raycaster();
var selection
var offset = new THREE.Vector3();
var plane, controls;
var clock, stats;

function init(){

	scene = new THREE.Scene();
	var fog = new THREE.FogExp2(0xcce0ff, 0.0003);

	// Instanciamos el renderizador. Nos permitirá construir el escenario junto a las figuras que le hayamos agregado.
	renderer = new THREE.WebGLRenderer({ antialias:true });
	// Para configurar el renderizador debemos indicar por lo menos el alto y ancho al que queremos que renderice la app, y luego añadirlo al DOM.
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(fog);
	$('body').append(renderer.domElement);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

  THREEx.WindowResize(renderer, camera);


  window.addEventListener('mousedown', onDocumentMouseDown, false);
  window.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('mouseup', onDocumentMouseUp, false);


	camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.set(-35, 20, 30);
	camera.lookAt(scene.position);

		// La librería OrbitControls nos permite añadir al canvas controles de movimiento, para desplazar la cámara en una órbita alrededor del escenario.
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
  controls.target = new THREE.Vector3(0, 0, 0);
	controls.minDistance = 20;
	controls.maxDistance = 500;
	controls.enablePan = false;

		    // Add lights
  scene.add( new THREE.AmbientLight(0x444444));
  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(200, 200, 1000).normalize();
  camera.add(dirLight);
  camera.add(dirLight.target);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '50px';
  stats.domElement.style.bottom = '300px';
  stats.domElement.style.zIndex = 1;
  $('body').append(stats.domElement);

  clock = new THREE.Clock();



  skyBox();

    	// Plane, that helps to determinate an intersection position
	plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), 
   	new THREE.MeshBasicMaterial( {
       color: 0x248f24, alphaTest: 0, visible: false
	}));
	scene.add(plane);

    // Add 100 random objects (spheres)
	var object, material, radius;
	var objGeometry = new THREE.SphereGeometry(1, 24, 24);
	for (var i = 0; i < 50; i++) {
	  material = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff});
	  material.transparent = true;
	  object = new THREE.Mesh(objGeometry.clone(), material);
	  objects.push(object);
	  radius = Math.random() * 4 + 2;
	  object.scale.x = radius;
	  object.scale.y = radius;
	  object.scale.z = radius;
	  object.position.x = Math.random() * 50 - 25;
	  object.position.y = Math.random() * 50 - 25;
	  object.position.z = Math.random() * 50 - 25;
	  scene.add(object);
	}











}

	// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}
// Update controls and stats

function update() {
  var delta = clock.getDelta();
  controls.update(delta);
  stats.update();
}

function render() {
	renderer.render(scene, camera);
}


function skyBox(){
  var iSBrsize = 500;
  var uniforms = {
    topColor: {type: "c", value: new THREE.Color(0x0077ff)}, bottomColor: {type: "c", value: new THREE.Color(0xffffff)},
    offset: {type: "f", value: iSBrsize}, exponent: {type: "f", value: 1.5}
  }
  var skyGeo = new THREE.SphereGeometry(iSBrsize, 32, 32);
  skyMat = new THREE.ShaderMaterial({vertexShader: sbVertexShader, fragmentShader: sbFragmentShader, uniforms: uniforms, side: THREE.DoubleSide, fog: false});
  skyMesh = new THREE.Mesh(skyGeo, skyMat);
  scene.add(skyMesh);
}

function onDocumentMouseDown(event){
	  // Get mouse position
    console.log("evento down activado");
  var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  var vector = new THREE.Vector3(mouseX, mouseY, 1);
  raycaster.setFromCamera( vector.clone(), camera );
  // Find all intersected objects
  var intersects = raycaster.intersectObjects(objects);
  //console.log(intersects);
  if (intersects.length > 0) {
    // Disable the controls
    controls.enabled = false;
    // Set the selection - first intersected object
    selection = intersects[0].object;
    // Calculate the offset
    var intersects = raycaster.intersectObject(plane);
    offset.copy(intersects[0].point).sub(plane.position);
  }

}

function onDocumentMouseMove(event){
  event.preventDefault();
  console.log("evento move activado");
  // Get mouse position
  var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  var vector = new THREE.Vector3(mouseX, mouseY, 1);
  raycaster.setFromCamera( vector.clone(), camera );
  if (selection) {
    // Check the position where the plane is intersected
    var intersects = raycaster.intersectObject(plane);
    // Reposition the object based on the intersection point with the plane
    selection.position.copy(intersects[0].point.sub(offset));
  } else {
    // Update position of the plane if need
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      plane.position.copy(intersects[0].object.position);
      plane.lookAt(camera.position);
    }
  }
}

function onDocumentMouseUp(event){
	//Enable the controls
  console.log("evento up activado");
  controls.enabled = true;
  selection = null;
}

init();
animate();