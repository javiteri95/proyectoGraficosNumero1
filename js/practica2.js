// Se necesitan 3 cosas esenciales: un escenario (scene), una cámara (camera) y un renderizador (renderer)
var scene, renderer, camera;

// Si deseamos generar luz, necesitaremos un tipo de luz. Ej: spotLight
// Para poder visualizar al area del cono de luz, podemos usar un 'lightHelper'
var spotLight, lightHelper;

/*
***********************************************************************************
**********             OBJETOS PARA PODER SELECCIONAR UN OBJETO          **********
***********************************************************************************
*/
//de forma sencilla crea una especie de rayo, que es la forma de interactuar del listener con threejs ver : https://soledadpenades.com/articles/three-js-tutorials/object-picking/
var raycaster = new THREE.Raycaster(); // create once
//crea un vector del mouse
var mouseVector = new THREE.Vector2(); // create once

function init () {
	/*
	*****************************************************************************
	**********              ESCENARIO, CAMARA Y RENDERIZADOR           **********
	*****************************************************************************
	*/
	// Instanciamos el escenario. Este va a contener todas las figuras y elementos.
	scene = new THREE.Scene();

	// Instanciamos el renderizador. Nos permitirá construir el escenario junto a las figuras que le hayamos agregado.
	renderer = new THREE.WebGLRenderer();
	// Para configurar el renderizador debemos indicar por lo menos el alto y ancho al que queremos que renderice la app, y luego añadirlo al DOM.
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 1);
	$('#canvas').append(renderer.domElement);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// Instanciamos la cámara. Nos permitirá visualizar el escenario.
	// Podemos escoger entre distintos tipos de camara, cada una con su propia perspectiva (Ej: PerspectiveCamera).
	// El constructor recibe 3 atributos: campo de visión, ratio y límites del plano.
	camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.set(-75, 70, 5);
	camera.lookAt(scene.position);

	/*
	*****************************************************************************
	**********                       CONTROLES                         **********
	*****************************************************************************
	*/
	// La librería OrbitControls nos permite añadir al canvas controles de movimiento, para desplazar la cámara en una órbita alrededor del escenario.
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
	controls.minDistance = 20;
	controls.maxDistance = 500;
	controls.enablePan = false;

	/*
	*****************************************************************************
	**********                          LUZ                            **********
	*****************************************************************************
	*/
	// Existen algunos tipos de luz.
	// La luz de tipo 'SpotLight' se emite desde una determinada dirección y permite generar sombras.
	spotLight = new THREE.SpotLight( 0xffffff, 1 );
	spotLight.position.set(-25, 30, 5);
	// spotLight.angle = Math.PI / 4;
	spotLight.penumbra = 0.05;
	spotLight.decay = 2;
	spotLight.distance = 200;
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 200;
	/*
	spotLight.shadow.mapSize.width = 512;
	spotLight.shadow.mapSize.height = 512;
	spotLight.shadow.camera.near = 0.5;
	spotLight.shadow.camera.far = 500;
	*/
	scene.add(spotLight);
	// También podemos instanciar helpers, que nos permitirán dibujar el área de acción de la luz o la sombra en el escenario
	lightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( lightHelper );
	// shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
	// scene.add( shadowCameraHelper );

	// La luz de tipo 'AmbientLight' ilumina de igual manera a todos los objetos de la escena, pero no genera sombras
	var ambient = new THREE.AmbientLight( 0xffffff, 0.025 );
	scene.add( ambient );

	/*
	*****************************************************************************
	**********                       FIGURAS                           **********
	*****************************************************************************
	*/
	// Para poder crear figuras necesitamos 3 cosas: una geometría, un material y un "mezclador" (Mesh).
	// La geometría le da la forma a la figura. En este caso una "BoxGeometry" para crear un cubo.
	var geometry = new THREE.BoxGeometry(4, 4, 4);
	// El material nos permite especificar texturas y color.
	var material = new THREE.MeshPhongMaterial( {color: 0x00ff00, dithering: true} );
	// El Mesh es un objeto que toma una geometría y le aplica un material.
	var cube = new THREE.Mesh(geometry, material);
	cube.position.set(-2, 2, 0);
	// Podemos habilitar a nuestra figura para que proyecte una sombra
	cube.castShadow = true;
	cube.name = 'active_shape';
	// Posteriormente podemos añadir la figura al escenario.
	scene.add(cube);

	var planeGeometry = new THREE.PlaneGeometry(2000, 2000);
	var planeMaterial = new THREE.MeshPhongMaterial({color : 0xcccccc, dithering: true});
	var plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x = -0.5 * Math.PI;
	plane.position.set(15, 0, 0);
	// También podemos habilitar a las figuras para que reciban la sombra proyectada por otras
	plane.receiveShadow = true;
	scene.add(plane);

	window.addEventListener('resize', onResize, false);
	//hace el click
	window.addEventListener( 'click', onMouseMove, false );
}

// Implementamos una función que permita mantener el tamaño de la escena en al navegador cuando el tamaño de la ventana cambie
function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// Con el renderizador configurado, las figuras añadida al escenario y la cámara configurada, podemos empezar a renderizar.
function render() {
	lightHelper.update();
	// shadowCameraHelper.update();
	renderer.render(scene, camera);
}
//esta funcion es la especial, es la funcion del listener todo lo que esta dentro de aqui . Al hacer click todo lo que esta aqui se ejecuta.
function onMouseMove( e ) {
		//normalizacion, importante ya que la forma de renderizaado del dom es diferente a la webGL, se hace esto
		mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
		mouseVector.y = 1 - 2 * ( e.clientY /  window.innerHeight );

		//se le dice al rayo, cual es su vector origen
		raycaster.setFromCamera( mouseVector, camera );
		//intersects es un arreglo con todo los objetos que el rayo intersecta, dado q esta enlazado elmouse todo los objetos que sean hijos de scene y que atraviese el mouse
		intersects = raycaster.intersectObjects( scene.children );

		console.log(intersects[0].object.geometry.type)
		/*
		scene.children.forEach(function( element ) {
			//scene.material.color.setRGB( cube.grayness, cube.grayness, cube.grayness );
			console.log(element.name);
		});
		*/

		//solo imprimo los objetos que atraviesa, aqui se modificara
		for( var i = 0; i < intersects.length; i++ ) {
			var intersection = intersects[ i ],
				obj = intersection.object;
				console.log(obj);

			
		}
		

		
}
init();
render();
