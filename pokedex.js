function InitWebGLContext() {
	var glCanvas = document.createElement("canvas");
	// first, try standard WebGL context
	var gl = glCanvas.getContext("webgl");
	if (!gl) {
		// if failed, try experimental one
		gl = glCanvas.getContext("experimental-webgl");
	}

	if (!gl) {
		alert("Your browser does not support WebGL");
		return;
	}

	// here we get WebGL context - 
	// for demonstation let's show some info
	console.log("WebGL version:             " + gl.getParameter(gl.VERSION));
	console.log("WebGL shader version:      " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	console.log("WebGL vendor:              " + gl.getParameter(gl.VENDOR));
	console.log("WebGL renderer:            " + gl.getParameter(gl.RENDERER));
	
	try {
		f = gl.getSupportedExtensions()
	} catch (m) {
		f = "Extensions unavailable"
	}
	console.log("WebGL extensions:          " + f);
	console.log("WebGL num texture units:   " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
	console.log("WebGL max texture size:    " + gl.getParameter(gl.MAX_TEXTURE_SIZE));
	console.log("WebGL max cubemap size:    " + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
	console.log("WebGL max vertex attribs:  " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
	console.log("WebGL max vshader vectors: " + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
	console.log("WebGL max fshader vectors: " + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
	console.log("WebGL max varying vectors: " + gl.getParameter(gl.MAX_VARYING_VECTORS));
	
}


$(document).ready(function() {
	
	
	InitWebGLContext();
	
	$("#pokelist .scroll-content li").click(function() {
		loadMonster('#'+$(this).attr('id'));
	});
		
	$("#tabs li").click(function() {
		$('#tabs li').removeClass('active');
		$(this).addClass('active');
		
		$('.poketab').hide();
		$('#poke'+$(this).attr('id')).show();
	});
	
	$(window).resize(function() {
		$("#pokedex").css({
			'position': 'absolute',
			'top': (($('body').height()-$('#pokedex').height())/2)+'px',
			'left': (($('body').width()-$('#pokedex').width())/2)+'px'
		});
	});
	
	$(window).resize();
	
	$('#totalcount').text($('.scroll-content li').length);
	$('#totalcatch').text($('.scroll-content li .catch').length + ' (' + Math.round($('.scroll-content li .catch').length / $('.scroll-content li').length *100) +'%)');
	
	var numPkmn = (window.location.hash!='')?window.location.hash.substr(0,1)+"num_"+window.location.hash.substr(1,4):'#num_001';
	loadMonster(numPkmn);
	
	$('#pokelist .scroll-content').scrollTo(numPkmn);
	
	//permet de
	x3d_element = document.getElementById('x3dom-logo');

});

function loadMonster(Number) {
	
	// met à jour la liste
	$('#pokelist .scroll-content li').removeClass('active');
	$(Number).addClass('active');
		
	num = $(Number).children('.pokelist_pokenum').text();
	name = $(Number).children('.pokelist_pokename').text();
	
	$('#block2 #pokename .title').text('#'+num+' '+name);
	//créé le chemin avec en paramètre un timestamp (desactive le cache)
	path = 'x3d/?n='+num+'&d='+new Date().getTime();
	//charge un objet X3D dans la balise scene via Ajax
	try {
		$('#x3d').hide();
		$('scene').load(path,function(){
			$('scene').x3d('realign');
			$('#x3d').show();
			
			snd = new Audio();

      if (typeof snd.canPlayType === "function") {		
  			if(snd.canPlayType("audio/mpeg") !== "") {
  				snd.src = "Audio/Cries/mp3/"+num+".mp3";
  			} else if(snd.canPlayType("audio/wav") !== "") {
  				snd.src = "Audio/Cries/wav/"+num+".wav";
  			} else if(snd.canPlayType("audio/ogg") !== "") {
  				snd.src = "Audio/Cries/ogg/"+num+".ogg";
  			} 
  			
  			snd.play();
      }
      
		});
	} catch(err){
		console.log(err);
		return false;
	}
	
	$.getJSON('stats/', {n:num}, function(data) {
		//console.log(data);
		$('#poketext').text(data.desc);
		
		$('.levelbar').each(function(index) {
			stat = parseInt(data.stats[index].base_stat);
			$(this).css('width', Math.floor((stat/255)*100)+'%').attr('title', stat);	
		});
                                
    $('#pokemoves').html('');
              
    html = '<tr>';
    for(header in data.moves[0]){
         html += '<th class="'+header+'">'+header+'</th>';
    }    
    html += '</tr>';                                 
    $('#pokemoves').append(html);
      
    $(data.moves).each(function(index) {
                   
      html = '<tr>';
      for(move in this){
        if (move == "type") {
         html += '<td class="'+move+'"><img src="Graphics/types/'+this[move]+'.png" /></td>';
         } else {
         html += '<td class="'+move+'">'+this[move]+'</td>';
         }
      }   
         
      html += '</tr>';                                               
      $('#pokemoves').append(html);
		});
		
	});
	
}