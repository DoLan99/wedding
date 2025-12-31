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
function doPost(e) {
  try {
    // Lấy dữ liệu từ request (URL-encoded format)
    const data = {};
    if (e.postData && e.postData.contents) {
      const params = e.postData.contents.split('&');
      params.forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          data[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
    
    // Lấy Sheet hiện tại
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Thêm dữ liệu vào Sheet
    sheet.appendRow([
      data.full_name || '',
      data.textarea_input_1 || '',
      data.select_1 || '',
      data.select_2 || '',
      data.timestamp || new Date()
    ]);
    
    // Trả về response thành công
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Trả về response lỗi
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Form submission endpoint is ready!');
}
```

3. Lưu project (Ctrl+S hoặc Cmd+S)
4. Đặt tên project (ví dụ: "Wedding Form Handler")

## Bước 3: Deploy Web App

1. Click vào **Deploy** → **New deployment**
2. Click vào biểu tượng bánh răng ⚙️ bên cạnh "Select type" → chọn **Web app**
3. Điền thông tin:
   - **Description**: "Wedding Form Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (hoặc "Anyone with Google account" nếu muốn bảo mật hơn)
4. Click **Deploy**
5. **QUAN TRỌNG**: Copy **Web App URL** (sẽ có dạng: `https://script.google.com/macros/s/...`)
6. Click **Authorize access** và cho phép quyền truy cập

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

