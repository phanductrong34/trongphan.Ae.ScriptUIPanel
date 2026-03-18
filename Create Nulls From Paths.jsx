/*
    Create Nulls From Paths.jsx v.0.7
    Attach nulls to shape and mask vertices, and vice-versa.

    Changes 0.7:
        - Added deprecation message because these are now available as menu commands.

    Changes 0.6:
        - Nulls are now created above the selected layer.
        - Loop optimizations

    Changes 0.5:
        - wraps it all in an IIFE
        - fixes call to missing method array.indexOf
*/
(function createNullsFromPaths (thisObj) {
    /* Build UI */
    function buildUI(thisObj) {

        var windowTitle = localize("$$$/AE/Script/CreatePathNulls/CreateNullsFromPaths=Create Nulls From Paths");
        var deprecateStr = localize("$$$/AE/Script/CreatePathNulls/Deprecation=Updated versions of these commands are available in the Layer > Create or Keyframe Assistant menu and support both path points and position points.")
        var firstButton = localize("$$$/AE/Script/CreatePathNulls/PathPointsToNulls=Points Follow Nulls");
        var secondButton = localize("$$$/AE/Script/CreatePathNulls/NullsToPathPoints=Nulls Follow Points");
        var thirdButton = localize("$$$/AE/Script/CreatePathNulls/TracePath=Trace Path");
        var win = (thisObj instanceof Panel)? thisObj : new Window('palette', windowTitle);
            win.spacing = 0;
            win.margins = 4;

            var deprecateMsgGroup = win.add("group");
                deprecateMsgGroup.spacing = 5;
                deprecateMsgGroup.margins = [5, 5, 5, 0];
                deprecateMsgGroup.orientation = "row";
                deprecateMsgGroup.alignment = ["left", "center"];
                deprecateMsgGroup.alignChildren = ["left", "center"];

            var msgIcon = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x18\x00\x00\x00\x18\b\x06\x00\x00\x00\u00E0w=\u00F8\x00\x00\x00\tpHYs\x00\x00\x0B\x12\x00\x00\x0B\x12\x01\u00D2\u00DD~\u00FC\x00\x00\x01\u0093IDATH\u0089\u00BD\u0096\u00C1y\u00C20\f\u0085\x7F\u00F2q\u00A7\x1B\u00D0\r`\x04\u00F7\u00A2s6 \x1B\u0094\r\u0080\r\u00E8\x06a\u0083\u009Cui:\x02\x1B4\x1B\u00B0\x01=X&n\u00E2\u0090\x16J\u00DF%\u00C1\u0096\u009F\u009EdEbr>\u009F\x19\u0082\u00AA\u00E6@\x0E8`\u00DE\u00D9n\u0080\x1A\u00A8D\u00A4\x1A\u00E2\u0098\u00A4\x1C\u00A8\u00AA\x03\u00CA\x04\u00E9\x10\x1A\u00A0\x10\u0091z\u00D4\u0081\u00AA\u00EE\u0081\u00D7h\u00E9\bT\u00A66\u0086\u00C3G\u00B7\u0088\u00D6\u00DEDd=\u00E8@UK`\x15\x11\u00AFS\u00AA:\u0082\x1C\u00B0\u008F\x1C\x1DD\u00A4\b\u00FBYGy ?\x00n\u008C\x1C\u00C0l\u009C\u009D\x01X\x19W\x1B\u0081\u00A9xO)\u0088\x04l\u0081\u008D\u00FD\u00DC\u0089\u00C86aSF\"_D\u00A4\x0E\x11\u0094\u00F6<\u00A6\u00C8\r\u009B\u0081\u00F78\u009A\x02\u009F\u00DA\x0Bgf\u00A5\x18\u00AAe\u00DD?\u00F6k\x04\u008E\u00B9\u00AA\u00E6\x19\u00BE\x12\u00C0\u00AB\u00AF\u00AF\x1C\u00DC\r\u00BC\x7F\u0083q\u0084(\u00F2)\u00FE\u0082\u00C0\u0097\u00E2 ,\u00E7\u00DBk6\x11*|U\u00B9)mz\u00EA\u0094\u00A5\u00AA.mo\x16-\x7F\u0088\u0088K\u00D9G\\\x1B`\u009E]1\n\u00F8\x1Cr\u00FE\x13\u008C:\x10\u0091\u0093\u0088\u00E4cv7;\u00B8\x17\x19\u00BEQA{\u00D9\x7F\u0081\u00C0\u00D5d\u00B4\u00F9\u00BD9\r\t\x04\u00AE:\u00A3-\u00CF\u0085\u00B5\u008C\u00BB`\x1C\u00A1\u00F1U\u0099\r\u008B\u0090\u00A6}\u00E2\u00C0\u0093\u00AAv\u00BF\u0091\u00A5\u00F5\u00A6\u009Em\u00C4\u00D1\u0088H\x15.\u00B9\u00B0\u00E7\u00C2\x1AV\u008Cg\u00FA\u00F73#\u009D\u00D2\u00B8m\x17\x10\u00CD\u0083\u00CE\u00A09\u00E0g\u00C1)A\u00D2C\u00A4<t\u00D2\u00CB\u00E0y\u00F8\u00C0\u00F9\u00DF\u0091\u00D9QU\u00F2\u0088\u00A1\u00DFqt\u00F7\u00DF\u0096/5\x1A\u00C5\u00EASRu\u00B2\x00\x00\x00\x00IEND\u00AEB`\u0082";
            var msgIconGrp = deprecateMsgGroup.add("group");
                msgIconGrp.margins = [0, -10, 0, 0];
                msgIconGrp.add("image", undefined, msgIcon);
            
            var myTextGroup = deprecateMsgGroup.add("group");
                myTextGroup.spacing = 4;
                myTextGroup.margins = 0;
                myTextGroup.orientation = "row";
                myTextGroup.deprecateMsg = deprecateMsgGroup.add(
                    "statictext",
                    undefined,
                    deprecateStr,
                    {multiline: true});
                var textHeight = app.isoLanguage == "ru_RU" ? 70 : -1;
                myTextGroup.deprecateMsg.preferredSize = [270, textHeight];

            var myButtonGroup = win.add ("group");
                myButtonGroup.spacing = 4;
                myButtonGroup.margins = 0;
                myButtonGroup.orientation = "row";
                win.button1 = myButtonGroup.add ("button", undefined, firstButton);
                win.button2 = myButtonGroup.add ("button", undefined, secondButton);
                win.button3 = myButtonGroup.add ("button", undefined, thirdButton);
                myButtonGroup.alignment = "center";
                myButtonGroup.alignChildren = "center";

            win.button1.onClick = function(){
                linkPointsToNulls();
            }
            win.button2.onClick = function(){
                linkNullsToPoints();
            }
            win.button3.onClick = function(){
                tracePath();
            }

        win.layout.layout(true);

        return win
    }


    // Show the Panel
    var w = buildUI(thisObj);
    if (w.toString() == "[object Panel]") {
        w;
    } else {
        w.show();
    }


    /* General functions */

    function getActiveComp(){
        var theComp = app.project.activeItem;
        if (theComp == undefined){
            var errorMsg = localize("$$$/AE/Script/CreatePathNulls/ErrorNoComp=Error: Please select a composition.");
            alert(errorMsg);
            return null
        }

        return theComp
    }

    function getSelectedLayers(targetComp){
        var targetLayers = targetComp.selectedLayers;
        return targetLayers
    }

    function createNull(targetComp){
        return targetComp.layers.addNull();
    }

    function getSelectedProperties(targetLayer){
        var props = targetLayer.selectedProperties;
        if (props.length < 1){
            return null
        }
        return props
    }

    function forEachLayer(targetLayerArray, doSomething) {
        for (var i = 0, ii = targetLayerArray.length; i < ii; i++){
            doSomething(targetLayerArray[i]);
        }
    }

    function forEachProperty(targetProps, doSomething){
        for (var i = 0, ii = targetProps.length; i < ii; i++){
            doSomething(targetProps[i]);
        }
    }

    function forEachEffect(targetLayer, doSomething){
        for (var i = 1, ii = targetLayer.property("ADBE Effect Parade").numProperties; i <= ii; i++) {
            doSomething(targetLayer.property("ADBE Effect Parade").property(i));
        }
    }

    function matchMatchName(targetEffect,matchNameString){
        if (targetEffect != null && targetEffect.matchName === matchNameString) {
            return targetEffect
        } else {
            return null
        }
    }

    function getPropPath(currentProp,pathHierarchy){
        var pathPath = "";
            while (currentProp.parentProperty !== null){

                if ((currentProp.parentProperty.propertyType === PropertyType.INDEXED_GROUP)) {
                    pathHierarchy.unshift(currentProp.propertyIndex);
                    pathPath = "(" + currentProp.propertyIndex + ")" + pathPath;
                } else {
                    pathPath = "(\"" + currentProp.matchName.toString() + "\")" + pathPath;
                }

                // Traverse up the property tree
                currentProp = currentProp.parentProperty;
            }
        return pathPath
    }

    function getPathPoints(path){
        return path.value.vertices;
    }


    /* Project specific code */

    function forEachPath(doSomething){

        var comp = getActiveComp();

        if(comp == null) {
            return
        }

            var selectedLayers = getSelectedLayers(comp);
            if (selectedLayers == null){
                return
            }

            // First store the set of selected paths
            var selectedPaths = [];
            var parentLayers = [];
            forEachLayer(selectedLayers,function(selectedLayer){

                var paths = getSelectedProperties(selectedLayer);
                if (paths == null){
                    return
                }

                forEachProperty(paths,function(path){
                    var isShapePath = matchMatchName(path,"ADBE Vector Shape");
                    var isMaskPath = matchMatchName(path,"ADBE Mask Shape");
                // var isPaintPath = matchMatchName(path,"ADBE Paint Shape"); //Paint and roto strokes not yet supported in scripting
                    if(isShapePath != null || isMaskPath != null ){
                        selectedPaths.push(path);
                        parentLayers.push(selectedLayer);
                    }
                });
            });

            // Then operate on the selection
            if (selectedPaths.length == 0){
                var pathError = localize("$$$/AE/Script/CreatePathNulls/ErrorNoPathsSelected=Error: No paths selected.");

                alert(pathError);
                return
            }

            for (var p = 0, pl = selectedPaths.length; p < pl; p++) {
                    doSomething(comp,parentLayers[p],selectedPaths[p]);
            }

    }

    function linkNullsToPoints(){
        var undoGroup = localize("$$$/AE/Script/CreatePathNulls/LinkNullsToPathPoints=Link Nulls to Path Points");
        app.beginUndoGroup(undoGroup);

        forEachPath(function(comp,selectedLayer,path){
            var pathHierarchy = [];
            var pathPath = getPropPath(path, pathHierarchy);
            // Do things with the path points
            var pathPoints = getPathPoints(path);
            for (var i = 0, ii = pathPoints.length; i < ii; i++){
                var nullName = selectedLayer.name + ": " + path.parentProperty.name + " [" + pathHierarchy.join(".") + "." + i + "]";
                if(comp.layer(nullName) == undefined){
                    var newNull = createNull(comp);
                    newNull.moveBefore(selectedLayer);
                    newNull.position.setValue(pathPoints[i]);
                    newNull.position.expression =
                            "var srcLayer = thisComp.layer(\"" + selectedLayer.name + "\"); \r" +
                            "var srcPath = srcLayer" + pathPath + ".points()[" + i + "]; \r" +
                            "srcLayer.toComp(srcPath);";
                    newNull.name = nullName;
                    newNull.label = 10;
                    }
                }
        });
        app.endUndoGroup();
    }

    function linkPointsToNulls(){
        var undoGroup = localize("$$$/AE/Script/CreatePathNulls/LinkPathPointsToNulls=Link Path Points to Nulls");
        app.beginUndoGroup(undoGroup);

        forEachPath(function(comp,selectedLayer,path){
            // Get property path to path
            var pathHierarchy = [];
            var pathPath = getPropPath(path, pathHierarchy);
            var nullSet = [];
            // Do things with the path points
            var pathPoints = getPathPoints(path);
            for (var i = 0, ii = pathPoints.length; i < ii; i++){ //For each path point
                var nullName = selectedLayer.name + ": " + path.parentProperty.name + " [" + pathHierarchy.join(".") + "." + i + "]";
                nullSet.push(nullName);

                // Get names of nulls that don't exist yet and create them
                if(comp.layer(nullName) == undefined){

                    //Create nulls
                    var newNull = createNull(comp);
                    newNull.moveBefore(selectedLayer);
                    // Null layer name
                    newNull.name = nullName;
                    newNull.label = 11;

                    // Set position using layer space transforms, then remove expressions
                    newNull.position.setValue(pathPoints[i]);
                    newNull.position.expression =
                            "var srcLayer = thisComp.layer(\"" + selectedLayer.name + "\"); \r" +
                            "var srcPath = srcLayer" + pathPath + ".points()[" + i + "]; \r" +
                            "srcLayer.toComp(srcPath);";
                    newNull.position.setValue(newNull.position.value);
                    newNull.position.expression = '';
                    }

                }

            // Get any existing Layer Control effects
            var existingEffects = [];
            forEachEffect(selectedLayer,function(targetEffect){
                if(matchMatchName(targetEffect,"ADBE Layer Control") != null) {
                    existingEffects.push(targetEffect.name);
                }
            });

            // Add new layer control effects for each null
            for(var n = 0, nl = nullSet.length; n < nl; n++){
                if(existingEffects.join("|").indexOf(nullSet[n]) != -1){ //If layer control effect exists, relink it to null
                    selectedLayer.property("ADBE Effect Parade")(nullSet[n]).property("ADBE Layer Control-0001").setValue(comp.layer(nullSet[n]).index);
                } else {
                    var newControl = selectedLayer.property("ADBE Effect Parade").addProperty("ADBE Layer Control");
                    newControl.name = nullSet[n];
                    newControl.property("ADBE Layer Control-0001").setValue(comp.layer(nullSet[n]).index);
                }
            }

            // Set path expression that references nulls
            path.expression =
                        "var nullLayerNames = [\"" + nullSet.join("\",\"") + "\"]; \r" +
                        "var origPath = thisProperty; \r" +
                        "var origPoints = origPath.points(); \r" +
                        "var origInTang = origPath.inTangents(); \r" +
                        "var origOutTang = origPath.outTangents(); \r" +
                        "var getNullLayers = []; \r" +
                        "for (var i = 0, il = nullLayerNames.length; i < il; i++){ \r" +
                        "    try{  \r" +
                        "        getNullLayers.push(effect(nullLayerNames[i])(\"ADBE Layer Control-0001\")); \r" +
                        "    } catch(err) { \r" +
                        "        getNullLayers.push(null); \r" +
                        "    }} \r" +
                        "for (var i = 0, il = getNullLayers.length; i < il; i++){ \r" +
                        "    if (getNullLayers[i] != null && getNullLayers[i].index != thisLayer.index){ \r" +
                        "        origPoints[i] = fromCompToSurface(getNullLayers[i].toComp(getNullLayers[i].anchorPoint));  \r" +
                        "    }} \r" +
                        "createPath(origPoints,origInTang,origOutTang,origPath.isClosed());";

        });
        app.endUndoGroup();
    }

    function tracePath(){
        var undoGroup = localize("$$$/AE/Script/CreatePathNulls/CreatePathTracerNull=Create Path Tracer Null");
        app.beginUndoGroup(undoGroup);

        var sliderName = localize("$$$/AE/Script/CreatePathNulls/TracerTiming=Tracer Timing");
        var checkboxName = localize("$$$/AE/Script/CreatePathNulls/LoopTracer=Loop Tracer");

        forEachPath(function(comp,selectedLayer,path){
            var pathHierarchy = [];
            var pathPath = getPropPath(path, pathHierarchy);

            // Create tracer null
            var newNull = createNull(comp);
            newNull.moveBefore(selectedLayer);

            // Add expression control effects to the null
            var nullControl = newNull.property("ADBE Effect Parade").addProperty("Pseudo/ADBE Trace Path");
            nullControl.property("Pseudo/ADBE Trace Path-0002").setValue(true);
            nullControl.property("Pseudo/ADBE Trace Path-0001").setValuesAtTimes([0,1],[0,100]);
            nullControl.property("Pseudo/ADBE Trace Path-0001").expression =
                        "if(thisProperty.propertyGroup(1)(\"Pseudo/ADBE Trace Path-0002\") == true && thisProperty.numKeys > 1){ \r" +
                        "thisProperty.loopOut(\"cycle\"); \r" +
                        "} else { \r" +
                        "value \r" +
                        "}";
            newNull.position.expression =
                    "var pathLayer = thisComp.layer(\"" + selectedLayer.name + "\"); \r" +
                    "var progress = thisLayer.effect(\"Pseudo/ADBE Trace Path\")(\"Pseudo/ADBE Trace Path-0001\")/100; \r" +
                    "var pathToTrace = pathLayer" + pathPath + "; \r" +
                    "pathLayer.toComp(pathToTrace.pointOnPath(progress));";
            newNull.rotation.expression =
                    "var pathToTrace = thisComp.layer(\"" + selectedLayer.name + "\")" + pathPath + "; \r" +
                    "var progress = thisLayer.effect(\"Pseudo/ADBE Trace Path\")(\"Pseudo/ADBE Trace Path-0001\")/100; \r" +
                    "var pathTan = pathToTrace.tangentOnPath(progress); \r" +
                    "radiansToDegrees(Math.atan2(pathTan[1],pathTan[0]));";
            newNull.name = "Trace " + selectedLayer.name + ": " + path.parentProperty.name + " [" + pathHierarchy.join(".") + "]";
            newNull.label = 10;

        });
        app.endUndoGroup();
    }

})(this);
