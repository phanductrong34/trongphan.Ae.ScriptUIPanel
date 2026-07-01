(function (thisObj) {

    var CTRL_NAME = "Z Space";

    // ---- helpers -----------------------------------------------------

    // Format số an toàn cho expression (tránh ký hiệu mũ kiểu 1e-7)
    function num(n) {
        if (!isFinite(n)) n = 0;
        return n.toFixed(6);
    }

    function getEffectByName(layer, name) {
        var fx = layer.property("ADBE Effect Parade");
        if (!fx) return null;
        for (var i = 1; i <= fx.numProperties; i++) {
            if (fx.property(i).name === name) return fx.property(i);
        }
        return null;
    }

    // Tên camera người dùng đã chọn (rỗng = tự dò activeCamera / camera mặc định).
    var selectedCamName = "";

    function escStr(s) { return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

    // Đoạn expression tính tâm chiếu C (vị trí world của camera).
    //  - Nếu có chỉ định camera: dùng thisComp.layer("tên").toWorld([0,0,0])
    //    -> tự cộng cả transform của Null cha (nếu camera được parent vào Null).
    //  - Nếu camera đó không tồn tại / chưa chọn: fallback sang activeCamera,
    //    cuối cùng dựng camera mặc định AE (50mm / film 36mm) để vẫn bù được.
    function camSnippet(camName) {
        var named = "";
        if (camName) {
            named =
                "try { C = thisComp.layer(\"" + escStr(camName) + "\").toWorld([0,0,0]); } catch(err) { C = null; }\n";
        }
        return "" +
            "var C = null;\n" +
            named +
            "if (C == null) {\n" +
            "  var cam = thisComp.activeCamera;\n" +
            "  if (cam != null) { C = cam.toWorld([0,0,0]); }\n" +
            "  else { var zoom = thisComp.width * 50/36; C = [thisComp.width/2, thisComp.height/2, -zoom]; }\n" +
            "}\n";
    }

    function buildPosExpr(P0, camName) {
        // Layer di chuyển trên đường thẳng nối camera (C) và vị trí gốc (P0).
        // Z chạy theo slider; X, Y bù theo tia để giữ nguyên vị trí trên màn hình.
        return "" +
            "var s = effect(\"" + CTRL_NAME + "\")(\"Slider\");\n" +
            "var P0 = [" + num(P0[0]) + ", " + num(P0[1]) + ", " + num(P0[2]) + "];\n" +
            camSnippet(camName) +
            "var d = P0[2] - C[2];\n" +
            "var t = (d == 0) ? 1 : (s - C[2]) / d;\n" +
            "[C[0] + t*(P0[0]-C[0]), C[1] + t*(P0[1]-C[1]), s];";
    }

    function buildScaleExpr(P0, S0, camName) {
        return "" +
            "var s = effect(\"" + CTRL_NAME + "\")(\"Slider\");\n" +
            "var Z0 = " + num(P0[2]) + ";\n" +
            "var S0 = [" + num(S0[0]) + ", " + num(S0[1]) + ", " + num(S0[2]) + "];\n" +
            camSnippet(camName) +
            "var d = Z0 - C[2];\n" +
            "var t = (d == 0) ? 1 : (s - C[2]) / d;\n" +
            "[S0[0]*t, S0[1]*t, S0[2]*t];";
    }

    // ---- LOCK --------------------------------------------------------

    function doLock() {
        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Hãy mở một composition.");
            return;
        }
        var sel = comp.selectedLayers;
        if (sel.length === 0) {
            alert("Hãy chọn ít nhất 1 layer.");
            return;
        }

        app.beginUndoGroup("Z Depth Lock");
        try {
            var done = 0, skipped = 0;
            for (var i = 0; i < sel.length; i++) {
                var layer = sel[i];

                if (!(layer instanceof AVLayer)) { skipped++; continue; }
                if (getEffectByName(layer, CTRL_NAME)) { skipped++; continue; } // đã lock

                // bật 3D
                layer.threeDLayer = true;

                var tg = layer.property("ADBE Transform Group");
                var posProp = tg.property("ADBE Position");
                var sclProp = tg.property("ADBE Scale");

                // đọc giá trị hiện tại (sau khi đã bật 3D)
                var P0 = posProp.value;          // [x, y, z]
                var S0 = sclProp.value;          // [sx, sy, sz]
                if (P0.length < 3) P0 = [P0[0], P0[1], 0];
                if (S0.length < 3) S0 = [S0[0], S0[1], 100];

                // thêm Slider Control "Z Space"
                var fx = layer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
                fx.name = CTRL_NAME;
                fx.property(1).setValue(P0[2]); // slider = Z hiện tại -> t = 1, không nhảy

                // gắn expression (dựa vào camera đã chọn nếu có)
                posProp.expression = buildPosExpr(P0, selectedCamName);
                sclProp.expression = buildScaleExpr(P0, S0, selectedCamName);

                done++;
            }
            statusText.text = "Locked: " + done + (skipped ? ("  •  bỏ qua: " + skipped) : "");
        } catch (e) {
            alert("Lỗi khi Lock: " + e.toString());
        } finally {
            app.endUndoGroup();
        }
    }

    // ---- RELEASE -----------------------------------------------------

    function doRelease() {
        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Hãy mở một composition.");
            return;
        }
        var sel = comp.selectedLayers;
        if (sel.length === 0) {
            alert("Hãy chọn ít nhất 1 layer.");
            return;
        }

        app.beginUndoGroup("Z Depth Release");
        try {
            var done = 0, skipped = 0;
            for (var i = 0; i < sel.length; i++) {
                var layer = sel[i];
                var ctrl = getEffectByName(layer, CTRL_NAME);
                if (!ctrl) { skipped++; continue; }

                var tg = layer.property("ADBE Transform Group");
                var posProp = tg.property("ADBE Position");
                var sclProp = tg.property("ADBE Scale");

                // bake giá trị đang được tính (tại thời điểm hiện tại)
                var bakedPos = posProp.value;
                var bakedScl = sclProp.value;

                // xoá expression
                if (posProp.canSetExpression) posProp.expression = "";
                if (sclProp.canSetExpression) sclProp.expression = "";

                // apply giá trị tĩnh
                posProp.setValue(bakedPos);
                sclProp.setValue(bakedScl);

                // xoá slider Z Space
                ctrl.remove();

                done++;
            }
            statusText.text = "Released: " + done + (skipped ? ("  •  bỏ qua: " + skipped) : "");
        } catch (e) {
            alert("Lỗi khi Release: " + e.toString());
        } finally {
            app.endUndoGroup();
        }
    }

    // ---- chọn camera -------------------------------------------------

    var camNameText;

    function doSetCamera() {
        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) { alert("Hãy mở một composition."); return; }
        var sel = comp.selectedLayers;
        var cam = null;
        for (var i = 0; i < sel.length; i++) {
            if (sel[i] instanceof CameraLayer) { cam = sel[i]; break; }
        }
        if (!cam) { alert("Hãy chọn 1 layer Camera trước."); return; }
        selectedCamName = cam.name;
        if (camNameText) camNameText.text = "Camera: " + selectedCamName;
        if (statusText) statusText.text = "Đã chọn camera: " + selectedCamName;
    }

    function doClearCamera() {
        selectedCamName = "";
        if (camNameText) camNameText.text = "Camera: (tự dò active)";
        if (statusText) statusText.text = "Đã bỏ chọn camera (dùng active camera).";
    }

    // ---- UI ----------------------------------------------------------

    var statusText;

    function buildUI(thisObj) {
        var pal = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "Z Depth Lock", undefined, { resizeable: true });

        pal.orientation = "column";
        pal.alignChildren = ["fill", "top"];
        pal.spacing = 8;
        pal.margins = 12;

        var title = pal.add("statictext", undefined, "Z DEPTH LOCK");
        title.alignment = ["center", "top"];
        try { title.graphics.font = ScriptUI.newFont(title.graphics.font.name, "BOLD", 14); } catch (e) {}

        var info = pal.add("statictext", undefined,
            "1. Chọn layer Camera rồi bấm 'Set Camera'.\n2. Chọn layer cần lock rồi bấm LOCK.\nKéo slider 'Z Space' để đổi độ sâu Z;\nX,Y & Scale tự bù theo tia camera.\nRelease: bake giá trị & gỡ expression.",
            { multiline: true });
        info.preferredSize.height = 78;

        var camGroup = pal.add("group");
        camGroup.orientation = "row";
        camGroup.alignChildren = ["fill", "center"];
        camGroup.spacing = 4;
        var btnSetCam = camGroup.add("button", undefined, "Set Camera");
        btnSetCam.onClick = doSetCamera;
        var btnClearCam = camGroup.add("button", undefined, "✕");
        btnClearCam.preferredSize.width = 28;
        btnClearCam.helpTip = "Bỏ chọn camera (dùng active camera)";
        btnClearCam.onClick = doClearCamera;

        camNameText = pal.add("statictext", undefined, "Camera: (tự dò active)");
        camNameText.alignment = ["fill", "top"];

        var btnLock = pal.add("button", undefined, "LOCK");
        btnLock.onClick = doLock;

        var btnRelease = pal.add("button", undefined, "RELEASE");
        btnRelease.onClick = doRelease;

        statusText = pal.add("statictext", undefined, "Chọn layer rồi bấm LOCK.");
        statusText.alignment = ["fill", "bottom"];

        pal.layout.layout(true);
        return pal;
    }

    var myPanel = buildUI(thisObj);
    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    }

})(this);