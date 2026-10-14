/*
* Decompiled with Jsxer
* Version: 1.7.4
* JSXBIN 2.0
*/

(function spherePanel(thisObj) {
function buildUI(thisObj) {
var win = thisObj instanceof Panel ? thisObj : new Window("palette", "3D Sphere Distributor", undefined, {resizeable: true});
win.orientation = "column";
win.alignChildren = ["fill", "top"];
win.spacing = 10;
win.margins = 16;
var title = win.add("statictext", undefined, "3D Sphere Distributor");
try {
title.graphics.font = ScriptUI.newFont("Arial", "BOLD", 18);
} catch (e) {
}
var grp = win.add("group");
grp.orientation = "row";
var createBtn = grp.add("button", undefined, "CREATE SPHERE");
createBtn.preferredSize = [180, 40];
var helpBtn = grp.add("button", undefined, "HELP");
helpBtn.preferredSize = [80, 40];
var status = win.add("statictext", undefined, "Ready");
status.alignment = ["fill", "center"];
status.preferredSize = [260, 22];
createBtn.onClick = function () {
function addSlider(n, v) {
var s = ctrl.Effects.addProperty("ADBE Slider Control");
s.name = n;
s.property(1).setValue(v);
}
var comp = app.project.activeItem;
if ((!comp) || (!(comp instanceof CompItem))) { 
alert("Open Composition");
return;
}
var layers = comp.selectedLayers;
if (!layers.length) { 
alert("Select Layers");
return;
}
app.beginUndoGroup("Sphere Distributor");
var ctrl = comp.layers.addNull();
ctrl.name = "SPHERE_CTRL";
ctrl.threeDLayer = true;
ctrl.position.setValue([comp.width / 2, comp.height / 2, 0]);
addSlider("Radius", 300);
addSlider("Total Count", layers.length);
addSlider("Offset", 0);
addSlider("Rot X", 0);
addSlider("Rot Y", 0);
addSlider("Rot Z", 0);
addSlider("Perspective Boost", 100);
addSlider("Min Scale", 10);
addSlider("Max Scale", 20);
addSlider("Orientation Mode", 0);
var chk = ctrl.Effects.addProperty("ADBE Checkbox Control");
chk.name = "Auto Face Camera";
chk.property(1).setValue(1);
var posExpr = "ctrl=thisComp.layer(\"SPHERE_CTRL\");\nr=ctrl.effect(\"Radius\")(\"Slider\");\ncnt=Math.max(1,Math.floor(ctrl.effect(\"Total Count\")(\"Slider\")));\noff=ctrl.effect(\"Offset\")(\"Slider\");\nrx=degreesToRadians(ctrl.effect(\"Rot X\")(\"Slider\"));\nry=degreesToRadians(ctrl.effect(\"Rot Y\")(\"Slider\"));\nrz=degreesToRadians(ctrl.effect(\"Rot Z\")(\"Slider\"));\ni=((index-0.5+off)%cnt+cnt)%cnt;\nga=3.14159265358979*(3-Math.sqrt(5));\nt=i/cnt;\ninc=Math.acos(1-2*t);\nazi=ga*i;\nx=Math.sin(inc)*Math.cos(azi);\ny=Math.cos(inc);\nz=Math.sin(inc)*Math.sin(azi);\np=[x,y,z]*r;\npx=p[0];py=p[1]*Math.cos(rx)-p[2]*Math.sin(rx);pz=p[1]*Math.sin(rx)+p[2]*Math.cos(rx);\np=[px,py,pz];\npx=p[0]*Math.cos(ry)+p[2]*Math.sin(ry);py=p[1];pz=-p[0]*Math.sin(ry)+p[2]*Math.cos(ry);\np=[px,py,pz];\npx=p[0]*Math.cos(rz)-p[1]*Math.sin(rz);py=p[0]*Math.sin(rz)+p[1]*Math.cos(rz);pz=p[2];\np=[px,py,pz];\np*=1+(index%2)*0.01;\np+ctrl.position;";
var scaleExpr = "ctrl=thisComp.layer(\"SPHERE_CTRL\");\ncam=thisComp.activeCamera;\nif(!cam) cam=thisComp.layer(1);\nminS=ctrl.effect(\"Min Scale\")(\"Slider\");\nmaxS=ctrl.effect(\"Max Scale\")(\"Slider\");\nboost=ctrl.effect(\"Perspective Boost\")(\"Slider\");\nd=length(transform.position,cam.position);\nt=clamp(linear(d,500,3000,0,1),0,1);\ns=linear(t,0,1,maxS,minS);\ns=linear(boost,0,100,100,s);\n[s,s];";
var orientExpr = "ctrl=thisComp.layer(\"SPHERE_CTRL\");\nauto=ctrl.effect(\"Auto Face Camera\")(\"Checkbox\");\nmode=Math.floor(ctrl.effect(\"Orientation Mode\")(\"Slider\"));\ncam=thisComp.activeCamera;\ncenter=ctrl.toWorld([0,0,0]);\npos=toWorld(anchorPoint);\norig=valueAtTime(0);\nif(auto==1 && cam){\ncp=cam.toWorld([0,0,0]);\ncf=normalize(cam.toWorldVec([0,0,1]));\nv=normalize(cp-pos);\no=lookAt(pos,cp);\nd=dot(v,cf);\nd<0 ? o+[0,180,0] : o;\n}else{\nmode==1 ? lookAt(pos,center) : orig;\n}";
var opacityExpr = "ctrl=thisComp.layer(\"SPHERE_CTRL\");\ncnt=Math.floor(ctrl.effect(\"Total Count\")(\"Slider\"));\nindex<=cnt ? 100 : 0;";
for (var i = 0; i < layers.length; i += 1) { 
var L = layers[i];
L.threeDLayer = true;
L.property("Position").expression = posExpr;
L.property("Scale").expression = scaleExpr;
L.property("Orientation").expression = orientExpr;
L.property("Opacity").expression = opacityExpr;}
app.endUndoGroup();
status.text = "Sphere Created";
};
helpBtn.onClick = function () {
var help = new Window("palette", "3D Sphere Distributor - Guide", undefined, {resizeable: true});
help.orientation = "column";
help.alignChildren = ["fill", "top"];
help.spacing = 12;
help.margins = 18;
var t = help.add("statictext", undefined, "3D Sphere Distributor");
t.graphics.font = ScriptUI.newFont("Arial", "BOLD", 16);
var stepPanel = help.add("panel", undefined, "Quick Start");
stepPanel.orientation = "column";
stepPanel.alignChildren = "left";
stepPanel.margins = 12;
stepPanel.add("statictext", undefined, "1. Select layers, images or precomps.");
stepPanel.add("statictext", undefined, "2. Click CREATE SPHERE.");
stepPanel.add("statictext", undefined, "3. Controller \'SPHERE_CTRL\' will be created.");
stepPanel.add("statictext", undefined, "4. Adjust sliders to design sphere.");
stepPanel.add("statictext", undefined, "5. Animate controller or camera.");
var ctrlPanel = help.add("panel", undefined, "Controller Sliders");
ctrlPanel.orientation = "column";
ctrlPanel.alignChildren = "left";
ctrlPanel.margins = 12;
ctrlPanel.add("statictext", undefined, "Radius \u2192 Sphere size.");
ctrlPanel.add("statictext", undefined, "Total Count \u2192 Limit visible layers.");
ctrlPanel.add("statictext", undefined, "Offset \u2192 Rotate distribution order.");
ctrlPanel.add("statictext", undefined, "Rot X/Y/Z \u2192 Rotate entire sphere.");
ctrlPanel.add("statictext", undefined, "Min Scale \u2192 Far layer size.");
ctrlPanel.add("statictext", undefined, "Max Scale \u2192 Near layer size.");
ctrlPanel.add("statictext", undefined, "Perspective Boost \u2192 Depth strength.");
ctrlPanel.add("statictext", undefined, "Orientation Mode \u2192 Face center / keep rotation.");
ctrlPanel.add("statictext", undefined, "Auto Face Camera \u2192 Billboard with anti-flip system.");
var tipPanel = help.add("panel", undefined, "Pro Tips");
tipPanel.orientation = "column";
tipPanel.alignChildren = "left";
tipPanel.margins = 12;
tipPanel.add("statictext", undefined, "\u2022 Use camera for best depth effect.");
tipPanel.add("statictext", undefined, "\u2022 Animate Offset or Rotation for motion.");
tipPanel.add("statictext", undefined, "\u2022 Precompose heavy images for performance.");
tipPanel.add("statictext", undefined, "\u2022 Enable Motion Blur for cinematic result.");
var close = help.add("button", undefined, "Close");
close.onClick = function () {
help.close();
};
help.center();
help.show();
};
win.layout.layout(true);
return win;
}
var myUI = buildUI(thisObj);
if (myUI instanceof Window) { 
myUI.center();
myUI.show();
}
})(this);