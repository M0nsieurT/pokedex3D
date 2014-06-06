<?php
header("content-type: application/xml; charset=UTF-8");
$number  = $_GET['n'];
$xmlFile = $number . '.x3d';
/*    création des repertoires    
for ($i = 1; $i<647; $i++) {        
	$dir = $i;                
	for ($j = strlen($dir); $j < 3; $j++) {
		$dir = '0'.$dir;        
	}        
	
	mkdir('textures/'.$dir);    
}
    */
try {
    if (!file_exists($xmlFile)) {
        $xmlFile = 'pokeball.x3d';
    }
    $xml = file_get_contents($xmlFile);
    $xml = new SimpleXMLElement($xmlFile, Null, True);
    echo $xml->Scene->asXML();
}
catch (Exception $e) {
    echo 'Erreur : ' . $e->getMessage() . '<br />';
}
?>