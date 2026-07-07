# 📱 FREE SMS Notifications Setup Guide

## 🆓 **100% FREE - No Charges Ever!**

This SMS service uses **email-to-SMS gateways** provided by mobile carriers. It's completely free and doesn't require any paid services like Twilio.

## 🚀 Quick Setup

### 1. Set up Gmail App Password
1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Enable **2-Factor Authentication** if not already enabled
3. Go to **Security** → **App passwords**
4. Generate a new app password for "Crop Planning Assistant"
5. Copy the 16-character password

### 2. Create Environment File
Create a `.env` file in your project root with:

```env
# Free SMS Configuration (Gmail)
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

### 3. Test the Setup
1. Run the application: `streamlit run app.py`
2. Go to **📱 Free SMS Notifications**
3. Click **"Test Email Connection"**
4. If successful, you're ready to send free SMS!

## 📱 Supported Carriers

### 🇮🇳 Indian Carriers
- **Airtel**: `@airtelmail.com`
- **Vodafone**: `@vodafone-sms.com`
- **Idea**: `@ideacellular.net`
- **BSNL**: `@bsnl.in`
- **MTNL**: `@mtnl.net.in`
- **Jio**: `@sms.jio.com`
- **Reliance**: `@rcom.co.in`

### 🇺🇸 US Carriers
- **Verizon**: `@vtext.com`
- **AT&T**: `@txt.att.net`
- **T-Mobile**: `@tmomail.net`
- **Sprint**: `@messaging.sprintpcs.com`
- **Boost**: `@myboostmobile.com`
- **Cricket**: `@mms.cricketwireless.net`
- **Metro**: `@mymetropcs.com`
- **US Cellular**: `@email.uscc.net`

### 🌍 Generic Gateways
- **Generic 1**: `@txt.att.net` (works with many carriers)
- **Generic 2**: `@vtext.com` (works with many carriers)
- **Generic 3**: `@tmomail.net` (works with many carriers)

## 🔧 How It Works

1. **Email-to-SMS Gateway**: Mobile carriers provide special email addresses
2. **Free Service**: Carriers convert emails to SMS for free
3. **No Limits**: No message limits (except your email provider's limits)
4. **Worldwide**: Works with carriers in most countries

### Example:
- Phone: `9876543210`
- Carrier: `airtel`
- Email sent to: `9876543210@airtelmail.com`
- Result: SMS delivered to the phone

## 📋 Available Notifications

### 1. Crop Planning Report
- Farmer details and location
- Top crop recommendations
- Financial summary
- Risk assessment

### 2. Weather Alerts
- Temperature, humidity, rainfall
- Farming recommendations
- Safety precautions

### 3. Emergency Alerts
- Pest outbreaks
- Disease warnings
- Market fluctuations
- Irrigation issues

### 4. Farming Reminders
- Activity scheduling
- Due date notifications
- Task management

### 5. Market Updates
- Price changes
- Market trends
- Selling recommendations

## 📱 SMS Message Format Examples

### Crop Report
```
Crop Plan for Rajesh Kumar
Location: Punjab
Land: 8.0 acres

Top Crop: Wheat
Yield: 4.74 tons/acre
Investment: ₹22,500
ROI: -49.0%
Risk: Low

Total Investment: ₹36,000
Expected Revenue: ₹19,528
Net Profit: ₹-16,472
Overall ROI: -45.8%

Risk Level: Low
Risk Score: 0.26

Generated: 15/12/2024 14:30
```

### Weather Alert
```
🌦️ WEATHER ALERT

Heavy rainfall expected in next 24 hours. Postpone irrigation activities.

Temp: 28°C
Humidity: 75%
Rainfall: 25mm
Wind: 15km/h

Recommendations:
Postpone irrigation activities.

Precautions:
Ensure proper drainage.
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Email connection failed"**
   - Check if 2FA is enabled on Gmail
   - Verify app password is correct
   - Ensure Gmail allows "less secure apps" or use app password

2. **"SMS not delivered"**
   - Verify carrier selection
   - Check phone number format (no country code)
   - Try different carrier options
   - Some carriers may have delays

3. **"Unknown carrier"**
   - Select from the available carrier list
   - Try generic carriers if yours isn't listed
   - Check carrier's email-to-SMS gateway

### Testing Your Setup

1. **Test with your own number first**
2. **Try different carriers** if one doesn't work
3. **Check spam folder** (rare, but possible)
4. **Wait 1-2 minutes** for delivery

## 💡 Tips for Success

### Best Practices
- **Use Gmail**: Most reliable for this setup
- **Test first**: Always test with your own number
- **Check carrier**: Verify your carrier is supported
- **Be patient**: SMS delivery can take 1-2 minutes

### Alternative Email Providers
If Gmail doesn't work, try:
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **ProtonMail**: `smtp.protonmail.ch:587`

## 🔒 Security & Privacy

- **No message storage**: Messages are not stored locally
- **Secure email**: Uses TLS encryption
- **No third-party**: Direct email-to-SMS, no intermediaries
- **Privacy**: Only your email provider sees the messages

## 💰 Cost Comparison

| Service | Cost | Setup | Reliability |
|---------|------|-------|-------------|
| **Free SMS** | $0 | Easy | High |
| Twilio SMS | $0.0079/msg | Medium | Very High |
| Twilio WhatsApp | $0.0079/msg | Complex | Very High |

## 📞 Support

### If SMS doesn't work:
1. **Check carrier support**: Not all carriers support email-to-SMS
2. **Try generic carriers**: Often work when specific ones don't
3. **Contact carrier**: Some carriers require activation
4. **Use WhatsApp option**: As backup if SMS fails

### For technical support:
- Check email credentials
- Verify carrier selection
- Test with different phone numbers
- Check email provider settings

---

## 🎉 **You're Ready!**

Once configured, you can send unlimited free SMS notifications to farmers with:
- ✅ No monthly fees
- ✅ No per-message charges
- ✅ No credit card required
- ✅ Works worldwide
- ✅ Instant delivery

**Start helping farmers with free SMS notifications today!** 🌾📱
