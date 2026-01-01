# Hướng Dẫn Tích Hợp Google Sheets

## Bước 1: Tạo Google Apps Script Web App

1. **Mở Google Sheets** của bạn (file "Lời Chúc Mừng Cưới")

2. **Vào Extensions > Apps Script**
   - Hoặc truy cập: https://script.google.com

3. **Xóa code mặc định** và **dán code từ file `Code.gs`**

4. **Cấu hình:**
   - Thay `YOUR_SPREADSHEET_ID` bằng ID của Google Sheet
     - ID nằm trong URL: `https://docs.google.com/spreadsheets/d/[ID_HERE]/edit`
   - Thay `'Sheet1'` bằng tên sheet thực tế của bạn (ví dụ: 'Sheet1', 'Lời Chúc', ...)

5. **Lưu project:**
   - Click vào biểu tượng 💾 hoặc Ctrl+S
   - Đặt tên project (ví dụ: "Wedding Form Handler")

6. **Deploy Web App:**
   - Click vào nút **"Deploy"** > **"New deployment"**
   - Click vào biểu tượng ⚙️ (Select type) > Chọn **"Web app"**
   - Cấu hình:
     - **Description**: Mô tả (tùy chọn)
     - **Execute as**: Me (tài khoản của bạn)
     - **Who has access**: **Anyone** (quan trọng!)
   - Click **"Deploy"**
   - **Copy URL** được tạo ra (có dạng: `https://script.google.com/macros/s/...`)

## Bước 2: Cấu hình trong file HTML

1. **Mở file `google-sheets-integration.js`**

2. **Thay `YOUR_GOOGLE_SCRIPT_URL`** bằng URL vừa copy ở Bước 1:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

3. **Lưu file**

## Bước 3: Kiểm tra

1. **Mở file `index.html` trong trình duyệt**

2. **Điền form xác nhận tham dự** và click **"GỬI NGAY"**

3. **Kiểm tra Google Sheets:**
   - Mở lại Google Sheet
   - Dữ liệu mới sẽ xuất hiện ở dòng cuối cùng

## Cấu trúc Dữ liệu

Dữ liệu được ghi vào Google Sheets với các cột:

| Cột | Tên | Mô tả |
|-----|-----|-------|
| A | Họ và Tên | Tên người điền form |
| B | Lời Chúc | Lời chúc từ form |
| C | Xác Nhận Tham Dự | "Có tham dự" hoặc "Không thể tham dự" |
| D | Khách Mời Của | Mối quan hệ (ví dụ: "Bạn", "Anh", ...) |
| E | Thời Gian | Thời gian submit (định dạng VN) |

## Xử lý Lỗi

Nếu không hoạt động, kiểm tra:

1. **Console trình duyệt (F12):**
   - Xem có lỗi JavaScript không
   - Kiểm tra log "Dữ liệu đã được gửi đến Google Sheets"

2. **Google Apps Script:**
   - Vào Apps Script > Executions để xem log
   - Kiểm tra có lỗi không

3. **Quyền truy cập:**
   - Đảm bảo Web App được set "Anyone" có thể truy cập
   - Lần đầu tiên có thể cần authorize permissions

## Lưu ý

- Dữ liệu được gửi ngay khi click "GỬI NGAY", không ảnh hưởng đến form submit hiện tại
- Thời gian được tự động ghi bằng định dạng Việt Nam
- Nếu có nhiều form, tất cả đều sẽ gửi dữ liệu đến cùng một Google Sheet

