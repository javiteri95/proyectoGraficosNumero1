// Se necesitan 3 cosas esenciales: un escenario (scene), una cámara (camera) y un renderizador (renderer)
var scene, renderer, camera;

// Si deseamos generar luz, necesitaremos un tipo de luz. Ej: spotLight
// Para poder visualizar al area del cono de luz, podemos usar un 'lightHelper'
var spotLight, lightHelper;

/*
***********************************************************************************
**********               SELECCION DE OBJETOS - PROYECCIONES             **********
***********************************************************************************
*/
// Para determinar qué objetos se encuentran debajo del mouse, "lanzamos un rayo" desde la posición del mouse hacia el espacio 3D en la misma dirección de la cámara
// Se necesitan dos objetos clave: un vector para el mouse y un raycaster para "lanzar los rayos"
var mouseVector = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

//esta lista es la lista de objetos a los q se le puede hacer drag and drop
var intersectedObjects = [];
var dragControls, controls;



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

	// También podemos añadir los ejes de coordenadas al escenario
	var sceneAxis = new THREE.AxisHelper(100);
	scene.add(sceneAxis);

	// Instanciamos la cámara. Nos permitirá visualizar el escenario.
	// Podemos escoger entre distintos tipos de camara, cada una con su propia perspectiva (Ej: PerspectiveCamera).
	// El constructor recibe 3 atributos: campo de visión, ratio y límites del plano.
	camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.set(-35, 20, 30);
	camera.lookAt(scene.position);

	/*
	*****************************************************************************
	**********                       CONTROLES                         **********
	*****************************************************************************
	*/
	// La librería OrbitControls nos permite añadir al canvas controles de movimiento, para desplazar la cámara en una órbita alrededor del escenario.
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
	controls.minDistance = 20;
	controls.maxDistance = 500;
	controls.enablePan = true;
	

	// De manera similar, hay otras librerías para manejar controles de movimiento
	/*var controls = new THREE.TrackballControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];*/

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
	var cube_geometry = new THREE.BoxGeometry(4, 4, 4);
	// El material nos permite especificar texturas y color.
	var cube_material = new THREE.MeshPhongMaterial( {color: 0x00ff00, dithering: true} );
	// El Mesh es un objeto que toma una geometría y le aplica un material.
	var cube = new THREE.Mesh(cube_geometry, cube_material);
	cube.position.set(0, 2, 0);
	// Podemos habilitar a nuestra figura para que proyecte una sombra
	cube.castShadow = true;
	cube.name = 'active_shape';

	intersectedObjects.push(cube);
	// Posteriormente podemos añadir la figura al escenario.
	scene.add(cube);



	var sphere_geometry = new THREE.SphereGeometry(4,20,20);
	var sphere_material = new THREE.MeshPhongMaterial({color: 0x00ff00, dithering: true});
	var sphere = new THREE.Mesh(sphere_geometry, sphere_material);
	sphere.position.set(20, 4, 0);
	sphere.castShadow = true;
	var sphereAxis = new THREE.AxisHelper(10);
	sphere.add(sphereAxis);
	intersectedObjects.push(sphere);
	scene.add(sphere);

	var cylinder_geometry = new THREE.CylinderGeometry(5,5,10, 30);
	var cylinder_material = new THREE.MeshPhongMaterial({color: 0x00ff00, dithering: true});
	var cylinder = new THREE.Mesh(cylinder_geometry, cylinder_material);
	cylinder.position.set(-20, 5, 0);
	cylinder.castShadow = true;
	var cylinderAxis = new THREE.AxisHelper(10);
	cylinder.add(cylinderAxis);
	intersectedObjects.push(cylinder);
	scene.add(cylinder);

	var pyramid_geometry = new THREE.CylinderGeometry(0, 5, 10, 4, false);
	var pyramid_material = new THREE.MeshPhongMaterial({color: 0x00ff00, dithering: true});
	var pyramid = new THREE.Mesh(pyramid_geometry, pyramid_material);
	pyramid.position.set(0,5,20);
	pyramid.castShadow = true;
	var pyramidAxis = new THREE.AxisHelper(10);
	pyramid.add(pyramidAxis);
	intersectedObjects.push(pyramid);
	scene.add(pyramid);

	var torus_geometry = new THREE.TorusGeometry(5, 2, 16, 100);
	var torus_material = new THREE.MeshPhongMaterial({color: 0x00ff00, dithering: true});
	var torus = new THREE.Mesh(torus_geometry, torus_material);
	torus.position.set(0,6,-20);
	torus.castShadow = true;
	var torusAxis = new THREE.AxisHelper(10);
	torus.add(torusAxis);
	intersectedObjects.push(torus);
	scene.add(torus);

	var planeGeometry = new THREE.PlaneGeometry(2000, 2000);
	var planeMaterial = new THREE.MeshPhongMaterial({color : 0xcccccc, dithering: true});
	var plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x = -0.5 * Math.PI;
	plane.position.set(15, 0, 0);
	// También podemos habilitar a las figuras para que reciban la sombra proyectada por otras
	plane.receiveShadow = true;
	scene.add(plane);

/*
**********************************************************
Esto se encarga del drag and drop
**********************************************************

*/
	dragControls = new THREE.DragControls(intersectedObjects , camera, renderer.domElement );
	dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
	dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

/**/
	window.addEventListener('resize', onResize, false);
	window.addEventListener( 'click', onMouseClick, false );
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


function animate() {

	requestAnimationFrame( animate );

	render();

}

// Esta es la función que vamos a ejecutar para realizar el picking al dar click con el mouse
function onMouseClick( e ) {
	// Las coordenadas del mouse están dadas en base a su posición en la pantalla, por lo que debemos convertirlas a sus respectivas coordenadas en un plano cartesiano
	mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
	mouseVector.y = 1 - 2 * ( e.clientY /  window.innerHeight );

	// Determinamos el punto de origen del rayo
	raycaster.setFromCamera( mouseVector.clone(), camera );

	// Luego obtenemos todos los objetos que el rayo intersecta. Esto lo hacemos en la forma de un arreglo en el cual se enlaza el vector del mouse a todo los objetos que sean hijos de scene y que sean atravesados por este
	intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {
		if (intersects[0].object.geometry.type != 'PlaneGeometry' && intersects[0].object.geometry.type != 'BufferGeometry') {
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					scene.children[i].name = ''

					var geometry = intersects[0].object.geometry.type;
					var text = '';
					switch(geometry) {
						case 'SphereGeometry':
							text = 'Esfera';
							break;
						case 'BoxGeometry':
							text = 'Cubo';
							break;
						case 'CylinderGeometry':
							if (intersects[0].object.geometry.parameters.radiusTop  == 0) {
								text = 'Pirámide';
							} else {
								text = 'Cilindro';
							}
							break;
						case 'TorusGeometry':
							text = 'Toroide';
							break;
					}
					$('.active_shape').html(text);

					
				}
			}
			intersects[ 0 ].object.name = 'active_shape';
			render();
		}
	}
}

function deform(figura, constantes){
	//var correctnessMatrix  = new THREE.Matrix4();
	var matrix = new THREE.Matrix4();
	//constantes = [Syx, Szx , Sxy , Szy , Sxz , Syz]
/*
	if (previousDeformationConstants != null){
		correctnessMatrix.set(1,
		previousDeformationConstants[0],
		previousDeformationConstants[1],
		0,
		previousDeformationConstants[2],
		1,
		previousDeformationConstants[3],
		0,
		previousDeformationConstants[4], 
		previousDeformationConstants[5],
		1,
		0,
		0,
		0,
		0,
		1);

		figura.geometry.applyMatrix( correctnessMatrix);

	}

	*/
	
	
	matrix.set(1,
		constantes[0],
		constantes[1],
		0,
		constantes[2],
		1,
		constantes[3],
		0,
		constantes[4], 
		constantes[5],
		1,
		0,
		0,
		0,
		0,
		1);

	



	/*********************************************************************


	Basicamente creo una nueva instancia de la figura para trabajar con eso, borro la que estaba, y creo una igual


	************************************************************************/
	
	scene.remove(figura);
	var index = intersectedObjects.indexOf(figura);

	if (index > -1) {
		 intersectedObjects.splice(index, 1);
	}
	var tipoFigura = figura.geometry.type;
	switch (tipoFigura){
		case  "BoxGeometry":
				var geometriaDeformar = new THREE.BoxGeometry(4, 4, 4); 
				break;
		case  "SphereGeometry":
				var geometriaDeformar = new THREE.SphereGeometry(4,20,20);

				break
		case  "TorusGeometry":
				var geometriaDeformar = new THREE.TorusGeometry(5, 2, 16, 100);

				break;

		case  "CylinderGeometry":
				if (figura.geometry.parameters.radiusTop  == 0){
					var geometriaDeformar = new THREE.CylinderGeometry(0, 5, 10, 4, false);

				}else{
					var geometriaDeformar = new THREE.CylinderGeometry(5,5,10, 30);

				}
				break;
	}
	var materialDeformar = figura.material.clone();
	var posicionDeformacionX = figura.position.x
	var posicionDeformacionY = figura.position.y
	var posicionDeformacionZ = figura.position.z
	var figuraCopiarDeformar = new THREE.Mesh(geometriaDeformar, materialDeformar);
	figuraCopiarDeformar.position.set(posicionDeformacionX, posicionDeformacionY, posicionDeformacionZ);
	figuraCopiarDeformar.name = 'active_shape';

	figuraCopiarDeformar.castShadow = true;
	intersectedObjects.push(figuraCopiarDeformar);
	scene.add(figuraCopiarDeformar);
	
	dragControls = new THREE.DragControls(intersectedObjects , camera, renderer.domElement );
	dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
	dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );



	
	


	
	figuraCopiarDeformar.geometry.applyMatrix( matrix);
	
	//previousDeformationConstants = [1/constantes[0], 1/constantes[1], 1/constantes[2], 1/constantes[3], 1/constantes[4], 1/constantes[5]];

}



init();
animate();
