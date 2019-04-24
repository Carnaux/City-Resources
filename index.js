let cityBlocks = [];
let cityBlocksMeshes = [];
let buildingsMeshes = [];
let buildingsTypes = [];
let buildingsConsumption = [];
let roadsMeshes = [];
let loaded = false;
let roadCorners;
let road;
let house;
let house2;
let predio;
let crossroads;
let roadIntervalX = 0;
let roadIntervalY = 0;

let consumptionTable;
let useFrequency;

let house1Outline;
let house2Outline;
let predioOutline;

let lastHover;

let chart;

let cityConsumption = {
    energy:[0,0,0,0],
    water: [0,0,0,0]
};

var mouse = new THREE.Vector2();
       
var scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(255,255,255)");
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var aspect = window.innerWidth / window.innerHeight;
var d = 20;
camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );

camera.position.set( 20, 20, 20 ); // all components equal
camera.lookAt( scene.position ); // or the origin

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
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

consumptionValues();

importPrefabs();


window.addEventListener( 'mousedown', onDocumentMouseDown, false );
window.addEventListener( 'mousemove', onDocumentMouseMove, false );

var animate = function () {
    requestAnimationFrame( animate );

    controls.update();

    if(!loaded){
        if ( road instanceof THREE.Mesh && roadCorners instanceof THREE.Mesh) {
            createOutlines();
            generateCity(30,30);
            loaded = !loaded;
        }
    }

    renderer.render( scene, camera );
};

animate();

function createOutlines(){
    var edges1 = new THREE.EdgesGeometry( house.geometry );
    house1Outline = new THREE.LineSegments( edges1, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    scene.add(house1Outline);

    var edges2 = new THREE.EdgesGeometry( house2.geometry );
    house2Outline = new THREE.LineSegments( edges2, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    scene.add(house2Outline);

    var edges3 = new THREE.EdgesGeometry( predio.geometry );
    predioOutline = new THREE.LineSegments( edges3, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    scene.add(predioOutline);
}

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

    generateConsumption();

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
            let cor = new THREE.Color("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255)+ "," + Math.floor(Math.random() * 255) +")");
            let tempHouse = new THREE.Mesh(house.geometry, house.material);
            tempHouse.material[4].color = cor;     
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
            tempHouse.material[4].color = new THREE.Color("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255)+ "," + Math.floor(Math.random() * 255) +")");
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

function consumptionValues(){
    
    consumptionTable = {
        energy:{
            shower: 5500,
            lamp: 9,
            freezer: 500,
            dish: 1500,
            washer: 1000,
            dryer: 3500,
            tv: 90
        },
        water:{
            sink: 1,
            shower: 40,
            toilet: 4,
            washer: 8.4,
            dish: 15,
        }
        
    }

}

function generateConsumption(){
    for(let i = 0; i < buildingsTypes.length; i++){

        useFrequency = randomizeUsage();
        let energy = generateEnergyGoods(buildingsTypes[i]);
        let water = generateWaterGoods(buildingsTypes[i], energy);
        let energyConsumption = generateEnergyConsumption(energy, useFrequency);
        let waterConsumption = generateWaterConsumption(water, useFrequency);

        let energyTotal = Math.floor(sumObjs(energyConsumption));
        let waterTotal =  Math.floor(sumObjs(waterConsumption));
        
       let distribution = distributeEnergy(energyTotal, waterTotal);

        let houseStats = {
            dayCycle: distribution,
            energy: {
                quantity: energy,
                consumption: energyConsumption
            },
            water: {
                quantity: water,
                consumption: waterConsumption
            },
            frequency: useFrequency,
        }

        buildingsConsumption.push(houseStats);
    }

    calculateTotal();
}

function calculateTotal(){
    for(let i = 0; i < 4; i++){
        cityConsumption.energy[0] += buildingsConsumption[i].dayCycle.energy[0];
        cityConsumption.water[0] += buildingsConsumption[i].dayCycle.water[0];

        cityConsumption.energy[1] += buildingsConsumption[i].dayCycle.energy[1];
        cityConsumption.water[1] += buildingsConsumption[i].dayCycle.water[1];

        cityConsumption.energy[2] += buildingsConsumption[i].dayCycle.energy[2];
        cityConsumption.water[2] += buildingsConsumption[i].dayCycle.water[2];

        cityConsumption.energy[3] += buildingsConsumption[i].dayCycle.energy[3];
        cityConsumption.water[3] += buildingsConsumption[i].dayCycle.water[3];
    }
    createChart();
}

function createChart(){

    let db = cityConsumption;

    Chart.defaults.global.defaultFontColor = 'black';
    var ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ['00:00', '06:00', '12:00','18:00','00:00'],
            datasets: [{
                label: "Energy (kW/h)",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [db.energy[0], db.energy[1], db.energy[2], db.energy[3], db.energy[0]]
            },
            {
                label: "Water (L)",
                backgroundColor: 'rgb(50, 50, 90)',
                borderColor: 'rgb(50, 50, 90)',
                data: [db.water[0], db.water[1], db.water[2], db.water[3], db.water[0]]
            }]
        },

        // Configuration options go here
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        color: 'rgb(0, 0, 0)'
                    },
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgb(0, 0, 0)'
                    },
                }]
            }
        }
    });
}

function sumObjs(obj){
    return Object.values(obj).reduce((a, b) => a + b);  
}

function generateEnergyGoods(type){
    if(type == 0){
        energyGoods = {
            lamp: Math.floor(Math.random() * 14) + 4,
            shower: 1,
            freezer: 1,
            dish: Math.floor(Math.random() * 2),
            tv: Math.floor(Math.random() * 3),
            washer:  Math.floor(Math.random() * 2),
            dryer:  Math.floor(Math.random() * 2),
        }

        return energyGoods;
    }else if( type == 1){
        energyGoods = {
            lamp: Math.floor(Math.random() * 26) + 8,
            shower: Math.floor(Math.random() * 2) + 1,
            freezer: 1,
            dish: Math.floor(Math.random() * 2),
            tv: Math.floor(Math.random() * 5),
            washer:  Math.floor(Math.random() * 2),
            dryer:  Math.floor(Math.random() * 2),
        }

        return energyGoods;
    }else if( type == 2){
        energyGoods = {
            lamp: Math.floor(Math.random() * 300) + 80,
            shower: 20,
            freezer: 20,
            dish: Math.floor(Math.random() * 20),
            tv: Math.floor(Math.random() * 60),
            washer:  20,
            dryer:  20,
        }

        return energyGoods;
    }

}

function generateWaterGoods(type, energy){
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

function generateEnergyConsumption(energy, f){
    let tempObj = {
        lamp: (energy.lamp * consumptionTable.energy.lamp * f.lamp)/1000,
        shower: (energy.shower * consumptionTable.energy.shower * f.shower)/1000,
        freezer: (energy.freezer * consumptionTable.energy.freezer * 10)/1000,
        dish: (energy.dish * consumptionTable.energy.dish * f.dish)/1000,
        tv: (energy.tv * consumptionTable.energy.tv * f.tv)/1000,
        washer: (energy.washer * consumptionTable.energy.washer * f.washer)/1000,
        dryer: (energy.dryer * consumptionTable.energy.dryer * f.dryer)/1000,
    }

    return tempObj;
}

function generateWaterConsumption(water, f){
    let tempObj = {
        sink: (water.sink * consumptionTable.water.sink * f.sink),
        toilet: (water.toilet * consumptionTable.water.toilet * f.toilet),
        shower: (water.shower * consumptionTable.water.shower * f.shower),
        dish: (water.dish * consumptionTable.water.dish * f.dish),
        washer: (water.washer * consumptionTable.water.washer * f.washer),
    }

    return tempObj;
}

function randomizeUsage(){
    let tempObj = {
        lamp: Math.floor(Math.random() * 21),
        shower:  Math.floor(Math.random() * 7),
        dish: Math.floor(Math.random() * 11),
        tv: Math.floor(Math.random() * 21),
        washer: Math.floor(Math.random() * 3),
        dryer: Math.floor(Math.random() * 7),
        toilet: Math.floor(Math.random() * 10),
        sink: Math.floor(Math.random() * 16),
    }

    return tempObj;
}

function distributeEnergy(eT, wT){
    let waterTimes = [];
    let times = [];
    for(let i = 0; i < 4; i++){
        times[i] = null;
        waterTimes[i] = null;
    }

    let total = eT;
    let waterTotal = wT;

    let first = Math.floor(Math.random() * 3);

    let amount = Math.floor(Math.random() * 2) + 1;
    
    let energyFirst = (eT/4) * amount;
    times[first] = energyFirst;
    total -= energyFirst;

    let waterFirst = (wT/4) * amount;
    waterTimes[first] = waterFirst;
    waterTotal -= waterFirst;


    let second;
    let secondAmount;
    
    if(amount == 2){
        for(let i = 0; i < times.length; i++){
            if( times[i] == null){
                times[i] = total/times.length - amount;
                waterTimes[i] = waterTotal/waterTimes.length - amount;
            }
        }
    }else{
        second = Math.floor(Math.random() * 3);
        while(second == first){
            second = Math.floor(Math.random() * 3);
        }

        secondAmount = Math.floor(Math.random() * 2) + 1;
        let energySecond = (total/ secondAmount);
        times[second] = energySecond;
        total -= energySecond;

        let waterSecond = (waterTotal/ secondAmount);
        waterTimes[second] = waterSecond;
        waterTotal -= waterSecond;

        for(let i = 0; i < times.length; i++){
            if( times[i] == null){
                times[i] = total/times.length - amount + secondAmount;
                waterTimes[i] = waterTotal/waterTimes.length - amount + secondAmount;
            }
        }
    }

    let dist = {
        energy: times,
        water: waterTimes
    }

    return dist;

}   

function onDocumentMouseDown(e) {
    e.preventDefault();
    
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
  
    let intersects = raycaster.intersectObjects(buildingsMeshes);

    

    if(intersects.length > 0){
        for(let i = 0; i < buildingsMeshes.length; i++){
            if(intersects[0].object.id == buildingsMeshes[i].id){
                let db = buildingsConsumption[i].dayCycle;
                console.log(buildingsConsumption[i])
                chart.config.data.datasets[0].data = [db.energy[0], db.energy[1], db.energy[2], db.energy[3], db.energy[0]];
                chart.config.data.datasets[1].data = [db.water[0], db.water[1], db.water[2], db.water[3], db.water[0]];
                chart.update();

                if(buildingsTypes[i] == 0){
                    lastHover = house1Outline;
                    lastHover.visible = true;
                    lastHover.position.copy(buildingsMeshes[i].position);
                    lastHover.rotation.copy(buildingsMeshes[i].rotation);
                }else if(buildingsTypes[i] == 1){
                    lastHover = house2Outline;
                    lastHover.visible = true;
                    lastHover.position.copy(buildingsMeshes[i].position);
                    lastHover.rotation.copy(buildingsMeshes[i].rotation);
                }else if(buildingsTypes[i] == 2){
                    lastHover = predioOutline;
                    lastHover.visible = true;
                    lastHover.position.copy(buildingsMeshes[i].position);
                    lastHover.rotation.copy(buildingsMeshes[i].rotation);
                }
            }
        }

    }else{
        if(e.target.id != "myChart"){
            let db = cityConsumption;
            chart.config.data.datasets[0].data = [db.energy[0], db.energy[1], db.energy[2], db.energy[3], db.energy[0]];
            chart.config.data.datasets[1].data = [db.water[0], db.water[1], db.water[2], db.water[3], db.water[0]];
            chart.update();
        }
        
    }

}

function onDocumentMouseMove(e) {
    e.preventDefault();

    
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
  
    let intersects = raycaster.intersectObjects(buildingsMeshes);

    if(intersects.length > 0){
        for(let i = 0; i < buildingsMeshes.length; i++){
            if(intersects[0].object.id == buildingsMeshes[i].id){
                if(buildingsTypes[i] == 0){
                    lastHover = house1Outline;
                    lastHover.visible = true;
                    lastHover.position.copy(buildingsMeshes[i].position);
                    lastHover.rotation.copy(buildingsMeshes[i].rotation);
                }else if(buildingsTypes[i] == 1){
                    lastHover = house2Outline;
                    lastHover.visible = true;
                    lastHover.position.copy(buildingsMeshes[i].position);
                    lastHover.rotation.copy(buildingsMeshes[i].rotation);
                }else if(buildingsTypes[i] == 2){
                    lastHover = predioOutline;
                    lastHover.visible = true;
                    lastHover.position.copy(buildingsMeshes[i].position);
                    lastHover.rotation.copy(buildingsMeshes[i].rotation);
                }
            }
        }
    }else{
        if(lastHover != null){
            lastHover.visible = false;
        }
    }
}