// ==========================================
// BLOOBY TOOL - Advanced Gooey / Blob Generator
// ==========================================

(function(thisObj) {

    // ------------------------------------------------------------------
    //  HẰNG SỐ (matchName, tên FX, value type) - tránh "magic strings"
    // ------------------------------------------------------------------
    var MN = {
        ROOT_VECTORS:     "ADBE Root Vectors Group",
        VECTORS_GROUP:    "ADBE Vectors Group",
        VECTOR_GROUP:     "ADBE Vector Group",
        VEC_TRANSFORM:    "ADBE Vector Transform Group",
        STROKE_DASHES:    "ADBE Vector Stroke Dashes",

        TRANSFORM_GROUP:  "ADBE Transform Group",
        EFFECTS:          "ADBE Effect Parade",
        POSITION:         "ADBE Position",
        ANCHOR:           "ADBE Anchor Point",
        SCALE:            "ADBE Scale",
        ROTATE_Z:         "ADBE Rotate Z",

        SLIDER:           "ADBE Slider Control",
        POINT_CTRL:       "ADBE Point Control",
        MERGE:            "ADBE Vector Filter - Merge",
        OFFSET:           "ADBE Vector Filter - Offset",
        FILL:             "ADBE Vector Graphic - Fill",

        VEC_ANCHOR:       "ADBE Vector Anchor",
        VEC_POSITION:     "ADBE Vector Position",
        VEC_ROTATION:     "ADBE Vector Rotation",
        VEC_SCALE:        "ADBE Vector Scale",
        VEC_FILL_COLOR:   "ADBE Vector Fill Color",
        MERGE_TYPE:       "ADBE Vector Merge Type",
        OFFSET_AMOUNT:    "ADBE Vector Offset Amount",
        OFFSET_LINE_JOIN: "ADBE Vector Offset Line Join"
    };

    // Tên các property/effect do tool tạo ra
    var BLOB_AMOUNT_NAME   = "Blob Amount";
    var OFFSET_AMOUNT_NAME = "Offset Amount";
    var OFFSET_BLOOBY_NAME = "Offset Blooby";
    var NULL_PREFIX        = "Null - ";

    // Value type (dùng cho deep-copy keyframe)
    var ValTypeCustom = PropertyValueType.CUSTOM_VALUE;
    var ValTypeNone   = PropertyValueType.NO_VALUE;
    var ValType3DS    = PropertyValueType.ThreeD_SPATIAL;
    var ValType2DS    = PropertyValueType.TwoD_SPATIAL;

    // ------------------------------------------------------------------
    //  TRẠNG THÁI / UI GLOBALS
    // ------------------------------------------------------------------
    var gWin          = null;  // cửa sổ / panel gốc
    var gListPanel    = null;  // panel chứa danh sách shape
    var gTargetField  = null;  // ô input hiển thị target (read-only)
    var gTargetBlooby = null;  // layer BLOOBY đang được "watch"

    // ------------------------------------------------------------------
    //  TIỆN ÍCH NHỎ
    // ------------------------------------------------------------------
    function contains(arr, v) {
        for (var i = 0; i < arr.length; i++) { if (arr[i] === v) return true; }
        return false;
    }

    function escapeForExpr(name) {
        return name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    }

    // Layer còn tồn tại / truy cập được không
    function isValidLayer(layer) {
        if (!layer) return false;
        try { var n = layer.name; var i = layer.index; return true; }
        catch (e) { return false; }
    }

    // Layer có phải là BLOOBY không (nhận diện qua effect "Blob Amount")
    function isBlooby(layer) {
        try {
            return !!(layer && layer.property(MN.EFFECTS) &&
                      layer.property(MN.EFFECTS).property(BLOB_AMOUNT_NAME) != null);
        } catch (e) { return false; }
    }

    // Trả về BLOOBY đang được watch (nếu còn hợp lệ)
    function getActiveBlooby() {
        return (isValidLayer(gTargetBlooby) && isBlooby(gTargetBlooby)) ? gTargetBlooby : null;
    }

    function getSelectedShapes(comp) {
        var out = [], sel = comp.selectedLayers;
        for (var i = 0; i < sel.length; i++) {
            if (sel[i] instanceof ShapeLayer) out.push(sel[i]);
        }
        return out;
    }

    function deselectAll(comp) {
        for (var i = 1; i <= comp.numLayers; i++) comp.layer(i).selected = false;
    }

    function layerNameExists(comp, name) {
        for (var i = 1; i <= comp.numLayers; i++) {
            if (comp.layer(i).name === name) return true;
        }
        return false;
    }

    // Lấy world position của 1 điểm local thuộc srcLayer (qua null tạm, an toàn)
    function getWorldPoint(comp, srcLayer, localPoint) {
        var t = comp.layers.addNull();
        t.parent = srcLayer;
        t.property(MN.TRANSFORM_GROUP).property(MN.POSITION).setValue(localPoint);
        t.parent = null;
        var w = t.property(MN.TRANSFORM_GROUP).property(MN.POSITION).value;
        t.remove();
        return w;
    }

    // Sinh tên clone-group duy nhất để link clone <-> null không bị trùng
    function uniqueGroupName(comp, contents, base) {
        var taken = [];
        for (var i = 1; i <= contents.numProperties; i++) {
            if (contents.property(i).matchName === MN.VECTOR_GROUP) taken.push(contents.property(i).name);
        }
        var name = base, k = 2;
        while (contains(taken, name) || layerNameExists(comp, NULL_PREFIX + name)) {
            name = base + " (" + (k++) + ")";
        }
        return name;
    }

    // Biểu thức rig clone bám theo null.
    // Mọi biểu thức quy đổi WORLD của null về LOCAL của BLOOBY (qua thisLayer.*),
    // nên clone luôn khớp shape gốc dù BLOOBY bị di chuyển / xoay / đổi anchor.
    function rigExpressions(nullName) {
        var safe = escapeForExpr(nullName);
        var head = "L = thisComp.layer('" + safe + "'); ";
        return {
            position: head + "thisLayer.fromComp(L.toComp(L.transform.anchorPoint));",
            rotation: head + "nu = L.toWorldVec([1,0]); bu = thisLayer.toWorldVec([1,0]); (Math.atan2(nu[1],nu[0]) - Math.atan2(bu[1],bu[0])) * 180 / Math.PI;",
            scale:    head + "nu = L.toWorldVec([1,0]); nv = L.toWorldVec([0,1]); bu = thisLayer.toWorldVec([1,0]); bv = thisLayer.toWorldVec([0,1]); [length(nu)/length(bu), length(nv)/length(bv)] * 100;"
        };
    }

    // Quy đổi 1 điểm comp/world về toạ độ local của layer (qua Point Control tạm).
    // Đúng kể cả khi layer đã di chuyển hoặc anchor point không nằm ở giữa.
    function compToLocal(comp, layer, worldPoint) {
        var fx = layer.property(MN.EFFECTS).addProperty(MN.POINT_CTRL);
        fx.property(1).expression = "thisLayer.fromComp([" + worldPoint[0] + ", " + worldPoint[1] + "]);";
        var local = fx.property(1).valueAtTime(comp.time, false);
        fx.remove();
        return local;
    }

    // ==================================================================
    //  CORE: thêm 1 shape vào layer BLOOBY (dùng chung cho create & add)
    // ==================================================================
    function addShapeToBlooby(comp, bloobyLayer, src, clearOriginal, cloneToTop, layersToRemove) {
        var contents = bloobyLayer.property(MN.ROOT_VECTORS);

        // 1. Tâm nội dung shape -> world
        var rect = src.sourceRectAtTime(comp.time, false);
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var worldCenter = getWorldPoint(comp, src, [cx, cy]);

        var srcTransform = src.property(MN.TRANSFORM_GROUP);

        // 2. Tên duy nhất (clone-group và null dùng chung tên này)
        var name = uniqueGroupName(comp, contents, src.name);

        // 3. Tạo Null điều khiển
        var nullLayer = comp.layers.addNull();
        nullLayer.name = NULL_PREFIX + name;
        nullLayer.moveAfter(bloobyLayer);

        var nt = nullLayer.property(MN.TRANSFORM_GROUP);
        nt.property(MN.ANCHOR).setValue([50, 50]);
        // Parent vào BLOOBY TRƯỚC, rồi mới đặt vị trí LOCAL (quy đổi từ world bằng
        // fromComp). Cách này đúng kể cả khi anchor của BLOOBY không nằm ở giữa.
        nullLayer.parent = bloobyLayer;
        nt.property(MN.POSITION).setValue(compToLocal(comp, bloobyLayer, worldCenter));
        nt.property(MN.SCALE).setValue(srcTransform.property(MN.SCALE).valueAtTime(comp.time, false));
        nt.property(MN.ROTATE_Z).setValue(srcTransform.property(MN.ROTATE_Z).valueAtTime(comp.time, false));

        // 4. Clone nội dung shape vào trong BLOOBY
        var cloneGroup = contents.addProperty(MN.VECTOR_GROUP);
        cloneGroup.name = name;
        duplicateShapeContents(src, cloneGroup);
        if (cloneToTop) cloneGroup.moveTo(1); // giữ clone nằm trên các FX

        // 5. Rig clone bám theo null bằng world coordinates
        var ct = cloneGroup.property(MN.VEC_TRANSFORM);
        var ex = rigExpressions(nullLayer.name);
        ct.property(MN.VEC_ANCHOR).setValue([cx, cy]);
        ct.property(MN.VEC_POSITION).expression = ex.position;
        ct.property(MN.VEC_ROTATION).expression = ex.rotation;
        ct.property(MN.VEC_SCALE).expression    = ex.scale;

        // 6. Xử lý layer gốc
        if (clearOriginal) {
            layersToRemove.push(src);
        } else {
            src.enabled = true;
            src.moveBefore(bloobyLayer);
            var isPosSeparated = srcTransform.property(MN.POSITION).dimensionsSeparated;
            if (isPosSeparated) srcTransform.property(MN.POSITION).dimensionsSeparated = false;
            src.parent = nullLayer; // AE giữ nguyên vị trí trực quan
            if (isPosSeparated) srcTransform.property(MN.POSITION).dimensionsSeparated = true;
        }

        return nullLayer;
    }

    // Thêm chuỗi FX gooey (Merge -> Offset+ -> Offset- -> Fill)
    function addBloobyFX(bloobyLayer) {
        var contents = bloobyLayer.property(MN.ROOT_VECTORS);

        var merge = contents.addProperty(MN.MERGE);
        merge.name = "FX 1";
        merge.property(MN.MERGE_TYPE).setValue(1);

        var off1 = contents.addProperty(MN.OFFSET);
        off1.name = "FX 2";
        off1.property(MN.OFFSET_AMOUNT).expression = "effect('" + BLOB_AMOUNT_NAME + "')('Slider');";
        off1.property(MN.OFFSET_LINE_JOIN).setValue(2);

        var off2 = contents.addProperty(MN.OFFSET);
        off2.name = "FX 3";
        off2.property(MN.OFFSET_AMOUNT).expression = "effect('" + BLOB_AMOUNT_NAME + "')('Slider') * -1;";
        off2.property(MN.OFFSET_LINE_JOIN).setValue(2);

        var fill = contents.addProperty(MN.FILL);
        fill.property(MN.VEC_FILL_COLOR).setValue([1, 1, 1, 1]);
    }

    // ==================================================================
    //  HÀNH ĐỘNG CHÍNH
    // ==================================================================
    function createBlooby(clearOriginal) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Hãy mở một Composition trước nhé!");
            return;
        }

        var shapeLayers = getSelectedShapes(comp);
        if (shapeLayers.length < 1) {
            alert("Vui lòng chọn ít nhất 1 Shape Layer để tạo Blooby!");
            return;
        }

        app.beginUndoGroup("Blooby Generator");

        // Tạo layer BLOOBY
        var bloobyLayer = comp.layers.addShape();
        bloobyLayer.name = "BLOOBY";
        bloobyLayer.moveBefore(shapeLayers[0]);

        // Tâm trung bình (world) của tất cả shape đã chọn
        var avgX = 0, avgY = 0;
        for (var i = 0; i < shapeLayers.length; i++) {
            var s = shapeLayers[i];
            var ap = s.property(MN.TRANSFORM_GROUP).property(MN.ANCHOR).valueAtTime(comp.time, false);
            var w = getWorldPoint(comp, s, ap);
            avgX += w[0];
            avgY += w[1];
        }
        avgX /= shapeLayers.length;
        avgY /= shapeLayers.length;

        bloobyLayer.property(MN.TRANSFORM_GROUP).property(MN.POSITION).setValue([avgX, avgY]);
        bloobyLayer.property(MN.TRANSFORM_GROUP).property(MN.ANCHOR).setValue([avgX, avgY]);

        // Slider "Blob Amount"
        var sliderFx = bloobyLayer.property(MN.EFFECTS).addProperty(MN.SLIDER);
        sliderFx.name = BLOB_AMOUNT_NAME;
        sliderFx.property(1).setValue(50);

        // Thêm từng shape (clone nằm sẵn ở trên, FX thêm sau nên không cần moveToTop)
        var layersToRemove = [];
        for (var j = 0; j < shapeLayers.length; j++) {
            addShapeToBlooby(comp, bloobyLayer, shapeLayers[j], clearOriginal, false, layersToRemove);
        }

        addBloobyFX(bloobyLayer);

        for (var r = 0; r < layersToRemove.length; r++) layersToRemove[r].remove();

        deselectAll(comp);
        bloobyLayer.selected = true;

        app.endUndoGroup();

        // BLOOBY mới trở thành target được watch
        setTarget(bloobyLayer);
    }

    function addToBlooby(clearOriginal) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) return;

        var bloobyLayer = getActiveBlooby();
        if (!bloobyLayer) {
            alert("Chưa có target BLOOBY!\nChọn 1 layer BLOOBY và nhấn ↻ để đặt target trước.");
            return;
        }

        var shapeLayers = getSelectedShapes(comp);
        if (shapeLayers.length === 0) {
            alert("Hãy chọn ít nhất 1 Shape Layer để thêm vào BLOOBY!");
            return;
        }

        app.beginUndoGroup("Add To Blooby");

        var layersToRemove = [];
        for (var i = 0; i < shapeLayers.length; i++) {
            addShapeToBlooby(comp, bloobyLayer, shapeLayers[i], clearOriginal, true, layersToRemove);
        }
        for (var r = 0; r < layersToRemove.length; r++) layersToRemove[r].remove();

        app.endUndoGroup();

        refreshList();
    }

    function removeFromBlooby(propName) {
        var bloobyLayer = getActiveBlooby();
        if (!bloobyLayer) return;
        var comp = app.project.activeItem;

        app.beginUndoGroup("Remove from Blooby");

        // Xoá clone bên trong BLOOBY
        var contents = bloobyLayer.property(MN.ROOT_VECTORS);
        for (var i = 1; i <= contents.numProperties; i++) {
            if (contents.property(i).name === propName) { contents.property(i).remove(); break; }
        }

        // Xoá Null tương ứng (AE tự bỏ parent của shape gốc, giữ nguyên world transform)
        for (var j = 1; j <= comp.numLayers; j++) {
            if (comp.layer(j).name === NULL_PREFIX + propName) { comp.layer(j).remove(); break; }
        }

        app.endUndoGroup();
    }

    function toggleOffsetPath() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) return;

        // Ưu tiên target đang watch, nếu không có thì tìm trong selection
        var bloobyLayer = getActiveBlooby();
        if (!bloobyLayer) {
            var sel = comp.selectedLayers;
            for (var i = 0; i < sel.length; i++) {
                if (isBlooby(sel[i]) || sel[i].name === "BLOOBY") { bloobyLayer = sel[i]; break; }
            }
        }
        if (!bloobyLayer) {
            alert("Vui lòng chọn layer BLOOBY để thêm/bớt Offset Path!");
            return;
        }

        app.beginUndoGroup("Toggle Offset Path");

        var contents = bloobyLayer.property(MN.ROOT_VECTORS);
        var effects  = bloobyLayer.property(MN.EFFECTS);

        var existingOffset = contents.property(OFFSET_BLOOBY_NAME);
        var existingSlider = effects.property(OFFSET_AMOUNT_NAME);

        if (existingOffset) {
            existingOffset.remove();
            if (existingSlider) existingSlider.remove();
        } else {
            if (!existingSlider) {
                existingSlider = effects.addProperty(MN.SLIDER);
                existingSlider.name = OFFSET_AMOUNT_NAME;
                existingSlider.property(1).setValue(50);
            }
            var newOffset = contents.addProperty(MN.OFFSET);
            newOffset.name = OFFSET_BLOOBY_NAME;
            newOffset.property(MN.OFFSET_LINE_JOIN).setValue(2);
            newOffset.property(MN.OFFSET_AMOUNT).expression = "effect('" + OFFSET_AMOUNT_NAME + "')('Slider');";
            newOffset.moveTo(contents.numProperties);
        }

        app.endUndoGroup();
    }

    // ==================================================================
    //  TARGET WATCHING + DANH SÁCH UI
    // ==================================================================
    function setTarget(layer) {
        gTargetBlooby = layer;
        updateTargetField();
        refreshList();
    }

    function updateTargetField() {
        if (!gTargetField) return;
        gTargetField.text = getActiveBlooby()
            ? (gTargetBlooby.index + ". " + gTargetBlooby.name)
            : "(no target)";
    }

    // Nút ↻ : chỉ đổi target khi có đúng 1 layer BLOOBY được chọn
    function reloadTarget() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) { alert("Hãy mở một Composition!"); return; }

        var sel = comp.selectedLayers, picked = null, count = 0;
        for (var i = 0; i < sel.length; i++) {
            if (isBlooby(sel[i])) { picked = sel[i]; count++; }
        }

        if (count === 1) {
            setTarget(picked);
        } else if (count > 1) {
            alert("Vui lòng chọn duy nhất 1 layer BLOOBY để đặt làm target!");
        } else if (getActiveBlooby()) {
            // Không chọn BLOOBY nào -> chỉ làm tươi lại danh sách của target hiện tại
            refreshList();
        } else {
            alert("Chọn 1 layer BLOOBY rồi nhấn ↻ để đặt làm target!");
        }
    }

    function clearListRows() {
        while (gListPanel.children.length > 0) gListPanel.remove(gListPanel.children[0]);
    }

    function addListRow(index, propName) {
        var row = gListPanel.add("group");
        row.orientation = "row";
        row.alignment = ["fill", "top"];
        row.alignChildren = ["left", "center"];
        row.spacing = 6;

        // Cố định chiều rộng cột tên -> nút "-" luôn thẳng hàng dù tên dài ngắn khác nhau
        var txt = row.add("statictext", undefined, index + ". " + propName);
        txt.preferredSize.width = 170;
        txt.maximumSize.width = 170;

        var delBtn = row.add("button", undefined, "-");
        delBtn.size = [24, 20];
        delBtn.propName = propName;
        delBtn.onClick = function () {
            removeFromBlooby(this.propName);
            refreshList();
        };
    }

    // Dựng lại toàn bộ danh sách từ target đang watch
    function refreshList() {
        if (!gListPanel) return;
        clearListRows();

        var blooby = getActiveBlooby();
        if (blooby) {
            var contents = blooby.property(MN.ROOT_VECTORS);
            var index = 1;
            for (var i = 1; i <= contents.numProperties; i++) {
                var prop = contents.property(i);
                if (prop.matchName === MN.VECTOR_GROUP) {
                    addListRow(index, prop.name);
                    index++;
                }
            }
        }

        updateTargetField();
        relayout();
    }

    // Re-layout ổn định, tránh vỡ layout khi thêm/bớt phần tử
    function relayout() {
        gListPanel.layout.layout(true);
        if (gWin) gWin.layout.layout(true);
    }

    // ==================================================================
    //  GIAO DIỆN
    // ==================================================================
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj
                : new Window("palette", "Blooby Tool", undefined, {resizeable: true});
        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 8;
        win.margins = 12;
        gWin = win;

        // --- Cụm hành động ở trên ---
        var topGroup = win.add("group");
        topGroup.orientation = "column";
        topGroup.alignment = ["fill", "top"];
        topGroup.alignChildren = ["center", "top"];

        var btnRow = topGroup.add("group");
        btnRow.orientation = "row";
        var bloobyBtn = btnRow.add("button", undefined, "Blooby!");
        bloobyBtn.size = [140, 35];
        var toggleBtn = btnRow.add("button", undefined, "Toggle Offset Path");
        toggleBtn.size = [140, 35];

        var clearOriginalCb = topGroup.add("checkbox", undefined, "Clear Original Shape");
        clearOriginalCb.value = false;

        // --- Đường kẻ ngăn (khoá chiều cao để không bị giãn) ---
        var sep = win.add("panel");
        sep.alignment = ["fill", "top"];
        sep.minimumSize.height = 2;
        sep.maximumSize.height = 2;

        // --- Tiêu đề ---
        var listTitle = win.add("statictext", undefined, "Blooby Contents:");
        listTitle.alignment = ["fill", "top"];

        // --- Hàng điều khiển: ô target + ↻ + x + + ---
        var ctrlRow = win.add("group");
        ctrlRow.orientation = "row";
        ctrlRow.alignment = ["fill", "top"];
        ctrlRow.alignChildren = ["left", "center"];

        gTargetField = ctrlRow.add("edittext", undefined, "(no target)", {readonly: true});
        gTargetField.alignment = ["fill", "center"];
        gTargetField.helpTip = "Layer BLOOBY đang được theo dõi. Chọn 1 layer BLOOBY rồi nhấn ↻ để đổi target.";

        var reloadBtn = ctrlRow.add("button", undefined, "↻");
        reloadBtn.size = [28, 24];
        reloadBtn.helpTip = "Đặt layer BLOOBY đang chọn làm target & tải danh sách";

        var clearListBtn = ctrlRow.add("button", undefined, "x");
        clearListBtn.size = [28, 24];
        clearListBtn.helpTip = "Xoá hiển thị danh sách trong UI (không xoá layer)";

        var addBtn = ctrlRow.add("button", undefined, "+");
        addBtn.size = [28, 24];
        addBtn.helpTip = "Chọn các Shape cần thêm rồi nhấn + (thêm vào target)";

        // --- Panel danh sách ---
        gListPanel = win.add("panel", undefined, "");
        gListPanel.orientation = "column";
        gListPanel.alignment = ["fill", "top"];
        gListPanel.alignChildren = ["fill", "top"];
        gListPanel.spacing = 4;
        gListPanel.margins = 5;
        gListPanel.minimumSize.height = 40;
        gListPanel.maximumSize.height = 300;

        // --- Events ---
        bloobyBtn.onClick    = function () { createBlooby(clearOriginalCb.value); };
        toggleBtn.onClick    = function () { toggleOffsetPath(); };
        reloadBtn.onClick    = function () { reloadTarget(); };
        addBtn.onClick       = function () { addToBlooby(clearOriginalCb.value); };
        clearListBtn.onClick = function () { clearListRows(); relayout(); };

        win.onResizing = win.onResize = function () { this.layout.resize(); };

        if (win instanceof Window) {
            win.center();
            win.show();
        } else {
            win.layout.layout(true);
        }
    }

    // ==================================================================
    //  DEEP-COPY SHAPE (giữ nguyên contents, keyframe, expression)
    // ==================================================================
    function duplicateShapeContents(srcLayer, targetGroup) {
        var srcContents    = srcLayer.property(MN.ROOT_VECTORS);
        var targetContents = targetGroup.property(MN.VECTORS_GROUP);

        for (var i = 1; i <= srcContents.numProperties; i++) {
            var srcProp = srcContents.property(i);
            var newProp = targetContents.addProperty(srcProp.matchName);
            newProp.name = srcProp.name;
            if (newProp.matchName === MN.VECTOR_GROUP) {
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
        var runLen = curGroup.property(MN.VECTORS_GROUP).numProperties;

        for (var i = 1; i <= runLen; i++) {
            var curProp = curGroup.property(MN.VECTORS_GROUP).property(i);
            var newProp = newGroup.property(MN.VECTORS_GROUP).addProperty(curProp.matchName);
            newProp.name = curProp.name;
            if (newProp.matchName === MN.VECTOR_GROUP) {
                addPropertiesRecursively(curProp, newProp);
            } else {
                setProperties(curProp, newProp);
            }
        }
        if (curGroup.propertyDepth > 0) {
            setProperties(curGroup.property(MN.VEC_TRANSFORM), newGroup.property(MN.VEC_TRANSFORM));
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
                    if (curProp.matchName == MN.STROKE_DASHES) {
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

        // Sao chép Expression (điều chỉnh đường dẫn cho nội dung được gộp)
        if (curProp.canSetExpression === true && curProp.expression !== "") {
            var exp = curProp.expression;
            var layer = curProp.propertyGroup(curProp.propertyDepth);
            var reg = null;
            if (exp.indexOf("thisLayer.content") !== -1) { reg = new RegExp("thisLayer.content", "g"); }
            else if (exp.indexOf("thisLayer(\"Contents\")") !== -1) { reg = new RegExp("thisLayer(\"Contents\")", "g"); }
            else if (exp.indexOf("layer(\"" + layer.name + "\").content") !== -1) { reg = new RegExp("layer(\"" + layer.name + "\").content", "g"); }
            else if (exp.indexOf("layer(\"" + layer.name + "\")(\"Contents\")") !== -1) { reg = new RegExp("layer(\"" + layer.name + "\")(\"Contents\")", "g"); }

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
        prop.setValueAtTime(keyObj.keyTime, keyObj.keyValue);
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
