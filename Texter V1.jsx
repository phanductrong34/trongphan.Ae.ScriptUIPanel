(function(thisObj) {
    // TẠO GIAO DIỆN (UI)
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Texter", undefined, {resizeable: true});
    win.alignChildren = ["center", "top"]; // CĂN GIỮA TOÀN BỘ CÁC PHẦN TỬ CON
    win.spacing = 15;
    win.margins = 20;

    // --- HÀM TẠO NHÓM SLIDER + INPUT + CHECKBOX (CĂN GIỮA) ---
    function createControlGroup(parent, labelText, defaultVal, hasCheckbox, unitText) {
        var grp = parent.add("group");
        grp.orientation = "column";
        grp.alignChildren = ["center", "center"]; // CĂN GIỮA CÁC ĐIỀU KHIỂN TRONG NHÓM
        grp.spacing = 5;

        var label = grp.add("statictext", undefined, labelText);
        label.graphics.font = ScriptUI.newFont("Arial", "BOLD", 12);
        label.alignment = "center";

        var controlRow = grp.add("group");
        controlRow.orientation = "row";
        controlRow.alignChildren = ["center", "center"];
        controlRow.alignment = "center";

        var slider = controlRow.add("slider", undefined, defaultVal, 0, 500);
        slider.preferredSize.width = 120;

        var input = controlRow.add("edittext", undefined, defaultVal);
        input.preferredSize.width = 40;

        var checkbox = null;
        if (hasCheckbox) {
            checkbox = controlRow.add("checkbox", undefined, "");
            checkbox.value = true;
            checkbox.alignment = "center";
        } else if (unitText) {
            controlRow.add("statictext", undefined, unitText);
        }

        // Liên kết Slider và Input
        slider.onChanging = slider.onChange = function() {
            input.text = Math.round(this.value);
        };
        input.onChange = function() {
            var val = parseFloat(this.text);
            if (isNaN(val)) val = defaultVal;
            slider.value = val;
            this.text = val;
        };

        return { slider: slider, input: input, checkbox: checkbox };
    }

    // 1. Controls (Các nhóm đều đã được căn giữa)
    var offsetGroup = createControlGroup(win, "Offset ban đầu", 100, false, "px");
    var blurGroup = createControlGroup(win, "Blur", 10, true, null);
    var fadeGroup = createControlGroup(win, "Fade in", 10, true, null);
    var staggerGroup = createControlGroup(win, "Stagger layer", 3, false, null);

    // Thêm một spacer để tạo khoảng cách
    win.add("group").preferredSize.height = 10;

    // 2. Button Groups (CĂN GIỮA NHÓM NÚT BẤM)
    var btnGroup = win.add("group");
    btnGroup.orientation = "column";
    btnGroup.alignChildren = ["center", "top"];
    btnGroup.spacing = 5;

    var arrowRow = btnGroup.add("group");
    arrowRow.orientation = "row";
    arrowRow.spacing = 5;
    arrowRow.alignment = "center";
    var btnUp = arrowRow.add("button", [0, 0, 40, 40], "↑");
    var btnDown = arrowRow.add("button", [0, 0, 40, 40], "↓");
    var btnRight = arrowRow.add("button", [0, 0, 40, 40], "→");
    var btnLeft = arrowRow.add("button", [0, 0, 40, 40], "←");

    var scaleRow = btnGroup.add("group");
    scaleRow.orientation = "row";
    scaleRow.spacing = 5;
    scaleRow.alignment = "center";
    var btnTo = scaleRow.add("button", [0, 0, 85, 35], "To");
    var btnNho = scaleRow.add("button", [0, 0, 85, 35], "Nhỏ");

    // Thêm spacer để đẩy bottom bar xuống dưới cùng
    win.add("group").preferredSize.height = 50; 

    // 3. Bottom Bar (Căn giữa theo chiều dọc, trải đều chiều ngang)
    var bottomBar = win.add("group");
    bottomBar.orientation = "row";
    bottomBar.alignChildren = ["center", "center"];
    bottomBar.alignment = ["fill", "bottom"];
    bottomBar.spacing = 20;

    var statusText = bottomBar.add("statictext", undefined, "0 layers selected");
    statusText.alignment = ["left", "center"];
    var authorText = bottomBar.add("statictext", undefined, "A Plugin by Trong");
    authorText.alignment = ["right", "center"];

    // Cập nhật số layer được chọn khi di chuột qua Panel
    win.addEventListener("mouseover", function() {
        var comp = app.project.activeItem;
        var count = (comp && comp instanceof CompItem) ? comp.selectedLayers.length : 0;
        statusText.text = count + " layers selected";
    });

    // --- HÀM TẠO EASING (10% OUT, 90% IN) ---
    function applyEasePointToPoint(prop, k1, k2) {
        var easeOut = new KeyframeEase(0, 10); // Tốc độ 0, Influence 10%
        var easeIn = new KeyframeEase(0, 90);  // Tốc độ 0, Influence 90%
        
        var easeInArr = [];
        var easeOutArr = [];
        
        var propType = prop.propertyValueType;
        var dims = 1; // Mặc định 1 chiều cho Opacity, Blur, và cả Position (Spatial)
        
        // RIÊNG thuộc tính Scale (TwoD / ThreeD) thì số chiều phải theo layer
        if (propType === PropertyValueType.TwoD) dims = 2;
        if (propType === PropertyValueType.ThreeD) dims = 3;
        
        for (var i = 0; i < dims; i++) {
            easeInArr.push(easeIn);
            easeOutArr.push(easeOut);
        }
        
        // BẮT BUỘC phải truyền vào đủ 2 tham số mảng (In, Out) để AE không bị ngắt script
        prop.setTemporalEaseAtKey(k1, easeOutArr, easeOutArr); // Key đầu: Ease Out 10%
        prop.setTemporalEaseAtKey(k2, easeInArr, easeInArr);   // Key sau: Ease In 90%
    }

    // --- HÀM CHÍNH: TẠO TRANSITION ---
    function applyTransition(type) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Vui lòng chọn một Composition!");
            return;
        }
        
        var layers = comp.selectedLayers;
        if (layers.length === 0) {
            alert("Vui lòng chọn ít nhất 1 layer!");
            return;
        }

        app.beginUndoGroup("Texter: Transition " + type);

        var offsetVal = parseFloat(offsetGroup.input.text);
        var blurStartVal = parseFloat(blurGroup.input.text);
        var fadeFrames = parseFloat(fadeGroup.input.text);
        var staggerFrames = parseFloat(staggerGroup.input.text);
        var frameDur = comp.frameDuration;

        var shouldBlur = blurGroup.checkbox.value;
        var shouldFade = fadeGroup.checkbox.value;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            
            // Xử lý Stagger
            if (staggerFrames > 0 && i > 0) {
                layer.startTime = layer.startTime + (i * staggerFrames * frameDur);
            }

            var t1 = layer.inPoint;
            var t2 = t1 + (10 * frameDur);

            // ==========================================
            // 1. ADD KEYFRAME POSITION / SCALE + EASING
            // ==========================================
            var prop, valStart, valEnd;
            if (type === "up" || type === "down" || type === "left" || type === "right") {
                prop = layer.property("ADBE Transform Group").property("ADBE Position");
                if (prop) {
                    valEnd = prop.valueAtTime(t1, false);
                    // SỬA LỖI Ở ĐÂY: Phân biệt mảng 2D và 3D
                    var is3D = valEnd.length > 2;
                    valStart = is3D ? [valEnd[0], valEnd[1], valEnd[2]] : [valEnd[0], valEnd[1]];

                    if (type === "up") valStart[1] += offsetVal;
                    if (type === "down") valStart[1] -= offsetVal;
                    if (type === "right") valStart[0] -= offsetVal;
                    if (type === "left") valStart[0] += offsetVal;
                }
            } else if (type === "to" || type === "nho") {
                prop = layer.property("ADBE Transform Group").property("ADBE Scale");
                if (prop) {
                    valEnd = prop.valueAtTime(t1, false);
                    var is3DScale = valEnd.length > 2;
                    if (type === "to") {
                        valStart = is3DScale ? [0, 0, 0] : [0, 0];
                    } else {
                        valStart = is3DScale ? [valEnd[0] * 1.5, valEnd[1] * 1.5, valEnd[2] * 1.5] : [valEnd[0] * 1.5, valEnd[1] * 1.5];
                    }
                }
            }

            if (prop) {
                var k1 = prop.addKey(t1);
                var k2 = prop.addKey(t2);
                prop.setValueAtKey(k1, valStart);
                prop.setValueAtKey(k2, valEnd);
                applyEasePointToPoint(prop, k1, k2); // Easing 10-90
            }

            // ==========================================
            // 2. ADD KEYFRAME BLUR + EASING (Nếu check)
            // ==========================================
            if (shouldBlur) {
                var effects = layer.property("ADBE Effect Parade");
                var blurFx = effects.property("ADBE Fast Box Blur") || effects.property("ADBE Fast Blur");
                
                if (!blurFx) {
                    // Ưu tiên Fast Box Blur cho các bản AE mới
                    try {
                        blurFx = effects.addProperty("ADBE Fast Box Blur");
                    } catch(e) {
                        blurFx = effects.addProperty("ADBE Fast Blur");
                    }
                }
                
                var blurProp = blurFx.property(1); // Radius
                if (blurProp) {
                    while (blurProp.numKeys > 0) blurProp.removeKey(1);
                    var bk1 = blurProp.addKey(t1);
                    var bk2 = blurProp.addKey(t2);
                    blurProp.setValueAtKey(bk1, blurStartVal);
                    blurProp.setValueAtKey(bk2, 0);
                    applyEasePointToPoint(blurProp, bk1, bk2); // Easing 10-90
                }
            } else {
                var existingBlur = layer.property("ADBE Effect Parade").property("ADBE Fast Box Blur") || 
                                   layer.property("ADBE Effect Parade").property("ADBE Fast Blur");
                if (existingBlur) existingBlur.property(1).setValue(0);
            }

            // ==========================================
            // 3. ADD KEYFRAME OPACITY + EASING (Nếu check)
            // ==========================================
            if (shouldFade) {
                var opacProp = layer.property("ADBE Transform Group").property("ADBE Opacity");
                if (opacProp) {
                    var fadeEnd = t1 + (fadeFrames * frameDur);
                    while (opacProp.numKeys > 0) opacProp.removeKey(1);
                    var ok1 = opacProp.addKey(t1);
                    var ok2 = opacProp.addKey(fadeEnd);
                    opacProp.setValueAtKey(ok1, 0);
                    opacProp.setValueAtKey(ok2, 100);
                    applyEasePointToPoint(opacProp, ok1, ok2); // Easing 10-90
                }
            } else {
                var existingOpac = layer.property("ADBE Transform Group").property("ADBE Opacity");
                if (existingOpac) existingOpac.setValue(100);
            }
        }
        
        statusText.text = layers.length + " layers selected";
        app.endUndoGroup();
    }

    // --- GÁN SỰ KIỆN CHO NÚT BẤM ---
    btnUp.onClick = function() { applyTransition("up"); };
    btnDown.onClick = function() { applyTransition("down"); };
    btnRight.onClick = function() { applyTransition("right"); };
    btnLeft.onClick = function() { applyTransition("left"); };
    btnTo.onClick = function() { applyTransition("to"); };
    btnNho.onClick = function() { applyTransition("nho"); };

    // Hiển thị UI
    if (win instanceof Window) {
        win.center();
        win.show();
    } else {
        win.layout.layout(true);
        win.layout.resize();
    }
})(this);