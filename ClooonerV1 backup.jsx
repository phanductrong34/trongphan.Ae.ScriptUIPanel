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

        // Checkboxes each in own row
        var controllerGroup = panel.add("group");
        controllerGroup.orientation = "row";
        var controllerCheckbox = controllerGroup.add("checkbox", undefined, "Controller");

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

        // Clone and Help button on same row
        var btnGroup = panel.add("group");
        btnGroup.orientation = "row";
        btnGroup.alignment = "left";

        var cloneBtn = btnGroup.add("button", undefined, "Clone");
        cloneBtn.preferredSize.width = 120;
        try {
            var g = cloneBtn.graphics;
            g.backgroundColor = g.newBrush(g.BrushType.SOLID_COLOR, [0.88, 0.88, 0.88]);
        } catch (e) {}

        var helpBtn = btnGroup.add("button", undefined, "?");
        helpBtn.maximumSize.width = 25;
        helpBtn.onClick = function () {
            alert(
                "Để bắt đầu clone, chọn 2 layer:\n" +
                "- Cái đầu tiên là Null Layer (dùng như tâm xoay)\n" +
                "- Cái thứ hai là Layer muốn đúp (Nên có anchor Point ở chính giữa)\n\n" +
                "Nhập Góc xoay ở độ, và Số layer đúp.\n" +
                "Tool sẽ clone đúng số layer đúp và mỗi layer sẽ cách nhau đúng bằng Góc xoay.\n\n" +
                "Các tuỳ chọn bao gồm:\n" +
                "- Controller: Thêm controller GÓC XOAY, BÁN KÍNH và ĐỘ LỆCH BÁN KÍNH vào Pivot Null để điều chỉnh\n" +
                "- Normalize: Layer clone không xoay cùng với pivot, tạo hiệu ứng như đu quay mặt trời\n" +
                "- 3D: Bật khi bạn sử dụng layer 3D, chọn thêm trục muốn đúp\n\n" +
                "Lưu ý: Khi xoá, bạn phải tắt chế độ Shy và xoá cả các Null ẩn để không bị lỗi, đồng thời tắt expression ở các layer clone."
            );
        };

        var footerGroup = panel.add("group");
        footerGroup.add("statictext", undefined, "Một plugin bởi trongph.animation");

        // Helpers
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

        // Clone logic
        cloneBtn.onClick = function () {
            var angle = parseFloat(angleInput.text);
            var totalClones = parseInt(cloneInput.text);
            var useController = controllerCheckbox.value;
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

            if (useController) {
                ensureControl(pivot, "Angle", "ADBE Angle Control", angle);
                ensureControl(pivot, "Radius Ratio", "ADBE Slider Control", 100);
                ensureControl(pivot, "Stagger", "ADBE Slider Control", 100);
            }

            var rotators = [], children = [];
            var originalKid = null;

            for (var i = 0; i < totalClones; i++) {
                var rot = (i === 0) ? parent : parent.duplicate();
                var kid = (i === 0) ? child : child.duplicate();

                rot.parent = pivot;
                kid.parent = rot;

                rot.threeDLayer = kid.threeDLayer = make3D;

                if (useController) {
                    rot["rotation" + axis].expression =
                        'ctrl = thisComp.layer("' + pivot.name + '").effect("Angle")("Angle");\n' +
                        'ctrl * ' + i + ';';
                } else {
                    rot["rotation" + axis].setValue(angle * i);
                }

                if (normalize) {
                    var axisProp = (axis === "Z") ? "rotation" : axis.toLowerCase() + "Rotation";
                    kid["rotation" + axis].expression =
                        '-parent.rotation' + axis + ' - thisComp.layer("' + pivot.name + '").transform.' + axisProp + ';';
                }

                if (useController) {
                    var nullPos = rot.transform.position.value;
                    var clonePos = kid.transform.position.value;
                    var dir = [
                        clonePos[0] - nullPos[0],
                        clonePos[1] - nullPos[1],
                        make3D ? (clonePos[2] - nullPos[2]) : 0
                    ];
                    var len = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2) + Math.pow(dir[2], 2));
                    var norm = [dir[0] / len, dir[1] / len, dir[2] / len];

                    var expr = ''
                        + 'ratio = thisComp.layer("' + pivot.name + '").effect("Radius Ratio")("Slider") / 100;\n'
                        + 'stagger = thisComp.layer("' + pivot.name + '").effect("Stagger")("Slider") / 100;\n'
                        + 'i = ' + (i + 1) + ';\n'
                        + 'scale = Math.max(0, 1 - (1 - stagger) * i);\n'
                        + 'dir = [' + norm[0] + ',' + norm[1] + ',' + norm[2] + '];\n'
                        + 'parent.position + [dir[0] * ' + len.toFixed(4) + ' * ratio * scale, dir[1] * ' + len.toFixed(4) + ' * ratio * scale, dir[2] * ' + len.toFixed(4) + ' * ratio * scale];';

                    kid.transform.position.expression = expr;
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
            comp.hideShyLayers = true;

            if (!useController && !normalize) {
                rotators.forEach(function (r) { r.remove(); });
                children.forEach(function (c) { c.parent = pivot; });
            }

            app.endUndoGroup();
        };

        if (panel instanceof Window) {
            panel.center();
            panel.show();
        } else {
            panel.layout.layout(true);
        }

        return panel;
    }

    var myPanel = buildUI(thisObj);
})(this);
