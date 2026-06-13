// ==========================================
// BLOOBY TOOL - Advanced Gooey / Blob Generator
// ==========================================

(function(thisObj) {
    // --- CÁC HẰNG SỐ CẦN THIẾT ---
    var ValTypeCustom = PropertyValueType.CUSTOM_VALUE;
    var ValTypeNone = PropertyValueType.NO_VALUE;
    var ValType3DS = PropertyValueType.ThreeD_SPATIAL;
    var ValType2DS = PropertyValueType.TwoD_SPATIAL;

    // --- 1. TẠO GIAO DIỆN (UI PANEL) ---
    var globalListPanel; // Lưu biến global để dễ reload
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Blooby Tool", undefined, {resizeable: true});
        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 8;
        win.margins = 12;

        // Group chính
        var topGroup = win.add("group");
        topGroup.orientation = "column";
        topGroup.alignChildren = ["center", "top"];
        
        var btnGroup = topGroup.add("group");
        btnGroup.orientation = "row";

        var btn = btnGroup.add("button", undefined, "Blooby!");
        btn.size = [140, 35];

        var toggleOffsetBtn = btnGroup.add("button", undefined, "Toggle Offset Path");
        toggleOffsetBtn.size = [140, 35];

        var clearOriginalCb = topGroup.add("checkbox", undefined, "Clear Original Shape");
        clearOriginalCb.value = false; 

        var sep = win.add("panel");
        sep.minimumSize.height = 2;

        // Group Quản lý Danh sách
        var listHeader = win.add("group");
        listHeader.orientation = "row";
        listHeader.alignment = ["fill", "center"]; // Giữ form giãn hết chiều ngang
        listHeader.alignChildren = ["left", "center"];
        
        var listTitle = listHeader.add("statictext", undefined, "Blooby Contents:");
        listTitle.preferredSize.width = 100;

        var reloadBtn = listHeader.add("button", undefined, "↻");
        reloadBtn.size = [25, 25];
        reloadBtn.helpTip = "Chọn layer BLOOBY và nhấn để Load danh sách";

        var clearListBtn = listHeader.add("button", undefined, "x");
        clearListBtn.size = [25, 25];
        clearListBtn.helpTip = "Xoá hiển thị danh sách trong UI này";

        var addBtn = listHeader.add("button", undefined, "+");
        addBtn.size = [25, 25];
        addBtn.helpTip = "Chọn các Shape cần thêm và layer BLOOBY, sau đó nhấn +";

        // Panel chứa danh sách các layer (Scrollable)
        globalListPanel = win.add("panel", undefined, "");
        globalListPanel.orientation = "column";
        globalListPanel.alignment = ["fill", "top"]; // Bắt buộc panel fill full width
        globalListPanel.alignChildren = ["fill", "top"];
        globalListPanel.maximumSize.height = 150;
        globalListPanel.margins = 5;

        // Events
        btn.onClick = function() { createBlooby(clearOriginalCb.value); };
        toggleOffsetBtn.onClick = function() { toggleOffsetPath(); };
        reloadBtn.onClick = function() { reloadList(globalListPanel); };
        addBtn.onClick = function() { addToBlooby(clearOriginalCb.value); };
        clearListBtn.onClick = function() { 
            while (globalListPanel.children.length > 0) {
                globalListPanel.remove(globalListPanel.children[0]);
            }
            globalListPanel.parent.layout.layout(true);
        };

        win.onResizing = win.onResize = function() { this.layout.resize(); };

        if (win instanceof Window) {
            win.center();
            win.show();
        } else {
            win.layout.layout(true);
        }
    }

    // --- 2. HÀM XỬ LÝ CHÍNH (CORE LOGIC) ---
    function toggleOffsetPath() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) return;
        
        var selLayers = comp.selectedLayers;
        var bloobyLayer = null;
        for (var i = 0; i < selLayers.length; i++) {
            if (selLayers[i].name === "BLOOBY" || (selLayers[i].property("ADBE Effect Parade") && selLayers[i].property("ADBE Effect Parade").property("Blob Amount"))) {
                bloobyLayer = selLayers[i];
                break;
            }
        }
        
        if (!bloobyLayer) {
            alert("Vui lòng chọn layer BLOOBY để thêm/bớt Offset Path!");
            return;
        }

        app.beginUndoGroup("Toggle Offset Path");
        
        var contents = bloobyLayer.property("ADBE Root Vectors Group");
        var effects = bloobyLayer.property("ADBE Effect Parade");
        
        var existingOffset = contents.property("Offset Blooby");
        var existingSlider = effects.property("Offset Amount");
        
        if (existingOffset) {
            // Nếu đã có thì Xoá
            existingOffset.remove();
            if (existingSlider) existingSlider.remove();
        } else {
            // Nếu chưa có thì Thêm vào
            if (!existingSlider) {
                existingSlider = effects.addProperty("ADBE Slider Control");
                existingSlider.name = "Offset Amount";
                existingSlider.property(1).setValue(50); // Đã đổi mặc định thành 50
            }
            
            var newOffset = contents.addProperty("ADBE Vector Filter - Offset");
            newOffset.name = "Offset Blooby";
            newOffset.property("ADBE Vector Offset Line Join").setValue(2); // Round Join
            newOffset.property("ADBE Vector Offset Amount").expression = "effect('Offset Amount')('Slider');";
            
            // Di chuyển Offset Path mới này xuống dưới cùng danh sách shape
            newOffset.moveTo(contents.numProperties);
        }
        
        app.endUndoGroup();
    }

    function createBlooby(clearOriginal) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Hãy mở một Composition trước nhé!");
            return;
        }

        var selLayers = comp.selectedLayers;
        var shapeLayers = [];

        // Lọc lấy danh sách các Shape Layer được chọn
        for (var i = 0; i < selLayers.length; i++) {
            if (selLayers[i] instanceof ShapeLayer) {
                shapeLayers.push(selLayers[i]);
            }
        }

        if (shapeLayers.length < 1) {
            alert("Vui lòng chọn ít nhất 1 Shape Layer để tạo Blooby!");
            return;
        }

        app.beginUndoGroup("Blooby Generator");

       
// TẠO LAYER "BLOOBY"
        var bloobyLayer = comp.layers.addShape();
        bloobyLayer.name = "BLOOBY";
        bloobyLayer.moveBefore(shapeLayers[0]); // Đặt lên trên cùng

        // --- TÍNH TÂM TRUNG BÌNH CỦA TẤT CẢ CÁC SHAPE ĐÃ CHỌN ---
        var avgX = 0;
        var avgY = 0;
        for (var i = 0; i < shapeLayers.length; i++) {
            var s = shapeLayers[i];
            var ap = s.property("ADBE Transform Group").property("ADBE Anchor Point").valueAtTime(comp.time, false);
            
            // Dùng "Temp Null" để dịch toạ độ an toàn (tránh lỗi crash expression)
            var tNull = comp.layers.addNull();
            tNull.parent = s;
            tNull.property("ADBE Transform Group").property("ADBE Position").setValue(ap);
            tNull.parent = null; 
            var worldPos = tNull.property("ADBE Transform Group").property("ADBE Position").value;
            tNull.remove();
            
            avgX += worldPos[0];
            avgY += worldPos[1];
        }
        avgX /= shapeLayers.length;
        avgY /= shapeLayers.length;

        // Cập nhật Anchor Point của BLOOBY (nằm ở toạ độ trung tâm)
        bloobyLayer.property("ADBE Transform Group").property("ADBE Position").setValue([avgX, avgY]);
        bloobyLayer.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([avgX, avgY]);

        var bloobyContents = bloobyLayer.property("ADBE Root Vectors Group");

        // THÊM SLIDER CONTROL "Blob Amount"
        var sliderFx = bloobyLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        sliderFx.name = "Blob Amount";
        sliderFx.property(1).setValue(50); // Mặc định là 50

        var lastMovedLayer = bloobyLayer;
        var layersToRemove = [];

        // XỬ LÝ TỪNG SHAPE LAYER
        for (var i = 0; i < shapeLayers.length; i++) {
            var src = shapeLayers[i];

            // 1. TÍNH TOÁN TÂM CỦA NỘI DUNG SHAPE
            var srcRect = src.sourceRectAtTime(comp.time, false);
            var cx = srcRect.left + srcRect.width / 2;
            var cy = srcRect.top + srcRect.height / 2;
            
            // Lấy World Position tâm Shape
            var tNull = comp.layers.addNull();
            tNull.parent = src;
            tNull.property("ADBE Transform Group").property("ADBE Position").setValue([cx, cy]);
            tNull.parent = null; 
            var worldCenter = tNull.property("ADBE Transform Group").property("ADBE Position").value;
            tNull.remove();

            // 2. TẠO NULL VÀ SETUP TRANSFORM
            var nullLayer = comp.layers.addNull();
            nullLayer.name = "Null - " + src.name; 
            
            // Di chuyển Null xuống ngay dưới layer được tạo ra gần nhất
            nullLayer.moveAfter(lastMovedLayer);
            lastMovedLayer = nullLayer;

            var nullTransform = nullLayer.property("ADBE Transform Group");
            var srcTransform = src.property("ADBE Transform Group");

            // Đặt AP của Null ở chính giữa (50, 50)
            nullTransform.property("ADBE Anchor Point").setValue([50, 50]);

            // Parent Null vào BLOOBY
            nullLayer.parent = bloobyLayer;

            // Gán Pos của Null bằng World Center của nội dung (Hệ trục của Blooby đã được đồng nhất)
            nullTransform.property("ADBE Position").setValue(worldCenter);

            // Copy Scale và Rotation từ gốc sang Null
            nullTransform.property("ADBE Scale").setValue(srcTransform.property("ADBE Scale").valueAtTime(comp.time, false));
            nullTransform.property("ADBE Rotate Z").setValue(srcTransform.property("ADBE Rotate Z").valueAtTime(comp.time, false));

            // 3. TẠO CLONE SHAPE BÊN TRONG BLOOBY
            var cloneGroup = bloobyContents.addProperty("ADBE Vector Group");
            cloneGroup.name = src.name; // Tên gốc, không có hậu tố

            duplicateShapeContents(src, cloneGroup);

            // 4. RIG CLONE VÀO NULL BẰNG WORLD COORDINATES
            var cloneTransform = cloneGroup.property("ADBE Vector Transform Group");
            var safeNullName = nullLayer.name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
            
            cloneTransform.property("ADBE Vector Anchor").setValue([cx, cy]);
            cloneTransform.property("ADBE Vector Position").expression = "L = thisComp.layer('" + safeNullName + "'); L.toComp(L.transform.anchorPoint);";
            cloneTransform.property("ADBE Vector Rotation").expression = "L = thisComp.layer('" + safeNullName + "'); u = L.toWorldVec([1,0]); Math.atan2(u[1],u[0]) * 180 / Math.PI;";
            cloneTransform.property("ADBE Vector Scale").expression = "L = thisComp.layer('" + safeNullName + "'); u = L.toWorldVec([1,0]); v = L.toWorldVec([0,1]); [length(u), length(v)] * 100;";

            // 5. XỬ LÝ LAYER GỐC
            if (clearOriginal) {
                layersToRemove.push(src); 
            } else {
                src.enabled = true; // Đảm bảo layer luôn được bật hiển thị
                src.moveBefore(bloobyLayer); // Di chuyển lên ngay trên BLOOBY
                
                // Mẹo an toàn: tắt chức năng tách trục Pos trước khi Parent để tránh lỗi AE
                var isPosSeparated = srcTransform.property("ADBE Position").dimensionsSeparated;
                if (isPosSeparated) srcTransform.property("ADBE Position").dimensionsSeparated = false; 
                
                // Parent Shape gốc vào Null tương ứng (AE tự động giữ nguyên vị trí trực quan)
                src.parent = nullLayer; 
                
                if (isPosSeparated) srcTransform.property("ADBE Position").dimensionsSeparated = true; // Trả lại như cũ
            }
        }

        // TẠO HIỆU ỨNG BLOOBY VÀ ĐỔI TÊN THÀNH FX 1, 2, 3
        var mergePaths = bloobyContents.addProperty("ADBE Vector Filter - Merge");
        mergePaths.name = "FX 1";
        mergePaths.property("ADBE Vector Merge Type").setValue(1);

        var offset1 = bloobyContents.addProperty("ADBE Vector Filter - Offset");
        offset1.name = "FX 2";
        offset1.property("ADBE Vector Offset Amount").expression = "effect('Blob Amount')('Slider');";
        offset1.property("ADBE Vector Offset Line Join").setValue(2); 

        var offset2 = bloobyContents.addProperty("ADBE Vector Filter - Offset");
        offset2.name = "FX 3";
        offset2.property("ADBE Vector Offset Amount").expression = "effect('Blob Amount')('Slider') * -1;";
        offset2.property("ADBE Vector Offset Line Join").setValue(2); 

        var fill = bloobyContents.addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([1, 1, 1, 1]);

        // XÓA LAYERS GỐC NẾU CHỌN CLEAR
        for (var i = 0; i < layersToRemove.length; i++) {
            layersToRemove[i].remove();
        }

        for (var l = 1; l <= comp.numLayers; l++) comp.layer(l).selected = false;
        bloobyLayer.selected = true;

        app.endUndoGroup();
    }
// --- CÁC HÀM QUẢN LÝ DANH SÁCH (RELOAD, ADD, REMOVE) ---
    function reloadList(listPanel) {
        var comp = app.project.activeItem;
        if (!comp) return;
        var selLayers = comp.selectedLayers;
        if (selLayers.length !== 1 || !selLayers[0].property("ADBE Effect Parade").property("Blob Amount")) {
            alert("Vui lòng chọn duy nhất 1 layer BLOOBY để tải danh sách!");
            return;
        }

        var bloobyLayer = selLayers[0];
        var contents = bloobyLayer.property("ADBE Root Vectors Group");

        // Xóa sạch UI cũ
        while (listPanel.children.length > 0) {
            listPanel.remove(listPanel.children[0]);
        }

        var indexCount = 1;
        for (var i = 1; i <= contents.numProperties; i++) {
            var prop = contents.property(i);
            // Chỉ lấy các Group con (bỏ qua FX và Fill)
            if (prop.matchName === "ADBE Vector Group") {
                var row = listPanel.add("group");
                row.orientation = "row";
                row.alignChildren = ["left", "center"];
                
                var txt = row.add("statictext", undefined, indexCount + ". " + prop.name);
                txt.preferredSize.width = 100;
                
                var delBtn = row.add("button", undefined, "-");
                delBtn.size = [25, 20];
                delBtn.propName = prop.name; // Lưu lại tên để xoá
                
                delBtn.onClick = function() {
                    removeFromBlooby(bloobyLayer, this.propName);
                    reloadList(listPanel); // Cập nhật lại UI sau khi xoá
                };
                indexCount++;
            }
        }
        listPanel.parent.layout.layout(true);
    }

    function addToBlooby(clearOriginal) {
        var comp = app.project.activeItem;
        if (!comp) return;
        var selLayers = comp.selectedLayers;
        
        var bloobyLayer = null;
        var shapeLayers = [];

        // Phân loại: Đâu là BLOOBY, đâu là Shape thường
        for (var i = 0; i < selLayers.length; i++) {
            var l = selLayers[i];
            if (l.property("ADBE Effect Parade") && l.property("ADBE Effect Parade").property("Blob Amount")) {
                bloobyLayer = l;
            } else if (l instanceof ShapeLayer) {
                shapeLayers.push(l);
            }
        }

        if (!bloobyLayer || shapeLayers.length === 0) {
            alert("Hãy chọn các Shape cần thêm VÀ 1 layer BLOOBY đang có!");
            return;
        }

        app.beginUndoGroup("Add To Blooby");
        var bloobyContents = bloobyLayer.property("ADBE Root Vectors Group");
        var layersToRemove = [];

        for (var i = 0; i < shapeLayers.length; i++) {
            var src = shapeLayers[i];

            // 1. Tính tâm Shape
            var srcRect = src.sourceRectAtTime(comp.time, false);
            var cx = srcRect.left + srcRect.width / 2;
            var cy = srcRect.top + srcRect.height / 2;
            
            var tNull = comp.layers.addNull();
            tNull.parent = src;
            tNull.property("ADBE Transform Group").property("ADBE Position").setValue([cx, cy]);
            tNull.parent = null; 
            var worldCenter = tNull.property("ADBE Transform Group").property("ADBE Position").value;
            tNull.remove();

            // 2. Tạo Null
            var nullLayer = comp.layers.addNull();
            nullLayer.name = "Null - " + src.name; 
            nullLayer.moveAfter(bloobyLayer);

            var nullTransform = nullLayer.property("ADBE Transform Group");
            var srcTransform = src.property("ADBE Transform Group");

            nullTransform.property("ADBE Anchor Point").setValue([50, 50]);
            nullLayer.parent = bloobyLayer;
            
            // Dùng dummy Point Control để tính Local Pos cho Null
            var dummyFx = bloobyLayer.property("ADBE Effect Parade").addProperty("ADBE Point Control");
            dummyFx.property(1).expression = "thisComp.layer('" + bloobyLayer.name + "').fromComp([" + worldCenter[0] + ", " + worldCenter[1] + "]);";
            nullTransform.property("ADBE Position").setValue(dummyFx.property(1).valueAtTime(comp.time, false));
            dummyFx.remove();

            nullTransform.property("ADBE Scale").setValue(srcTransform.property("ADBE Scale").valueAtTime(comp.time, false));
            nullTransform.property("ADBE Rotate Z").setValue(srcTransform.property("ADBE Rotate Z").valueAtTime(comp.time, false));

            // 3. Clone Shape
            var cloneGroup = bloobyContents.addProperty("ADBE Vector Group");
            cloneGroup.name = src.name;
            duplicateShapeContents(src, cloneGroup);
            
            // Đẩy cloneGroup lên trên cùng (trên các FX 1, FX 2...)
            cloneGroup.moveTo(1);

            // 4. Rigging
            var cloneTransform = cloneGroup.property("ADBE Vector Transform Group");
            var safeNullName = nullLayer.name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
            cloneTransform.property("ADBE Vector Anchor").setValue([cx, cy]);
            cloneTransform.property("ADBE Vector Position").expression = "L = thisComp.layer('" + safeNullName + "'); L.toComp(L.transform.anchorPoint);";
            cloneTransform.property("ADBE Vector Rotation").expression = "L = thisComp.layer('" + safeNullName + "'); u = L.toWorldVec([1,0]); Math.atan2(u[1],u[0]) * 180 / Math.PI;";
            cloneTransform.property("ADBE Vector Scale").expression = "L = thisComp.layer('" + safeNullName + "'); u = L.toWorldVec([1,0]); v = L.toWorldVec([0,1]); [length(u), length(v)] * 100;";

            // 5. Cleanup layer gốc
            if (clearOriginal) {
                layersToRemove.push(src); 
            } else {
                src.enabled = true; 
                src.moveBefore(bloobyLayer); 
                var isPosSeparated = srcTransform.property("ADBE Position").dimensionsSeparated;
                if (isPosSeparated) srcTransform.property("ADBE Position").dimensionsSeparated = false; 
                src.parent = nullLayer; 
                if (isPosSeparated) srcTransform.property("ADBE Position").dimensionsSeparated = true;
            }
        }

        for (var i = 0; i < layersToRemove.length; i++) layersToRemove[i].remove();
        if (globalListPanel) reloadList(globalListPanel);
        
        app.endUndoGroup();
    }

    function removeFromBlooby(bloobyLayer, propName) {
        var comp = app.project.activeItem;
        app.beginUndoGroup("Remove from Blooby");
        
        // Xoá clone bên trong Blooby
        var contents = bloobyLayer.property("ADBE Root Vectors Group");
        for (var i = 1; i <= contents.numProperties; i++) {
            if (contents.property(i).name === propName) {
                contents.property(i).remove();
                break;
            }
        }

        // Xoá Null tương ứng (Nếu xoá Null, AE tự động bỏ parent của Shape gốc về Composition và GIỮ NGUYÊN world transform)
        for (var i = 1; i <= comp.numLayers; i++) {
            if (comp.layer(i).name === "Null - " + propName) {
                comp.layer(i).remove();
                break;
            }
        }
        app.endUndoGroup();
    }
    
    // --- 3. CÁC HÀM "DEEP COPY" XỬ LÝ SHAPE KHÔNG BỊ TRỐNG ---
    function duplicateShapeContents(srcLayer, targetGroup) {
        var srcContents = srcLayer.property("ADBE Root Vectors Group");
        var targetContents = targetGroup.property("ADBE Vectors Group");
        
        for (var i = 1; i <= srcContents.numProperties; i++) {
            var srcProp = srcContents.property(i);
            var newProp = targetContents.addProperty(srcProp.matchName);
            newProp.name = srcProp.name;
            if (newProp.matchName === "ADBE Vector Group") {
                addPropertiesRecursively(srcProp, newProp);
            } else {
                setProperties(srcProp, newProp);
            }
        }
    }

    function addPropertiesRecursively(curGroup, newGroup) {
        if (newGroup.canSetEnabled === true && curGroup.canSetEnabled === true) { 
            newGroup.enabled = curGroup.enabled; 
        }
        var propName = "ADBE Vectors Group";
        var runLen = curGroup.property(propName).numProperties;
        
        for (var i = 1; i <= runLen; i++) { 
            var curProp = curGroup.property(propName).property(i);
            var newProp = newGroup.property("ADBE Vectors Group").addProperty(curProp.matchName);
            newProp.name = curProp.name;
            if (newProp.matchName === "ADBE Vector Group") { 
                addPropertiesRecursively(curProp, newProp); 
            } else { 
                setProperties(curProp, newProp); 
            }
        }
        if (curGroup.propertyDepth > 0) { 
            setProperties(curGroup.property("ADBE Vector Transform Group"), newGroup.property("ADBE Vector Transform Group")); 
        }
    }

    function setProperties(curGroup, newGroup) {
        if (newGroup.canSetEnabled === true && curGroup.canSetEnabled === true) { 
            newGroup.enabled = curGroup.enabled; 
        }
        for (var j = 1; j <= newGroup.numProperties; j += 1) { 
            var curProp = curGroup.property(j);
            var newProp = newGroup.property(j);
            if ((curProp.propertyValueType === ValTypeCustom) || (curProp.propertyValueType === ValTypeNone)) { continue; }
            if (curProp.isModified === true) { 
                if (curProp.numProperties == null) { 
                    setValues(curProp, newProp, false); 
                } else { 
                    if (curProp.matchName == "ADBE Vector Stroke Dashes") { 
                        for (var i = 1; i <= curProp.numProperties; i += 1) { 
                            var oldProp = curProp.property(i);
                            if (oldProp.isModified) { newProp.addProperty(curProp.property(i).matchName); }
                        }
                    }
                    setProperties(curProp, newProp);
                }
            }
        }
    }

    function setValues(curProp, newProp, downGrade) {
        if (curProp.isTimeVarying === true) { 
            var keyObjArr = [];
            for (var x = 1; x <= curProp.numKeys; x += 1) { 
                keyObjArr.push(getKeyObjByIndex(curProp, newProp, x, downGrade)); 
            }
            for (var z = 1; z <= curProp.numKeys; z += 1) { 
                setNewKeyAtTime(newProp, keyObjArr[z - 1], downGrade); 
            }
            for (var y = 1; y <= curProp.numKeys; y += 1) { 
                copyKeyframes(keyObjArr[y - 1], newProp, y, downGrade); 
            }
        } else {
            if (curProp.value.length === 2) { newProp.setValue([curProp.value[0], curProp.value[1]]); }
            else if (curProp.value.length === 3) { newProp.setValue([curProp.value[0], curProp.value[1], curProp.value[2]]); }
            else if (curProp.value.length === 4) { newProp.setValue([curProp.value[0], curProp.value[1], curProp.value[2], curProp.value[3]]); }
            else { newProp.setValue(curProp.value); }
        }

        // Sao chép Expression (Điều chỉnh đường dẫn cho phù hợp với nội dung được gộp)
        if (curProp.canSetExpression === true && curProp.expression !== "") { 
            var exp = curProp.expression;
            var layer = curProp.propertyGroup(curProp.propertyDepth);
            if (exp.indexOf("thisLayer.content") !== -1) { var reg = new RegExp("thisLayer.content", "g"); }
            else if (exp.indexOf("thisLayer(\"Contents\")") !== -1) { var reg = new RegExp("thisLayer(\"Contents\")", "g"); }
            else if (exp.indexOf("layer(\"" + layer.name + "\").content") !== -1) { var reg = new RegExp("layer(\"" + layer.name + "\").content", "g"); }
            else { if (exp.indexOf("layer(\"" + layer.name + "\")(\"Contents\")") !== -1) { var reg = new RegExp("layer(\"" + layer.name + "\")(\"Contents\")", "g"); } }
            
            if (reg) {
                exp = exp.replace(reg, "thisLayer(\"Contents\")(\"" + curProp.name + "\")(\"Contents\")");
            }
            newProp.expression = exp;
        }
    }

    function getKeyObjByIndex(prop, newProp, keyIndex, downGrade) {
        var keyObj = {};
        keyObj.keyTime = prop.keyTime(keyIndex);
        keyObj.keyValue = prop.keyValue(keyIndex);
        keyObj.inInterpolation = prop.keyInInterpolationType(keyIndex);
        keyObj.outInterpolation = prop.keyOutInterpolationType(keyIndex);
        keyObj.inEase = prop.keyInTemporalEase(keyIndex);
        keyObj.outEase = prop.keyOutTemporalEase(keyIndex);
        keyObj.temporalAutoBezier = prop.keyTemporalAutoBezier(keyIndex);
        keyObj.temporalContinuous = prop.keyTemporalContinuous(keyIndex);
        if ((prop.propertyValueType == ValType3DS) || (prop.propertyValueType == ValType2DS)) { 
            keyObj.keyInSpatialTangent = prop.keyInSpatialTangent(keyIndex);
            keyObj.keyOutSpatialTangent = prop.keyOutSpatialTangent(keyIndex);
            keyObj.spatialContinuous = prop.keySpatialContinuous(keyIndex);
            keyObj.spatialAutoBezier = prop.keySpatialAutoBezier(keyIndex);
            keyObj.roving = prop.keyRoving(keyIndex);
        }
        return keyObj;
    }

    function setNewKeyAtTime(prop, keyObj, downGrade) {
        var keyTime = keyObj.keyTime;
        var keyValue = keyObj.keyValue;
        prop.setValueAtTime(keyTime, keyValue);
    }

    function copyKeyframes(keyObj, prop, keyIndex, downGrade) {
        prop.setInterpolationTypeAtKey(keyIndex, keyObj.inInterpolation, keyObj.outInterpolation);
        if ((keyObj.inInterpolation == KeyframeInterpolationType.BEZIER) || (keyObj.outInterpolation == KeyframeInterpolationType.BEZIER)) { 
            if (keyObj.inEase.length === 3) { 
                prop.setTemporalEaseAtKey(keyIndex, [keyObj.inEase[0], keyObj.inEase[1]], [keyObj.outEase[0], keyObj.outEase[1]]);
            } else {
                prop.setTemporalEaseAtKey(keyIndex, keyObj.inEase, keyObj.outEase);
            }
            prop.setTemporalAutoBezierAtKey(keyIndex, keyObj.temporalAutoBezier);
            prop.setTemporalContinuousAtKey(keyIndex, keyObj.temporalContinuous);
        }
        if ((prop.propertyValueType === ValType2DS) || (prop.propertyValueType === ValType3DS)) { 
            prop.setSpatialTangentsAtKey(keyIndex, [keyObj.keyInSpatialTangent[0], keyObj.keyInSpatialTangent[1]], [keyObj.keyOutSpatialTangent[0], keyObj.keyOutSpatialTangent[1]]);
            prop.setSpatialContinuousAtKey(keyIndex, keyObj.spatialContinuous);
            prop.setSpatialAutoBezierAtKey(keyIndex, keyObj.spatialAutoBezier);
            prop.setRovingAtKey(keyIndex, keyObj.roving);
        }
    }

    // --- CHẠY UI ---
    buildUI(thisObj);
})(this);