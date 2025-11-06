// 📁 functions/index.js
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

// ⚙️ Cấu hình Gmail gửi thư
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thaptta@gmail.com", // Gmail gửi đi
    pass: "fkkfvfzjjlprupdm", // App password lấy ở bước 1
  },
});

// 🟢 Gửi mã xác thực (hoặc mã đặt lại mật khẩu)
exports.sendVerificationCode = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { email, code, subject } = req.body;

      if (!email || !code) {
        return res.status(400).send({ error: "Thiếu email hoặc mã xác thực." });
      }

      const mailOptions = {
        from: `"Thaptta Support" <thaptta.web@gmail.com>`,
        to: email,
        subject: subject || "Mã xác thực tài khoản Thaptta",
        html: `
          <h2>Xin chào,</h2>
          <p>Mã xác thực của bạn là: <b style="font-size:18px;">${code}</b></p>
          <p>Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ với ai khác.</p>
          <br>
          <p>— Thaptta Team</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).send({ success: true, message: "Email đã được gửi thành công!" });
    } catch (error) {
      console.error("Lỗi gửi mail:", error);
      res.status(500).send({ success: false, message: "Gửi mail thất bại." });
    }
  });
});
