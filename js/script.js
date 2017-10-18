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

	cube.position.x = -2;
	cube.position.y = 2;
	cube.position.z = 0;

	cube.castShadow = true;

	scene.add(cube);


	var sphereGeometry = new THREE.SphereGeometry(4,20,20);
	//var sphereMaterial = new THREE.MeshBasicMaterial({color : 0x77770f, wireframe : true});
	var sphereMaterial = new THREE.MeshLambertMaterial({color : 0x77770f});
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

	sphere.position.x = 20;
	sphere.position.y = 4;
	sphere.position.z = 0;

	sphere.castShadow = true;
	scene.add(sphere);

	camera.position.x = -30;
	camera.position.y = 40;
	camera.position.z = 30;
	camera.lookAt(scene.position);

	//para las sombras
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-40,60,-10);
	spotLight.castShadow = true;

	scene.add(spotLight);

	$("#WebGL-salida").append(renderer.domElement);

	renderer.render(scene, camera);
})