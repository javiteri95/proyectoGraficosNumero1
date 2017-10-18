$(document).ready(function(){
	$("#custom").spectrum({
	    color: "#f00",
	    change: function(color) {
	        // console.log(color.toHexString());
	        for (var i = 0; i < scene.children.length; i++) {
	        	if (scene.children[i].name == 'active_shape') {
	        		var color_string = color.toHexString();
	        		var hex_string = '0x' + color_string.replace('#', '');
	        		scene.children[i].material.color.setHex(hex_string);
	        		render();
	        	}
	        }
	    }
	});
});

$('a[class~="geometry-trigger"]').on('click', function(e){
	e.preventDefault();
	var geometry = $(this).attr('data-geometry');
	switch(geometry) {
		case 'sphere':
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					var new_geometry = new THREE.SphereGeometry(4,20,20);
					var new_material = new THREE.MeshPhongMaterial({color: scene.children[i].material.color, dithering: true});
					var sphere = new THREE.Mesh(new_geometry, new_material);
					sphere.castShadow = true;
					sphere.name = 'active_shape';
					sphere.position.set(-2, 4, 0);
					scene.children[i] = sphere;
					render();
				}
			}
			break;
		case 'cube':
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					var new_geometry = new THREE.BoxGeometry(4, 4, 4);
					var new_material = new THREE.MeshPhongMaterial({color: scene.children[i].material.color, dithering: true});
					var cube = new THREE.Mesh(new_geometry, new_material);
					cube.castShadow = true;
					cube.name = 'active_shape';
					cube.position.set(-2, 2, 0);
					scene.children[i] = cube;
					render();
				}
			}
			break;
	}
});