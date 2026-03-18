(function (thisObj) {
    function buildUI(thisObj) {
        var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Clone With Rotation", undefined, {resizeable: true});
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.spacing = 10;
        panel.margins = 16;

        var angleGroup = panel.add("group");
        angleGroup.orientation = "row";
        angleGroup.add("statictext", undefined, "Góc xoay:");
        var angleInput = angleGroup.add("edittext", undefined, "30");
        angleInput.characters = 5;

        var cloneGroup = panel.add("group");
        cloneGroup.orientation = "row";
        cloneGroup.add("statictext", undefined, "Số layer đúp:");
        var cloneInput = cloneGroup.add("edittext", undefined, "5");
        cloneInput.characters = 5;

        var normalizeGroup = panel.add("group");
        normalizeGroup.orientation = "row";
        var normalizeCheckbox = normalizeGroup.add("checkbox", undefined, "Normalize");

        var mode3DGroup = panel.add("group");
        mode3DGroup.orientation = "row";
        var mode3DCheckbox = mode3DGroup.add("checkbox", undefined, "3D");

        var axisGroup = panel.add("group");
        axisGroup.orientation = "row";
        axisGroup.alignChildren = "left";
        axisGroup.add("statictext", undefined, "Trục:");
        var axisX = axisGroup.add("radiobutton", undefined, "X");
        var axisY = axisGroup.add("radiobutton", undefined, "Y");
        var axisZ = axisGroup.add("radiobutton", undefined, "Z");
        axisX.value = true;
        axisGroup.visible = false;

        mode3DCheckbox.onClick = function () {
            axisGroup.visible = mode3DCheckbox.value;
        };

        var btnGroup = panel.add("group");
        btnGroup.orientation = "row";
        btnGroup.alignment = "left";

        var cloneBtn = btnGroup.add("button", undefined, "Clone");
        cloneBtn.preferredSize.width = 90;
        try {
            var g = cloneBtn.graphics;
            g.backgroundColor = g.newBrush(g.BrushType.SOLID_COLOR, [0.88, 0.88, 0.88]);
        } catch (e) {}

        var clearBtn = btnGroup.add("button", undefined, "Clear");
        clearBtn.preferredSize.width = 60;
        clearBtn.helpTip = "chọn pivot null và ấn Clear để Un-clone";

        // --- BẮT ĐẦU ĐOẠN MỚI THÊM VÀO ---
        var cloneMoreBtn = btnGroup.add("button", undefined, "+ Clone");
        cloneMoreBtn.preferredSize.width = 60;
        cloneMoreBtn.helpTip = "Chọn Pivot Null và ấn để thêm clone nối tiếp";
        var cloneMoreInput = btnGroup.add("edittext", undefined, "3");
        cloneMoreInput.characters = 2;

        // --- KẾT THÚC ĐOẠN MỚI THÊM VÀO ---

        var helpBtn = btnGroup.add("button", undefined, "?");
        helpBtn.maximumSize.width = 25;
        helpBtn.onClick = function () {
            alert(
                "HƯỚNG DẪN SỬ DỤNG:\n" +
                "- Clone: Chọn Null Layer (tâm xoay) và Layer muốn đúp. Nhập góc và số lượng.\n" +
                "- Clear: Chọn Pivot Null đã tạo và bấm Clear để trả lại Layer gốc và giữ lại Pivot.\n\n" +
                "TUỲ CHỌN:\n" +
                "- Normalize: Layer clone giữ nguyên góc vói mặt đất (hiệu ứng đu quay).\n" +
                "- 3D: Dùng cho không gian 3D, cho phép chọn trục xoay."
            );
        };

        var footerGroup = panel.add("group");
        footerGroup.add("statictext", undefined, "Một plugin bởi trongph.animation");

        function uniqueName(comp, base) {
            var name = base, i = 1;
            while (comp.layer(name)) {
                name = base + "-" + i++;
            }
            return name;
        }

        function ensureControl(layer, name, type, defaultValue) {
            var fx = layer.property("Effects");
            if (!fx.property(name)) {
                var ctrl = fx.addProperty(type);
                ctrl.name = name;
                if (type === "ADBE Angle Control") {
                    ctrl.property("Angle").setValue(defaultValue);
                } else {
                    ctrl.property("Slider").setValue(defaultValue);
                }
            }
        }

        function centerAnchorPoint(layer, t) {
            try {
                var r = layer.sourceRectAtTime(t, false);
                layer.anchorPoint.setValue([r.left + r.width / 2, r.top + r.height / 2]);
            } catch (e) {
                if (layer.width && layer.height) {
                    layer.anchorPoint.setValue([layer.width / 2, layer.height / 2]);
                }
            }
        }
        
        function setLockedIndex(layer, idx) {
            var fx = layer.property("Effects");
            var ctrl = fx.property("Clone Index");
            if (!ctrl) {
                ctrl = fx.addProperty("ADBE Slider Control");
                ctrl.name = "Clone Index";
            }
            ctrl.property("Slider").expression = idx.toString();
        }

        // --- CLEAR BUTTON LOGIC ---
        clearBtn.onClick = function () {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                alert("Hãy chọn một Composition.");
                return;
            }

            var sel = comp.selectedLayers;
            if (sel.length === 0) {
                alert("Vui lòng chọn Pivot Null để Clear hệ thống.");
                return;
            }

            // --- BẮT ĐẦU ĐOẠN MỚI THÊM VÀO ---
            // Kiểm tra xem trong các layer đang chọn có chứa string "Pivot Null" không
            var isPivotNull = true;
            for (var m = 0; m < sel.length; m++) {
                if (sel[m].name.indexOf("Pivot Null") === -1) {
                    isPivotNull = false;
                    break;
                }
            }

            // Nếu phát hiện layer lạ, hiện bảng confirm
            if (!isPivotNull) {
                var proceed = confirm("Bạn đang chọn layer không phải pivot null tổng, bạn vẫn muốn tiếp tục thao tác?");
                if (!proceed) return; // Nếu người dùng chọn Cancel/No, dừng hàm tại đây
            }
            // --- KẾT THÚC ĐOẠN MỚI THÊM VÀO ---

            app.beginUndoGroup("Clear Cloooner");

            try {
                for (var k = 0; k < sel.length; k++) {
                    var pivot = sel[k];
                    var rotators = [];
                    var kidsToRemove = [];
                    var keptKid = null;

                    // 1. Tìm các Null phụ đang link vào Pivot
                    for (var i = 1; i <= comp.numLayers; i++) {
                        var layer = comp.layer(i);
                        if (layer.parent === pivot) {
                            rotators.push(layer);
                        }
                    }

                    // 2. Phân loại layer gốc và clone
                    for (var i = 0; i < rotators.length; i++) {
                        var rot = rotators[i];
                        for (var j = 1; j <= comp.numLayers; j++) {
                            var layer = comp.layer(j);
                            if (layer.parent === rot) {
                                if (!keptKid && layer.name.indexOf("1. ") === 0) {
                                    keptKid = layer;
                                } else {
                                    kidsToRemove.push(layer);
                                }
                            }
                        }
                    }
                    
                    if (!keptKid && rotators.length > 0) {
                        for (var i = 0; i < rotators.length; i++) {
                            var rot = rotators[i];
                            for (var j = 1; j <= comp.numLayers; j++) {
                                if (comp.layer(j).parent === rot) {
                                    keptKid = comp.layer(j);
                                    break;
                                }
                            }
                            if (keptKid) break;
                        }
                    }

                    // 3. Phục hồi layer gốc (Sử dụng try-catch bảo vệ 100%)
                    if (keptKid) {
                        keptKid.parent = null; 

                        // Gỡ Expression an toàn và Reset thông số
                        var propsToClear = ["Position", "Rotation", "X Rotation", "Y Rotation", "Z Rotation", "Scale", "Orientation"];
                        for(var p = 0; p < propsToClear.length; p++) {
                            try {
                                var prop = keptKid.property("Transform").property(propsToClear[p]);
                                if (prop) {
                                    if (prop.canSetExpression) {
                                        prop.expression = "";
                                    }
                                    // Reset giá trị về mặc định

                                    if (propsToClear[p] === "Orientation") {
                                        if (keptKid.threeDLayer) prop.setValue([0, 0, 0]);
                                    } else if (propsToClear[p].indexOf("Rotation") !== -1) {
                                        prop.setValue(0);
                                    }
                                }
                            } catch(e) {} // Lỗi ngầm sẽ bị bỏ qua
                        }

                        // Xoá Effect
                        try {
                            var fx = keptKid.property("Effects").property("Clone Index");
                            if (fx) fx.remove();
                        } catch(e) {}

                        // Sửa lại tên
                        keptKid.name = keptKid.name.replace(/^\d+\.\s/, "").replace(/\s-\sClone$/, "");
                    }

// 4. Xoá tàn dư an toàn
                    for (var i = 0; i < kidsToRemove.length; i++) {
                        try { kidsToRemove[i].remove(); } catch(e) {}
                    }
                    for (var i = 0; i < rotators.length; i++) {
                        try { rotators[i].remove(); } catch(e) {}
                    }

                    // --- BẮT ĐẦU ĐOẠN MỚI THÊM VÀO ---
                    // 5. Xoá toàn bộ Effect trên Pivot Null
                    try {
                        var pivotFx = pivot.property("Effects");
                        if (pivotFx) {
                            // Chạy vòng lặp ngược từ cuối lên để xoá effect không bị lệch index
                            for (var e = pivotFx.numProperties; e > 0; e--) {
                                pivotFx.property(e).remove();
                            }
                        }
                        // Xoá luôn expression ở trục xoay của Pivot Null (nếu có)
                        var propsToClearPivot = ["Rotation", "X Rotation", "Y Rotation", "Z Rotation"];
                        for(var p = 0; p < propsToClearPivot.length; p++) {
                            var prop = pivot.property("Transform").property(propsToClearPivot[p]);
                            if (prop && prop.canSetExpression) {
                                prop.expression = "";
                            }
                        }
                    } catch(e) {}
                    // --- KẾT THÚC ĐOẠN MỚI THÊM VÀO ---
                }
            } catch (error) {
                alert("Đã xảy ra lỗi khi Clear: " + error.toString());
            }

            app.endUndoGroup();
        };

        // --- CLONE BUTTON LOGIC ---
        cloneBtn.onClick = function () {
            var angle = parseFloat(angleInput.text);
            var totalClones = parseInt(cloneInput.text);
            var normalize = normalizeCheckbox.value;
            var make3D = mode3DCheckbox.value;

            if (isNaN(angle) || isNaN(totalClones) || totalClones < 1) {
                alert("Vui lòng nhập số hợp lệ.");
                return;
            }

            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                alert("Hãy chọn một Composition.");
                return;
            }

            var sel = comp.selectedLayers;
            if (sel.length !== 2) {
                alert("Chọn đúng 2 layer: đầu tiên là Null, sau đó là Layer muốn đúp.");
                return;
            }

            var parent = sel[0];
            var child = sel[1];
            if (!parent.nullLayer) {
                alert("Layer đầu tiên phải là Null Layer.");
                return;
            }

            // --- BẮT ĐẦU ĐOẠN MỚI THÊM VÀO ---
            // Ràng buộc kiểm tra 3D Layer
            if (make3D) {
                if (!parent.threeDLayer || !child.threeDLayer) {
                    alert("Cả hai layer pivot null và layer clone phải là 3D Layer.");
                    return;
                }
            }
            // --- KẾT THÚC ĐOẠN MỚI THÊM VÀO ---

            var baseLayerName = child.name;

            var axis = "Z";
            if (make3D) {
                if (axisX.value) axis = "X";
                else if (axisY.value) axis = "Y";
                else axis = "Z";
            }

            app.beginUndoGroup("Clone With Rotation");

            centerAnchorPoint(child, comp.time);

            var pivot = comp.layers.addNull();
            pivot.name = uniqueName(comp, "Pivot Null");
            pivot.label = 10;
            pivot.moveBefore(parent);
            pivot.threeDLayer = make3D;
            pivot.transform.position.setValue(parent.transform.position.value);

            // Đưa Total Clones lên đầu và khoá cứng bằng expression
            ensureControl(pivot, "Total Clones", "ADBE Slider Control", totalClones);
            pivot.property("Effects").property("Total Clones").property("Slider").expression = totalClones.toString();
            ensureControl(pivot, "Angle", "ADBE Angle Control", angle);
            ensureControl(pivot, "Radius Ratio", "ADBE Slider Control", 100);
            ensureControl(pivot, "Stagger", "ADBE Slider Control", 100);
            ensureControl(pivot, "Offset", "ADBE Angle Control", 0);

            // Gán expression cho thuộc tính Rotation của Pivot Null dựa theo trục đã chọn
            var pivotRotProp = make3D ? (axis + " Rotation") : "Rotation";
            if (pivot.property("Transform").property(pivotRotProp).canSetExpression) {
                pivot.property("Transform").property(pivotRotProp).expression = 'value + effect("Offset")("Angle");';
            }

            var rotators = [], children = [];
            var originalKid = null;

            for (var i = 0; i < totalClones; i++) {
                var rot = (i === 0) ? parent : parent.duplicate();
                var kid = (i === 0) ? child : child.duplicate();

                rot.name = (i + 1) + ". Null " + baseLayerName;
                kid.name = (i + 1) + ". " + baseLayerName + " - Clone";

                rot.parent = pivot;
                kid.parent = rot;

                rot.threeDLayer = kid.threeDLayer = make3D;
                
                setLockedIndex(rot, i);
                setLockedIndex(kid, i);

                // Gán thuộc tính góc xoay an toàn không sợ lỗi ngầm
                var rotPropName = make3D ? (axis + " Rotation") : "Rotation";
                rot.property("Transform").property(rotPropName).expression =
                    'ctrl = thisComp.layer("' + pivot.name + '").effect("Angle")("Angle");\n' +
                    'idx = effect("Clone Index")("Slider");\n' +
                    'ctrl * idx;';

                if (normalize) {
                    var aePropName = make3D ? axis.toLowerCase() + "Rotation" : "rotation";
                    kid.property("Transform").property(rotPropName).expression =
                        '-parent.transform.' + aePropName + ' - thisComp.layer("' + pivot.name + '").transform.' + aePropName + ';';
                }

                var nullPos = rot.transform.position.value;
                var clonePos = kid.transform.position.value;
                var dir = [
                    clonePos[0] - nullPos[0],
                    clonePos[1] - nullPos[1],
                    make3D ? (clonePos[2] - nullPos[2]) : 0
                ];
                var len = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2) + Math.pow(dir[2], 2));
                var norm = (len === 0) ? [0,0,0] : [dir[0] / len, dir[1] / len, dir[2] / len];

                var expr = ''
                    + 'ratio = thisComp.layer("' + pivot.name + '").effect("Radius Ratio")("Slider") / 100;\n'
                    + 'stagger = thisComp.layer("' + pivot.name + '").effect("Stagger")("Slider") / 100;\n'
                    + 'idx = effect("Clone Index")("Slider") + 1;\n'
                    + 'scale = Math.max(0, 1 - (1 - stagger) * idx);\n'
                    + 'dir = [' + norm[0] + ',' + norm[1] + ',' + norm[2] + '];\n'
                    + 'parent.position + [dir[0] * ' + len.toFixed(4) + ' * ratio * scale, dir[1] * ' + len.toFixed(4) + ' * ratio * scale, dir[2] * ' + len.toFixed(4) + ' * ratio * scale];';

                kid.transform.position.expression = expr;

                if (i !== 0) centerAnchorPoint(kid, comp.time);
                else originalKid = kid;

                rotators.push(rot);
                children.push(kid);
            }

            if (children.length > 1 && originalKid) {
                originalKid.moveBefore(children[1]);
            }

            rotators.forEach(function (r) { r.shy = true; });
            pivot.shy = false;
            comp.hideShyLayers = true;

            app.endUndoGroup();
        };

        if (panel instanceof Window) {
            panel.center();
            panel.show();
        } else {
            panel.layout.layout(true);
        }


// --- CLONE MORE BUTTON LOGIC ---
        cloneMoreBtn.onClick = function () {
            var addCount = parseInt(cloneMoreInput.text);
            if (isNaN(addCount) || addCount < 1) {
                alert("Vui lòng nhập số lượng clone thêm hợp lệ.");
                return;
            }

            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                alert("Hãy chọn một Composition.");
                return;
            }

            var sel = comp.selectedLayers;
            if (sel.length !== 1) {
                alert("Vui lòng chỉ CHỌN 1 PIVOT NULL để thêm Clone.");
                return;
            }

            var pivot = sel[0];
            
            // Validate: Cảnh báo nếu chọn sai layer (giống nút Clear)
            if (pivot.name.indexOf("Pivot Null") === -1) {
                var proceed = confirm("Bạn đang chọn layer không có tên Pivot Null, bạn có chắc đây là Pivot Null và muốn tiếp tục?");
                if (!proceed) return;
            }

            // Lấy thông số Total Clones hiện tại
            var pivotFx = pivot.property("Effects");
            var totalClonesCtrl = pivotFx ? pivotFx.property("Total Clones") : null;

            if (!totalClonesCtrl) {
                alert("Không tìm thấy thông số 'Total Clones' trên layer này. Có vẻ nó không phải là Pivot Null chuẩn hoặc được tạo từ phiên bản code cũ.");
                return;
            }

            app.beginUndoGroup("Clone More");

            try {
                // Đọc ra số lượng clone hiện tại đang có
                var currentTotal = parseInt(totalClonesCtrl.property("Slider").value);

                // Đi tìm một cặp Rotator - Clone Layer đang có sẵn làm mẫu để Duplicate
                var sampleRot = null;
                var sampleKid = null;

                for (var i = 1; i <= comp.numLayers; i++) {
                    var l = comp.layer(i);
                    if (l.parent === pivot) {
                        sampleRot = l;
                        break;
                    }
                }

                if (sampleRot) {
                    for (var j = 1; j <= comp.numLayers; j++) {
                        var l = comp.layer(j);
                        if (l.parent === sampleRot) {
                            sampleKid = l;
                            break;
                        }
                    }
                }

                if (!sampleRot || !sampleKid) {
                    alert("Lỗi: Không tìm thấy layer Clone mẫu nào trong Pivot này để nhân bản.");
                    app.endUndoGroup();
                    return;
                }

                // Lấy ra Tên gốc của layer để đặt tên cho layer mới
                var baseLayerName = sampleKid.name.replace(/^\d+\.\s/, "").replace(/\s-\sClone$/, "");
                

                // Tìm Rotator và Clone Layer CUỐI CÙNG (có index lớn nhất) làm mẫu và làm mốc vị trí
                var sampleRot = null;
                var sampleKid = null;

                for (var i = 1; i <= comp.numLayers; i++) {
                    var l = comp.layer(i);
                    if (l.parent === pivot) {
                        var fx = l.property("Effects").property("Clone Index");
                        // Tìm layer có index = currentTotal - 1 (vì index bắt đầu từ 0)
                        if (fx && parseInt(fx.property("Slider").value) === currentTotal - 1) {
                            sampleRot = l;
                            break;
                        }
                    }
                }

                if (sampleRot) {
                    for (var j = 1; j <= comp.numLayers; j++) {
                        var l = comp.layer(j);
                        if (l.parent === sampleRot) {
                            sampleKid = l;
                            break;
                        }
                    }
                }

                if (!sampleRot || !sampleKid) {
                    alert("Lỗi: Không tìm thấy layer Clone cuối cùng trong Pivot này để nhân bản.");
                    app.endUndoGroup();
                    return;
                }

                var baseLayerName = sampleKid.name.replace(/^\d+\.\s/, "").replace(/\s-\sClone$/, "");

                // Khởi tạo biến lưu mốc vị trí để dịch chuyển layer
                var currentRotPlacement = sampleRot;
                var currentKidPlacement = sampleKid;

                for (var i = currentTotal; i < currentTotal + addCount; i++) {
                    var newRot = sampleRot.duplicate();
                    var newKid = sampleKid.duplicate();

                    newRot.name = (i + 1) + ". Null " + baseLayerName;
                    newKid.name = (i + 1) + ". " + baseLayerName + " - Clone";

                    newRot.parent = pivot;
                    newKid.parent = newRot;

                    setLockedIndex(newRot, i);
                    setLockedIndex(newKid, i);

                    newRot.shy = true;

                    // --- SẮP XẾP LẠI VỊ TRÍ TRÊN TIMELINE ---
                    // Dịch layer mới xuống ngay dưới mốc vị trí hiện tại
                    newRot.moveAfter(currentRotPlacement);
                    newKid.moveAfter(currentKidPlacement);

                    // Cập nhật lại mốc vị trí cho vòng lặp tiếp theo
                    currentRotPlacement = newRot;
                    currentKidPlacement = newKid;
                }

                // Cập nhật lại số Total Clones bằng cách ghi đè expression mới
                totalClonesCtrl.property("Slider").expression = (currentTotal + addCount).toString();   

                comp.hideShyLayers = true;

            } catch (error) {
                alert("Đã xảy ra lỗi khi Clone More: " + error.toString());
            }

            app.endUndoGroup();
        };

        return panel;
    }

    var myPanel = buildUI(thisObj);
})(this);