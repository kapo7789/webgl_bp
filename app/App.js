var App = {
	useComposer: false,

	onAnimate: function() {

	},

	init: function() {

		this.renderer = new THREE.WebGLRenderer({ antialias: true }),

		this.renderer.setSize( window.innerWidth-5, window.innerHeight-5 );
		document.body.appendChild( this.renderer.domElement );
        this.renderer.setClearColor( 0, 1 );

        this.initCamera();
        this.initScene();
	},

	initCamera: function() {
		this.camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 1, 17000 );
		this.camera.position.z = 400;
	},

	initScene: function() {
		this.scene = new THREE.Scene();
	},

	render: function() {
		this.renderer.autoClear = false;
		this.renderer.clear();
		if(this.useComposer)
			this.composer.render(0.15);
		else
			this.renderer.render(this.scene, this.camera);
	},

	initComposer: function(options) {

		this.composer = new THREE.EffectComposer( this.renderer );
		this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );

		var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
        effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth,  1 / window.innerHeight );
        effectFXAA.renderToScreen = true;


        if(options.rgbPass !== false){
        	var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
				effect.uniforms[ 'amount' ].value = 0.0050;
				effect.renderToScreen = false;
				this.composer.addPass(effect);
        }

		if(options.filmPass !== false){
				var effectFilm = new THREE.FilmPass( 0.25, 1, 1048, false );
				effectFilm.renderToScreen = false;
				this.composer.addPass( effectFilm );
		}

        this.composer.addPass( effectFXAA );

	},

	start: function(options) {
		if(this.renderer === undefined)
			this.init();

		if(options!==undefined){
			if(options.useComposer) {
				this.useComposer = true;
				this.initComposer(options);
			}
		}

		var that = this;
		requestAnimationFrame( function() { that.start(); } )
		this.render();		
		this.onAnimate();
	},

	add: function(arg) {
		this.scene.add(arg);
	},

	addMany: function(arg) {
		for(var i=0; i<arg.length; i++)
			this.scene.add(arg[i]);
	},
	// REMOVE THIS
	loadEnvironment: function() {
		var imagePrefix = "/newpr/images/skybox/dd_";
		var directions  = ["right1", "left2", "top3", "bottom4", "front5", "back6"];
		var imageSuffix = ".png";
		
	
		var materialArray = [];
		for (var i = 0; i < 6; i++) {
			materialArray.push(
				new THREE.MeshBasicMaterial({ 
					color: 0xFFFFFF,
					map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
					side: THREE.BackSide, 
					depthWrite: false
				})
			);
		}

		var skyGeometry = new THREE.CubeGeometry( 16000, 16000, 16000 );	
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
		this.scene.add( skyBox );
		this.scene.fog = new THREE.FogExp2( 0xB69CE6, 0.00005 );
	}
}