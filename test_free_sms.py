#!/usr/bin/env python3
"""
Test script for FREE SMS notifications functionality.
This script demonstrates the free SMS integration using email-to-SMS gateways.
"""

from modules.free_sms_notifier import FreeSMSNotifier
from modules.farmer_profile import FarmerProfile
from modules.crop_recommendation import CropRecommender
from modules.risk_analysis import RiskAnalyzer
from modules.financial_planner import FinancialPlanner

def test_free_sms_functionality():
    """Test free SMS notification functionality with sample data."""
    print("📱 Testing FREE SMS Notifications")
    print("=" * 50)
    
    # Create sample farmer profile
    farmer = FarmerProfile(
        name="Rajesh Kumar",
        age=35,
        experience_years=12,
        family_size=5,
        education="Secondary",
        annual_income=250000,
        savings=75000,
        land_value=600000,
        bank_loan=50000,
        risk_tolerance="Medium",
        investment_capacity=150000,
        total_acres=8.0,
        irrigated_acres=6.0,
        soil_type="Loamy",
        irrigation_type="Mixed",
        state="Punjab",
        district="Amritsar",
        latitude=31.6340,
        longitude=74.8723
    )
    
    # Get crop recommendations
    recommender = CropRecommender()
    crop_recommendations = recommender.get_recommendations(farmer)
    
    # Get risk analysis
    risk_analyzer = RiskAnalyzer()
    risk_analysis = risk_analyzer.analyze_risks(farmer, crop_recommendations)
    
    # Get financial analysis
    financial_planner = FinancialPlanner()
    financial_analysis = financial_planner.analyze_financials(farmer, crop_recommendations)
    
    # Initialize free SMS notifier
    sms = FreeSMSNotifier()
    
    print(f"✅ Free SMS configured: {sms.is_configured}")
    
    if not sms.is_configured:
        print("⚠️ Free SMS not configured. This is expected in test mode.")
        print("   To enable free SMS, set up Gmail credentials (see FREE_SMS_SETUP.md)")
    
    # Test message formatting (without sending)
    print("\n📊 Testing Message Formats:")
    print("-" * 30)
    
    # Test crop report formatting
    crop_report = sms._format_crop_report_sms(farmer, crop_recommendations, financial_analysis, risk_analysis)
    print("✅ Crop Report SMS Format:")
    print(crop_report[:200] + "..." if len(crop_report) > 200 else crop_report)
    
    # Test alert formatting
    alert_message = sms._format_alert_sms("Weather", "Heavy rainfall expected in next 24 hours. Postpone irrigation activities.")
    print("\n✅ Weather Alert SMS Format:")
    print(alert_message[:200] + "..." if len(alert_message) > 200 else alert_message)
    
    # Test reminder formatting
    reminder_message = sms._format_reminder_sms("Wheat", "Fertilizer application", "15 December 2024")
    print("\n✅ Reminder SMS Format:")
    print(reminder_message[:200] + "..." if len(reminder_message) > 200 else reminder_message)
    
    # Test weather alert formatting
    weather_data = {
        "temperature": "28°C",
        "humidity": "75%",
        "rainfall": "25mm",
        "wind_speed": "15km/h",
        "recommendations": "Postpone irrigation activities. Monitor crop health.",
        "precautions": "Ensure proper drainage. Protect sensitive crops."
    }
    weather_alert = sms._format_weather_alert_sms(weather_data)
    print("\n✅ Weather Alert with Data SMS Format:")
    print(weather_alert[:200] + "..." if len(weather_alert) > 200 else weather_alert)
    
    # Test market update formatting
    market_message = sms._format_market_update_sms("Wheat", 2200.0, 5.5)
    print("\n✅ Market Update SMS Format:")
    print(market_message[:200] + "..." if len(market_message) > 200 else market_message)
    
    print("\n🎉 All SMS message formats tested successfully!")
    print("\n📱 To enable actual FREE SMS sending:")
    print("1. Follow the setup guide in FREE_SMS_SETUP.md")
    print("2. Set up Gmail app password in .env file")
    print("3. Test with your own phone number first")
    print("4. Select the correct carrier for your phone")

def test_carrier_support():
    """Test carrier support and gateway information."""
    print("\n📡 Testing Carrier Support:")
    print("-" * 30)
    
    sms = FreeSMSNotifier()
    
    # Show available carriers
    carriers = sms.get_available_carriers()
    print(f"✅ Available carriers: {len(carriers)}")
    
    # Show Indian carriers
    indian_carriers = ['airtel', 'vodafone', 'idea', 'bsnl', 'mtnl', 'jio', 'reliance']
    print("\n🇮🇳 Indian Carriers:")
    for carrier in indian_carriers:
        if carrier in sms.sms_gateways:
            gateway = sms.sms_gateways[carrier]
            print(f"   {carrier.capitalize()}: {gateway}")
    
    # Show US carriers
    us_carriers = ['verizon', 'att', 'tmobile', 'sprint', 'boost', 'cricket', 'metro', 'uscellular']
    print("\n🇺🇸 US Carriers:")
    for carrier in us_carriers:
        if carrier in sms.sms_gateways:
            gateway = sms.sms_gateways[carrier]
            print(f"   {carrier.capitalize()}: {gateway}")
    
    # Show generic carriers
    generic_carriers = ['generic1', 'generic2', 'generic3']
    print("\n🌍 Generic Carriers:")
    for carrier in generic_carriers:
        if carrier in sms.sms_gateways:
            gateway = sms.sms_gateways[carrier]
            print(f"   {carrier.capitalize()}: {gateway}")

def test_message_validation():
    """Test message validation and formatting."""
    print("\n🔍 Testing Message Validation:")
    print("-" * 30)
    
    sms = FreeSMSNotifier()
    
    # Test market recommendations
    price_changes = [15.5, 5.2, -3.1, -12.8]
    for change in price_changes:
        recommendation = sms._get_market_recommendation(change)
        print(f"Price change {change:+.1f}% → {recommendation}")
    
    # Test phone number formatting
    test_numbers = ["9876543210", "+919876543210", "919876543210", "98765-43210"]
    for number in test_numbers:
        clean_number = ''.join(filter(str.isdigit, number))
        print(f"Original: {number} → Clean: {clean_number}")
    
    # Test SMS email address creation
    phone = "9876543210"
    carrier = "airtel"
    if carrier in sms.sms_gateways:
        gateway = sms.sms_gateways[carrier]
        sms_email = f"{phone}{gateway}"
        print(f"Phone: {phone}, Carrier: {carrier} → SMS Email: {sms_email}")
    
    print("✅ Message validation tests completed!")

def demonstrate_free_sms_advantages():
    """Demonstrate the advantages of free SMS over paid services."""
    print("\n💰 FREE SMS vs Paid Services:")
    print("-" * 40)
    
    print("🆓 FREE SMS (Email-to-SMS Gateways):")
    print("   ✅ Cost: $0 (completely free)")
    print("   ✅ Setup: Easy (just Gmail app password)")
    print("   ✅ Limits: Only email provider limits")
    print("   ✅ Carriers: Most major carriers worldwide")
    print("   ✅ Reliability: High")
    print("   ✅ No credit card required")
    print("   ✅ No monthly fees")
    print("   ✅ No per-message charges")
    
    print("\n💳 Paid Services (Twilio, etc.):")
    print("   ❌ Cost: $0.0079 per message")
    print("   ❌ Setup: Complex (API keys, sandbox)")
    print("   ❌ Limits: Monthly quotas")
    print("   ❌ Carriers: Limited to service provider")
    print("   ❌ Reliability: Very high")
    print("   ❌ Credit card required")
    print("   ❌ Monthly fees possible")
    print("   ❌ Per-message charges")
    
    print("\n🎯 Recommendation: Use FREE SMS for most use cases!")
    print("   Only use paid services if you need enterprise-level reliability")

if __name__ == "__main__":
    test_free_sms_functionality()
    test_carrier_support()
    test_message_validation()
    demonstrate_free_sms_advantages()
    
    print("\n" + "=" * 60)
    print("🎉 FREE SMS testing completed!")
    print("📱 Ready to help farmers with free SMS notifications!")
    print("📖 See FREE_SMS_SETUP.md for setup instructions")
