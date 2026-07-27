// Template configuration shared by the editor and viewer.
//
// Add or remove template records here.
// Paths are relative to the HTML files.

window.FBX_TEMPLATE_CONFIG = {
dataDirectory: "data/",

  discordUrl: "https://discord.gg/wotblitz",

  locale: {
    template: "Tank Template",
    uploadCamouflage: "Upload camouflage",
    tilesPerSide: "Camo Tile Density",
    tileRotation: "Camo Tile rotation",
    modelRotation: "Tank rotation",
    modelVerticalPosition: "Model vertical position",
    modelHorizontalPosition: "Model horizontal position",
    cameraFov: "Camera FOV",
    resetView: "Reset view",
    frameModel: "Frame model",
    copyCurrentConfig: "Copy current config",
    downloadPng: "Download Screen Capture",
    countdownTitle: "Countdown to August 13, 2026",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    participateHere: "Join the Camo Contest!",
    loading: "Loading...",
    editorInstructions: "",
    viewerInstructions: "Load your 512*512 texture and select your template. Drag the slider to view different variations. Instructional Video: https://youtu.be/-kb414gQ7CY | Thanks to imakamikaze69 for beta test",
    templateAlt: "Template",
    tilesLabel: "Tiles",
    rotationLabel: "Rotation",
    countdownFinished: "August 13 has arrived",
    anisotropicFiltering: "Anisotropic filtering",
    lowAngledTextureQuality: "ERROR: Low angled-texture quality! Please use a higher end device such as a PC.",
    squareTextureError: "Texture MUST be square. Select a square image.",
    camouflageLoaded: "Loaded {file}.",
    loadingModel: "Loading FBX and body PBR maps...",
    templateLoaded: "Loaded {template}.",
    configCopied: "Current config copied.",
    configMissing: "Configuration failed to load."
  },
  

  templates: [
    {
      name: "E-100",
      modelFile: "model_1.fbx",
      templateFile: "template_all.png",

      body: {
        baseColorMap: "E_100_BC.png",
        baseNormalMap: "E_100_NM.png",
        baseRMMap: "E_100_RM.png",
        miscMap: "E_100_MISC.png",
        maskMap: "E_100_MASK.png"
      },

      defaultTiles: 5,

      viewCode: {
  "position": [
    0,
    0,
    0
  ],
  "rotation": [
    0,
    0.122173,
    0
  ],
  "scale": 1,
  "modelRotationY": 7,
  "focusPoint": [
    0,
    167.796828,
    -75.927452
  ],
  "viewDirection": [
    0.611959,
    0.230779,
    -0.75647
  ],
  "framingRadius": 480.85235,
  "fov": 44,
  "near": 409.321362,
  "far": 1983.203573,
  "modelVerticalOffset": 20,
  "modelHorizontalOffset": -18.5,
  "viewportAspect": 1.781302
}
    },
	    {
      name: "IS-7",
      modelFile: "model_2.fbx",
      templateFile: "template_all.png",

      body: {
    baseColorMap: "IS-7_BC.dx11.png",
    baseNormalMap: "IS-7_NM.dx11.png",
    baseRMMap: "IS-7_RM.dx11.png",
    miscMap: "IS-7_MISC.dx11.png",
    maskMap: "IS-7_MASK.dx11.png"
  },

      defaultTiles: 5,

      viewCode: {
  "position": [
    0,
    0,
    0
  ],
  "rotation": [
    0,
    0.069813,
    0
  ],
  "scale": 1,
  "modelRotationY": 4,
  "focusPoint": [
    0,
    167.796828,
    -75.927452
  ],
  "viewDirection": [
    0.616742,
    0.164986,
    -0.769681
  ],
  "framingRadius": 421.45469,
  "fov": 39,
  "near": 133.870719,
  "far": 1964.851365,
  "modelVerticalOffset": 20,
  "modelHorizontalOffset": -15,
  "viewportAspect": 1.781302
}
    },
	    {
      name: "BZT-70",
      modelFile: "model_3A.fbx",
      templateFile: "template_all.png",

      body: {
    baseColorMap: "Ch57_BZT_70_BC.dx11.png",
    baseNormalMap: "Ch57_BZT_70_NM.dx11.png",
    baseRMMap: "Ch57_BZT_70_RM.dx11.png",
    miscMap: "Ch57_BZT_70_MISC.dx11.png",
    maskMap: "Ch57_BZT_70_MASK.dx11.png"
  },

      defaultTiles: 5,

      viewCode: {
  "position": [
    0,
    0,
    0
  ],
  "rotation": [
    0,
    0.069813,
    0
  ],
  "scale": 1,
  "modelRotationY": 4,
  "focusPoint": [
    0,
    167.796828,
    -75.927452
  ],
  "viewDirection": [
    0.596393,
    0.130215,
    -0.79206
  ],
  "framingRadius": 455.978588,
  "fov": 40,
  "near": 224.7977,
  "far": 2017.673075,
  "modelVerticalOffset": 16.5,
  "modelHorizontalOffset": -15,
  "viewportAspect": 1.781302
}
    },
	    {
      name: "Carro 45t",
      modelFile: "model_4.fbx",
      templateFile: "template_all.png",

      body: {
    baseColorMap: "It20_Car_Comb_45t_BC.dx11.png",
    baseNormalMap: "It20_Car_Comb_45t_NM.dx11.png",
    baseRMMap: "It20_Car_Comb_45t_RM.dx11.png",
    miscMap: "It20_Car_Comb_45t_MISC.dx11.png",
    maskMap: "It20_Car_Comb_45t_MASK.dx11.png"
  },

      defaultTiles: 5,

      viewCode: {
  "position": [
    0,
    0,
    0
  ],
  "rotation": [
    0,
    0.069813,
    0
  ],
  "scale": 1,
  "modelRotationY": 4,
  "focusPoint": [
    0,
    167.796828,
    -75.927452
  ],
  "viewDirection": [
    -0.504238,
    0.194629,
    -0.841346
  ],
  "framingRadius": 455.978588,
  "fov": 40,
  "near": 419.768823,
  "far": 1896.398378,
  "modelVerticalOffset": 16.5,
  "modelHorizontalOffset": -15,
  "viewportAspect": 1.781302
}
    },
	    {
      name: "Kpz 70",
      modelFile: "model_5.fbx",
      templateFile: "template_all.png",

      body: {
    baseNormalMap: "KpfPz_70_NM.dx11.png",
    baseColorMap: "G_KpfPz_70_BC.dx11.png",
    baseRMMap: "G_KpfPz_70_RM.dx11.png",
    miscMap: "G_KpfPz_70_MISC.dx11.png",
    maskMap: "G_KpfPz_70_MASK.dx11.png"
  },

      defaultTiles: 5,

      viewCode: {
  "position": [
    0,
    0,
    0
  ],
  "rotation": [
    0,
    0.122173,
    0
  ],
  "scale": 1,
  "modelRotationY": 7,
  "focusPoint": [
    0,
    167.796828,
    -75.927452
  ],
  "viewDirection": [
    -0.570044,
    0.148783,
    -0.808031
  ],
  "framingRadius": 475.823131,
  "fov": 50,
  "near": 357.953334,
  "far": 1662.542589,
  "modelVerticalOffset": 22,
  "modelHorizontalOffset": -16.5,
  "viewportAspect": 1.781302
}
    }
	
  ]
};
