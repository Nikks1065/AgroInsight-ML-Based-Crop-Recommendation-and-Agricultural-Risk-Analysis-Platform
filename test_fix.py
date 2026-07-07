#!/usr/bin/env python3
"""
Test script to verify the financial planner fix.
"""

from modules.farmer_profile import FarmerProfile
from modules.crop_recommendation import CropRecommender
from modules.financial_planner import FinancialPlanner

def test_financial_planner():
    """Test the financial planner with sample data."""
    print("🧪 Testing Financial Planner Fix")
    print("=" * 40)
    
    # Create a sample farmer profile
    farmer = FarmerProfile(
        name="Test Farmer",
        age=35,
        experience_years=10,
        family_size=4,
        education="Secondary",
        annual_income=200000,
        savings=50000,
        land_value=400000,
        bank_loan=30000,
        risk_tolerance="Medium",
        investment_capacity=100000,
        total_acres=5.0,
        irrigated_acres=4.0,
        soil_type="Loamy",
        irrigation_type="Mixed",
        state="Punjab",
        district="Amritsar",
        latitude=31.6340,
        longitude=74.8723
    )
    
    # Get crop recommendations
    recommender = CropRecommender()
    recommendations = recommender.get_recommendations(farmer)
    
    print(f"✅ Got {len(recommendations['crops'])} crop recommendations")
    
    # Test financial analysis
    try:
        planner = FinancialPlanner()
        financial_analysis = planner.analyze_financials(farmer, recommendations)
        
        print("✅ Financial analysis completed successfully!")
        print(f"   Total Investment: ₹{financial_analysis['total_investment']:,}")
        print(f"   Expected Revenue: ₹{financial_analysis['total_revenue']:,}")
        print(f"   Net Profit: ₹{financial_analysis['net_profit']:,}")
        print(f"   ROI: {financial_analysis['roi']:.1f}%")
        
        # Test cash flow generation
        cash_flow = planner.generate_cash_flow(farmer, recommendations)
        print("✅ Cash flow generation completed successfully!")
        print(f"   Peak cash requirement: ₹{cash_flow['summary']['peak_cash_requirement']:,}")
        
        print("\n🎉 All tests passed! The fix is working correctly.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_financial_planner()
