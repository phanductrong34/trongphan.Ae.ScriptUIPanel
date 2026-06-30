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

    // Đoạn expression tính tâm chiếu C (nodal point) của camera.
    // Có camera layer  -> dùng vị trí thật của camera.
    // Không có camera   -> dựng lại camera mặc định của AE (50mm / film 36mm,
    //                      đặt tại tâm comp, Z = -width*50/36) để vẫn bù đúng.
    var CAM_SNIPPET =
        "var cam = thisComp.activeCamera;\n" +
        "var C;\n" +
        "if (cam == null) {\n" +
        "  var zoom = thisComp.width * 50/36;\n" +
        "  C = [thisComp.width/2, thisComp.height/2, -zoom];\n" +
        "} else {\n" +
        "  C = cam.toWorld([0,0,0]);\n" +
        "}\n";

    function buildPosExpr(P0) {
        // Giữ nguyên X, Y gốc; chỉ trục Z chạy theo slider "Z Space".
        return "" +
            "var s = effect(\"" + CTRL_NAME + "\")(\"Slider\");\n" +
            "[" + num(P0[0]) + ", " + num(P0[1]) + ", s];";
    }

    function buildScaleExpr(P0, S0) {
        return "" +
            "var s = effect(\"" + CTRL_NAME + "\")(\"Slider\");\n" +
            "var Z0 = " + num(P0[2]) + ";\n" +
            "var S0 = [" + num(S0[0]) + ", " + num(S0[1]) + ", " + num(S0[2]) + "];\n" +
            CAM_SNIPPET +
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

                // gắn expression
                posProp.expression = buildPosExpr(P0);
                sclProp.expression = buildScaleExpr(P0, S0);

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
            "Lock: gắn expression + slider 'Z Space'.\nKéo slider để đổi độ sâu Z (giữ nguyên góc nhìn camera).\nRelease: bake giá trị & gỡ expression.",
            { multiline: true });
        info.preferredSize.height = 56;

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