// Create a scene
	scene = new THREE.Scene();

	// Create a geometry
	geometry = new THREE.BoxGeometry( 10, 10, 10 );
	// Create a MeshBasicMaterial with a color white and with its wireframe turned on
	material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true} );
	mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );