export const emailHtml = (verificationLink) =>  `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Xác minh tài khoản của bạn</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; padding: 20px; 
            border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center; }
        .logo { width: 120px; margin-bottom: 20px; }
        h2 { color: #333; font-size: 30px}
        p { color: #666; font-size: 16px; }
        .button { display: inline-block; background-color: #007bff; color: white; text-decoration: none; 
            padding: 12px 20px; border-radius: 5px; font-size: 16px; font-weight: bold; margin-top: 20px; }
        .button:hover { background-color: #0056b3; color: white}
        .footer { margin-top: 20px; font-size: 12px; color: #999; }
        span {font-weight: 700; font-size: 20px; color: black;}
    </style>
</head>
<body>
    <div class="container">
        <h2>Hoàn tất xác minh tài khoản</h2>
        <p>Xin chào,</p>
        <p>Cảm ơn bạn đã đăng ký. Vui lòng nhấp vào nút bên dưới để xác minh tài khoản của bạn:</p>
        <p>Link xác thực chỉ tồn tại trong vòng <span>5 phút</span> nếu như quá thời hạn vui lòng liên hệ với cửa hàng trưởng</p>
        <a href="${verificationLink}" class="button">Xác minh tài khoản</a>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        <div class="footer">
            <p>© 2025 Phần mềm thanh toán. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`

export const emailOTP = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Xác minh tài khoản của bạn</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; padding: 20px; 
            border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center; }
        .logo { width: 120px; margin-bottom: 20px; }
        h2 { color: #333; font-size: 30px}
        p { color: #666; font-size: 16px; }
        .button { display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; 
            padding: 12px 20px; border-radius: 5px; font-size: 16px; font-weight: bold; margin-top: 20px; }
        .button:hover { background-color: #0056b3; }
        .footer { margin-top: 20px; font-size: 12px; color: #999; }
        span {font-weight: 700; font-size: 20px; color: black;}
    </style>
</head>
<body>
    <div class="container">
        <h2>Xác thực OTP</h2>
        <p>Mã xác thực OTP của bạn là <span>${otp}</span></p>
        <p>Vui lòng không cung cấp mã OTP với người khác, mã có hiệu lực trong <span>5 phút</span></p>
    </div>
</body>
</html>`