import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import folium
from streamlit_folium import folium_static
import json
import os
from modules.farmer_profile import FarmerProfile
from modules.crop_recommendation import CropRecommender
from modules.risk_analysis import RiskAnalyzer
from modules.financial_planner import FinancialPlanner
from modules.chatbot import CropChatbot
from modules.free_sms_notifier import FreeSMSNotifier

# Page configuration
st.set_page_config(
    page_title="Smart Crop Planning & Risk Mapping Assistant",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #2E8B57;
        text-align: center;
        margin-bottom: 2rem;
    }
    .section-header {
        font-size: 1.5rem;
        color: #228B22;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    .risk-low { color: #28a745; }
    .risk-medium { color: #ffc107; }
    .risk-high { color: #dc3545; }
    .metric-card {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #28a745;
    }
</style>
""", unsafe_allow_html=True)

def main():
    st.markdown('<h1 class="main-header">🌾 Smart Crop Planning & Risk Mapping Assistant</h1>', unsafe_allow_html=True)
    st.markdown("### India-focused Agricultural Decision Support System")
    
    # Initialize session state
    if 'farmer_profile' not in st.session_state:
        st.session_state.farmer_profile = None
    if 'crop_recommendations' not in st.session_state:
        st.session_state.crop_recommendations = None
    if 'risk_analysis' not in st.session_state:
        st.session_state.risk_analysis = None
    
    # Sidebar navigation
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox(
        "Choose a section:",
        ["🏠 Dashboard", "👨‍🌾 Farmer Profile", "🌱 Crop Planning", "💰 Financial Analysis", 
         "⚠️ Risk Assessment", "🗺️ Geospatial Analysis", "🤖 AI Assistant", "📱 Free SMS Notifications"]
    )
    
    if page == "🏠 Dashboard":
        show_dashboard()
    elif page == "👨‍🌾 Farmer Profile":
        show_farmer_profile()
    elif page == "🌱 Crop Planning":
        show_crop_planning()
    elif page == "💰 Financial Analysis":
        show_financial_analysis()
    elif page == "⚠️ Risk Assessment":
        show_risk_assessment()
    elif page == "🗺️ Geospatial Analysis":
        show_geospatial_analysis()
    elif page == "🤖 AI Assistant":
        show_ai_assistant()
    elif page == "📱 Free SMS Notifications":
        show_free_sms_notifications()

def show_dashboard():
    st.markdown('<h2 class="section-header">📊 Dashboard Overview</h2>', unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Farmer Profile", "Complete" if st.session_state.farmer_profile else "Pending", 
                 delta="✅" if st.session_state.farmer_profile else "❌")
    
    with col2:
        st.metric("Crop Recommendations", "Ready" if st.session_state.crop_recommendations else "Pending",
                 delta="🌱" if st.session_state.crop_recommendations else "⏳")
    
    with col3:
        st.metric("Risk Analysis", "Complete" if st.session_state.risk_analysis else "Pending",
                 delta="⚠️" if st.session_state.risk_analysis else "⏳")
    
    with col4:
        st.metric("Expected ROI", "15-25%" if st.session_state.farmer_profile else "N/A",
                 delta="📈" if st.session_state.farmer_profile else "❓")
    
    # Quick actions
    st.markdown("### Quick Actions")
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("🚀 Start New Planning Session", use_container_width=True):
            st.session_state.farmer_profile = None
            st.session_state.crop_recommendations = None
            st.session_state.risk_analysis = None
            st.success("Session reset! Please start with Farmer Profile.")
    
    with col2:
        if st.button("📋 View Sample Report", use_container_width=True):
            show_sample_report()

def show_farmer_profile():
    st.markdown('<h2 class="section-header">👨‍🌾 Farmer Profile & Budgeting</h2>', unsafe_allow_html=True)
    
    with st.form("farmer_profile_form"):
        st.subheader("Personal Information")
        col1, col2 = st.columns(2)
        
        with col1:
            farmer_name = st.text_input("Farmer Name")
            age = st.number_input("Age", min_value=18, max_value=80, value=35)
            experience_years = st.number_input("Years of Farming Experience", min_value=0, max_value=50, value=10)
        
        with col2:
            family_size = st.number_input("Family Size", min_value=1, max_value=20, value=5)
            education = st.selectbox("Education Level", 
                                   ["No Formal Education", "Primary", "Secondary", "Higher Secondary", "Graduate"])
        
        st.subheader("Financial Information")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            annual_income = st.number_input("Annual Income (₹)", min_value=0, value=200000, step=10000)
            savings = st.number_input("Total Savings (₹)", min_value=0, value=50000, step=5000)
        
        with col2:
            land_value = st.number_input("Land Value per Acre (₹)", min_value=0, value=500000, step=10000)
            bank_loan = st.number_input("Existing Bank Loans (₹)", min_value=0, value=0, step=10000)
        
        with col3:
            risk_tolerance = st.selectbox("Risk Tolerance", ["Low", "Medium", "High"])
            investment_capacity = st.number_input("Investment Capacity (₹)", min_value=0, value=100000, step=10000)
        
        st.subheader("Land Information")
        col1, col2 = st.columns(2)
        
        with col1:
            total_acres = st.number_input("Total Land Area (Acres)", min_value=0.1, value=5.0, step=0.1)
            irrigated_acres = st.number_input("Irrigated Area (Acres)", min_value=0.0, value=3.0, step=0.1)
        
        with col2:
            soil_type = st.selectbox("Primary Soil Type", 
                                   ["Clay", "Sandy", "Loamy", "Red Soil", "Black Soil", "Alluvial"])
            irrigation_type = st.selectbox("Irrigation Type", 
                                         ["Well", "Canal", "Borewell", "Rainfed", "Mixed"])
        
        st.subheader("Location Information")
        col1, col2 = st.columns(2)
        
        with col1:
            state = st.selectbox("State", ["Maharashtra", "Punjab", "Haryana", "Uttar Pradesh", "Karnataka", "Tamil Nadu"])
            district = st.text_input("District")
        
        with col2:
            latitude = st.number_input("Latitude", min_value=8.0, max_value=37.0, value=19.0760, format="%.4f")
            longitude = st.number_input("Longitude", min_value=68.0, max_value=97.0, value=72.8777, format="%.4f")
        
        submitted = st.form_submit_button("Save Farmer Profile")
        
        if submitted:
            farmer_profile = FarmerProfile(
                name=farmer_name,
                age=age,
                experience_years=experience_years,
                family_size=family_size,
                education=education,
                annual_income=annual_income,
                savings=savings,
                land_value=land_value,
                bank_loan=bank_loan,
                risk_tolerance=risk_tolerance,
                investment_capacity=investment_capacity,
                total_acres=total_acres,
                irrigated_acres=irrigated_acres,
                soil_type=soil_type,
                irrigation_type=irrigation_type,
                state=state,
                district=district,
                latitude=latitude,
                longitude=longitude
            )
            
            st.session_state.farmer_profile = farmer_profile
            st.success("✅ Farmer profile saved successfully!")
            st.balloons()

def show_crop_planning():
    st.markdown('<h2 class="section-header">🌱 Crop Recommendation & Planning</h2>', unsafe_allow_html=True)
    
    if not st.session_state.farmer_profile:
        st.warning("⚠️ Please complete the Farmer Profile first!")
        return
    
    farmer = st.session_state.farmer_profile
    
    # Initialize crop recommender
    recommender = CropRecommender()
    
    # Get crop recommendations
    recommendations = recommender.get_recommendations(farmer)
    st.session_state.crop_recommendations = recommendations
    
    # Display recommendations
    st.subheader("Recommended Crops")
    
    for i, crop in enumerate(recommendations['crops']):
        with st.expander(f"🌾 {crop['name']} - {crop['category']}"):
            col1, col2 = st.columns(2)
            
            with col1:
                st.write(f"**Expected Yield:** {crop['expected_yield']} tons/acre")
                st.write(f"**Sowing Season:** {crop['sowing_season']}")
                st.write(f"**Harvest Time:** {crop['harvest_time']}")
                st.write(f"**Water Requirement:** {crop['water_requirement']}")
            
            with col2:
                st.write(f"**Investment Required:** ₹{crop['investment']:,}")
                st.write(f"**Expected Revenue:** ₹{crop['expected_revenue']:,}")
                st.write(f"**Net Profit:** ₹{crop['net_profit']:,}")
                st.write(f"**ROI:** {crop['roi']:.1f}%")
            
            # Risk indicators
            risk_color = {"Low": "🟢", "Medium": "🟡", "High": "🔴"}
            st.write(f"**Risk Level:** {risk_color[crop['risk_level']]} {crop['risk_level']}")
            
            # Crop timeline
            st.subheader("📅 Crop Timeline")
            timeline_data = {
                'Activity': ['Land Preparation', 'Sowing', 'Irrigation', 'Fertilization', 'Pest Control', 'Harvest'],
                'Duration (days)': [7, 1, crop['growth_duration'], 3, 2, 5],
                'Cost (₹)': [5000, 2000, crop['irrigation_cost'], 3000, 2000, 3000]
            }
            timeline_df = pd.DataFrame(timeline_data)
            st.dataframe(timeline_df, use_container_width=True)

def show_financial_analysis():
    st.markdown('<h2 class="section-header">💰 Financial Analysis & ROI Estimation</h2>', unsafe_allow_html=True)
    
    if not st.session_state.crop_recommendations:
        st.warning("⚠️ Please complete Crop Planning first!")
        return
    
    farmer = st.session_state.farmer_profile
    recommendations = st.session_state.crop_recommendations
    
    # Initialize financial planner
    planner = FinancialPlanner()
    financial_analysis = planner.analyze_financials(farmer, recommendations)
    
    # Display financial metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Investment", f"₹{financial_analysis['total_investment']:,}", 
                 delta=f"₹{financial_analysis['investment_per_acre']:,}/acre")
    
    with col2:
        st.metric("Expected Revenue", f"₹{financial_analysis['total_revenue']:,}", 
                 delta=f"₹{financial_analysis['revenue_per_acre']:,}/acre")
    
    with col3:
        st.metric("Net Profit", f"₹{financial_analysis['net_profit']:,}", 
                 delta=f"{financial_analysis['profit_margin']:.1f}%")
    
    with col4:
        st.metric("ROI", f"{financial_analysis['roi']:.1f}%", 
                 delta=f"₹{financial_analysis['profit_per_acre']:,}/acre")
    
    # Cash flow visualization
    st.subheader("📊 Cash Flow Analysis")
    
    # Create cash flow chart
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    expenses = financial_analysis['monthly_expenses']
    income = financial_analysis['monthly_income']
    
    fig = go.Figure()
    fig.add_trace(go.Bar(x=months, y=expenses, name='Expenses', marker_color='red'))
    fig.add_trace(go.Bar(x=months, y=income, name='Income', marker_color='green'))
    fig.update_layout(title='Monthly Cash Flow', barmode='group')
    st.plotly_chart(fig, use_container_width=True)
    
    # Break-even analysis
    st.subheader("⚖️ Break-even Analysis")
    col1, col2 = st.columns(2)
    
    with col1:
        st.write(f"**Break-even Yield:** {financial_analysis['break_even_yield']:.2f} tons/acre")
        st.write(f"**Break-even Price:** ₹{financial_analysis['break_even_price']:,}/ton")
    
    with col2:
        st.write(f"**Safety Margin:** {financial_analysis['safety_margin']:.1f}%")
        st.write(f"**Risk-adjusted ROI:** {financial_analysis['risk_adjusted_roi']:.1f}%")

def show_risk_assessment():
    st.markdown('<h2 class="section-header">⚠️ Risk Assessment & Tolerance Analysis</h2>', unsafe_allow_html=True)
    
    if not st.session_state.crop_recommendations:
        st.warning("⚠️ Please complete Crop Planning first!")
        return
    
    farmer = st.session_state.farmer_profile
    recommendations = st.session_state.crop_recommendations
    
    # Initialize risk analyzer
    analyzer = RiskAnalyzer()
    risk_analysis = analyzer.analyze_risks(farmer, recommendations)
    st.session_state.risk_analysis = risk_analysis
    
    # Risk overview
    st.subheader("🎯 Risk Overview")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Overall Risk Level", risk_analysis['overall_risk'], 
                 delta=risk_analysis['risk_score'])
    
    with col2:
        st.metric("Economic Risk", risk_analysis['economic_risk'], 
                 delta=f"{risk_analysis['economic_risk_score']:.1f}")
    
    with col3:
        st.metric("Environmental Risk", risk_analysis['environmental_risk'], 
                 delta=f"{risk_analysis['environmental_risk_score']:.1f}")
    
    # Risk breakdown
    st.subheader("📋 Risk Breakdown")
    
    risk_categories = [
        ("🌾 Crop Disease Risk", risk_analysis['disease_risk']),
        ("🐛 Pest Infestation Risk", risk_analysis['pest_risk']),
        ("🌧️ Weather Risk", risk_analysis['weather_risk']),
        ("💰 Market Price Risk", risk_analysis['market_risk']),
        ("💧 Water Availability Risk", risk_analysis['water_risk']),
        ("🌱 Soil Fertility Risk", risk_analysis['soil_risk'])
    ]
    
    for category, risk_data in risk_categories:
        with st.expander(category):
            col1, col2 = st.columns(2)
            
            with col1:
                st.write(f"**Risk Level:** {risk_data['level']}")
                st.write(f"**Probability:** {risk_data['probability']:.1f}%")
                st.write(f"**Impact:** {risk_data['impact']}")
            
            with col2:
                st.write(f"**Mitigation Strategy:** {risk_data['mitigation']}")
                st.write(f"**Insurance Available:** {'Yes' if risk_data['insurance'] else 'No'}")
    
    # Risk tolerance analysis
    st.subheader("🎚️ Risk Tolerance Analysis")
    
    tolerance_analysis = risk_analysis['tolerance_analysis']
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write(f"**Farmer's Risk Tolerance:** {farmer.risk_tolerance}")
        st.write(f"**Recommended Risk Level:** {tolerance_analysis['recommended_risk']}")
        st.write(f"**Compatibility Score:** {tolerance_analysis['compatibility_score']:.1f}%")
    
    with col2:
        st.write(f"**Maximum Loss Tolerance:** ₹{tolerance_analysis['max_loss_tolerance']:,}")
        st.write(f"**Minimum Profit Target:** ₹{tolerance_analysis['min_profit_target']:,}")
        st.write(f"**Risk-adjusted Recommendation:** {tolerance_analysis['adjusted_recommendation']}")

def show_geospatial_analysis():
    st.markdown('<h2 class="section-header">🗺️ Geospatial Analysis</h2>', unsafe_allow_html=True)
    
    if not st.session_state.farmer_profile:
        st.warning("⚠️ Please complete the Farmer Profile first!")
        return
    
    farmer = st.session_state.farmer_profile
    
    # Create map
    st.subheader("📍 Farm Location & Surroundings")
    
    # Create a map centered on the farmer's location
    m = folium.Map(location=[farmer.latitude, farmer.longitude], zoom_start=12)
    
    # Add farmer's location
    folium.Marker(
        [farmer.latitude, farmer.longitude],
        popup=f"Farmer: {farmer.name}<br>Land: {farmer.total_acres} acres<br>Soil: {farmer.soil_type}",
        icon=folium.Icon(color='red', icon='info-sign')
    ).add_to(m)
    
    # Add irrigation sources (simulated)
    irrigation_sources = [
        {"lat": farmer.latitude + 0.01, "lng": farmer.longitude + 0.01, "type": "Well", "capacity": "5000L/day"},
        {"lat": farmer.latitude - 0.01, "lng": farmer.longitude - 0.01, "type": "Canal", "capacity": "10000L/day"},
        {"lat": farmer.latitude + 0.005, "lng": farmer.longitude - 0.005, "type": "Borewell", "capacity": "8000L/day"}
    ]
    
    for source in irrigation_sources:
        folium.Marker(
            [source["lat"], source["lng"]],
            popup=f"Irrigation: {source['type']}<br>Capacity: {source['capacity']}",
            icon=folium.Icon(color='blue', icon='tint')
        ).add_to(m)
    
    # Display the map
    folium_static(m, width=800, height=500)
    
    # Soil and climate analysis
    st.subheader("🌍 Soil & Climate Analysis")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("**Soil Analysis:**")
        soil_data = {
            "pH Level": "6.5-7.2",
            "Organic Matter": "2.1%",
            "Nitrogen": "Medium",
            "Phosphorus": "Low",
            "Potassium": "High",
            "Water Holding Capacity": "Good"
        }
        
        for key, value in soil_data.items():
            st.write(f"- {key}: {value}")
    
    with col2:
        st.write("**Climate Data:**")
        climate_data = {
            "Annual Rainfall": "1200mm",
            "Temperature Range": "15°C - 35°C",
            "Humidity": "65-80%",
            "Growing Season": "June - October",
            "Frost Risk": "Low",
            "Drought Risk": "Medium"
        }
        
        for key, value in climate_data.items():
            st.write(f"- {key}: {value}")

def show_ai_assistant():
    st.markdown('<h2 class="section-header">🤖 AI Crop Planning Assistant</h2>', unsafe_allow_html=True)
    
    # Initialize chatbot
    if 'chatbot' not in st.session_state:
        st.session_state.chatbot = CropChatbot()
    
    # Chat interface
    st.subheader("💬 Ask me anything about farming!")
    
    # Display chat history
    if 'chat_history' not in st.session_state:
        st.session_state.chat_history = []
    
    for message in st.session_state.chat_history:
        with st.chat_message(message["role"]):
            st.write(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask about crops, farming techniques, or get advice..."):
        # Add user message to chat history
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.write(prompt)
        
        # Get AI response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response = st.session_state.chatbot.get_response(prompt)
                st.write(response)
                st.session_state.chat_history.append({"role": "assistant", "content": response})

def show_sample_report():
    st.markdown('<h2 class="section-header">📋 Sample Crop Planning Report</h2>', unsafe_allow_html=True)
    
    # Sample data
    sample_data = {
        "Farmer": "Rajesh Kumar",
        "Location": "Punjab, India",
        "Land Area": "10 acres",
        "Recommended Crops": ["Wheat", "Rice", "Maize"],
        "Expected ROI": "18.5%",
        "Risk Level": "Medium"
    }
    
    st.json(sample_data)

def show_free_sms_notifications():
    st.markdown('<h2 class="section-header">📱 Free SMS Notifications</h2>', unsafe_allow_html=True)
    
    # Initialize free SMS notifier
    if 'free_sms_notifier' not in st.session_state:
        st.session_state.free_sms_notifier = FreeSMSNotifier()
    
    # Check if free SMS is configured
    if not st.session_state.free_sms_notifier.is_configured:
        st.warning("⚠️ Free SMS notifications are not configured. Please set up your email credentials.")
        
        with st.expander("🔧 Free Setup Instructions"):
            st.markdown("""
            ### How to set up FREE SMS notifications:
            
            **This method is 100% FREE - no paid services required!**
            
            1. **Use Gmail Account**: 
               - Go to your Google Account settings
               - Enable 2-factor authentication
               - Generate an "App Password" for this application
            
            2. **Create Environment File**: Create a `.env` file with:
            ```
            EMAIL_ADDRESS=your_email@gmail.com
            EMAIL_PASSWORD=your_app_password_here
            SMTP_SERVER=smtp.gmail.com
            SMTP_PORT=587
            ```
            
            3. **How it works**: 
               - Uses email-to-SMS gateways provided by mobile carriers
               - Completely free - no charges ever
               - Works with most major carriers worldwide
            
            4. **Supported Carriers**:
               - **India**: Airtel, Vodafone, Idea, BSNL, Jio, Reliance
               - **US**: Verizon, AT&T, T-Mobile, Sprint, Boost, Cricket
               - **Generic**: Works with many other carriers
            """)
        
        return
    
    st.success("✅ Free SMS notifications are configured and ready to use!")
    
    # Test connection
    if st.button("🔧 Test Email Connection"):
        with st.spinner("Testing connection..."):
            if st.session_state.free_sms_notifier.test_connection():
                st.success("✅ Email connection successful!")
            else:
                st.error("❌ Email connection failed. Check your credentials.")
    
    # Phone number and carrier input
    col1, col2 = st.columns(2)
    
    with col1:
        phone_number = st.text_input(
            "📱 Enter Phone Number:",
            placeholder="9876543210",
            help="Enter the phone number (without country code)"
        )
    
    with col2:
        carrier = st.selectbox(
            "📡 Select Carrier:",
            st.session_state.free_sms_notifier.get_available_carriers(),
            help="Select your mobile carrier"
        )
    
    if not phone_number:
        st.info("Please enter a phone number and select carrier to test free SMS notifications.")
        return
    
    # Notification types
    st.subheader("📤 Send Free SMS Notifications")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 📊 Crop Planning Report")
        if st.button("Send Crop Report", type="primary", key="sms_crop"):
            if st.session_state.farmer_profile and st.session_state.crop_recommendations:
                with st.spinner("Sending crop report via SMS..."):
                    success = st.session_state.free_sms_notifier.send_crop_report(
                        phone_number,
                        carrier,
                        st.session_state.farmer_profile,
                        st.session_state.crop_recommendations,
                        st.session_state.get('financial_analysis', {}),
                        st.session_state.get('risk_analysis', {})
                    )
                    if success:
                        st.success("✅ Crop report sent successfully via FREE SMS!")
                    else:
                        st.error("❌ Failed to send SMS. Check carrier selection and phone number.")
            else:
                st.warning("⚠️ Please complete farmer profile and crop planning first.")
        
        st.markdown("### 🌦️ Weather Alert")
        weather_alert = st.text_area("Weather alert message:", placeholder="Heavy rainfall expected...", key="sms_weather")
        if st.button("Send Weather Alert", key="sms_weather_btn"):
            if weather_alert:
                with st.spinner("Sending weather alert..."):
                    weather_data = {
                        "temperature": "28°C",
                        "humidity": "75%",
                        "rainfall": "25mm",
                        "wind_speed": "15km/h",
                        "recommendations": "Postpone irrigation activities.",
                        "precautions": "Ensure proper drainage."
                    }
                    success = st.session_state.free_sms_notifier.send_weather_alert(phone_number, carrier, weather_data)
                    if success:
                        st.success("✅ Weather alert sent successfully via FREE SMS!")
                    else:
                        st.error("❌ Failed to send weather alert.")
            else:
                st.warning("Please enter a weather alert message.")
    
    with col2:
        st.markdown("### 🚨 Emergency Alert")
        alert_type = st.selectbox("Alert Type:", ["Weather", "Pest", "Disease", "Market", "Irrigation", "Emergency"], key="sms_alert")
        alert_message = st.text_area("Alert message:", placeholder="Emergency alert details...", key="sms_alert_msg")
        if st.button("Send Alert", key="sms_alert_btn"):
            if alert_message:
                with st.spinner("Sending alert..."):
                    success = st.session_state.free_sms_notifier.send_alert(phone_number, carrier, alert_type, alert_message)
                    if success:
                        st.success("✅ Alert sent successfully via FREE SMS!")
                    else:
                        st.error("❌ Failed to send alert.")
            else:
                st.warning("Please enter an alert message.")
        
        st.markdown("### 📅 Farming Reminder")
        crop_name = st.text_input("Crop Name:", placeholder="Wheat", key="sms_crop_name")
        activity = st.text_input("Activity:", placeholder="Fertilizer application", key="sms_activity")
        due_date = st.date_input("Due Date:", key="sms_due_date")
        if st.button("Send Reminder", key="sms_reminder"):
            if crop_name and activity:
                with st.spinner("Sending reminder..."):
                    success = st.session_state.free_sms_notifier.send_reminder(
                        phone_number, carrier, crop_name, activity, due_date.strftime("%d %B %Y")
                    )
                    if success:
                        st.success("✅ Reminder sent successfully via FREE SMS!")
                    else:
                        st.error("❌ Failed to send reminder.")
            else:
                st.warning("Please fill in all reminder fields.")
    
    # Market updates
    st.subheader("📈 Market Updates")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        crop_name = st.text_input("Crop Name:", key="sms_market_crop", placeholder="Wheat")
    with col2:
        current_price = st.number_input("Current Price (₹/ton):", min_value=0.0, value=2000.0, key="sms_price")
    with col3:
        price_change = st.number_input("Price Change (%):", value=5.0, step=0.1, key="sms_change")
    
    if st.button("Send Market Update", key="sms_market"):
        if crop_name:
            with st.spinner("Sending market update..."):
                success = st.session_state.free_sms_notifier.send_market_update(
                    phone_number, carrier, crop_name, current_price, price_change
                )
                if success:
                    st.success("✅ Market update sent successfully via FREE SMS!")
                else:
                    st.error("❌ Failed to send market update.")
        else:
            st.warning("Please enter a crop name.")
    
    # Information about free SMS
    st.subheader("ℹ️ About Free SMS")
    st.info("""
    **This SMS service is 100% FREE!** 
    
    - ✅ No monthly fees
    - ✅ No per-message charges  
    - ✅ No credit card required
    - ✅ Works with most carriers worldwide
    - ✅ Uses email-to-SMS gateways provided by carriers
    
    **How it works**: Your email account sends messages to special email addresses that carriers convert to SMS.
    """)

if __name__ == "__main__":
    main()
