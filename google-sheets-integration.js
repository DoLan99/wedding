// Google Sheets Integration Script
// Cấu hình: Thay YOUR_GOOGLE_SCRIPT_URL bằng URL Web App của Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyeRM6aZ8SOioyjzKzkV3PvG4IP2ZgDUIV_28VET5WXuV3-Cvu8iKSL_B_9l8nwsWjLaA/exec';

// Hàm gửi dữ liệu đến Google Sheets (sử dụng GET request với query parameters)
function submitToGoogleSheets(formData) {
    return new Promise(function(resolve, reject) {
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbyeRM6aZ8SOioyjzKzkV3PvG4IP2ZgDUIV_28VET5WXuV3-Cvu8iKSL_B_9l8nwsWjLaA/exec') {
            console.warn('Chưa cấu hình GOOGLE_SCRIPT_URL');
            reject('Chưa cấu hình URL');
            return;
        }
        
        // Tạo query string từ formData
        const params = new URLSearchParams();
        params.append('full_name', formData.full_name || '');
        params.append('textarea_input_1', formData.textarea_input_1 || '');
        params.append('select_1', formData.select_1 || '');
        params.append('select_2', formData.select_2 || '');
        params.append('timestamp', formData.timestamp || new Date().toLocaleString('vi-VN'));
        
        // Tạo URL với query parameters
        const url = GOOGLE_SCRIPT_URL + '?' + params.toString();
        
        // Sử dụng img tag để gửi GET request (cách đơn giản nhất, không cần xử lý CORS)
        const img = new Image();
        img.onload = function() {
            console.log('Dữ liệu đã được gửi đến Google Sheets');
            resolve(true);
        };
        img.onerror = function() {
            // Ngay cả khi có lỗi, dữ liệu vẫn có thể đã được gửi
            console.log('Request đã được gửi');
            resolve(true);
        };
        img.src = url;
    });
}

// Hàm lấy dữ liệu từ form
function getFormData(form) {
    const formData = new FormData(form);
    const data = {
        full_name: formData.get('full_name') || '',
        textarea_input_1: formData.get('textarea_input_1') || '',
        select_1: formData.get('select_1') || '',
        select_2: formData.get('select_2') || '',
        timestamp: new Date().toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    };
    return data;
}

// Xử lý submit cho tất cả các form
document.addEventListener('DOMContentLoaded', function() {
    // Đợi một chút để đảm bảo các event listener khác đã được đăng ký
    setTimeout(function() {
        // Tìm tất cả các form xác nhận tham dự
        const forms = document.querySelectorAll('form.ladi-form');
        
        forms.forEach(form => {
            // Xử lý khi form submit
            form.addEventListener('submit', function(e) {
                const formData = getFormData(form);
                
                // Gửi dữ liệu đến Google Sheets (không block form submit)
                submitToGoogleSheets(formData).catch(err => {
                    console.error('Lỗi gửi đến Google Sheets:', err);
                });
            }, true); // Sử dụng capture phase để chạy trước các handler khác
        });
        
        // Xử lý click button GỬI NGAY (FORM13, FORM14, FORM15)
        const buttonIds = ['BUTTON17', 'BUTTON19', 'BUTTON_TEXT17', 'BUTTON_TEXT19'];
        buttonIds.forEach(buttonId => {
            const buttons = document.querySelectorAll('#' + buttonId);
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    // Tìm form gần nhất
                    let form = button.closest('form');
                    if (!form) {
                        const formElement = button.closest('.ladi-element[id^="FORM"]');
                        if (formElement) {
                            form = formElement.querySelector('form');
                        }
                    }
                    
                    if (form) {
                        // Đợi một chút để form được điền đầy đủ
                        setTimeout(function() {
                            const formData = getFormData(form);
                            
                            // Gửi dữ liệu đến Google Sheets
                            submitToGoogleSheets(formData).catch(err => {
                                console.error('Lỗi gửi đến Google Sheets:', err);
                            });
                        }, 100);
                    }
                }, true);
            });
        });
    }, 1000);
});

