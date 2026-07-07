from typing import Dict, List, Any, Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class FreeSMSNotifier:
    """Free SMS notification system using email-to-SMS gateways."""
    
    def __init__(self):
        # Email configuration (you can use Gmail, Outlook, etc.)
        self.email = os.getenv('EMAIL_ADDRESS')
        self.password = os.getenv('EMAIL_PASSWORD')  # App password for Gmail
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        
        # Check if email credentials are available
        self.is_configured = all([self.email, self.password])
        
        if not self.is_configured:
            print("⚠️ Free SMS not configured. Set EMAIL_ADDRESS and EMAIL_PASSWORD environment variables.")
        
        # Email-to-SMS gateways for major carriers
        self.sms_gateways = {
            # US Carriers
            'verizon': '@vtext.com',
            'att': '@txt.att.net',
            'tmobile': '@tmomail.net',
            'sprint': '@messaging.sprintpcs.com',
            'boost': '@myboostmobile.com',
            'cricket': '@mms.cricketwireless.net',
            'metro': '@mymetropcs.com',
            'uscellular': '@email.uscc.net',
            
            # Indian Carriers
            'airtel': '@airtelmail.com',
            'vodafone': '@vodafone-sms.com',
            'idea': '@ideacellular.net',
            'bsnl': '@bsnl.in',
            'mtnl': '@mtnl.net.in',
            'jio': '@sms.jio.com',
            'reliance': '@rcom.co.in',
            
            # Generic gateways (work for many carriers)
            'generic1': '@txt.att.net',
            'generic2': '@vtext.com',
            'generic3': '@tmomail.net'
        }
    
    def send_crop_report(self, phone_number: str, carrier: str, farmer_profile: Any, 
                        crop_recommendations: Dict, financial_analysis: Dict, 
                        risk_analysis: Dict) -> bool:
        """Send comprehensive crop planning report via free SMS."""
        if not self.is_configured:
            return False
        
        try:
            # Format the message
            message = self._format_crop_report_sms(farmer_profile, crop_recommendations, 
                                                 financial_analysis, risk_analysis)
            
            # Send the message
            return self._send_sms(phone_number, carrier, message)
            
        except Exception as e:
            print(f"Error sending crop report: {e}")
            return False
    
    def send_alert(self, phone_number: str, carrier: str, alert_type: str, message: str) -> bool:
        """Send emergency or important alerts via free SMS."""
        if not self.is_configured:
            return False
        
        try:
            formatted_message = self._format_alert_sms(alert_type, message)
            return self._send_sms(phone_number, carrier, formatted_message)
            
        except Exception as e:
            print(f"Error sending alert: {e}")
            return False
    
    def send_reminder(self, phone_number: str, carrier: str, crop_name: str, 
                     activity: str, due_date: str) -> bool:
        """Send farming activity reminders via free SMS."""
        if not self.is_configured:
            return False
        
        try:
            message = self._format_reminder_sms(crop_name, activity, due_date)
            return self._send_sms(phone_number, carrier, message)
            
        except Exception as e:
            print(f"Error sending reminder: {e}")
            return False
    
    def send_weather_alert(self, phone_number: str, carrier: str, weather_data: Dict) -> bool:
        """Send weather-based farming alerts via free SMS."""
        if not self.is_configured:
            return False
        
        try:
            message = self._format_weather_alert_sms(weather_data)
            return self._send_sms(phone_number, carrier, message)
            
        except Exception as e:
            print(f"Error sending weather alert: {e}")
            return False
    
    def send_market_update(self, phone_number: str, carrier: str, crop_name: str, 
                          current_price: float, price_change: float) -> bool:
        """Send market price updates via free SMS."""
        if not self.is_configured:
            return False
        
        try:
            message = self._format_market_update_sms(crop_name, current_price, price_change)
            return self._send_sms(phone_number, carrier, message)
            
        except Exception as e:
            print(f"Error sending market update: {e}")
            return False
    
    def _send_sms(self, phone_number: str, carrier: str, message: str) -> bool:
        """Send SMS using email-to-SMS gateway."""
        try:
            # Get the SMS gateway for the carrier
            if carrier not in self.sms_gateways:
                print(f"❌ Unknown carrier: {carrier}")
                print(f"Available carriers: {list(self.sms_gateways.keys())}")
                return False
            
            gateway = self.sms_gateways[carrier]
            
            # Format the phone number (remove any non-digits)
            clean_number = ''.join(filter(str.isdigit, phone_number))
            
            # Create the SMS email address
            sms_email = f"{clean_number}{gateway}"
            
            # Create email message
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = sms_email
            msg['Subject'] = "Crop Planning Alert"
            
            # Add message body
            msg.attach(MIMEText(message, 'plain'))
            
            # Send the email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            
            text = msg.as_string()
            server.sendmail(self.email, sms_email, text)
            server.quit()
            
            print(f"✅ Free SMS sent successfully to {phone_number} via {carrier}")
            return True
            
        except Exception as e:
            print(f"Error in _send_sms: {e}")
            return False
    
    def _format_crop_report_sms(self, farmer_profile: Any, crop_recommendations: Dict, 
                               financial_analysis: Dict, risk_analysis: Dict) -> str:
        """Format crop planning report for SMS (shorter format)."""
        message = f"Crop Plan for {farmer_profile.name}\n"
        message += f"Location: {farmer_profile.state}\n"
        message += f"Land: {farmer_profile.total_acres} acres\n\n"
        
        # Top crop recommendation
        if crop_recommendations.get('crops'):
            top_crop = crop_recommendations['crops'][0]
            message += f"Top Crop: {top_crop['name']}\n"
            message += f"Yield: {top_crop['expected_yield']} tons/acre\n"
            message += f"Investment: ₹{top_crop['investment']:,.0f}\n"
            message += f"ROI: {top_crop['roi']:.1f}%\n"
            message += f"Risk: {top_crop['risk_level']}\n\n"
        
        # Financial summary
        message += f"Total Investment: ₹{financial_analysis.get('total_investment', 0):,.0f}\n"
        message += f"Expected Revenue: ₹{financial_analysis.get('total_revenue', 0):,.0f}\n"
        message += f"Net Profit: ₹{financial_analysis.get('net_profit', 0):,.0f}\n"
        message += f"Overall ROI: {financial_analysis.get('roi', 0):.1f}%\n\n"
        
        # Risk assessment
        message += f"Risk Level: {risk_analysis.get('overall_risk', 'Unknown')}\n"
        message += f"Risk Score: {risk_analysis.get('risk_score', 0):.1f}\n\n"
        
        message += f"Generated: {datetime.now().strftime('%d/%m/%Y %H:%M')}"
        
        return message
    
    def _format_alert_sms(self, alert_type: str, message: str) -> str:
        """Format alert message for SMS."""
        emoji_map = {
            'weather': '🌦️',
            'pest': '🐛',
            'disease': '🦠',
            'market': '📈',
            'irrigation': '💧',
            'emergency': '🚨'
        }
        
        emoji = emoji_map.get(alert_type.lower(), '⚠️')
        
        formatted_message = f"{emoji} {alert_type.upper()} ALERT\n\n"
        formatted_message += f"{message}\n\n"
        formatted_message += f"Time: {datetime.now().strftime('%d/%m/%Y %H:%M')}"
        
        return formatted_message
    
    def _format_reminder_sms(self, crop_name: str, activity: str, due_date: str) -> str:
        """Format farming activity reminder for SMS."""
        message = f"🌱 FARMING REMINDER\n\n"
        message += f"Crop: {crop_name}\n"
        message += f"Activity: {activity}\n"
        message += f"Due: {due_date}\n\n"
        message += f"Don't forget this important farming activity for optimal results!"
        
        return message
    
    def _format_weather_alert_sms(self, weather_data: Dict) -> str:
        """Format weather alert for SMS."""
        message = f"🌦️ WEATHER ALERT\n\n"
        message += f"Temp: {weather_data.get('temperature', 'N/A')}\n"
        message += f"Humidity: {weather_data.get('humidity', 'N/A')}\n"
        message += f"Rainfall: {weather_data.get('rainfall', 'N/A')}\n"
        message += f"Wind: {weather_data.get('wind_speed', 'N/A')}\n\n"
        message += f"Recommendations:\n{weather_data.get('recommendations', 'Monitor conditions')}\n\n"
        message += f"Precautions:\n{weather_data.get('precautions', 'Take necessary precautions')}"
        
        return message
    
    def _format_market_update_sms(self, crop_name: str, current_price: float, price_change: float) -> str:
        """Format market update for SMS."""
        change_emoji = "📈" if price_change >= 0 else "📉"
        change_text = f"+{price_change:.2f}" if price_change >= 0 else f"{price_change:.2f}"
        
        message = f"📊 MARKET UPDATE\n\n"
        message += f"Crop: {crop_name}\n"
        message += f"Price: ₹{current_price:,.2f}/ton\n"
        message += f"Change: {change_emoji} {change_text}%\n\n"
        message += f"Recommendation:\n{self._get_market_recommendation(price_change)}"
        
        return message
    
    def _get_market_recommendation(self, price_change: float) -> str:
        """Get market recommendation based on price change."""
        if price_change > 10:
            return "Strong upward trend. Consider holding produce."
        elif price_change > 5:
            return "Moderate increase. Monitor conditions."
        elif price_change > -5:
            return "Stable prices. Normal conditions."
        elif price_change > -10:
            return "Price decline. Consider selling if storage costs high."
        else:
            return "Significant drop. Evaluate selling strategy carefully."
    
    def get_available_carriers(self) -> List[str]:
        """Get list of available carriers."""
        return list(self.sms_gateways.keys())
    
    def test_connection(self) -> bool:
        """Test email connection."""
        if not self.is_configured:
            return False
        
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            server.quit()
            print("✅ Email connection test successful!")
            return True
        except Exception as e:
            print(f"❌ Email connection test failed: {e}")
            return False
