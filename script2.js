
$(function () {
	//esenciales/*
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );
	var renderer = new THREE.WebGLRenderer();

	// Configuración del renderer
	renderer.setClearColor(0xffffff, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	var axes = new THREE.AxisHelper(20);
	scene.add(axes);

	var planeGeometry = new THREE.PlaneGeometry(60,20);
	var planeMaterial = new THREE.MeshBasicMaterial({color : 0xcccccc});
	var plane = new THREE.Mesh(planeGeometry,planeMaterial);

	plane.rotation.x = -0.5*Math.PI;
	plane.position.x = 15;
	plane.position.y = 0;
	plane.position.z = 0;
	plane.receiveShadow = true;

	scene.add(plane);

	// Creación del cubo
	var cubeGeometry = new THREE.CubeGeometry(4,4,4);
	var cubeMaterial = new THREE.MeshLambertMaterial({color : 0xff0000});
	var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

	cube.name="figure_active"
	cube.position.x = -2;
	cube.position.y = 2;
	cube.position.z = 0;

	cube.castShadow = true;

	scene.add(cube);

	camera.position.x = -30;
	camera.position.y = 40;
	camera.position.z = 30;
	camera.lookAt(scene.position);

	//para las sombras
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-40,60,-10);
	spotLight.castShadow = true;
	scene.add(spotLight);
	var animate = function () {
				requestAnimationFrame( animate );

				cube.rotation.x += 0.1;// hace  rotacion en x
				cube.rotation.y += 0.1; // hace rotacion en y
				cube.scale.set(0.6,0.5,0.5); //auto resize del cubo
				//sphere.rotation.x +=0.1;
				//sphere.rotation.z +=0.1;
				renderer.render(scene, camera);			
	};
	$("#WebGL-salida").append(renderer.domElement);
	animate();

})