/// <reference path="../core/_reference.ts"/>

/* 
Author: Ryan Sterling 300509648-->
Source File Name: Comp 392 Assignment 03 -->
Last Modified By: Ryan Sterling 300509648-->
Date Last Modified By: April 17,2016 -->
Program Description: Jumping Justice-->
Revision History: https://github.com/ryans3/Comp392Assignment03 -->
*/


/**
 * The Scenes module is a namespace to reference all scene objects
 * 
 * @module scenes
 */
module scenes {
    /**
     * The Play class is where the main action occurs for the game
     * 
     * @class Play
     * @param havePointerLock {boolean}
     */
    export class Play extends scenes.Scene {
        private havePointerLock: boolean;
        private element: any;

        private blocker: HTMLElement;
        private instructions: HTMLElement;
        private spotLight: SpotLight;
        private dirLight: DirectionalLight;
        private groundGeometry: CubeGeometry;
        private groundPhysicsMaterial: Physijs.Material;
        private groundMaterial: PhongMaterial;
        private ground: Physijs.Mesh;
        private groundTexture: Texture;
        private groundTextureNormal: Texture;
        private playerGeometry: CubeGeometry;
        private playerMaterial: Physijs.Material;
        private player: Physijs.Mesh;
        private keyboardControls: objects.KeyboardControls;
        private mouseControls: objects.MouseControls;
        private isGrounded: boolean;
        
        private helperAxis: AxisHelper;
        
        //Next Ground Material
        private groundGeometryNext: CubeGeometry;
        private groundPhysicsMaterialNext: Physijs.Material;
        private groundMaterialNext: PhongMaterial;
        private groundNext: Physijs.Mesh;
        private groundTextureNext: Texture;
        private groundTextureNormalNext: Texture;
        
        //Pickup
        private sphereGeometryPickup:SphereGeometry;
        private sphereMaterialPickup: Physijs.Material;
        private spherePickup: Physijs.SphereMesh;
        //Next Spotlight 
        private spotLightNext: SpotLight;
        private pointLight: PointLight;
        
        
        //Player Looper Variables
        //Code for player position and setup
        private playersZPosition: number;
        private generatorCounter: number;
        private nextGroundZPosition: number;
        
        //Code for enemies
        private enemyGeometry: BoxGeometry;
        private enemyMaterial: Physijs.Material;
        private enemyOne: Physijs.Mesh;
        private enemyTwo: Physijs.Mesh;
        private enemyThree: Physijs.Mesh;
        
      
        
        //Coin Material Take out later
        private coinGeometry: Geometry;
        private coinMaterial: Physijs.Material;
        private coins: Physijs.ConcaveMesh[];
        private coinCount: number;
        
        private deathPlaneGeometry: CubeGeometry;
        private deathPlaneMaterial: Physijs.Material;
        private deathPlane: Physijs.Mesh;

        private velocity: Vector3;
        private prevTime: number;
        private clock: Clock;

        private stage: createjs.Stage;
        private scoreLabel: createjs.Text;
        private livesLabel: createjs.Text;
        private scoreValue: number;
        private livesValue: number;

        private playerSpeedZ: number;
        /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
        
        /**
         * @constructor
         */
        constructor() {
            super();

            this._initialize();
            this.start();
        }

        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++

        /**
         * Sets up the initial canvas for the play scene
         * 
         * @method setupCanvas
         * @return void
         */
        private _setupCanvas(): void {
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
            canvas.style.backgroundColor = "#000000";
        }

        /**
         * The initialize method sets up key objects to be used in the scene
         * 
         * @method _initialize
         * @returns void
         */
        private _initialize(): void {
            // Create to HTMLElements
            this.blocker = document.getElementById("blocker");
            this.instructions = document.getElementById("instructions");
            this.blocker.style.display = "block";

            // setup canvas for menu scene
            this._setupCanvas();


            this.coinCount = 10;
            this.prevTime = 0;
            this.stage = new createjs.Stage(canvas);
            this.velocity = new Vector3(0, 0, 0);
            
            this.playersZPosition = 0;
            this.generatorCounter = 0;
            this.nextGroundZPosition = 20;

            

            // setup a THREE.JS Clock object
            this.clock = new Clock();

            // Instantiate Game Controls
            this.keyboardControls = new objects.KeyboardControls();
            this.mouseControls = new objects.MouseControls();

            this.playerSpeedZ = 2000;
        }
        /**
         * This method sets up the scoreboard for the scene
         * 
         * @method setupScoreboard
         * @returns void
         */
        private setupScoreboard(): void {
            // initialize  score and lives values
            this.scoreValue = 0;
            this.livesValue = 100;

            // Add Lives Label
            this.livesLabel = new createjs.Text(
                "LIVES: " + this.livesValue,
                "40px Consolas",
                "#ffffff"
            );
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");

            // Add Score Label
            this.scoreLabel = new createjs.Text(
                "SCORE: " + this.scoreValue,
                "40px Consolas",
                "#ffffff"
            );
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");
        }

        /**
         * Add a spotLight to the scene
         * 
         * @method addSpotLight
         * @return void
         */
        private addSpotLight(): void {
            // Spot Light
            this.spotLight = new SpotLight(0xffffff);
            this.spotLight.position.set(0,50,0);
            this.spotLight.castShadow = true;
            this.spotLight.intensity = 2;
            this.spotLight.target = this.ground;
            this.spotLight.shadowCameraNear = 2;
            this.spotLight.shadowCameraFar = 200;
            this.spotLight.shadowCameraLeft = -5;
            this.spotLight.shadowCameraRight = 5;
            this.spotLight.shadowCameraTop = 5;
            this.spotLight.shadowCameraBottom = -5;
            this.spotLight.shadowMapWidth = 2048;
            this.spotLight.shadowMapHeight = 2048;
            this.spotLight.shadowDarkness = 0.5;
            this.spotLight.name = "Spot Light";
            this.add(this.spotLight);
            console.log("Added spotLight to scene");

            this.dirLight = new DirectionalLight(0xffffff, 1);
            this.add(this.dirLight);
            console.log("Added dir Light to scene");
        }
        
        
        /**
         * 
         * creates new Spotlight
         
        
        private addSpotlightNextMERGE():void{
            
            var axisHelper = new THREE.AxisHelper( 5 );
            scene.add( axisHelper );
            
            this.spotLightNext = new SpotLight(0xffffff);
            this.spotLightNext.position.set(0,50,this.groundNext.position.z);
            this.spotLightNext.castShadow = true;
            this.spotLightNext.intensity = 2;
            this.spotLightNext.target = this.groundNext;
            this.spotLightNext.shadowCameraNear = 2;
            this.spotLightNext.shadowCameraFar = 200;
            this.spotLightNext.shadowCameraLeft = -5;
            this.spotLightNext.shadowCameraRight = 5;
            this.spotLightNext.shadowCameraTop = 5;
            this.spotLightNext.shadowCameraBottom = -5;
            this.spotLightNext.shadowMapWidth = 2048;
            this.spotLightNext.shadowMapHeight = 2048;
            this.spotLightNext.shadowDarkness = 0.5;
            this.spotLightNext.name = "Spot Light";
            this.add(this.spotLightNext);
            
            console.log("Added Second spotlight added to scene");
            
        }
        
        
        /**
         * 
         * creates new Spotlight
         
        
        private addSpotlightNext():void{
            
            var axisHelper = new THREE.AxisHelper( 5 );
            scene.add( axisHelper );
            
            this.spotLightNext = new SpotLight(0xffffff);
            this.spotLightNext.position.set(0,50,this.groundNext.position.z);
            this.spotLightNext.castShadow = true;
            this.spotLightNext.intensity = 2;
            this.spotLightNext.target = this.groundNext;
            this.spotLightNext.shadowCameraNear = 2;
            this.spotLightNext.shadowCameraFar = 200;
            this.spotLightNext.shadowCameraLeft = -5;
            this.spotLightNext.shadowCameraRight = 5;
            this.spotLightNext.shadowCameraTop = 5;
            this.spotLightNext.shadowCameraBottom = -5;
            this.spotLightNext.shadowMapWidth = 2048;
            this.spotLightNext.shadowMapHeight = 2048;
            this.spotLightNext.shadowDarkness = 0.5;
            this.spotLightNext.name = "Spot Light";
            this.add(this.spotLightNext);
            
            console.log("Added Second spotlight added to scene");
            
        }
        */

        /**
         * Add a ground plane to the scene
         * 
         * @method addGround
         * @return void
         
        private addGround(): void {
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/GravelCobble.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);

            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/GravelCobbleNormal.png');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);

            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            // this.groundMaterial.bumpMap = this.groundTextureNormal;
            // this.groundMaterial.bumpScale = 0.2;


            this.groundGeometry = new BoxGeometry(32, 1, 50);

            this.groundGeometry = new BoxGeometry(32, 1, 150);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Burnt Ground to scene");
        }
        */
        
        /**
         * Initializes the first Ground
         * 
         * @method initializeFirstGround
         */
        private initializeFirstGround(){
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/road-seamless.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(4, 256);

            // this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/GravelCobbleNormal.png');
            // this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            // this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            // this.groundTextureNormal.repeat.set(16, 16);

            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            //this.groundMaterial.bumpMap = this.groundTextureNormal;
            //this.groundMaterial.bumpScale = 0.2;

            this.groundGeometry = new BoxGeometry(32, 1, 4000);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.position.set(0,0, 1950);
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Burnt Ground to scene");
        }
        
        
        /**
         * Initializes the first Ground
         * 
         * @method initializeFirstGround
         
        private initializeFirstGroundMERGE(){
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/GravelCobble.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);

            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/GravelCobbleNormal.png');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);

            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            // this.groundMaterial.bumpMap = this.groundTextureNormal;
            // this.groundMaterial.bumpScale = 0.2;

            this.groundGeometry = new BoxGeometry(32, 1, 50);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.position.set(0,0,0);
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Burnt Ground to scene");
        }
        */
        
        /**
         * Initializes the second Ground
         * 
         * @method Initialize the second ground
         
        private initializeSecondGround(){
            this.groundTextureNext = new THREE.TextureLoader().load('../../Assets/images/road-seamless.jpg');

            this.groundTextureNext.wrapS = THREE.RepeatWrapping;
            this.groundTextureNext.wrapT = THREE.RepeatWrapping;
            this.groundTextureNext.repeat.set(8, 8);

            this.groundTextureNormalNext = new THREE.TextureLoader().load('../../Assets/images/road-seamless.jpg');
            this.groundTextureNormalNext.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormalNext.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormalNext.repeat.set(8, 8);

            this.groundMaterialNext = new PhongMaterial();

            this.groundMaterialNext.map = this.groundTextureNext;
            this.groundMaterialNext.bumpMap = this.groundTextureNormal;
            this.groundMaterialNext.bumpScale = 0.2;

            this.groundGeometryNext = new BoxGeometry(32, 1, 150);
            this.groundPhysicsMaterialNext = Physijs.createMaterial(this.groundMaterialNext, 0, 0);
            this.groundNext = new Physijs.ConvexMesh(this.groundGeometryNext, this.groundPhysicsMaterialNext, 0);
            this.groundNext.receiveShadow = true;
            this.groundNext.name = "Ground";
            this.groundNext.position.set(0,0,this.nextGroundZPosition);
            //this.add(this.groundNext);
            console.log("Added Road Ground to scene");
        }
        */
        /**
         * creates the pickup at a random place 
         */
        
        private createPickups():void{
            
            var max = this.nextGroundZPosition + 75;
            var min = this.nextGroundZPosition + 50;   
            this.sphereGeometryPickup = new SphereGeometry(1,32,32);
            this.sphereMaterialPickup = Physijs.createMaterial(new LambertMaterial({color: 0xffaa11}),0.4,0);
            this.spherePickup = new Physijs.SphereMesh(this.sphereGeometryPickup,this.sphereMaterialPickup,1);
            this.spherePickup.position.set(Math.floor(Math.random() * (15 - -15 + 1)) + -15, 10, Math.floor(Math.random() * (max - min + 1)) + min);
            this.spherePickup.name = "Coin";
            this.add(this.spherePickup);
        }  
        
        private initializeEnemies():void {
            
            this.enemyGeometry = new BoxGeometry(4, 4, 4);
            this.enemyMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff0000 }), 0.4, 0);
            
            this.enemyOne = new Physijs.BoxMesh(this.enemyGeometry, this.enemyMaterial, 1);
            this.enemyOne.position.set(0,0,10);
            this.enemyOne.receiveShadow = true;
            this.enemyOne.castShadow = true;
            this.enemyOne.name = "Enemy One";
            
            this.enemyTwo = new Physijs.BoxMesh(this.enemyGeometry, this.enemyMaterial, 1);
            this.enemyTwo.position.set(8,0,10);
            this.enemyTwo.receiveShadow = true;
            this.enemyTwo.castShadow = true;
            this.enemyTwo.name = "Enemy Two";
            
            this.enemyThree = new Physijs.BoxMesh(this.enemyGeometry, this.enemyMaterial, 1);
            this.enemyThree.position.set(-8,0,10);
            this.enemyThree.receiveShadow = true;
            this.enemyThree.castShadow = true;
            this.enemyThree.name = "Enemy Three";
            
            console.log("Enemies added");
            this.add(this.enemyOne);
            this.add(this.enemyTwo);
            this.add(this.enemyThree);
        }
        
        private spawnEnemies():void{
            

            var max = this.nextGroundZPosition + 75;
            var min = this.nextGroundZPosition + 15;
            
            this.enemyOne.position.set(Math.floor(Math.random() * (15 - -15 + 1)) + -15,
                50,
                Math.floor(Math.random() * (max - min + 1)) + min);
                
            this.enemyTwo.position.set(Math.floor(Math.random() * (15 - -15 + 1)) + -15,
                40,
                Math.floor(Math.random() * (max - min + 1)) + min);
                
            this.enemyThree.position.set(Math.floor(Math.random() * (15 - -15 + 1)) + -15,
                30,
                Math.floor(Math.random() * (max - min + 1)) + min);
            
            this.add(this.enemyOne);
            this.add(this.enemyTwo);
            this.add(this.enemyThree);
            
        }


        private spawnEnemies2(): void {
            var minZPos = this.nextGroundZPosition + 50;
            var maxZPos = this.nextGroundZPosition + 150;
            var ranZPosition = Math.random() * (maxZPos - minZPos) + minZPos;

            var minYPos = 30;
            var maxYPos = 50;
            var ranYPosition = Math.random() * (maxYPos - minYPos) + minYPos;

            var minXPos = -13;
            var maxXPos = 13;
            var ranXPosition = Math.random() * (maxXPos - minXPos) + minXPos;

            var minRot = -45;
            var maxRot = 45;
            var ranRot = Math.random() * (maxRot - minRot) + minRot;

            this.enemyGeometry = new BoxGeometry(4, 4, 4);
            this.enemyMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x550055 }), 0.4, 0);

            this.enemyOne = new Physijs.BoxMesh(this.enemyGeometry, this.enemyMaterial, 1);
            this.enemyOne.position.set(ranXPosition, ranYPosition, ranZPosition);
            this.enemyOne.rotation.set(ranRot, ranRot, ranRot);
            this.enemyOne.receiveShadow = true;
            this.enemyOne.castShadow = true;
            this.enemyOne.name = "Enemy One";

            ranZPosition = Math.random() * (maxZPos - minZPos) + minZPos;
            ranYPosition = Math.random() * (maxYPos - minYPos) + minYPos;
            ranXPosition = Math.random() * (maxXPos - minXPos) + minXPos;
            ranRot = Math.random() * (maxRot - minRot) + minRot;

            this.enemyTwo = new Physijs.BoxMesh(this.enemyGeometry, this.enemyMaterial, 1);
            this.enemyTwo.position.set(ranXPosition, ranYPosition, ranZPosition);
            this.enemyTwo.rotation.set(ranRot, ranRot, ranRot);
            this.enemyTwo.receiveShadow = true;
            this.enemyTwo.castShadow = true;
            this.enemyTwo.name = "Enemy Two";

            ranZPosition = Math.random() * (maxZPos - minZPos) + minZPos;
            ranYPosition = Math.random() * (maxYPos - minYPos) + minYPos;
            ranXPosition = Math.random() * (maxXPos - minXPos) + minXPos;
            ranRot = Math.random() * (maxRot - minRot) + minRot;

            this.enemyThree = new Physijs.BoxMesh(this.enemyGeometry, this.enemyMaterial, 1);
            this.enemyThree.position.set(ranXPosition, ranYPosition, ranZPosition);
            this.enemyThree.rotation.set(ranRot, ranRot, ranRot);
            this.enemyThree.receiveShadow = true;
            this.enemyThree.castShadow = true;
            this.enemyThree.name = "Enemy Three";

            console.log("Enemies added");
            this.add(this.enemyOne);
            this.add(this.enemyTwo);
            this.add(this.enemyThree);

        }
        
        /**
         * creates the rolling ground effect
         * 
         */
        private newCheckpoint(){
            
            this.spawnEnemies2();
            this.createPickups();
            
        }

        /**
         * Adds the player controller to the scene
         * 
         * @method addPlayer
         * @return void
         */
        private addPlayer(): void {
            // Player Object
            this.playerGeometry = new BoxGeometry(2,2,3);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);

            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(0, 10, -10);
            this.player.rotation.y = 3.14159;
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            this.add(this.player);
            console.log("Added Player to Scene");
        }

        /**
         * Add the death plane to the scene
         * 
         * @method addDeathPlane
         * @return void
         */
        private addDeathPlane(): void {
            this.deathPlaneGeometry = new BoxGeometry(100, 1, 100);
            this.deathPlaneMaterial = Physijs.createMaterial(new MeshBasicMaterial({ color: 0xff0000 }), 0.4, 0.6);

            this.deathPlane = new Physijs.BoxMesh(this.deathPlaneGeometry, this.deathPlaneMaterial, 0);
            this.deathPlane.position.set(0, -10, 0);
            this.deathPlane.name = "DeathPlane";
            this.add(this.deathPlane);
        }

        /**
         * This method adds a coin to the scene
         * 
         * @method addCoinMesh
         * @return void
         */
        private addCoinMesh(): void {
            var self = this;

            this.coins = new Array<Physijs.ConvexMesh>(); // Instantiate a convex mesh array

            var coinLoader = new THREE.JSONLoader().load("../../Assets/imported/coin.json", function(geometry: THREE.Geometry) {
                var phongMaterial = new PhongMaterial({ color: 0xE7AB32 });
                phongMaterial.emissive = new THREE.Color(0xE7AB32);

                var coinMaterial = Physijs.createMaterial((phongMaterial), 0.4, 0.6);

                for (var count: number = 0; count < self.coinCount; count++) {
                    self.coins[count] = new Physijs.ConvexMesh(geometry, coinMaterial);
                    self.coins[count].receiveShadow = true;
                    self.coins[count].castShadow = true;
                    self.coins[count].name = "Coin";
                    self.setCoinPosition(self.coins[count]);
                    console.log("Added Coin Mesh to Scene, at position: " + self.coins[count].position);
                }
            });


        }

        /**
         * This method randomly sets the coin object's position
         * 
         * @method setCoinPosition
         * @return void
         */
        private setCoinPosition(coin: Physijs.ConvexMesh): void {
            var randomPointX: number = Math.floor(Math.random() * 20) - 10;
            var randomPointZ: number = Math.floor(Math.random() * 20) - 10;
            coin.position.set(randomPointX, 10, randomPointZ);
            this.add(coin);
        }

        /**
         * Event Handler method for any pointerLockChange events
         * 
         * @method pointerLockChange
         * @return void
         */
        pointerLockChange(event): void {
            if (document.pointerLockElement === this.element) {
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            } else {
                // disable our mouse and keyboard controls
                this.keyboardControls.enabled = false;
                this.mouseControls.enabled = false;
                this.blocker.style.display = '-webkit-box';
                this.blocker.style.display = '-moz-box';
                this.blocker.style.display = 'box';
                this.instructions.style.display = '';
                console.log("PointerLock disabled");
            }
        }

        /**
         * Event handler for PointerLockError
         * 
         * @method pointerLockError
         * @return void
         */
        private pointerLockError(event): void {
            this.instructions.style.display = '';
            console.log("PointerLock Error Detected!!");
        }

        // Check Controls Function

        /**
         * This method updates the player's position based on user input
         * 
         * @method checkControls
         * @return void
         */
        private checkControls(): void {
            if (this.keyboardControls.enabled) {
                this.velocity = new Vector3(0, 23, 0);

                var time: number = performance.now();
                var delta: number = (time - this.prevTime) / 1000;

                if (this.isGrounded) {
                    var direction = new Vector3(0, 0, 0);
                    if (this.keyboardControls.moveForward) {

                        this.velocity.z -= this.playerSpeedZ * delta;

                    }
                    if (this.keyboardControls.moveLeft) {
                        this.velocity.x -= 400.0 * delta;
                    }
                    if (this.keyboardControls.moveBackward) {
                        this.velocity.z += 2000.0 * delta;
                    }
                    if (this.keyboardControls.moveRight) {
                        this.velocity.x += 400.0 * delta;
                    }
                    //Add Super Jump here
                    if (this.keyboardControls.jump) {


                        this.velocity.y += 9000.0 * delta;

                        if (this.player.position.y > 5) {
                            this.isGrounded = false;
                            //this.velocity.y -= 9000 * delta;
                        }

                    }

                    this.player.setDamping(0.7, 0.1);
                    // Changing player's rotation
                    this.player.setAngularVelocity(new Vector3(0, this.mouseControls.yaw, 0));
                    direction.addVectors(direction, this.velocity);
                    direction.applyQuaternion(this.player.quaternion);
                    if (Math.abs(this.player.getLinearVelocity().x) < 20 && Math.abs(this.player.getLinearVelocity().y) < 10) {
                        this.player.applyCentralForce(direction);
                    }

                    this.cameraLook();

                } // isGrounded ends
                else if (!this.isGrounded) {
                    //fall
                    this.velocity.y -= 2500 * delta;

                    var direction = new Vector3(0, 0, 0);
                    if (this.keyboardControls.moveForward) {
                        this.velocity.z -= this.playerSpeedZ * 3 * delta;

                    }
                    if (this.keyboardControls.moveLeft) {
                        this.velocity.x -= 4000.0 * delta;
                    }
                    if (this.keyboardControls.moveBackward) {
                        this.velocity.z += 5000.0 * delta;
                    }
                    if (this.keyboardControls.moveRight) {
                        this.velocity.x += 4000.0 * delta;
                    }
                    
                    if (this.player.position.y < 2) {
                        this.isGrounded = true;
                    }

                    this.player.setDamping(0.7, 0.1);
                    // Changing player's rotation
                    this.player.setAngularVelocity(new Vector3(0, this.mouseControls.yaw, 0));
                    direction.addVectors(direction, this.velocity);
                    direction.applyQuaternion(this.player.quaternion);
                    if (Math.abs(this.player.getLinearVelocity().x) < 20 && Math.abs(this.player.getLinearVelocity().y) < 10) {
                        this.player.applyCentralForce(direction);
                    }

                    this.cameraLook();
                }



                //reset Pitch and Yaw
                this.mouseControls.pitch = 0;
                this.mouseControls.yaw = 0;

                this.prevTime = time;
            } // Controls Enabled ends
            else {
                this.player.setAngularVelocity(new Vector3(0, 0, 0));
            }
        }
        
        /**
         * Death Condition Created when player falls below specific y
         * 
         * @Method
         */
        
        public deathCheck():void{
            
            if (this.player.position.y <= -5) {
                    createjs.Sound.play("hit");
                    this.livesValue--;
                    this.livesLabel.text = "LIVES: " + this.livesValue;
                    this.remove(this.player);
                    this.player.position.set(0, 10, this.nextGroundZPosition);   
                    this.player.rotation.y = 3.14159 * 2;                 
                    this.add(this.player);
                }
        }

        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++

        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {


            // Set Up Scoreboard
            this.setupScoreboard();

            //check to see if pointerlock is supported
            this.havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;



            // Check to see if we have pointerLock
            if (this.havePointerLock) {
                this.element = document.body;

                this.instructions.addEventListener('click', () => {

                    // Ask the user for pointer lock
                    console.log("Requesting PointerLock");

                    this.element.requestPointerLock = this.element.requestPointerLock ||
                        this.element.mozRequestPointerLock ||
                        this.element.webkitRequestPointerLock;

                    this.element.requestPointerLock();
                });

                document.addEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
            }

            // Scene changes for Physijs
            this.name = "Main";
            this.fog = new THREE.Fog(0xffffff, 0, 2750);
            this.setGravity(new THREE.Vector3(0, -10, 0));

            this.addEventListener('update', () => {
                this.simulate(undefined, 2);
            });
            
            
            this.helperAxis= new THREE.AxisHelper( 5 );
            this.helperAxis.position.set(1,1,1);
            this.add(this.helperAxis);
            
            // Ground Object
            this.initializeFirstGround();
            
            // // Ground Second Object
            // this.initializeSecondGround();
            
            
            // Add Spot Light to the scene
            this.addSpotLight();
            
            // Add Second Spotlight to the scene
            // this.addSpotlightNext();
         
            
            this.createPickups();
            
            this.initializeEnemies();

            // Add player controller
            this.addPlayer();
            this.spotLight.target = this.player;
            this.player.add(this.spotLight);

            // Add custom coin imported from Blender
            //this.addCoinMesh();

            // Add death plane to the scene
            //this.addDeathPlane();

            // Collision Check

            this.player.addEventListener('collision', function(eventObject) {
                if (eventObject.name === "Ground") {
                    this.isGrounded = true;
                    createjs.Sound.play("land");
                }
                if (eventObject.name === "Coin") {
                    createjs.Sound.play("coin");
                    this.remove(eventObject);
                    this.setCoinPosition(eventObject);
                    this.scoreValue += 100;
                    this.scoreLabel.text = "SCORE: " + this.scoreValue;
                    this.playerSpeedZ += 500;
                }
                
                if(eventObject.name === "Enemy One" 
                    || eventObject.name === "Enemy Two"
                    || eventObject.name === "Enemy Three"){

                    
                    //eventObject.applyCentralForce(new Vector3(0, 9000, 0));

                    createjs.Sound.play("hit"); 
                    this.livesValue--;
                    this.livesLabel.text = "LIVES: " + this.livesValue;
                }

                // if (eventObject.name === "DeathPlane") {
                //     createjs.Sound.play("hit");
                //     this.livesValue--;
                //     this.livesLabel.text = "LIVES: " + this.livesValue;
                //     this.remove(this.player);
                //     this.player.position.set(0, 30, 10);
                //     this.add(this.player);
                // }
            }.bind(this));

            // create parent-child relationship with camera and player 
            this.player.add(camera);
            camera.position.set(0, 1, 0);

            this.simulate();
        }
        
        public playerPositionCheck():void{
        
            this.playersZPosition = this.player.position.z;
           
            if(this.playersZPosition > this.nextGroundZPosition){

                //this.nextGroundZPosition += 55;

                //this.nextGroundZPosition += 150;

                var minZ = 30;
                var maxZ = 150;
                var ranZ = Math.random() * (maxZ - minZ) + minZ;
                this.nextGroundZPosition += ranZ;

                console.log("Player z: " + this.player.position.z + "\n");
                this.generatorCounter++;
                console.log(this.generatorCounter);
                this.newCheckpoint();
            }
        }

        /**
         * Camera Look function
         * 
         * @method cameraLook
         * @return void
         */
        private cameraLook(): void {
            var zenith: number = THREE.Math.degToRad(90);
            var nadir: number = THREE.Math.degToRad(-90);

            var cameraPitch: number = camera.rotation.x + this.mouseControls.pitch;

            // Constrain the Camera Pitch
            camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        }

        /**
         * @method update
         * @returns void
         */
        public update(): void {

            // this.coins.forEach(coin => {
            //     coin.setAngularFactor(new Vector3(0, 0, 0));
            //     coin.setAngularVelocity(new Vector3(0, 1, 0));
            // });

            this.checkControls();
            this.stage.update();
            this.playerPositionCheck();
            this.deathCheck();
            // console.log("X "+this.player.position.x);
            // console.log("Y"+this.player.position.y);
            // console.log("Z "+this.player.position.z);
            //this.createNewEnemies();


            //this.velocity.y = 9000;


        }
        
        
        
        
        

        /**
         * Responds to screen resizes
         * 
         * @method resize
         * @return void
         */
        public resize(): void {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        }
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        

    }
}