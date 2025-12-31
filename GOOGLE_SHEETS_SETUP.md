# Hướng dẫn thiết lập Google Sheets để nhận dữ liệu form

## Bước 1: Tạo Google Sheet mới

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo một Sheet mới
3. Đặt tên Sheet (ví dụ: "Lời Chúc Mừng Cưới")
4. Tạo các cột header ở dòng đầu tiên:
   - A1: `Họ và Tên`
   - B1: `Lời Chúc`
   - C1: `Xác Nhận Tham Dự`
   - D1: `Khách Mời Của`
   - E1: `Thời Gian`

## Bước 2: Tạo Google Apps Script

1. Trong Google Sheet, click vào **Extensions** → **Apps Script**
2. Xóa code mặc định và dán code sau:

```javascript
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
```

3. Lưu project (Ctrl+S hoặc Cmd+S)
4. Đặt tên project (ví dụ: "Wedding Form Handler")

## Bước 3: Deploy Web App

1. Click vào **Deploy** → **New deployment** (hoặc **Manage deployments** nếu đã có deployment cũ)
2. Click vào biểu tượng bánh răng ⚙️ bên cạnh "Select type" → chọn **Web app**
3. Điền thông tin:
   - **Description**: "Wedding Form Handler"
   - **Execute as**: "Me" (Tôi - tài khoản của bạn)
   - **Who has access**: Chọn **"Anyone"** (Bất cứ ai) - QUAN TRỌNG: Phải chọn "Anyone" để tránh lỗi 401
4. Click **Deploy** (Triển khai)
5. **LẦN ĐẦU TIÊN**: Sau khi click Deploy, sẽ có popup yêu cầu **"Authorize access"** (Ủy quyền truy cập):
   - Click vào **"Authorize access"**
   - Chọn tài khoản Google của bạn
   - Click **"Advanced"** → **"Go to [Project Name] (unsafe)"** (nếu có cảnh báo)
   - Click **"Allow"** để cho phép quyền truy cập
6. **QUAN TRỌNG**: Sau khi authorize xong, copy **Web App URL** (sẽ có dạng: `https://script.google.com/macros/s/...`)
   - URL này sẽ hiển thị trong dialog sau khi deploy thành công

**QUAN TRỌNG - Fix lỗi 403 Forbidden:**

Nếu bạn gặp lỗi 403, làm theo các bước sau:

1. **Kiểm tra quyền truy cập:**
   - Trong dialog "Quản lý các tùy chọn triển khai"
   - Đảm bảo "Người có quyền truy cập" (Who has access) = **"Bất cứ ai"** (Anyone)
   - KHÔNG chọn "Bất cứ ai có Tài khoản Google"

2. **Authorize lại:**
   - Click vào icon bút chì (edit) bên cạnh deployment
   - Click **"New version"**
   - Đảm bảo "Who has access" = **"Anyone"**
   - Click **"Deploy"**
   - Lần này sẽ có popup yêu cầu authorize → Click **"Authorize access"**
   - Chọn tài khoản → Click **"Advanced"** → **"Go to [Project Name] (unsafe)"**
   - Click **"Allow"**

3. **Kiểm tra URL:**
   - Đảm bảo URL có đuôi `/exec` (không phải `/dev`)
   - URL đúng: `https://script.google.com/macros/s/.../exec`
   - URL sai: `https://script.google.com/macros/s/.../dev`

4. **Nếu vẫn lỗi 403:**
   - Xóa deployment cũ
   - Tạo deployment mới hoàn toàn
   - Đảm bảo chọn "Anyone" ngay từ đầu

## Bước 4: Cập nhật URL trong HTML

1. Mở file `index.html`
2. Tìm dòng: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';`
3. Thay thế `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` bằng Web App URL bạn vừa copy
4. Lưu file

## Bước 5: Test

1. Mở trang web
2. Điền form
3. Click vào "GỬI LỜI CHÚC MỪNG" hoặc nút "Gửi Lời Chúc"
4. Kiểm tra Google Sheet để xem dữ liệu đã được ghi chưa

## Lưu ý:

- Nếu thay đổi code trong Apps Script, bạn cần **Deploy lại** với version mới
- URL Web App sẽ không thay đổi sau mỗi lần deploy mới
- Dữ liệu sẽ được thêm vào Sheet theo thứ tự: Họ và Tên, Lời Chúc, Xác Nhận Tham Dự, Khách Mời Của, Thời Gian

