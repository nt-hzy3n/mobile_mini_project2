# Ứng dụng Đặt Phòng Học VKU (VKU Study Room Booking App)

Ứng dụng di động chuyên biệt dành cho sinh viên trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU) để tìm kiếm, tra cứu và đặt lịch phòng học nhóm, phòng thực hành máy tính và phòng hội thảo theo thời gian thực.

---

## 1. Giới thiệu

Trong môi trường đại học năng động như VKU, nhu cầu làm việc nhóm, thực hành các dự án đồ án môn học, nghiên cứu khoa học và ôn thi tại các không gian chuyên dụng là rất lớn. **Ứng dụng Đặt Phòng Học VKU** được xây dựng nhằm số hóa quy trình đăng ký, giải quyết tình trạng trùng lịch, tự động hóa cấp vé QR check-in và nâng cao hiệu quả quản trị phòng học thông minh trong khuôn viên trường.

---

## 2. Mục tiêu

- **Tối ưu hóa việc sử dụng tài nguyên**: Phân bổ phòng học, phòng máy tính cấu hình cao tại các tòa A, B, C, V một cách minh bạch, công bằng.
- **Trải nghiệm sinh viên vượt trội**: Giao diện thuần Việt, tốc độ hiển thị 60fps mượt mà, hỗ trợ tìm kiếm và lọc đa tiêu chí tức thì.
- **Ngăn ngừa xung đột 100%**: Cơ chế kiểm tra lịch đặt trùng lặp (Conflict Prevention Engine) 2 lớp ở cả UI và business logic.
- **Tiện lợi và bảo mật**: Cấp thẻ vé QR Check-in tức thì và thông báo đẩy nhắc lịch tự động trước 15 phút.

---

## 3. Tính năng chính

- 🏢 **Khám phá phòng học & phòng máy**: Danh mục 16+ phòng trải dài 4 tòa A, B, C, V với thông số đầy đủ về sức chứa, tầng lầu, trang thiết bị.
- 🔍 **Tìm kiếm tức thì (Instant Search)**: Tìm kiếm theo tên phòng (A101...), mã phòng, tòa nhà, phân loại.
- 🎛️ **Bộ lọc kết hợp (Multi-filter)**: Lọc đồng thời theo Tòa nhà (A, B, C, V) + Sức chứa (2-5, 6-10, 11-15, 16-20 người) + Thiết bị phòng (Máy chiếu, Bảng trắng, Máy tính cấu hình cao, Điều hòa) kèm nút "Xóa bộ lọc".
- 📅 **Chọn lịch đặt 7 ngày tới**: Thanh cuộn chọn ngày trực quan hiển thị thứ và ngày tháng tiếng Việt.
- ⏰ **Chọn khung giờ cố định**: 4 ca chuẩn mỗi ngày (`07:30 – 09:30`, `09:30 – 11:30`, `13:00 – 15:00`, `15:00 – 17:00`), tự động khóa các khung giờ đã có người đặt.
- 🛡️ **Hệ thống chống xung đột (Conflict Engine)**: Chặn đặt trùng `(roomId, date, timeSlot)`.
- 🎫 **Vé QR Check-in điện tử**: Sinh mã đặt phòng dạng `VKU-[PHONG]-[NGAY]-[CODE]` và QR Code check-in an toàn (không chứa dữ liệu nhạy cảm).
- 📋 **Quản lý lịch đặt (Lịch đặt phòng)**: Phân loại theo 3 tab rõ ràng: *Sắp tới*, *Đã hoàn thành*, *Đã hủy*.
- ❌ **Hủy đặt phòng an toàn**: Có hộp thoại modal xác nhận `[Quay lại] / [Hủy đặt phòng]`, tự động giải phóng khung giờ cho sinh viên khác.
- 🔔 **Thông báo nhắc nhở (Local Notification)**: Tự động hẹn giờ thông báo trước giờ học 15 phút bằng `expo-notifications`, an toàn khi người dùng từ chối cấp quyền.
- 👤 **Hồ sơ sinh viên & Quản lý phiên**: Lưu trữ thông tin sinh viên, phiên làm việc qua `AsyncStorage`, hỗ trợ đăng xuất an toàn.

---

## 4. Công nghệ sử dụng

- **Môi trường & Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (SDK 57)
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Quản lý trạng thái**: [Zustand](https://github.com/pmndrs/zustand)
- **Lưu trữ cục bộ**: [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)
- **Điều hướng**: [@react-navigation/native](https://reactnavigation.org/) (Bottom Tabs + Native Stack)
- **Thông báo**: [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- **Mã QR**: [react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg) & [react-native-svg](https://github.com/software-mansion/react-native-svg)
- **Icons & UI System**: `@expo/vector-icons` (Ionicons), bảng màu nhận diện thương hiệu VKU (`#F37021` Cam & `#004B91` Xanh).

---

## 5. Kiến trúc Dự án (Architecture)

Dự án tuân thủ kiến trúc phân tầng sạch sẽ (Clean Separation of Concerns):

1. **Presentation Layer (`src/screens/`, `src/components/`)**: Chịu trách nhiệm hiển thị giao diện thuần Việt, tối ưu cuộn 60fps với `FlatList`, `React.memo`, `useCallback`, `useMemo`.
2. **State Management Layer (`src/stores/`)**: Các Zustand store độc lập (`useAuthStore`, `useRoomStore`, `useBookingStore`) quản lý trạng thái, giảm thiểu render dư thừa.
3. **Domain & Business Logic (`src/utils/`)**: Thuật toán kiểm tra xung đột lịch (`validateBookingConflict`), tính toán ngày tháng tiếng Việt 7 ngày (`date.ts`).
4. **Service & Persistence Layer (`src/services/`)**: Wrapper an toàn cho `AsyncStorage` (bảo vệ chống corrupt dữ liệu), `notificationService` và `availabilityService`.

---

## 6. Cấu trúc thư mục

```text
mini_Pr2/
├── src/
│   ├── types/                  # Định nghĩa kiểu dữ liệu TypeScript
│   │   ├── room.ts             # Kiểu Room, Building, Equipment, RoomStatus
│   │   ├── booking.ts          # Kiểu Booking, TimeSlot, QRPayload
│   │   └── user.ts             # Kiểu UserProfile sinh viên
│   ├── constants/
│   │   └── theme.ts            # Hệ thống màu thương hiệu VKU, spacing, shadows
│   ├── data/
│   │   ├── rooms.ts            # Danh mục 16 phòng học tòa A, B, C, V
│   │   └── timeSlots.ts        # 4 khung giờ đặt cố định trong ngày
│   ├── services/
│   │   ├── storage.ts          # AsyncStorage wrapper xử lý lỗi corrupt
│   │   ├── notificationService.ts # Lập lịch thông báo nhắc trước 15 phút
│   │   └── availabilityService.ts # Mock Real-time Availability Service
│   ├── utils/
│   │   ├── date.ts             # Tính toán 7 ngày kế tiếp, định dạng tiếng Việt
│   │   └── booking.ts          # Conflict Prevention Engine & sinh mã QR
│   ├── stores/
│   │   ├── useAuthStore.ts     # Phiên sinh viên VKU & đăng xuất
│   │   ├── useRoomStore.ts     # Tìm kiếm tức thì, bộ lọc kết hợp, trạng thái phòng
│   │   └── useBookingStore.ts  # Tạo booking, kiểm tra xung đột, hủy phòng
│   ├── components/
│   │   ├── RoomCard.tsx        # Thẻ phòng học tối ưu React.memo
│   │   ├── FilterChips.tsx     # Bộ lọc Tòa nhà, Sức chứa, Thiết bị
│   │   ├── DateSelector.tsx    # Cuộn chọn 7 ngày tới
│   │   ├── TimeSlotSelector.tsx # Chọn khung giờ & vô hiệu hóa slot đã đặt
│   │   ├── BookingCard.tsx     # Thẻ hiển thị lịch đặt phòng
│   │   ├── QRBookingPass.tsx   # Vé QR Check-in điện tử VKU
│   │   └── EmptyState.tsx      # Giao diện trống khi không có dữ liệu
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Trang chủ - Khám phá phòng
│   │   ├── RoomDetailScreen.tsx     # Chi tiết phòng & quy định
│   │   ├── BookingScreen.tsx        # Chọn ngày & khung giờ
│   │   ├── BookingConfirmScreen.tsx # Xác nhận đặt phòng
│   │   ├── BookingSuccessScreen.tsx # Đặt thành công & hiển thị QR
│   │   ├── MyBookingsScreen.tsx     # Lịch đặt phòng (Sắp tới / Đã xong / Đã hủy)
│   │   ├── BookingDetailScreen.tsx  # Chi tiết booking & Hủy phòng
│   │   └── ProfileScreen.tsx        # Thẻ sinh viên điện tử & Đăng xuất
│   └── navigation/
│       ├── AppNavigator.tsx    # Bottom Tabs + Native Stack
│       └── types.ts            # Type-safe navigation parameters
├── tests/
│   └── bookingConflict.test.ts # Bộ kiểm thử tự động Conflict Engine & Date Utils
├── App.tsx                     # Entry point bọc Navigation & SafeArea
├── package.json
├── tsconfig.json
└── README.md
```

---

## 7. Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu môi trường
- **Node.js**: Phiên bản 18+ (khuyến nghị Node 20 hoặc 24)
- **npm** hoặc **yarn**
- Ứng dụng **Expo Go** trên thiết bị Android hoặc iOS (hoặc máy ảo Android Studio / Xcode)

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Khởi động máy chủ phát triển Metro

```bash
npx expo start
```

---

## 8. Chạy ứng dụng trên các nền tảng

### Chạy bằng Expo Go (Khuyến nghị cho Demo)
1. Cài đặt ứng dụng **Expo Go** từ Google Play Store (Android) hoặc App Store (iOS).
2. Chạy lệnh:
   ```bash
   npx expo start
   ```
3. Quét mã QR hiển thị trên Terminal bằng:
   - Camera mặc định (trên iPhone)
   - Mục quét QR trong app Expo Go (trên Android).

### Chạy trên Android Emulator
```bash
npm run android
```

### Chạy trên iOS Simulator (yêu cầu macOS)
```bash
npm run ios
```

### Chạy trên Web Browser
```bash
npm run web
```

---

## 9. Chi tiết Kỹ thuật Các Thành Phần

### Zustand State Management
Dự án sử dụng Zustand vì tính gọn nhẹ, hiệu năng cao và không cần boilerplate rườm rà như Redux:
- `useRoomStore`: Quản lý danh sách phòng và trạng thái bộ lọc.
- `useBookingStore`: Quản lý danh sách booking, kiểm tra xung đột trước khi commit dữ liệu.
- `useAuthStore`: Quản lý hồ sơ sinh viên mặc định và phiên đăng nhập.

### AsyncStorage Persistence
Lưu trữ toàn bộ phiên đăng nhập sinh viên và lịch sử các lượt đặt phòng cục bộ:
- Tự động đồng bộ với store khi app khởi động (`loadSession`, `loadBookings`).
- Bọc toàn bộ các thao tác đọc/ghi trong khối `try-catch`, kiểm tra định dạng dữ liệu (JSON validation), tránh hoàn toàn tình trạng app bị văng (crash) nếu file lưu trữ bị lỗi hoặc corrupt.

### Booking Conflict Engine (Hệ thống chống xung đột)
Đây là tính năng cốt lõi đảm bảo không bao giờ xảy ra tình trạng 2 người đặt cùng một phòng trong cùng một khung giờ:
1. **Lớp 1 (UI Level)**: `TimeSlotSelector` tự động quét danh sách booking hiện tại. Khung giờ nào đã có trạng thái `upcoming` trùng với `roomId` và `date` sẽ bị vô hiệu hóa (disabled), hiển thị nhãn màu đỏ *"Đã được đặt"*.
2. **Lớp 2 (Store Level)**: Trong hàm `createBooking()`, thuật toán `validateBookingConflict()` được gọi một lần nữa để xác thực trước khi tạo bản ghi. Nếu phát hiện xung đột, thao tác sẽ bị hủy bỏ ngay lập tức và trả về thông báo lỗi:
   > *"Khung giờ này vừa được người khác đặt. Vui lòng chọn khung giờ khác."*
3. **Giải phóng slot khi hủy**: Khi sinh viên hủy booking (chuyển sang trạng thái `cancelled`), khung giờ đó sẽ lập tức được giải phóng để sinh viên khác có thể chọn lại.

### Local Notification (Thông báo nhắc lịch)
Sử dụng `expo-notifications` để lên lịch nhắc nhở cục bộ:
- Khi đặt phòng thành công, hệ thống tính toán thời điểm trước ca học 15 phút.
- Nếu ca học bắt đầu trong vòng dưới 15 phút hoặc đã qua, hệ thống sẽ bỏ qua việc đặt thông báo (không lên lịch vào quá khứ).
- Nếu người dùng từ chối quyền gửi thông báo, ứng dụng vẫn hoạt động bình thường, thông báo lỗi được bắt gọn gàng không gây crash.

### QR Code Check-in Pass
Sử dụng `react-native-qrcode-svg` để tạo mã QR dạng vector sắc nét trên mọi mật độ điểm ảnh:
- Dữ liệu QR chứa mã JSON:
  ```json
  {
    "bookingId": "VKU-PHÒNGA101-1709-ABCD",
    "roomId": "room-a101",
    "date": "2026-09-17",
    "timeSlot": "07:30 – 09:30"
  }
  ```
- Tuyệt đối không đưa thông tin nhạy cảm của sinh viên vào chuỗi mã QR.

### Real-time Availability (Trạng thái thời gian thực)
> **Lưu ý**: Trong phạm vi mini-project, tính năng cập nhật trạng thái phòng theo thời gian thực được mô phỏng cục bộ (`services/availabilityService.ts`). Architecture được thiết kế theo mô hình Observer/Event-Emitter để có thể dễ dàng thay thế bằng kết nối WebSocket hoặc API backend thật sự trong tương lai mà không phải sửa đổi giao diện người dùng.

---

## 10. Kiểm thử (Testing)

Dự án đã tích hợp bộ kiểm thử tự động toàn diện cho logic chống xung đột, xử lý ngày tháng và bộ lọc trong file `tests/bookingConflict.test.ts`.

Chạy kiểm thử:
```bash
npm test
```

Kiểm tra kiểu dữ liệu TypeScript:
```bash
npx tsc --noEmit
```

---

## 11. Demo & Media

- **Video Demo**: *(Placeholder - Sẽ cập nhật sau khi ghi hình demo)*
- **Expo Snack / File APK**: *(Placeholder - Sẽ cập nhật sau khi build)*

---

*Phát triển bởi Đội ngũ Kỹ sư Phần mềm - Đại học CNTT & Truyền thông Việt - Hàn (VKU).*
