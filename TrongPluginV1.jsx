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

        // Create the preset tab
        var presetTab = tabPanel.add("tab", undefined, "Preset");
        var presetGroup = presetTab.add("group", undefined, {name: "presetGroup"});
        presetGroup.orientation = "column";
        presetGroup.alignChildren = ["left", "center"];

// OVERSHOOT TAB

        // Add label and input for percentage
        var percentageGroup = overshootGroup.add("group");
        percentageGroup.alignChildren = ["left", "center"];
        percentageGroup.add("statictext", undefined, "Phần trăm:");
        var inputPercent = percentageGroup.add("edittext", undefined, "20");
        inputPercent.characters = 5;
        inputPercent.onlyNumbers = true;
        inputPercent.helpTip = "Nhập số phần trăm mà keyframe overshoot sẽ đi quá"

        // group số key frame
        var frameCountGroup = overshootGroup.add("group");
        frameCountGroup.alignChildren = ["left", "center"];
        frameCountGroup.add("statictext", undefined, "Số key chèn thêm:");

        var incrementGroup = overshootGroup.add("group");
        incrementGroup.alignChildren = ["left","right"];

        var btnMinus = incrementGroup.add("button", undefined, "-");
        btnMinus.size = [20,20];

        var inputCount = incrementGroup.add("edittext", undefined, 1);

        var btnAdd = incrementGroup.add("button", undefined, "+");
        btnAdd.size = [20,20];
        
        inputCount.characters = 5;
        inputCount.onlyNumbers = true;
        inputCount.helpTip="Nhập số keyframe overshoot mà bạn muốn chèn"
    
        // checkbox chèn giữa
        var checkbox = overshootGroup.add("checkbox", undefined, "Chèn vào giữa");
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

        // --- OFFSET KEYFRAMES UI ---
        var offsetMainGroup = overshootGroup.add("group");
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
        inputOffset.helpTip = "Số frame cách nhau giữa các thuộc tính";
        
        offsetRow1.add("statictext", undefined, "Step:");
        var inputStep = offsetRow1.add("edittext", undefined, "1");
        inputStep.characters = 3;
        inputStep.onlyNumbers = true;
        inputStep.helpTip = "Số thuộc tính đi cùng nhau trong 1 nhịp (Step)";

// --- BINARY ICON STRINGS ---
        var binSeqFwd = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00~IDATx\x01\u00ED\u00D2A\n\u0080 \x10\u0085\u00E1\u00E7\u00B4\u00ECt\u00DD\u00A0\u009Bh'\u0092\u008E\u00D4\x19\u00D2\u00ADFH\u009BBa@\u00C4p>h\u0095\u00F0D~@\u0088\u00E1\u00D0\u00EE5Y\u00AF\u00D1R\x1Au1}u\u00C7\x15\n\u00A3\b\u00D1\u00BC\u008E\u009B\u00B0\u00CC\x1B*\u00A0\u00EC\u009F\x10>\u0097R\u0088\x07Z {\u009A\u00E7\u00A9'\u00EBV\u00B4t\u008F7\x1F-\u00F9m\u00ED\u008Ay\u00BEZ\u00ED\x04.\u00A9\u00BD\x17\u00DD\u00D7\u00CE\u00AE\u00BA4\u00CA\u00A9\u009D_u\u008E\u00D4.\u00C4p.\x16\u00A1s\x186c!r\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binSeqRev = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00\u0081IDATx\x01\u00ED\u00D2A\n\u0080 \x10\x05\u00D0\u00AF-;]7\u00E8&\u00DA\u0089\u00A4#u\u0086t\u00AB\x11\u00D2\u00A6\x1AEP)\u0098\x07\u00AE\u0094\u00F98|\u00801\u0096!W\u00A7\u00A4q\n=\u00C5P\x1B\u00E2I\u0087\x0BT\f\u0085\x0F\u00FA6^\u00FBi\\^\u00DF\u00A3\x16\u00EF\x1F\u009F\x10\b\x1Bz\u0090f\u00D7\u00D7\u00AA\x07cg\u00F4t\u00867\r\u00FD|{)\u00C5\u00AD.m/9\x07\u00A5\u00B8\u00BD\u00CD\x02\u00FE\u00DA^\u008AH\u0085\u00D6h/9\u009F\u00BC\u00E1\u00F62\u00C62\x0E\x16\u00A1s\x18;\u00E7\u00C1\"\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binSeqRnd = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00\x7FIDATx\x01\u00ED\u00D4A\n\u0080 \x10\x05\u00D0\u00AF-;]7\u00E8&\u00DA\u0089\u00A4#u\u0086t\u00AB%\u00D2\u00A6\u00C8DE\x12\u00E6\u0081K\u00FD2|\x06 \u0084\u00BC\u00E0\u00AB\x11\\\x19\u0081\u0096B\u00A8v\u00E1\u00A4\u00853\x14\u00F2\u00A1\u00B0N\u00DE\u009E\u0095v\x1A\u0097\u00E8=\u0094\u00B2\u00F6\u00F1y\x06\u00B7\u00A1\x05\u00AEvy\u008DzPzFK>\u00BCzh7\u008DM\u00C1\u00BEBs\x1A\u009B\"\u00DEjj\u00EC_t\u00D9\u00F6\u00AC]]\u00A3\u00EDy\u00BB\u009A\u00DAN\b9\x1D\x16\u00A1s\x180\u0089\u00FC\u00F7\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binShift  = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00\u00F9IDATx\x01\u00ED\u0094\u00C9\r\u00C20\x10E'\u0086\x1B \u00D1\x11\u00A4\u0084t\x00\x1D Q@\x1C*\u00E0@\x01t`\u00D1\x01\x12%p\u00E1\u00C2\u0081\x1A\u0092\b\u00C4\u00E2!\u00CB\u0081-\u008E\u0097D\n ?\u00C5\u00B2\x15\x7F\u00CF\u00D8#\x7F\x03X,M\u0081\u00C9\u0087YW/\x04\x1A\u00A2\u00B1\u00C4m\u00A9\x02\u00D1\u00CDz\u00C7\u0081:\u00F9\u00BDR\u0093U\u00EC\x13\x16\u00FB\u00A6:y\u00A9\x05\u00C1\u0080#\u00CD\u00C6,\x06\u00EEu\x02]\u009D\u00F6\u0089\u009F\u0083\u00E5 -:\u0091L\u00A7_j\u00CE?n\u0099\x03x\u00D0\u00D5i'\u00E6^\u008F&\u00BB\x0F\x1E\u00C1`|\u00F3\u00BAKS\u009D\x10D\x1C\u00A6\u00ED\u00FD?a!m\u00B1h$[\u00AF\u00AASN\\\u0095\u00EF}\u00B9f\u00BB\u00EB \u00BC`?\x19\u00AE\u008B\u00E6\u00F3\u00DB\x0BBK\x19\u0091\x06u7GL\u009B\u00C82\u0084E\u00987\u00F9c\u00F2\u00B2\u00B6,i\u00A9\x0F\x15\u00FD\u00AC\u009DX\u00EAWU?\u00EB&\u0096\u00F9\u00B0\u00B2OeL\u00B7\u00A7\u00F9b\x7F\u009E\u0088\u00E6\u008D}j\u00B1\u00FC\x1Dw\x00\u0083\u00A4\u00FBDn\u00F5\x11\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binAlign  = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x1E\b\x06\x00\x00\x00;0\u00AE\u00A2\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x00\u00EDIDATx\x01\u00ED\u0093\u00DB\r\u00820\x14\u0086\x0F\u00D575q#e\x046\u00D0\rL\x1C\u00C0\u00E2\x04>8\u0080\x1B4n`\u00E2\b\u00BE\u00F8\u00E2\u00833\u0080\u00D1x\u00E9\u00B1\u00E0\x03^bO\u0081\x1A$\u00E9\x17\u009A\x12\u00F2s~H\u00FA\x018\x1CU\u0081\u00EA\u00C2t\u00B3\x0B\u0083\u008A\u00A8\u00AC\u00B8I&\x10\u00FDt\u00F7<\u00B0\u00C9\u00FF\u00FE\u00F1t{\u00EDE\x17\u00EC\u00AA\u00DB\x15\u0095e\u00CB\u00C3\x04$\u0080\fZ!\u0094!\x19\u00E4\u00AF\u008F\u0098,&\u00D4P\"\u00CBD\u008C\u008F\u00A5\u00CF\u00A6y\u00DD \u0090\u00C8\u00B3'\u00C8\u00BF\r\u00CC\u0093%\u008BA\u00CA\u008F\u00D3\u00E4\x01\u00EEKg\u00A9b\x19t\u00B8\u00FA\u00F20\x1B\x04\u00C3[\u00D0^\u0094\u00CD\x1A3\u00DE\u009Cf\u00F3\u00DDyd\u0092e\"\u00E2\r\x11\x0F\u00C0\x06\u0088\u00D8O\x16X\u00A6\u00BE\x1E[s\u00F7}\u00A8\u00CE\u00E3\u00BC\u00EE\u00BE\u00BC\u00AB+\u00D5\u00B9Y\u00C4]\u00A3b\u00D2\u00CD\x02\u00EE\x1A\x15Sn\u00FE\u00C4\u00DDg(\u008F\u00AD\u00BA\u00EBp\u00D4\u009A;\u0093\x06\u00A6BY\u00CE\u0091]\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binCloneIcon  = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00P\x00\x00\x00\x1E\b\x06\x00\x00\x00\u00BBC\u0099\u00B1\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x02vIDATx\x01\u00ED\u0098Qn\u00D3@\x10\u0086'.HH\u00F0`N\u00809\x01\u0081\x13\u0084\x13\u00D0\u009C\u00A0\u00E6\x04\u00C0\t\u00BA7H{\u0082\u0084\x03\u00A0%\u00EFH\u00EE\x05\u0090\u00C3\x13\u008FI_yI\u00A1\u00A9*@\u00CE2Cf\u00CBv\u00B1\u0093]\u00D6\u00B4U\u00BA\u009F4Zg\u00FCg\u00BD\u00F93;v\x02\x10\u0089D\"\u0091\u00C8MD\x01\x14\x18\n\u00A3\x07[J\x02\u0091 \u00A2\u00817\x1D\u00A5\u0094\u0080-&V` ^\x06b5e\x18\x05\u008D.\u00FA\u009D\u00F1\u00F9\u00DE\u0087/\u00D5\x13\u0088\\\u00987U+\u00A6\u009BL$\u00F3\x12\u00B9P\u00E2\u00F3w\u00B5#\x17Ch\x01^\u00C3\u0080\u00AF_b\f\u00F5:8\u009F\u00C1\x15\u00E3T\u0081\u00BC\u00B0\x02#\u00E3\u00D4\u00EF\u00D7M\x0B&\u00F3\u00D4\u00B2\x1A]\u00BC\x1F o\u00C9DZ\u00C3q\u00A7\u00D3y\u008C\u00F1\u0094\u008E1\u00F4\u00BC]\u00B8\x06Bz\u00E0\t\u00C7\u00DF\u0093.\u00ABO\u00F69\u00B5T\u00C7\x10\x00~Y9\x0EGh\u00DC\u0081\u00CE\u00E1\u00B1\u00A0\u00EB\u00E0\u00B9\u00AE\u00AD\u00C5\u0090V\u0085R\u00AE\u00C79\u00FA\u00F2w\r\u00FD+[\u00DF:\u00D6\x16\u00A6\u00ED\u0093\u00AE\u00D3\u00DF\u0095\u008B.n\u00E19m\u00E1\u00E4\u00DD\u00A9\u0080@\u00F0z\x07lb\u00D3\u00F9\u0082\u00D7\u00B8\u008F1\u00E2\u00E3]\u00BDV\u00CE\u0095\u009C\u00EF\u00F2gI-=\u0099\\\u00C2\u00FF\u0082/\"7\u0099\u00A7!\x13?~\u00AD\u00DA\u00EA\x7F#G\x03K\u00B3\u008A\u00B4\u00F1\u00FC\u00FE\u009E\u0091/\r\u00BD`M\u00CE\u00AF\u009D\u00DB\u00C1\x1D\u00F0\x00\u00B7\u00CC\f\u0087\u00BE\u00AB\u00FEg\u00FF\u00C1\u00E4\u0099\n\u00DB\u00BA\x06\x13\u00A8\u00E9sTA8\u008C\u008DT\u00CA\u00EB\u00D4\u00D4\u00B6\x19#\u00AF\u008B!\u00E3q\f\x1E\u00B4\u00F2\x1C\u00E8Z\u0091\u009AT\u00FA\u00E9\u0099\x11\u00C6\x0B\u00AB\u00BA\u00C8\u00D0\x1C\r\u009B\x18\u00BA\u0099\u00AE4^\u00D7\x1E\u00C6\u00D1\u009Ayg\u00B0\u00EA\u00AD\u0082{\u00EA#k\u00BE\u00B5\x04\x1B\u00C8\u008B\u00A4\u00ED\u00E3\u00B4U\u00EF\u00C9\u00F3\u00EC\x1B\u009C\u0095\u0089<\u00DB\x07\x0F\u00F0CQ\u00C5\u00F4\u00F9Z\x05\u00F7\u00AA\x01\u00C6sK\u00FA\x12cH\x1A\x1CIshU$4\u00E9\u00A9/\u00C2\u00EA\u00CE~5p\x13.\u00D5\x1F\u00865\x1A\u00A1\u008F\u00C9<\u00BC\u00B1L\u00E9\u00F9p\x15~&\x1Asf\u009B\u00EE\u0096\u00ACq\u00AEt_\u00BD&\u00B4\x02%\\\u00EEK\u00D4\u0084\x07\u00F5\u00CAy\u00FA\x03*\u00F3Y\x12Q\x02\u009F\x0Fs\u00F0\u0084*jCUi\u00CD\t\u00F8\u00CD\u00E9\u00AC\u00D7\u0084\x1A\u00F8\x06.7\u00E9\x19\u00C6a\u00AD\u00B2\u00FF\x10u\u00EA\u00AD\u0095\u009DTp\u00FF=\u00DCf\u00F8\u0099j\u00AE\x1A~\u00DE)\u00EB\u00DF\u0098D\u009E\n\u00DE\u00C2%\u00FC\u00DB\u00CDd\u00FB`\x13\u00B3\u0086s\u00C2\u00CE\u00A1y\u00AF\u00A3y\u0091H$\x12\u0089D\u00C2\u00F8\x05x\u00F9\x1Da$n\u00DC\u00BB\x00\x00\x00\x00IEND\u00AEB`\u0082";
        var binMirrorIcon = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00P\x00\x00\x00\x1E\b\x06\x00\x00\x00\u00BBC\u0099\u00B1\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\x0EtEXtSoftware\x00Figma\u009E\u00B1\u0096c\x00\x00\x02RIDATx\x01\u00ED\u0097Qn\u00D3@\x10\u0086\u00C7Iy@\u00A2\x12\u00DC\u00C0G\u00F0\r\u00C8\r\u00A8O\u00D0\u00E4\x04mO\u00D0\u00E5\u0095\x17\u0092\x13\u00C4=\x00\u0098\u009C\x00s\x02\u00E0\u0089\x07\x1E\b\u00E2\x00\x05\u0092\u00A8B\x10/\u00F3\u00C7\x13\u00D8Xi\u00EB\u00B5\u00D34\u00AD\u00E6\u0093~\u00AD<\u00BB\u00DE\u00AC\x7F\u00CF\u00AC7D\u008A\u00A2(\u008A\u00B2\u008BX\"\u00C3\u00B2h\u00E9\u009E\u00D2\"\u00A5\x11j\u00E0\u00AEc\u00AD5t\u008F\u00D1\fl\u0088\u0097\u0081\u009CM\u00A7\x105\u00A45\u009A\u009D\u00B6\u00D2Y\u00E3y\u00EE\x14b\u00DE\u0092\u00CA\x0F_.\u00E1\u00C2\u00BC\u00A9-4\u00F3\u0099'b\u00BDeuJ\u00F1\x03\u0089\u0087\u00AC\u00C7\u00B4e*e\u00A0\x18f\u009C\u0090\u00A9\u0093\u00890\u008Fr\u00D7Pk<L\u00849\x1D\u00D6A)~(q\u00D0\u0085\u00A1\u00B4E\u00F6*\u008E\x0B\u00D6\u00C4\u00BE\u0092/y\x1E\u0094\u00A7\n\u00C8\u00FA\u00CC\u00F3\u0086\n\u00C3\u008Eq!\x19\x17\u00B12\u00E9\u00FF\x0E9&>e\u00BD\u00A3\u00C2|>\u008E.\u008C\x1E\u00C9\u00F8#\u00B9\u00C6\u009CgA\x10\u00E0\u00BE\u00BE\u00F4=c\u009D v\u00CDz\u00AAe Od\u00B8y\u00EE\u0084z\x1CK\u00C8\u0093<\u00DE7\u00FC\x1C\u00FF\u00E6a+{\u00F3\u00F8QB\u00D5\u00C1\x03}p\u00CA\x18FeN?\u00E2!\x15\u00A6\"\u00B3?b\u00BC\u00C4\r\u00FD7\u00EF=\u00EB\x07\u00AB\u00C7z\u00C2\x1A\u00CA\u00FD0\x0E/hT\u00C5<o\u00B0\u009F\u00B1\u00BA\u00BE\u00F7\u0094c\u00ADtb\u00DA\u00E9\u00B4K\x1E\u00C04\u00D6P\u00F6\u00BC\u00BE\u00C4Rgo\u00C4\x1E\u0098`}\u00B2\u00CEc\u00E7\u00DEd\u00B9\u00EE\u00E5\u00F8\u00D2\u00DC_\u0090\u00CDh\u00C9\u0093\u00AA%\u00BC@2\u00B11E&\u00D6&c\u00BD\x14\x13#^\x132r\u00DD8\u009F\f\x1ASQ\u00E6\u00DEl\u00E4\x1C\u00B8\u00CD\u00AF\u009F\u0094\x16J\x11%: \x7F\u00C6,dk\u0088\x0BiC\u009EwL5hl /\x00{\x06J *\u00F7\u00B5G\x17\u0087/>\u00FF>z\u0090N#\u00DA,\u00D8\u00F8\u00BB\u00D2z!/\u00E0\u00845\u0094RNY1\u00DD\x060\u00CF9\x1B\u009E\u00BB&\u00C2<\u009C\u00F5\u00CC\u00A7_8\u00F3\u009D\u00DF\u0080\u0089\u008DYfa\x13jg\u00A0|\t\x13'\u00842^l\u00E6{\u00E9\u00A4c\u00F3\u00F9J\u00DF\u009C\u00FB(\u00BD\bi\u0087\u00A8[\u00B6.\u00B5\r\u00E4\x1F\u00CF\u00B89+\u0085\x07X\u00D4\u009Fx?\x0Bl\u00BE\u00DA\u0097\u00DB\x01\u00C5\x0F\u00C7\u00A4\u00AC\"G\x04\u00BB\u00EE\u00B8\u00D2~\u00FD3Y\u0094\u00F0\u00AB\u0089!\u00E5r\u00AE\u00FA\u00FB\u00F4m:\u00EF\u0093\u00A2(\u008A\u00A2(\u00CA\u00C6\u00F9\x0Bmvk\x05>\x04\x1D\u00E1\x00\x00\x00\x00IEND\u00AEB`\u0082";

        // --- ROW: ALL 5 ICONS ---
        var iconGroupRow = offsetMainGroup.add("group");
        iconGroupRow.alignChildren = ["center", "center"];
        iconGroupRow.spacing = 5; // Tightly packed in one row
        
        var btnSeqForward = iconGroupRow.add("iconbutton", undefined, binSeqFwd, {style: "toolbutton"});
        var btnSeqReverse = iconGroupRow.add("iconbutton", undefined, binSeqRev, {style: "toolbutton"});
        var btnSeqRandom  = iconGroupRow.add("iconbutton", undefined, binSeqRnd, {style: "toolbutton"});
        var btnAlignAll   = iconGroupRow.add("iconbutton", undefined, binAlign, {style: "toolbutton"});
        var btnShiftBlock = iconGroupRow.add("iconbutton", undefined, binShift, {style: "toolbutton"});
        
        btnSeqForward.size = btnSeqReverse.size = btnSeqRandom.size = btnAlignAll.size = btnShiftBlock.size = [30, 30];
        
        btnSeqForward.helpTip = "Dịch keyframe tiến về phía trước";
        btnSeqReverse.helpTip = "Dịch keyframe đảo ngược thứ tự";
        btnSeqRandom.helpTip  = "Dịch keyframe ngẫu nhiên";
        btnAlignAll.helpTip   = "Dóng thẳng hàng tất cả keyframe vào Thời điểm hiện tại (xoá stagger)";
        btnShiftBlock.helpTip = "Dịch chuyển toàn bộ khối keyframe vào Thời điểm hiện tại (giữ nguyên stagger)";

    // --- ROW 4: CLONE & MIRROR ---
        var cloneMirrorRow = offsetMainGroup.add("group");
        cloneMirrorRow.alignChildren = ["center", "center"];
        cloneMirrorRow.spacing = 15;
        
        // Change these from "button" to "iconbutton" with the flat toolbutton style
        var btnClone = cloneMirrorRow.add("iconbutton", undefined, binCloneIcon, {style: "toolbutton"});
        var btnMirror = cloneMirrorRow.add("iconbutton", undefined, binMirrorIcon, {style: "toolbutton"});
        
        // Lock the size to match your Figma frame
        btnClone.size = [80, 30];
        btnMirror.size = [80, 30];
        
        btnClone.helpTip = "Nhân bản keyframe đã chọn và dán tại Thời điểm hiện tại";
        btnMirror.helpTip = "Nhân bản và đảo ngược keyframe đã chọn vào Thời điểm hiện tại";

        // --- EVENTS ---
        btnSeqForward.onClick = function() { SequenceKeyframes(Number(inputOffset.text), Number(inputStep.text), "forward"); }
        btnSeqReverse.onClick = function() { SequenceKeyframes(Number(inputOffset.text), Number(inputStep.text), "reverse"); }
        btnSeqRandom.onClick  = function() { SequenceKeyframes(Number(inputOffset.text), Number(inputStep.text), "random"); }
        btnAlignAll.onClick   = function() { AlignAllToCTI(); }
        btnShiftBlock.onClick = function() { ShiftBlockToCTI(); }
        btnClone.onClick      = function() { CloneKeyframesToCTI(false); }
        btnMirror.onClick     = function() { CloneKeyframesToCTI(true); }

//PRESET TAB

        // Add group for button preset
        var title1 = presetGroup.add("statictext", undefined, "Overshoot Scale");
        var scaleXYGroup = presetGroup.add("group");
        
        scaleXYGroup.alignChildren = ["left", "left"];
        var btnScaleXY1 = scaleXYGroup.add("button", undefined, "Scale XY-1");
        var btnScaleXY2 = scaleXYGroup.add("button", undefined, "Scale XY-2");
        btnScaleXY1.helpTip = "Scale Overshoot đều 1 lần vào đầu layer";
        btnScaleXY2.helpTip = "Scale Overshoot đều 2 lần vào đầu layer";
        btnScaleXY1.size = [65, 30];
        btnScaleXY2.size = [65, 30];

        btnScaleXY1.onClick = function(){
             OverShootScaleXY1();
        }
        btnScaleXY2.onClick = function(){
             OverShootScaleXY2();
        }
        
        //PRESET OVERSHOOT X

        // Add group for button preset
        var scaleXGroup = presetGroup.add("group");
        scaleXGroup.alignChildren = ["left", "center"];
        var btnScaleX1 = scaleXGroup.add("button", undefined, "Scale X-1");
        var btnScaleX2 = scaleXGroup.add("button", undefined, "Scale X-2");
        btnScaleX1.helpTip = "Scale Overshoot trục ngang 1 lần vào đầu layer";
        btnScaleX2.helpTip = "Scale Overshoot trục ngang 2 lần vào đầu layer";
        btnScaleX1.size = [65, 30];
        btnScaleX2.size = [65, 30];

        btnScaleX1.onClick = function(){
             OverShootScaleX1();
        }
        btnScaleX2.onClick = function(){
             OverShootScaleX2();
        }

        //PRESET OVERSHOOT Y

        // Add group for button preset
        var scaleYGroup = presetGroup.add("group");
        scaleYGroup.alignChildren = ["left", "center"]; 
        var btnScaleY1 = scaleYGroup.add("button", undefined, "Scale Y-1");
        var btnScaleY2 = scaleYGroup.add("button", undefined, "Scale Y-2");
        btnScaleY1.helpTip = "Scale Overshoot trục dọc 1 lần vào đầu layer";
        btnScaleY2.helpTip = "Scale Overshoot trục dọc 2 lần vào đầu layer";
        btnScaleY1.size = [65, 30];
        btnScaleY2.size = [65, 30];

        btnScaleY1.onClick = function(){
             OverShootScaleY1();
        }
        btnScaleY2.onClick = function(){
             OverShootScaleY2();
        }


        //PRESET OVERSHOOT ROTATION + SCALE
        var title2 = presetGroup.add("statictext", undefined, "Overshoot Scale + Rotation");
        var scaRotGroup = presetGroup.add("group");
        scaRotGroup.alignChildren = ["left", "center"];
        var btnScaro1 = scaRotGroup.add("button", undefined, "Scaro-1");
        var btnScaro2 = scaRotGroup.add("button", undefined, "Scaro-2");
        btnScaro1.helpTip = "Scale + Rotaion Overshoot 1 lần vào đầu layer";
        btnScaro2.helpTip = "Scale + Rotaion Overshoot 2 lần vào đầu layer";
        btnScaro1.size = [65, 30];
        btnScaro2.size = [65, 30];

        btnScaro1.onClick = function(){
                OverShootScaleRot1();
        }
        btnScaro2.onClick = function(){
                OverShootScaleRot2();
        }


        //PRESET FADE IN FADE OUT
        var title3 = presetGroup.add("statictext", undefined, "Fade In + Out");
        var fadeInGroup = presetGroup.add("group");
        fadeInGroup.alignChildren = ["left", "center"];
        var btnFadeIn = fadeInGroup.add("button", undefined, "Fade In");
        var btnFadeOut = fadeInGroup.add("button", undefined, "Fade Out");
        btnFadeIn.helpTip = "Fade In đầu layer";
        btnFadeOut.helpTip = "Fade Out cuối layer";
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
        footerGroup.orientation = "row";
        footerGroup.alignChildren = ["center", "center"];
        footerGroup.margins = [0, 2, 0, 0]; // Push it slightly down from the tabs
        
        footerGroup.add("statictext", undefined, "Một chiếc plugin bởi Trọng");
        
        var helpBtn = footerGroup.add("button", undefined, "♥︎");
        helpBtn.size = [20, 20];
        helpBtn.helpTip = "Liên hệ Tác giả";
        
        helpBtn.onClick = function() {
            var url = "https://www.facebook.com/phanductrong34";
            
            // System calls to open default web browser based on OS
            if ($.os.indexOf("Windows") !== -1) {
                system.callSystem("cmd.exe /c start \"\" \"" + url + "\"");
            } else {
                system.callSystem("open \"" + url + "\"");
            }
        };
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
            alert("Lắc thế thì chết à :))))");
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



    function OverShootScaleXY1(){
        // Define the undo group
        app.beginUndoGroup("Add Scale Overshoot Keyframes");

        // Loop through all selected layers
        // get the active composition , chỉ 1
        var comp = app.project.activeItem;
        var selectedLayers = comp.selectedLayers;

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            propScale = layer.property("Scale");

            propScale.addKey(startTime);
            propScale.setValueAtTime(startTime, [0, 0]);

            propScale.addKey(_frameLater(startTime,10));
            propScale.setValueAtTime(_frameLater(startTime,10), [120, 120]);
            
            propScale.addKey(_frameLater(startTime,20));
            propScale.setValueAtTime(_frameLater(startTime,20), [100, 100]);

            //loop through all selected layers and keyframe and turn them into bezier with 50% ease in and ease
            var easeIn = new KeyframeEase(0.5, 50);
            var easeOut = new KeyframeEase(0.5, 50);
            for (var j = 1; j <= 3; j++) {
                propScale.setTemporalEaseAtKey(j, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            }
            
        }

        // End the undo group
        app.endUndoGroup();
    }

    function OverShootScaleXY2(){
        // Define the undo group
        app.beginUndoGroup("Add Scale Overshoot Keyframes");

        // Loop through all selected layers
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            propScale = layer.property("Scale");

           propScale.addKey(startTime);
           propScale.setValueAtTime(startTime, [0, 0]);

           propScale.addKey(_frameLater(startTime,10));
           propScale.setValueAtTime(_frameLater(startTime,10), [130, 130]);

           propScale.addKey(_frameLater(startTime,20));
           propScale.setValueAtTime(_frameLater(startTime,20), [90, 90]);
            
           propScale.addKey(_frameLater(startTime,30));
           propScale.setValueAtTime(_frameLater(startTime,30), [100, 100]);

            //loop through all selected layers and keyframe and turn them into bezier with 50% ease in and ease
            var easeIn = new KeyframeEase(0.5, 30);
            var easeOut = new KeyframeEase(0.5, 60);

            propScale.setTemporalEaseAtKey(1, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            propScale.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(3, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(4, [easeOut, easeOut, easeOut], [easeIn, easeIn, easeIn]);
        }

        // End the undo group
        app.endUndoGroup();
    }

    //Same function as overShootScaleXY1 but only with x value, the y value is 100
    function OverShootScaleX1(){
        // Define the undo group
        app.beginUndoGroup("Add Scale Overshoot Keyframes");

        // Loop through all selected layers
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            propScale = layer.property("Scale");

            propScale.addKey(startTime);
            propScale.setValueAtTime(startTime, [0, 100]);

            propScale.addKey(_frameLater(startTime,10));
            propScale.setValueAtTime(_frameLater(startTime,10), [120, 100]);
            
            propScale.addKey(_frameLater(startTime,20));
            propScale.setValueAtTime(_frameLater(startTime,20), [100, 100]);

            //loop through all selected layers and keyframe and turn them into bezier with 50% ease in and ease
            var easeIn = new KeyframeEase(0.5, 50);
            var easeOut = new KeyframeEase(0.5, 50);
            for (var j = 1; j <= 3; j++) {
                propScale.setTemporalEaseAtKey(j, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            }
            
        }

        // End the undo group
        app.endUndoGroup();
    }

    //Same function as overShootScaleXY2 but only with x value, the y value is 100
    function OverShootScaleX2(){
        // Define the undo group
        app.beginUndoGroup("Add Scale Overshoot Keyframes");

        // Loop through all selected layers
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            propScale = layer.property("Scale");

           propScale.addKey(startTime);
           propScale.setValueAtTime(startTime, [0, 100]);

           propScale.addKey(_frameLater(startTime,10));
           propScale.setValueAtTime(_frameLater(startTime,10), [130, 100]);

           propScale.addKey(_frameLater(startTime,20));
           propScale.setValueAtTime(_frameLater(startTime,20), [90, 100]);
            
           propScale.addKey(_frameLater(startTime,30));
           propScale.setValueAtTime(_frameLater(startTime,30), [100, 100]);

            //loop through all selected layers and keyframe and turn them into bezier with 50% ease in and ease
            var easeIn = new KeyframeEase(0.5, 30);
            var easeOut = new KeyframeEase(0.5, 60);

            propScale.setTemporalEaseAtKey(1, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            propScale.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(3, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(4, [easeOut, easeOut, easeOut], [easeIn, easeIn, easeIn]);
        }

        // End the undo group
        app.endUndoGroup();
    }

    //Same function as overShootScaleXY1 but only with y value, the x value is 100
    function OverShootScaleY1(){
        // Define the undo group
        app.beginUndoGroup("Add Scale Overshoot Keyframes");

        // Loop through all selected layers
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            propScale = layer.property("Scale");

            propScale.addKey(startTime);
            propScale.setValueAtTime(startTime, [100, 0]);

            propScale.addKey(_frameLater(startTime,10));
            propScale.setValueAtTime(_frameLater(startTime,10), [100, 120]);
            
            propScale.addKey(_frameLater(startTime,20));
            propScale.setValueAtTime(_frameLater(startTime,20), [100, 100]);

            //loop through all selected layers and keyframe and turn them into bezier with 50% ease in and ease
            var easeIn = new KeyframeEase(0.5, 50);
            var easeOut = new KeyframeEase(0.5, 50);
            for (var j = 1; j <= 3; j++) {
                propScale.setTemporalEaseAtKey(j, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            }
            
        }

        // End the undo group
        app.endUndoGroup();
    }

    //Same function as overShootScaleXY2 but only with y value, the x value is 100
    function OverShootScaleY2(){
        // Define the undo group
        app.beginUndoGroup("Add Scale Overshoot Keyframes");

        // Loop through all selected layers
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            propScale = layer.property("Scale");

           propScale.addKey(startTime);
           propScale.setValueAtTime(startTime, [100, 0]);

           propScale.addKey(_frameLater(startTime,10));
           propScale.setValueAtTime(_frameLater(startTime,10), [100, 130]);

           propScale.addKey(_frameLater(startTime,20));
           propScale.setValueAtTime(_frameLater(startTime,20), [100, 90]);
            
           propScale.addKey(_frameLater(startTime,30));
           propScale.setValueAtTime(_frameLater(startTime,30), [100, 100]);

            //loop through all selected layers and keyframe and turn them into bezier with 50% ease in and ease
            var easeIn = new KeyframeEase(0.5, 30);
            var easeOut = new KeyframeEase(0.5, 60);

            propScale.setTemporalEaseAtKey(1, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            propScale.setTemporalEaseAtKey(2, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(3, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
            propScale.setTemporalEaseAtKey(4, [easeOut, easeOut, easeOut], [easeIn, easeIn, easeIn]);
        }

        // End the undo group
        app.endUndoGroup();
    }   

    function OverShootScaleRot1(){
        // Define the undo group
        OverShootScaleXY1();
        app.beginUndoGroup("Add Rotation Overshoot Keyframes 1");
        // Loop through all selected layers
        // get the active composition , chỉ 1
        var comp = app.project.activeItem;
        var selectedLayers = comp.selectedLayers;

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint ;
            propRotation = layer.property("Rotation");

            propRotation.addKey(_frameLater(startTime,5));
            propRotation.setValueAtTime(_frameLater(startTime,5), 60);

            propRotation.addKey(_frameLater(startTime,15));
            propRotation.setValueAtTime(_frameLater(startTime,15), -15);
            
            propRotation.addKey(_frameLater(startTime,25));
            propRotation.setValueAtTime(_frameLater(startTime,25), 0);

            //loop through all selected layers and keyframe and turn them into bezier with 50% ease in and ease
            var easeIn = new KeyframeEase(0.5, 50);
            var easeOut = new KeyframeEase(0.5, 50);
            for (var j = 1; j <= 3; j++) {
                propRotation.setTemporalEaseAtKey(j, [easeIn], [easeOut]);
            }
            
        }
        // End the undo group
        app.endUndoGroup();
    }

    //combination of OvershootScaleRot1 with OvershootScaleXY2
    function OverShootScaleRot2(){
        // Define the undo group
        OverShootScaleXY2();
        app.beginUndoGroup("Add Rotation Scale Overshoot Keyframes 2");
        // Loop through all selected layers
        // get the active composition , chỉ 1
        var comp = app.project.activeItem;
        var selectedLayers = comp.selectedLayers;

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint ;
            propRotation = layer.property("Rotation");

            propRotation.addKey(_frameLater(startTime,5));
            propRotation.setValueAtTime(_frameLater(startTime,5), 80);

            propRotation.addKey(_frameLater(startTime,15));
            propRotation.setValueAtTime(_frameLater(startTime,15), -25);

            propRotation.addKey(_frameLater(startTime,25));
            propRotation.setValueAtTime(_frameLater(startTime,25), 13);
            
            propRotation.addKey(_frameLater(startTime,35));
            propRotation.setValueAtTime(_frameLater(startTime,35), 0);

            //loop through all selected layers and keyframe and turn them into bezier with 50% ease in and ease
            var easeIn = new KeyframeEase(0.5, 30);
            var easeOut = new KeyframeEase(0.5, 60);

            propRotation.setTemporalEaseAtKey(1, [easeIn], [easeOut]);
            propRotation.setTemporalEaseAtKey(2, [easeIn], [easeIn]);
            propRotation.setTemporalEaseAtKey(3, [easeIn], [easeIn]);
            propRotation.setTemporalEaseAtKey(4, [easeOut], [easeIn]);
            
        }
        // End the undo group
        app.endUndoGroup();
    }

    //add 2 keyframe from 0% to 100% to opacity property of every selected layers
    function FadeIn(){
        // Define the undo group
        app.beginUndoGroup("Add Fade In Keyframes");
        // Loop through all selected layers
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.inPoint;
            propOpacity = layer.property("Opacity");

            propOpacity.addKey(startTime);
            propOpacity.setValueAtTime(startTime, 0);

            propOpacity.addKey(_frameLater(startTime,10));
            propOpacity.setValueAtTime(_frameLater(startTime,10), 100);
        }
        // End the undo group
        app.endUndoGroup();
    }

    function FadeOut(){
        // Define the undo group
        app.beginUndoGroup("Add Fade Out Keyframes");
        // Loop through all selected layers
        var selectedLayers = app.project.activeItem.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var startTime = layer.outPoint;
            propOpacity = layer.property("Opacity");

            propOpacity.addKey(startTime);
            propOpacity.setValueAtTime(startTime, 0);

            propOpacity.addKey(_frameLater(startTime,-10));
            propOpacity.setValueAtTime(_frameLater(startTime,-10), 100);
        }
        // End the undo group
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
            p.selected = true;
            for (var j = 0; j < keysToSelect[i].keys.length; j++) {
                p.setSelectedAtKey(keysToSelect[i].keys[j], true);
            }
        }

        app.endUndoGroup();
    }


    function AlignAllToCTI() {
        var comp = app.project.activeItem;
        if (!comp) return;

        app.beginUndoGroup("Align All Keyframes to Thời điểm hiện tại");

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
            p.selected = true;
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

        app.beginUndoGroup("Shift Keyframe Block to Thời điểm hiện tại");

        for (var i = 0; i < validProps.length; i++) {
            var newIndices = shiftPropertyKeyframes(validProps[i].prop, validProps[i].keys, globalOffsetTime);
            keysToSelect.push({prop: validProps[i].prop, keys: newIndices});
        }

        // --- FINAL RESELECTION LOOP ---
        for (var i = 0; i < keysToSelect.length; i++) {
            var p = keysToSelect[i].prop;
            p.selected = true;
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

        app.beginUndoGroup(isMirror ? "Mirror Keyframes to Thời điểm hiện tại" : "Clone Keyframes to Thời điểm hiện tại");

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
            p.selected = true;
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


  }(this));