var cityBlocks = [];
var cityBlocksMeshes = [];

var scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(150,150,150)");
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var controls = new THREE.OrbitControls( camera );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
let renderDiv = document.getElementById("renderDiv");
renderDiv.appendChild( renderer.domElement );

var geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
var materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(139,69,19)") } );

generateBlocks(10,10);

camera.position.y = 5;
camera.position.z = 10;

camera.lookAt(0,0,0);

var animate = function () {
    requestAnimationFrame( animate );

    controls.update();

    renderer.render( scene, camera );
};

animate();

function generateBlocks(sizeX, sizeY){

    let ori = Math.floor((Math.random() * 2));
    let size = Math.floor((Math.random() * 2));
    let type = Math.floor((Math.random() * 2));

    for(let i = 0; i < sizeX * sizeY; i++){
        cityBlocks[i] = "nd";
    }

    //4
    if(size == 0){
        cityBlocks[0] = "b";
        cityBlocks[1] = "b";
        cityBlocks[2] = "s";
        cityBlocks[10] = "b";
        cityBlocks[11] = "b";
        cityBlocks[12] = "s";
        cityBlocks[20] = "s";
        cityBlocks[21] = "s";
        cityBlocks[22] = "s";
    }else if(size == 1){
        if(ori == 0){
            cityBlocks[0] = "b";
            cityBlocks[1] = "b";
            cityBlocks[2] = "s";
            cityBlocks[10] = "b";
            cityBlocks[11] = "b";
            cityBlocks[12] = "s";
            cityBlocks[20] = "b";
            cityBlocks[21] = "b";
            cityBlocks[22] = "s";
            cityBlocks[30] = "s";
            cityBlocks[31] = "s";
            cityBlocks[32] = "s";
        }else{
            cityBlocks[0] = "b";
            cityBlocks[1] = "b";
            cityBlocks[2] = "b";

            cityBlocks[10] = "b";
            cityBlocks[11] = "b";
            cityBlocks[12] = "b";

            cityBlocks[20] = "s";
            cityBlocks[21] = "s";
            cityBlocks[22] = "s";

            cityBlocks[13] = "s";
            cityBlocks[23] = "s";
            cityBlocks[] = "s";
        }
        
    }
    
    for(let i = 0; i < cityBlocks.length; i++){
        
            if(cityBlocks[i] === "nd"){
                let geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
                let materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(0,0,150)") } );
                let ground = new THREE.Mesh( geometryGround, materialGround );
                cityBlocksMeshes.push(ground);
            }else if( cityBlocks[i] === "b"){
                let geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
                let materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(0,150,0)") } );
                let ground = new THREE.Mesh( geometryGround, materialGround );
                cityBlocksMeshes.push(ground);
            }else if( cityBlocks[i] === "s"){
                let geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
                let materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(150,0,0)") } );
                let ground = new THREE.Mesh( geometryGround, materialGround );
                cityBlocksMeshes.push(ground);
            }
    }
    console.log(cityBlocks)

    let tempIndex = 0;
    for(let i = -sizeX/2; i < sizeX/2; i++){
        for(let j = -sizeY/2; j < sizeY/2; j++){
            if(tempIndex < cityBlocksMeshes.length){
                cityBlocksMeshes[tempIndex].position.set(i , 0, j);
                scene.add( cityBlocksMeshes[tempIndex]);
                tempIndex++;
            }   
        }
        
    }
}

