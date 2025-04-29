// Mã bảo mật cố định
const AUTH_KEY = 'KJUZXZANN';

// Hàm khởi tạo sheet: Tự động lấy sheet đầu tiên, tạo và định dạng tiêu đề nếu chưa có
function initializeSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheets()[0]; // Lấy sheet đầu tiên
  
  // Kiểm tra và tạo tiêu đề nếu chưa tồn tại
  const firstRow = sheet.getRange('A1:D1').getValues()[0];
  if (firstRow[0] !== 'ID' || firstRow[1] !== 'Name' || firstRow[2] !== 'Website' || firstRow[3] !== 'TwoFA_Code') {
    sheet.getRange('A1:D1').setValues([['ID', 'Name', 'Website', 'TwoFA_Code']]);
    
    // Định dạng tiêu đề
    const headerRange = sheet.getRange('A1:D1');
    headerRange.setFontWeight('bold')
               .setFontSize(12)
               .setBackground('#4a90e2')
               .setFontColor('#ffffff')
               .setHorizontalAlignment('center')
               .setVerticalAlignment('middle')
               .setWrap(true);
    
    // Đặt chiều cao hàng tiêu đề và độ rộng cột
    sheet.setRowHeight(1, 40);
    sheet.setColumnWidth(1, 80); // Cột ID
    sheet.setColumnWidth(2, 150); // Cột Name
    sheet.setColumnWidth(3, 200); // Cột Website
    sheet.setColumnWidth(4, 200); // Cột TwoFA_Code
  }
  
  return sheet;
}

// Hàm thêm kẻ viền cho toàn bộ dữ liệu trong sheet
function applyGridLines(sheet) {
  const dataRange = sheet.getDataRange();
  dataRange.setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);
}

// Hàm cập nhật lại cột ID
function updateIDs(sheet) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Bắt đầu từ hàng thứ 2 (bỏ qua tiêu đề)
  for (let i = 1; i < values.length; i++) {
    sheet.getRange(i + 1, 1).setValue(i); // Gán ID mới (i) cho hàng i+1
  }
}

// Hàm xử lý yêu cầu POST: Thêm hoặc xóa dữ liệu dựa trên hành động từ client
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const providedAuth = params.auth || ''; // Lấy auth từ payload

  if (providedAuth !== AUTH_KEY) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      msg: 'Mã bảo mật không hợp lệ!'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = initializeSheet();
  const data = params;

  // Xử lý yêu cầu xóa
  if (data.action === 'delete') {
    if (data.id) {
      return deleteById(sheet, parseInt(data.id));
    } else if (data.twofa_code) {
      return deleteByTwoFACode(sheet, data.twofa_code.toUpperCase().trim());
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        msg: 'Thiếu thông tin để xóa!'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Xử lý yêu cầu thêm dữ liệu
  const name = data.name || '';
  const website = data.website || '';
  const twofa_code = (data.twofa_code || '').toUpperCase().trim();
  
  // Thêm dữ liệu vào sheet
  const lastRow = sheet.getLastRow();
  sheet.appendRow(['', name, website, twofa_code]); // Để trống cột ID, sẽ cập nhật sau
  
  // Định dạng hàng mới
  const newRowRange = sheet.getRange(lastRow + 1, 1, 1, 4);
  newRowRange.setFontSize(10)
             .setHorizontalAlignment('center')
             .setVerticalAlignment('middle');
  
  // Cập nhật lại ID
  updateIDs(sheet);
  
  // Áp dụng kẻ viền
  applyGridLines(sheet);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    msg: 'Dữ liệu đã được lưu thành công!'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Hàm xử lý yêu cầu GET: Lấy tất cả mã 2FA sau khi kiểm tra mã bảo mật
function doGet(e) {
  const params = e.parameter;
  const secretKey = params.key;

  if (secretKey !== AUTH_KEY) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      msg: 'Mã bảo mật không hợp lệ!'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = initializeSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  const twofaData = [];
  
  // Lấy dữ liệu từ các hàng (bỏ qua tiêu đề)
  for (let i = 1; i < values.length; i++) {
    twofaData.push({
      id: values[i][0],
      name: values[i][1],
      website: values[i][2],
      twofa_code: values[i][3]
    });
  }
  
  // Áp dụng kẻ viền
  applyGridLines(sheet);
  
  return ContentService.createTextOutput(JSON.stringify(twofaData))
    .setMimeType(ContentService.MimeType.JSON);
}

// Hàm xóa dữ liệu theo ID
function deleteById(sheet, id) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  let rowToDelete = -1;
  for (let i = 1; i < values.length; i++) {
    if (parseInt(values[i][0]) === id) {
      rowToDelete = i + 1;
      break;
    }
  }
  
  if (rowToDelete !== -1) {
    sheet.deleteRow(rowToDelete);
    updateIDs(sheet); // Cập nhật lại ID
    applyGridLines(sheet);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      msg: 'Mã 2FA đã được xóa!'
    })).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      msg: 'Không tìm thấy mã 2FA với ID này!'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm xóa dữ liệu theo mã TwoFA
function deleteByTwoFACode(sheet, twofa_code) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  let rowToDelete = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][3].toUpperCase().trim() === twofa_code) {
      rowToDelete = i + 1;
      break;
    }
  }
  
  if (rowToDelete !== -1) {
    sheet.deleteRow(rowToDelete);
    updateIDs(sheet); // Cập nhật lại ID
    applyGridLines(sheet);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      msg: 'Mã 2FA đã được xóa!'
    })).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      msg: 'Không tìm thấy mã 2FA với mã này!'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
