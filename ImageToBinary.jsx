//build UI
var window = new Window("palette", "Binary to String", undefined);

var groupOne = window.add("group");
groupOne.add("statictext", undefined, "Path");
var fileButton = groupOne.add("button", undefined, "...");

var groupTwo = window.add("group");
var fileEditText = groupTwo.add("edittext", undefined, "");
fileEditText.size = [210,25];
fileEditText.enabled = false; // Vô hiệu hóa gõ tay vì ô này sẽ chỉ hiển thị số lượng file

var groupThree = window.add("group");
var createButton = groupThree.add("button", undefined, "Create");

//show panel
window.center();
window.show();

// Biến toàn cục để lưu trữ mảng các file được chọn
var selectedFiles = []; 

//UX functionality
fileButton.onClick = function(){
    imagePath();  
}

createButton.onClick = function(){
    convertToString();
}

//--------------functions------------//

function imagePath(){
    // Dùng File.openDialog với tham số thứ 3 là 'true' để cho phép chọn nhiều file
    var files = File.openDialog("Select png Images", "*.png", true);
    
    // Kiểm tra xem người dùng có chọn file không
    if(files != null && files.length > 0){
        selectedFiles = files;
        // Cập nhật text hiển thị số lượng file thay vì đường dẫn dài
        fileEditText.text = "Đã chọn " + selectedFiles.length + " file(s)";
    }
}

function convertToString(){
    // Kiểm tra xem đã có file nào được chọn chưa
    if(selectedFiles.length === 0){
        alert("Vui lòng chọn ảnh trước khi convert!");
        return;
    }

    // Lặp qua từng file trong mảng để xử lý
    for(var i = 0; i < selectedFiles.length; i++){
        var inFile = selectedFiles[i];
        var outFile = new File(inFile.fsName + "_binary.txt");
        
        // Đọc file ảnh
        inFile.open("r");
        inFile.encoding = "binary";
        var temp = inFile.read();
        inFile.close();
        
        // Lấy chuỗi gốc từ hàm toSource()
        var rawSource = temp.toSource();
        
        // Cắt bỏ "(new String(" ở đầu (12 ký tự) và "))" ở cuối (2 ký tự)
        // Kết quả sẽ chỉ còn lại chuỗi nằm gọn trong dấu ngoặc kép ""
        var cleanString = rawSource.substring(12, rawSource.length - 2);
        
        // Ghi ra file text
        outFile.open("w");
        outFile.write(cleanString);
        outFile.close(); 
    }
    
    alert("Đã convert thành công " + selectedFiles.length + " file!");
}