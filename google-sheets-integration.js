// Google Sheets Integration Script
// Cấu hình: Thay YOUR_GOOGLE_SCRIPT_URL bằng URL Web App của Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwbTrysUM8mLdKfI-ZBCx18jQp0r72-6HsObkZ9HMHe7Xca8LPUpfSPCFrmQsl74X7cA/exec';

// Hàm gửi dữ liệu đến Google Sheets (sử dụng GET request với query parameters)
function submitToGoogleSheets(formData) {
    return new Promise(function(resolve, reject) {
        // Kiểm tra URL hợp lệ
        const isUrlEmpty = !GOOGLE_SCRIPT_URL;
        const isPlaceholder = GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL';
        const hasValidDomain = GOOGLE_SCRIPT_URL && typeof GOOGLE_SCRIPT_URL === 'string' && GOOGLE_SCRIPT_URL.indexOf('script.google.com') !== -1;
        
        // Chỉ reject nếu URL trống, là placeholder, hoặc không có domain hợp lệ
        if (isUrlEmpty || isPlaceholder || !hasValidDomain) {
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
        
        // Sử dụng img tag để gửi GET request (phương pháp đơn giản nhất, không bị chặn bởi CORS)
        const img = new Image();
        let resolved = false;
        
        img.onload = function() {
            if (!resolved) {
                resolved = true;
                resolve(true);
            }
        };
        
        img.onerror = function() {
            // Ngay cả khi có lỗi, request vẫn có thể đã được gửi (img tag sẽ gửi request ngay)
            if (!resolved) {
                resolved = true;
                resolve(true);
            }
        };
        
        // Bắt đầu gửi request
        img.src = url;
        
        // Timeout sau 3 giây nếu không có phản hồi
        setTimeout(function() {
            if (!resolved) {
                resolved = true;
                resolve(true);
            }
        }, 3000);
    });
}

// Hàm lấy dữ liệu từ form
function getFormData(form) {
    const formData = new FormData(form);
    const data = {
        full_name: formData.get('full_name') || '',
        // Hỗ trợ cả textarea_input_1 và loichuc
        textarea_input_1: formData.get('textarea_input_1') || formData.get('loichuc') || '',
        select_1: formData.get('select_1') || formData.get('select') || '',
        // Hỗ trợ cả select_2 và moiquanhe
        select_2: formData.get('select_2') || formData.get('moiquanhe') || '',
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
(function() {
    // Hàm xử lý gửi form data
    function handleFormSubmit(form) {
        const formData = getFormData(form);
        
        // Kiểm tra xem có dữ liệu không
        if (!formData.full_name && !formData.textarea_input_1 && !formData.select_1 && !formData.select_2) {
            return;
        }
        
        // Gửi dữ liệu đến Google Sheets
        submitToGoogleSheets(formData).catch(function(err) {
            // Silent fail - không hiển thị lỗi
        });
    }
    
    // Hàm tìm form từ button
    function findFormFromButton(button) {
        let form = button.closest('form');
        if (!form) {
            const formElement = button.closest('.ladi-element[id^="FORM"]');
            if (formElement) {
                form = formElement.querySelector('form');
            }
        }
        return form;
    }
    
    // Hàm xử lý button click
    function handleButtonClick(button, buttonId) {
        const form = findFormFromButton(button);
        if (!form) {
            return;
        }
        
        // Đợi một chút để đảm bảo form đã được điền
        setTimeout(function() {
            handleFormSubmit(form);
        }, 300);
    }
    
    // Khởi tạo khi DOM ready
    function init() {
        // Tìm tất cả các form xác nhận tham dự
        const forms = document.querySelectorAll('form.ladi-form');
        
        // Xử lý khi form submit
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                handleFormSubmit(form);
            }, true);
        });
        
        // Xử lý click button GỬI NGAY
        const buttonIds = ['BUTTON17', 'BUTTON19', 'BUTTON_TEXT17', 'BUTTON_TEXT19'];
        buttonIds.forEach(buttonId => {
            const buttons = document.querySelectorAll('#' + buttonId);
            
            buttons.forEach(button => {
                // Chỉ listen click event, không preventDefault để form có thể submit bình thường
                button.addEventListener('click', function(e) {
                    // Không preventDefault - để form submit tự nhiên và hiển thị popup
                    handleButtonClick(button, buttonId);
                }, false); // Bubble phase để LadiWeb có thể xử lý trước
            });
        });
        
        // Thêm observer để theo dõi khi button được thêm vào DOM
        const observer = new MutationObserver(function(mutations) {
            buttonIds.forEach(buttonId => {
                const buttons = document.querySelectorAll('#' + buttonId);
                buttons.forEach(button => {
                    if (!button.dataset.sheetsListenerAdded) {
                        button.dataset.sheetsListenerAdded = 'true';
                        button.addEventListener('click', function(e) {
                            // Không preventDefault - để form submit tự nhiên
                            handleButtonClick(button, buttonId);
                        }, false);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Chờ DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM đã sẵn sàng, đợi một chút để các script khác chạy xong
        setTimeout(init, 1000);
    }
})();
