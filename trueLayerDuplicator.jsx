/*
 * Decompiled with Jsxer
 * Version: 1.7.4
 * JSXBIN 2.0
 */

function allowScriptsOption() {
  if (isSecurityPrefSet() != true) {
    var win = macOrPc();
    if (win == -1) {
      var ex = "After Effects->";
    } else {
      var ex = "Edit->";
    }
    var aeVer = aeVersion();
    alert(
      "Please Enable \'Allow Scripts to Write Files and Access Network\' option\nfrom the menu command:\n" +
        ex +
        "Preferences->" +
        aeVer +
        "\nto visit VDODNA.com within After Effects",
    );
    return false;
  } else {
    return true;
  }
}
function aeVersion() {
  var versionPref = null;
  var versionNumber = parseFloat(app.version);
  if (versionNumber >= 16.1) {
    versionPref = "Scripting & Expressions";
  } else {
    versionPref = "General";
  }
  return versionPref;
}
function isSecurityPrefSet() {
  var securitySetting = app.preferences.getPrefAsLong(
    "Main Pref Section",
    "Pref_SCRIPTING_FILE_NETWORK_SECURITY",
  );
  return securitySetting == 1;
}
function macOrPc() {
  var op = $.os;
  var win = op.indexOf("Windows");
  return win;
}
function openUrl(url) {
  if (macOrPc() > -1) {
    system.callSystem("explorer " + url);
  } else {
    system.callSystem("open " + url);
  }
}
function openProgress(functionName, actionName) {
  var progressWindow = new Window(
    "palette",
    functionName + " by VDODNA.com v" + version,
    [0, 0, 300, 120],
  );
  progressWindow.orientation = "column";
  var actionDropdown = progressWindow.add(
    "statictext",
    [12, 10, 300, 30],
    actionName,
  );
  var progress = progressWindow.add("progressbar", [10, 40, 290, 60]);
  var progressText = progressWindow.add("statictext", [130, 40, 290, 60]);
  progressWindow.add("image", [0, 0, 300, 170], VDODNA);
  progressWindow.add("statictext", [120, 50, 300, 170], "VDODNA.com");
  progressWindow.center();
  progressWindow.show();
  return [progressWindow, progress, progressText];
}
function progresBarIteration() {
  var iteration = 1;
  return iteration;
}
function closeProgress(progWin) {
  progWin[1].value = 100;
  progWin[2].text = "Done!";
  progWin[0].update();
  $.sleep(500);
  progWin[0].close();
}
function updateProgress(progWin) {
  progWin[1].value += progresBarIteration();
  progWin[0].update();
}
function digDup(tmpLayer, progWin) {
  var newSource = tmpLayer.source.duplicate();
  sourceArr[sourceArr.length] = tmpLayer.source;
  newSourceArr[newSourceArr.length] = newSource;
  tmpLayer.replaceSource(newSource, true);
  for (var i = 1; i <= newSource.numLayers; i += 1) {
    updateProgress(progWin);
    if (newSource.layer(i).source instanceof CompItem) {
      var exists = checkSourceForInstances(newSource.layer(i).source);
      if (exists == false) {
        digDup(newSource.layer(i), progWin);
      } else {
        var instLayer = newSource.layer(i);
        instLayer.replaceSource(exists, true);
      }
    }
  }
  return newSource;
}
function checkSourceForInstances(tmpSource) {
  var answer = false;
  for (var i = 0; i < sourceArr.length; i += 1) {
    if (tmpSource == sourceArr[i]) {
      answer = newSourceArr[i];
      break;
    }
  }
  return answer;
}
function trueDuplicateThis() {
  var progWin = openProgress(
    "True Layer Duplicator",
    "Really Duplicating " + selection.name,
  );
  var MasterTmpLayer = selection.duplicate();
  selection.selected = false;
  MasterTmpLayer.selected = true;
  var newSourceMaster = digDup(MasterTmpLayer, progWin);
  writeLn("Layer Was TrueDuped");
  closeProgress(progWin);
}
function trueDuplicateProjectItem(selectedItem) {
  var progWin = openProgress(
    "True Layer Duplicator",
    "Really Duplicating " + selectedItem.name,
  );
  var masterTmpLayer = selectedItem.duplicate();
  selectedItem.selected = false;
  masterTmpLayer.selected = true;
  for (var i = 1; i <= masterTmpLayer.numLayers; i += 1) {
    updateProgress(progWin);
    if (masterTmpLayer.layer(i).source instanceof CompItem) {
      var exists = checkSourceForInstances(masterTmpLayer.layer(i).source);
      if (exists == false) {
        digDup(masterTmpLayer.layer(i), progWin);
      } else {
        var instLayer = masterTmpLayer.layer(i);
        instLayer.replaceSource(exists, true);
      }
    }
  }
  writeLn("Comp Was TrueDuped");
  closeProgress(progWin);
}
function openEnd(compNames, layersOrItems) {
  var messArr = [
    "Great!",
    "That was Awesome!",
    "What just happend?",
    "Fudge me!",
    "Holy Moly!",
    "Success!",
    "That\'s it?",
    "Holy Crap!",
    "Damn! that was fast!",
    "Coffee time! oh... it\'s done...",
  ];
  var endWindow = new Window(
    "palette",
    messArr[Math.floor(Math.random() * messArr.length)],
    undefined,
  );
  var panel = endWindow.add(
    "group",
    undefined,
    "True layer duplicator v " + version,
  );
  panel.add("image", undefined, VDODNA);
  panel.add("statictext", undefined, "True Layer Duplicator v" + version);
  endWindow.add(
    "statictext",
    undefined,
    "The following " + layersOrItems + " were True-Duped:",
  );
  for (var i = 0; i < compNames.length; i += 1) {
    endWindow.add("statictext", undefined, compNames[i]);
  }
  var buttonsGroup = endWindow.add("group", undefined, "some Text");
  var visitButton = buttonsGroup.add("button", undefined, "visit VDODNA.com");
  visitButton.active = true;
  var closeButton = buttonsGroup.add("button", undefined, "Close");
  endWindow.center();
  endWindow.show();
  closeButton.onClick = function () {
    endWindow.close();
  };
  visitButton.onClick = function () {
    if (allowScriptsOption() == true) {
      openUrl("http://bit.ly/2JpkOAa");
    }
    endWindow.close();
  };
}
var VDODNA =
  '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00(\x00\x00\x00\x1d\b\x06\x00\x00\x00\xd8I.s\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\xc9e<\x00\x00\x03qiTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin="\xef\xbb\xbf" id="W5M0MpCehiHzreSzNTczkc9d"?> <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c138 79.159824, 2016/09/14-01:09:01        "> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"> <rdf:Description rdf:about="" xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmpMM:OriginalDocumentID="xmp.did:58771744-58e7-4740-9ffb-84e7b24d6c44" xmpMM:DocumentID="xmp.did:285EF3212F7811E78BD98339AEF362EB" xmpMM:InstanceID="xmp.iid:285EF3202F7811E78BD98339AEF362EB" xmp:CreatorTool="Adobe Photoshop CC (Windows)"> <xmpMM:DerivedFrom stRef:instanceID="xmp.iid:8dc096bb-e377-744d-9257-bd8124de0d9b" stRef:documentID="xmp.did:58771744-58e7-4740-9ffb-84e7b24d6c44"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end="r"?>\xda\x90K\xff\x00\x00\x02\xdbIDATx\xda\xacX\xcbj\x14A\x14\xedi#\n\x82\x1a\x88\xf1\x11\x14\x05\x17\x82\x13\x11\x14c\xc6\x8e\x90\xc58\x9a\x84\x88\x8b,u%\xf8\x11\xe2\xc2\x0f\xf0\x13t\xe1"\v]\b:\x19\'\v%\xc9\x8c\xc8\xa0QP\x10\x15\x13DPQ!\x82\xf8\x88&>N\xc1m-:u\x1f3\xe6\xc2\xa1\xa6\xfbVW\x9d\xae{\xea\xd6\xed\xc9\xd5j\xb5{Q\x14\xed\x00~G\xffl\x05p\x158\x13\xe9v\x118\x01\xfc\xf4\xee\xe5\x80\'\xc0a\xba.\x03\x05\xe0\x97\xd7\'\x06\xde&I\xb2[\x1a<\x07\x82W\xd0\x8e\x04|\x8b\xc0\xea\xcc\xc4Y[\t|\'B!\xe2\xa7\x81\x0e\xe0\x830\xc6A\x90lpN\xf7\x16\x97\x19_\x1bpHY\xbd>\x86\x9c\xb3Qj\x8f*c\x1c\x93\x9c\x8e\xe0m`\x81\xf1\xb7:\xb8\ve\xba*\xa5\xff%\xf8\x15\x98`\xfc\x83\xca\xe0C\xcc\xfd;\xc0\x17\xe3K\x1e\xa8\xd7\xeb\x1b$\x82\xcen0\xfe=\xc06\xc6\xb7\x13\xd8\xc5\xf8\xaeS[ \rj6\xa8\x11\xbc\xd9B\b\x06\x84g\xca\xca\n\x9b\xa5\x94\x12|\x01\xcc0}JM\x0e\xfa\nxj\xd1\x97gG\x10\xe6\x9cDPZ\xc5\xde\xc0\xbdU@?\xd3\xbfJm\'\xb0\xd7H\xb0\x1d\xe8\xd1\b\x8e1\x0fo\x02\xf2\xd97\xa6\x1c\x19\xb2T\xcf\xc7\xa3\xe6lH#x\x8bvt\xc8\x863\xd7E\xa6\xdf<0n\xcc\x00\xda\x1cK\b.PN\xb4\xe8\xad\xc0\xf4\x9b\xf0rjo\x93\x04\xbb\xa1\xc3.\x89\xa0\xaf\x9f\xac\xb9\x13e\x1d\xfd\xde\b\xecc\xfa\xa5:\xce\x93\x06Cv\x01xc\xcd\x1813A\xa8_\xd1\x90x\xc7\x94\x14\xe4$t\x16\x98e\xfc\x05\x8d\xe0,U!\xd2\xdbq\xdaz\xe6\xa5\xaaa\xa6O\x83\x8a\x8bi\xc6\xdf\xaf\x11t6\xc5\x1dIT\x18\xf4(\xbbw\xbdPdT\xa8\x1dg\xfc\xdb\xa1\xc3\xbcF\xb0\xc6<\xbc\x158\x07lV\xf4\'I\xa0\xe2m\xa6y\x8b\x0ec!\xd1f\xcdm\x92\xf3T\x03\x86\xb45\xa5\x10|\xe9\xc9\xe7\x1b0i\xc9\x18!\x82s^\xa9d\xb5i*p%\x82\xf5\xcc5\x17\xe6>\x84y\x8dDP\xaan8K\'\xdbOi\x88\xcb\x91\xa1\x8a\'T\xa5\x97\x96\x9b\xe05\xc3\xf1V\xce\\\xcfPa!\x96_\x1c\xc1G\xee\x83\xc6H\xee\xb5\xa7-\xaezy\x00\xbc3\x84}I\x05\x15\v\x13W\x8d\x04\xd3\xdd\xdb!\x9c0\x95&\xe7\xe8\x82\x0e\xbb\x97\x9b\xe0\x80!\xbdD\xc6\x8d\xf2w<\x8d\xe0\xa2B\xee\x87G\x90;=\xde\x03w\x05_C\xaan$\x82\x9f\x04\x8d\xa46I9-\'\x94`Z$\xca\xdc\xb9\x8c0\xb7\xc7\xca\xc3Ucx\xdd\xc7\xd5\xda\x16\xc7\x90\xfcE\x8d`\xc5\xe8\x1f1\xe4\xc8\xa0%Ir\x1f\xcdg\xc6}\xb2M!\xf0\x18x\x18\xf8\xef\xc6\x85\xf49U0\xe9\n~\xcc\xf4\x89\xe9\\\x9f3l\xb4K\xc0\xa9\xcc\x7f7n\x8e-\x7f\x04\x18\x00G\xab\xa4T\xde+\xb1\xe8\x00\x00\x00\x00IEND\xaeB`\x82';
var version = "1.4.2";
var sourceArr = new Array();
var newSourceArr = new Array();
var selectionArray = null;
var dupLayers = false;
var layersOrItems = "";
var namesArr = new Array();
if (
  app.project.activeItem != null &&
  app.project.activeItem instanceof CompItem &&
  app.project.activeItem.selectedLayers.length > 0
) {
  selectionArray = app.project.activeItem.selectedLayers;
  dupLayers = true;
} else {
  selectionArray = app.project.selection;
}
if (
  selectionArray != null &&
  selectionArray[0].source instanceof CompItem &&
  dupLayers == true
) {
  app.beginUndoGroup("True Layer Duplication");
  layersOrItems = "Layers";
  for (var i = 0; i < selectionArray.length; i += 1) {
    var selection = selectionArray[i];
    if (selection.source instanceof CompItem) {
      namesArr[namesArr.length] = selectionArray[i].name;
      trueDuplicateThis();
    }
  }
  app.endUndoGroup();
} else {
  if (
    dupLayers == false &&
    selectionArray.length > 0 &&
    selectionArray[0] instanceof CompItem
  ) {
    app.beginUndoGroup("True Layer Duplication");
    layersOrItems = "Project Items";
    for (var c = 0; c < selectionArray.length; c += 1) {
      var selection = selectionArray[c];
      if (selection instanceof CompItem) {
        namesArr[namesArr.length] = selectionArray[c].name;
        trueDuplicateProjectItem(selection);
      }
    }
    app.endUndoGroup();
  } else {
    alert("Select Comp based Layers/Project Items");
  }
}
if (namesArr.length != 0) {
  openEnd(namesArr, layersOrItems);
}
