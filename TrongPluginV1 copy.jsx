(function(thisObj) {

    function buildUI(thisObj) {
        var panel = thisObj instanceof Panel ? thisObj : new Window("palette", "KeyShooter2.1", undefined, {resizeable: true});


        var tabPanel = panel.add("tabbedpanel");
        
        // group.orientation = "column";
        // group.alignChildren = ["center", "center"];

      
        // // Create a group to hold the tabs
        // var tabGroup = panel.add("group");
        // tabGroup.orientation = "column";
        // tabGroup.alignChildren = ["center", "center"];

        //Create Overshoot tab
        var overshootTab = tabPanel.add("tab", undefined, "Overshoot");
        var overshootGroup = overshootTab.add("group", undefined, {name: "overshootGroup"});
        overshootGroup.orientation = "column";
        overshootGroup.alignChildren = ["center", "center"];
        overshootGroup.margins = [10, 15, 10, 10]; // Thêm 15px padding top cho thoáng

        // --- OVERSHOOT TAB: PHẦN TRĂM ---
        var percentageMainGroup = overshootGroup.add("group");
        percentageMainGroup.orientation = "column";
        percentageMainGroup.alignChildren = ["center", "center"]; // Căn giữa toàn bộ
        percentageMainGroup.spacing = 5;

        var percentLabelGroup = percentageMainGroup.add("group");
        percentLabelGroup.add("statictext", undefined, "Percentage:");

        var percentControlGroup = percentageMainGroup.add("group");
        percentControlGroup.alignChildren = ["center", "center"];
        var sliderPercent = percentControlGroup.add("slider", undefined, 20, 0, 100);
        sliderPercent.size = [100, 15];
        sliderPercent.helpTip = "Drag to set overshoot percentage";

        var inputPercent = percentControlGroup.add("edittext", undefined, "20");
        inputPercent.characters = 4;
        inputPercent.helpTip = "Enter overshoot percentage (Can exceed 100%)";

        // Đồng bộ Slider và Edittext (Cho phép nhập lố 100%)
        sliderPercent.onChanging = function() {
            inputPercent.text = Math.round(sliderPercent.value).toString();
        };
        inputPercent.onChange = function() {
            var val = parseFloat(inputPercent.text);
            if (isNaN(val)) val = 0;
            if (val < 0) val = 0; // Chỉ chặn số âm, không chặn max 100
            inputPercent.text = val.toString();
            // Slider chỉ max 100, nếu nhập quá thì thanh kéo kịch kim nhưng số vẫn giữ nguyên
            sliderPercent.value = (val > 100) ? 100 : val;
        };

        // group số key frame
        var frameCountGroup = overshootGroup.add("group");
        frameCountGroup.alignChildren = ["left", "center"];
        frameCountGroup.add("statictext", undefined, "Keys to insert:");

        var incrementGroup = overshootGroup.add("group");
        incrementGroup.alignChildren = ["left","right"];

        var btnMinus = incrementGroup.add("button", undefined, "-");
        btnMinus.size = [20,20];

        var inputCount = incrementGroup.add("edittext", undefined, 1);

        var btnAdd = incrementGroup.add("button", undefined, "+");
        btnAdd.size = [20,20];
        
        inputCount.characters = 5;
        inputCount.onlyNumbers = true;
        inputCount.helpTip="Enter the number of overshoot keyframes to insert"
    
        // checkbox chèn giữa
        var checkbox = overshootGroup.add("checkbox", undefined, "Insert in Middle");
        checkbox.value = true;

        // Add button and event
        var buttonGroup = overshootGroup.add("group");
        buttonGroup.alignChildren = ["center", "center"];
        var button = buttonGroup.add("button", undefined, "OverShoot!");


        // EVENT
        button.size = [140, 30];
        button.onClick = function() {
            OverShoot(checkbox.value, Number(inputPercent.text), Number(inputCount.text));
        }

        btnAdd.onClick = function() {
            var val = parseInt(inputCount.text, 10); 
            if (isNaN(val)) val = 0; 
            
            inputCount.text = String(val + 1);
        };

        btnMinus.onClick = function() {
            var val = parseInt(inputCount.text, 10);
            if (isNaN(val)) val = 0;
            
            val = val - 1;
            
            // Lock the value so it never drops below 0
            if (val < 1) {
                val = 1;
            }
            
            inputCount.text = String(val);
        };

// ------------------------- DIVIDER ---
        var divider = overshootGroup.add("panel", undefined, undefined, {borderStyle: "sunken"});
        divider.alignment = "fill";
        divider.minimumSize.height = 2;

// --- OFFSETER PANEL ---
        var offseterPanel = overshootGroup.add("panel", undefined, "Offseter");
        offseterPanel.orientation = "column";
        offseterPanel.alignChildren = ["center", "center"];
        offseterPanel.spacing = 8;
        offseterPanel.margins = 15; // Tạo khoảng đệm cho đẹp

        // --- LAYER MODE CHECKBOX ---
        var layerModeGroup = offseterPanel.add("group");
        layerModeGroup.alignment = "left";
        var chkLayerMode = layerModeGroup.add("checkbox", undefined, "Layer Mode");
        chkLayerMode.value = false; 
        chkLayerMode.helpTip = "Toggle to affect layers instead of keyframes";

        var offsetSpacer = offseterPanel.add("group");
        offsetSpacer.preferredSize.height = 5;

        // --- OFFSET UI ---
        var offsetMainGroup = offseterPanel.add("group");
        offsetMainGroup.orientation = "column";
        offsetMainGroup.alignChildren = ["center", "center"];
        offsetMainGroup.spacing = 8;

// Row 1: Offset & Step Settings
        var offsetRow1 = offsetMainGroup.add("group");
        offsetRow1.alignChildren = ["left", "center"];
        
        offsetRow1.add("statictext", undefined, "Offset:");
        var inputOffset = offsetRow1.add("edittext", undefined, "3");
        inputOffset.characters = 3;
        inputOffset.onlyNumbers = true;
        inputOffset.helpTip = "Frame gap between properties/layers";
        
        offsetRow1.add("statictext", undefined, "Step:");
        var inputStep = offsetRow1.add("edittext", undefined, "1");
        inputStep.characters = 3;
        inputStep.onlyNumbers = true;
        inputStep.helpTip = "Number of properties/layers moved together per step";

// --- BINARY ICON STRINGS ---
        var binSeqFwd ="\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x01\x1DIDATx\x01\u00ED\u0094\u00CD\x11\u00820\x10\u0085\x1F\u00DA\u0080%P\u0082-\u00D8\u0081\x1D\u0088\x1D8\u00E2\u00C1\u009BX\u0080?%`\x05\u00DA\u0081%\u0088\x1DP\u0082wd\u00E2f\u008D\u00CA?\x13\u0087p\u00817\u0093!\u00B3I\u00F8\u0092\u00DD7\x0B\u00F4\u00EA\u00D59\u00895l\u00B1\u00C4\x06\r\u00CBB\r\x14\x11\u00AE4\u00B5i\u00F8\u00D6\x0Es\u0098\x06g\u00A0\x1F5\x06\x1F\u0094\u00AED8d\u00A0R\u008Ep1\u0085Qp\u00CC/\x0BR1\u0081-\u00BD\u00F8\u0082\x06T]\u00E3\x05F\x18r\u00BA\u00C7\f\u00DD\u00C3C[\u0092pr\u00B5\u0093\u008B\u00AF\u00B01\u00E1\u00F6\u00EA\u00CBH\u00A8\x0B\u00C1\u00E3O\u00B8\u00A5\u00B9\u009F\u00A1\u0094v/\x1D\u0084Ge\u00D8BC\x03\u009D\u00CD\\s\u0091O;\u00FDE\u00DB\u00E9Z`\u00EB\u0088\x07\u00B9}B\u00D3\u00F0\x17$\u00E7?9f\x0E\u00AC\u00E0\u00E1\x17\u00AE\u00A0|!%n<&Ei\u00B79\u00F5\u00C9\u0098\u008B\u00992\u00DD\u00AC\u00EE\u00BC\u00B6\u00B9J/\u00F2\u0086\u00F9\u0089\u0090C\u00CD\u00E6\x04\u0093`\u00D5F\u00CF\x05K\u00A5p\u00ED\x1A\x17*\u00E6\u00D6\x1Af\u00A2\u00D2\u0088\u00F7\u00B2#\u00CD\u00A5\u009Aj\u00AE\u00DA\u00AB\u00AD\u00A0\u00D2t\x01\u00DA\x10\x1Bn\u0085\x1B}\u00C7\u00E8\u00D5\u00ABsz\x01kjd\u00D7GI\u00BA\u00C9\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binSeqRev = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x01\x1CIDATx\x01\u00ED\u0094\u00C1m\u00C20\x18F\u009F+\u00F5\u00D6CG\u00A0\x1Bt\x04\u00D8\u00A0#t\u0084*\u00E5\u00C0\r\u00E7\u00C6\x05\u00C4\x06\u00C0$\u00AC\u00C0\x06\u0084\r\x10\u00E2\u00C0\x05\u00CCo\x0B!\x12\b\u00C1\u00C4p@~R\x14\u00DB\u0089\u00FDb\u00E7\u00B3!\x12\u0089\\\u00C1h>\u00CD?#{\u00AFz\u00F7\u008D@8\u00D9\u009A\u00A9\x14\x7F\u00ED\u00BDJ\u00AE\b)5|\u009F\u008C<\u00E3\u0083\u0096\u00D2,/\u00F5\t3\u00E3\x15?9\u00A9\u00FB\x1A\u00A9\u00AFd\u00F6%\x04\x11\u00AB\x01c\u0099aZ\x10\u00A7\u00D2>\u00E4\x19\u00986Z\u00C2eL\u0082\u00E6Q\u00B8\u00F4&t9\u00977o\u00E9\x7FW\u00B8\u00AC\x14\x0E\u00FF\u00CF\u00A0eIS\u00CF!\u00FC\u00C59\u00E9\u00B1\u00D1_\u00EE\x15.\u00F3\u00E7\u00F6f\u00F3\u00EC\u0081\u00E2\x0BO\u00BC\u00C4j({rKK\u008A\u00D9I\u00F3D\u00F5\u00CB\u00B7M-\u008A\u00A7\u0090\u00CC\u00BC!K>\u0097k\u00CC\u00A3\u0090\u0094v\u009D\u00A4C\u00A3(\u00A7\x06\u00AAJj\u0083s\u00A8f\u00BC\u00CB\x11\u00D8\u00CB-sxqAJhyy\u00B8v,.\u00B6o\b\u00C2\u00F5\u00A5N$\u00AD\u00CA\u00ED[Kf\x13-\u00C9\u00CEx\x06V\u00EE\u00C2U3L\u0091\u00C8\u00EB\u00B3\x07\u00FF{b\u00F2D.\f\u0082\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binSeqRnd = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x01\x15IDATx\x01\u00ED\u0094\u00CD\r\u00820\x18\u0086\u00DF\u00EA\u00D9\u0084\x11p\x03\x1D\u00C1It\x04\u00A3\x1E\u00BC\u00897/\x1AG\u00D0I\x1CA\u009D@G\u00E0\u00E0\u00CD\u0090\u00CF\u00AF\u0080A)?\u0085\u0082\x17\u00FB$$P(O\x7F\u00DE~\u0080\u00C5b\u00C9\u0081\x16X\u00D1\x1Cc\u00DD\u00EF\x05\x1A@JA\u00F0\u00E2\u00C7\u0089\u00D8\u00E2X\u00D6\u00C7X\u009C\u0092BWn$\u00A6%\\<q\u00E6['\u00F5\u00EA\u008E\x1E\u0086\u00C2\u0083\u009F\u00D7\u00B7\x03\x03\u00C4\u0086\x05\x01F|\u00EB\x7FI\u00B9\u00ADH\x1A\u00F6E\x03\u00D0\x14\x03tq\n\x07 \u00A5{\u00967\u00F2c\x0F\x0E\u00EF\u00E5\u00B9(\u00B5R\u00CE\u0097\x0BMJg,\u00A5x\u00F0l\u0088g\x15\u00A1\u0095Z#q\u0086\x14M\u00C9\u008B\u00C3\u00E5\u00B3\u0098\u0094\u00C4\u00F2\u0088\u00D0\u0087!\u00E5K-\u00F7-\n\u008E\x1BK\u00D7b\u00A7\u009C\u00DBv\u0090r\x0E\u00D6\u008Df\u00AA0<\u00CB-\u00CB\u0095%\u0097)\u00E7\u008B\u00AA\u00D4\u00E87\u00B5\u00CFq,;|4U\n\\-q\u0086\u00B4\u00B2\u00BC^\u00C9\fp\x05\u0094\u0092\u00E8\u00C7\u00EDZ\u00D4_\u00EA\u00A4L:HJ\u00E5\x05\u00BF ,\u00932\u00EDS\u00A5\u00C0X,\x7F\u00C8\x0B\u00B6\u00D5e\u00FE\u008EDv\n\x00\x00\x00\x00IEND\u00AEB`\u0082"
        var binAlign   = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x01lIDATx\x01\u00ED\u0095MJ\u00C3@\x14\u00C7\u00FF\u00AF*.D\u0088{\x0B\u00BD\u0080\x10\u00C1\u00B5\u00B6K\u00BD\u0084\x1E\u00A1\u00C5\n\u00EE\u008C;\u00C1\x0Fz\u0083\u00C4\x0BX\u00F5\x02iO\u00D0n\u00BA\u008F\u00C5\x03\u00F8-\"6\u00BE\u00A4c!\u00B1\u00C9L\u009A\u00D2,\u009A\x1F\f\u00F9\u00E0M~\u00EFM\u00F2&@NNV\u00B8\u0080\u00CE\u00C3\x14C\u00C3\u00AC`Y\u0099\u0087+F\tS\u00A2\u0080\u008C\u00C8L\u00BC\u00A8\x10\u00E3\u00F4\u008AEg@\u0084\u008D~\u00FF\tSBZ1\u00B1\u00D8\u00DA\u00DDn\u00DF\u00EFm\u00B5\u00F8\\*v\u008F\u00D5\u00BE\x03\u0092>\u00C8\u0080\u00F6\u00FE\u00B2\u00DCY\u00A1/`\t\x15:\u0083\x13\x19{\b\u0093\x0FeY\u009CT\u00ECI\u00F1\x06\u009B?m]\u00DCr\u00A2\x1E*\u00A4\x07\u00B2\u00B8?\u00E2\u0097:(\u00F5(\u00E1\x1B\u00B6\u009FP\u00B442N]\f\u00DC\u008D\u00B9\u00D7&#\u00F4\u00AE\t\x0FJq\u0081)\x12\u00DC:\f\u00AE\u00FAD\\^\u00D3e\u00A0\u00B2\u00C4q\u0089\u00E8U\u00D7\u009B\u008F\u00B5\u00B5\u0096,\u00CE\u0093\u00F3\u00B2[P@\u00A5\u008Fa~\u00EC<k\u0085O^\u00B6\u009B\u00F1\u00C2#\u00E8t\u008E.]p\u00D5\u008A\u00A4n'\u00AEp\u009F\x0F\x16/\u00B3AW8\u0085\"\u00A9\u00DAi$\x1DMP\u0097\u00C7\u008B\u00EB\u00E8\u0084\u00DAi(_\u00C5&^y\u00A3\x00\u009A\u00FF'\u00A1\u00C6\u00F2\x06$L\u00DEN?\u00E8\u00FAI\u0084\u0093\x1A\u00E0\x16\n\u00A4j'\u00B7\u00CA\x1B\u00C5\x02\u00BF\u008A\u00E1\x7F\u00DA\u00E1d*\u00D4\u0088\u00DF*\x13\x11\u00D7N\u009E\u009C\u0093\u00B3\u00FD$rr\u00E6\u009A_\u008E\u00DD\u009CUlC\u00F9 \x00\x00\x00\x00IEND\u00AEB`\u0082"
        var binShift = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x01\u00C7IDATx\x01\u00ED\u0094?O\u00C2@\x18\u00C6\u009F\u00B3:A\f\u00831\x0E\x0Eua\u00E6#\u00E07\u00F0\x1B\x107bL\x04\u00C1\u00C4\u00CDcs@\u0083\x1B\u009B\u00FA\t\u008C\u009F@\\\x1C\\\u00C4\u00C9\u0091&\x0E&F\u0093&8\u0098h=\u00DF;\u00DA\u0083\x16Zh\u00C0?C\u009F\u00A4\u00DCq\u00EF\u00F5~\u00D7\u00BB\u00E7}\u0081D\u0089~H,*(\u0080\x03jLz\u00EEib\x03\u00BF%\x02_\u00D1#d\u008B\x19k\x0E\x7F\u00A4\u00FF\t~I\u00A7\u00AFo\u00B2Y\u00D8\u00A9T\x1B3V\u00A4\u00B9\u008A\u00C5\u00A2\u00E98N\u00C70\u008C\u00B5f\u00B3iy\u00E3b\x0F9\x18\u00B0\u00D9!\u00AC\u00E0;\u0082#\u0083.\n\u00EC\b'Qk\u00C7>j\x05\u00FD\"\u00B3}\u0090\u00F1\u00F6\u0095\u00E3\u00FD\u00D07e\u00C4\u0086\u00D8U\x191\x1B\u00B0\u0086\u0082\x002\u00CD\x06\u00E0\x1A*h\u008E\x14\x03\u008F\u0082O\f\x16%Z\u00B8\x0F\u00F5d\u00E2\x13\x17\u00AA\u00D7\u00C5\u00A9\u0086z\u0092\u00F0*\u00F2\u0098\x06\u00CC\x1A\u00B0i\u00A1\u00E0\u00BD\u00D9\x04\u00DET=\x07e\u00FA\u00B5|Q\u0081\x1A\u00AB\u00A3\u0085i\u00C0\n^\x07'xMC\x1D\u00AC\u00D3\u0086\u00DA\u00EE\u00C6,\u00F9_\u00C3%\u00F4\u0098\u00E6\u0087(\u00B6\u00B94|\x00\u00AAc\x1E\u009C\u00A1\x1C\x05\u0095\u009A\u00C7\x18\u00AD\x1A\u00AFx\u00C2\u00F20\x1C\u00AE\u00A1\u00DE\u0091\x19L+\x05\u009F\u00B6\u00AE?W\x16wD\u0085j\u00F5\bwJ(\x19\u00E7\u008E\u00E2\u009D`ZM\u00A2\u00D0\x02B\x0B\x16\u00A89\u00EB\x0F\u0080\u00D3\u00F1\u00D5<\u00A8/u\u00E4\u00BD.\u00D0\u00D1\u008F((a\u009A\x0B\u0081n\u00F8\u00A0\u00BD-\u00CA\u00BC,\u00A9\u00BE\x1F*\u00D5\u00CBi\u00EEK\u00B5\u00F8`2\u00884\u008D\x15\x18\u00B5)\u008F[n\u00FFr\u00E8\x1D\u0081s\u00C6i\u00CE\u0084\n?\u00EA\x12}\u0085\u00A1\n\u0086\u0089@\u00EA\u00A8x\u0095\f&\u00DC\u00BB\x1F\u0093:\u00B1u\u00BBe\u00E6\x1E\u00CBK\u00E2a{%?*.\u00E1t\u00FC\x1C\u0089\x12%\"}\x03\u00EA\u00C3\u00AB@\u0087\u009C\u009Cx\x00\x00\x00\x00IEND\u00AEB`\u0082"
        var binCloneIcon  ="\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00P\x00\x00\x00\x1E\b\x06\x00\x00\x00\u00BBC\u0099\u00B1\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x02\u00FBIDATx\x01\u00EDX?o\u00D3@\x14\x7Fn\x00\u0089\u00CDR\x19\x19\x1C\x06T\u00A9\x03\x19`\u00E8\u0084\u00F3\th?A\u0093!b\u00A4\b1Sf\x06\u00C2\u0096\u00ADad@mG\x04\u0092\u0083\u00C4\u0082\x18\x1A>A\u00CC\u008A\u0090j\u00B6\u0088\u0090\x1C\u00EF\u00D9\u00EFj\u00C7u\u00ED;\u009B*it?\u00E9\u00A7\u008B\u00DF\u00BD\u00DC\u009F\u009F\u00DF{w\t\u0080\u0081\u0081\u0081\u0081\u0081\u00C12A\x00xH\u0081<\u0080\x15\u00C7\x1A\x18T\u0082\x11\u00B0\"\u008C\u0080\x15q)\x02~\u00DA\u00DC<\u00EE\u00BB.\u00F8\u00EB\u00EB\u00C7\u00B0\u00E2\u00B8\x06\u009A\x10B\u00D8\u0096e\x05y>\u00EF\u00B6\u00B6\u0086\u00E8\x03_76\u0086\u00D0\u00EB\u00C1\u00FF\x00\u00CD\u008B\r\u00CD\u00ED\u00F3\u00F3\x0Bl~\u00E3s\x17\x16\b\u00AD\b\u00C4E\u00EFb3\u00C2\u00B6\u0091\u00E7w\u00E7\u00FA/\u00DA,<\u00BE\u00F9\u00F1!T\x04\u00CE\u00B5\u008D<\u00C1\u008F\u00A7<\u00B7\u00E0.\x17\u00F9\b\x16\fe\x01Y\u00BC>\u0092\u00C4\u00F1.\x12Q<\u0087\u00C6\u00F6\u008Do\u00E1\u00F5\u00E5\u00B6\u00F5\u00B3/\u009E\u00C1.\u0094\x04\u00CE\u00D1\u00C2\u00E6\x10\u00F9\x19Yg6a\u0089\u00A0$`B<\u0089L\x11I<\u0098\u0081W\u00B3fv\u00C2\\EDJ\u00D3\x01\u00A6\u00E9\x1E\u00A5.s\x00\u00D9k|\u0082\u00A4\b=E\x1E \x1D\u00B6w\u0091\x1ES\u00F6\u00D9\u00DC\u00E7$\u00EC'E\u0099\u0095\x05\u00D5\b\u00FC\u008E\f\n\u00BD&\u0099\u00D6\x00\u00A6\u00E1\u00F7\u00B5\u00C0\u009Bt \u008A\u00BE\"\u00DF\x166T\x0B\u009FB\x14\u00A1.\u00C4\u0097x\u009B\u009F\u00DF _\"[L\u0082\x07\u00D1\u00BE\u00EA<\u00CF!hBI@|\u00EBC^\u0098\x14\u0091\u00DA&\u00DBc\u00BF.\fQ\u00AC\u00E6T\u00ACE~\u00C2\"\u00F1\u009A\u00A1]\x1F\u00B6\u0086/E8\x1D\\G\u00BC&\x12\u00CB\u0095Q\u0088\u00F0\u00B9O\x1E86G\u009B\u00C3\u00F3\u00BCF\u00DE\u00A3\u00E7\u00C4w\u0094\u00A0\\\x03\x13\"\u00FA\u0090!\u00DE\u0099\x1F\u008A\u00F5\u00FE\u00CF\u00836}\u00FE2\u00B9\u00BBSR<\u00E0\u00D3\u0096^\u0084\u00CAAT\u009C\x1D\x17\u0083\u00B2\u0083\u00A2\u00EF-\u00B2-OyUh\u009D\u00C2$\x1A\u00B2\u009E\x16\u008Fjd\u00B2~\u00FC\u0098\u00DC\n7\u00F4\u00E1\u00EF}\x7F\u00CE\x0FkdX'\u00D5A)\u00E7r\u00DDr\u00B9f\u00B9\u0089~\x19\u00A5$B\u0083\u00FB\u00C9F\x11\u00E9\x17\u0088A}\u00F2\x05\r\u0090G\u00DCj\u00A1\u00F2E:q\u00C0xyEX\x1E0DU\x119\u00E5(\u009A]\u0088\u00EA\u00D5\b\u00E2:EQC\u00A2\u00ED\u00A3\u00DF>D\x114b\u0092\u0088;\x05c\x07<\u00B6\u00CD\u00DF\u00A1kR\x0B4aA\x05d\u009C\u00CEam\u00ECt:t\u00E1\u00F5j\u00B5Z\u00BD\u00D7\u00EB\u00F9g\u00E2\u00C5\x11\x13\u00E0\u00ABkZ\u00AF\u00D4\u00D3;}\u0091f\u009BCc\u00C9\u008B}\u0096\u008F\u00E2\u00D8Nr\x1C\x1D\u0094\u008E@\u009E\u00B4\u009F2\u00D3\x06\u00CE\u009Fd\u00B3\u00D0f\u00CF\u00F9\u00CD\u00F4N<\u00DA\\Z\x18\u00BE\u00D6\x04y>\u008Ac\u00FBe\u00C4#\u0094\x16\u0090\x17\u00DAN\u0099i\x11\u00E7Sg\x1A\u00DA\u00829\u00BFi~\u008A]\x15T\u00AA\u0081(b\x1Fb\x113\u00AF6\u00A1\x1F_o\u00D8\u00A7\u00CA\u00D5f\u00E9\u00A0\u00FDgB\x1A$\"\u00FF<\x1DJ\u00F18\x1D\x06\u00E3\u00F18N/\x14L\u00ECE?\u00C3VE<\x03\x03\x03\x03\x03\x03\u0083E\u00E2\x1F\u00D2Tss!(\u00F1^\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binMirrorIcon = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00P\x00\x00\x00\x1E\b\x06\x00\x00\x00\u00BBC\u0099\u00B1\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x02\u00A4IDATx\x01\u00ED\u0098\u00BDn\x13A\x10\u00C7\u00FF\u0087\u00E8(\u009C\u0096\u008A\u00A3H\u00EA\u00F0\x00D\u00F6\x13$~\x02.\u0085;\u00A4\x18B\u009FK\u00CFGx\x02\u009F%zBM\u00E1\u00A3I\u00EB\u00A4\u00A4\u00F2\u00D1\u00D1\u00D9HHT\u00B0\u00CC\u00DC\u00CE\u00C6\u00EB\u008B\u00E5[\u00DF)qt\u00DA\u009F4\u00DA\u00BB\u00B9\u00FD\u00FCgvgc\u00C0\u00E3\u00F1x<\u009E\u00FB\u0086\x02&d\u008Al\u0080\x06\u00F3\x00\u009EZx\x01k\u00E2\x05\u00AC\u00C9\u00AD\tx\u00B1\u00B33L\u00DAm~\x1C\u00A2\u00C1\u00AC%\u00A0Rj\u00CB\u00B5\u00EE`o/\u00BD\u00D8\u00DEF\x00\u00A4\x0B}\u00C4p\u00EE\u00C3qN\u00BBd\x07\u00D8\x10\u00CE\x02\u00D2$_\u00803+M\x18\x15\u00C9\u00C5\u00FB\u008D\u0091:.\u00CF\u00CC4N\u00AC4\u0093\u0082\x7F\"\u00FEH\\'b\x1B\u00C1I@\x11/!\u00E3\u00E8\x19U\x11\u00D1\u0088G\u00F7\x1Bn\x1B9\u0088\u00C8ced!\u008D\x17\u00CA<\u00DAK\u00EA\x1D\u0092u\u00B0!J\x05\u00B4\u00C43\u00AC-bA<C\u0099\u0088F\u00C0\x19\u0099\u00D9\u00A2\\\u00A6\u0085z\u00DC\u00C7\x07\u0099\u00EBg\u00CB\u00CEYp\u0089\u00D8\x13)y\u00BB\u00F3\x1F\u0084\u00E7?%\x1B\u00F37i\x1BZuGV\u0084\u00AF\u00C4%\x02\u00AFd\x11\u00D5\u00E1\u00D6j\u0089_\u00E1\u00C7\u008AV-\u00B2_d_\u00C8\u00F6\u00C5\u00B7/\u00EFL(\u00E5V\u00E1\u00D9\u0088}n\u00D5\u008B\u00A0\u0093\x19\u00CFd$\u00BEg\u00E2\u008BE\u00AC\u0099\u00F8\u00FB\u00D0k\u00BE\u0084\x03\u00A5\x02\x06A\u00C0\x1Du0\x17\u0091\u00CB\u008E\u00F8\u009D\b\u00CE\u00A8\u00CD\u00DF\u00BC\u008Fy\x1B\u0085\u00D3\u00E0=\u00E2\x15\u00CDX\u008C)t\u00C4\u00ED\u00CA\u00F6\rq3\x02\u008Bd4\u00B7.Yb\u00F9\x0E\u00E9=\u00C6\\\u00EC\u008F\u00F4\u00CE\u00F5\u00CE\u00A0\u00A3\u00FC\u0080\u009E\u00CD\u00FA\u00F8[\u00DFu}Ng\u00A0%b\u00865\u00C5\u00BB\u00EE\u00C3\x16\u00B1\\<\x1B\u008E$^\u00F8\x11Yj-\u00B4J6\u009F\x15JC\x0B\x15y\u00E8ZQD{Z\u00F4\u00CB\x19y\u00E5\"j.\u00A2\u00DE:.\u0084\u00D0\u00D14\u00A31R\u00E8\u00AD\u00F9\u00CA\u00FA\u00BE\u00F6\u00A29\u00EA\u00A8\u00AF\u008C\x1E\u00F3s]\u00CE\u00F1\u0090\u00EC\x14\x15\u00A9u\u0091\u00B6\x12\u00CCBR\u00E1\u00A4\u00F1\u00F2\u00D1W}\u00B0\x1F\u00D7\u00FA1\u00C1\u009C\u0091\u00DF\u00A4LQ\u009F.tf\u00E7Sy\f\u00BDe\x13\u00DC5,\u009EZd\u009Ag9\x12O\u00BD\u00C1\u00F8{\u00FF\u00B1\u00EA\u00F5z\u008A\x04T5E\u00BC\x15$\u00EB\u00D6\u00BE\u00D4W\u008A@\u00B9\u0097%\x057Of@\u00D7\u0095\u00A3\u00C2u\u0085\u0089\u00D4\u00EB<\x13\u00DE\x1B$\u0089\u00D4\u00BB]\u00A0\u00A2\u0080<8\u00F4\x05\u00D6\u0086}\u00DD\u00E0m~\u009E\x14\u00FF\u00FF\x1DR\u00D2H\u00D0@*\u009F\u0081rn\x18\x113\u00E8\u00EC\u009C\u00E5\u00DF\u00DE!\u00FA\u00F9\u00AFeD\x1C\u00F2;\x1A\u008As\x16^\x06\u008BH\u00DB\u0099\u00B7\u00C1\u00A5\x11\u00CF\u00F0\u00E9\u00CFs\u00BEc=i\u00B2x\x1E\u008F\u00C7\u00E3\u00F1x6\u00C9\x7F\u00DA\u00F2`%\u00B7}\u00D3l\x00\x00\x00\x00IEND\u00AEB`\u0082";

        // --- LAYER MODE BINARY PLACEHOLDERS ---
        var binSeqFwdLayer = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00\u00ADIDATx\x01\u00ED\u00D4\u00C1\r\u00C20\f@\u00D1\u009FR\u00EE\x1D\u00A1\u00A3\u00C0\bL\x00l\x00\u0082\x01\u00B8\u00C3\x10l\x02#\u00B0\x01\u008C\u00D0\x0B'\x10&\u0082\x13\x10T\u00A7\u00AA\x14U\u00F5;\u00E4\x10Y\u00B6\x14;\x06cLK\\\u00E8R\u00D6\u008C\x10\u00A6\u00E82Tn\u00C7\u0092H\u00F9\u009Fd\u00A5/<CC\u00B8\u00F83\u00BApF\"\u00C9\n\u0087\u009F\u00FA\u00C6\u0091!s4\x1ETt\u0089\u00D3\x04\u00C9\u008A3Z\x19\x13\u00B7\u00E5T\x17\u0096\u00A3S\u00A2%\x14\u009A0\u009B\u00EA0\u00C7\x18\u00AD{}\x7F\u00DF)\x1B\u0090ED\u00CF\x0B\u00BFR7\u00BF_N;\\\u009F\x06\x1C\u00D0\x0E\u00DC\u00F5\u00B5\x0F\u00F6\u00DF\u00D7\u00FD\x1B\u00AEd\u0085\u008D1\u00ADy\x02Z\u00E1\x1B\x1AX40:\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binSeqRevLayer = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00\u00A7IDATx\x01\u00ED\u00D3\u00C1\t\u00C20\x14\u00C6\u00F1\u00FFS\u00EF:B\u00DDD'\u00D0UD\x07p\x00\u0085n n\u00A2\x1B8BG\u00F0\u00E2I!\u00BE^\u00DB@_C \u0087\u00BE\x1F\u0084B\u00F8h\u00DA\u00E4\x0B8\u00E72\x11\x12\u0084#\u00B5>\u0096\u00A6\u00B0p\u0097\x0B\u008F\u00EE\u00F4\u00824;\x1D\u0095))<c\u00D33\n)\u00B6p\u00EAV\x1F\u00F4\u0093W\u00A6\u00E4\u00B7\x7F\u00BEE\u0099Z\x1DNl\b\u00DC0\u0092+\u00EB\u00A1\u00CC\u0098\u00AD\u00AE\u00C8\u00C8[\x1D\u00F7\u00E3\u00A5\u00C9-\x19E\u00CB\x15\u00CEzU\u00DE\u00C6\u00EB\u00D2\u00BE\u00A4\u00A6a\u00A4\u00F8\x1F\x7F\u00D837\u00B7\u00B8\u00D11\u00D8\u00E2\u00AE\u00E9\u0095\u00AB\u00D8\u00C2\u00CE\u00B9l\u00FE,\u00E9\x14\u00AEjIk\u0091\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binSeqRndLayer =  "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00\u00AEIDATx\x01\u00ED\u00D4\u00CD\t\u00C2@\x10\x05\u00E07\u009A\u00BB\u0096\u0090\x12\u00EC\u00C4\x1A,A\u00B4\x00\x0B\x10\u0089%X\u0089\u00DA\u0089%x\u00F0\u00A60\x0E\u00DE\u00CC\u00CF\u00F2\u00B2\x04&\u0090\u00F9 \x04\u0096Iv\u00B3\u00F3\u00B2@\ba \u0082\f\u00BACe\u00B7\x05U,\u00B8\u00C8\x11\u00B7\u00FAp\u0081<k\u00BBJ\u00AARpo\x1B\u009E\u00C1\u0089\u00DB\u00C4\u00B9[\u00BD\u00B5%/\u00A9\u00CAw\u00B3\u00BF\u00AE:S\u00AD{\\\u00A1d\u0080\x14g9\u00FD\u0092N+\x12/+\u00C1&\u0097\u00DD\u00F6\u00BFG\u009C\u008C0\u00D5\u0082\rX\x1F<\u00D0\x13}d\u00EA\u00C1\u00FA\u00F8\u00E4{)Uz1\u00FC\x7F\u00FC\u00C2\nsK:/\u00F9Q\u00D3\x0B\u0097\u00DB\u00C4!\u0084\u00C1|\x011e\x17\x0B{H\u00E2$\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binAlignLayer  = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00\u00C4IDATx\x01\u00ED\u0093+\x0E\u00C2@\x14Eo?\x02\u00D5t\t\u00ADi\u0082\u00EB\x12`\x19\u00A0\u0090\u0095\b<\u00E0\x10x\u00BA\x0B\u0096\x00\x184;\u00E0\t\x108\x1C\u0086\u00A1<,\u00C9|\u009At\u00A0I\u00E7$w\u00CC\u00BB\u0093\u0097L\u00CE\x00\x0EGg\u00A8\u0080)g\u00C7\u0099\u00C0\x02\u00BEb\u0096s\x06\u009C\x04?^l\u0095\u00F6-\u00BEE\u00D1\u00E9\u0098e\u00B8\u00C61\u00C1\x02\u009ElP\x14E\"\u00848\x07A\u0090\u0096eIh\u0098PW\x18\u00F7\x0E\u00F9fVS\u00B0\x10\u00E4\u00AD@\u00EA\u008A\u0086\u00BE\x7F\u00D9~\u00FEV-\u009EX\u00F2\u00B9PU\u00BAg\u00B5\u00F6\u00A9_\u0095Or\x05e\u0097p\u00D7U\u00B4\u008B\u00E7\u008F\u00D1\u00B0\u00F5V{k\u00ECaH\u0093V\x13'\u0085!\u00CE\u00EAo\u0088\u00AD\u0086\u00A1\u00D5\x04\u0087\u00C3\u00F1\x0F\u00DE\u00BB\u00B00j\u00D5b\u0096\x0F\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binShiftLayer  = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00\u00C8IDATx\x01\u00ED\u00D21\n\u00C20\x14\x06\u00E0?\u00A6Nu\u00F0\b\u00DA\x13\x14\u00DC\u00A5\u00D2\u00938x\x03\u00DD\x1D\x1D\u0084\u008Ev\u00F4\x06\u00E2\t\u00F4\x02B\u00C1\x03\u0098#d\x17\x1B\u0083n\u0092j\x02M-\u00F4}\u00F0\u00B2\u00BC\u0084G\u0092\x1F \u00A43\x14\u0090\u00E8:\u00E9\u00CA\u00E0A\u00F0\u00A57\u00D2\u0095\u00C0\u0093\x1E\u00FE\u00A4\u0095\u0083\u00C5%\u008A\u00A4\f\u00C3\x02\x1ET\u00FE1\x03\u00CE\u008B4\u0095\u009C\u00F3#\u00F2\x1C\u008D\r6Q+\u00C4:\u00EEC\u00EB\x03\x01\x04\u00DB@\u0098[.J\x1C\u00F0N\u00BB\u009D\x07\u00E6z\u00DD\u009BZ\u00DDK\u00B5\u00DBS3\u00FD_\u00CAa\x7F\t\u0089:\x06\u00B3-f\u00A8\u00C9\u00CF\u00C1S~\u008DwK\u00D8\x19\u00A0`\u00EB\u00EA[:\r\u009E\u00F4o\u0099\u00F5\u00F3J\u008C_\u00AB\x05J\u00F5'qWn\u00C1'\u00844\u00EE\t\u00C2$'\u00E2i\u00F7k\u00AE\x00\x00\x00\x00IEND\u00AEB`\u0082";  

        // --- ROW: ALL 5 ICONS (STACK METHOD) ---
        var iconGroupRow = offsetMainGroup.add("group");
        iconGroupRow.orientation = "row";
        iconGroupRow.alignChildren = ["center", "center"];
        iconGroupRow.spacing = 5; 
        
        // Tạo 5 container dạng "stack" để 2 nút đè lên nhau
        var stackFwd = iconGroupRow.add("group"); stackFwd.orientation = "stack";
        var stackRev = iconGroupRow.add("group"); stackRev.orientation = "stack";
        var stackRnd = iconGroupRow.add("group"); stackRnd.orientation = "stack";
        var stackAli = iconGroupRow.add("group"); stackAli.orientation = "stack";
        var stackShi = iconGroupRow.add("group"); stackShi.orientation = "stack";

        // Thêm nút Layer (Lớp dưới)
        var btnSeqFwdLayer = stackFwd.add("iconbutton", undefined, binSeqFwdLayer, {style: "toolbutton"});
        var btnSeqRevLayer = stackRev.add("iconbutton", undefined, binSeqRevLayer, {style: "toolbutton"});
        var btnSeqRndLayer = stackRnd.add("iconbutton", undefined, binSeqRndLayer, {style: "toolbutton"});
        var btnAlignLayer  = stackAli.add("iconbutton", undefined, binAlignLayer, {style: "toolbutton"});
        var btnShiftLayer  = stackShi.add("iconbutton", undefined, binShiftLayer, {style: "toolbutton"});

        // Thêm nút Keyframe (Lớp trên)
        var btnSeqForward = stackFwd.add("iconbutton", undefined, binSeqFwd, {style: "toolbutton"});
        var btnSeqReverse = stackRev.add("iconbutton", undefined, binSeqRev, {style: "toolbutton"});
        var btnSeqRandom  = stackRnd.add("iconbutton", undefined, binSeqRnd, {style: "toolbutton"});
        var btnAlignAll   = stackAli.add("iconbutton", undefined, binAlign, {style: "toolbutton"});
        var btnShiftBlock = stackShi.add("iconbutton", undefined, binShift, {style: "toolbutton"});
        
        // Setup kích thước
        var bSize = [30, 30];
        btnSeqFwdLayer.size = btnSeqRevLayer.size = btnSeqRndLayer.size = btnAlignLayer.size = btnShiftLayer.size = bSize;
        btnSeqForward.size = btnSeqReverse.size = btnSeqRandom.size = btnAlignAll.size = btnShiftBlock.size = bSize;
        
        // Mặc định ẩn lớp Layer
        btnSeqFwdLayer.visible = btnSeqRevLayer.visible = btnSeqRndLayer.visible = btnAlignLayer.visible = btnShiftLayer.visible = false;

        // Tooltip chung
        btnSeqForward.helpTip = btnSeqFwdLayer.helpTip = "Sequence forward";
        btnSeqReverse.helpTip = btnSeqRevLayer.helpTip = "Sequence in reverse";
        btnSeqRandom.helpTip  = btnSeqRndLayer.helpTip = "Sequence randomly";
        btnAlignAll.helpTip   = btnAlignLayer.helpTip  = "Align all to Current Time Indicator (CTI)";
        btnShiftBlock.helpTip = btnShiftLayer.helpTip  = "Shift entire block to CTI (maintains spacing)";

        // --- ROW 4: CLONE & MIRROR ---
        var cloneMirrorRow = offsetMainGroup.add("group");
        cloneMirrorRow.alignChildren = ["center", "center"];
        cloneMirrorRow.spacing = 10;
        // Chốt cứng kích thước (80 + 15 + 80 = 175) để khi nút bị ẩn, khung UI vẫn giữ nguyên khoảng trống
        cloneMirrorRow.preferredSize = [175, 30];
        
        var btnClone = cloneMirrorRow.add("iconbutton", undefined, binCloneIcon, {style: "toolbutton"});
        var btnMirror = cloneMirrorRow.add("iconbutton", undefined, binMirrorIcon, {style: "toolbutton"});
        
        btnClone.size = [80, 30];
        btnMirror.size = [80, 30];
        
        btnClone.helpTip = "Clone selected keyframes to CTI";
        btnMirror.helpTip = "Mirror selected keyframes to CTI";

        // --- SỰ KIỆN CHO CHECKBOX VÀ CÁC NÚT ---
        chkLayerMode.onClick = function() {
            var isLayer = chkLayerMode.value;
            
            // Ẩn/hiện nút Clone và Mirror
            btnClone.visible = !isLayer;
            btnMirror.visible = !isLayer;
            btnClone.enabled = !isLayer;
            btnMirror.enabled = !isLayer;

            // Bật/tắt hiển thị nút Keyframe
            btnSeqForward.visible = !isLayer;
            btnSeqReverse.visible = !isLayer;
            btnSeqRandom.visible  = !isLayer;
            btnAlignAll.visible   = !isLayer;
            btnShiftBlock.visible = !isLayer;

            // Bật/tắt hiển thị nút Layer
            btnSeqFwdLayer.visible = isLayer;
            btnSeqRevLayer.visible = isLayer;
            btnSeqRndLayer.visible = isLayer;
            btnAlignLayer.visible  = isLayer;
            btnShiftLayer.visible  = isLayer;
        };

        // Trỏ sự kiện click cho cả 2 lớp nút (Keyframe và Layer)
        btnSeqForward.onClick = btnSeqFwdLayer.onClick = function() { 
            if (chkLayerMode.value) SequenceLayers(Number(inputOffset.text), Number(inputStep.text), "forward");
            else SequenceKeyframes(Number(inputOffset.text), Number(inputStep.text), "forward"); 
        };
        btnSeqReverse.onClick = btnSeqRevLayer.onClick = function() { 
            if (chkLayerMode.value) SequenceLayers(Number(inputOffset.text), Number(inputStep.text), "reverse");
            else SequenceKeyframes(Number(inputOffset.text), Number(inputStep.text), "reverse"); 
        };
        btnSeqRandom.onClick = btnSeqRndLayer.onClick = function() { 
            if (chkLayerMode.value) SequenceLayers(Number(inputOffset.text), Number(inputStep.text), "random");
            else SequenceKeyframes(Number(inputOffset.text), Number(inputStep.text), "random"); 
        };
        btnAlignAll.onClick = btnAlignLayer.onClick = function() { 
            if (chkLayerMode.value) AlignLayersToCTI();
            else AlignAllToCTI(); 
        };
        btnShiftBlock.onClick = btnShiftLayer.onClick = function() { 
            if (chkLayerMode.value) ShiftLayersToCTI();
            else ShiftBlockToCTI(); 
        };
        btnClone.onClick      = function() { CloneKeyframesToCTI(false); }
        btnMirror.onClick     = function() { CloneKeyframesToCTI(true); }

// Create the preset tab
        var presetTab = tabPanel.add("tab", undefined, "Preset");
        var presetGroup = presetTab.add("group", undefined, {name: "presetGroup"});
        presetGroup.orientation = "column";
        presetGroup.alignChildren = ["left", "center"];
        presetGroup.margins = [10, 15, 10, 10]; // Thêm 15px padding top

//PRESET TAB

        // --- PRESET TAB: PHẦN TRĂM OVERSHOOT ---
        var presetPercentMainGroup = presetGroup.add("group");
        presetPercentMainGroup.orientation = "column";
        presetPercentMainGroup.alignChildren = ["center", "center"]; // Căn giữa
        presetPercentMainGroup.spacing = 5;

        var presetPercentLabelGroup = presetPercentMainGroup.add("group");
        presetPercentLabelGroup.add("statictext", undefined, "Percentage:");

        var presetPercentControlGroup = presetPercentMainGroup.add("group");
        presetPercentControlGroup.alignChildren = ["center", "center"];
        var presetSliderPercent = presetPercentControlGroup.add("slider", undefined, 20, 0, 100); // Default 20%
        presetSliderPercent.size = [100, 15];
        
        var presetInputPercent = presetPercentControlGroup.add("edittext", undefined, "20");
        presetInputPercent.characters = 4; // Cho phép nhập số lớn

        presetSliderPercent.onChanging = function() {
            presetInputPercent.text = Math.round(presetSliderPercent.value).toString();
        };
        presetInputPercent.onChange = function() {
            var val = parseFloat(presetInputPercent.text);
            if (isNaN(val)) val = 0;
            if (val < 0) val = 0; // Cho phép gõ lố 100%
            presetInputPercent.text = val.toString();
            presetSliderPercent.value = (val > 100) ? 100 : val;
        };


        var dividerPreset = presetGroup.add("panel", undefined, undefined, {borderStyle: "sunken"});
        dividerPreset.alignment = "fill";
        dividerPreset.minimumSize.height = 2;

        // Add group for button preset
        var title1 = presetGroup.add("statictext", undefined, "Overshoot Scale");
        var scaleXYGroup = presetGroup.add("group");
        scaleXYGroup.alignChildren = ["left", "center"];
        var btnScaleXY1 = scaleXYGroup.add("button", undefined, "Scale XY-1");
        var btnScaleXY2 = scaleXYGroup.add("button", undefined, "Scale XY-2");
        btnScaleXY1.helpTip = "Scale Overshoot uniformly 1 time at layer start";
        btnScaleXY2.helpTip = "Scale Overshoot uniformly 2 times at layer start";
        btnScaleXY1.size = [65, 30];
        btnScaleXY2.size = [65, 30];

        btnScaleXY1.onClick = function(){ OverShootScaleXY1(Number(presetInputPercent.text)); }
        btnScaleXY2.onClick = function(){ OverShootScaleXY2(Number(presetInputPercent.text)); }
        
        //PRESET OVERSHOOT X
        var scaleXGroup = presetGroup.add("group");
        scaleXGroup.alignChildren = ["left", "center"];
        var btnScaleX1 = scaleXGroup.add("button", undefined, "Scale X-1");
        var btnScaleX2 = scaleXGroup.add("button", undefined, "Scale X-2");
        btnScaleX1.helpTip = "X-Axis Scale Overshoot 1 time at layer start";
        btnScaleX2.helpTip = "X-Axis Scale Overshoot 2 times at layer start";
        btnScaleX1.size = [65, 30];
        btnScaleX2.size = [65, 30];

        btnScaleX1.onClick = function(){ OverShootScaleX1(Number(presetInputPercent.text)); }
        btnScaleX2.onClick = function(){ OverShootScaleX2(Number(presetInputPercent.text)); }

        //PRESET OVERSHOOT Y
        var scaleYGroup = presetGroup.add("group");
        scaleYGroup.alignChildren = ["left", "center"]; 
        var btnScaleY1 = scaleYGroup.add("button", undefined, "Scale Y-1");
        var btnScaleY2 = scaleYGroup.add("button", undefined, "Scale Y-2");
        btnScaleY1.helpTip = "Y-Axis Scale Overshoot 1 time at layer start";
        btnScaleY2.helpTip = "Y-Axis Scale Overshoot 2 times at layer start";
        btnScaleY1.size = [65, 30];
        btnScaleY2.size = [65, 30];

        btnScaleY1.onClick = function(){ OverShootScaleY1(Number(presetInputPercent.text)); }
        btnScaleY2.onClick = function(){ OverShootScaleY2(Number(presetInputPercent.text)); }

        //PRESET OVERSHOOT ROTATION + SCALE
        var title2 = presetGroup.add("statictext", undefined, "Overshoot Scale + Rotation");
        var scaRotGroup = presetGroup.add("group");
        scaRotGroup.alignChildren = ["left", "center"];
        var btnScaro1 = scaRotGroup.add("button", undefined, "Scaro-1");
        var btnScaro2 = scaRotGroup.add("button", undefined, "Scaro-2");
        btnScaro1.helpTip = "Scale + Rotation Overshoot 1 time at layer start";
        btnScaro2.helpTip = "Scale + Rotation Overshoot 2 times at layer start";
        btnScaro1.size = [65, 30];
        btnScaro2.size = [65, 30];

        btnScaro1.onClick = function(){ OverShootScaleRot1(Number(presetInputPercent.text)); }
        btnScaro2.onClick = function(){ OverShootScaleRot2(Number(presetInputPercent.text)); }

        


        //PRESET FADE IN FADE OUT
        var title3 = presetGroup.add("statictext", undefined, "Fade In + Out");
        var fadeInGroup = presetGroup.add("group");
        fadeInGroup.alignChildren = ["left", "center"];
        var btnFadeIn = fadeInGroup.add("button", undefined, "Fade In");
        var btnFadeOut = fadeInGroup.add("button", undefined, "Fade Out");
        btnFadeIn.helpTip = "Fade In at layer start";
        btnFadeOut.helpTip = "Fade Out at layer end";
        btnFadeIn.size = [65, 30];
        btnFadeOut.size = [65, 30];

        btnFadeIn.onClick = function(){
                FadeIn();
        }

        btnFadeOut.onClick = function(){
                FadeOut();
        }


        // --- FOOTER AND LINK ---
        var footerGroup = panel.add("group");
        footerGroup.orientation = "column"; 
        footerGroup.alignChildren = ["center", "center"];
        footerGroup.margins = [0, 5, 0, 0]; 
        footerGroup.spacing = 2; 
        
        // Dòng 1: Hướng dẫn
        var guideRow = footerGroup.add("group");
        var txtGuide = guideRow.add("statictext", undefined, "User Guide");
        var btnHelp = guideRow.add("button", undefined, "?");
        btnHelp.size = [20, 20];
        
        // Dòng 2: Tác giả
        var authorRow = footerGroup.add("group");
        var txtAuthor = authorRow.add("statictext", undefined, "Plugin by Trong");
        var btnAuthor = authorRow.add("button", undefined, "♥︎");
        btnAuthor.size = [20, 20];
        
        // Sự kiện mở Hướng dẫn
        btnHelp.onClick = function() {
            showHelpGuide();
        };

        // Sự kiện mở link Tác giả
        btnAuthor.onClick = function() {
            var url = "https://www.facebook.com/phanductrong34";
            if ($.os.indexOf("Windows") !== -1) {
                system.callSystem("cmd.exe /c start \"\" \"" + url + "\"");
            } else {
                system.callSystem("open \"" + url + "\"");
            }
        };

        // --- HÀM POPUP HƯỚNG DẪN SỬ DỤNG ---
        function showHelpGuide() {
            var win = new Window("dialog", "KeyShooter 2.1 User Guide");
            win.orientation = "column";
            win.alignChildren = ["left", "top"];
            win.spacing = 10;
            win.margins = 20;

            // Hàm hỗ trợ tạo text có style
            function addLine(parent, text, isBold) {
                var st = parent.add("statictext", undefined, text);
                if (isBold) st.graphics.font = ScriptUI.newFont("dialog", "BOLD", 13);
                return st;
            }

            addLine(win, "🚀 OVERSHOOT TAB (Custom Keyframes)", true);
            addLine(win, "• Percentage: Bounce/overshoot intensity. Type >100% for extreme bounce!");
            addLine(win, "• Keys to insert: Number of bounce keyframes added.");
            addLine(win, "• Insert in Middle: Keeps total duration, distributes keys evenly inside.");
            
            var div1 = win.add("panel", undefined, undefined, {borderStyle: "sunken"});
            div1.alignment = "fill"; div1.minimumSize.height = 2;

            addLine(win, "⏱️ OFFSET TOOL (Time Shifting)", true);
            addLine(win, "• Layer Mode: Toggle to affect Layers instead of Keyframes.");
            addLine(win, "• Offset & Step: Frame gap between each group (Step) of layers/keys.");
            addLine(win, "• (Align): Align all to Current Time Indicator (CTI).");
            addLine(win, "• (Shift): Shift entire block to CTI (maintains spacing/stagger).");
            addLine(win, "• (Clone/Mirror): Copy or mirror copy selected keyframes to CTI.");

            var div2 = win.add("panel", undefined, undefined, {borderStyle: "sunken"});
            div2.alignment = "fill"; div2.minimumSize.height = 2;

            addLine(win, "✨ PRESET TAB (Quick Animation)", true);
            addLine(win, "• Presets auto-detect layer's current % Scale / Rotation.");
            addLine(win, "• Suffix '1': Overshoots once then settles.");
            addLine(win, "• Suffix '2': Overshoots, bounces back, then settles.");
            addLine(win, "• Fade In/Out: Auto 10-frame Opacity fade at layer start/end.");

            var btnCloseGroup = win.add("group");
            btnCloseGroup.alignment = "center";
            var btnClose = btnCloseGroup.add("button", undefined, "Got it!");
            btnClose.onClick = function() { win.close(); }

            win.center();
            win.show();
        }
// Create panel and dock the panel
        panel.onResizing= panel.onResize = function () {this.layout.resize();}
        panel instanceof Window 
            ? (panel.center(), panel.show()) : (panel.layout.layout(true), panel.layout.resize());
    
        return panel;
    }
    

    var myPanel = buildUI(thisObj);

    
    // functions
    function insertNewKeyframe(property, time, value) {
        var newKey = property.addKey(time);
        property.setValueAtTime(time, value);
        property.setSelectedAtKey(newKey,true);
    }


    function OverShoot(isCenter, percentage, count){
        if (count > 50){
            alert("Max 50 keys allowed! :))))");
            return;
        }

        app.beginUndoGroup("Universal Overshoot Keyframes");

        var comp = app.project.activeItem;
        if (!comp) { app.endUndoGroup(); return; }

        var layers = comp.selectedLayers;

        for (var i = 0; i < layers.length; i++){
            var layer = layers[i];
            var props = layer.selectedProperties;

            for (var j = 0; j < props.length; j++){
                var prop = props[j];

                // Skip GROUPS (AE selects them too)
                if (prop.propertyType === PropertyType.PROPERTY) {

                    var keys = prop.selectedKeys;
                    if (keys.length < 2) continue;

                    // Normalize key order
                    var k1 = keys[0];
                    var k2 = keys[keys.length - 1];

                    var t1 = prop.keyTime(k1);
                    var t2 = prop.keyTime(k2);
                    var v1 = prop.keyValue(k1);
                    var v2 = prop.keyValue(k2);

                    if (t1 > t2) {
                        var tmp = t1; t1 = t2; t2 = tmp;
                        var tmpV = v1; v1 = v2; v2 = tmpV;
                    }

                    // Remove middle keyframes
                    if (keys.length > 2){
                        for (var m = keys.length - 2; m >= 1; m--){
                            prop.removeKey(keys[m]);
                        }
                    }

                    var timeGap = t2 - t1;

                    // Handle 1D, 2D, 3D, 4D (color)
                    var isArray = (v1 instanceof Array);
                    var dims = isArray ? v1.length : 1;

                    for (var k = 1; k <= count; k++){
                        var timeVar = isCenter ? (k / (count + 1)) : k;
                        var minus = (k % 2 === 0 ? -1 : 1);
                        var valueVar = 1 / Math.pow(2, k - 1);
                        var h = (minus * valueVar * percentage + 100) / 100;

                        var overshootValue;

                        if (!isArray){
                            // 1D value
                            overshootValue = v1 + (v2 - v1) * h;
                        } else {
                            // Multi‑dimensional value (2D, 3D, Color)
                            overshootValue = [];
                            for (var d = 0; d < dims; d++){
                                overshootValue[d] = v1[d] + (v2[d] - v1[d]) * h;
                            }
                        }

                        var overshootTime = t1 + timeVar * timeGap;
                        insertNewKeyframe(prop, overshootTime, overshootValue);
                    }

                    if (!isCenter){
                        insertNewKeyframe(prop, t2 + count * timeGap, v2);
                    }
                }
            }
        }

        app.endUndoGroup();
    }



  function OverShootScaleXY1(pct){
        app.beginUndoGroup("Add Scale Overshoot Keyframes");
        var comp = app.project.activeItem;
        var selectedLayers = comp.selectedLayers;
        var m1 = 1 + (pct / 100); // Tính hệ số bơm (VD 30% -> 1.3)

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            var propScale = layer.property("Scale");
            var targetVal = propScale.value; 

            propScale.addKey(startTime);
            propScale.setValueAtTime(startTime, [0, 0]);

            propScale.addKey(_frameLater(startTime,10));
            propScale.setValueAtTime(_frameLater(startTime,10), [targetVal[0] * m1, targetVal[1] * m1]);
            
            propScale.addKey(_frameLater(startTime,20));
            propScale.setValueAtTime(_frameLater(startTime,20), targetVal);

            var easeIn = new KeyframeEase(0.5, 50);
            var easeOut = new KeyframeEase(0.5, 50);
            for (var j = 1; j <= 3; j++) {
                propScale.setTemporalEaseAtKey(j, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            }
        }
        app.endUndoGroup();
    }

    function OverShootScaleXY2(pct){
        app.beginUndoGroup("Add Scale Overshoot Keyframes");
        var selectedLayers = app.project.activeItem.selectedLayers;
        var m1 = 1 + (pct / 100);       // Bơm
        var m2 = 1 - (pct / 2 / 100);   // Xẹp 1 nửa (VD 30% -> xẹp 15% -> 0.85)

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            var propScale = layer.property("Scale");
            var targetVal = propScale.value;

           propScale.addKey(startTime);
           propScale.setValueAtTime(startTime, [0, 0]);

           propScale.addKey(_frameLater(startTime,10));
           propScale.setValueAtTime(_frameLater(startTime,10), [targetVal[0] * m1, targetVal[1] * m1]);

           propScale.addKey(_frameLater(startTime,20));
           propScale.setValueAtTime(_frameLater(startTime,20), [targetVal[0] * m2, targetVal[1] * m2]);
            
           propScale.addKey(_frameLater(startTime,30));
           propScale.setValueAtTime(_frameLater(startTime,30), targetVal);

            var easeIn = new KeyframeEase(0.5, 30);
            var easeOut = new KeyframeEase(0.5, 60);

            propScale.setTemporalEaseAtKey(1, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            propScale.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(3, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(4, [easeOut, easeOut, easeOut], [easeIn, easeIn, easeIn]);
        }
        app.endUndoGroup();
    }

    function OverShootScaleX1(pct){
        app.beginUndoGroup("Add Scale Overshoot Keyframes");
        var selectedLayers = app.project.activeItem.selectedLayers;
        var m1 = 1 + (pct / 100);

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            var propScale = layer.property("Scale");
            var targetVal = propScale.value;

            propScale.addKey(startTime);
            propScale.setValueAtTime(startTime, [0, targetVal[1]]);

            propScale.addKey(_frameLater(startTime,10));
            propScale.setValueAtTime(_frameLater(startTime,10), [targetVal[0] * m1, targetVal[1]]);
            
            propScale.addKey(_frameLater(startTime,20));
            propScale.setValueAtTime(_frameLater(startTime,20), targetVal);

            var easeIn = new KeyframeEase(0.5, 50);
            var easeOut = new KeyframeEase(0.5, 50);
            for (var j = 1; j <= 3; j++) {
                propScale.setTemporalEaseAtKey(j, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            }
        }
        app.endUndoGroup();
    }

    function OverShootScaleX2(pct){
        app.beginUndoGroup("Add Scale Overshoot Keyframes");
        var selectedLayers = app.project.activeItem.selectedLayers;
        var m1 = 1 + (pct / 100);
        var m2 = 1 - (pct / 2 / 100);

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            var propScale = layer.property("Scale");
            var targetVal = propScale.value;

           propScale.addKey(startTime);
           propScale.setValueAtTime(startTime, [0, targetVal[1]]);

           propScale.addKey(_frameLater(startTime,10));
           propScale.setValueAtTime(_frameLater(startTime,10), [targetVal[0] * m1, targetVal[1]]);

           propScale.addKey(_frameLater(startTime,20));
           propScale.setValueAtTime(_frameLater(startTime,20), [targetVal[0] * m2, targetVal[1]]);
            
           propScale.addKey(_frameLater(startTime,30));
           propScale.setValueAtTime(_frameLater(startTime,30), targetVal);

            var easeIn = new KeyframeEase(0.5, 30);
            var easeOut = new KeyframeEase(0.5, 60);

            propScale.setTemporalEaseAtKey(1, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            propScale.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(3, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(4, [easeOut, easeOut, easeOut], [easeIn, easeIn, easeIn]);
        }
        app.endUndoGroup();
    }

    function OverShootScaleY1(pct){
        app.beginUndoGroup("Add Scale Overshoot Keyframes");
        var selectedLayers = app.project.activeItem.selectedLayers;
        var m1 = 1 + (pct / 100);

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            var propScale = layer.property("Scale");
            var targetVal = propScale.value;

            propScale.addKey(startTime);
            propScale.setValueAtTime(startTime, [targetVal[0], 0]);

            propScale.addKey(_frameLater(startTime,10));
            propScale.setValueAtTime(_frameLater(startTime,10), [targetVal[0], targetVal[1] * m1]);
            
            propScale.addKey(_frameLater(startTime,20));
            propScale.setValueAtTime(_frameLater(startTime,20), targetVal);

            var easeIn = new KeyframeEase(0.5, 50);
            var easeOut = new KeyframeEase(0.5, 50);
            for (var j = 1; j <= 3; j++) {
                propScale.setTemporalEaseAtKey(j, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            }
        }
        app.endUndoGroup();
    }

    function OverShootScaleY2(pct){
        app.beginUndoGroup("Add Scale Overshoot Keyframes");
        var selectedLayers = app.project.activeItem.selectedLayers;
        var m1 = 1 + (pct / 100);
        var m2 = 1 - (pct / 2 / 100);

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            var propScale = layer.property("Scale");
            var targetVal = propScale.value;

           propScale.addKey(startTime);
           propScale.setValueAtTime(startTime, [targetVal[0], 0]);

           propScale.addKey(_frameLater(startTime,10));
           propScale.setValueAtTime(_frameLater(startTime,10), [targetVal[0], targetVal[1] * m1]);

           propScale.addKey(_frameLater(startTime,20));
           propScale.setValueAtTime(_frameLater(startTime,20), [targetVal[0], targetVal[1] * m2]);
            
           propScale.addKey(_frameLater(startTime,30));
           propScale.setValueAtTime(_frameLater(startTime,30), targetVal);

            var easeIn = new KeyframeEase(0.5, 30);
            var easeOut = new KeyframeEase(0.5, 60);

            propScale.setTemporalEaseAtKey(1, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            propScale.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(3, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(4, [easeOut, easeOut, easeOut], [easeIn, easeIn, easeIn]);
        }
        app.endUndoGroup();
    }   

    function OverShootScaleRot1(pct){
        OverShootScaleXY1(pct);
        app.beginUndoGroup("Add Rotation Overshoot Keyframes 1");
        var comp = app.project.activeItem;
        var selectedLayers = comp.selectedLayers;
        var over1 = pct;             // Bơm độ
        var over2 = -(pct / 4);      // Vòng lố lại 1 tí xíu cho tự nhiên

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint ;
            var propRotation = layer.property("Rotation");
            var targetVal = propRotation.value; 

            propRotation.addKey(_frameLater(startTime,5));
            propRotation.setValueAtTime(_frameLater(startTime,5), targetVal + over1);

            propRotation.addKey(_frameLater(startTime,15));
            propRotation.setValueAtTime(_frameLater(startTime,15), targetVal + over2);
            
            propRotation.addKey(_frameLater(startTime,25));
            propRotation.setValueAtTime(_frameLater(startTime,25), targetVal);

            var easeIn = new KeyframeEase(0.5, 50);
            var easeOut = new KeyframeEase(0.5, 50);
            for (var j = 1; j <= 3; j++) {
                propRotation.setTemporalEaseAtKey(j, [easeIn], [easeOut]);
            }
        }
        app.endUndoGroup();
    }

    function OverShootScaleRot2(pct){
        OverShootScaleXY2(pct);
        app.beginUndoGroup("Add Rotation Scale Overshoot Keyframes 2");
        var comp = app.project.activeItem;
        var selectedLayers = comp.selectedLayers;
        var over1 = pct;             // Bơm
        var over2 = -(pct / 2);      // Xẹp qua bờ bên kia
        var over3 = (pct / 4);       // Bơm lố lại tí xíu

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint ;
            var propRotation = layer.property("Rotation");
            var targetVal = propRotation.value;

            propRotation.addKey(_frameLater(startTime,5));
            propRotation.setValueAtTime(_frameLater(startTime,5), targetVal + over1);

            propRotation.addKey(_frameLater(startTime,15));
            propRotation.setValueAtTime(_frameLater(startTime,15), targetVal + over2);

            propRotation.addKey(_frameLater(startTime,25));
            propRotation.setValueAtTime(_frameLater(startTime,25), targetVal + over3);
            
            propRotation.addKey(_frameLater(startTime,35));
            propRotation.setValueAtTime(_frameLater(startTime,35), targetVal);

            var easeIn = new KeyframeEase(0.5, 30);
            var easeOut = new KeyframeEase(0.5, 60);

            propRotation.setTemporalEaseAtKey(1, [easeIn], [easeOut]);
            propRotation.setTemporalEaseAtKey(2, [easeIn], [easeIn]);
            propRotation.setTemporalEaseAtKey(3, [easeIn], [easeIn]);
            propRotation.setTemporalEaseAtKey(4, [easeOut], [easeIn]);
        }
        app.endUndoGroup();
    }

    function FadeIn(){
        app.beginUndoGroup("Add Fade In Keyframes");
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            var propOpacity = layer.property("Opacity");
            var targetVal = propOpacity.value; // Lấy thông số hiện tại

            propOpacity.addKey(startTime);
            propOpacity.setValueAtTime(startTime, 0);

            propOpacity.addKey(_frameLater(startTime,10));
            propOpacity.setValueAtTime(_frameLater(startTime,10), targetVal);
        }
        app.endUndoGroup();
    }

    function FadeOut(){
        app.beginUndoGroup("Add Fade Out Keyframes");
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var outTime = layer.outPoint;
            var propOpacity = layer.property("Opacity");
            var targetVal = propOpacity.value;

            propOpacity.addKey(_frameLater(outTime,-10));
            propOpacity.setValueAtTime(_frameLater(outTime,-10), targetVal);

            propOpacity.addKey(outTime);
            propOpacity.setValueAtTime(outTime, 0);
        }
        app.endUndoGroup();
    }


    function _frameLater(time, frame){
        return time + frame / app.project.activeItem.frameRate;
    }

    function _easing(propName, keyCount){
        var easeIn = new KeyframeEase(0.5, 50);
        var easeOut = new KeyframeEase(0.5, 50);
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var prop = selectedLayers[i].property(propName);
            for (var j = 1; j <= keyCount; j++) {
                prop.setTemporalEaseAtKey(j, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            }
        }
    }

// ------------------------- OFFSET KEYFRAME FUNCTIONS ---
    
    function SequenceKeyframes(offsetFrames, step, direction) {
        var comp = app.project.activeItem;
        if (!comp) return;
        if (step < 1) step = 1; 

        app.beginUndoGroup("Sequence Keyframes");

        var selProps = comp.selectedProperties;
        var validProps = [];
        var layersDict = {}; 
        var layerOrder = []; 

        for (var i = 0; i < selProps.length; i++) {
            var prop = selProps[i];
            if (prop.propertyType === PropertyType.PROPERTY && prop.selectedKeys.length > 0) {
                var parentLayer = prop.propertyGroup(prop.propertyDepth);
                var layerIndex = parentLayer.index;
                var propData = { prop: prop, keys: prop.selectedKeys.slice(0) };

                validProps.push(propData);

                if (!layersDict[layerIndex]) {
                    layersDict[layerIndex] = [];
                    layerOrder.push(layerIndex);
                }
                layersDict[layerIndex].push(propData);
            }
        }

        if (validProps.length === 0) { app.endUndoGroup(); return; }

        var offsetBlocks = [];
        if (layerOrder.length > 1) {
            for (var i = 0; i < layerOrder.length; i++) offsetBlocks.push(layersDict[layerOrder[i]]);
        } else {
            validProps.sort(function(a, b) {
                var pathA = getPropertyPath(a.prop);
                var pathB = getPropertyPath(b.prop);
                var minLength = Math.min(pathA.length, pathB.length);
                for (var k = 0; k < minLength; k++) {
                    if (pathA[k] !== pathB[k]) return pathA[k] - pathB[k];
                }
                return pathA.length - pathB.length;
            });
            for (var i = 0; i < validProps.length; i++) offsetBlocks.push([validProps[i]]);
        }

        if (direction === "reverse") offsetBlocks.reverse();
        else if (direction === "random") {
            for (var i = offsetBlocks.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = offsetBlocks[i];
                offsetBlocks[i] = offsetBlocks[j];
                offsetBlocks[j] = temp;
            }
        }

        var fps = comp.frameRate;
        var offsetTime = offsetFrames / fps;
        var keysToSelect = []; // Store selections for the end

        for (var i = 0; i < offsetBlocks.length; i++) {
            var block = offsetBlocks[i]; 
            var groupIndex = Math.floor(i / step);
            var currentOffsetTime = groupIndex * offsetTime;
            
            for (var p = 0; p < block.length; p++) {
                if (currentOffsetTime !== 0) {
                    var newIndices = shiftPropertyKeyframes(block[p].prop, block[p].keys, currentOffsetTime);
                    keysToSelect.push({prop: block[p].prop, keys: newIndices});
                } else {
                    keysToSelect.push({prop: block[p].prop, keys: block[p].keys});
                }
            }
        }

        // --- FINAL RESELECTION LOOP ---
        for (var i = 0; i < keysToSelect.length; i++) {
            var p = keysToSelect[i].prop;
            // Bỏ chọn tất cả keyframes cũ của thuộc tính này
            for (var k = 1; k <= p.numKeys; k++) {
                p.setSelectedAtKey(k, false);
            }
            // Chỉ chọn lại đúng các key vừa được tạo/dịch chuyển
            for (var j = 0; j < keysToSelect[i].keys.length; j++) {
                p.setSelectedAtKey(keysToSelect[i].keys[j], true);
            }
        }

        app.endUndoGroup();
    }


    function AlignAllToCTI() {
        var comp = app.project.activeItem;
        if (!comp) return;

        app.beginUndoGroup("Align All Keyframes to CTI");

        var selProps = comp.selectedProperties;
        var cti = comp.time;
        var validProps = [];
        var keysToSelect = [];

        for (var i = 0; i < selProps.length; i++) {
            var prop = selProps[i];
            if (prop.propertyType === PropertyType.PROPERTY && prop.selectedKeys.length > 0) {
                validProps.push({ prop: prop, keys: prop.selectedKeys.slice(0) });
            }
        }

        for (var i = 0; i < validProps.length; i++) {
            var data = validProps[i];
            var firstKeyTime = data.prop.keyTime(data.keys[0]);
            var offsetTime = cti - firstKeyTime;
            
            if (offsetTime !== 0) {
                var newIndices = shiftPropertyKeyframes(data.prop, data.keys, offsetTime);
                keysToSelect.push({prop: data.prop, keys: newIndices});
            } else {
                keysToSelect.push({prop: data.prop, keys: data.keys});
            }
        }

        // --- FINAL RESELECTION LOOP ---
        for (var i = 0; i < keysToSelect.length; i++) {
            var p = keysToSelect[i].prop;
            // Bỏ chọn tất cả keyframes cũ của thuộc tính này
            for (var k = 1; k <= p.numKeys; k++) {
                p.setSelectedAtKey(k, false);
            }
            // Chỉ chọn lại đúng các key vừa được tạo/dịch chuyển
            for (var j = 0; j < keysToSelect[i].keys.length; j++) {
                p.setSelectedAtKey(keysToSelect[i].keys[j], true);
            }
        }

        app.endUndoGroup();
    }


    function ShiftBlockToCTI() {
        var comp = app.project.activeItem;
        if (!comp) return;

        var selProps = comp.selectedProperties;
        var cti = comp.time;
        var earliestTime = null;
        var validProps = [];
        var keysToSelect = [];
        
        for (var i = 0; i < selProps.length; i++) {
            var prop = selProps[i];
            if (prop.propertyType === PropertyType.PROPERTY && prop.selectedKeys.length > 0) {
                var keys = prop.selectedKeys.slice(0);
                validProps.push({prop: prop, keys: keys});
                
                var firstKeyTime = prop.keyTime(keys[0]);
                if (earliestTime === null || firstKeyTime < earliestTime) {
                    earliestTime = firstKeyTime;
                }
            }
        }

        if (validProps.length === 0 || earliestTime === null) return;

        var globalOffsetTime = cti - earliestTime;
        if (globalOffsetTime === 0) return;

        app.beginUndoGroup("Shift Keyframe Block to CTI");

        for (var i = 0; i < validProps.length; i++) {
            var newIndices = shiftPropertyKeyframes(validProps[i].prop, validProps[i].keys, globalOffsetTime);
            keysToSelect.push({prop: validProps[i].prop, keys: newIndices});
        }

        // --- FINAL RESELECTION LOOP ---
        for (var i = 0; i < keysToSelect.length; i++) {
            var p = keysToSelect[i].prop;
            // Bỏ chọn tất cả keyframes cũ của thuộc tính này
            for (var k = 1; k <= p.numKeys; k++) {
                p.setSelectedAtKey(k, false);
            }
            // Chỉ chọn lại đúng các key vừa được tạo/dịch chuyển
            for (var j = 0; j < keysToSelect[i].keys.length; j++) {
                p.setSelectedAtKey(keysToSelect[i].keys[j], true);
            }
        }

        app.endUndoGroup();
    }

    // --- CLONE & MIRROR FUNCTIONS ---

    function CloneKeyframesToCTI(isMirror) {
        var comp = app.project.activeItem;
        if (!comp) return;

        app.beginUndoGroup(isMirror ? "Mirror Keyframes to CTI" : "Clone Keyframes to CTI");

        var selProps = comp.selectedProperties;
        var cti = comp.time;
        
        var earliestTime = null;
        var latestTime = null;
        var validProps = [];
        var keysToSelect = [];
        
        // Step 1: Find the absolute earliest and latest keyframes to establish the block size
        for (var i = 0; i < selProps.length; i++) {
            var prop = selProps[i];
            if (prop.propertyType === PropertyType.PROPERTY && prop.selectedKeys.length > 0) {
                var keys = prop.selectedKeys.slice(0);
                validProps.push({prop: prop, keys: keys});
                
                var firstKeyTime = prop.keyTime(keys[0]);
                var lastKeyTime = prop.keyTime(keys[keys.length - 1]);
                
                if (earliestTime === null || firstKeyTime < earliestTime) earliestTime = firstKeyTime;
                if (latestTime === null || lastKeyTime > latestTime) latestTime = lastKeyTime;
            }
        }

        if (validProps.length === 0 || earliestTime === null) {
            app.endUndoGroup();
            return;
        }

        var globalOffsetTime = cti - earliestTime;
        var blockDuration = latestTime - earliestTime;

        // Step 2: Clone the properties block by block
        for (var i = 0; i < validProps.length; i++) {
            var newIndices = clonePropertyKeyframes(validProps[i].prop, validProps[i].keys, globalOffsetTime, isMirror, blockDuration, earliestTime);
            keysToSelect.push({prop: validProps[i].prop, keys: newIndices});
        }

        // --- FINAL RESELECTION LOOP ---
        for (var i = 0; i < keysToSelect.length; i++) {
            var p = keysToSelect[i].prop;
            // Bỏ chọn tất cả keyframes cũ của thuộc tính này
            for (var k = 1; k <= p.numKeys; k++) {
                p.setSelectedAtKey(k, false);
            }
            // Chỉ chọn lại đúng các key vừa được tạo/dịch chuyển
            for (var j = 0; j < keysToSelect[i].keys.length; j++) {
                p.setSelectedAtKey(keysToSelect[i].keys[j], true);
            }
        }

        app.endUndoGroup();
    }

// Helper: Shifts keys safely, preserves Roving, prevents Linear-to-Bezier conversion
    function shiftPropertyKeyframes(prop, keyIndices, timeOffset) {
        var keyData = [];
        
        for (var i = 0; i < keyIndices.length; i++) {
            var k = keyIndices[i];
            var kData = {
                time: prop.keyTime(k),
                value: prop.keyValue(k),
                inType: prop.keyInInterpolationType(k),
                outType: prop.keyOutInterpolationType(k),
            };
            
            try { kData.inTempEase = prop.keyInTemporalEase(k); } catch(e) {}
            try { kData.outTempEase = prop.keyOutTemporalEase(k); } catch(e) {}
            try { kData.tempCont = prop.keyTemporalContinuous(k); } catch(e) {}
            try { kData.spatCont = prop.keySpatialContinuous(k); } catch(e) {}
            try { kData.roving = prop.keyRoving(k); } catch(e) {}
            
            try {
                if (prop.propertyValueType === PropertyValueType.TwoD_SPATIAL || prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL) {
                    kData.inSpatTang = prop.keyInSpatialTangent(k);
                    kData.outSpatTang = prop.keyOutSpatialTangent(k);
                }
            } catch(e) {}
            
            keyData.push(kData);
        }
        
        for (var i = keyIndices.length - 1; i >= 0; i--) {
            prop.removeKey(keyIndices[i]);
        }
        
        var newKeys = []; 
        for (var i = 0; i < keyData.length; i++) {
            var d = keyData[i];
            var newTime = d.time + timeOffset;
            var newK = prop.addKey(newTime);
            newKeys.push(newK); 
            
            prop.setValueAtKey(newK, d.value);
            
            // 1. Set Continuity BEFORE applying custom tangents and eases
            if (d.tempCont !== undefined) try { prop.setTemporalContinuousAtKey(newK, d.tempCont); } catch(e) {}
            if (d.spatCont !== undefined) try { prop.setSpatialContinuousAtKey(newK, d.spatCont); } catch(e) {}

            // 2. Apply Eases and Tangents
            if (d.inTempEase !== undefined && d.outTempEase !== undefined) {
                try { prop.setTemporalEaseAtKey(newK, d.inTempEase, d.outTempEase); } catch(e) {}
            }
            if (d.inSpatTang !== undefined && d.outSpatTang !== undefined) {
                try { prop.setSpatialTangentsAtKey(newK, d.inSpatTang, d.outSpatTang); } catch(e) {}
            }
            
            // 3. CRITICAL FIX: Set Interpolation Type LAST!
            // AE automatically converts keys to Bezier if you touch their easing.
            // Forcing the interpolation type here ensures Linear stays Linear and Hold stays Hold.
            prop.setInterpolationTypeAtKey(newK, d.inType, d.outType);
        }

        // --- FINAL ROVING PASS ---
        for (var i = 0; i < keyData.length; i++) {
            if (keyData[i].roving) {
                try { prop.setRovingAtKey(newKeys[i], true); } catch(e) {}
            }
        }
        
        return newKeys; 
    }

    // Helper: Clones keys safely, handles complex Mirror math, prevents Linear-to-Bezier conversion
    function clonePropertyKeyframes(prop, keyIndices, timeOffset, isMirror, blockDuration, blockEarliest) {
        var keyData = [];
        for (var i = 0; i < keyIndices.length; i++) {
            var k = keyIndices[i];
            var kData = {
                time: prop.keyTime(k),
                value: prop.keyValue(k),
                inType: prop.keyInInterpolationType(k),
                outType: prop.keyOutInterpolationType(k)
            };
            try { kData.inTempEase = prop.keyInTemporalEase(k); } catch(e) {}
            try { kData.outTempEase = prop.keyOutTemporalEase(k); } catch(e) {}
            try { kData.tempCont = prop.keyTemporalContinuous(k); } catch(e) {}
            try { kData.spatCont = prop.keySpatialContinuous(k); } catch(e) {}
            try { kData.roving = prop.keyRoving(k); } catch(e) {}
            try {
                if (prop.propertyValueType === PropertyValueType.TwoD_SPATIAL || prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL) {
                    kData.inSpatTang = prop.keyInSpatialTangent(k);
                    kData.outSpatTang = prop.keyOutSpatialTangent(k);
                }
            } catch(e) {}
            keyData.push(kData);
        }

        for (var i = 0; i < keyIndices.length; i++) {
            prop.setSelectedAtKey(keyIndices[i], false);
        }

        for (var i = 0; i < keyData.length; i++) {
            var d = keyData[i];
            if (isMirror) {
                d.newTime = (blockEarliest + timeOffset) + (blockDuration - (d.time - blockEarliest));
            } else {
                d.newTime = d.time + timeOffset;
            }
        }

        keyData.sort(function(a, b) { return a.newTime - b.newTime; });

        var newKeys = [];
        for (var i = 0; i < keyData.length; i++) {
            var d = keyData[i];
            var newK = prop.addKey(d.newTime);
            newKeys.push(newK);
            
            prop.setValueAtKey(newK, d.value);
            
            // 1. Set Continuity BEFORE applying custom tangents and eases
            if (d.tempCont !== undefined) try { prop.setTemporalContinuousAtKey(newK, d.tempCont); } catch(e) {}
            if (d.spatCont !== undefined) try { prop.setSpatialContinuousAtKey(newK, d.spatCont); } catch(e) {}
            
            // 2. Apply custom Math (Eases & Tangents)
            if (isMirror) {
                if (d.outTempEase !== undefined && d.inTempEase !== undefined) {
                    try { 
                        var newInEase = [], newOutEase = [];
                        for(var e=0; e<d.outTempEase.length; e++) {
                            var spd = d.outTempEase[e].speed;
                            if (prop.propertyValueType === PropertyValueType.OneD) spd = -spd;
                            newInEase.push(new KeyframeEase(spd, d.outTempEase[e].influence));
                        }
                        for(var e=0; e<d.inTempEase.length; e++) {
                            var spd = d.inTempEase[e].speed;
                            if (prop.propertyValueType === PropertyValueType.OneD) spd = -spd;
                            newOutEase.push(new KeyframeEase(spd, d.inTempEase[e].influence));
                        }
                        prop.setTemporalEaseAtKey(newK, newInEase, newOutEase); 
                    } catch(e) {}
                }
                
                if (d.outSpatTang !== undefined && d.inSpatTang !== undefined) {
                    try { prop.setSpatialTangentsAtKey(newK, d.outSpatTang, d.inSpatTang); } catch(e) {}
                }
            } else {
                if (d.inTempEase !== undefined && d.outTempEase !== undefined) {
                    try { prop.setTemporalEaseAtKey(newK, d.inTempEase, d.outTempEase); } catch(e) {}
                }
                if (d.inSpatTang !== undefined && d.outSpatTang !== undefined) {
                    try { prop.setSpatialTangentsAtKey(newK, d.inSpatTang, d.outSpatTang); } catch(e) {}
                }
            }

            // 3. CRITICAL FIX: Set Interpolation Type LAST!
            if (isMirror) {
                prop.setInterpolationTypeAtKey(newK, d.outType, d.inType);
            } else {
                prop.setInterpolationTypeAtKey(newK, d.inType, d.outType);
            }
        }
        
        // --- FINAL ROVING PASS ---
        for (var i = 0; i < keyData.length; i++) {
            if (keyData[i].roving) {
                try { prop.setRovingAtKey(newKeys[i], true); } catch(e) {}
            }
        }
        
        return newKeys;
    }

// Helper to trace property path for correct UI ordering
    function getPropertyPath(prop) {
        var indices = [];
        var currentProp = prop;
        while (currentProp.parentProperty !== null) {
            indices.unshift(currentProp.propertyIndex);
            currentProp = currentProp.parentProperty;
        }
        return indices;
    }
    // ==========================================
// --- LAYER MODE FUNCTIONS ---
// ==========================================

    function SequenceLayers(offsetFrames, step, direction) {
        var comp = app.project.activeItem;
        if (!comp || comp.selectedLayers.length === 0) return;
        if (step < 1) step = 1; 

        app.beginUndoGroup("Sequence Layers");

        // Sao chép mảng layer để tránh lỗi tham chiếu khi lật mảng
        var layers = [];
        for (var i = 0; i < comp.selectedLayers.length; i++) {
            layers.push(comp.selectedLayers[i]);
        }

        // Mặc định: Sắp xếp layer theo Index từ trên xuống dưới
        layers.sort(function(a, b) { return a.index - b.index; });

        if (direction === "reverse") {
            layers.reverse();
        } else if (direction === "random") {
            for (var i = layers.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = layers[i];
                layers[i] = layers[j];
                layers[j] = temp;
            }
        }

        var fps = comp.frameRate;
        var offsetTime = offsetFrames / fps;

        for (var i = 0; i < layers.length; i++) {
            var groupIndex = Math.floor(i / step);
            // Dịch chuyển inPoint (bằng cách cộng vào startTime)
            layers[i].startTime += groupIndex * offsetTime;
        }

        app.endUndoGroup();
    }

    function AlignLayersToCTI() {
        var comp = app.project.activeItem;
        if (!comp || comp.selectedLayers.length === 0) return;

        app.beginUndoGroup("Align Layers to CTI");

        var layers = comp.selectedLayers;
        var cti = comp.time;

        for (var i = 0; i < layers.length; i++) {
            // Đẩy thời điểm bắt đầu (inPoint) của tất cả layer bằng với CTI
            var offset = cti - layers[i].inPoint;
            layers[i].startTime += offset;
        }

        app.endUndoGroup();
    }

    function ShiftLayersToCTI() {
        var comp = app.project.activeItem;
        if (!comp || comp.selectedLayers.length === 0) return;

        app.beginUndoGroup("Shift Layer Block to CTI");

        var layers = comp.selectedLayers;
        var cti = comp.time;
        var earliestTime = layers[0].inPoint;

        // Tìm layer có inPoint sớm nhất
        for (var i = 1; i < layers.length; i++) {
            if (layers[i].inPoint < earliestTime) {
                earliestTime = layers[i].inPoint;
            }
        }

        var globalOffsetTime = cti - earliestTime;
        if (globalOffsetTime === 0) {
            app.endUndoGroup();
            return;
        }

        // Giữ nguyên stagger, đẩy toàn bộ khối theo CTI
        for (var i = 0; i < layers.length; i++) {
            layers[i].startTime += globalOffsetTime;
        }

        app.endUndoGroup();
    }


  }(this));