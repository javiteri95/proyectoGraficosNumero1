$(document).ready(function(){
			$('.Size').on('click', function(e){
				e.preventDefault();
				var Size = $(this).attr('data-size');
				switch (Size){
					case '30':
							 renderer.render(scene, camera);
						break;
					case '60':
							for (var i = 0; i < scene.children.length; i++) {
								if (scene.children[i].name == 'active_shape') {
									console.log("dw");
									renderer.render(scene, camera);
								}
							}
						break;
				}
			});
});