$(document).ready(function(){
	for (var i = 0; i < scene.children.length; i++) {
		if (scene.children[i].name == 'active_shape') {
			var geometry = scene.children[i].geometry.type;
			var text = '';
			switch(geometry) {
				case 'SphereGeometry':
					text = 'Esfera';
					break;
				case 'BoxGeometry':
					text = 'Cubo';
					break;
				case 'CylinderGeometry':
					if (intersects[0].object.geometry.parameters.radiusTop == 0) {
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

	$("#slider_size").slider({
		min: 1,
		max: 5,
		step: 0.1,
		slide: function(event, ui){
			var value = ui.value;
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					scene.children[i].scale.set( value, value, value );
					render();
				}
			}
		}
	});

	$("#slider_rotate_x").slider({
		min: 1,
		max: 4,
		step: 0.1,
		slide: function(event, ui){
			var value = ui.value;
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					scene.children[i].rotation.x = value;
					render();
				}
			}
		}
	});
	$("#slider_rotate_y").slider({
		min: 1,
		max: 4,
		step: 0.1,
		slide: function(event, ui){
			var value = ui.value;
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					scene.children[i].rotation.y = value;
					render();
				}
			}
		}
	});
	$("#slider_rotate_z").slider({
		min: 1,
		max: 4,
		step: 0.1,
		slide: function(event, ui){
			var value = ui.value;
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					scene.children[i].rotation.z = value;
					render();
				}
			}
		}
	});

	$("#slider_deform").slider({
		min: 0,
		max: 1,
		step: 0.1,
		slide: function(event, ui){
			var value = ui.value;
			var matrix = [value, value, value, value, value, value];
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					deform(scene.children[i], matrix);
					render();
				}
			}
		}
	});

	$("#slider_move_x").slider({
		min: -50,
		max: 50,
		step: 1,
		slide: function(event, ui){
			var value = ui.value;
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					scene.children[i].position.x = value;
					render();
				}
			}
		}
	});
	$("#slider_move_y").slider({
		min: -50,
		max: 50,
		step: 1,
		slide: function(event, ui){
			var value = ui.value;
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					scene.children[i].position.y = value;
					render();
				}
			}
		}
	});
	$("#slider_move_z").slider({
		min: -50,
		max: 50,
		step: 1,
		slide: function(event, ui){
			var value = ui.value;
			for (var i = 0; i < scene.children.length; i++) {
				if (scene.children[i].name == 'active_shape') {
					scene.children[i].position.z = value;
					render();
				}
			}
		}
	});
});