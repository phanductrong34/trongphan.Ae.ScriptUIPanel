/*
    Script Reloader cho After Effects
    Hỗ trợ phát triển và test nhanh các ScriptUI Panels
*/

(function(thisObj) {
    var scriptName = "Script Reloader";

    function buildUI(thisObj) {
        // Tạo panel (dockable) hoặc window (floating)
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable:true});
        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 10;
        win.margins = 16;

        // --- UI Components ---
        
        // Group Header
        var headerGroup = win.add("group");
        headerGroup.orientation = "row";
        headerGroup.alignChildren = ["left", "center"];
        headerGroup.add("statictext", undefined, "Chọn Script để test:");
        
        var refreshBtn = headerGroup.add("button", undefined, "↻ Làm mới");
        refreshBtn.helpTip = "Tải lại danh sách file trong thư mục ScriptUI Panels";

        var scriptList = win.add("dropdownlist", undefined, []);
        scriptList.alignment = ["fill", "top"];

        // THÊM VÀO: Checkbox chọn chế độ mở script
        var dockableCb = win.add("checkbox", undefined, "Mở dạng Dockable Panel");
        dockableCb.value = false; // Mặc định = false (mở dạng cửa sổ nổi để test nhanh)

        var reloadBtn = win.add("button", undefined, "🚀 RELOAD SCRIPT");
        reloadBtn.alignment = ["fill", "top"];

        // --- Logic ---
        var files = [];
        
        // Đường dẫn tới thư mục ScriptUI Panels
        var currentScriptFile = new File($.fileName);
        var scriptFolder = currentScriptFile.parent; // Lấy thư mục chứa file này (ScriptUI Panels)

        // Hàm lấy danh sách file
        function loadFiles() {
            scriptList.removeAll();
            files = [];
            
            if (scriptFolder.exists) {
                var allFiles = scriptFolder.getFiles();
                for (var i = 0; i < allFiles.length; i++) {
                    var f = allFiles[i];
                    // Chỉ lấy file .jsx hoặc .jsxbin và bỏ qua chính file công cụ này
                    if (f instanceof File && (f.name.match(/\.(jsx|jsxbin)$/i)) && f.name !== "Script Reloader.jsx") {
                        files.push(f);
                        scriptList.add("item", decodeURI(f.name));
                    }
                }
                
                if (files.length > 0) {
                    scriptList.selection = 0;
                    reloadBtn.enabled = true;
                } else {
                    scriptList.add("item", "Không tìm thấy script nào...");
                    scriptList.selection = 0;
                    reloadBtn.enabled = false;
                }
            } else {
                alert("Không tìm thấy thư mục ScriptUI Panels tại:\n" + scriptFolderPath);
            }
        }

        // Gán sự kiện
        refreshBtn.onClick = loadFiles;
        
        reloadBtn.onClick = function() {
            if (scriptList.selection !== null && files.length > 0) {
                var selectedFile = files[scriptList.selection.index];
                if (selectedFile.exists) {
                    try {
                        if (dockableCb.value) {
                            // CHẾ ĐỘ DOCKABLE: Tìm và kích hoạt lệnh từ menu Window của AE
                            var commandId = app.findMenuCommandId(selectedFile.name);
                            if (commandId !== 0) {
                                // Lệnh này hoạt động theo cơ chế Toggle (Bật/Tắt)
                                // Nếu panel đang mở -> Bấm sẽ ĐÓNG. Bấm lần nữa -> Sẽ MỞ LẠI bản mới.
                                app.executeCommand(commandId);
                            } else {
                                alert("Không tìm thấy lệnh menu cho script: " + selectedFile.name + "\n\nLưu ý: Nếu đây là file mới copy vào, bạn phải khởi động lại AE một lần để AE xếp nó vào menu Window đã nhé.");
                            }
                        } else {
                            // CHẾ ĐỘ FLOATING: Mở dạng cửa sổ nổi như cũ
                            $.evalFile(selectedFile);
                        }
                    } catch(e) {
                        alert("Lỗi khi chạy script (" + decodeURI(selectedFile.name) + "):\n\n" + e.toString());
                    }
                } else {
                    alert("File không tồn tại. Vui lòng bấm 'Làm mới' danh sách.");
                }
            }
        };

        // Chạy lần đầu tiên
        loadFiles();

        // Responsive resize
        win.onResizing = win.onResize = function() {
            this.layout.resize();
        };

        return win;
    }

    var myPanel = buildUI(thisObj);
    if (myPanel != null) {
        if (myPanel instanceof Window) {
            myPanel.center();
            myPanel.show();
        } else {
            myPanel.layout.layout(true);
            myPanel.layout.resize();
        }
    }
})(this);