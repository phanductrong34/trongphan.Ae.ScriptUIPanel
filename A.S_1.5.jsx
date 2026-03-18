/*
AREA.SENSE 1.5 Developed by Masd.Lab 2024/2025
Dedicated to Gilda, Filipe and Vicky, and my cats Pearl & Tofu.
Includes "Modes" feature integrated (2025)
*/


(function(me){
    var wName="Area.Sense",
        win = (me instanceof Panel)? me : new Window("palette", wName, undefined, {resizeable:true});
    var gCount=0, labelMap={}, g=win.add("group");
    g.orientation="column"; 
    g.alignChildren=["fill","top"]; 
    g.spacing=2; 
    g.margins=2;
    var bs=[65,20],
        st="Shift = remove effector.\n",
        at="Alt = new controller.\n";

    function setBtn(txt,tTip,fn){
        var b = g.add("button",undefined,txt);
        b.preferredSize=bs;
        b.helpTip=tTip;
        b.onClick=fn;
        return b;
    }

    setBtn("Color","Apply color.\n"+st+at,function(){mainLogic("color");});
    setBtn("Opacity","Apply opacity.\n"+st+at,function(){mainLogic("opacity");});
    setBtn("Scale","Apply scale.\n"+st+at,function(){mainLogic("scale");});
    setBtn("Position","Apply position.\n"+st+at,function(){mainLogic("position");});
    setBtn("Rotation","Apply rotation.\n"+st+at,function(){mainLogic("rotation");});

    var modesBtn = setBtn("Modes","Manage .jsx / .ffx modes. SHIFT => delete",function(){showModesDialog();});

    win.onResize = function(){
        if(!win || !win.size) return;
        var w = win.size[0];
        g.orientation = (w<200) ? "column" : "row";
        win.layout.layout(true);
    };
    if(win instanceof Window){
        win.center();
        win.show();
    }else{
        win.layout.layout(true);
    }

    //---------------------------------------------------------------------------
    // Main logic for applying / removing effectors
    //---------------------------------------------------------------------------
    function mainLogic(et){
        var comp = app.project.activeItem;
        if(!(comp instanceof CompItem)){
            alert("Please select/open a composition.");
            return;
        }
        var sel = comp.selectedLayers;
        if(!sel.length){
            alert("Please select at least one layer (or a controller).");
            return;
        }
        var kb = ScriptUI.environment.keyboardState,
            sh = kb.shiftKey,
            alt = kb.altKey;

        if(sh){
            removeET(et, comp, sel);
        } else {
            applyET(et, comp, sel, alt);
        }
    }

    //---------------------------------------------------------------------------
    // Removing
    //---------------------------------------------------------------------------
    function removeET(et, comp, sel){
        app.beginUndoGroup("Remove "+et+" Effect");
        var gn = findCommonGroup(sel);
        if(gn){
            rmETGroup(et, comp, gn, sel);
            app.endUndoGroup();
            return;
        }
        var sc = findSingleCtrl(sel);
        if(sc){
            var sg = findCtrlGroup(comp, sc, et);
            if(sg){
                var all = findLayersWithGroup(comp, sg);
                rmETGroup(et, comp, sg, all);
                app.endUndoGroup();
                return;
            }
        }
        alert("No single group found among selected layers.\nNothing removed.");
        app.endUndoGroup();
    }

    function rmETGroup(et, comp, gn, lays){
        var ctrl = comp.layer(ctrlName(gn));
        if(!ctrl) ctrl = comp.layer("AS_Controller");
        var sN = "AS_"+gn+"_Fields",
            sh = comp.layer(sN);
        if(sh) sh.remove();
        var sh2 = comp.layer(sN+" 2");
        if(sh2) sh2.remove();
        switch(et){
            case "color":
                rmColor(gn,ctrl,lays);
                break;
            case "opacity":
                rmOpacity(gn,ctrl,lays);
                break;
            case "scale":
                rmScale(gn,ctrl,lays);
                break;
            case "position":
                rmPos(gn,ctrl,lays);
                break;
            case "rotation":
                rmRot(gn,ctrl,lays);
                break;
        }
    }

    function rmColor(g,ctrl,ls){
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i])){
                var fx=ls[i].property("Effects").property("Dynamic Fill");
                if(fx) fx.remove();
            }
        }
        rmFx(ctrl, [g+"_Area_Field", g+"_Area_Falloff", g+"_Visual Fields", g+"_Area_Sequence", g+"_Base Color", g+"_Select Color"]);
    }
    function rmOpacity(g,ctrl,ls){
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i])) noExp(ls[i].transform.opacity);
        }
        rmFx(ctrl, [g+"_Area_Field", g+"_Area_Falloff", g+"_Visual Fields", g+"_Area_Sequence", g+"_Min Opacity"]);
    }
    function rmScale(g,ctrl,ls){
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i])) noExp(ls[i].transform.scale);
        }
        rmFx(ctrl, [g+"_Area_Field", g+"_Area_Falloff", g+"_Visual Fields", g+"_Area_Sequence", g+"_Min Scale", g+"_Max Scale"]);
    }
    function rmPos(g,ctrl,ls){
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i])) noExp(ls[i].transform.position);
        }
        rmFx(ctrl, [g+"_Area_Field", g+"_Area_Falloff", g+"_Visual Fields", g+"_Area_Sequence", g+"_X Offset", g+"_Y Offset", g+"_Z Offset"]);
    }
    function rmRot(g,ctrl,ls){
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i])){
                noExp(ls[i].transform.rotation);
                noExp(ls[i].transform.xRotation);
                noExp(ls[i].transform.yRotation);
                noExp(ls[i].transform.zRotation);
            }
        }
        rmFx(ctrl, [
            g+"_Area_Field",
            g+"_Area_Falloff",
            g+"_Visual Fields",
            g+"_Area_Sequence",
            g+"_Min Rotation",
            g+"_Max Rotation",
            g+"_X Rotation",
            g+"_Y Rotation",
            g+"_Z Rotation"
        ]);
    }

    //---------------------------------------------------------------------------
    // Applying
    //---------------------------------------------------------------------------
    function applyET(et, comp, sel, alt){
        app.beginUndoGroup("Apply "+et+" Effect");
        var any3D=false;
        for(var i=0;i<sel.length;i++){
            if(!isCtrl(sel[i]) && sel[i].threeDLayer){
                any3D=true;
                break;
            }
        }
        var gn = findCommonGroup(sel);
        if(!gn) gn = nextGName();
        var ctrl = getCtrl(comp, gn, alt);
        if(any3D) ctrl.threeDLayer = true;
        switch(et){
            case "color":
                apColor(gn, ctrl, sel);
                break;
            case "opacity":
                apOpacity(gn, ctrl, sel);
                break;
            case "scale":
                apScale(gn, ctrl, sel);
                break;
            case "position":
                apPos(gn, ctrl, sel);
                break;
            case "rotation":
                apRot(gn, ctrl, sel);
                break;
        }
        mkFields(comp, gn, ctrl, sel);
        markGroup(sel, gn);
        pin(ctrl);
        app.endUndoGroup();
    }

    function apColor(g,c,ls){
        sld(c,"ADBE Slider Control", g+"_Area_Field", 200);
        sld(c,"ADBE Slider Control", g+"_Area_Falloff", 50);
        ck (c,"ADBE Checkbox Control", g+"_Visual Fields", 1);
        col(c,"ADBE Color Control","Visual Field Color",[1,1,1]);
        sld(c,"ADBE Slider Control", g+"_Area_Sequence",0);
        col(c,"ADBE Color Control", g+"_Base Color",[1,1,1]);
        col(c,"ADBE Color Control", g+"_Select Color",[1,0,0]);
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i])){
                var fx = getFx(ls[i],"ADBE Fill","Dynamic Fill");
                var cp = fx.property("Color");
                if(cp && cp.canSetExpression){
                    cp.expression = exColor(c.name,g);
                }
            }
        }
    }
    function apOpacity(g,c,ls){
        sld(c,"ADBE Slider Control", g+"_Area_Field", 200);
        sld(c,"ADBE Slider Control", g+"_Area_Falloff", 50);
        ck (c,"ADBE Checkbox Control", g+"_Visual Fields", 1);
        col(c,"ADBE Color Control","Visual Field Color",[1,1,1]);
        sld(c,"ADBE Slider Control", g+"_Area_Sequence",0);
        sld(c,"ADBE Slider Control", g+"_Min Opacity",0);
        for(var i=0;i<ls.length;i++){
            var L=ls[i];
            if(!isCtrl(L) && L.transform.opacity.canSetExpression){
                L.transform.opacity.expression=exOpacity(c.name,g);
            }
        }
    }
    function apScale(g,c,ls){
        sld(c,"ADBE Slider Control", g+"_Area_Field", 200);
        sld(c,"ADBE Slider Control", g+"_Area_Falloff", 50);
        ck (c,"ADBE Checkbox Control", g+"_Visual Fields", 1);
        col(c,"ADBE Color Control","Visual Field Color",[1,1,1]);
        sld(c,"ADBE Slider Control", g+"_Area_Sequence",0);
        sld(c,"ADBE Slider Control", g+"_Min Scale",50);
        sld(c,"ADBE Slider Control", g+"_Max Scale",100);
        for(var i=0;i<ls.length;i++){
            var L=ls[i];
            if(!isCtrl(L) && L.transform.scale.canSetExpression){
                L.transform.scale.expression=exScale(c.name,g);
            }
        }
    }
    function apPos(g,c,ls){
        var a3D=false;
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i]) && ls[i].threeDLayer){
                a3D=true; 
                break;
            }
        }
        sld(c,"ADBE Slider Control", g+"_Area_Field", 200);
        sld(c,"ADBE Slider Control", g+"_Area_Falloff", 50);
        ck (c,"ADBE Checkbox Control", g+"_Visual Fields", 1);
        col(c,"ADBE Color Control","Visual Field Color",[1,1,1]);
        sld(c,"ADBE Slider Control", g+"_Area_Sequence",0);
        sld(c,"ADBE Slider Control", g+"_X Offset",0);
        sld(c,"ADBE Slider Control", g+"_Y Offset",0);
        if(a3D) sld(c,"ADBE Slider Control", g+"_Z Offset",0);
        for(var i=0;i<ls.length;i++){
            var L=ls[i];
            if(!isCtrl(L) && L.transform.position.canSetExpression){
                L.transform.position.expression=exPos(c.name,g,a3D);
            }
        }
    }
    function apRot(g,c,ls){
        var a3D=false;
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i]) && ls[i].threeDLayer){
                a3D=true;
                break;
            }
        }
        sld(c,"ADBE Slider Control", g+"_Area_Field", 200);
        sld(c,"ADBE Slider Control", g+"_Area_Falloff", 50);
        ck (c,"ADBE Checkbox Control", g+"_Visual Fields", 1);
        col(c,"ADBE Color Control","Visual Field Color",[1,1,1]);
        sld(c,"ADBE Slider Control", g+"_Area_Sequence",0);
        var any2D=false;
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i]) && !ls[i].threeDLayer){
                any2D=true;
                break;
            }
        }
        if(any2D){
            sld(c,"ADBE Slider Control", g+"_Min Rotation",0);
            sld(c,"ADBE Slider Control", g+"_Max Rotation",45);
        }
        if(a3D){
            sld(c,"ADBE Slider Control", g+"_X Rotation",0);
            sld(c,"ADBE Slider Control", g+"_Y Rotation",0);
            sld(c,"ADBE Slider Control", g+"_Z Rotation",0);
        }
        for(var i=0;i<ls.length;i++){
            var L=ls[i];
            if(isCtrl(L)) continue;
            noExp(L.transform.rotation);
            noExp(L.transform.xRotation);
            noExp(L.transform.yRotation);
            noExp(L.transform.zRotation);
            if(L.threeDLayer && a3D){
                L.transform.xRotation.expression = exRot3D(c.name,g,g+"_X Rotation");
                L.transform.yRotation.expression = exRot3D(c.name,g,g+"_Y Rotation");
                L.transform.zRotation.expression = exRot3D(c.name,g,g+"_Z Rotation");
            } else if(any2D){
                L.transform.rotation.expression = exRot2D(c.name,g);
            }
        }
    }

    //---------------------------------------------------------------------------
    // Shape layers for visual fields
    //---------------------------------------------------------------------------
    function mkFields(comp,g,c,ls){
        var a3D=false;
        for(var i=0;i<ls.length;i++){
            if(!isCtrl(ls[i]) && ls[i].threeDLayer){
                a3D=true;
                break;
            }
        }
        var n="AS_"+g+"_Fields",
            sh=comp.layer(n);
        if(!sh){
            sh = comp.layers.addShape();
            sh.name=n;
            sh.label=12;
            sh.guideLayer=true;
            var cc = sh.property("ADBE Root Vectors Group"),
                grp = cc.addProperty("ADBE Vector Group");
            grp.name="Circle_Guide";
            var gg = grp.property("ADBE Vectors Group"),
                el = gg.addProperty("ADBE Vector Shape - Ellipse"),
                st = gg.addProperty("ADBE Vector Graphic - Stroke");
            st.property("ADBE Vector Stroke Width").setValue(2);
            var ds = st.property("ADBE Vector Stroke Dashes");
            if(ds){
                ds.addProperty("ADBE Vector Stroke Dash 1").setValue(10);
                ds.addProperty("ADBE Vector Stroke Gap 1").setValue(5);
            }
            if(st.property("ADBE Vector Stroke Color").canSetExpression){
                st.property("ADBE Vector Stroke Color").expression =
                    "var c=thisComp.layer('"+c.name+"');c.effect('Visual Field Color')('Color');";
            }
        }
        if(a3D) sh.threeDLayer=true;
        sh.transform.position.expression = "thisComp.layer('"+c.name+"').transform.position;";
        var ell = fEl(sh,"Circle_Guide");
        if(ell){
            var sp = ell.property("ADBE Vector Ellipse Size");
            if(sp && sp.canSetExpression){
                sp.expression = 
                    "var c=thisComp.layer('"+c.name+"');"+
                    "var area=Math.max(0,c.effect('"+g+"_Area_Field')('Slider'));"+
                    "var fall=Math.max(0,c.effect('"+g+"_Area_Falloff')('Slider'));"+
                    "var r=area+fall;[r*2,r*2];";
            }
        }
        sh.transform.opacity.expression = 
            "var c=thisComp.layer('"+c.name+"');"+
            "var chk=c.effect('"+g+"_Visual Fields')('Checkbox');"+
            "(chk==1)?100:0;";
        if(a3D){
            var s2 = sh.duplicate();
            s2.name = n+" 2";
            s2.guideLayer=true;
            s2.threeDLayer=true;
            s2.transform.yRotation.setValue(90);
            var c2 = s2.property("ADBE Root Vectors Group").property("Circle_Guide");
            if(c2){
                var st2 = c2.property("ADBE Vectors Group").property("Stroke");
                if(st2 && st2.property("ADBE Vector Stroke Color").canSetExpression){
                    st2.property("ADBE Vector Stroke Color").expression = 
                        "var c=thisComp.layer('"+c.name+"');c.effect('Visual Field Color')('Color');";
                }
            }
            s2.shy=true;
            s2.locked=true;
        }
        sh.shy=true;
        sh.locked=true;
    }
    function fEl(sh,gn){
        var c = sh.property("ADBE Root Vectors Group");
        if(!c) return null;
        var g = c.property(gn);
        if(!g) return null;
        var gc = g.property("ADBE Vectors Group");
        if(!gc) return null;
        for(var i=1;i<=gc.numProperties;i++){
            var p=gc.property(i);
            if(p && p.matchName==="ADBE Vector Shape - Ellipse"){
                return p;
            }
        }
        return null;
    }

    //---------------------------------------------------------------------------
    // Expressions
    //---------------------------------------------------------------------------
    function exColor(cn,gn){
        return (
            "var c=thisComp.layer('"+cn+"');"+
            "var A=Math.max(0,c.effect('"+gn+"_Area_Field')('Slider'));"+
            "var F=Math.max(0,c.effect('"+gn+"_Area_Falloff')('Slider'));"+
            "var Q=Math.max(0,c.effect('"+gn+"_Area_Sequence')('Slider'));"+
            "var d=length(c.toWorld([0,0,0]),toWorld(anchorPoint));"+
            "var fd=(d<=A)?1:(d>=(A+F)?0:1-(d-A)/F);"+
            "var diff=index-c.index;"+
            "var dd=Math.abs(diff);"+
            "var fi=(dd<=Q)?1-dd/Q:0;"+
            "var ff=Math.max(fd,fi);"+
            "ff=Math.max(0,Math.min(ff,1));"+
            "var b=c.effect('"+gn+"_Base Color')('Color');"+
            "var s=c.effect('"+gn+"_Select Color')('Color');"+
            "b+ff*(s-b);"
        );
    }
    function exOpacity(cn,gn){
        return (
            "var c=thisComp.layer('"+cn+"');"+
            "var A=Math.max(0,c.effect('"+gn+"_Area_Field')('Slider'));"+
            "var F=Math.max(0,c.effect('"+gn+"_Area_Falloff')('Slider'));"+
            "var Q=Math.max(0,c.effect('"+gn+"_Area_Sequence')('Slider'));"+
            "var d=length(c.toWorld([0,0,0]),toWorld(anchorPoint));"+
            "var fd=(d<=A)?1:(d>=(A+F)?0:1-(d-A)/F);"+
            "var diff=index-c.index;"+
            "var dd=Math.abs(diff);"+
            "var fi=(dd<=Q)?1-dd/Q:0;"+
            "var ff=Math.max(fd,fi);"+
            "ff=Math.max(0,Math.min(ff,1));"+
            "var mn=c.effect('"+gn+"_Min Opacity')('Slider');"+
            "linear(ff,0,1,mn,100);"
        );
    }
    function exScale(cn,gn){
        return (
            "var c=thisComp.layer('"+cn+"');"+
            "var A=Math.max(0,c.effect('"+gn+"_Area_Field')('Slider'));"+
            "var F=Math.max(0,c.effect('"+gn+"_Area_Falloff')('Slider'));"+
            "var Q=Math.max(0,c.effect('"+gn+"_Area_Sequence')('Slider'));"+
            "var d=length(c.toWorld([0,0,0]),toWorld(anchorPoint));"+
            "var fd=(d<=A)?1:(d>=(A+F)?0:1-(d-A)/F);"+
            "var diff=index-c.index;"+
            "var dd=Math.abs(diff);"+
            "var fi=(dd<=Q)?1-dd/Q:0;"+
            "var ff=Math.max(fd,fi);"+
            "ff=Math.max(0,Math.min(ff,1));"+
            "var mn=c.effect('"+gn+"_Min Scale')('Slider');"+
            "var mx=c.effect('"+gn+"_Max Scale')('Slider');"+
            "var r=linear(ff,0,1,[mn,mn,mn],[mx,mx,mx]);"+
            "r.slice(0,value.length);"
        );
    }
    function exPos(cn,gn,a3D){
        var s =
            "var c=thisComp.layer('"+cn+"');"+
            "var A=Math.max(0,c.effect('"+gn+"_Area_Field')('Slider'));"+
            "var F=Math.max(0,c.effect('"+gn+"_Area_Falloff')('Slider'));"+
            "var Q=Math.max(0,c.effect('"+gn+"_Area_Sequence')('Slider'));"+
            "var d=length(c.toWorld([0,0,0]),toWorld(anchorPoint));"+
            "var fd=(d<=A)?1:(d>=(A+F)?0:1-(d-A)/F);"+
            "var diff=index-c.index;"+
            "var dd=Math.abs(diff);"+
            "var fi=(dd<=Q)?1-dd/Q:0;"+
            "var ff=Math.max(fd,fi);"+
            "ff=Math.max(0,Math.min(ff,1));"+
            "var x=c.effect('"+gn+"_X Offset')('Slider');"+
            "var y=c.effect('"+gn+"_Y Offset')('Slider');";
        if(a3D){
            s +=
            "var z=c.effect('"+gn+"_Z Offset')('Slider');"+
            "var ox=ff*x;var oy=ff*y;var oz=ff*z;"+
            "value+[ox,oy,oz];";
        } else {
            s +=
            "var ox=ff*x;var oy=ff*y;"+
            "value+[ox,oy];";
        }
        return s;
    }
    function exRot3D(cn,gn,ax){
        return (
            "var c=thisComp.layer('"+cn+"');"+
            "var A=Math.max(0,c.effect('"+gn+"_Area_Field')('Slider'));"+
            "var F=Math.max(0,c.effect('"+gn+"_Area_Falloff')('Slider'));"+
            "var Q=Math.max(0,c.effect('"+gn+"_Area_Sequence')('Slider'));"+
            "var d=length(c.toWorld([0,0,0]),toWorld(anchorPoint));"+
            "var fd=(d<=A)?1:(d>=(A+F)?0:1-(d-A)/F);"+
            "var diff=index-c.index;"+
            "var dd=Math.abs(diff);"+
            "var fi=(dd<=Q)?1-dd/Q:0;"+
            "var ff=Math.max(fd,fi);"+
            "var v=c.effect('"+ax+"')('Slider');"+
            "linear(ff,0,1,0,v);"
        );
    }
    function exRot2D(cn,gn){
        return (
            "var c=thisComp.layer('"+cn+"');"+
            "var A=Math.max(0,c.effect('"+gn+"_Area_Field')('Slider'));"+
            "var F=Math.max(0,c.effect('"+gn+"_Area_Falloff')('Slider'));"+
            "var Q=Math.max(0,c.effect('"+gn+"_Area_Sequence')('Slider'));"+
            "var d=length(c.toWorld([0,0,0]),toWorld(anchorPoint));"+
            "var fd=(d<=A)?1:(d>=(A+F)?0:1-(d-A)/F);"+
            "var diff=index-c.index;"+
            "var dd=Math.abs(diff);"+
            "var fi=(dd<=Q)?1-dd/Q:0;"+
            "var ff=Math.max(fd,fi);"+
            "var mn=c.effect('"+gn+"_Min Rotation')('Slider');"+
            "var mx=c.effect('"+gn+"_Max Rotation')('Slider');"+
            "linear(ff,0,1,mn,mx);"
        );
    }

    //---------------------------------------------------------------------------
    // Misc helpers
    //---------------------------------------------------------------------------
    function pin(l){
        if(!l || !l.isValid) return;
        var c = l.containingComp;
        for(var i=1;i<=c.numLayers;i++){
            c.layer(i).selected=false;
        }
        l.selected=true;
        var cmd = app.findMenuCommandId("Lock");
        if(cmd>0) app.executeCommand(cmd);
    }
    function findCommonGroup(ls){
        var f="";
        for(var i=0;i<ls.length;i++){
            var m=ls[i].property("ADBE Marker");
            if(!m || m.numKeys<1) continue;
            var v=m.keyValue(1);
            if(v && v.comment && v.comment.indexOf("AS_")==0){
                var g=v.comment.substring(3);
                if(!f) f=g;
                else if(f!==g) return null;
            }
        }
        return f||null;
    }
    function isCtrl(l){
        return(l && (l.name.match(/^AS_.*_Controller$/) || l.name==="AS_Controller"));
    }
    function nextGName(){
        gCount++;
        return (gCount<10?"0"+gCount:gCount)+"";
    }
    function markGroup(ls,gn){
        if(!gn) return;
        var lbl = lblColor(gn),
            mk = "AS_"+gn;
        for(var i=0;i<ls.length;i++){
            var L=ls[i];
            if(!isCtrl(L)){
                var mv=new MarkerValue(mk);
                L.property("ADBE Marker").setValueAtTime(0,mv);
                L.label=lbl;
            }
        }
    }
    function lblColor(g){
        if(!labelMap[g]) labelMap[g] = 1 + Math.floor(Math.random()*16);
        return labelMap[g];
    }
    function ctrlName(g){
        return "AS_"+g+"_Controller";
    }
    function getCtrl(comp,g,a){
        if(a){
            var n = ctrlName(g),
                c = comp.layer(n);
            if(!c){
                c = comp.layers.addNull();
                c.name = n;
                c.label=10;
            }
            return c;
        }
        var c2 = comp.layer("AS_Controller");
        if(!c2){
            c2 = comp.layers.addNull();
            c2.name="AS_Controller";
            c2.label=10;
        }
        return c2;
    }
    function findSingleCtrl(s){
        var c=null;
        for(var i=0;i<s.length;i++){
            if(isCtrl(s[i])){
                if(c) return null;
                c=s[i];
            }
        }
        return c;
    }
    function findCtrlGroup(comp,ctrl,et){
        var need=needList(et),
            fx=ctrl.property("Effects");
        if(!fx) return null;
        var map={};
        for(var i=1;i<=fx.numProperties;i++){
            var f=fx.property(i),
                nm=f.name,
                mt=nm.match(/^(G\d+)_/);
            if(mt){
                var gr=mt[1];
                if(!map[gr]) map[gr]=[];
                map[gr].push(nm);
            }
        }
        var single=null;
        for(var gn in map){
            var arr=map[gn];
            if(hasAll(arr,gn,need)){
                if(single) return null;
                single=gn;
            }
        }
        return single;
    }
    function needList(et){
        switch(et){
            case "color":
                return [
                    "_Area_Field","_Area_Falloff","_Visual Fields","_Area_Sequence","_Base Color","_Select Color"
                ];
            case "opacity":
                return [
                    "_Area_Field","_Area_Falloff","_Visual Fields","_Area_Sequence","_Min Opacity"
                ];
            case "scale":
                return [
                    "_Area_Field","_Area_Falloff","_Visual Fields","_Area_Sequence","_Min Scale","_Max Scale"
                ];
            case "position":
                return [
                    "_Area_Field","_Area_Falloff","_Visual Fields","_Area_Sequence","_X Offset","_Y Offset","_Z Offset"
                ];
            case "rotation":
                return [
                    "_Area_Field","_Area_Falloff","_Visual Fields","_Area_Sequence","_Min Rotation","_Max Rotation","_X Rotation","_Y Rotation","_Z Rotation"
                ];
        }
        return [];
    }
    function hasAll(list,g,arr){
        for(var i=0;i<arr.length;i++){
            if(list.indexOf(g+arr[i])<0) return false;
        }
        return true;
    }
    function findLayersWithGroup(comp,g){
        var a=[];
        for(var i=1;i<=comp.numLayers;i++){
            var L=comp.layer(i),
                m=L.property("ADBE Marker");
            if(m && m.numKeys>=1){
                var v=m.keyValue(1);
                if(v && v.comment==="AS_"+g) a.push(L);
            }
        }
        return a;
    }
    function noExp(p){
        if(p && p.canSetExpression) p.expression="";
    }
    function rmFx(l,names){
        if(!l || !l.isValid) return;
        var fx=l.property("Effects");
        if(!fx) return;
        for(var i=fx.numProperties;i>=1;i--){
            var f=fx.property(i);
            if(names.indexOf(f.name)>=0){
                f.remove();
            }
        }
    }
    function sld(l,m,n,v){
        var f = getFx(l,m,n);
        f.property(1).setValue(v);
    }
    function ck(l,m,n,v){
        var f = getFx(l,m,n);
        f.property(1).setValue(v);
    }
    function col(l,m,n,v){
        var f = getFx(l,m,n);
        f.property("ADBE Color Control-0001").setValue(v);
    }
    function getFx(l,m,n){
        var e = l.property("Effects");
        if(!e) e = l.addProperty("ADBE Effect Parade");
        var f = e.property(n);
        if(!f){
            f = e.addProperty(m);
            f.name=n;
        }
        return f;
    }

    //---------------------------------------------------------------------------
    // Modes Window
    //---------------------------------------------------------------------------
    function showModesDialog(){
        var d = new Window("dialog","AreaSense - Modes");
        d.orientation="column";
        d.alignChildren=["fill","top"];
        d.margins=12;

        var g = d.add("group");
        g.orientation="column";
        g.alignChildren=["fill","top"];

        var lb = g.add("listbox",[0,0,300,150],[],{multiselect:false,scrollable:true});
        refModes(lb);

        var br = d.add("group");
        br.orientation="row";
        br.alignment="right";

        // --- Load button (shift => load folder of .jsx)
        br.add("button", undefined, "Load").onClick = function(){
            var kb = ScriptUI.environment.keyboardState;
            if(kb.shiftKey){
                // SHIFT => load entire folder of .jsx
                loadFolderOfJSX(lb);
            } else {
                // normal => single file
                loadFile(lb);
            }
        };

        // --- Apply button (shift => delete file)
        br.add("button", undefined, "Apply").onClick = function(){
            var it = lb.selection;
            if(!it){
                alert("Please select a file from the list first.");
                return;
            }
            var kb = ScriptUI.environment.keyboardState;
            if(kb.shiftKey){
                delFile(it);
            } else {
                applyFile(it.filePath);
            }
        };

        br.add("button",undefined,"Close").onClick=function(){
            d.close();
        };

        d.center();
        d.show();
    }

    // Refresh mode list
    function refModes(lb){
        lb.removeAll();
        var f = modeFolder();
        if(!f.exists) f.create();
        var files = f.getFiles("*.*");
        for(var i=0;i<files.length;i++){
            var ff=files[i];
            if(ff instanceof File){
                var nn=ff.name.replace(/\.[^.]+$/,"");
                var it=lb.add("item",nn);
                it.filePath=ff.fsName;
            }
        }
    }

    // Single-file load
    function loadFile(lb){
        var f = File.openDialog("Select a .jsx or .ffx mode file","All Files:*.*");
        if(!f) return;
        var fld=modeFolder();
        if(!fld.exists) fld.create();
        var dp=fld.fsName+"/"+f.name,
            df=new File(dp);
        if(df.exists){
            if(!confirm("A file named '"+f.name+"' already exists.\nOverwrite it?")) return;
        }
        if(!f.copy(df.fsName)){
            alert("Failed to copy file to:\n"+df.fsName);
            return;
        }
        refModes(lb);
    }

    // NEW: Folder-of-JSX load
    function loadFolderOfJSX(lb){
        var folder = Folder.selectDialog("Select a folder containing .jsx files");
        if(!folder) return;  // user cancelled

        // Filter for .jsx
        var files = folder.getFiles("*.jsx");
        if(!files.length){
            alert("No .jsx files found in the selected folder.");
            return;
        }

        var dest = modeFolder();
        if(!dest.exists) dest.create();

        for(var i=0; i<files.length; i++){
            var f = files[i];
            if(!(f instanceof File)) continue;

            var dp = dest.fsName + "/" + f.name;
            var df = new File(dp);

            if(df.exists){
                // Overwrite check
                if(!confirm("A file named '" + f.name + "' already exists.\nOverwrite it?")){
                    continue; // skip copying this one
                }
            }
            if(!f.copy(df.fsName)){
                alert("Failed to copy file to:\n" + df.fsName);
            }
        }
        refModes(lb);
    }

    // SHIFT => delete file
    function delFile(it){
        var p = it.filePath,
            f = new File(p);
        if(!f.exists){
            alert("File not found:\n"+p);
        } else {
            if(confirm("Delete this file?\n"+f.name)){
                if(!f.remove()){
                    alert("Could not delete file:\n"+f.fsName);
                }
            } else {
                return;
            }
        }
        it.remove();
    }

    // Apply .jsx or .ffx file to selected layers
    function applyFile(fp){
        var f = new File(fp);
        if(!f.exists){
            alert("Mode file not found:\n"+f.fsName);
            return;
        }
        var e = f.name.match(/\.(\w+)$/);
        if(!e){
            alert("No recognized extension. Doing nothing.");
            return;
        }
        var x=e[1].toLowerCase();
        if(x==="jsx"){
            try{
                $.evalFile(f);
            } catch(z){
                alert("Error applying .jsx:\n"+z.toString());
            }
        } else if(x==="ffx"){
            var c=app.project.activeItem;
            if(!(c instanceof CompItem)){
                alert("Please select/open a comp before applying .ffx");
                return;
            }
            var s=c.selectedLayers;
            if(!s || !s.length){
                alert("Select at least one layer to apply .ffx");
                return;
            }
            app.beginUndoGroup("Apply .ffx: "+f.name);
            for(var i=0;i<s.length;i++){
                try{
                    s[i].applyPreset(f);
                }catch(err){}
            }
            app.endUndoGroup();
        } else {
            alert("Unrecognized extension: ."+x+"\nNo action taken.");
        }
    }

    // Modes folder location
    function modeFolder(){
        return new Folder("~/Documents/After Effects/Scripts/AreaSense/Modes");
    }
})(this);
