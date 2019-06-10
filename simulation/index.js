let cityBlocks = [];
let cityBlocksMeshes = [];
let buildingsMeshes = [];
let buildingsTypes = [];
let buildingsConsumption = [];
let buildingsConsumptionAnnual = [];
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

let zones = {
    zone1: [],
    zone2: [],
    zone3: [],
    zone4: []
}

let consumptionTable;
let useFrequency;

let house1Outline;
let house2Outline;
let predioOutline;

let lastHover;

let chart, rainChart, effectiveChart, flowChart, energyChart, waterChartUsed, waterChart, finalChart, energyBalanceChart;

let cityConsumption = {
    energy:[0,0,0,0],
    water: [0,0,0,0],
    people: 0,
    totalEnergy: 0,
    totalWater: 0
};

let annualCityConsumption = {
    energy:[0,0,0,0,0,0,0,0,0,0,0,0],
    water: [0,0,0,0,0,0,0,0,0,0,0,0],
    totalEnergy: 0,
    totalWater: 0
}

var mouse = new THREE.Vector2();
       
var scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(255,255,255)");
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var aspect = window.innerWidth / window.innerHeight;
var d = 20;
camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );

camera.position.set( 35, 20, 35 ); 
camera.lookAt( scene.position ); 

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
scene.add( directionalLight );

directionalLight.position.set(20,20,20);
directionalLight.castShadow = true;
directionalLight.lookAt( scene.position );

var light = new THREE.AmbientLight( 0x404040 ); 
scene.add( light );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
let renderDiv = document.getElementById("renderDiv");
renderDiv.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera,  renderer.domElement);

var geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
var materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(139,69,19)") } );

consumptionValues();

importPrefabs();


// window.addEventListener( 'mousedown', onDocumentMouseDown, false );
// window.addEventListener( 'mousemove', onDocumentMouseMove, false );

function animate() {
    requestAnimationFrame( animate );

    controls.update();

    if(!loaded){
        if ( road instanceof THREE.Mesh && roadCorners instanceof THREE.Mesh) {
            // createOutlines();
            generateCity(30,30);
            loaded = !loaded;
        }
    }

    renderer.render( scene, camera );
}

animate();

// function createOutlines(){
//     var edges1 = new THREE.EdgesGeometry( house.geometry );
//     house1Outline = new THREE.LineSegments( edges1, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
//     scene.add(house1Outline);

//     var edges2 = new THREE.EdgesGeometry( house2.geometry );
//     house2Outline = new THREE.LineSegments( edges2, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
//     scene.add(house2Outline);

//     var edges3 = new THREE.EdgesGeometry( predio.geometry );
//     predioOutline = new THREE.LineSegments( edges3, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
//     scene.add(predioOutline);
// }

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
                let materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(187,113,108)") } );
                let ground = new THREE.Mesh( geometryGround, materialGround );
                ground.receiveShadow = true;
                cityBlocksMeshes[i][j] = ground;
            }else if( cityBlocks[i][j] === "b"){
                let geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
                let materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(187,113,108)") } );
                let ground = new THREE.Mesh( geometryGround, materialGround );
                ground.receiveShadow = true;
                cityBlocksMeshes[i][j] = ground;
            }else if( cityBlocks[i][j] === "s"){
                let geometryGround = new THREE.BoxGeometry( 1, 1, 1 );
                let materialGround = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(187,113,108))") } );
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

    createZones()
}

function createZones(){

    var geometry = new THREE.PlaneGeometry( 15.2, 15 );
    var material = new THREE.MeshBasicMaterial( {color: new THREE.Color("rgb(0,120,0)"), transparent: true, opacity: 0.75, side: THREE.DoubleSide } );
    let zone3 = new THREE.Mesh( geometry, material );
    zone3.position.set(7, 2, 7.5);
    zone3.rotation.x = Math.PI/2;
    scene.add( zone3 );

    var geometry = new THREE.PlaneGeometry( 15, 15 );
    var material = new THREE.MeshBasicMaterial( {color: new THREE.Color("rgb(0,0,120)"), transparent: true, opacity: 0.75, side: THREE.DoubleSide } );
    let zone1 = new THREE.Mesh( geometry, material );
    zone1.position.set(-8, 2, -7.5);
    zone1.rotation.x = Math.PI/2;
    scene.add( zone1 );

    var geometry = new THREE.PlaneGeometry( 15.2, 15 );
    var material = new THREE.MeshBasicMaterial( {color: new THREE.Color("rgb(120,0,0)"), transparent: true, opacity: 0.75, side: THREE.DoubleSide } );
    let zone2 = new THREE.Mesh( geometry, material );
    zone2.position.set(7, 2, -7.5);
    zone2.rotation.x = Math.PI/2;
    scene.add( zone2 );

    var geometry = new THREE.PlaneGeometry( 15, 15 );
    var material = new THREE.MeshBasicMaterial( {color: new THREE.Color("rgb(120,0,120)"), transparent: true, opacity: 0.75, side: THREE.DoubleSide } );
    let zone4 = new THREE.Mesh( geometry, material );
    zone4.position.set(-8, 2, 7.5);
    zone4.rotation.x = Math.PI/2;
    scene.add( zone4 );


    for(let i = 0; i < cityBlocks.length; i++){
        for(let j = 0; j < cityBlocks[i].length; j++){
            if(cityBlocks[i][j] === "b"){

                let tempPos = new THREE.Vector3();
                tempPos.copy(cityBlocksMeshes[i][j].position);
                tempPos.y = 3;
                var dotGeometry = new THREE.Geometry();
                dotGeometry.vertices.push(tempPos);

                var dotMaterial = new THREE.PointsMaterial({
                size: 10,
                sizeAttenuation: false
                });
                

                if(i < 15 && j < 15){
                    zones.zone1.push(tempPos)
                    dotMaterial.color = new THREE.Color("rgb(0,0,120)");
                }else if(i >= 15 && j < 15){
                    zones.zone2.push(tempPos)
                    dotMaterial.color = new THREE.Color("rgb(120,0,0)");
                }else if(i >= 15 && j > 15){
                    zones.zone3.push(tempPos)
                    dotMaterial.color = new THREE.Color("rgb(0,120,0)");
                }else if(i < 15 && j > 15){
                    zones.zone4.push(tempPos)
                    dotMaterial.color = new THREE.Color("rgb(120,0,120)");
                }
                var dot = new THREE.Points(dotGeometry, dotMaterial);
                scene.add(dot);
            }
        }
    }

    
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
            tempHouse.position.y += 0.5;
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
            shower: 1350, 
            lamp: 9,
            freezer: 500,
            dish: 1500,
            washer: 1000,
            dryer: 3500,
            tv: 90
        },
        water:{
            sink: 1.5,
            shower: 90,
            toilet: 4,
            washer: 8.4,
            dish: 15,
        }
        
    }

}

function generateConsumption(){
    for(let i = 0; i < buildingsTypes.length; i++){

        let people = generatePeople(buildingsTypes[i]);
        useFrequency = randomizeUsage(people);
        let energy = generateEnergyGoods(buildingsTypes[i]);
        let water = generateWaterGoods(buildingsTypes[i], energy);
        let energyConsumption = generateEnergyConsumption(energy, useFrequency);
        let waterConsumption = generateWaterConsumption(water, useFrequency);

        let energyTotal = Math.floor(sumObjs(energyConsumption));
        let waterTotal =  Math.floor(sumObjs(waterConsumption));
        
        let distribution = distributeEnergy(energyTotal, waterTotal);

        let houseStats = {
            dayCycle: distribution,
            people: people,
            energy: {
                total: energyTotal,
                quantity: energy,
                consumption: energyConsumption
            },
            water: {
                total: waterTotal,
                quantity: water,
                consumption: waterConsumption
            },
            frequency: useFrequency,
        }

        buildingsConsumption.push(houseStats);
    }
    console.log(buildingsConsumption[0]);
    

    calculateTotal();
}

function calculateTotal(){
    for(let i = 0; i < buildingsConsumption.length; i++){
        cityConsumption.energy[0] += Math.floor(buildingsConsumption[i].dayCycle.energy[0]);
        cityConsumption.water[0] += Math.floor(buildingsConsumption[i].dayCycle.water[0]);

        cityConsumption.energy[1] += Math.floor(buildingsConsumption[i].dayCycle.energy[1]);
        cityConsumption.water[1] += Math.floor(buildingsConsumption[i].dayCycle.water[1]);

        cityConsumption.energy[2] += Math.floor(buildingsConsumption[i].dayCycle.energy[2]);
        cityConsumption.water[2] += Math.floor(buildingsConsumption[i].dayCycle.water[2]);

        cityConsumption.energy[3] += Math.floor(buildingsConsumption[i].dayCycle.energy[3]);
        cityConsumption.water[3] += Math.floor(buildingsConsumption[i].dayCycle.water[3]);

        cityConsumption.people += buildingsConsumption[i].people;
    }

    document.getElementById("pop").textContent = "Population: "+cityConsumption.people;
    cityConsumption.totalEnergy = cityConsumption.energy[0] + cityConsumption.energy[1] + cityConsumption.energy[2] + cityConsumption.energy[3];
    cityConsumption.totalWater = cityConsumption.water[0] + cityConsumption.water[1] + cityConsumption.water[2] + cityConsumption.water[3];


    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for(let i = 0; i < days.length; i++){
        let monthTotal = {
            energy: 0,
            water: 0
        }
        for(let j = 0; j < buildingsConsumption.length; j++){
        
            let b = buildingsConsumption[j];
    
            useFrequency = randomizeUsage(b.people);
            let energyConsumption = generateEnergyConsumption(b.energy.quantity, useFrequency, days[i]);
            let waterConsumption = generateWaterConsumption(b.water.quantity, useFrequency, days[i]);
    
            let energyTotal = Math.floor(sumObjs(energyConsumption));
            let waterTotal =  Math.floor(sumObjs(waterConsumption));
    
            monthTotal.energy += energyTotal;
            monthTotal.water += waterTotal;
    
        }
        annualCityConsumption.energy[i] = monthTotal.energy;
        annualCityConsumption.water[i] = monthTotal.water/10;
    }

    createChart();
}

function createChart(){

    let db = annualCityConsumption;

    Chart.defaults.global.defaultFontColor = 'black';
    let ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['jan', 'feb', 'mar','apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                label: "Energy (GW/h)",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                
                data: [db.energy[0]/Math.pow(10, 6), db.energy[1]/Math.pow(10, 6), db.energy[2]/Math.pow(10, 6),
                       db.energy[3]/Math.pow(10, 6), db.energy[4]/Math.pow(10, 6), db.energy[5]/Math.pow(10, 6),
                       db.energy[6]/Math.pow(10, 6), db.energy[7]/Math.pow(10, 6), db.energy[8]/Math.pow(10, 6),
                       db.energy[9]/Math.pow(10, 6), db.energy[10]/Math.pow(10, 6), db.energy[11]/Math.pow(10, 6)]
            },
            {
                label: "Water (L /10^6)",
                backgroundColor: 'rgb(50, 50, 90)',
                borderColor: 'rgb(50, 50, 90)',
                
                data: [db.water[0]/Math.pow(10,6), db.water[1]/Math.pow(10,6), db.water[2]/Math.pow(10,6),
                       db.water[3]/Math.pow(10,6), db.water[4]/Math.pow(10,6), db.water[5]/Math.pow(10,6),
                       db.water[6]/Math.pow(10,6), db.water[7]/Math.pow(10,6), db.water[8]/Math.pow(10,6),
                       db.water[9]/Math.pow(10,6), db.water[10]/Math.pow(10,6), db.water[11]/Math.pow(10,6)]
            }
        ]
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

    

    let rain = document.getElementById('rainGraph').getContext('2d');
    rainChart = new Chart(rain, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['jan', 'feb', 'mar','apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                label: "Rain (mm)",
                backgroundColor: 'rgb(50, 50, 90)',
                borderColor: 'rgb(50, 50, 90)',
                data: [50, 100, 190, 200, 170, 180, 170, 100, 60, 50, 20, 50]
            }]
        },

        // Configuration options go here
        options: {
           // maintainAspectRatio: false,
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

    let rainE = document.getElementById('effectiveGraph').getContext('2d');
    effectiveChart = new Chart(rainE, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['jan', 'feb', 'mar','apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                label: "Effective Rain (mm)",
                backgroundColor: 'rgb(50, 50, 90)',
                borderColor: 'rgb(50, 50, 90)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
        },

        // Configuration options go here
        options: {
           
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

    let flowRiver = document.getElementById('riverFlow').getContext('2d');
    flowChart = new Chart(flowRiver, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['jan', 'feb', 'mar','apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                label: "River Flow (m3/s)",
                backgroundColor: 'rgb(50, 50, 90)',
                borderColor: 'rgb(50, 50, 90)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
        },

        // Configuration options go here
        options: {
            //maintainAspectRatio: false,
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

    let energyProduction = document.getElementById('energyProduction').getContext('2d');
    energyChart = new Chart(energyProduction, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['jan', 'feb', 'mar','apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                label: "Energy Produced (GW/h)",
                backgroundColor: 'rgb(50, 50, 90)',
                borderColor: 'rgb(50, 50, 90)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
        },

        // Configuration options go here
        options: {
            //maintainAspectRatio: false,
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

    let waterUsed = document.getElementById('waterUsed').getContext('2d');
    waterChartUsed = new Chart(waterUsed, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['jan', 'feb', 'mar','apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                label: "Water Collected (L /10^9)",
                backgroundColor: 'rgb(50, 50, 90)',
                borderColor: 'rgb(50, 50, 90)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
        },

        // Configuration options go here
        options: {
            maintainAspectRatio: true,
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

    let waterProduction = document.getElementById('waterProduction').getContext('2d');
    waterChart = new Chart(waterProduction, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['jan', 'feb', 'mar','apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                label: "Water Distributed (L /10^9)",
                backgroundColor: 'rgb(50, 50, 90)',
                borderColor: 'rgb(50, 50, 90)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
        },

        // Configuration options go here
        options: {
            //maintainAspectRatio: false,
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

    let energyBalance = document.getElementById('energyBalance').getContext('2d');
    energyBalanceChart = new Chart(energyBalance, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['jan', 'feb', 'mar','apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                label: "Energy Produced (GW/h)",
                backgroundColor: 'rgb(195, 209, 68)',
                borderColor: 'rgb(195, 209, 68)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },{
                label: "Energy Consumed (GW/h)",
                backgroundColor: 'rgb(180, 00, 00)',
                borderColor: 'rgb(180, 00, 00)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
        },

        // Configuration options go here
        options: {
            //maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        color: 'rgb(0, 0, 0)'
                    },
                }],
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        color: 'rgb(0, 0, 0)'
                    },
                }]
            }
        }
    });


    let final = document.getElementById('finalChart').getContext('2d');
    finalChart = new Chart(final, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['jan', 'feb', 'mar','apr','may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                label: "River Flow (m3/s)",
                backgroundColor: 'rgb(50, 50, 90)',
                borderColor: 'rgb(50, 50, 90)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                label: "Flow for energy (m3/s)",
                backgroundColor: 'rgb(195, 209, 68)',
                borderColor: 'rgb(195, 209, 68)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                label: "Flow for water (m3/s)",
                backgroundColor: 'rgb(153,204,255)',
                borderColor: 'rgb(153,204,255)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
        },

        // Configuration options go here
        options: {
            //maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        color: 'rgb(0, 0, 0)'
                    },
                }],
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        color: 'rgb(0, 0, 0)'
                    },
                }]
            }
        }
    });


    chart.update();
    rainChart.update();
    effectiveChart.update();
    flowChart.update();
    energyChart.update();
}

function sumObjs(obj){
    return Object.values(obj).reduce((a, b) => a + b);  
}

function generatePeople(type){
    if(type == 0){
        return Math.floor(Math.random() * (6 - 1)) + 1;
    }else if(type == 1){
        return Math.floor(Math.random() * (7 - 3) ) + 3;
    }else if(type == 2){
        return Math.floor(Math.random() * (96 - 16) ) + 16;
    }
}

function generateEnergyGoods(type){
    if(type == 0){
        energyGoods = {
            lamp: Math.floor(Math.random() * (14 - 4)) + 4,
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
            lamp: Math.floor(Math.random() * (26 - 8)) + 8,
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
            lamp: Math.floor(Math.random() * (224 - 64)) + 64,
            shower: 16,
            freezer: 16,
            dish: Math.floor(Math.random() * 16),
            tv: Math.floor(Math.random() * 48),
            washer:  16,
            dryer:  16,
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

function generateEnergyConsumption(energy, f, days){
    let d = 1;
    if(days != null){
        d = days;
    }

    let tempObj = {
        lamp: (energy.lamp * consumptionTable.energy.lamp * f.lamp * d)/1000,
        shower: (energy.shower * consumptionTable.energy.shower * f.shower * d)/1000,
        freezer: (energy.freezer * consumptionTable.energy.freezer * 10 * d)/1000,
        dish: (energy.dish * consumptionTable.energy.dish * f.dish * d)/1000,
        tv: (energy.tv * consumptionTable.energy.tv * f.tv * d)/1000,
        washer: (energy.washer * consumptionTable.energy.washer * f.washer * d)/1000,
        dryer: (energy.dryer * consumptionTable.energy.dryer * f.dryer * d)/1000,
    }

    return tempObj;
}

function generateWaterConsumption(water, f, days){
    let d = 1;
    if(days != null){
        d = days;
    }


    let tempObj = {
        sink: (water.sink * consumptionTable.water.sink * f.sink * d),
        toilet: (water.toilet * consumptionTable.water.toilet * f.toilet * d),
        shower: (water.shower * consumptionTable.water.shower * f.shower * d),
        dish: (water.dish * consumptionTable.water.dish * f.dish * d),
        washer: (water.washer * consumptionTable.water.washer * f.washer * d),
    }

    return tempObj;
}

function randomizeUsage(p){

    let tempObj = {
        lamp: Math.floor(Math.random() * 21),
        shower: p * (Math.floor(Math.random() * 3) + 1),
        dish: Math.floor(Math.random() * 4),
        tv: Math.floor(Math.random() * 21),
        washer: Math.floor(Math.random() * 3),
        dryer: Math.floor(Math.random() * 3),
        toilet: p * Math.floor(Math.random() * 10) ,
        sink: p * Math.floor(Math.random() * 10),
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

// function onDocumentMouseDown(e) {
   
    
//     mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//     mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  
//     let raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, camera);
  
//     let intersects = raycaster.intersectObjects(buildingsMeshes);

    

//     if(intersects.length > 0){
//         for(let i = 0; i < buildingsMeshes.length; i++){
//             if(intersects[0].object.id == buildingsMeshes[i].id){
//                 // let db = buildingsConsumption[i].dayCycle;
//                 console.log(buildingsConsumption[i])
//                 console.log(buildingsConsumptionAnnual[i])
//                 // chart.config.data.datasets[0].data = [db.energy[0], db.energy[1], db.energy[2], db.energy[3], db.energy[0]];
//                 // chart.config.data.datasets[1].data = [db.water[0], db.water[1], db.water[2], db.water[3], db.water[0]];
//                 // chart.update();

//                 if(buildingsTypes[i] == 0){
//                     lastHover = house1Outline;
//                     lastHover.visible = true;
//                     lastHover.position.copy(buildingsMeshes[i].position);
//                     lastHover.rotation.copy(buildingsMeshes[i].rotation);
//                 }else if(buildingsTypes[i] == 1){
//                     lastHover = house2Outline;
//                     lastHover.visible = true;
//                     lastHover.position.copy(buildingsMeshes[i].position);
//                     lastHover.rotation.copy(buildingsMeshes[i].rotation);
//                 }else if(buildingsTypes[i] == 2){
//                     lastHover = predioOutline;
//                     lastHover.visible = true;
//                     lastHover.position.copy(buildingsMeshes[i].position);
//                     lastHover.rotation.copy(buildingsMeshes[i].rotation);
//                 }
//             }
//         }

//     }else{
//         if(e.target.id != "myChart"){
//             // let db = cityConsumption;
//             // chart.config.data.datasets[0].data = [db.energy[0], db.energy[1], db.energy[2], db.energy[3], db.energy[0]];
//             // chart.config.data.datasets[1].data = [db.water[0], db.water[1], db.water[2], db.water[3], db.water[0]];
//              chart.update();
//         }
        
//     }

// }

// function onDocumentMouseMove(e) {
    
//     mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//     mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  
//     let raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, camera);
    
//     let intersects = raycaster.intersectObjects(buildingsMeshes);
//     if(e.path[1].id == "renderDiv"){
//         if(intersects.length > 0){
//             for(let i = 0; i < buildingsMeshes.length; i++){
//                 if(intersects[0].object.id == buildingsMeshes[i].id){
//                     if(buildingsTypes[i] == 0){
//                         lastHover = house1Outline;
//                         lastHover.visible = true;
//                         lastHover.position.copy(buildingsMeshes[i].position);
//                         lastHover.rotation.copy(buildingsMeshes[i].rotation);
//                     }else if(buildingsTypes[i] == 1){
//                         lastHover = house2Outline;
//                         lastHover.visible = true;
//                         lastHover.position.copy(buildingsMeshes[i].position);
//                         lastHover.rotation.copy(buildingsMeshes[i].rotation);
//                     }else if(buildingsTypes[i] == 2){
//                         lastHover = predioOutline;
//                         lastHover.visible = true;
//                         lastHover.position.copy(buildingsMeshes[i].position);
//                         lastHover.rotation.copy(buildingsMeshes[i].rotation);
//                     }
//                 }
//             }
//         }else{
//             if(lastHover != null){
//                 lastHover.visible = false;
//             }
//         }
//     }
// }

function calculateData(){
    let L = parseFloat(document.getElementById("l").value);
    let H = parseFloat(document.getElementById("h").value);
    let A = parseFloat(document.getElementById("a").value);
    let baseFlow = parseFloat(document.getElementById("v").value);
    let N = parseFloat(document.getElementById("n").value);
    let C = parseFloat(document.getElementById("cf").value);

    let tc = (57 *  Math.pow((Math.pow(L, 3) / H), 0.385))/60;

    let tr = tc/5;

    let tp = 0.6 * tc + 0.5 * tr;

    let tb = Math.floor(2.6*tp);
    

    let E =  parseFloat(document.getElementById("e").value);
    let D = parseFloat(document.getElementById("d").value);
    let R = parseFloat(document.getElementById("r").value);

    var months = document.getElementById("rainConfigs").getElementsByTagName("input"); 

    rainChart.config.data.datasets[0].data = [months[0].value,months[1].value,months[2].value,months[3].value,
                                              months[4].value,months[5].value,months[6].value,months[7].value,
                                              months[8].value,months[9].value,months[10].value,months[11].value];
    rainChart.update();

    let effectiveRain = [];
    let riverFlow = [];
    let energyArr = [];
    
    for(let i = 0; i < 12; i++){
        let value = calculateEffectiveRain(months[i].value, N);
        let flow = calculateRiverFlow(value, A, tb);
        let energyGenerated = calculateEnergy(E, baseFlow + flow, R, D, C);
        
        effectiveRain.push(value);
        riverFlow.push( baseFlow + flow);
        energyArr.push(energyGenerated);

    }

    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let waterArr = [];
    for(let i = 0; i < annualCityConsumption.water.length; i++){
        let q = (annualCityConsumption.water[i]/days[i])/cityConsumption.people;
        let w = calculateWater(q);
        waterArr.push(w);
    }
    
    effectiveChart.config.data.datasets[0].data = [effectiveRain[0],effectiveRain[1],effectiveRain[2],effectiveRain[3],
                                                   effectiveRain[4],effectiveRain[5],effectiveRain[6],effectiveRain[7],
                                                   effectiveRain[8],effectiveRain[9],effectiveRain[10],effectiveRain[11]];
    effectiveChart.update();


    flowChart.config.data.datasets[0].data = [riverFlow[0],riverFlow[1],riverFlow[2],riverFlow[3],
                                                   riverFlow[4],riverFlow[5],riverFlow[6],riverFlow[7],
                                                   riverFlow[8],riverFlow[9],riverFlow[10],riverFlow[11]];
    flowChart.update();

    energyChart.config.data.datasets[0].data = [energyArr[0]/Math.pow(10, 6),energyArr[1]/Math.pow(10, 6),energyArr[2]/Math.pow(10, 6),energyArr[3]/Math.pow(10, 6),
                                                   energyArr[4]/Math.pow(10, 6),energyArr[5]/Math.pow(10, 6),energyArr[6]/Math.pow(10, 6),energyArr[7]/Math.pow(10, 6),
                                                   energyArr[8]/Math.pow(10, 6),energyArr[9]/Math.pow(10, 6),energyArr[10]/Math.pow(10, 6),energyArr[11]/Math.pow(10, 6)];
    energyChart.update();

    waterChartUsed.config.data.datasets[0].data = [waterArr[0].production,waterArr[1].production,waterArr[2].production,waterArr[3].production,
                                                   waterArr[4].production,waterArr[5].production,waterArr[6].production,waterArr[7].production,
                                                   waterArr[8].production,waterArr[9].production,waterArr[10].production,waterArr[11].production];
    waterChartUsed.update();

    waterChart.config.data.datasets[0].data = [waterArr[0].distributed,waterArr[1].distributed,waterArr[2].distributed,waterArr[3].distributed,
                                                waterArr[4].distributed,waterArr[5].distributed,waterArr[6].distributed,waterArr[7].distributed,
                                                waterArr[8].distributed,waterArr[9].distributed,waterArr[10].distributed,waterArr[11].distributed];
    waterChart.update();


    
    for(let i = 0; i < 12; i++){
        let flowEnergy = (riverFlow[i]*R)/100;
        let flowWater = (waterArr[i].production*Math.pow(10,9)/86400 * 30)/1000;

        finalChart.config.data.datasets[0].data[i] = riverFlow[i]-flowEnergy-flowWater;
        finalChart.config.data.datasets[1].data[i] = flowEnergy;
        finalChart.config.data.datasets[2].data[i] = flowWater;
    }
    finalChart.update();

    for(let i = 0; i < 12; i++){
        let surplus = energyArr[i] - annualCityConsumption.energy[i];
        energyBalanceChart.config.data.datasets[0].data[i] = surplus/Math.pow(10,6);
        energyBalanceChart.config.data.datasets[1].data[i] = annualCityConsumption.energy[i]/Math.pow(10,6);
    }
    energyBalanceChart.update();
    

    
}

function calculateEffectiveRain(R, N){
    let P = parseFloat(R)
    let firstHalve = (P - 5080 / N + 50.8);
    let secondHalve = (P + 20320 / N - 203.2);
    let effective = Math.pow(firstHalve, 2) / secondHalve;

    return Math.floor(effective);
}

function calculateRiverFlow(pe, a, t){
    let flowRate = (2 * (pe / 1000) * (a * Math.pow(10, 6)))/( t * 3600);
    return Math.floor(flowRate);
}

function calculateEnergy(e, f, p, d, c){
    let P = (e * ((f * p)*1000) * d)/100;
    let Em = 730 * P * (c/100);
    return Math.floor(Em);
}

function calculateWater(q){
    let k1 = parseFloat(document.getElementById("k1").value);
    let k2 = parseFloat(document.getElementById("k2").value);
    let t = parseFloat(document.getElementById("wt").value);
    let wc = parseFloat(document.getElementById("wc").value);

    let P = cityConsumption.people;
    
    let Q = ((P * q)/86400);

    let qProduction = ((Q * k1 * 24)/t) * (1 + (wc/100));

    let qDistribution = (Q * k1 * k2);
    
    console.log((qProduction) );
    
    let water = {
        production: (qProduction * 86400 * 30)/Math.pow(10, 9),
        distributed: (qDistribution * 86400 * 30)/Math.pow(10, 9)
    }
    return water;
}
