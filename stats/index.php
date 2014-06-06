<?php 

	// Désactiver le rapport d'erreurs
	error_reporting(0);
	
	if (($_SERVER['SERVER_NAME'] == '127.0.0.1') OR ($_SERVER['SERVER_NAME'] == 'localhost')) {
		$PARAM_hote='localhost'; // le chemin vers le serveur
		$PARAM_port='3306';
		$PARAM_nom_bd='pokedex'; // le nom de votre base de données
		$PARAM_utilisateur='root'; // nom d'utilisateur pour se connecter
		$PARAM_mot_passe=''; // mot de passe de l'utilisateur pour se connecter
	}
	
	$PKMN_num = $_GET['n'];
	$lng = 5; //5: français
	$pokemon = Array();
	
	
	try {
	   $connexion = new PDO('mysql:host='.$PARAM_hote.';dbname='.$PARAM_nom_bd, $PARAM_utilisateur, $PARAM_mot_passe);

		//stats
		$statement=$connexion->prepare("SELECT stat_id, base_stat FROM `pokemon_stats` WHERE pokemon_id = $PKMN_num");
		$statement->execute();
		
		$pokemon['stats'] = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		$statement->closeCursor(); 
		
		//desc
		$statement=$connexion->prepare("SELECT flavor_text FROM `pokemon_species_flavor_text` WHERE species_id = $PKMN_num LIMIT 1");
		$statement->execute();
		
		$desc =  $statement->fetchAll(PDO::FETCH_ASSOC);
		$pokemon['desc'] = $desc[0]['flavor_text'];
		
		$statement->closeCursor(); 
		
    //moves
    $sql  = "SELECT M.id as num, N.name, MM.identifier as method, PM.level, M.type_id as type, M.power, M.pp, M.accuracy "; 
    $sql .= "FROM `moves` M, `pokemon_moves` PM, `move_names` N, `pokemon_move_methods` MM ";
    $sql .= "WHERE PM.pokemon_id = $PKMN_num ";  
    $sql .= "AND N.local_language_id = $lng ";
    $sql .= "AND PM.move_id = N.move_id ";   
    $sql .= "AND PM.pokemon_move_method_id = MM.id ";   
    $sql .= "AND PM.move_id = M.id ";     
    $sql .= "GROUP BY PM.move_id ";   
    $sql .= "ORDER BY PM.pokemon_move_method_id, PM.level ";
    
    //echo $sql;
		
    //moves
		$statement=$connexion->prepare($sql);
		$statement->execute();
		
		$pokemon['moves'] = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		$statement->closeCursor(); 
		
		$json=json_encode($pokemon);
		
		echo $json;
		
	   
	   
	} catch(Exception $e) {
		echo 'Erreur : '.$e->getMessage().'<br />';
	}

?>