function doGet(e) {
  try {
    // Lấy dữ liệu từ query parameters (GET request)
    const data = {
      full_name: e.parameter.full_name || '',
      textarea_input_1: e.parameter.textarea_input_1 || '',
      select_1: e.parameter.select_1 || '',
      select_2: e.parameter.select_2 || '',
      timestamp: e.parameter.timestamp || new Date().toLocaleString('vi-VN')
    };
    
    // Lấy Sheet hiện tại
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Thêm dữ liệu vào Sheet
    sheet.appendRow([
      data.full_name,
      data.textarea_input_1,
      data.select_1,
      data.select_2,
      data.timestamp
    ]);
    
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
        </body>
      </html>
    `);
  }
}

function doPost(e) {
  // Xử lý POST request nếu cần
  return doGet(e);
}

