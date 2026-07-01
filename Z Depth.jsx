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
            alert("Please open a composition.");
            return;
        }
        var sel = comp.selectedLayers;
        if (sel.length === 0) {
            alert("Please select at least one layer.");
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
            statusText.text = "Locked: " + done + (skipped ? ("  •  skipped: " + skipped) : "");
        } catch (e) {
            alert("Lock error: " + e.toString());
        } finally {
            app.endUndoGroup();
        }
    }

    // ---- RELEASE -----------------------------------------------------

    function doRelease() {
        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please open a composition.");
            return;
        }
        var sel = comp.selectedLayers;
        if (sel.length === 0) {
            alert("Please select at least one layer.");
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
            statusText.text = "Released: " + done + (skipped ? ("  •  skipped: " + skipped) : "");
        } catch (e) {
            alert("Release error: " + e.toString());
        } finally {
            app.endUndoGroup();
        }
    }

    // ---- chọn camera -------------------------------------------------

    var camNameText;

    function doSetCamera() {
        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) { alert("Please open a composition."); return; }
        var sel = comp.selectedLayers;
        var cam = null;
        for (var i = 0; i < sel.length; i++) {
            if (sel[i] instanceof CameraLayer) { cam = sel[i]; break; }
        }
        if (!cam) { alert("Please select a Camera layer first."); return; }
        selectedCamName = cam.name;
        if (camNameText) camNameText.text = "Camera: " + selectedCamName;
        if (statusText) statusText.text = "Camera set: " + selectedCamName;
    }

    function doClearCamera() {
        selectedCamName = "";
        if (camNameText) camNameText.text = "Camera: (auto / active)";
        if (statusText) statusText.text = "Camera cleared (using active camera).";
    }

    // ---- shared helpers (links / popup / footer) ---------------------

    var INSTAGRAM_URL = "https://www.instagram.com/trongph.animation/";
    var EMAIL_ADDR    = "trong.phanduc34@gmail.com";
    var VERSION       = "1.0";   // bump on every update (see CLAUDE.md rule)

    function openURL(url) {
        try {
            if ($.os.indexOf("Windows") !== -1) {
                system.callSystem('cmd.exe /c start "" "' + url + '"');
            } else {
                system.callSystem('open "' + url + '"');
            }
        } catch (e) { alert(url); }
    }

    // Style a statictext to look/behave like a hyperlink.
    function makeLink(st, url) {
        try {
            var g = st.graphics;
            g.foregroundColor = g.newPen(g.PenType.SOLID_COLOR, [0.35, 0.65, 1], 1);
        } catch (e) {}
        st.helpTip = url;
        st.addEventListener("click", function () { openURL(url); });
        return st;
    }

    // Emoji built from char codes -> only ASCII in source, so it renders
    // correctly regardless of how ExtendScript decodes this file.
    function u2(a, b) { return String.fromCharCode(a, b); }
    var EMO = {
        micro: u2(0xD83D, 0xDD2C),                                 // microscope
        gear:  String.fromCharCode(0x2699, 0xFE0F),                // gear
        tube:  u2(0xD83E, 0xDDEA),                                 // test tube
        dna:   u2(0xD83E, 0xDDEC),                                 // dna
        sat:   u2(0xD83D, 0xDEF0) + String.fromCharCode(0xFE0F),   // satellite
        mail:  u2(0xD83D, 0xDCE7),                                 // e-mail
        cam:   u2(0xD83D, 0xDCF7)                                  // camera
    };
    var DASH = String.fromCharCode(0x2014); // em dash

    // Instruction pop-up (modal). Bullets + science emoji + contact links.
    function showHelp() {
        var w = new Window("dialog", "Z Depth " + DASH + " Help");
        w.orientation = "column";
        w.alignChildren = ["fill", "top"];
        w.spacing = 10;
        w.margins = 16;

        var head = w.add("statictext", undefined, "Z DEPTH " + DASH + " How it works");
        try { head.graphics.font = ScriptUI.newFont(head.graphics.font.name, "BOLD", 14); } catch (e) {}

        var ver = w.add("statictext", undefined, "Version " + VERSION);
        try { ver.graphics.foregroundColor = ver.graphics.newPen(ver.graphics.PenType.SOLID_COLOR, [0.6, 0.6, 0.6], 1); } catch (e) {}

        var body = w.add("statictext", undefined,
            EMO.micro + "  Set Camera: select a Camera layer, then click \"Set Camera\".\n" +
            "      If the camera is parented to a Null, its world transform is\n" +
            "      included automatically.\n\n" +
            EMO.gear + "  Lock: select your layer(s), then click LOCK. This turns\n" +
            "      on 3D, adds a \"Z Space\" slider, links Position & Scale to it.\n\n" +
            EMO.tube + "  Z Space slider: drag it to change the layer's Z depth. X, Y\n" +
            "      and Scale are auto-compensated along the camera-to-layer ray,\n" +
            "      so the layer keeps the same on-screen position and size.\n\n" +
            EMO.dna + "  Release: bakes the current Position & Scale, then removes\n" +
            "      the expressions and the slider.\n\n" +
            EMO.sat + "  Tip: re-Lock any layer that was locked with an older\n" +
            "      version to refresh its expressions.",
            { multiline: true });
        body.preferredSize.width = 460;

        var contactHead = w.add("statictext", undefined, "Need help or found a bug? Get in touch:");
        try { contactHead.graphics.font = ScriptUI.newFont(contactHead.graphics.font.name, "BOLD", 12); } catch (e) {}

        var rowMail = w.add("group"); rowMail.orientation = "row"; rowMail.alignment = ["left", "top"]; rowMail.spacing = 6;
        rowMail.add("statictext", undefined, EMO.mail);
        makeLink(rowMail.add("statictext", undefined, EMAIL_ADDR), "mailto:" + EMAIL_ADDR);

        var rowIg = w.add("group"); rowIg.orientation = "row"; rowIg.alignment = ["left", "top"]; rowIg.spacing = 6;
        rowIg.add("statictext", undefined, EMO.cam);
        makeLink(rowIg.add("statictext", undefined, "Instagram: @trongph.animation"), INSTAGRAM_URL);

        var btns = w.add("group"); btns.orientation = "row"; btns.alignment = ["right", "top"];
        var ok = btns.add("button", undefined, "Close", { name: "ok" });
        ok.onClick = function () { w.close(); };

        w.center();
        w.show();
    }

    // Standard footer: sticky at the bottom, full width, space-between.
    // Left = plain credit text (NO hyperlink). Right = square "?" help button.
    // NOTE: reuse this footer on every Trong plugin (see project rule).
    function addFooter(pal) {
        var foot = pal.add("group");
        foot.orientation = "row";
        foot.alignment = ["fill", "bottom"];
        foot.alignChildren = ["left", "center"];
        foot.spacing = 0;

        foot.add("statictext", undefined, "A plugin by Trong");   // plain, no link

        var spacer = foot.add("group");       // stretches to push the two ends apart
        spacer.alignment = ["fill", "center"];

        var help = foot.add("button", undefined, "?");
        help.preferredSize = [24, 24];        // square
        help.helpTip = "How it works / contact";
        help.onClick = showHelp;

        return foot;
    }

    // ---- UI ----------------------------------------------------------

    var statusText;

    function buildUI(thisObj) {
        var pal = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "Z Depth Lock", undefined, { resizeable: true });

        pal.orientation = "column";
        pal.alignChildren = ["fill", "fill"];
        pal.spacing = 8;
        pal.margins = 12;

        // --- centered content (stays centered at any panel width) ---
        var content = pal.add("group");
        content.orientation = "column";
        content.alignment = ["center", "top"];
        content.alignChildren = ["center", "top"];
        content.spacing = 8;

        var title = content.add("statictext", undefined, "Z DEPTH LOCK");
        try { title.graphics.font = ScriptUI.newFont(title.graphics.font.name, "BOLD", 14); } catch (e) {}

        var camGroup = content.add("group");
        camGroup.orientation = "row";
        camGroup.alignChildren = ["center", "center"];
        camGroup.spacing = 4;
        var btnSetCam = camGroup.add("button", undefined, "Set Camera");
        btnSetCam.preferredSize.width = 110;
        btnSetCam.onClick = doSetCamera;
        var btnClearCam = camGroup.add("button", undefined, String.fromCharCode(0x2715));
        btnClearCam.preferredSize = [28, 24];
        btnClearCam.helpTip = "Clear camera (use active camera)";
        btnClearCam.onClick = doClearCamera;

        camNameText = content.add("statictext", undefined, "Camera: (auto / active)");
        camNameText.characters = 28;
        camNameText.justify = "center";

        var btnLock = content.add("button", undefined, "LOCK");
        btnLock.preferredSize.width = 142;
        btnLock.onClick = doLock;

        var btnRelease = content.add("button", undefined, "RELEASE");
        btnRelease.preferredSize.width = 142;
        btnRelease.onClick = doRelease;

        statusText = content.add("statictext", undefined, "Select layer(s), then click LOCK.");
        statusText.characters = 32;
        statusText.justify = "center";

        // --- vertical spacer pushes the footer to the bottom (sticky) ---
        var vspacer = pal.add("group");
        vspacer.alignment = ["fill", "fill"];

        addFooter(pal);

        // Keep centering + sticky footer correct while the panel is resized.
        var relayout = function () { try { this.layout.resize(); } catch (e) {} };
        pal.onResizing = pal.onResize = relayout;

        pal.layout.layout(true);
        pal.layout.resize();
        return pal;
    }

    var myPanel = buildUI(thisObj);
    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    }

})(this);