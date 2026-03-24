(function (thisObj) {
    function buildUI(thisObj) {
        var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Cloooner", undefined, {resizeable: true});
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.spacing = 10;
        panel.margins = 16;

// --- TẠO TAB PANEL ---
        // === LAYOUT NATIVE: CĂN GIỮA & STICKY BOTTOM (KHÔNG SCROLLBAR) ===
        panel.orientation = "column";
        panel.alignChildren = ["fill", "fill"]; 
        panel.spacing = 10;
        panel.margins = 16;

        // 1. Nhóm Top chứa Tabs (Sẽ dãn ra đẩy nhóm Bottom xuống đáy)
        var topGroup = panel.add("group");
        topGroup.orientation = "column";
        topGroup.alignment = ["fill", "fill"];
        topGroup.alignChildren = ["fill", "fill"]; // QUAN TRỌNG: Ép thẻ Tab bên trong phải dãn
        topGroup.margins = 0;

        // 2. Tab Panel bung tràn toàn bộ không gian của Nhóm Top
        var tpanel = topGroup.add("tabbedpanel");
        tpanel.alignment = ["fill", "fill"];
        tpanel.alignChildren = ["fill", "fill"]; // QUAN TRỌNG: Ép các tab con (Tĩnh, Tròn...) dãn theo
        tpanel.margins = 0;

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
        var tinhMinus = tinhGroup.add("button", undefined, "-");
        tinhMinus.preferredSize = [25, 25];
        var tinhInput = tinhGroup.add("edittext", undefined, "1");
        tinhInput.preferredSize = [40, 25];
        var tinhPlus = tinhGroup.add("button", undefined, "+");
        tinhPlus.preferredSize = [25, 25];

        var sepTinh1 = tabTinh.add("panel");
        sepTinh1.alignment = "fill";
        sepTinh1.minimumSize.height = 2;

        // Thêm hướng dẫn cho Tab Tĩnh
        var helpTinhGroup = tabTinh.add("group");
        helpTinhGroup.orientation = "row";
        helpTinhGroup.add("statictext", undefined, "Hướng dẫn Clone Tĩnh");
        var helpTinhBtn = helpTinhGroup.add("button", undefined, "?");
        helpTinhBtn.preferredSize = [20, 20];
        helpTinhBtn.onClick = function() {
            alert("💡 HƯỚNG DẪN CLONE TĨNH\n\n" +
                  "Chế độ này giúp bạn đúp nhanh layer tại chỗ.\n\n" +
                  "• Số Layer Đúp: Số lượng bản sao bạn muốn tạo ra.\n" +
                  "• Nút Cloooner: Bắt đầu đúp layer hiện tại.\n" +
                  "• True Clone (ở dưới cùng): Nếu tích, sẽ đúp sâu vào tận trong các Comp con, tạo ra các bản sao độc lập hoàn toàn!\n" +
                  "• Nút 🗑 (Clear): Chọn các layer Comp đã đúp (hoặc Comp gốc) và ấn xoá. Ở tab này, nó sẽ xoá TẬN GỐC Comp đó khỏi Project (hãy cẩn thận!).");
        };

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

        // Thêm Checkbox Twisted vào Tab Tròn
        var tronTwistedGroup = tabTron.add("group");
        tronTwistedGroup.orientation = "row";
        var tronTwistedCheckbox = tronTwistedGroup.add("checkbox", undefined, "Kích hoạt Twisted");

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

        var sepTron4 = tabTron.add("panel");
        sepTron4.alignment = "fill";
        sepTron4.minimumSize.height = 2;

        // Thêm hướng dẫn cho Tab Tròn
        var helpTronGroup = tabTron.add("group");
        helpTronGroup.orientation = "row";
        helpTronGroup.add("statictext", undefined, "Hướng dẫn Clone Tròn");
        var helpTronBtn = helpTronGroup.add("button", undefined, "?");
        helpTronBtn.preferredSize = [20, 20];
        helpTronBtn.onClick = function() {
            alert("💡 HƯỚNG DẪN CLONE TRÒN\n\n" +
                  "Tạo ra các bản sao xoay quanh một tâm (Null).\n\n" +
                  "• Chuẩn bị: Chọn 1 Null Layer TRƯỚC (làm tâm), sau đó chọn Layer cần đúp SAU.\n" +
                  "• Góc xoay: Khoảng cách góc giữa các bản sao.\n" +
                  "• Không xoay: Bản sao luôn giữ nguyên hướng hiển thị (như vòng đu quay).\n" +
                  "• 3D Mode & Trục: Bật nếu làm việc với layer 3D.\n" +
                  "• Twisted: Tạo hiệu ứng xoắn ốc bằng cách xoay luỹ tiến các bản sao.\n" +
                  "• Clooon thêm: Chọn Null Pivot tâm hiện tại, nhập số và đúp thêm bản sao nối tiếp.\n" +
                  "• Nút 🗑 (Clear): Chọn Pivot Null rồi ấn để dọn sạch Rig.\n" +
                  "• MẸO NHỎ: Mở bảng Effect Controls (F3) ở Pivot Null để tuỳ chỉnh Radius, Stagger, Offset... animate cực đã!");
        };

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

        var sepPath2 = tabPath.add("panel");
        sepPath2.alignment = "fill";
        sepPath2.minimumSize.height = 2;

        var pathOrientGroup = tabPath.add("group");
        pathOrientGroup.orientation = "row";
        var pathOrientCheckbox = pathOrientGroup.add("checkbox", undefined, "Xoay theo Path");

        var pathTaperGroup = tabPath.add("group");
        pathTaperGroup.orientation = "row";
        var pathTaperCheckbox = pathTaperGroup.add("checkbox", undefined, "Kích hoạt Taper");

        var pathTrimGroup = tabPath.add("group");
        pathTrimGroup.orientation = "row";
        var pathTrimCheckbox = pathTrimGroup.add("checkbox", undefined, "Kích hoạt Trim Path");

        var pathTwistedGroup = tabPath.add("group");
        pathTwistedGroup.orientation = "row";
        var pathTwistedCheckbox = pathTwistedGroup.add("checkbox", undefined, "Kích hoạt Twisted");

        // Thêm Checkbox Delayed Offset
        var pathDelayGroup = tabPath.add("group");
        pathDelayGroup.orientation = "row";
        var pathDelayCheckbox = pathDelayGroup.add("checkbox", undefined, "Kích hoạt Delayed Offset");

        var sepPath3 = tabPath.add("panel");
        sepPath3.alignment = "fill";
        sepPath3.minimumSize.height = 2;

        var pathCloneMoreGroup = tabPath.add("group");
        pathCloneMoreGroup.orientation = "row";
        var pathCloneMoreMinus = pathCloneMoreGroup.add("button", undefined, "-");
        pathCloneMoreMinus.preferredSize = [25, 25];
        var pathCloneMoreInput = pathCloneMoreGroup.add("edittext", undefined, "3");
        pathCloneMoreInput.preferredSize = [40, 25];
        var pathCloneMorePlus = pathCloneMoreGroup.add("button", undefined, "+");
        pathCloneMorePlus.preferredSize = [25, 25];
        var pathCloneMoreBtn = pathCloneMoreGroup.add("button", undefined, "Clooon thêm");
        pathCloneMoreBtn.preferredSize.height = 25;

        var sepPath4 = tabPath.add("panel");
        sepPath4.alignment = "fill";
        sepPath4.minimumSize.height = 2;

        // Thêm hướng dẫn cho Tab Path (Cập nhật Delayed Offset)
        var helpPathGroup = tabPath.add("group");
        helpPathGroup.orientation = "row";
        helpPathGroup.add("statictext", undefined, "Hướng dẫn Clone Path");
        var helpPathBtn = helpPathGroup.add("button", undefined, "?");
        helpPathBtn.preferredSize = [20, 20];
        helpPathBtn.onClick = function() {
            alert("💡 HƯỚNG DẪN CLONE PATH\n\n" +
                  "Phân bố các bản sao chạy dọc theo đường Path.\n\n" +
                  "• Khoảng cách (%): Khoảng cách giữa các bản sao trên đường.\n" +
                  "• Taper & Trim Path: Thu nhỏ dần ở hai đầu và giới hạn hiển thị.\n" +
                  "• Twisted: Xoay luỹ tiến tạo hiệu ứng xoắn ốc quanh path.\n" +
                  "• Delayed Offset: Keyframe thông số này để tạo hiệu ứng chuyển động truyền sóng (caterpillar). Clone sau sẽ copy keyframe nhưng bị trễ đi 1 số frame nhất định (Delay Frames).\n" +
                  "• MẸO NHỎ: Đổi layer trong mục 'Path' của Control Null để đổi đường ray!");
        };

        // === TAB 4: TOOLS ===
        var tabTools = tpanel.add("tab", undefined, "Tools");
        tabTools.orientation = "column";
        tabTools.alignChildren = ["center", "top"];
        tabTools.spacing = 15;
        tabTools.margins = 10;

        // --- RIG TO CIRCULAR ---
        var toolCircPanel = tabTools.add("panel", undefined, "Rig to Circular");
        toolCircPanel.orientation = "column";
        toolCircPanel.alignChildren = ["left", "top"];
        toolCircPanel.spacing = 8;
        toolCircPanel.margins = 10;

        var tcGroup1 = toolCircPanel.add("group");
        var tcNorm = tcGroup1.add("checkbox", undefined, "Không xoay");
        var tcTwist = tcGroup1.add("checkbox", undefined, "Twisted");
        
        var tcGroup2 = toolCircPanel.add("group");
        var tc3D = tcGroup2.add("checkbox", undefined, "3D Mode");
        var tcAxisGroup = tcGroup2.add("group");
        tcAxisGroup.add("statictext", undefined, "Trục:");
        var tcAxisX = tcAxisGroup.add("radiobutton", undefined, "X");
        var tcAxisY = tcAxisGroup.add("radiobutton", undefined, "Y");
        var tcAxisZ = tcAxisGroup.add("radiobutton", undefined, "Z");
        tcAxisZ.value = true;
        tcAxisGroup.visible = false;
        tc3D.onClick = function() { tcAxisGroup.visible = tc3D.value; };

        var btnRigCirc = toolCircPanel.add("button", undefined, "Rig to Circular");
        btnRigCirc.alignment = ["fill", "top"];

        // Phân cách 2 cụm Tools
        var sepTool = tabTools.add("panel");
        sepTool.alignment = "fill";
        sepTool.minimumSize.height = 2;

        // --- RIG TO PATH ---
        var toolPathPanel = tabTools.add("panel", undefined, "Rig to Path");
        toolPathPanel.orientation = "column";
        toolPathPanel.alignChildren = ["left", "top"];
        toolPathPanel.spacing = 8;
        toolPathPanel.margins = 10;

        var tpGroup1 = toolPathPanel.add("group");
        var tpOrient = tpGroup1.add("checkbox", undefined, "Xoay theo Path");
        var tpTaper = tpGroup1.add("checkbox", undefined, "Kích hoạt Taper");

        var tpGroup2 = toolPathPanel.add("group");
        var tpTrim = tpGroup2.add("checkbox", undefined, "Trim Path");
        var tpTwist = tpGroup2.add("checkbox", undefined, "Twisted");

        var tpGroup3 = toolPathPanel.add("group");
        var tpDelay = tpGroup3.add("checkbox", undefined, "Delayed Offset");

        var btnRigPath = toolPathPanel.add("button", undefined, "Rig to Path");
        btnRigPath.alignment = ["fill", "top"];
        
        // Cụm hướng dẫn Tab Tools
        var helpToolsGroup = tabTools.add("group");
        helpToolsGroup.orientation = "row";
        helpToolsGroup.alignment = ["center", "top"];
        helpToolsGroup.add("statictext", undefined, "Hướng dẫn Tools Rigging");
        var helpToolsBtn = helpToolsGroup.add("button", undefined, "?");
        helpToolsBtn.preferredSize = [20, 20];
        helpToolsBtn.onClick = function() {
            alert("💡 HƯỚNG DẪN TOOLS RIGGING\n\n" +
                  "Thay vì đúp layer mới, Tools này cho phép bạn bắt các Layer có sẵn (khác nhau) chạy theo hệ thống Cloooner.\n\n" +
                  "📌 CÁCH CHỌN LAYER (RẤT QUAN TRỌNG):\n" +
                  "1. Luôn phải chọn Layer Tâm / Đường ray ĐẦU TIÊN (Null Layer hoặc Shape Layer).\n" +
                  "2. Giữ Ctrl/Cmd và chọn tiếp các Layer mục tiêu phía sau.\n" +
                  "3. Bấm Rig. Mọi Layer sẽ giữ nguyên kích thước (Scale) và bị hút vào hệ thống!");
        };

        // === PHẦN CHUNG STICKY BOTTOM (DƯỚI CÙNG) ===
        var bottomGroup = panel.add("group");
        bottomGroup.orientation = "column";
        bottomGroup.alignment = ["fill", "bottom"]; // Gắn chặt dính vào đáy
        bottomGroup.alignChildren = ["fill", "top"]; 
        bottomGroup.spacing = 10;
        bottomGroup.margins = [0, 5, 0, 0];

        // Trả True Clone về 1 dòng độc lập
        var trueCloneGroup = bottomGroup.add("group");
        trueCloneGroup.alignment = ["left", "top"];
        var trueCloneCheckbox = trueCloneGroup.add("checkbox", undefined, "True Clone (Đúp comp tận gốc)");

        var sepBottom = bottomGroup.add("panel");
        sepBottom.alignment = ["fill", "top"];
        sepBottom.minimumSize.height = 2;

        var btnGroup = bottomGroup.add("group");
        btnGroup.orientation = "row";
        btnGroup.alignment = ["fill", "top"]; 

        var cloneBtn = btnGroup.add("button", undefined, "Cloooner");
        cloneBtn.alignment = ["fill", "fill"]; // Ép nút giãn theo % ngang còn lại
        cloneBtn.preferredSize.height = 30;

        var clearBtn = btnGroup.add("button", undefined, "🗑");
        clearBtn.preferredSize = [35, 30]; // Thùng rác luôn cố định tỷ lệ vuông 35px
        clearBtn.alignment = ["right", "fill"]; 
        clearBtn.helpTip = "Thùng rác thông minh: Chọn Null để tháo Rig";

        var footerGroup = bottomGroup.add("group");
        footerGroup.orientation = "row";
        footerGroup.alignChildren = ["center", "center"];
        footerGroup.margins = [0, 5, 0, 0]; 
        footerGroup.add("statictext", undefined, "Một chiếc plugin bởi Trọng");
        
        var fbBtn = footerGroup.add("button", undefined, "♥︎");
        fbBtn.preferredSize = [25, 20]; 
        fbBtn.helpTip = "Ghé thăm Facebook của tôi!";
        fbBtn.onClick = function () {
            var url = "https://www.facebook.com/phanductrong34/";
            if ($.os.indexOf("Windows") !== -1) {
                system.callSystem("cmd /c \"start " + url + "\"");
            } else {
                system.callSystem("open \"" + url + "\"");
            }
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
        setupPlusMinus(pathCloneMorePlus, pathCloneMoreMinus, pathCloneMoreInput, 1);

        // ==========================================
        // KÍCH HOẠT NATIVE LAYOUT CỦA AFTER EFFECTS
        // ==========================================
        // Dòng này bắt buộc phải có để AE tự tính toán lại UI mỗi khi bạn kéo dãn bảng
        panel.onResizing = panel.onResize = function() {
            panel.layout.resize();
        };

        // Kích nổ layout lần đầu tiên
        panel.layout.layout(true);
        panel.onResize();
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

// --- SMART CLEAR BUTTON LOGIC (TỰ ĐỘNG NHẬN DIỆN RIG) ---
        clearBtn.onClick = function () {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                alert("Hãy chọn một Composition.");
                return;
            }

            var sel = comp.selectedLayers;
            if (sel.length === 0) {
                alert("Vui lòng chọn layer để xoá.");
                return;
            }

            app.beginUndoGroup("Clear Cloooner");

            try {
                // Đọc layer đầu tiên được chọn để "bắt mạch"
                var firstSel = sel[0];
                
                // Nhận diện xem nó là Control Null của Tab nào
                var isPathControl = firstSel.name.indexOf("Clone on Path Control") !== -1;
                var isCircularControl = firstSel.name.indexOf("Pivot Null") !== -1 || 
                                        (firstSel.nullLayer && firstSel.property("Effects").property("Total Clones") !== null && !isPathControl);
                
                if (isPathControl || isCircularControl) {
                    // ==========================================
                    // LOGIC THÁO RIG THÔNG MINH (ĐỌC CỜ ISCLOOONER)
                    // ==========================================
                    var pivot = firstSel;
                    var kidsToKeep = [];
                    var kidsToDelete = [];
                    var nullsToDelete = [];

                    // Đọc biến cờ hiệu để biết đây là Rig đúp (True) hay Rig gom layer (False)
                    var isCloooner = true; // Mặc định là true nếu đời cũ không có nút này
                    try {
                        var isClooonerProp = pivot.property("Effects").property("Remove All Instances When Clear");
                        if (isClooonerProp) {
                            isCloooner = isClooonerProp.property("Checkbox").value === 1 || isClooonerProp.property("Checkbox").value === true;
                        }
                    } catch(e) {}

                    // Tìm các Null phụ và phân loại Layer con
                    for (var i = 1; i <= comp.numLayers; i++) {
                        var l = comp.layer(i);
                        if (l.parent === pivot) {
                            nullsToDelete.push(l); // Tất cả Null phụ đều bị xoá
                            for (var j = 1; j <= comp.numLayers; j++) {
                                var kid = comp.layer(j);
                                if (kid.parent === l) {
                                    // Kiểm tra xem có phải layer gốc (Index = 0) hay không
                                    var isOriginal = false;
                                    try {
                                        var idxProp = kid.property("Effects").property("Clone Index");
                                        if (idxProp && idxProp.property("Slider").value === 0) {
                                            isOriginal = true;
                                        }
                                    } catch(e) {}

                                    // Nếu là đúp từ Cloooner và KHÔNG phải layer gốc => Cho vào danh sách Xoá
                                    if (isCloooner && !isOriginal) {
                                        kidsToDelete.push(kid);
                                    } else {
                                        kidsToKeep.push(kid); // Công cụ Tools hoặc Layer gốc => Giữ lại
                                    }
                                }
                            }
                        }
                    }

                    // 1. Trả tự do cho layer con cần giữ và làm sạch
                    for (var k = 0; k < kidsToKeep.length; k++) {
                        var keptKid = kidsToKeep[k];
                        keptKid.parent = null;
                        
                        var propsToClear = ["Position", "Scale", "Rotation", "X Rotation", "Y Rotation", "Z Rotation", "Opacity", "Orientation"];
                        for(var p = 0; p < propsToClear.length; p++) {
                            var prop = keptKid.property("Transform").property(propsToClear[p]);
                            if (prop && prop.canSetExpression) prop.expression = "";
                        }

                        try {
                            var fx = keptKid.property("Effects").property("Clone Index");
                            if (fx) fx.remove();
                            var fxPath = keptKid.property("Effects").property("Path Position");
                            if (fxPath) fxPath.remove();
                        } catch(e) {}

                        // Trả lại tên gốc
                        keptKid.name = keptKid.name.replace(/^\d+\.\s/, "").replace(/\s-\sClone$/, "");
                    }

                    // 2. Xoá các Layer Clone đúp thừa
                    for (var d = 0; d < kidsToDelete.length; d++) {
                        kidsToDelete[d].remove();
                    }

                    // 3. Xoá toàn bộ Null phụ
                    for (var n = 0; n < nullsToDelete.length; n++) {
                        nullsToDelete[n].remove();
                    }

                    // 4. Xử lý Null Tổng tuỳ theo loại Rig
                    if (isPathControl) {
                        pivot.remove(); // Tab Path & Tool Path: Xoá luôn Control
                    } else {
                        // Tab Tròn & Tool Tròn: Xoá Effect, giữ lại Null Pivot ban đầu
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
                    }

                } else {
                    // ==========================================
                    // LOGIC XOÁ TẬN GỐC (TAB TĨNH / NORMAL COMP)
                    // ==========================================
                    var proceed = confirm("⚠️ BẠN ĐANG CHỌN LAYER THƯỜNG / COMP\n\nNếu ấn OK, Tool sẽ XOÁ TẬN GỐC các layer này khỏi Timeline và CẢ COMPOSITION NGUỒN của chúng khỏi Project!\n\nBạn có chắc chắn muốn tiếp tục?");
                    if (!proceed) {
                        app.endUndoGroup();
                        return;
                    }

                    for (var s = 0; s < sel.length; s++) {
                        var l = sel[s];
                        var src = l.source;
                        
                        l.remove(); // Xoá layer khỏi Timeline
                        
                        // Xoá Comp nguồn khỏi cửa sổ Project
                        if (src && src instanceof CompItem) {
                            try { src.remove(); } catch(e) {}
                        }
                    }
                }

            } catch (error) {
                alert("Đã xảy ra lỗi khi Clear: " + error.toString());
            }

            app.endUndoGroup();
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

                // Đọc biến từ Tab Tròn
                var isTwisted = tronTwistedCheckbox.value;

                ensureControl(pivot, "Total Clones", "ADBE Slider Control", totalClones);
                pivot.property("Effects").property("Total Clones").property("Slider").expression = totalClones.toString();
                
                ensureControl(pivot, "Angle", "ADBE Angle Control", angle);
                ensureControl(pivot, "Radius Ratio", "ADBE Slider Control", 100);
                ensureControl(pivot, "Stagger", "ADBE Slider Control", 100);
                ensureControl(pivot, "Offset", "ADBE Angle Control", 0);
                
                if (isTwisted) {
                    ensureControl(pivot, "Twisted Angle", "ADBE Angle Control", 5);
                    ensureControl(pivot, "Twisted Rate", "ADBE Slider Control", 1);
                }

                // --- Gắn cờ (Nằm dưới cùng bảng Effect) ---
                var removeFlag = pivot.property("Effects").property("Remove All Instances When Clear");
                if (!removeFlag) {
                    removeFlag = pivot.property("Effects").addProperty("ADBE Checkbox Control");
                    removeFlag.name = "Remove All Instances When Clear";
                }
                removeFlag.property("Checkbox").setValue(true); // Đúp từ Cloooner -> True

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
                        'value + (ctrl * idx);'; 

                    // --- Xử lý Expression cho Clone Layer (Kết hợp Twisted & Không xoay) ---
                    var kidExpr = "";
                    var twistStr = isTwisted ? 
                        'tAngle = thisComp.layer("' + pivot.name + '").effect("Twisted Angle")("Angle");\n' +
                        'tRate = thisComp.layer("' + pivot.name + '").effect("Twisted Rate")("Slider");\n' +
                        'tIdx = effect("Clone Index")("Slider");\n' +
                        'twistVal = tAngle * tRate * tIdx;\n' : '';

                    if (normalize && isTwisted) {
                        var aePropName = make3D ? axis.toLowerCase() + "Rotation" : "rotation";
                        kidExpr = twistStr + 'value + (-parent.transform.' + aePropName + ' - thisComp.layer("' + pivot.name + '").transform.' + aePropName + ') + twistVal;';
                    } else if (normalize) {
                        var aePropName = make3D ? axis.toLowerCase() + "Rotation" : "rotation";
                        kidExpr = 'value + (-parent.transform.' + aePropName + ' - thisComp.layer("' + pivot.name + '").transform.' + aePropName + ');';
                    } else if (isTwisted) {
                        kidExpr = twistStr + 'value + twistVal;';
                    }

                    if (kidExpr !== "") {
                        kid.property("Transform").property(rotPropName).expression = kidExpr;
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

                    var clonePosStr = make3D ? ('[' + clonePos[0] + ',' + clonePos[1] + ',' + clonePos[2] + ']') : ('[' + clonePos[0] + ',' + clonePos[1] + ']');
                    var offsetStr = make3D ? 
                        '[dir[0] * ' + len.toFixed(4) + ' * ratio * scale, dir[1] * ' + len.toFixed(4) + ' * ratio * scale, dir[2] * ' + len.toFixed(4) + ' * ratio * scale]' : 
                        '[dir[0] * ' + len.toFixed(4) + ' * ratio * scale, dir[1] * ' + len.toFixed(4) + ' * ratio * scale]';

                    var expr = ''
                        + 'ratio = thisComp.layer("' + pivot.name + '").effect("Radius Ratio")("Slider") / 100;\n'
                        + 'stagger = thisComp.layer("' + pivot.name + '").effect("Stagger")("Slider") / 100;\n'
                        + 'idx = effect("Clone Index")("Slider") + 1;\n'
                        + 'scale = Math.max(0, 1 - (1 - stagger) * idx);\n'
                        + 'dir = [' + norm[0] + ',' + norm[1] + ',' + norm[2] + '];\n'
                        + 'calcPos = parent.position + ' + offsetStr + ';\n'
                        + 'value + (calcPos - ' + clonePosStr + ');'; // Cho phép Keyframe thủ công

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
                comp.hideShyLayers = false; // Tắt đi bật lại để ép AE refresh giao diện
                comp.hideShyLayers = true;

                // --- HIGHLIGHT PIVOT NULL TỰ ĐỘNG ---
                for (var j = 1; j <= comp.numLayers; j++) {
                    comp.layer(j).selected = false; // Bỏ chọn tất cả các layer khác
                }
                pivot.selected = true; // Chỉ bôi đen Pivot Null

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

                    // --- Gắn cờ IsCloooner = True (Được tạo từ nút Cloooner) ---
                    var isClooonerCtrl = pivot.property("Effects").property("IsCloooner");
                    if (!isClooonerCtrl) {
                        isClooonerCtrl = pivot.property("Effects").addProperty("ADBE Checkbox Control");
                        isClooonerCtrl.name = "IsCloooner";
                    }
                    isClooonerCtrl.property("Checkbox").setValue(true);

                    ensureControl(pivot, "Distance", "ADBE Slider Control", distance);
                    ensureControl(pivot, "Offset", "ADBE Slider Control", 0);

                    // Khởi tạo các biến nếu được kích hoạt
                    var useTaper = pathTaperCheckbox.value;
                    var useOrient = pathOrientCheckbox.value; 
                    var useTrim = pathTrimCheckbox.value; 
                    var isTwisted = pathTwistedCheckbox.value; 
                    var isDelayed = pathDelayCheckbox.value; // Đọc biến Delayed
                    
                    if (useTaper) {
                        ensureControl(pivot, "Start Range", "ADBE Slider Control", 20);
                        ensureControl(pivot, "Start Scale", "ADBE Slider Control", 0);
                        ensureControl(pivot, "End Range", "ADBE Slider Control", 80);
                        ensureControl(pivot, "End Scale", "ADBE Slider Control", 0);
                    }
                    if (useTrim) {
                        ensureControl(pivot, "Trim Start", "ADBE Slider Control", 0);
                        ensureControl(pivot, "Trim End", "ADBE Slider Control", 100);
                        ensureControl(pivot, "Limit Start", "ADBE Slider Control", 0);
                        ensureControl(pivot, "Limit End", "ADBE Slider Control", 100);
                    }
                    if (isTwisted) {
                        ensureControl(pivot, "Twisted Angle", "ADBE Angle Control", 5);
                        ensureControl(pivot, "Twisted Rate", "ADBE Slider Control", 1);
                    }
                    if (isDelayed) {
                        ensureControl(pivot, "Delay Offset", "ADBE Slider Control", 0);
                        ensureControl(pivot, "Delay Frames", "ADBE Slider Control", 10);
                    }

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

                        // --- Xử lý Expression Path Position (Tích hợp Delayed Offset) ---
                        var delayBlock = isDelayed ? 
                            'dFrames = thisComp.layer("' + pivot.name + '").effect("Delay Frames")("Slider");\n' +
                            'dTime = framesToTime(idx * dFrames);\n' +
                            'dOffset = thisComp.layer("' + pivot.name + '").effect("Delay Offset")("Slider").valueAtTime(time - dTime);\n' : 'dOffset = 0;\n';

                        var posExpr =
                            'offset = thisComp.layer("' + pivot.name + '").effect("Offset")("Slider");\n' +
                            'dist = thisComp.layer("' + pivot.name + '").effect("Distance")("Slider");\n' +
                            'idx = effect("Clone Index")("Slider");\n' +
                            delayBlock +
                            'val = offset + (idx * dist) + dOffset;\n' + // Cộng gộp delayOffset vào giá trị gốc
                            'mod = val % 100;\n' +
                            'if (mod < 0) mod += 100;\n' +
                            'mod;';

                        rot.property("Effects").property("Path Position").property("Slider").expression = posExpr;
                        
                        // Clone layer chỉ cần đọc theo % của Null mẹ nó
                        kid.property("Effects").property("Path Position").property("Slider").expression = 'thisComp.layer("' + rot.name + '").effect("Path Position")("Slider");';



                        // Gán Expression toạ độ (Nhận diện Trim Path để tái lập tỷ lệ 0-100%)
                        var pathPositionExpr =
                            'try {\n' +
                            '  targetLayer = thisComp.layer("' + pivot.name + '").effect("Path")("Layer");\n' +
                            '  duongpath = targetLayer.content(1).content(1).path;\n' +
                            '  logicalPct = effect("Path Position")("Slider");\n' +
                            (useTrim ? 
                            '  tS = thisComp.layer("' + pivot.name + '").effect("Trim Start")("Slider");\n' +
                            '  tE = thisComp.layer("' + pivot.name + '").effect("Trim End")("Slider");\n' 
                            : '  tS = 0; tE = 100;\n') +
                            '  physicalPct = linear(logicalPct, 0, 100, tS, tE) / 100;\n' +
                            '  pos = targetLayer.toComp(duongpath.pointOnPath(physicalPct));\n' +
                            '  value + parent.fromComp(pos);\n' +
                            '} catch(e) { value; }';

                        rot.property("Transform").property("Position").expression = pathPositionExpr;

                        // Áp dụng biểu thức Scale tạo hiệu ứng Taper nếu được kích hoạt
                        if (useTaper) {
                            var taperScaleExpr =
                                'try {\n' +
                                '  ctrl = thisComp.layer("' + pivot.name + '");\n' +
                                '  pct = effect("Path Position")("Slider") % 100;\n' +
                                '  if (pct < 0) pct += 100;\n' +
                                '  sR = Math.min(ctrl.effect("Start Range")("Slider"), ctrl.effect("End Range")("Slider"));\n' +
                                '  eR = Math.max(ctrl.effect("Start Range")("Slider"), ctrl.effect("End Range")("Slider"));\n' +
                                '  sS = ctrl.effect("Start Scale")("Slider");\n' +
                                '  eS = ctrl.effect("End Scale")("Slider");\n' +
                                '  s = 100;\n' +
                                '  if (pct <= sR && sR > 0) {\n' +
                                '    s = linear(pct, 0, sR, sS, 100);\n' +
                                '  } else if (pct >= eR && eR < 100) {\n' +
                                '    s = linear(pct, eR, 100, 100, eS);\n' +
                                '  }\n' +
                                '  (value.length == 3) ? [value[0] * s/100, value[1] * s/100, value[2] * s/100] : [value[0] * s/100, value[1] * s/100];\n' +
                                '} catch(e) { value; }';
                            rot.property("Transform").property("Scale").expression = taperScaleExpr;
                        }

                        // --- Áp dụng biểu thức Auto-Orient ---
                        if (useOrient) {
                            var orientExpr =
                                'try {\n' +
                                '  targetLayer = thisComp.layer("' + pivot.name + '").effect("Path")("Layer");\n' +
                                '  duongpath = targetLayer.content(1).content(1).path;\n' +
                                '  logicalPct = effect("Path Position")("Slider");\n' +
                                (useTrim ? 
                                '  tS = thisComp.layer("' + pivot.name + '").effect("Trim Start")("Slider");\n' +
                                '  tE = thisComp.layer("' + pivot.name + '").effect("Trim End")("Slider");\n' 
                                : '  tS = 0; tE = 100;\n') +
                                '  physicalPct = linear(logicalPct, 0, 100, tS, tE) / 100;\n' +
                                '  vec = duongpath.tangentOnPath(physicalPct);\n' +
                                '  vecComp = targetLayer.toCompVec(vec);\n' +
                                '  ang = radiansToDegrees(Math.atan2(vecComp[1], vecComp[0]));\n' +
                                '  value + ang;\n' +
                                '} catch(e) { value; }';
                            
                            var rotProp = rot.threeDLayer ? "Z Rotation" : "Rotation";
                            rot.property("Transform").property(rotProp).expression = orientExpr;
                        }

                        // --- Áp dụng biểu thức Limit Opacity nếu Trim Path được kích hoạt ---
                        if (useTrim) {
                            var opacityExpr =
                                'try {\n' +
                                '  ctrl = thisComp.layer("' + pivot.name + '");\n' +
                                '  pct = effect("Path Position")("Slider") % 100;\n' +
                                '  if (pct < 0) pct += 100;\n' +
                                '  lS = Math.min(ctrl.effect("Limit Start")("Slider"), ctrl.effect("Limit End")("Slider"));\n' +
                                '  lE = Math.max(ctrl.effect("Limit Start")("Slider"), ctrl.effect("Limit End")("Slider"));\n' +
                                '  (pct >= lS && pct <= lE) ? value : 0;\n' +
                                '} catch(e) { value; }';
                            kid.property("Transform").property("Opacity").expression = opacityExpr;
                        }
                        // --- Áp dụng biểu thức Twisted cho Clone Layer ---
                        if (isTwisted) {
                            var kidRotProp = kid.threeDLayer ? "Z Rotation" : "Rotation";
                            var twistExpr =
                                'try {\n' +
                                '  tAngle = thisComp.layer("' + pivot.name + '").effect("Twisted Angle")("Angle");\n' +
                                '  tRate = thisComp.layer("' + pivot.name + '").effect("Twisted Rate")("Slider");\n' +
                                '  tIdx = effect("Clone Index")("Slider");\n' +
                                '  twistVal = tAngle * tRate * tIdx;\n' +
                                '  value + twistVal;\n' +
                                '} catch(e) { value; }';
                            kid.property("Transform").property(kidRotProp).expression = twistExpr;
                        }

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
                    comp.hideShyLayers = false; // Tắt đi bật lại
                    comp.hideShyLayers = true;

                    // --- HIGHLIGHT LAYER CONTROL TỰ ĐỘNG ---
                    for (var j = 1; j <= comp.numLayers; j++) {
                        comp.layer(j).selected = false;
                    }
                    pivot.selected = true;

                } catch (e) {
                    //alert("Lỗi khi tạo Path Cloooner: " + e.toString());
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
// ==========================================
// LOGIC CHO TAB TOOLS: RIG TO CIRCULAR
// ==========================================
        btnRigCirc.onClick = function() {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) return alert("Hãy chọn một Composition.");
            var sel = comp.selectedLayers;
            if (sel.length < 2) return alert("LỖI: Bạn phải chọn 1 Null Layer làm tâm trước, sau đó giữ Ctrl chọn các Layer cần Rig.");
            var pivot = sel[0];
            if (!pivot.nullLayer) return alert("LỖI: Layer đầu tiên được chọn bắt buộc phải là Null Layer (để làm tâm xoay).");

            app.beginUndoGroup("Rig to Circular");
            try {
                var totalClones = sel.length - 1;
                var make3D = tc3D.value;
                var normalize = tcNorm.value;
                var isTwisted = tcTwist.value;
                var axis = "Z";
                if (make3D) {
                    if (tcAxisX.value) axis = "X";
                    else if (tcAxisY.value) axis = "Y";
                    else axis = "Z";
                }

                pivot.threeDLayer = make3D; 

                // --- TÍNH TOÁN BÁN KÍNH TRUNG BÌNH CỦA CÁC LAYER ---
                var totalDist = 0;
                var pivotPos = pivot.transform.position.value;
                for (var i = 1; i < sel.length; i++) {
                    var cPos = sel[i].transform.position.value;
                    var d = Math.sqrt(Math.pow(cPos[0]-pivotPos[0],2) + Math.pow(cPos[1]-pivotPos[1],2) + (make3D ? Math.pow(cPos[2]-pivotPos[2],2) : 0));
                    totalDist += d;
                }
                var avgRadius = totalDist / (sel.length - 1);

                // --- QUY CHUẨN TRỤC ĐẨY (ĐẢM BẢO X=0 NHƯ BẠN MUỐN) ---
                var dirStr = "[0, -1, 0]"; // Mặc định Trục Z: đẩy layer lên trên (Y âm)
                if (make3D) {
                    if (axis === "Y") dirStr = "[-1, 0, 0]"; // Trục Y: đẩy sang trái (X âm)
                    else if (axis === "X") dirStr = "[0, 0, -1]"; // Trục X: đẩy lùi sâu (Z âm)
                }

                ensureControl(pivot, "Total Clones", "ADBE Slider Control", totalClones);
                pivot.property("Effects").property("Total Clones").property("Slider").expression = totalClones.toString();
                ensureControl(pivot, "Radius", "ADBE Slider Control", avgRadius);
                ensureControl(pivot, "Angle", "ADBE Angle Control", 30);
                ensureControl(pivot, "Radius Ratio", "ADBE Slider Control", 100);
                ensureControl(pivot, "Stagger", "ADBE Slider Control", 100);
                ensureControl(pivot, "Offset", "ADBE Angle Control", 0);
                
                if (isTwisted) {
                    ensureControl(pivot, "Twisted Angle", "ADBE Angle Control", 5);
                    ensureControl(pivot, "Twisted Rate", "ADBE Slider Control", 1);
                }

                // --- Gắn cờ (Nằm dưới cùng bảng Effect) ---
                var removeFlag = pivot.property("Effects").property("Remove All Instances When Clear");
                if (!removeFlag) {
                    removeFlag = pivot.property("Effects").addProperty("ADBE Checkbox Control");
                    removeFlag.name = "Remove All Instances When Clear";
                }
                removeFlag.property("Checkbox").setValue(false); // Rig từ layer có sẵn -> False

                var pivotRotProp = make3D ? (axis + " Rotation") : "Rotation";
                if (pivot.property("Transform").property(pivotRotProp).canSetExpression) {
                    pivot.property("Transform").property(pivotRotProp).expression = 'value + effect("Offset")("Angle");';
                }

                for (var i = 1; i < sel.length; i++) {
                    var kid = sel[i];
                    kid.threeDLayer = make3D; 

                    var rot = comp.layers.addNull();
                    var baseName = kid.name.replace(/^\d+\.\s/, "").replace(/\s-\sClone$/, "");
                    rot.name = i + ". Null " + baseName;
                    rot.threeDLayer = make3D;
                    rot.moveBefore(kid);
                    
                    rot.parent = pivot;
                    rot.transform.position.setValue([0,0,0]);

                    // Gán parent
                    kid.parent = rot;

                    // --- RESET TOẠ ĐỘ & CHIỀU QUAY (GIỮ NGUYÊN SCALE) ---
                    kid.transform.position.setValue(make3D ? [0, 0, 0] : [0, 0]);
                    if (make3D) {
                        kid.transform.orientation.setValue([0, 0, 0]);
                        kid.transform.xRotation.setValue(0);
                        kid.transform.yRotation.setValue(0);
                        kid.transform.zRotation.setValue(0);
                    } else {
                        kid.transform.rotation.setValue(0);
                    }

                    setLockedIndex(rot, i - 1);
                    setLockedIndex(kid, i - 1);
                    ensureControl(kid, "Clone Index", "ADBE Slider Control", i - 1);

                    var rotPropName = make3D ? (axis + " Rotation") : "Rotation";
                    rot.property("Transform").property(rotPropName).expression =
                        'ctrl = thisComp.layer("' + pivot.name + '").effect("Angle")("Angle");\n' +
                        'idx = effect("Clone Index")("Slider");\n' +
                        'value + (ctrl * idx);'; 

                    var kidExpr = "";
                    var twistStr = isTwisted ? 
                        'tAngle = thisComp.layer("' + pivot.name + '").effect("Twisted Angle")("Angle");\n' +
                        'tRate = thisComp.layer("' + pivot.name + '").effect("Twisted Rate")("Slider");\n' +
                        'tIdx = effect("Clone Index")("Slider");\n' +
                        'twistVal = tAngle * tRate * tIdx;\n' : '';

                    if (normalize && isTwisted) {
                        var aePropName = make3D ? axis.toLowerCase() + "Rotation" : "rotation";
                        kidExpr = twistStr + 'value + (-parent.transform.' + aePropName + ' - thisComp.layer("' + pivot.name + '").transform.' + aePropName + ') + twistVal;';
                    } else if (normalize) {
                        var aePropName = make3D ? axis.toLowerCase() + "Rotation" : "rotation";
                        kidExpr = 'value + (-parent.transform.' + aePropName + ' - thisComp.layer("' + pivot.name + '").transform.' + aePropName + ');';
                    } else if (isTwisted) {
                        kidExpr = twistStr + 'value + twistVal;';
                    }

                    if (kidExpr !== "") kid.property("Transform").property(rotPropName).expression = kidExpr;

                    // --- CÔNG THỨC POSITION CHUẨN HOÁ BÁN KÍNH ---
                    var posExpr = ''
                        + 'rad = thisComp.layer("' + pivot.name + '").effect("Radius")("Slider");\n'
                        + 'ratio = thisComp.layer("' + pivot.name + '").effect("Radius Ratio")("Slider") / 100;\n'
                        + 'stagger = thisComp.layer("' + pivot.name + '").effect("Stagger")("Slider") / 100;\n'
                        + 'idx = effect("Clone Index")("Slider") + 1;\n'
                        + 'scale = Math.max(0, 1 - (1 - stagger) * idx);\n'
                        + 'dir = ' + dirStr + ';\n'
                        + 'r = rad * ratio * scale;\n'
                        + 'calcPos = parent.position + [dir[0]*r, dir[1]*r, dir[2]*r];\n'
                        + 'value + calcPos;';

                    kid.transform.position.expression = posExpr;
                    rot.shy = true;
                }
                pivot.shy = false;
                comp.hideShyLayers = false; comp.hideShyLayers = true;
                for (var j = 1; j <= comp.numLayers; j++) comp.layer(j).selected = false;
                pivot.selected = true;
            } catch(e) { alert("Lỗi Rig Circular: " + e.toString()); }
            app.endUndoGroup();
        };

// ==========================================
// LOGIC CHO TAB TOOLS: RIG TO PATH
// ==========================================
        btnRigPath.onClick = function() {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) return alert("Hãy chọn một Composition.");
            var sel = comp.selectedLayers;
            if (sel.length < 2) return alert("LỖI: Bạn phải chọn 1 Shape Layer chứa Path trước, sau đó chọn các Layer cần Rig.");
            var shapeLayer = sel[0];
            if (!(shapeLayer instanceof ShapeLayer)) return alert("LỖI: Layer đầu tiên được chọn bắt buộc phải là Shape Layer (chứa đường Path).");

            var useOrient = tpOrient.value;
            var useTaper = tpTaper.value;
            var useTrim = tpTrim.value;
            var isTwisted = tpTwist.value;
            var isDelayed = tpDelay.value;

            app.beginUndoGroup("Rig to Path");
            try {
                var totalClones = sel.length - 1;
                
                var pivot = comp.layers.addNull();
                pivot.name = uniqueName(comp, "Clone on Path Control");
                pivot.label = 10;
                pivot.moveBefore(shapeLayer);

                var pathLayerCtrl = pivot.property("Effects").addProperty("ADBE Layer Control");
                pathLayerCtrl.name = "Path";
                pathLayerCtrl.property("Layer").setValue(shapeLayer.index); 

                ensureControl(pivot, "Total Clones", "ADBE Slider Control", totalClones);
                pivot.property("Effects").property("Total Clones").property("Slider").expression = totalClones.toString();
                ensureControl(pivot, "Distance", "ADBE Slider Control", 5); 
                ensureControl(pivot, "Offset", "ADBE Slider Control", 0);

                if (useTaper) {
                    ensureControl(pivot, "Start Range", "ADBE Slider Control", 20);
                    ensureControl(pivot, "Start Scale", "ADBE Slider Control", 0);
                    ensureControl(pivot, "End Range", "ADBE Slider Control", 80);
                    ensureControl(pivot, "End Scale", "ADBE Slider Control", 0);
                }
                if (useTrim) {
                    ensureControl(pivot, "Trim Start", "ADBE Slider Control", 0);
                    ensureControl(pivot, "Trim End", "ADBE Slider Control", 100);
                    ensureControl(pivot, "Limit Start", "ADBE Slider Control", 0);
                    ensureControl(pivot, "Limit End", "ADBE Slider Control", 100);
                }
                if (isTwisted) {
                    ensureControl(pivot, "Twisted Angle", "ADBE Angle Control", 5);
                    ensureControl(pivot, "Twisted Rate", "ADBE Slider Control", 1);
                }
                if (isDelayed) {
                    ensureControl(pivot, "Delay Offset", "ADBE Slider Control", 0);
                    ensureControl(pivot, "Delay Frames", "ADBE Slider Control", 10);
                }

                // --- Gắn cờ (Nằm dưới cùng bảng Effect) ---
                var removeFlag = pivot.property("Effects").property("Remove All Instances When Clear");
                if (!removeFlag) {
                    removeFlag = pivot.property("Effects").addProperty("ADBE Checkbox Control");
                    removeFlag.name = "Remove All Instances When Clear";
                }
                removeFlag.property("Checkbox").setValue(false); // Rig từ layer có sẵn -> False

                // --- Gắn cờ (Nằm dưới cùng bảng Effect) ---
                var removeFlag = pivot.property("Effects").property("Remove All Instances When Clear");
                if (!removeFlag) {
                    removeFlag = pivot.property("Effects").addProperty("ADBE Checkbox Control");
                    removeFlag.name = "Remove All Instances When Clear";
                }
                removeFlag.property("Checkbox").setValue(true); // Đúp từ Cloooner -> True

                for (var i = 1; i < sel.length; i++) {
                    var kid = sel[i];
                    var rot = comp.layers.addNull();
                    rot.name = i + ". Null " + kid.name;
                    rot.moveBefore(kid);
                    
                    rot.parent = pivot;
                    rot.transform.position.setValue([0,0,0]);
                    
                    kid.parent = rot; 

                    // --- ÉP VỊ TRÍ SNAP CHÍNH XÁC VÀO NULL PHỤ (ĐỂ NẰM TRÊN PATH) ---
                    kid.transform.position.setValue(kid.threeDLayer ? [0, 0, 0] : [0, 0]);

                    setLockedIndex(rot, i - 1);
                    setLockedIndex(kid, i - 1);
                    ensureControl(rot, "Path Position", "ADBE Slider Control", 0);
                    ensureControl(kid, "Path Position", "ADBE Slider Control", 0);
                    ensureControl(kid, "Clone Index", "ADBE Slider Control", i - 1);

                    var delayBlock = isDelayed ? 
                        'dFrames = thisComp.layer("' + pivot.name + '").effect("Delay Frames")("Slider");\n' +
                        'dTime = framesToTime(idx * dFrames);\n' +
                        'dOffset = thisComp.layer("' + pivot.name + '").effect("Delay Offset")("Slider").valueAtTime(time - dTime);\n' : 'dOffset = 0;\n';

                    var posExpr =
                        'offset = thisComp.layer("' + pivot.name + '").effect("Offset")("Slider");\n' +
                        'dist = thisComp.layer("' + pivot.name + '").effect("Distance")("Slider");\n' +
                        'idx = effect("Clone Index")("Slider");\n' +
                        delayBlock +
                        'val = offset + (idx * dist) + dOffset;\n' +
                        'mod = val % 100;\n' +
                        'if (mod < 0) mod += 100;\n' +
                        'mod;';

                    rot.property("Effects").property("Path Position").property("Slider").expression = posExpr;
                    kid.property("Effects").property("Path Position").property("Slider").expression = 'thisComp.layer("' + rot.name + '").effect("Path Position")("Slider");';

                    var pathPositionExpr =
                        'try {\n' +
                        '  targetLayer = thisComp.layer("' + pivot.name + '").effect("Path")("Layer");\n' +
                        '  duongpath = targetLayer.content(1).content(1).path;\n' +
                        '  logicalPct = effect("Path Position")("Slider");\n' +
                        (useTrim ? 
                        '  tS = thisComp.layer("' + pivot.name + '").effect("Trim Start")("Slider");\n' +
                        '  tE = thisComp.layer("' + pivot.name + '").effect("Trim End")("Slider");\n' 
                        : '  tS = 0; tE = 100;\n') +
                        '  physicalPct = linear(logicalPct, 0, 100, tS, tE) / 100;\n' +
                        '  pos = targetLayer.toComp(duongpath.pointOnPath(physicalPct));\n' +
                        '  value + parent.fromComp(pos);\n' +
                        '} catch(e) { value; }';

                    rot.property("Transform").property("Position").expression = pathPositionExpr;

                    if (useTaper) {
                        var taperScaleExpr =
                            'try {\n' +
                            '  ctrl = thisComp.layer("' + pivot.name + '");\n' +
                            '  pct = effect("Path Position")("Slider") % 100;\n' +
                            '  if (pct < 0) pct += 100;\n' +
                            '  sR = Math.min(ctrl.effect("Start Range")("Slider"), ctrl.effect("End Range")("Slider"));\n' +
                            '  eR = Math.max(ctrl.effect("Start Range")("Slider"), ctrl.effect("End Range")("Slider"));\n' +
                            '  sS = ctrl.effect("Start Scale")("Slider");\n' +
                            '  eS = ctrl.effect("End Scale")("Slider");\n' +
                            '  s = 100;\n' +
                            '  if (pct <= sR && sR > 0) {\n' +
                            '    s = linear(pct, 0, sR, sS, 100);\n' +
                            '  } else if (pct >= eR && eR < 100) {\n' +
                            '    s = linear(pct, eR, 100, 100, eS);\n' +
                            '  }\n' +
                            '  (value.length == 3) ? [value[0] * s/100, value[1] * s/100, value[2] * s/100] : [value[0] * s/100, value[1] * s/100];\n' +
                            '} catch(e) { value; }';
                        rot.property("Transform").property("Scale").expression = taperScaleExpr;
                    }

                    if (useOrient) {
                        var orientExpr =
                            'try {\n' +
                            '  targetLayer = thisComp.layer("' + pivot.name + '").effect("Path")("Layer");\n' +
                            '  duongpath = targetLayer.content(1).content(1).path;\n' +
                            '  logicalPct = effect("Path Position")("Slider");\n' +
                            (useTrim ? 
                            '  tS = thisComp.layer("' + pivot.name + '").effect("Trim Start")("Slider");\n' +
                            '  tE = thisComp.layer("' + pivot.name + '").effect("Trim End")("Slider");\n' 
                            : '  tS = 0; tE = 100;\n') +
                            '  physicalPct = linear(logicalPct, 0, 100, tS, tE) / 100;\n' +
                            '  vec = duongpath.tangentOnPath(physicalPct);\n' +
                            '  vecComp = targetLayer.toCompVec(vec);\n' +
                            '  ang = radiansToDegrees(Math.atan2(vecComp[1], vecComp[0]));\n' +
                            '  value + ang;\n' +
                            '} catch(e) { value; }';
                        
                        var rotProp = rot.threeDLayer ? "Z Rotation" : "Rotation";
                        rot.property("Transform").property(rotProp).expression = orientExpr;
                    }

                    if (useTrim) {
                        var opacityExpr =
                            'try {\n' +
                            '  ctrl = thisComp.layer("' + pivot.name + '");\n' +
                            '  pct = effect("Path Position")("Slider") % 100;\n' +
                            '  if (pct < 0) pct += 100;\n' +
                            '  lS = Math.min(ctrl.effect("Limit Start")("Slider"), ctrl.effect("Limit End")("Slider"));\n' +
                            '  lE = Math.max(ctrl.effect("Limit Start")("Slider"), ctrl.effect("Limit End")("Slider"));\n' +
                            '  (pct >= lS && pct <= lE) ? value : 0;\n' +
                            '} catch(e) { value; }';
                        kid.property("Transform").property("Opacity").expression = opacityExpr;
                    }

                    if (isTwisted) {
                        var kidRotProp = kid.threeDLayer ? "Z Rotation" : "Rotation";
                        var twistExpr =
                            'try {\n' +
                            '  tAngle = thisComp.layer("' + pivot.name + '").effect("Twisted Angle")("Angle");\n' +
                            '  tRate = thisComp.layer("' + pivot.name + '").effect("Twisted Rate")("Slider");\n' +
                            '  tIdx = effect("Clone Index")("Slider");\n' +
                            '  twistVal = tAngle * tRate * tIdx;\n' +
                            '  value + twistVal;\n' +
                            '} catch(e) { value; }';
                        kid.property("Transform").property(kidRotProp).expression = twistExpr;
                    }

                    rot.shy = true;
                }
                pivot.shy = false;
                comp.hideShyLayers = false; comp.hideShyLayers = true;
                for (var j = 1; j <= comp.numLayers; j++) comp.layer(j).selected = false;
                pivot.selected = true;
            } catch(e) { alert("Lỗi Rig Path: " + e.toString()); }
            app.endUndoGroup();
        };


// --- CLONE MORE BUTTON LOGIC (DÙNG CHUNG) ---
        var cloneMoreLogic = function () {
            var activeTab = tpanel.selection.text;
            var addCount = 0;
            
            // Đọc ô Input tương ứng với Tab đang mở
            if (activeTab === "Tròn") {
                addCount = parseInt(cloneMoreInput.text);
            } else if (activeTab === "Path") {
                addCount = parseInt(pathCloneMoreInput.text);
            }

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
            
// Kiểm tra xem đang thao tác trên Null Tròn hay Null Path
            var isPathMode = pivot.name.indexOf("Clone on Path Control") !== -1;

            if (pivot.name.indexOf("Pivot Null") === -1 && !isPathMode) {
                var proceed = confirm("Bạn đang chọn layer không có tên Pivot Null hoặc Clone on Path Control, bạn có chắc đây là layer điều khiển và muốn tiếp tục?");
                if (!proceed) return;
            }

            var pivotFx = pivot.property("Effects");
            var totalClonesCtrl = pivotFx ? pivotFx.property("Total Clones") : null;

            if (!totalClonesCtrl) {
                alert("Không tìm thấy thông số 'Total Clones' trên layer này. Có vẻ nó không phải là Null điều khiển chuẩn.");
                return;
            }

            // --- KIỂM TRA TRUE CLONE VÀ HIỆN CẢNH BÁO ---
            var isTrueClone = trueCloneCheckbox.value;
            if (isTrueClone) {
                var confirmMsg = "";
                
                if (isPathMode) {
                    confirmMsg = "Bạn sắp Clone THÊM tận gốc " + addCount + " lần dọc theo Path.\n\nBạn có chắc chắn muốn tiếp tục?";
                } else {
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
                    
                    var currentAngle = 0;
                    try { currentAngle = pivotFx.property("Angle").property("Angle").value; } 
                    catch(e) { currentAngle = parseFloat(angleInput.text); }
                    
                    confirmMsg = "Bạn sắp Clone THÊM tận gốc " + addCount + " lần theo hình tròn\n" +
                                 "- Cách nhau " + currentAngle + " độ\n" +
                                 "- Xoay quanh \"" + pivot.name + "\"" + axisText + "\n" +
                                 rotateText + "\n\n" +
                                 "Bạn có chắc chắn muốn tiếp tục?";
                }
                                 
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

                    // Sửa lại biểu thức Path Position cho Clone Layer để nó đọc đúng tên Null mẹ mới
                    if (isPathMode) {
                        try {
                            newKid.property("Effects").property("Path Position").property("Slider").expression = 'thisComp.layer("' + newRot.name + '").effect("Path Position")("Slider");';
                        } catch(e){}
                    }

                    newRot.shy = true;

                    newRot.moveAfter(currentRotPlacement);
                    newKid.moveAfter(currentKidPlacement);

                    currentRotPlacement = newRot;
                    currentKidPlacement = newKid;
                }

                totalClonesCtrl.property("Slider").expression = (currentTotal + addCount).toString();

                comp.hideShyLayers = false; // Tắt đi bật lại
                comp.hideShyLayers = true;

            } catch (error) {
                alert("Đã xảy ra lỗi khi Clone More: " + error.toString());
            }

            app.endUndoGroup();
        };

        // Gán hàm logic vừa tạo cho nút ở tab Tròn và nút ở tab Path
        cloneMoreBtn.onClick = cloneMoreLogic;
        pathCloneMoreBtn.onClick = cloneMoreLogic;

        return panel;
    }

    var myPanel = buildUI(thisObj);
})(this);