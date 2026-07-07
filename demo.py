#!/usr/bin/env python3
"""
Demo script for Smart Crop Planning & Risk Mapping Assistant
This script demonstrates the core functionality without the Streamlit interface.
"""

from modules.farmer_profile import FarmerProfile
from modules.crop_recommendation import CropRecommender
from modules.risk_analysis import RiskAnalyzer
from modules.financial_planner import FinancialPlanner
from modules.chatbot import CropChatbot

def demo_farmer_profile():
    """Demo farmer profile creation and analysis."""
    print("🌾 Smart Crop Planning & Risk Mapping Assistant - Demo")
    print("=" * 60)
    
    # Create a sample farmer profile
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
    
    print(f"👨‍🌾 Farmer Profile Created: {farmer.name}")
    print(f"   Location: {farmer.state}, {farmer.district}")
    print(f"   Land: {farmer.total_acres} acres ({farmer.irrigated_acres} irrigated)")
    print(f"   Investment Capacity: ₹{farmer.investment_capacity:,}")
    print(f"   Risk Tolerance: {farmer.risk_tolerance}")
    
    # Get financial profile
    financial_profile = farmer.get_financial_profile()
    print(f"   Net Worth: ₹{financial_profile['net_worth']:,.0f}")
    print(f"   Risk Capacity: ₹{financial_profile['risk_capacity']:,.0f}")
    
    return farmer

def demo_crop_recommendations(farmer):
    """Demo crop recommendation system."""
    print("\n🌱 Crop Recommendations")
    print("-" * 30)
    
    recommender = CropRecommender()
    recommendations = recommender.get_recommendations(farmer)
    
    print(f"Total Recommendations: {recommendations['total_recommendations']}")
    print(f"Overall Risk Level: {recommendations['risk_profile']['level']}")
    
    for i, crop in enumerate(recommendations['crops'], 1):
        print(f"\n{i}. {crop['name']} ({crop['category']})")
        print(f"   Expected Yield: {crop['expected_yield']} tons/acre")
        print(f"   Investment: ₹{crop['investment']:,}")
        print(f"   Expected Revenue: ₹{crop['expected_revenue']:,}")
        print(f"   Net Profit: ₹{crop['net_profit']:,}")
        print(f"   ROI: {crop['roi']:.1f}%")
        print(f"   Risk Level: {crop['risk_level']}")
    
    return recommendations

def demo_risk_analysis(farmer, crop_recommendations):
    """Demo risk analysis system."""
    print("\n⚠️ Risk Analysis")
    print("-" * 20)
    
    analyzer = RiskAnalyzer()
    risk_analysis = analyzer.analyze_risks(farmer, crop_recommendations)
    
    print(f"Overall Risk Level: {risk_analysis['overall_risk']}")
    print(f"Risk Score: {risk_analysis['risk_score']:.2f}")
    
    risk_categories = [
        ("Disease Risk", risk_analysis['disease_risk']),
        ("Pest Risk", risk_analysis['pest_risk']),
        ("Weather Risk", risk_analysis['weather_risk']),
        ("Market Risk", risk_analysis['market_risk']),
        ("Water Risk", risk_analysis['water_risk']),
        ("Soil Risk", risk_analysis['soil_risk'])
    ]
    
    for category, risk_data in risk_categories:
        print(f"\n{category}:")
        print(f"   Level: {risk_data['level']}")
        print(f"   Probability: {risk_data['probability']:.1f}%")
        print(f"   Mitigation: {risk_data['mitigation']}")
    
    # Risk tolerance analysis
    tolerance = risk_analysis['tolerance_analysis']
    print(f"\nRisk Tolerance Analysis:")
    print(f"   Compatibility Score: {tolerance['compatibility_score']:.1f}%")
    print(f"   Recommendation: {tolerance['adjusted_recommendation']}")
    
    return risk_analysis

def demo_financial_analysis(farmer, crop_recommendations):
    """Demo financial analysis system."""
    print("\n💰 Financial Analysis")
    print("-" * 25)
    
    planner = FinancialPlanner()
    financial_analysis = planner.analyze_financials(farmer, crop_recommendations)
    
    print(f"Total Investment: ₹{financial_analysis['total_investment']:,}")
    print(f"Expected Revenue: ₹{financial_analysis['total_revenue']:,}")
    print(f"Net Profit: ₹{financial_analysis['net_profit']:,}")
    print(f"ROI: {financial_analysis['roi']:.1f}%")
    print(f"Profit Margin: {financial_analysis['profit_margin']:.1f}%")
    print(f"Investment per Acre: ₹{financial_analysis['investment_per_acre']:,}")
    print(f"Revenue per Acre: ₹{financial_analysis['revenue_per_acre']:,}")
    
    # Break-even analysis
    print(f"\nBreak-even Analysis:")
    print(f"   Break-even Yield: {financial_analysis['break_even_yield']:.2f} tons/acre")
    print(f"   Break-even Price: ₹{financial_analysis['break_even_price']:,}/ton")
    print(f"   Safety Margin: {financial_analysis['safety_margin']:.1f}%")
    
    # Financial health
    print(f"\nFinancial Health: {financial_analysis['financial_health']}")
    
    return financial_analysis

def demo_chatbot():
    """Demo AI chatbot functionality."""
    print("\n🤖 AI Assistant Demo")
    print("-" * 20)
    
    chatbot = CropChatbot()
    
    # Sample questions
    questions = [
        "What is the ideal spacing for wheat cultivation?",
        "How much fertilizer should I apply for rice?",
        "What are the irrigation requirements for maize?",
        "How can I manage pests in cotton?",
        "What government schemes are available for farmers?"
    ]
    
    for question in questions:
        print(f"\nQ: {question}")
        response = chatbot.get_response(question)
        print(f"A: {response}")
    
    # Get farming tips
    print(f"\n🌱 Farming Tips for Wheat:")
    tips = chatbot.get_farming_tips("wheat")
    for tip in tips:
        print(f"   • {tip}")
    
    # Emergency advice
    print(f"\n🚨 Emergency Advice for Drought:")
    emergency_advice = chatbot.get_emergency_advice("drought")
    print(f"   {emergency_advice}")

def main():
    """Run the complete demo."""
    try:
        # Demo farmer profile
        farmer = demo_farmer_profile()
        
        # Demo crop recommendations
        crop_recommendations = demo_crop_recommendations(farmer)
        
        # Demo risk analysis
        risk_analysis = demo_risk_analysis(farmer, crop_recommendations)
        
        # Demo financial analysis
        financial_analysis = demo_financial_analysis(farmer, crop_recommendations)
        
        # Demo chatbot
        demo_chatbot()
        
        print("\n" + "=" * 60)
        print("✅ Demo completed successfully!")
        print("🚀 To run the full application: streamlit run app.py")
        
    except Exception as e:
        print(f"❌ Error during demo: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
