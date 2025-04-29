Dưới đây là nội dung cho tệp README.md hướng dẫn sử dụng file `Update2FA.gs` bằng tiếng Việt:

```markdown
# Hướng dẫn sử dụng `Update2FA.gs`

`Update2FA.gs` là một file AppScript được thiết kế để giúp bạn quản lý các mã xác thực hai yếu tố (Two-Factor Authentication - 2FA) trên Google Sheets. File này hỗ trợ các chức năng như thêm, xóa và đọc dữ liệu 2FA, đồng thời tự động định dạng bảng dữ liệu của bạn.

## 1. Chuẩn bị Google Sheet

1. Truy cập vào Google Drive và tạo một Google Sheet mới.
2. Mở Google Sheet vừa tạo, sau đó vào menu **Tiện ích** > **Trình chỉnh sửa tập lệnh**.
3. Trong giao diện AppScript:
   - Đặt tên dự án (ví dụ: "TwoFA Manager").
   - Xóa nội dung mặc định và dán toàn bộ mã từ file `Update2FA.gs` vào trình chỉnh sửa.
4. Nhấn **Lưu** để lưu mã.

## 2. Cách sử dụng

### Khởi Tạo Sheet

1. Sau khi chạy lần đầu, file AppScript sẽ tự động khởi tạo sheet và:
   - Thêm các tiêu đề: `ID`, `Name`, `Website`, `TwoFA_Code`.
   - Thiết lập định dạng bảng (kẻ viền, căn giữa, màu tiêu đề).

2. Nếu bảng đã có tiêu đề, AppScript sẽ sử dụng bảng hiện tại mà không ghi đè.

  Mở file `background.js` chỉnh sửa `AUTH_KEY` và `API_URL` bằng link api google sheets và mã bảo mật ví dụ:
  ```
  const AUTH_KEY = 'KJUZXZANN';
  ```
  ```
  const API_URL = 'https://script.google.com/macros/s/AKfycbyMe8j63uZOn7obPe-MMbY0k7Irr26qKkSAi4_OhDis-Hq0q1sg6rL5jzbCsr6MzscjRw/exec';
  ```

### Các Chức Năng Chính

#### 1. Gửi Yêu Cầu `POST` Để Thêm Hoặc Xóa Dữ Liệu

- **Thêm Dữ Liệu**:
  Gửi yêu cầu `POST` với payload chứa các trường sau:
  ```json
  {
    "auth": "KJUZXZANN", // Mã bảo mật
    "action": "add",     // Hành động
    "name": "Tên người dùng",
    "website": "Website",
    "twofa_code": "Mã 2FA"
  }
  ```
  - **Kết quả**: Dữ liệu sẽ được thêm vào bảng và tự động cập nhật cột ID.

- **Xóa Dữ Liệu**:
  Gửi yêu cầu `POST` để xóa dữ liệu dựa trên `ID` hoặc `TwoFA_Code`:
  - Xóa theo `ID`:
    ```json
    {
      "auth": "KJUZXZANN",
      "action": "delete",
      "id": 1
    }
    ```
  - Xóa theo `TwoFA_Code`:
    ```json
    {
      "auth": "KJUZXZANN",
      "action": "delete",
      "twofa_code": "Mã 2FA"
    }
    ```

#### 2. Gửi Yêu Cầu `GET` Để Lấy Danh Sách 2FA

- **Yêu cầu**:
  Gửi yêu cầu `GET` với mã bảo mật (`key`):
  ```
  https://script.google.com/macros/s/{SCRIPT_ID}/exec?key=KJUZXZANN
  ```

- **Kết quả**:
  Trả về danh sách tất cả các mã 2FA dưới dạng JSON:
  ```json
  [
    {
      "id": 1,
      "name": "Tên người dùng",
      "website": "Website",
      "twofa_code": "Mã 2FA"
    },
    ...
  ]
  ```

## 3. Lưu Ý

- **Mã bảo mật**: `AUTH_KEY` được đặt mặc định là `KJUZXZANN`. Bạn có thể thay đổi giá trị này trong file `Update2FA.gs` để tăng tính bảo mật.
- **Định dạng bảng**: Mỗi khi thêm hoặc xóa dữ liệu, bảng sẽ tự động được kẻ viền và định dạng lại.
- **Cột ID**: Cột này được tự động cập nhật sau mỗi thao tác thêm hoặc xóa dữ liệu.

## 4. Hỗ Trợ

Nếu bạn gặp bất kỳ vấn đề nào trong quá trình sử dụng, vui lòng liên hệ qua GitHub repository: [Extension-2FA-Manager](https://github.com/lowji194/Extension-2FA-Manager).

## 5. Tác Giả

Được phát triển bởi [lowji194](https://github.com/lowji194).
```

Hướng dẫn này giúp bạn cài đặt và sử dụng file `Update2FA.gs` một cách dễ dàng và đầy đủ tính năng. Nếu bạn cần thêm phần nào, hãy yêu cầu!
