const axios = require('axios');

class CaptchaController {
  static async verifyCaptcha(req, res) {
    try {
      const { captchaToken } = req.body;
      
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
      );
      
      if (response.data.success) {
        return res.json({ success: true });
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid captcha' 
        });
      }
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = CaptchaController;