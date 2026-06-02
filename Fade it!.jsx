(function (thisObj) {
    // --- CẤU HÌNH ---
    var CONFIG = {
        defaultFrames: 10,
        isLinked: false // Mặc định là Unlinked (≠)
    };

    // --- LOGIC XỬ LÝ FADE ---
    function applyFade(isFadeIn, frameCount) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) return alert("Chọn Comp trước!");
        var layers = comp.selectedLayers;
        if (layers.length === 0) return alert("Chọn ít nhất 1 Layer!");

        var duration = frameCount / comp.frameRate;

        app.beginUndoGroup(isFadeIn ? "Fade In" : "Fade Out");
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var opacity = layer.transform.opacity;
            if (isFadeIn) {
                opacity.setValueAtTime(layer.inPoint, 0);
                opacity.setValueAtTime(layer.inPoint + duration, 100);
            } else {
                opacity.setValueAtTime(layer.outPoint - duration, 100);
                opacity.setValueAtTime(layer.outPoint, 0);
            }
            // Tạo Easy Ease (33% influence)
            for (var j = 1; j <= opacity.numKeys; j++) {
                opacity.setTemporalEaseAtKey(j, [new KeyframeEase(0, 33)], [new KeyframeEase(0, 33)]);
            }
        }
        app.endUndoGroup();
    }

    // --- KHỞI TẠO GIAO DIỆN (UI) ---
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Fade It Pro", undefined);
    win.orientation = "column";
    win.alignChildren = "fill";
    win.spacing = 10;
    win.margins = 15;

    // 1. Panel bao quanh (Fade It!)
    var mainPanel = win.add("panel", undefined, "Fade It!");
    mainPanel.orientation = "column";
    mainPanel.spacing = 15;
    mainPanel.margins = 15;

    // 2. Dòng nhập số Frame (In [10] Frames [10] Out)
    var inputRow = mainPanel.add("group");
    inputRow.alignment = "center";

    inputRow.add("statictext", undefined, "In");
    var inInput = inputRow.add("edittext", undefined, String(CONFIG.defaultFrames));
    inInput.preferredSize.width = 40;

    inputRow.add("statictext", undefined, "Frames");

    var outInput = inputRow.add("edittext", undefined, String(CONFIG.defaultFrames));
    outInput.preferredSize.width = 40;
    inputRow.add("statictext", undefined, "Out");

    // 3. Dòng nút bấm (Fade In | ≠ | Fade Out)
    var btnRow = mainPanel.add("group");
    btnRow.alignment = "center";

    var btnIn = btnRow.add("button", undefined, "Fade In");
    btnIn.preferredSize = [80, 25];

    var linkBtn = btnRow.add("button", undefined, "≠"); // Nút Link/Unlink
    linkBtn.preferredSize = [30, 25];

    var btnOut = btnRow.add("button", undefined, "Fade Out");
    btnOut.preferredSize = [80, 25];

    // --- LOGIC TƯƠNG TÁC (EVENTS) ---

    // Xử lý nút Link/Unlink
    linkBtn.onClick = function () {
        CONFIG.isLinked = !CONFIG.isLinked;
        this.text = CONFIG.isLinked ? "=" : "≠";
        if (CONFIG.isLinked) {
            outInput.text = inInput.text; // Đồng bộ ngay lập tức
        }
    };

    // Đồng bộ khi gõ phím nếu đang bật Link
    inInput.onChanging = function () {
        if (CONFIG.isLinked) outInput.text = this.text;
    };
    outInput.onChanging = function () {
        if (CONFIG.isLinked) inInput.text = this.text;
    };

    // Xử lý nút Apply
    btnIn.onClick = function () {
        var frames = parseInt(inInput.text);
        if (isNaN(frames) || frames <= 0) return alert("Nhập số frame hợp lệ!");
        applyFade(true, frames);
    };

    btnOut.onClick = function () {
        var frames = parseInt(outInput.text);
        if (isNaN(frames) || frames <= 0) return alert("Nhập số frame hợp lệ!");
        applyFade(false, frames);
    };

    // Hiển thị Window
    if (win instanceof Window) {
        win.center();
        win.show();
    } else {
        win.layout.layout(true);
    }
})(this);
