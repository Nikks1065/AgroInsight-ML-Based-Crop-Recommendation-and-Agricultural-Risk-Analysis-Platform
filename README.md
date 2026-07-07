# 🌾 Smart Crop Planning & Risk Mapping Assistant

An India-focused Agricultural Decision Support System that helps farmers make informed decisions about crop planning, risk assessment, and financial management.

## 🚀 Features

### 👨‍🌾 Farmer Profile & Budgeting
- Collect comprehensive farmer details (income, savings, budget)
- Build financial profiles and risk tolerance assessment
- Calculate investment capacity and financial health

### 🌱 Crop Recommendation & Planning
- AI-powered crop recommendations based on location, soil, and climate
- Intercropping and succession planning strategies
- Visual crop timelines and field layouts
- Sowing and harvest calendar optimization

### 💰 Financial Analysis & ROI Estimation
- Detailed cost-benefit analysis
- Cash flow projections and break-even analysis
- Risk-adjusted ROI calculations
- Financing recommendations and loan suggestions

### ⚠️ Risk Assessment & Tolerance Analysis
- Multi-dimensional risk analysis (disease, pest, weather, market)
- Risk tolerance compatibility assessment
- Mitigation strategies and insurance recommendations
- Color-coded risk visualization (🟢 Low, 🟡 Medium, 🔴 High)

### 🗺️ Geospatial Analysis
- Interactive maps showing farm location and irrigation sources
- Soil and climate analysis based on location
- Water availability and quality assessment

### 🤖 AI Assistant
- Intelligent chatbot for farming queries
- Local language support for Indian farmers
- Real-time advice on crop management, pest control, and best practices

### 📱 Free SMS Notifications
- Send crop planning reports directly to farmers' phones via SMS
- Weather alerts and emergency notifications
- Farming activity reminders and market updates
- Daily summaries and progress tracking
- **100% FREE** - uses email-to-SMS gateways

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CropPlanning
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   streamlit run app.py
   ```

## 📋 Usage

1. **Start the Application**
   - Run `streamlit run app.py`
   - Open your browser to the provided URL

2. **Complete Farmer Profile**
   - Navigate to "👨‍🌾 Farmer Profile"
   - Fill in personal, financial, and land information
   - Save your profile

3. **Get Crop Recommendations**
   - Go to "🌱 Crop Planning"
   - View AI-generated crop recommendations
   - Analyze timelines and financial projections

4. **Financial Analysis**
   - Visit "💰 Financial Analysis"
   - Review ROI estimates and cash flow projections
   - Check break-even analysis and financing options

5. **Risk Assessment**
   - Navigate to "⚠️ Risk Assessment"
   - Review comprehensive risk analysis
   - Get mitigation strategies

6. **Geospatial Analysis**
   - Check "🗺️ Geospatial Analysis"
   - View interactive maps and location-based insights

7. **AI Assistant**
   - Use "🤖 AI Assistant" for farming queries
   - Get real-time advice and tips

8. **Free SMS Notifications**
   - Go to "📱 Free SMS Notifications"
   - Set up Gmail app password (see FREE_SMS_SETUP.md)
   - Send reports, alerts, and reminders via FREE SMS

## 🏗️ Project Structure

```
CropPlanning/
├── app.py                 # Main Streamlit application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── modules/              # Core modules
│   ├── __init__.py
│   ├── farmer_profile.py     # Farmer profile management
│   ├── crop_recommendation.py # Crop recommendation engine
│   ├── risk_analysis.py      # Risk assessment system
│   ├── financial_planner.py  # Financial analysis
│   ├── chatbot.py           # AI assistant
│   └── free_sms_notifier.py  # Free SMS notifications
└── venv/                 # Virtual environment
```

## 🧠 Core Modules

### FarmerProfile
- Manages farmer personal, financial, and land information
- Calculates financial metrics and risk capacity
- Provides location-based insights

### CropRecommender
- AI-powered crop recommendation engine
- Considers soil, climate, water availability, and market conditions
- Provides detailed crop timelines and financial projections

### RiskAnalyzer
- Comprehensive risk assessment across multiple dimensions
- Disease, pest, weather, market, water, and soil risk analysis
- Risk tolerance compatibility assessment

### FinancialPlanner
- Detailed financial analysis and cash flow projections
- Break-even analysis and sensitivity testing
- Financing recommendations and loan suggestions

### CropChatbot
- Intelligent farming assistant
- Knowledge base with crop-specific information
- Real-time advice and emergency guidance

### FreeSMSNotifier
- Free SMS notification system using email-to-SMS gateways
- Supports major carriers worldwide
- No monthly fees or per-message charges

## 🎯 Key Features

### Smart Recommendations
- Location-based crop suggestions
- Soil and climate compatibility analysis
- Market timing and price considerations
- Risk-adjusted recommendations

### Financial Planning
- Investment capacity assessment
- ROI projections and sensitivity analysis
- Cash flow management
- Financing and loan recommendations

### Risk Management
- Multi-dimensional risk assessment
- Mitigation strategy recommendations
- Insurance guidance
- Emergency response protocols

### User Experience
- Intuitive Streamlit interface
- Interactive visualizations
- Mobile-responsive design
- Local language support

## 🌍 India-Focused Features

- **Regional Crop Database**: Comprehensive database of Indian crops
- **Government Schemes**: Integration with PMFBY, PMKSY, and other schemes
- **Local Market Data**: Regional price variations and market timing
- **Soil Types**: Indian soil classification and recommendations
- **Climate Zones**: Tropical, subtropical, and temperate zone considerations

## 🔧 Configuration

The application can be customized by modifying:

- `modules/crop_recommendation.py`: Add new crops or modify recommendations
- `modules/risk_analysis.py`: Adjust risk factors and weights
- `modules/financial_planner.py`: Update cost structures and financial models
- `modules/chatbot.py`: Expand knowledge base and responses

## 📊 Data Sources

- **Crop Data**: Agricultural research and extension data
- **Market Prices**: Government and market data
- **Soil Information**: Soil survey data
- **Climate Data**: Meteorological department data
- **Government Schemes**: Official government portals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Indian Council of Agricultural Research (ICAR)
- Agricultural extension services
- Government agricultural schemes
- Local farming communities

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Weather Integration**: Real-time weather data integration
- **Satellite Imagery**: Remote sensing for crop monitoring
- **Mobile App**: Native mobile application
- **Machine Learning**: Advanced ML models for predictions
- **IoT Integration**: Sensor data integration
- **Blockchain**: Supply chain transparency
- **Multi-language**: Support for regional languages

---

**Built with ❤️ for Indian Farmers**
