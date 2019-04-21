var cityBlocks = [];
var cityBlocksMeshes = [];
var roadsMeshes = [];
let loaded = false;
var roadCorners;
var road;
var house;
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

// camera.position.y = 5;
// camera.position.x = 10;

// camera.lookAt(0,0,0);

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

    // house.position.copy(cityBlocksMeshes[9][11].position)
    // house.position.y += 0.65;
    // scene.add(house);

    // predio.position.copy(cityBlocksMeshes[10][11].position)
    // predio.position.y += 0.5;
    // scene.add(predio);

    console.log(predio)
}


function chooseHouseType(i,j){
    let type = Math.floor(Math.random() * 2);   

    if(type == 0){
        let tempHouse = new THREE.Mesh(house.geometry, house.material);
        tempHouse.castShadow = true;
        tempHouse.receiveShadow = true;
        tempHouse.position.copy(cityBlocksMeshes[i][j].position);
        tempHouse.position.y += 0.65;
        scene.add(tempHouse);
    }else{
        let tempBuilding = new THREE.Mesh(predio.geometry, predio.material);
        tempBuilding.castShadow = true;
        tempBuilding.receiveShadow = true;
        tempBuilding.position.copy(cityBlocksMeshes[i][j].position);
        tempBuilding.position.y += 0.5;
        scene.add(tempBuilding);
    }

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


