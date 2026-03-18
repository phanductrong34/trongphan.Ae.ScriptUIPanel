//Copyright © 2023 Gaëtan Boutet // Cream-FX // Videohive ENVATO
//All rights reserved. No part of this script may be reproduced or used in any form without prior written permission from the author.



// Création de la fenêtre dockable

function createDockableUI(thisObj) {
  var dialog = thisObj instanceof Panel ? thisObj : new Window("window", undefined, undefined, { resizeable: true });
  dialog.onResizing = dialog.onResize = function () {
      this.layout.resize();
  };
  return dialog;
}

function showWindow(myWindow) {
  if (myWindow instanceof Window) {
      myWindow.center();
      myWindow.show();
  }
  if (myWindow instanceof Panel) {
      myWindow.layout.layout(true);
      myWindow.layout.resize();
  }
}


// Création des boutons

var dialog = createDockableUI(this);
dialog.orientation = "column"; // change orientation to "column"
dialog.alignChildren = ["left", "top"];
dialog.spacing = 10;
dialog.margins = 16;

var buttonImages = {
  normal: new File($.fileName).parent.fsName + "/Parallaxer_Button.png",
  hover: new File($.fileName).parent.fsName + "/Parallaxer_Button_over.png"
};

// Button  Line 1
var buttonRow1 = dialog.add("group");
buttonRow1.orientation = "row";
buttonRow1.alignChildren = ["left", "top"];
buttonRow1.spacing = 10;

var button1 = buttonRow1.add("iconbutton", undefined, File(buttonImages.normal));
button1.helpTip = "Select a composition then click.";
button1.preferredSize = [175, 51];

button1.addEventListener("mouseover", function() {
  button1.image = File(buttonImages.hover);
});

button1.addEventListener("mouseout", function() {
  button1.image = File(buttonImages.normal);
});

var helpButton = buttonRow1.add("button", undefined, undefined, { name: "helpButton" });
helpButton.text = "Help";
helpButton.preferredSize = [30, 22];

// Separator
var sep = dialog.add("panel", undefined, "", {borderStyle: "gray"});
sep.alignment = ["fill", "top"];
sep.preferredSize.height = 1;
sep.margins.top = 10;

// Button Line 2
var buttonRow2 = dialog.add("group");
buttonRow2.orientation = "row";
buttonRow2.alignChildren = ["left", "top"];
buttonRow2.spacing = 4;

var minusButton = buttonRow2.add("button", undefined, "-", { name: "minusButton" });
minusButton.preferredSize = [62, 35];

var flatButton = buttonRow2.add("button", undefined, "Flat", { name: "flatButton" });
flatButton.preferredSize = [43, 35];

var plusButton = buttonRow2.add("button", undefined, "+", { name: "plusButton" });
plusButton.preferredSize = [62, 35];

// Button Line 3
var buttonRow3 = dialog.add("group");
buttonRow3.orientation = "row";
buttonRow3.alignChildren = ["left", "top"];
buttonRow3.spacing = 10;

var resetCamButton = buttonRow3.add("button", undefined, "Reset Camera", { name: "resetCamButton" });
resetCamButton.preferredSize = [175, 28];

showWindow(dialog);

// Button Line 4
var buttonRow4 = dialog.add("group");
buttonRow4.orientation = "row";
buttonRow4.alignChildren = ["left", "top"];
buttonRow4.spacing = 10;

var bakeButton = buttonRow4.add("button", undefined, "BAKE", { name: "bakeButton" });
bakeButton.preferredSize = [175, 40];





// Click sur Bouton Help
helpButton.onClick = function() {
  var helpWindow = new Window("window", "Parallaxer Help", undefined, {width: 600, height: 400});
  var helpText = helpWindow.add("statictext", [0, 0, 600, 400], undefined, {multiline: true});
  helpText.text = 
      "\n\n"+
      "This tool lets you setup a 2.5D parallax on a multi layer composition (from Illustrator or Photoshop for example).\n\n" +
      "Work steps:\n" +
      "1) In Illustrator or Photoshop setup your layers. Each layer will be become a 3D plane in After Effects.\n" +
      "2) Import your Illustrator or Photoshop file in After Effects as a composition (Layer or Document mode).\n"+
      "3) Open the composition and launch the Parallaxer script.\n"+
      "4) You are asked to choose your type of scene (Small, Intermediate or Large). Your choice will modify the distance between the closest and farthest layer of your project. Choose wisely.\n"+
      "5) Your composition is now setup. Change your viewport in 2 views mode: One in Top View the other one in Camera View.\n\n"+
      
      "Button -     : will decrease the distance between the selected 3d layers. \n"+
      "Button Flat : will position in Z all selected 3d layers at the same place.\n" +
      "Button +     : will increase the distance between the selected 3d layers.\n\n"+

      "Reset Camera: will reposition the camera to its original position.\n\n" +

      "BAKE: will remove all dynamic functions and speed up the composition for animation. It's important to bake once you are satifyied with your setup. \n\n" +

      "Copyright © 2023 Gaëtan Boutet // Cream-FX // Videohive ENVATO\n"

      helpWindow.bounds = [0, 0, 600, 400];
  helpWindow.center();
  helpWindow.onClose = function() {
      dialog.show();
  };
  helpWindow.show();
}



//__________________________________________________________________________________________________________________________________________________________________________________________________________________________




// Click sur Bouton Parallaxer
button1.onClick = function() {

// Begin an undo group
app.beginUndoGroup("Parallaxer Setup");

function Parallaxer(thisObj) {
  var comp = app.project.activeItem;





// étape 1 : vérifier s'il y a une composition active
  if (!comp) {
      alert("Please select a composition before launching script.");
      return;
  }




// étape 2 : créer une caméra avec une focale de 28mm et la renommer "- CAMERA -" - Descendre la caméra de 15000 pixels et -10000 en Z
var cameraExists = false;
for (var i = 1; i <= comp.numLayers; i++) {
  if (comp.layer(i).name === "- CAMERA -" && comp.layer(i) instanceof CameraLayer) {
      cameraExists = true;
      alert("Parallaxer was already applied on this composition");
      return;
      break;
  } else if (comp.layer(i) instanceof CameraLayer) {
      alert("Please delete the camera in your composition. Parallaxer will create its own.");
      return;
      break;
  }
}

if (!cameraExists) {
  var camera = comp.layers.addCamera("CAMERA", [comp.width / 2, comp.height / 2]);
  camera.name = "- CAMERA -";
  camera.position.setValueAtTime(0, [comp.width / 2, comp.height / 2 + 15000, -1493.3 -10000]);
  camera.pointOfInterest.setValueAtTime(0, [comp.width / 2, comp.height / 2 + 15000, 0 -10000]);
  camera.property("Aperture").setValue(14.2);
  camera.property("Zoom").setValue(1493.3);
  camera.property("Focus Distance").setValue(1493.3);
} 





      
     


// étape 3 : Appliquer les expressions d'Autoscale sur les calques 3D (sauf la caméra) avec un décalage de 15000 pixels vers le bas et -10000 en Z
var layerScales = [];
for (var i = 1; i <= comp.layers.length; i++) {
  var layer = comp.layers[i];
  if (layer.name !== "- CAMERA -" && !layer.locked) {
    layer.property("Position").dimensionsSeparated = false;
    layer.threeDLayer = true;
    
    // Appliquer le décalage de 15000 pixels vers le bas sur la position Y et -10000 en Z
    var currentPosition = layer.property("Position").value;
    layer.property("Position").setValue([currentPosition[0], currentPosition[1] - 15000, currentPosition[2] + 10000]);
    
    // Stocker l'échelle actuelle avant d'appliquer l'expression d'Autoscale
    layerScales.push(layer.property("Scale").value);
    
    // Appliquer l'expression d'Autoscale sur l'échelle
    layer.property("Scale").expression = "camzoom = thisComp.activeCamera.zoom;\n"+
    " scalefactor = 100 * (transform.position[2] + 10000) / camzoom + 100;\n [scalefactor * transform.scale[0] / 100, scalefactor * transform.scale[1] / 100, scalefactor * transform.scale[2] / 100];";
    
// Appliquer l'expression d'Autoscale sur la position
layer.property("Position").expression =
  "camzoom = thisComp.activeCamera.zoom;\n" +
  "scalefactor = 100 + transform.position[2] / camzoom * 100;\n" +
  "camPosX = (thisComp.width / 2) + (scalefactor / 100) * (transform.position[0] - (thisComp.width / 2));\n" +
  "camPosY = (thisComp.height / 2) + (scalefactor / 100) * (transform.position[1] - (thisComp.height / 2)) - 15000;\n" +
  "camPosZ = transform.position[2] + 10000;\n" +
  "[camPosX, camPosY + 30000, camPosZ - 20000];";


  }
}






// étape 4 : Création d'une fenêtre demandant quel est le type de scène (intérieure ou extérieure)
  var sceneTypeWindow = new Window("dialog", "", undefined);
  var sceneTypeText = sceneTypeWindow.add("statictext", undefined, "Choose your type of scene :");
  var interiorSceneButton = sceneTypeWindow.add("button", undefined, "SMALL scene (small room)");
  var intermediateSceneButton = sceneTypeWindow.add("button", undefined, "MEDIUM scene (big room)");
  var largeExteriorSceneButton = sceneTypeWindow.add("button", undefined, "LARGE scene (exterior)");

  interiorSceneButton.onClick = function () {
      zEnd = 4285 * ((comp.width + comp.height)/4820);
      sceneTypeWindow.close();
      create3DLayers();
  }

  intermediateSceneButton.onClick = function () {
      zEnd = 9285 * ((comp.width + comp.height)/4820);
      sceneTypeWindow.close();
      create3DLayers();
  }

  largeExteriorSceneButton.onClick = function () {
      zEnd = 22585 * ((comp.width + comp.height)/4820);
      sceneTypeWindow.close();
      create3DLayers();
  }

  sceneTypeWindow.show();

 

 
  
// étape 5 transformer tous les calques existants de la composition en objets 3D et répartir uniformément les calques 3D en position Z
  function create3DLayers() {
      var zStart = 35 * ((comp.width + comp.height)/4820);
      var zRange = zEnd - zStart;
      var count = 0;
      for (var i = 1; i <= comp.layers.length; i++) {
          var layer = comp.layers[i];
          if (!layer.locked && layer.name != "- CAMERA -" ) {
              layer.threeDLayer = true;
              var layerZ = zStart + (zRange * count / (comp.layers.length - 2));
              layer.property("Position").setValue([layer.property("Position").value[0], layer.property("Position").value[1], layerZ]);
              count++;
          }
          if (layer.matchName == "- CAMERA -") {
              cam.label = 8;
          }
      }
  }

  alert("Setup viewport in 2 views mode: TOP + CAMERA");



// Ecrire le texte de Warning "PARALLAXER ACTIVATED" et basculer en SHY mode

var warningLayer = null;
for (var i = 1; i <= comp.numLayers; i++) {
  if (comp.layer(i).name === "PARALLAXER ACTIVATED") {
    warningLayer = comp.layer(i);
    break;
  }
}

if (!warningLayer) {
    warningLayer = comp.layers.addText("PARALLAXER ACTIVATED");
    warningLayer.sourceText.setValue("PARALLAXER ACTIVATED - Bake once finished");
    var textProperties = warningLayer.sourceText;
    var textDocument = textProperties.value;
    textDocument.resetCharStyle();
    textDocument.fontSize = ((comp.width + comp.height) / 80);
    textDocument.fillColor = [1, 0, 0];
    textDocument.strokeColor = [1, 1, 1];
    textDocument.strokeWidth = ((comp.width + comp.height) / 650);
    textDocument.font = "Arial-BoldMT";
    textDocument.strokeOverFill = false;
    textDocument.applyStroke = true;
    textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
    textProperties.setValue(textDocument);
    warningLayer.transform.position.setValue([comp.width / 2, (comp.width + comp.height) / 60, 0]);
    warningLayer.locked = true;
  }
  

warningLayer.shy = true;
warningLayer.selected = false;
comp.hideShyLayers = true;



//________________________________________________________________________________________________________________________________________________________________________________________________________________________




// BOUTON MOINS
minusButton.onClick = function() {

  app.beginUndoGroup("minus Undo");
  
  if (app.project.activeItem && app.project.activeItem.selectedLayers.length > 1) { // check if at least two layers are selected
    var selectedLayers = app.project.activeItem.selectedLayers;
    var positionsZ = [];

    for (var i = 0; i < selectedLayers.length; i++) {
      if (selectedLayers[i].threeDLayer) {
        positionsZ.push(parseFloat(selectedLayers[i].transform.position.value[2]));
      }
    }
    
    if (positionsZ.length > 0) {
          
      // Calcul de la somme des valeurs dans positionsZ et Calcul de la valeur moyenne (medianZ)
      var sumZ = 0;
      for (var i = 0; i < positionsZ.length; i++) {
      sumZ += positionsZ[i];
      }
      var medianZ = sumZ / positionsZ.length;

           
      var nullObj = app.project.activeItem.layers.addNull();
      nullObj.threeDLayer = true;
      nullObj.name = "Null with Median Z";
      nullObj.transform.position.setValue([0, 0, medianZ + 10000]);
      
      for (var i = 0; i < selectedLayers.length; i++) {
        if (selectedLayers[i].threeDLayer) {
          selectedLayers[i].parent = nullObj;
        }
      }

      nullObj.transform.scale.setValue([100, 100, 85]);

      var currentSelection = [];
      
      for (var i = 0; i < selectedLayers.length; i++) {
        if (selectedLayers[i].threeDLayer) {
          currentSelection.push(selectedLayers[i]);
        }
      }

      nullObj.remove();

      for (var i = 0; i < currentSelection.length; i++) {
        currentSelection[i].selected = true;
      }

    } else {
      alert("None of the selected layers are 3D layers");
    }
  } else {
    alert("Select at least two 3D layers or more");
  }

  app.endUndoGroup();   
}











// BOUTON FLAT
flatButton.onClick = function() {
  app.beginUndoGroup("flat Undo");
  if (app.project.activeItem && app.project.activeItem.selectedLayers.length > 1) { // check if at least two layers are selected
      var selectedLayers = app.project.activeItem.selectedLayers;
      var positionsZ = [];
    
      for (var i = 0; i < selectedLayers.length; i++) {
        if (selectedLayers[i].threeDLayer) {
          positionsZ.push(selectedLayers[i].transform.position.value[2]);
        }
      }
    
      if (positionsZ.length > 0) {

        // Calcul de la somme des valeurs dans positionsZ et Calcul de la valeur moyenne (medianZ)
      var sumZ = 0;
      for (var i = 0; i < positionsZ.length; i++) {
      sumZ += positionsZ[i];
      }
      var medianZ = sumZ / positionsZ.length;


        var nullObj = app.project.activeItem.layers.addNull();
        nullObj.threeDLayer = true;
        nullObj.name = "Null with Median Z";
        nullObj.transform.position.setValue([0, 0, medianZ + 10000]);
    
        for (var i = 0; i < selectedLayers.length; i++) {
          if (selectedLayers[i].threeDLayer) {
            selectedLayers[i].parent = nullObj;
          }
        }
    
        nullObj.transform.scale.setValue([100, 100, 0.001]);
    
        var currentSelection = [];
        for (var i = 0; i < selectedLayers.length; i++) {
          if (selectedLayers[i].threeDLayer) {
            currentSelection.push(selectedLayers[i]);
          }
        }
    
        nullObj.remove();
    
        for (var i = 0; i < currentSelection.length; i++) {
          currentSelection[i].selected = true;
        }
    
      } else {
        alert("None of the selected layers are 3D layers");
      }
    } else {
      alert("Select at least two 3D layers or more");
    }
    app.endUndoGroup();   
}






// BOUTON PLUS
plusButton.onClick = function() {
  app.beginUndoGroup("plus Undo");
  if (app.project.activeItem && app.project.activeItem.selectedLayers.length > 1) { // check if at least two layers are selected
      var selectedLayers = app.project.activeItem.selectedLayers;
      var positionsZ = [];
    
      for (var i = 0; i < selectedLayers.length; i++) {
        if (selectedLayers[i].threeDLayer) {
          positionsZ.push(selectedLayers[i].transform.position.value[2]);
        }
      }
    
      if (positionsZ.length > 0) {

        // Calcul de la somme des valeurs dans positionsZ et Calcul de la valeur moyenne (medianZ)
      var sumZ = 0;
      for (var i = 0; i < positionsZ.length; i++) {
      sumZ += positionsZ[i];
      }
      var medianZ = sumZ / positionsZ.length;


        var nullObj = app.project.activeItem.layers.addNull();
        nullObj.threeDLayer = true;
        nullObj.name = "Null with Median Z";
        nullObj.transform.position.setValue([0, 0, medianZ + 10000]);
    
        for (var i = 0; i < selectedLayers.length; i++) {
          if (selectedLayers[i].threeDLayer) {
            selectedLayers[i].parent = nullObj;
          }
        }
    
        nullObj.transform.scale.setValue([100, 100, 115]);
    
        var currentSelection = [];
        for (var i = 0; i < selectedLayers.length; i++) {
          if (selectedLayers[i].threeDLayer) {
            currentSelection.push(selectedLayers[i]);
          }
        }
    
        nullObj.remove();
    
        for (var i = 0; i < currentSelection.length; i++) {
          currentSelection[i].selected = true;
        }
    
      } else {
        alert("None of the selected layers are 3D layers");
      }
    } else {
      alert("Select at least two 3D layers or more");
    }
    app.endUndoGroup(); 
}






// BOUTON RESET CAMERA 
resetCamButton.onClick = function() {  
  app.beginUndoGroup("resetcam Undo");
  var comp = app.project.activeItem;
         
  // Reset Position de la caméra
  var camera = comp.layer("- CAMERA -");
  camera.position.setValueAtTime(0, [comp.width / 2, (comp.height / 2) + 15000, -1493.3 - 10000]);
  camera.pointOfInterest.setValueAtTime(0, [comp.width / 2, (comp.height / 2) + 15000, 0 - 10000]);

  app.endUndoGroup();
}








// BOUTON BAKE : Terminer le SCRIPT Enlever clés + expressions
bakeButton.onClick = function() {  
  app.beginUndoGroup("Bake Undo");
  var comp = app.project.activeItem;

  // Suppression du texte Warning
  for (var i = 1; i <= comp.numLayers; i++) {
    if (comp.layer(i).name === "PARALLAXER ACTIVATED - Bake once finished") {
      var warningLayer = comp.layer(i);
      warningLayer.locked = false;
      warningLayer.remove();
      break;
    }
  }
  
  // Reset Position de la caméra
  var camera = comp.layer("- CAMERA -");
  camera.position.setValueAtTime(0, [comp.width / 2, (comp.height / 2) + 15000, -1493.3 - 10000]);
  camera.pointOfInterest.setValueAtTime(0, [comp.width / 2, (comp.height / 2) + 15000, 0 - 10000]);

  // Enregistrer et supprimer les expressions des calques (scale et position)
  for (var i = 1; i <= comp.layers.length; i++) {
    var layer = comp.layers[i];
    if (layer.name != "- CAMERA -" && !layer.locked) {
      var scaleValue = layer.property("Scale").value; // Récupérer la valeur d'échelle calculée par l'expression
      layer.property("Scale").setValueAtTime(0, scaleValue); // Créer une clé échelle à 0 seconde et définir la valeur de l'échelle calculée par l'expression
      layer.property("Scale").expressionEnabled = false; // Désactiver les expressions sur l'échelle des calques 3D
      var positionValue = layer.property("Position").value; // Récupérer la valeur de position calculée par l'expression
      layer.property("Position").setValueAtTime(0, positionValue); // Créer une clé de position à 0 seconde et définir la valeur de position calculée par l'expression
      layer.property("Position").expressionEnabled = false; // Désactiver les expressions sur la position des calques
    }
  }   

  var cameraLayerName = "- CAMERA -";

// Loop through all layers in the composition and delete animations, except for the camera
for (var i = 1; i <= comp.layers.length; i++) {
  var layer = comp.layers[i];

  if (layer.name !== cameraLayerName) {
    // Remove animations & expressions from Scale property
    var scale = layer.transform.scale;
    while (scale.numKeys > 0) {
      scale.removeKey(1);
      scale.expression = "";
    }

    // Remove animations & expressions from Position property
    var position = layer.transform.position;
    while (position.numKeys > 0) {
      position.removeKey(1);
      position.expression = "";
    }
  }
}

// Deselect all layers in the composition
for (var i = 1; i <= comp.layers.length; i++) {
  comp.layers[i].selected = false;
}


  alert("You are now ready to animate.");

          app.endUndoGroup();            
      };
      }
      app.endUndoGroup();
Parallaxer();
}
showWindow(dialog);
