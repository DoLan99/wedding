function doGet(e) {
  try {
    // Log tất cả parameters nhận được để debug
    Logger.log('Received parameters: ' + JSON.stringify(e.parameter));
    
    // Lấy dữ liệu từ query parameters (GET request)
    // Hỗ trợ cả tên field mới và cũ
    const data = {
      full_name: e.parameter.full_name || '',
      // Hỗ trợ cả textarea_input_1 và loichuc
      textarea_input_1: e.parameter.textarea_input_1 || e.parameter.loichuc || '',
      // Hỗ trợ cả select_1 và select
      select_1: e.parameter.select_1 || e.parameter.select || '',
      // Hỗ trợ cả select_2 và moiquanhe
      select_2: e.parameter.select_2 || e.parameter.moiquanhe || '',
      timestamp: e.parameter.timestamp || new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
    
    Logger.log('Processed data: ' + JSON.stringify(data));
    
    // Lấy Sheet hiện tại
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getActiveSheet();
    
    // Kiểm tra xem có dòng tiêu đề chưa
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      // Thêm header nếu sheet trống
      sheet.appendRow(['Tên', 'Lời chúc', 'Xác nhận tham dự', 'Khách mời của ai', 'Thời gian']);
    }
    
    // Thêm dữ liệu vào Sheet
    sheet.appendRow([
      data.full_name,
      data.textarea_input_1,
      data.select_1,
      data.select_2,
      data.timestamp
    ]);
    
    Logger.log('Data saved successfully to row: ' + (sheet.getLastRow()));
    
    // Trả về HTML response để iframe có thể load
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Success</title>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <h2 style="color: #4CAF50;">✓ Đã gửi thành công!</h2>
          <p>Cảm ơn bạn đã gửi lời chúc mừng!</p>
        </body>
      </html>
    `);
    
  } catch (error) {
    // Log lỗi chi tiết
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    // Trả về HTML response với lỗi
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <h2 style="color: #f44336;">✗ Có lỗi xảy ra</h2>
          <p>Error: ${error.toString()}</p>
          <p>Vui lòng kiểm tra Google Apps Script Logs</p>
        </body>
      </html>
    `);
  }
}

function doPost(e) {
  // Xử lý POST request nếu cần
  return doGet(e);
}

