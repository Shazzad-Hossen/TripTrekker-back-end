export const sendOtpTemplate = (otp) =>
  `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Otp Verification</title> <style> *{ box-sizing: border-box; margin: 0; padding: 0; } </style> </head> <body style="background-color: #dbdbdb; padding: 10px;"> <div style="background-color: white; max-width: 800px; width: 100%; margin: 0 auto; border: 1px solid #ebebeb; border-radius: 4px; padding: 20px;"> <p style="margin: 0 auto; font-size: 40px; font-weight: 600; width: fit-content;  color: #01AFD1; padding-top: 50px; text-align: center; padding-bottom: 20px;">OTP Verification</p> <p>Dear user, <br> <br> Ir seems like that you have forgot your password and trying to reset it. Please use the following One Time Password (OTP) to reset your password. Do not share this OTP with anyone.</p> <div style="background-color: #01AFD160; color: #043263; font-size: 38px; font-weight: 600; width: fit-content; border-radius: 4px; margin: 50px auto; padding: 5px 10px;">${otp}</div> <p style="text-align: center;">If you did not request it, you can ignore this or let us know. Thank you</p> </div> </body> </html>`;