
`Update2FA.gs` là một tệp AppScript được thiết kế để giúp bạn quản lý các mã xác thực hai yếu tố (Two-Factor Authentication - 2FA) trong Google Sheets. Tệp này hỗ trợ các chức năng như thêm, xóa và đọc dữ liệu 2FA, đồng thời tự động định dạng bảng dữ liệu của bạn.

---

## Mục lục

1. [Chuẩn bị Google Sheet](#1-chuẩn-bị-google-sheet)
2. [Cách sử dụng](#2-cách-sử-dụng)
   - [Khởi tạo Sheet](#khởi-tạo-sheet)
   - [Các chức năng chính](#các-chức-năng-chính)
3. [Lưu ý](#3-lưu-ý)
4. [Hỗ trợ](#4-hỗ-trợ)
5. [Tác giả](#5-tác-giả)

---

## 1. Chuẩn bị Google Sheet

1. Truy cập vào Google Drive và tạo một Google Sheet mới.
2. Mở Google Sheet vừa tạo, sau đó vào menu **Tiện ích** > **Trình chỉnh sửa tập lệnh**.
3. Trong giao diện AppScript:
   - Đặt tên dự án (ví dụ: "TwoFA Manager").
   - Xóa nội dung mặc định và dán toàn bộ mã từ tệp `Update2FA.gs` vào trình chỉnh sửa.
4. Nhấn **Lưu** để lưu mã.

---

## 2. Cách sử dụng

### Khởi tạo Sheet

1. Khi chạy lần đầu, AppScript sẽ tự động khởi tạo bảng với:
   - Các tiêu đề: `ID`, `Name`, `Website`, `TwoFA_Code`.
   - Định dạng bảng (kẻ viền, căn giữa, màu tiêu đề).

2. Nếu bảng đã có tiêu đề, AppScript sẽ sử dụng bảng hiện tại mà không ghi đè dữ liệu.

3. Mở tệp `background.js` và chỉnh sửa giá trị `AUTH_KEY` và `API_URL` với thông tin API Google Sheets:
   ```javascript
   const AUTH_KEY = 'KJUZXZANN'; // Mã bảo mật
   const API_URL = 'https://script.google.com/macros/s/AKfycbyMe8j63uZOn7obPe-MMbY0k7Irr26qKkSAi4_OhDis-Hq0q1sg6rL5jzbCsr6MzscjRw/exec'; // Link API
   ```

### Các chức năng chính

#### 1. Thêm hoặc xóa dữ liệu thông qua yêu cầu `POST`

- **Thêm dữ liệu**: Gửi yêu cầu `POST` với payload chứa các trường sau:
  ```json
  {
    "auth": "KJUZXZANN", // Mã bảo mật
    "action": "add",     // Hành động
    "name": "Tên người dùng",
    "website": "Website",
    "twofa_code": "Mã 2FA"
  }
  ```
  - **Kết quả**: Dữ liệu sẽ được thêm vào bảng và cột `ID` tự động cập nhật.

- **Xóa dữ liệu**: Gửi yêu cầu `POST` để xóa dữ liệu dựa trên `ID` hoặc `TwoFA_Code`:
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

#### 2. Lấy danh sách 2FA thông qua yêu cầu `GET`

- **Yêu cầu**: Gửi yêu cầu `GET` với mã bảo mật (`key`):
  ```
  https://script.google.com/macros/s/{SCRIPT_ID}/exec?key=KJUZXZANN
  ```

- **Kết quả**: Trả về danh sách tất cả các mã 2FA dưới dạng JSON:
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

---

## 3. Lưu ý

- **Mã bảo mật**: `AUTH_KEY` mặc định là `KJUZXZANN`. Bạn nên thay đổi giá trị này trong tệp `Update2FA.gs` để tăng tính bảo mật.
- **Định dạng bảng**: Mỗi khi thêm hoặc xóa dữ liệu, bảng sẽ tự động được kẻ viền và định dạng lại.
- **Cột ID**: Cột `ID` được tự động cập nhật sau mỗi thao tác thêm hoặc xóa dữ liệu.

---

## 4. Hỗ trợ

Nếu bạn gặp bất kỳ vấn đề nào trong quá trình sử dụng, vui lòng liên hệ qua GitHub repository: [Extension-2FA-Manager](https://github.com/lowji194/Extension-2FA-Manager).

---

## 5. Tác giả

Được phát triển bởi [lowji194](https://github.com/lowji194).
```

### Các thay đổi đã thực hiện:
1. **Tổ chức lại nội dung**: Thêm mục lục để dễ điều hướng.
2. **Định dạng chuyên nghiệp**: Sử dụng các đoạn mã rõ ràng, dễ đọc.
3. **Ngôn ngữ chính xác**: Chỉnh sửa các lỗi cú pháp và cải thiện cách diễn đạt.
4. **Tạo sự nhất quán**: Đảm bảo các phần nội dung được trình bày đồng nhất.
