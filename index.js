var cityBlocks = [];
var cityBlocksMeshes = [];
var buildingsMeshes = [];
var buildingsTypes = [];
var buildingsConsumption = [];
var roadsMeshes = [];
let loaded = false;
var roadCorners;
var road;
var house;
var house2;
var predio;
var crossroads;
let roadIntervalX = 0;
let roadIntervalY = 0;
       
var scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(150,150,150)");
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var aspect = window.innerWidth / window.innerHeight;
var d = 20;
camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );

camera.position.set( 20, 20, 20 ); // all components equal
camera.lookAt( scene.position ); // or the origin

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

directionalLight.position.set(20,20,20);
directionalLight.castShadow = true;
directionalLight.lookAt( scene.position );

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var controls = new THREE.OrbitControls( camera );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
let renderDiv = document.getElementById("renderDiv");
renderDiv.appendChild( renderer.domElement );

var geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
var materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(139,69,19)") } );

importPrefabs();

var animate = function () {
    requestAnimationFrame( animate );

    controls.update();

    if(!loaded){
        if ( road instanceof THREE.Mesh && roadCorners instanceof THREE.Mesh) {
            generateCity(30,30);
            loaded = !loaded;
        }
    }

    renderer.render( scene, camera );
};

animate();

function generateCity(sizeX, sizeY){

    cityBlocks = [sizeX];
    cityBlocksMeshes = [sizeX];
    roadsMeshes = [sizeX];

    for(let i = 0; i < sizeX; i++){
        let row = [sizeY];
        cityBlocks[i] = row;
        let row1 = [sizeY];
        cityBlocksMeshes[i] = row1;
        let row2 = [sizeY];
        roadsMeshes[i] = row2;
    }

    // for(let i = 0; i < sizeX; i++){
    //     let row = [sizeY];
    //     cityBlocksMeshes[i] = row;
        
    // }

    for(let i = 0; i < sizeX; i++){
        for(let j = 0; j < sizeY; j++){
            cityBlocks[i][j] = "nd";
        }
    }
   
    let tempRemainderX1 = sizeX-2 % 2;
    let tempRemainderX2 = sizeX-2 % 3;
    if( tempRemainderX1 < tempRemainderX2){
        roadIntervalX = 2 + 1;
    }else{
        roadIntervalX = 3 + 1;
    }
    let tempRemainderY1 = sizeY-2 % 2;
    let tempRemainderY2 = sizeY-2 % 3;
    if( tempRemainderY1 < tempRemainderY2){
        roadIntervalY = 2;
    }else{
        roadIntervalY = 3;
    }


    //roads
    for(let i = 0; i < sizeX; i++){       
        for(let j = 0; j < sizeY; j += roadIntervalY){
            cityBlocks[i][j] = "s";
        }

    }

    for(let j = 0; j < sizeY; j++){
        for(let i = 0; i < sizeY; i += roadIntervalX){
            cityBlocks[i][j] = "s";
        }
    }

    for(let i = 0; i < sizeX; i++){
        for(let j = 0; j < sizeY; j++){
            if(cityBlocks[i][j] != "s"){
                cityBlocks[i][j] = "b";
            }
           
        }
    }

    

    for(let i = 0; i < sizeX; i++){
        for(let j = 0; j < sizeY; j++){
            if(cityBlocks[i][j] === "nd"){
                let geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
                let materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(0,00,250)") } );
                let ground = new THREE.Mesh( geometryGround, materialGround );
                ground.receiveShadow = true;
                cityBlocksMeshes[i][j] = ground;
            }else if( cityBlocks[i][j] === "b"){
                let geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
                let materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(0,100,0)") } );
                let ground = new THREE.Mesh( geometryGround, materialGround );
                ground.receiveShadow = true;
                cityBlocksMeshes[i][j] = ground;
            }else if( cityBlocks[i][j] === "s"){
                let geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
                let materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(250,0,0))") } );
                let ground = new THREE.Mesh( geometryGround, materialGround );
                ground.receiveShadow = true;
                cityBlocksMeshes[i][j] = ground;
            }
        }
    }


    for(let i = -sizeX/2; i < sizeX/2; i++){
        for(let j = -sizeY/2; j < sizeY/2; j++){
            
            cityBlocksMeshes[i +sizeX/2][j +sizeY/2 ].position.set(i , 0, j);

            scene.add( cityBlocksMeshes[i +sizeX/2 ][j+sizeY/2]);
           
        }
        
    }

    let tempCounter = 0;
    for(let i = 0; i < sizeX; i++){
        for(let j = 0; j < sizeY; j++){
            if( cityBlocks[i][j] === "b"){
                chooseHouseType(i,j);
            }else if( cityBlocks[i][j] === "s"){
                if(i != 0 || j != 0){
                    let roadMesh = new THREE.Mesh( road.geometry, road.material );
                    roadMesh.position.copy(cityBlocksMeshes[i][j].position);
                    roadMesh.position.y += 0.5;
                    roadMesh.receiveShadow = true;
                    if(tempCounter == roadIntervalY){
                        roadMesh.rotation.y = Math.PI/2;
                        tempCounter = 0;
                    }
                   
                    roadsMeshes[i][j] = roadMesh;
                    scene.add(roadMesh);
                }
                
                
            }
            tempCounter++;
        }
    }

    for(let i = 0; i < sizeX; i+= roadIntervalX){
        for(let j = 0; j < sizeY; j+= roadIntervalY){
                    
            let roadObj = new THREE.Mesh( crossRoads.geometry, crossRoads.material );
            roadObj.position.copy(cityBlocksMeshes[i][j].position);
            roadObj.position.y = 0.5;
            scene.remove(roadsMeshes[i][j]);
            roadsMeshes[i][j] = roadObj;
            scene.add(roadObj);
                    
        }
    }

    roadCorners.position.copy(cityBlocksMeshes[0][0].position);
    roadCorners.position.y += 0.5;
    scene.add(roadCorners);
}

function chooseHouseType(i,j){
    let type = Math.floor(Math.random() * 2);   
    let rot = verifyRoadPos(i, j);
    if(type == 0){
        let typeHouse = Math.floor(Math.random() * 2);   
        if(typeHouse == 0){

            let tempHouse = new THREE.Mesh(house.geometry, house.material);
            tempHouse.castShadow = true;
            tempHouse.receiveShadow = true;
            tempHouse.position.copy(cityBlocksMeshes[i][j].position);
            tempHouse.position.y += 0.65;
            tempHouse.rotation.y = rot;
            scene.add(tempHouse);        
            buildingsMeshes.push(tempHouse);
            buildingsTypes.push(0);
        }else{
            let tempHouse = new THREE.Mesh(house2.geometry, house2.material);
            tempHouse.castShadow = true;
            tempHouse.receiveShadow = true;
            tempHouse.position.copy(cityBlocksMeshes[i][j].position);
            tempHouse.position.y += 0.65;
            tempHouse.rotation.y = rot;
            scene.add(tempHouse);
            buildingsMeshes.push(tempHouse);
            buildingsTypes.push(1);
        }
       
    }else{
        let tempBuilding = new THREE.Mesh(predio.geometry, predio.material);
        tempBuilding.castShadow = true;
        tempBuilding.receiveShadow = true;
        tempBuilding.position.copy(cityBlocksMeshes[i][j].position);
        tempBuilding.position.y += 0.5;
        tempBuilding.rotation.y = rot;
        scene.add(tempBuilding);
        buildingsMeshes.push(tempBuilding);
        buildingsTypes.push(2);
    }

      
}

function verifyRoadPos(indexI, indexJ){
    let surround = [];
    let chosenSide;

    if(indexI != 29){
        if(cityBlocks[indexI + 1][indexJ] == "s"){
            let tempObj = {
                side: Math.PI/2,
                has: 1
            };
            surround.push(tempObj);
        }else{
            surround.push(null);
        }
    }else{
        surround.push(null);
    }
    
    if(indexI != 0){
        if(cityBlocks[indexI - 1][indexJ] == "s"){
            let tempObj = {
                side: 3*Math.PI/2,
                has: 1
            };
            surround.push(tempObj);
        }else{
            surround.push(null);
        }
    }else{
        surround.push(null);
    }

    if(indexJ != 29){
        if(cityBlocks[indexI][indexJ + 1] == "s"){
            let tempObj = {
                side: 0,
                has: 1
            };
            surround.push(tempObj);
        }else{
            surround.push(null);
        }
    }else{
        surround.push(null);
    }
    
    if(indexJ != 0){
        if(cityBlocks[indexI][indexJ - 1] == "s"){
            let tempObj = {
                side: Math.PI,
                has: 1
            };
            surround.push(tempObj);
        }else{
            surround.push(null);
        }
    }else{
        surround.push(null);
    }
    
    let tempSurr = [];
    for(let p = 0; p < surround.length; p++){
        if(surround[p] != null){
            tempSurr.push(surround[p]);
        }
    }

    let surroundRand = Math.floor(Math.random() * tempSurr.length); 

    if(tempSurr.length != 0){
        chosenSide = tempSurr[surroundRand].side;
    }else{
        chosenSide = 0;
    }
    
    return chosenSide;
}

function importPrefabs(){

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'models/1square/obj/' );
    var url = "house1.mtl";
    mtlLoader.load( url, function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'models/1square/obj/' );
        objLoader.load( 'house1.obj', function ( object ) {

            
           
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {
                    
                    house = new THREE.Mesh(child.geometry, child.material);
                   
                }
            } );

        });

    });

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'models/1square/obj/' );
    var url = "house2.mtl";
    mtlLoader.load( url, function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'models/1square/obj/' );
        objLoader.load( 'house2.obj', function ( object ) {

            
           
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {
                    
                    house2 = new THREE.Mesh(child.geometry, child.material);
                   
                }
            } );

        });

    });

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'models/1square/obj/' );
    var url = "predio1.mtl";
    mtlLoader.load( url, function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'models/1square/obj/' );
        objLoader.load( 'predio1.obj', function ( object ) {

            
           
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {
                    
                    predio = new THREE.Mesh(child.geometry, child.material);
                   
                }
            } );

        });

    });

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'models/1square/' );
    var url = "road1.mtl";
    mtlLoader.load( url, function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'models/1square/' );
        objLoader.load( 'road1.obj', function ( object ) {
            object.position.y = 0.5;
            object.castShadow = true;
            object.receiveShadow = true;
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {
                    
                    road = new THREE.Mesh(child.geometry, child.material);
                
                }
            } );
           
            
           
            
        });
        
    });
   
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'models/1square/' );
    var url = "road2.mtl";
    mtlLoader.load( url, function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'models/1square/' );
        objLoader.load( 'road2.obj', function ( object ) {

            
            object.position.y = 0.5;
            object.position.x -= 0.001;
            
            //object.rotation.y = Math.PI/2;
            object.castShadow = true;
            object.receiveShadow = true;
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {
                    
                    roadCorners = new THREE.Mesh(child.geometry, child.material);
                
                }
            } );
            

        });

    });

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'models/1square/' );
    var url = "road3.mtl";
    mtlLoader.load( url, function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'models/1square/' );
        objLoader.load( 'road3.obj', function ( object ) {

            
            object.position.y = 0.5;
            object.position.x -= 0.001;
            
            //object.rotation.y = Math.PI/2;
            object.castShadow = true;
            object.receiveShadow = true;
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {
                    
                    crossRoads = new THREE.Mesh(child.geometry, child.material);
                
                }
            } );
            

        });

    });


}

function generateConsumption(){
    for(let i = 0; i < buildingsTypes.length; i++){

        let energy = generateEnergy(buildingsTypes[i]);
        let water = generateWater(buildingsTypes[i], energy);

        let houseGoods = {
            energy: energy,
            water: water,
        }
    }
}

function generateEnergy(type){
    if(type == 0){
        energyGoods = {
            lamp: Math.floor(Math.random() * 4) + 13,
            shower: 1,
            freezer: 1,
            dish: Math.floor(Math.random() * 2),
            tv: Math.floor(Math.random() * 3),
            heat: Math.floor(Math.random() * 3),
            washer:  Math.floor(Math.random() * 2),
            dryer:  Math.floor(Math.random() * 2),
        }

        return energyGoods;
    }else if( type == 1){
        energyGoods = {
            lamp: Math.floor(Math.random() * 8) + 26,
            shower: Math.floor(Math.random() * 2),
            freezer: 1,
            dish: Math.floor(Math.random() * 2),
            tv: Math.floor(Math.random() * 5),
            heat: Math.floor(Math.random() * 6),
            washer:  Math.floor(Math.random() * 2),
            dryer:  Math.floor(Math.random() * 2),
        }

        return energyGoods;
    }else if( type == 2){
        energyGoods = {
            lamp: Math.floor(Math.random() * 80) + 260,
            shower: 20,
            freezer: 20,
            dish: Math.floor(Math.random() * 20),
            tv: Math.floor(Math.random() * 60),
            heat: Math.floor(Math.random() * 60),
            washer:  20,
            dryer:  20,
        }

        return energyGoods;
    }

}

function generateWater(type, energy){
    if(type == 0){
        water = {
            toilet: 1,
            sink: 2,
            shower: 1,
            dish: energy.dish,
            washer: energy.washer,
        }

        return water;
    }else if( type == 1){
        water = {
            toilet: energy.shower,
            sink: energy.shower + 1,
            shower: energy.shower,
            dish: energy.dish,
            washer: energy.washer,
        }

        return water;
    }else if( type == 2){
        water = {
            toilet: energy.shower ,
            sink: energy.shower + 1*20,
            shower: energy.shower,
            dish: energy.dish,
            washer: energy.washer,
        }

        return water;
    }

}
