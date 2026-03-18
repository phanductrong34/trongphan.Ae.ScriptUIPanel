//build UI
var window = new Window("palette", "Binary to String", undefined);

var groupOne = window.add("group");
groupOne.add("statictext", undefined, "Path");
var fileButton = groupOne.add("button", undefined, "...");

var groupTwo = window.add("group");
var fileEditText = groupTwo.add("edittext", undefined, "");
fileEditText.size = [210,25];

var groupThree = window.add("group");
var createButton = groupThree.add("button", undefined, "Create");


//show panel
window.show();

//UX functionality
     
fileButton.onClick = function(){
      imagePath();  
    }

createButton.onClick = function(){
      convertToString();
    }


//--------------functions------------//
var imageFile = new File;

function imagePath(){
        imageFile = imageFile.openDlg("Select png Image", "*.png", false);
        if(imageFile != null){
                fileEditText.text = imageFile.fsName;
            }
    }

function convertToString(){
    
       var inFile = File(fileEditText.text);
       var outFile = new File(fileEditText.text + "binary.txt");
       
        inFile.open("r");
        inFile.encoding = "binary";
        var temp = inFile.read();
        inFile.close();
        
        outFile.open("w");
        outFile.write(temp.toSource());
        
    }