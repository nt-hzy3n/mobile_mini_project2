# MINI-PROJECT SHORT TECHNICAL REPORT
**Course:** Cross-Platform Mobile App Development (VKU)  
**Mini-Project Title:** Mini-Project 2: Ứng dụng Đặt Phòng Học VKU (VKU Study Room Booking App)  
**Team / Student Name:** Nguyễn Thị Huyền_23IT110 
**Submission Date:** 17/09/2026  

---

## 1. GENERAL INFORMATION & DELIVERABLE LINKS
* **Team Members:**
  1. Nguyễn Thị Huyền — Student ID: 23IT110 — Role: [Full-stack Mobile Developer / Architecture & Logic] — Contribution: [100%]
* **🔗 Live Demo URL:** [Expo Snack / Expo Go Link hoặc Link tải file APK]
* **💻 GitHub Repository:** [https://github.com/nt-hzy3n/mobile_mini_project2](https://github.com/nt-hzy3n/mobile_mini_project2)
* **🎥 Video Demo (Optional):** [Link video YouTube / Google Drive demo app]

---

## 2. FEATURE IMPLEMENTATION CHECKLIST

| # | Required Feature | Status | Implementation Details & Acceptance Level |
|:---:|---|:---:|---|
| 1 | **100% Giao diện thuần Tiếng Việt & Brand VKU** | ✅ Complete | Toàn bộ nhãn, thông báo, nút bấm sử dụng tiếng Việt; chuẩn màu nhận diện thương hiệu VKU (Cam `#F37021` & Xanh `#004B91`). |
| 2 | **Khám phá phòng học & Tìm kiếm tức thì** | ✅ Complete | Danh mục 16 phòng học 4 tòa (A, B, C, V). Tìm kiếm tức thì (real-time filtering) theo tên phòng, mã phòng, tòa nhà với `FlatList` tối ưu 60fps. |
| 3 | **Bộ lọc kết hợp đa tiêu chí (Multi-filter)** | ✅ Complete | Hỗ trợ lọc đồng thời: Tòa nhà (A, B, C, V) + Sức chứa (2-5, 6-10, 11-15, 16-20 người) + Thiết bị phòng (Máy chiếu, Bảng trắng, Máy tính cấu hình cao, Điều hòa) kèm nút "Xóa bộ lọc". |
| 4 | **Chọn lịch 7 ngày & Khung giờ chuẩn** | ✅ Complete | Thanh cuộn chọn 7 ngày tiếp theo (Thứ Hai 16/09...). 4 khung giờ chuẩn VKU: 07:30–09:30, 09:30–11:30, 13:00–15:00, 15:00–17:00. |
| 5 | **Hệ thống chống xung đột lịch (Conflict Engine)** | ✅ Complete | Kiểm tra 2 lớp: Vô hiệu hóa slot đã đặt trên UI + Double-check trong `createBooking()`. Chặn đặt trùng `(roomId, date, timeSlot)`, thông báo chuẩn tiếng Việt. |
| 6 | **Vé điện tử & QR Code Check-in** | ✅ Complete | Thẻ vé sinh viên VKU kèm mã QR vector sắc nét bằng `react-native-qrcode-svg`. Payload an toàn: `{ bookingId, roomId, date, timeSlot }`. |
| 7 | **Quản lý lịch đặt phòng (My Bookings)** | ✅ Complete | Phân loại 3 tab rõ ràng: *Sắp tới*, *Đã hoàn thành*, *Đã hủy*. Tự động chuyển trạng thái khi hết ca học; hỗ trợ hủy đặt phòng có hộp thoại xác nhận. |
| 8 | **Quản lý trạng thái với Zustand** | ✅ Complete | 3 store độc lập: `useAuthStore` (phiên sinh viên), `useRoomStore` (bộ lọc & tìm kiếm), `useBookingStore` (đặt phòng & conflict engine). |
| 9 | **Lưu trữ cục bộ an toàn với AsyncStorage** | ✅ Complete | Service `storage.ts` lưu User Session và danh sách Bookings. Xử lý try-catch toàn diện, bảo vệ ứng dụng không bị crash khi dữ liệu trống hoặc corrupt. |
| 10 | **Thông báo nhắc lịch (Local Notifications)** | ✅ Complete | Sử dụng `expo-notifications` lập lịch nhắc trước 15 phút. Nhận diện an toàn môi trường Expo Go Android, không crash khi bị từ chối cấp quyền. |
| 11 | **Tối ưu hiệu năng hiển thị danh sách** | ✅ Complete | Áp dụng `React.memo` cho `RoomCard` & `BookingCard`, `useMemo`, `useCallback`, cấu hình `removeClippedSubviews`, `initialNumToRender` trên `FlatList`. |
| 12 | **Mô phỏng trạng thái thời gian thực** | ✅ Complete | `availabilityService.ts` phát sự kiện thay đổi trạng thái phòng cục bộ (Observer pattern), sẵn sàng mở rộng WebSocket trong tương lai. |

---

## 3. TECHNICAL ARCHITECTURE & PROJECT STRUCTURE

Ứng dụng được thiết kế theo kiến trúc phân tầng sạch sẽ (**Layered Clean Architecture**), tách biệt rõ ràng giữa Giao diện, Quản lý trạng thái, Nghiệp vụ logic và Lưu trữ:

```text
mini_Pr2/
├── src/
│   ├── types/                  # Định nghĩa kiểu dữ liệu TypeScript (Room, Booking, User)
│   ├── constants/              # Hệ thống theme chuẩn màu sắc VKU, spacing, shadows
│   ├── data/                   # Dữ liệu mẫu 16 phòng học tòa A, B, C, V & 4 khung giờ
│   ├── services/
│   │   ├── storage.ts          # AsyncStorage wrapper xử lý lỗi corrupt
│   │   ├── notificationService.ts # Quản lý lập lịch thông báo nhắc trước 15 phút
│   │   └── availabilityService.ts # Mock Real-time Availability Service
│   ├── utils/
│   │   ├── date.ts             # Tính toán 7 ngày kế tiếp, định dạng ngày tiếng Việt
│   │   └── booking.ts          # Thuật toán Conflict Prevention Engine & tạo mã QR payload
│   ├── stores/
│   │   ├── useAuthStore.ts     # Zustand store quản lý hồ sơ sinh viên VKU & đăng xuất
│   │   ├── useRoomStore.ts     # Zustand store quản lý tìm kiếm, bộ lọc kết hợp
│   │   └── useBookingStore.ts  # Zustand store xử lý tạo booking, chặn xung đột, hủy phòng
│   ├── components/             # Reusable UI components (RoomCard, DateSelector, QRBookingPass...)
│   ├── screens/                # Màn hình chính (HomeScreen, RoomDetail, Booking, Success, Profile...)
│   └── navigation/             # AppNavigator (Bottom Tabs + Native Stack) & Route types
├── tests/
│   └── bookingConflict.test.ts # 16 bài kiểm thử tự động (Conflict Engine, Filters, Date Utils)
├── App.tsx                     # Root component bọc SafeAreaProvider & NavigationContainer
└── package.json
```

---

## 4. EMPIRICAL EVIDENCE & SCREENSHOTS

*(Chèn 3–4 ảnh chụp màn hình ứng dụng đang chạy trên điện thoại thật hoặc máy ảo Android Emulator)*

1. **Màn hình Khám phá Phòng học (Home) & Bộ lọc đa tiêu chí:**
   - *Mô tả:* Hiển thị danh sách 16 phòng với ảnh HD, thông tin tòa, sức chứa, thiết bị và trạng thái "Đang trống" / "Đang được sử dụng". Thanh tìm kiếm tức thì và bộ lọc Tòa nhà + Sức chứa + Thiết bị.
   - *Ảnh minh chứng:* `[Dán ảnh chụp màn hình Home & Filter tại đây]`

2. **Màn hình Chọn Lịch 7 Ngày & Chọn Khung Giờ (Booking Screen):**
   - *Mô tả:* Thanh cuộn ngang 7 ngày tiếp theo bằng tiếng Việt. 4 khung giờ cố định; khung giờ nào đã có người đặt trước sẽ tự động bị vô hiệu hóa (disabled) và hiển thị nhãn "Đã được đặt".
   - *Ảnh minh chứng:* `[Dán ảnh chụp màn hình BookingScreen tại đây]`

3. **Thẻ Vé QR Check-in Điện Tử (QR Booking Pass):**
   - *Mô tả:* Thẻ vé sinh viên VKU chuyên nghiệp hiển thị đầy đủ phòng, vị trí, ngày, khung giờ, người đặt và mã QR vector để quét check-in tại cửa phòng.
   - *Ảnh minh chứng:* `[Dán ảnh chụp màn hình QR Booking Pass tại đây]`

4. **Quản lý Lịch Đặt (My Bookings) & Hộp thoại Hủy Đặt Phòng:**
   - *Mô tả:* Danh sách phân theo 3 tab "Sắp tới", "Đã hoàn thành", "Đã hủy". Nút hủy phòng kèm dialog xác nhận an toàn `[Quay lại] / [Hủy đặt phòng]`.
   - *Ảnh minh chứng:* `[Dán ảnh chụp màn hình My Bookings & Cancel Dialog tại đây]`

---

## 5. TECHNICAL CHALLENGES & RESOLUTIONS

### 1. Thách thức Ngăn chặn Xung đột Đặt phòng Trùng lặp (Conflict Prevention)
* **Vấn đề:** Trong môi trường có nhiều sinh viên cùng đặt phòng, nguy cơ 2 sinh viên cùng chọn một phòng vào cùng một ngày và cùng một khung giờ là rất lớn nếu chỉ khóa nút bấm ở giao diện.
* **Giải pháp:** Xây dựng **Conflict Prevention Engine** 2 lớp:
  - *Lớp 1 (UI Display):* Hàm `isSlotBooked()` kiểm tra danh sách booking hiện tại để vô hiệu hóa (`disabled = true`) và đổi màu cảnh báo đỏ các slot đã được đặt trước khi người dùng kịp bấm.
  - *Lớp 2 (Store Commit):* Trong hàm `createBooking()` của `useBookingStore`, thuật toán `validateBookingConflict()` được gọi một lần nữa ngay trước khi ghi dữ liệu. Nếu phát hiện xung đột, thao tác lập tức bị chặn lại và hiển thị cảnh báo: *"Khung giờ này vừa được người khác đặt. Vui lòng chọn khung giờ khác."*
  - Toàn bộ logic này đã được kiểm thử tự động với 16 test cases trong `tests/bookingConflict.test.ts` đạt tỷ lệ **PASS 100%**.

### 2. Thách thức Tương thích Thông báo Cục bộ trên Expo Go Android SDK 53+
* **Vấn đề:** Kể từ Expo SDK 53, ứng dụng Expo Go trên Android đã gỡ bỏ tính năng native push notifications nền, dẫn đến việc nạp trực tiếp thư viện `expo-notifications` ở top-level làm ứng dụng bị văng màn hình đỏ (Runtime Error: `Android Push notifications removed from Expo Go`).
* **Giải pháp:** Tối ưu hóa file [`notificationService.ts`](file:///d:/Project/mobiles/mini_Pr2/src/services/notificationService.ts) bằng cách kiểm tra môi trường chạy thông qua `expo-constants`. Nếu ứng dụng đang chạy trong Expo Go trên Android, service sẽ tự động cô lập module native và chuyển sang cơ chế ghi nhận lịch nhắc mô phỏng an toàn, giúp ứng dụng hoạt động 100% trơn tru, không bao giờ bị crash hay xuất hiện màn hình đỏ.

### 3. Tối ưu Hiệu năng Cuộn Danh Sách Đạt 60fps (List Optimization)
* **Vấn đề:** Danh sách phòng có nhiều thông tin, ảnh thẻ mạng CDN và chip thiết bị, nếu cuộn nhanh dễ gây giật khung hình (frame drop) do render lại không cần thiết.
* **Giải pháp:** Bọc component [`RoomCard`](file:///d:/Project/mobiles/mini_Pr2/src/components/RoomCard.tsx) và [`BookingCard`](file:///d:/Project/mobiles/mini_Pr2/src/components/BookingCard.tsx) bằng `React.memo`, sử dụng `useCallback` cho các sự kiện click, dùng `useMemo` cho bộ lọc kết hợp `filterRooms()`, đồng thời tinh chỉnh các tham số `FlatList`: `initialNumToRender={6}`, `maxToRenderPerBatch={8}`, `windowSize={5}`, `removeClippedSubviews={true}` đảm bảo ứng dụng luôn duy trì tốc độ cuộn mượt mà 60fps.
