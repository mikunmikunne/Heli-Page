# Hướng Dẫn Cấu Hướng Supabase & Google Auth Cho Heli Project

Tài liệu này hướng dẫn chi tiết cách kết nối cơ sở dữ liệu Supabase, cấu hình Google Auth (đăng nhập Gmail cho khách hàng) và tạo tài khoản Admin thật cho hệ thống.

---

## 🔌 1. Kết Nối Database Supabase Thật

### Bước 1.1: Tạo file biến môi trường cục bộ
Tạo một file có tên là `.env.local` ở thư mục gốc của dự án (`/Onsite-chair-massage-web-update/.env.local`) và dán nội dung sau vào:

```env
# Supabase credentials (lấy từ Supabase Dashboard -> Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cấu hình website URL (cho callback redirect sau khi đăng nhập Google)
SITE_URL=http://localhost:3000

# Cấu hình SMTP gửi mail hóa đơn (Nodemailer - tuỳ chọn)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM_NAME="Heli Smart Chair Support"
ADMIN_EMAIL=your-admin-email@gmail.com
```

> [!IMPORTANT]
> Sau khi tạo file `.env.local`, hãy **khởi động lại** terminal chạy `npm run dev` để Next.js nhận diện các biến môi trường mới.

### Bước 1.2: Khởi tạo bảng dữ liệu trên Supabase
1. Truy cập vào **Supabase Dashboard** -> chọn dự án của bạn.
2. Chọn mục **SQL Editor** ở thanh công cụ bên trái -> Nhấp **New query**.
3. Mở file [heli_schema.sql](file:///c:/Users/Dell/Desktop/Heli/Onsite-chair-massage-web-update/docs/heli_schema.sql), sao chép toàn bộ code SQL trong đó, dán vào SQL Editor của Supabase và nhấp **Run**.
4. Lệnh SQL này sẽ tự động tạo 4 bảng cần thiết:
   - `bookings`: Lưu đơn mua cọc và lịch showroom.
   - `contacts`: Lưu tin nhắn từ form liên hệ và chatbot.
   - `favorites`: Đồng bộ danh sách sản phẩm yêu thích của khách hàng.
   - `cart_items`: Đồng bộ giỏ hàng của khách hàng.

---

## 🔑 2. Cấu Hình Google Auth (Đăng Nhập Gmail Khách Hàng)

Để tính năng đăng nhập Google hoạt động thật, bạn cần liên kết giữa **Google Cloud Console** và **Supabase**.

### Bước 2.1: Tạo OAuth Client ID trên Google Cloud Console
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một project mới (ví dụ: `Heli Smart Chair`).
3. Truy cập **APIs & Services** -> **OAuth consent screen**:
   - Chọn User Type là **External** -> Nhấp **Create**.
   - Điền các thông tin cơ bản: App name (`Heli`), User support email, Developer contact email.
   - Nhấp **Save and Continue** qua các bước tiếp theo.
4. Truy cập **APIs & Services** -> **Credentials**:
   - Nhấp **Create Credentials** -> Chọn **OAuth client ID**.
   - Application type: Chọn **Web application**.
   - Name: `Heli Web App`.
   - **Authorized JavaScript origins:** Nhấp Add URI và thêm:
     * `http://localhost:3000` (môi trường thử nghiệm local)
   - **Authorized redirect URIs:** Nhấp Add URI và dán đường dẫn **Redirect URL** lấy từ Supabase (xem Bước 2.2 bên dưới).
   - Nhấp **Create**. Bạn sẽ nhận được **Client ID** và **Client Secret**.

### Bước 2.2: Kích hoạt Google Provider trên Supabase
1. Truy cập **Supabase Dashboard** -> chọn dự án của bạn.
2. Vào mục **Authentication** -> **Providers** -> Chọn **Google**.
3. Bật trạng thái **Enable Google provider**.
4. Dán **Client ID** và **Client Secret** (lấy ở Bước 2.1) vào các ô tương ứng.
5. Copy đường dẫn trong ô **Redirect URL** ở cuối trang Supabase đó và quay lại dán vào mục **Authorized redirect URIs** của Google Cloud Console ở Bước 2.1.
6. Nhấp **Save** trên Supabase.

---

## 👤 3. Cách Tự Tạo Tài Khoản Admin Thật

Để tạo một tài khoản Admin đăng nhập bằng Email & Mật khẩu trên database Supabase thật, bạn có 2 cách thực hiện:

### Cách 1: Đặt tên email chứa chữ "admin" (Đơn giản nhất)
Theo cấu hình phân quyền trong mã nguồn Heli [AuthContext.tsx](file:///c:/Users/Dell/Desktop/Heli/Onsite-chair-massage-web-update/src/context/AuthContext.tsx):
- Mọi tài khoản đăng nhập bằng Email/Password có địa chỉ email chứa chữ `"admin"` sẽ **tự động được phân quyền Admin** trên giao diện (ví dụ: `admin@heli.vn`, `staff-admin@company.com`).
- **Cách tạo:**
  1. Vào **Supabase Dashboard** -> **Authentication** -> **Users**.
  2. Nhấp **Add user** -> Chọn **Create user**.
  3. Nhập Email (chứa từ khóa `admin`) và Mật khẩu -> Nhấp **Save**.
  4. Bạn có thể sử dụng email này đăng nhập trực tiếp tại tab **Admin Sign In** ở trang `/login`.

### Cách 2: Thiết lập metadata `role = "admin"` cho email bất kỳ
Nếu bạn muốn dùng một email thường (ví dụ: `manager@gmail.com`) làm Admin:
1. Tạo user bằng email đó tại **Authentication** -> **Users** -> **Add user**.
2. Truy cập **SQL Editor** trong Supabase, tạo một Query mới và chạy lệnh SQL sau để gán quyền Admin:

```sql
-- Thay thế email bên dưới bằng email thật bạn vừa tạo
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin", "full_name": "Heli Director"}'::jsonb 
WHERE email = 'manager@gmail.com';
```

3. Sau khi chạy thành công, tài khoản này sẽ được hệ thống Heli nhận diện là Admin khi đăng nhập bằng Email/Mật khẩu.
