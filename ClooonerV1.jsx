(function (thisObj) {
    function buildUI(thisObj) {
        var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Cloooner", undefined, {resizeable: true});
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.spacing = 10;
        panel.margins = 16;

// --- TẠO TAB PANEL ---
        var tpanel = panel.add("tabbedpanel");
        tpanel.alignChildren = ["fill", "top"];

        // === TAB 1: TĨNH ===
        var tabTinh = tpanel.add("tab", undefined, "Tĩnh");
        tabTinh.orientation = "column";
        tabTinh.alignChildren = ["center", "top"];
        tabTinh.spacing = 12;
        tabTinh.margins = 10;

        var tinhMasterGroup = tabTinh.add("group");
        tinhMasterGroup.orientation = "column";
        tinhMasterGroup.alignChildren = ["center", "top"];
        tinhMasterGroup.spacing = 6;
        tinhMasterGroup.add("statictext", undefined, "Số Layer Đúp:");

        var tinhGroup = tinhMasterGroup.add("group");
        tinhGroup.orientation = "row";
        var tinhMinus = tinhGroup.add("button", undefined, "-"); // Nút Trừ lên trước
        tinhMinus.preferredSize = [25, 25];
        var tinhInput = tinhGroup.add("edittext", undefined, "1");
        tinhInput.preferredSize = [40, 25];
        var tinhPlus = tinhGroup.add("button", undefined, "+"); // Nút Cộng xuống sau
        tinhPlus.preferredSize = [25, 25];

        // === TAB 2: TRÒN ===
        var tabTron = tpanel.add("tab", undefined, "Tròn");
        tabTron.orientation = "column";
        tabTron.alignChildren = ["center", "top"]; 
        tabTron.spacing = 12;
        tabTron.margins = 10;

        var angleGroup = tabTron.add("group");
        angleGroup.orientation = "row";
        angleGroup.add("statictext", undefined, "Góc xoay:");
        var angleInput = angleGroup.add("edittext", undefined, "30");
        angleInput.preferredSize = [40, 25];

        var sepTron1 = tabTron.add("panel");
        sepTron1.alignment = "fill";
        sepTron1.minimumSize.height = 2;

        var cloneMasterGroup = tabTron.add("group");
        cloneMasterGroup.orientation = "column";
        cloneMasterGroup.alignChildren = ["center", "top"];
        cloneMasterGroup.spacing = 6;
        cloneMasterGroup.add("statictext", undefined, "Số layer đúp:");

        var cloneGroup = cloneMasterGroup.add("group");
        cloneGroup.orientation = "row";
        var cloneMinus = cloneGroup.add("button", undefined, "-");
        cloneMinus.preferredSize = [25, 25];
        var cloneInput = cloneGroup.add("edittext", undefined, "5");
        cloneInput.preferredSize = [40, 25];
        var clonePlus = cloneGroup.add("button", undefined, "+");
        clonePlus.preferredSize = [25, 25];

        var sepTron2 = tabTron.add("panel");
        sepTron2.alignment = "fill";
        sepTron2.minimumSize.height = 2;

        var normalizeGroup = tabTron.add("group");
        normalizeGroup.orientation = "row";
        var normalizeCheckbox = normalizeGroup.add("checkbox", undefined, "Không xoay");

        var mode3DGroup = tabTron.add("group");
        mode3DGroup.orientation = "row";
        var mode3DCheckbox = mode3DGroup.add("checkbox", undefined, "3D Mode");

        var axisGroup = tabTron.add("group");
        axisGroup.orientation = "row";
        axisGroup.alignChildren = "center";
        axisGroup.add("statictext", undefined, "Trục:");
        var axisX = axisGroup.add("radiobutton", undefined, "X");
        var axisY = axisGroup.add("radiobutton", undefined, "Y");
        var axisZ = axisGroup.add("radiobutton", undefined, "Z");
        axisX.value = true;
        axisGroup.visible = false;

        mode3DCheckbox.onClick = function () {
            axisGroup.visible = mode3DCheckbox.value;
        };

        var sepTron3 = tabTron.add("panel");
        sepTron3.alignment = "fill";
        sepTron3.minimumSize.height = 2;

        // Cụm Clone thêm (Đã được chuyển vào tab Tròn)
        var cloneMoreGroup = tabTron.add("group");
        cloneMoreGroup.orientation = "row";
        var cloneMoreMinus = cloneMoreGroup.add("button", undefined, "-");
        cloneMoreMinus.preferredSize = [25, 25];
        var cloneMoreInput = cloneMoreGroup.add("edittext", undefined, "3");
        cloneMoreInput.preferredSize = [40, 25];
        var cloneMorePlus = cloneMoreGroup.add("button", undefined, "+");
        cloneMorePlus.preferredSize = [25, 25];
        var cloneMoreBtn = cloneMoreGroup.add("button", undefined, "Clooon thêm");
        cloneMoreBtn.preferredSize.height = 25;

        // === TAB 3: PATH ===
        var tabPath = tpanel.add("tab", undefined, "Path");
        tabPath.orientation = "column";
        tabPath.alignChildren = ["center", "top"];
        tabPath.spacing = 12;
        tabPath.margins = 10;

        var pathCloneMasterGroup = tabPath.add("group");
        pathCloneMasterGroup.orientation = "column";
        pathCloneMasterGroup.alignChildren = ["center", "top"];
        pathCloneMasterGroup.spacing = 6;
        pathCloneMasterGroup.add("statictext", undefined, "Số layer đúp:");

        var pathCloneGroup = pathCloneMasterGroup.add("group");
        pathCloneGroup.orientation = "row";
        var pathCloneMinus = pathCloneGroup.add("button", undefined, "-");
        pathCloneMinus.preferredSize = [25, 25];
        var pathCloneInput = pathCloneGroup.add("edittext", undefined, "5");
        pathCloneInput.preferredSize = [40, 25];
        var pathClonePlus = pathCloneGroup.add("button", undefined, "+");
        pathClonePlus.preferredSize = [25, 25];

        var sepPath1 = tabPath.add("panel");
        sepPath1.alignment = "fill";
        sepPath1.minimumSize.height = 2;

        var pathDistMasterGroup = tabPath.add("group");
        pathDistMasterGroup.orientation = "column";
        pathDistMasterGroup.alignChildren = ["center", "top"];
        pathDistMasterGroup.spacing = 6;
        pathDistMasterGroup.add("statictext", undefined, "Khoảng cách (%):");

        var pathDistGroup = pathDistMasterGroup.add("group");
        pathDistGroup.orientation = "row";
        var pathDistMinus = pathDistGroup.add("button", undefined, "-");
        pathDistMinus.preferredSize = [25, 25];
        var pathDistInput = pathDistGroup.add("edittext", undefined, "5");
        pathDistInput.preferredSize = [40, 25];
        var pathDistPlus = pathDistGroup.add("button", undefined, "+");
        pathDistPlus.preferredSize = [25, 25];

        // === PHẦN CHUNG (LUÔN HIỂN THỊ BÊN DƯỚI CÁC TAB) ===
        var bottomGroup = panel.add("group");
        bottomGroup.orientation = "column";
        bottomGroup.alignChildren = ["center", "top"]; 
        bottomGroup.alignment = ["fill", "top"];
        bottomGroup.spacing = 10;
        bottomGroup.margins = [0, 5, 0, 0];

        // Thêm Checkbox True Clone
        var trueCloneGroup = bottomGroup.add("group");
        trueCloneGroup.alignment = "left";
        var trueCloneCheckbox = trueCloneGroup.add("checkbox", undefined, "True Clone (Đúp comp tận gốc)");

        var sepBottom = bottomGroup.add("panel");
        sepBottom.alignment = "fill";
        sepBottom.minimumSize.height = 2;

        var btnGroup = bottomGroup.add("group");
        btnGroup.orientation = "row";
        btnGroup.alignment = "fill"; 

        var cloneBtn = btnGroup.add("button", undefined, "Cloooner");
        cloneBtn.alignment = ["fill", "center"]; 
        cloneBtn.preferredSize.height = 30;

        var clearBtn = btnGroup.add("button", undefined, "🗑");
        clearBtn.preferredSize = [30, 30]; 
        clearBtn.helpTip = "Chọn Pivot Null và ấn Clear để Un-clone";

        var footerGroup = bottomGroup.add("group");
        footerGroup.orientation = "row";
        footerGroup.alignChildren = ["center", "center"];
        footerGroup.margins = [0, 5, 0, 0]; 
        footerGroup.add("statictext", undefined, "Một chiếc plugin bởi Trọng");
        
        var helpBtn = footerGroup.add("button", undefined, "?");
        helpBtn.preferredSize = [20, 20]; 
        helpBtn.helpTip = "Xem hướng dẫn sử dụng";
        helpBtn.onClick = function () {
            alert("Hướng dẫn đã được rút gọn để code ngắn lại..."); // Giữ nguyên hàm alert cũ của bạn ở đây
        };

        function setupPlusMinus(btnP, btnM, inp, minV) {
            btnP.onClick = function() {
                var v = parseInt(inp.text) || 0;
                inp.text = (v + 1).toString();
            };
            btnM.onClick = function() {
                var v = parseInt(inp.text) || 0;
                if (v - 1 >= minV) inp.text = (v - 1).toString();
                else inp.text = minV.toString();
            };
        }

        setupPlusMinus(tinhPlus, tinhMinus, tinhInput, 1);
        setupPlusMinus(clonePlus, cloneMinus, cloneInput, 1);
        setupPlusMinus(cloneMorePlus, cloneMoreMinus, cloneMoreInput, 1);
        setupPlusMinus(pathClonePlus, pathCloneMinus, pathCloneInput, 1);
        setupPlusMinus(pathDistPlus, pathDistMinus, pathDistInput, -100);

/////////////////////////////////////// DONE UI LAYOUT
// Helpers
        // --- TRUE CLONE ENGINE ---
        var tc_sourceArr = [];
        var tc_newSourceArr = [];

        function checkSourceForInstances(tmpSource) {
            for (var i = 0; i < tc_sourceArr.length; i++) {
                if (tmpSource === tc_sourceArr[i]) return tc_newSourceArr[i];
            }
            return false;
        }

        function digDup(tmpLayer) {
            var newSource = tmpLayer.source.duplicate();
            tc_sourceArr.push(tmpLayer.source);
            tc_newSourceArr.push(newSource);
            tmpLayer.replaceSource(newSource, true);

            for (var i = 1; i <= newSource.numLayers; i++) {
                if (newSource.layer(i).source instanceof CompItem) {
                    var exists = checkSourceForInstances(newSource.layer(i).source);
                    if (!exists) {
                        digDup(newSource.layer(i));
                    } else {
                        newSource.layer(i).replaceSource(exists, true);
                    }
                }
            }
            return newSource;
        }

        function applyTrueClone(layer) {
            if (!layer.source || !(layer.source instanceof CompItem)) return false;
            
            tc_sourceArr = [];
            tc_newSourceArr = [];
            var newMasterComp = digDup(layer);

            // Tìm hoặc tạo folder Clooooner
            var items = app.project.items;
            var folder = null;
            for (var i = 1; i <= items.length; i++) {
                if (items[i] instanceof FolderItem && items[i].name === "Clooooner") {
                    folder = items[i];
                    break;
                }
            }
            if (!folder) folder = app.project.items.addFolder("Clooooner");
            
            newMasterComp.parentFolder = folder;
            return true;
        }

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
            var activeTab = tpanel.selection.text;
            var comp = app.project.activeItem;

            if (!(comp instanceof CompItem)) {
                alert("Hãy chọn một Composition.");
                return;
            }

            var sel = comp.selectedLayers;

            // ==========================================
            // LOGIC CHO TAB: TĨNH (TRUE DELETE COMPS)
            // ==========================================
            if (activeTab === "Tĩnh") {
                if (sel.length === 0) {
                    alert("Hãy chọn ít nhất 1 layer để xoá.");
                    return;
                }

                // Lọc ra chỉ lấy các Layer đang là Comp
                var selectedComps = [];
                for (var i = 0; i < sel.length; i++) {
                    if (sel[i].source && sel[i].source instanceof CompItem) {
                        selectedComps.push(sel[i].source);
                    }
                }

                var n = selectedComps.length;
                if (n === 0) {
                    alert("Không có Comp nào được chọn. Tính năng xoá tận gốc chỉ áp dụng cho Comp Layer.");
                    return;
                }

                // Cảnh báo Xác nhận
                var proceed = confirm("Bạn sắp Xoá tận gốc " + n + " Comp. Bạn có chắc chắn muốn tiếp tục?");
                if (!proceed) return;

                app.beginUndoGroup("True Delete Comps");
                try {
                    var compsToDelete = [];

                    // Hàm đệ quy tìm tất cả các comp con ẩn bên trong
                    function getNestedComps(compItem) {
                        for (var c = 1; c <= compItem.numLayers; c++) {
                            if (compItem.layer(c).source && compItem.layer(c).source instanceof CompItem) {
                                var childComp = compItem.layer(c).source;
                                var exists = false;
                                for (var k = 0; k < compsToDelete.length; k++) {
                                    if (compsToDelete[k] === childComp) { exists = true; break; }
                                }
                                if (!exists) {
                                    compsToDelete.push(childComp);
                                    getNestedComps(childComp); // Đệ quy chui tiếp vào comp cháu chắt
                                }
                            }
                        }
                    }

                    // Gom mọi comp (từ gốc đến ngọn) vào 1 danh sách tử thần
                    for (var i = 0; i < selectedComps.length; i++) {
                        var mainComp = selectedComps[i];
                        var exists = false;
                        for (var k = 0; k < compsToDelete.length; k++) {
                            if (compsToDelete[k] === mainComp) { exists = true; break; }
                        }
                        if (!exists) {
                            compsToDelete.push(mainComp);
                            getNestedComps(mainComp);
                        }
                    }

                    // Tiêu diệt toàn bộ từ Project Panel (Các layer trên Timeline cũng sẽ bốc hơi theo)
                    for (var i = 0; i < compsToDelete.length; i++) {
                        compsToDelete[i].remove();
                    }
                } catch (error) {
                    alert("Lỗi khi True Delete: " + error.toString());
                }
                app.endUndoGroup();
                return;
            }

            // ==========================================
            // LOGIC CHO TAB: TRÒN (CLEAR RIG CŨ)
            // ==========================================
            // Áp dụng chung logic tháo Rig cho cả Tab Tròn và Tab Path
            if (activeTab === "Tròn" || activeTab === "Path") {
                if (sel.length === 0) {
                    alert("Vui lòng chọn Pivot Null để Clear hệ thống.");
                    return;
                }

                app.beginUndoGroup("Clear Cloooner");
                try {
                    for (var k = 0; k < sel.length; k++) {
                        var pivot = sel[k];
                        var rotators = [];
                        var kidsToRemove = [];
                        var keptKid = null;

                        for (var i = 1; i <= comp.numLayers; i++) {
                            var layer = comp.layer(i);
                            if (layer.parent === pivot) {
                                rotators.push(layer);
                            }
                        }

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

                        if (keptKid) {
                            keptKid.parent = null; 
                            var propsToClear = ["Position", "Rotation", "X Rotation", "Y Rotation", "Z Rotation", "Scale", "Orientation"];
                            for(var p = 0; p < propsToClear.length; p++) {
                                try {
                                    var prop = keptKid.property("Transform").property(propsToClear[p]);
                                    if (prop) {
                                        if (prop.canSetExpression) prop.expression = "";
                                        if (propsToClear[p] === "Orientation") {
                                            if (keptKid.threeDLayer) prop.setValue([0, 0, 0]);
                                        } else if (propsToClear[p].indexOf("Rotation") !== -1) {
                                            prop.setValue(0);
                                        }
                                    }
                                } catch(e) {} 
                            }
                            try {
                                var fx = keptKid.property("Effects").property("Clone Index");
                                if (fx) fx.remove();
                                var fxPath = keptKid.property("Effects").property("Path Position");
                                if (fxPath) fxPath.remove();
                            } catch(e) {}
                            keptKid.name = keptKid.name.replace(/^\d+\.\s/, "").replace(/\s-\sClone$/, "");
                        }

                        for (var i = 0; i < kidsToRemove.length; i++) {
                            try { kidsToRemove[i].remove(); } catch(e) {}
                        }
                        for (var i = 0; i < rotators.length; i++) {
                            try { rotators[i].remove(); } catch(e) {}
                        }

                        try {
                            var pivotFx = pivot.property("Effects");
                            if (pivotFx) {
                                for (var e = pivotFx.numProperties; e > 0; e--) {
                                    pivotFx.property(e).remove();
                                }
                            }
                            var propsToClearPivot = ["Rotation", "X Rotation", "Y Rotation", "Z Rotation"];
                            for(var p = 0; p < propsToClearPivot.length; p++) {
                                var prop = pivot.property("Transform").property(propsToClearPivot[p]);
                                if (prop && prop.canSetExpression) prop.expression = "";
                            }
                        } catch(e) {}
                    }
                } catch (error) {
                    alert("Đã xảy ra lỗi khi Clear: " + error.toString());
                }
                app.endUndoGroup();
            }
        };

        // --- CLONE BUTTON LOGIC ---

        cloneBtn.onClick = function () {
            var activeTab = tpanel.selection.text;
            var isTrueClone = trueCloneCheckbox.value;
            var comp = app.project.activeItem;

            if (!(comp instanceof CompItem)) {
                alert("Hãy chọn một Composition.");
                return;
            }

            // ==========================================
            // LOGIC CHO TAB: TĨNH
            // ==========================================
            if (activeTab === "Tĩnh") {
                var sel = comp.selectedLayers;
                if (sel.length === 0) {
                    alert("Hãy chọn ít nhất 1 layer để đúp tĩnh.");
                    return;
                }
                var dupCount = parseInt(tinhInput.text);
                if (isNaN(dupCount) || dupCount < 1) return;

                if (isTrueClone) {
                    var proceed = confirm("Bạn sắp Clone tận gốc " + dupCount + " lần. Bạn có muốn tiếp tục?");
                    if (!proceed) return;
                }

                app.beginUndoGroup("Static Cloooner");
                try {
                    for (var s = 0; s < sel.length; s++) {
                        var targetLayer = sel[s];
                        for (var i = 0; i < dupCount; i++) {
                            var newLayer = targetLayer.duplicate();
                            // Nếu check True Clone và layer đó là comp
                            if (isTrueClone) applyTrueClone(newLayer);
                        }
                    }
                } catch(e) { alert(e); }
                app.endUndoGroup();
                return;
            }

            // ==========================================
            // LOGIC CHO TAB: TRÒN
            // ==========================================
            if (activeTab === "Tròn") {
                var angle = parseFloat(angleInput.text);
                var totalClones = parseInt(cloneInput.text);
                var normalize = normalizeCheckbox.value;
                var make3D = mode3DCheckbox.value;

                if (isNaN(angle) || isNaN(totalClones) || totalClones < 1) {
                    alert("Vui lòng nhập số hợp lệ.");
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

                if (make3D && (!parent.threeDLayer || !child.threeDLayer)) {
                    alert("Cả hai layer pivot null và layer clone phải là 3D Layer.");
                    return;
                }

                // --- THÊM CẢNH BÁO TRUE CLONE Ở ĐÂY ---
                var baseLayerName = child.name;
                var axis = "Z";
                if (make3D) {
                    if (axisX.value) axis = "X";
                    else if (axisY.value) axis = "Y";
                    else axis = "Z";
                }
                // --- THÊM CẢNH BÁO TRUE CLONE (CẬP NHẬT CHI TIẾT ĐẦY ĐỦ NHẤT) ---
                if (isTrueClone) {
                    var axisText = make3D ? (" theo trục " + axis) : ""; 
                    // Kiểm tra biến normalize (checkbox Không xoay) để đổi chữ
                    var rotateText = normalize ? "- Layer clone KHÔNG bị xoay theo" : "- Layer clone CÓ xoay theo tâm";
                    
                    var confirmMsg = "Bạn sắp Clone tận gốc " + totalClones + " lần theo hình tròn\n" +
                                     "- Cách nhau " + angle + " độ\n" +
                                     "- Xoay quanh \"" + parent.name + "\"" + axisText + "\n" +
                                     rotateText + "\n\n" +
                                     "Bạn có chắc chắn muốn tiếp tục?";
                                     
                    var proceed = confirm(confirmMsg);
                    if (!proceed) return;
                }

                app.beginUndoGroup("Clone With Rotation");


                centerAnchorPoint(child, comp.time);

                var pivot = comp.layers.addNull();
                pivot.name = uniqueName(comp, "Pivot Null");
                pivot.label = 10;
                pivot.moveBefore(parent);
                pivot.threeDLayer = make3D;
                pivot.transform.position.setValue(parent.transform.position.value);

                ensureControl(pivot, "Total Clones", "ADBE Slider Control", totalClones);
                pivot.property("Effects").property("Total Clones").property("Slider").expression = totalClones.toString();
                ensureControl(pivot, "Angle", "ADBE Angle Control", angle);
                ensureControl(pivot, "Radius Ratio", "ADBE Slider Control", 100);
                ensureControl(pivot, "Stagger", "ADBE Slider Control", 100);
                ensureControl(pivot, "Offset", "ADBE Angle Control", 0);

                var pivotRotProp = make3D ? (axis + " Rotation") : "Rotation";
                if (pivot.property("Transform").property(pivotRotProp).canSetExpression) {
                    pivot.property("Transform").property(pivotRotProp).expression = 'value + effect("Offset")("Angle");';
                }

                var rotators = [], children = [];
                var originalKid = null;

                for (var i = 0; i < totalClones; i++) {
                    var rot = (i === 0) ? parent : parent.duplicate();
                    var kid = (i === 0) ? child : child.duplicate();

                    // ÁP DỤNG TRUE CLONE TẠI ĐÂY NẾU ĐƯỢC CHECK
                    if (isTrueClone) applyTrueClone(kid);

                    rot.name = (i + 1) + ". Null " + baseLayerName;
                    kid.name = (i + 1) + ". " + baseLayerName + " - Clone";

                    rot.parent = pivot;
                    kid.parent = rot;

                    rot.threeDLayer = kid.threeDLayer = make3D;
                    
                    setLockedIndex(rot, i);
                    setLockedIndex(kid, i);

                    var rotPropName = make3D ? (axis + " Rotation") : "Rotation";
                    rot.property("Transform").property(rotPropName).expression =
                        'ctrl = thisComp.layer("' + pivot.name + '").effect("Angle")("Angle");\n' +
                        'idx = effect("Clone Index")("Slider");\n' +
                        'value + (ctrl * idx);'; // Đã thêm value +

                    if (normalize) {
                        var aePropName = make3D ? axis.toLowerCase() + "Rotation" : "rotation";
                        kid.property("Transform").property(rotPropName).expression =
                            'value + (-parent.transform.' + aePropName + ' - thisComp.layer("' + pivot.name + '").transform.' + aePropName + ');'; // Đã thêm value + và gom cụm toán học vào ngoặc đơn
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
            }


            // ==========================================
            // LOGIC CHO TAB: PATH
            // ==========================================
            if (activeTab === "Path") {
                var totalClones = parseInt(pathCloneInput.text);
                var distance = parseFloat(pathDistInput.text);

                if (isNaN(totalClones) || totalClones < 1 || isNaN(distance)) {
                    alert("Vui lòng nhập thông số hợp lệ.");
                    return;
                }

                var sel = comp.selectedLayers;
                if (sel.length !== 2) {
                    alert("Vui lòng CHỌN ĐÚNG 2 LAYER: 1 Shape Layer (chứa đường Path) và 1 Layer muốn đúp.");
                    return;
                }

                var shapeLayer = null;
                var child = null;

                // Tự động nhận diện đâu là Shape Layer để lấy đường dẫn
                if (sel[0] instanceof ShapeLayer) {
                    shapeLayer = sel[0];
                    child = sel[1];
                } else if (sel[1] instanceof ShapeLayer) {
                    shapeLayer = sel[1];
                    child = sel[0];
                } else {
                    alert("Ít nhất 1 trong 2 layer được chọn phải là Shape Layer (chứa đường Path).");
                    return;
                }

                if (isTrueClone) {
                    var proceed = confirm("Bạn sắp Clone tận gốc " + totalClones + " lần dọc theo Path của \"" + shapeLayer.name + "\".\n\nBạn có chắc chắn muốn tiếp tục?");
                    if (!proceed) return;
                }

                app.beginUndoGroup("Path Cloooner");

                try {
                    var baseLayerName = child.name;

                    var pivot = comp.layers.addNull();
                    // Đổi tên thành Clone on Path Control
                    pivot.name = uniqueName(comp, "Clone on Path Control");
                    pivot.label = 10;
                    pivot.moveBefore(shapeLayer);

                    // --- TẠO LAYER CONTROL CHO PATH ---
                    // Sử dụng "ADBE Layer Control" để tạo menu trỏ đến Layer
                    var pathLayerCtrl = pivot.property("Effects").addProperty("ADBE Layer Control");
                    pathLayerCtrl.name = "Path";
                    // Tự động set giá trị mặc định trỏ vào Shape Layer vừa chọn
                    pathLayerCtrl.property("Layer").setValue(shapeLayer.index); 

                    // Add Slider điều khiển tổng vào Pivot
                    ensureControl(pivot, "Total Clones", "ADBE Slider Control", totalClones);
                    pivot.property("Effects").property("Total Clones").property("Slider").expression = totalClones.toString();
                    ensureControl(pivot, "Distance", "ADBE Slider Control", distance);
                    ensureControl(pivot, "Offset", "ADBE Slider Control", 0);

                    var rotators = [], children = [];
                    var originalKid = null;

                    for (var i = 0; i < totalClones; i++) {
                        var rot = comp.layers.addNull(); 
                        var kid = (i === 0) ? child : child.duplicate();

                        if (isTrueClone) applyTrueClone(kid);

                        rot.name = (i + 1) + ". Null " + baseLayerName;
                        kid.name = (i + 1) + ". " + baseLayerName + " - Clone";

                        rot.parent = pivot;
                        kid.parent = rot;

                        // Null phụ được thả về trung tâm của Null tổng
                        rot.transform.position.setValue([0, 0, 0]);
                        kid.transform.position.setValue([0, 0, 0]);

                        setLockedIndex(rot, i);
                        setLockedIndex(kid, i);

                        ensureControl(rot, "Path Position", "ADBE Slider Control", 0);
                        ensureControl(kid, "Path Position", "ADBE Slider Control", 0);

                        // Xử lý toán học vòng lặp (0-100%) cho Path Position
                        var posExpr =
                            'offset = thisComp.layer("' + pivot.name + '").effect("Offset")("Slider");\n' +
                            'dist = thisComp.layer("' + pivot.name + '").effect("Distance")("Slider");\n' +
                            'idx = effect("Clone Index")("Slider");\n' +
                            'val = offset + (idx * dist);\n' +
                            'mod = val % 100;\n' +
                            'if (mod < 0) mod += 100;\n' +
                            'mod;';

                        rot.property("Effects").property("Path Position").property("Slider").expression = posExpr;
                        // Clone layer chỉ cần đọc theo % của Null mẹ nó
                        kid.property("Effects").property("Path Position").property("Slider").expression = 'thisComp.layer("' + rot.name + '").effect("Path Position")("Slider");';

                        // Gán Expression toạ độ vào Null phụ
                        // Đọc Layer Control "Path" từ Null tổng để linh hoạt thay đổi đường dẫn
                        var pathPositionExpr =
                            'try {\n' +
                            '  targetLayer = thisComp.layer("' + pivot.name + '").effect("Path")("Layer");\n' +
                            '  duongpath = targetLayer.content(1).content(1).path;\n' +
                            '  pct = effect("Path Position")("Slider") / 100;\n' +
                            '  pos = targetLayer.toComp(duongpath.pointOnPath(pct));\n' +
                            '  value + parent.fromComp(pos);\n' +
                            '} catch(e) { value; }';

                        rot.property("Transform").property("Position").expression = pathPositionExpr;

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

                } catch (e) {
                    alert("Lỗi khi tạo Path Cloooner: " + e.toString());
                }

                app.endUndoGroup();
            }

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
            
            if (pivot.name.indexOf("Pivot Null") === -1) {
                var proceed = confirm("Bạn đang chọn layer không có tên Pivot Null, bạn có chắc đây là Pivot Null và muốn tiếp tục?");
                if (!proceed) return;
            }

            var pivotFx = pivot.property("Effects");
            var totalClonesCtrl = pivotFx ? pivotFx.property("Total Clones") : null;

            if (!totalClonesCtrl) {
                alert("Không tìm thấy thông số 'Total Clones' trên layer này. Có vẻ nó không phải là Pivot Null chuẩn.");
                return;
            }

            // --- KIỂM TRA TRUE CLONE VÀ HIỆN CẢNH BÁO ---
            var isTrueClone = trueCloneCheckbox.value;
            if (isTrueClone) {
                var make3D = mode3DCheckbox.value;
                var axis = "Z";
                if (make3D) {
                    if (axisX.value) axis = "X";
                    else if (axisY.value) axis = "Y";
                    else axis = "Z";
                }
                var axisText = make3D ? (" theo trục " + axis) : ""; 
                var normalize = normalizeCheckbox.value;
                var rotateText = normalize ? "- Layer clone KHÔNG bị xoay theo" : "- Layer clone CÓ xoay theo tâm";
                
                // Lấy góc xoay trực tiếp từ Effect đang có trên Pivot Null (chính xác hơn đọc UI)
                var currentAngle = 0;
                try { currentAngle = pivotFx.property("Angle").property("Angle").value; } 
                catch(e) { currentAngle = parseFloat(angleInput.text); }
                
                var confirmMsg = "Bạn sắp Clone THÊM tận gốc " + addCount + " lần theo hình tròn\n" +
                                 "- Cách nhau " + currentAngle + " độ\n" +
                                 "- Xoay quanh \"" + pivot.name + "\"" + axisText + "\n" +
                                 rotateText + "\n\n" +
                                 "Bạn có chắc chắn muốn tiếp tục?";
                                 
                var proceedConfirm = confirm(confirmMsg);
                if (!proceedConfirm) return;
            }

            app.beginUndoGroup("Clone More");

            try {
                var currentTotal = parseInt(totalClonesCtrl.property("Slider").value);

                var sampleRot = null;
                var sampleKid = null;

                for (var i = 1; i <= comp.numLayers; i++) {
                    var l = comp.layer(i);
                    if (l.parent === pivot) {
                        var fx = l.property("Effects").property("Clone Index");
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

                var currentRotPlacement = sampleRot;
                var currentKidPlacement = sampleKid;

                for (var i = currentTotal; i < currentTotal + addCount; i++) {
                    var newRot = sampleRot.duplicate();
                    var newKid = sampleKid.duplicate();

                    // --- ÁP DỤNG TRUE CLONE TẠI ĐÂY NẾU ĐƯỢC TÍCH ---
                    if (isTrueClone) {
                        applyTrueClone(newKid);
                    }

                    newRot.name = (i + 1) + ". Null " + baseLayerName;
                    newKid.name = (i + 1) + ". " + baseLayerName + " - Clone";

                    newRot.parent = pivot;
                    newKid.parent = newRot;

                    setLockedIndex(newRot, i);
                    setLockedIndex(newKid, i);

                    newRot.shy = true;

                    newRot.moveAfter(currentRotPlacement);
                    newKid.moveAfter(currentKidPlacement);

                    currentRotPlacement = newRot;
                    currentKidPlacement = newKid;
                }

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