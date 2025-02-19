import { envConfig } from "@/config/env.config.js";

export default (otp: string) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>OTP Verification - Echo Notes</title>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        
        body, html {
            margin: 0;
            padding: 0;
            background-color: #1f1f1f;
            font-family: "Space Mono", Arial, sans-serif;
            color: #ffffff;
        }

        .container {
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            background: linear-gradient(135deg, #b7007d, #00c846, #004fa3);
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }

        .content {
            padding: 20px;
            background: #1f1f1f;
            border-radius: 8px;
        }

        .otp-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            margin: 20px 0;
            padding: 10px;
            display: inline-block;
            background: #333;
            border-radius: 5px;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            opacity: 0.7;
        }

        .logo {
            max-width: 100px;
            margin: 0 auto 20px;
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://i.postimg.cc/4xfdtwmf/black-bg-echo-note.png" alt="Echo Notes Logo" class="logo" />
        <div class="content">
            <h1>Verify Your Email</h1>
            <p>Your One-Time Password (OTP) is:</p>
            <p class="otp-code">${otp}</p>
            <p>This OTP is valid for <strong>${Number.parseInt(envConfig.VERIFIICATION_TOKEN_EXP)}</strong> minutes. Do not share it with anyone.</p>
        </div>
        <div class="footer">
            <p>If you didn’t request this, please ignore this email.</p>
        </div>
    </div>
</body>
</html>`;
};
