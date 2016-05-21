/**
 * 
 */
MapManager.prototype.initialize = function () {
	
	/* TEMPLATE
	var map01 = new Map(gm, mapid,
			bglayer,
			clayer 
	);
	map01.addEntity(new Enemy(
	this.addMap(map01);
	*/
	
	
	
	/* Map 1 - grasslands */
	var map01 = new Map(gm, 1,
		    new Background(gm, gm.am.getAsset("./img/Background_Layer.png")),
		    new Background(gm, gm.am.getAsset("./img/Foreground_Layer.png")),
		    new Collidable_background(gm, gm.am.getAsset("./img/Collision_Layer.png"))
	);
	//map01.addEntity(new MapTeleportEvent(gm, 400, 400, 50, 50, 2, 800, 800));
	//map01.addEntity(new MapTeleportEvent(gm, 700, 700, 50, 50, 2, 500, 500));
	
	//map01.addEntity(new Green(gm, 64, 64));
    //map01.addEntity(new Shark(gm, 64, 128));
    //map01.addEntity(new Fire(gm, 64, 256));
    map01.addEntity(new Bandit(gm, 8*TILE_SIZE, 4*TILE_SIZE));
    map01.addEntity(new Goblin(gm, 14*TILE_SIZE, 4*TILE_SIZE));
    map01.addEntity(new Billy(gm, 64, 256+64));
    map01.addEntity(new Chest(gm, 5*TILE_SIZE, 2*TILE_SIZE, 1, "Peanut"));
    map01.addEntity(new Chest(gm, 6*TILE_SIZE, 2*TILE_SIZE, 0, "Pinecone"));
    map01.addEntity(new Chest(gm, 7*TILE_SIZE, 2*TILE_SIZE, 2, "Excalibur"));
    map01.addEntity(new Door(gm, 3*TILE_SIZE, 3*TILE_SIZE, 0, false, null, 10*TILE_SIZE, 10*TILE_SIZE));
    this.addMap(map01);
    
    
    /* Map 2 - Temple */
    var map02 = new Map(gm, 2,
		    new Background(gm, gm.am.getAsset("./img/temple.jpg")),
		    new Background(gm, gm.am.getAsset("./img/collidable_background.png")),
		    new Collidable_background(gm, gm.am.getAsset("./img/collidable_background.png"))
	);
	map02.addEntity(new MapTeleportEvent(gm, 400, 400, 50, 50, 1, 800, 800));
	map02.addEntity(new MapTeleportEvent(gm, 700, 700, 50, 50, 1, 500, 500));
	
	//map02.addEntity(new Green(gm, 64, 64));
    //map02.addEntity(new Shark(gm, 64, 128));
    //map02.addEntity(new Fire(gm, 64, 256));
    this.addMap(map02);
	
	
	return true;
}