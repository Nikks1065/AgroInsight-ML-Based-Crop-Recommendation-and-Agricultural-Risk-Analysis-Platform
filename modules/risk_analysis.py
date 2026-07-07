from typing import Dict, List, Any
import random
from datetime import datetime, timedelta

class RiskAnalyzer:
    """Risk analysis system for crop planning and farming decisions."""
    
    def __init__(self):
        self.risk_factors = self._initialize_risk_factors()
    
    def _initialize_risk_factors(self) -> Dict[str, Dict[str, Any]]:
        """Initialize risk factors database."""
        return {
            "disease": {
                "wheat": {"probability": 0.3, "impact": "Medium", "mitigation": "Fungicide application"},
                "rice": {"probability": 0.4, "impact": "High", "mitigation": "Resistant varieties"},
                "maize": {"probability": 0.25, "impact": "Medium", "mitigation": "Crop rotation"},
                "cotton": {"probability": 0.5, "impact": "High", "mitigation": "IPM practices"},
                "sugarcane": {"probability": 0.2, "impact": "Medium", "mitigation": "Healthy seed"},
                "pulses": {"probability": 0.15, "impact": "Low", "mitigation": "Seed treatment"},
                "vegetables": {"probability": 0.6, "impact": "High", "mitigation": "Greenhouse"}
            },
            "pest": {
                "wheat": {"probability": 0.2, "impact": "Low", "mitigation": "Natural predators"},
                "rice": {"probability": 0.35, "impact": "Medium", "mitigation": "Pest-resistant varieties"},
                "maize": {"probability": 0.3, "impact": "Medium", "mitigation": "Biological control"},
                "cotton": {"probability": 0.6, "impact": "High", "mitigation": "IPM strategies"},
                "sugarcane": {"probability": 0.15, "impact": "Low", "mitigation": "Clean cultivation"},
                "pulses": {"probability": 0.25, "impact": "Medium", "mitigation": "Crop rotation"},
                "vegetables": {"probability": 0.7, "impact": "High", "mitigation": "Integrated pest management"}
            },
            "weather": {
                "drought": {"probability": 0.25, "impact": "High", "mitigation": "Irrigation backup"},
                "flood": {"probability": 0.15, "impact": "High", "mitigation": "Drainage systems"},
                "hailstorm": {"probability": 0.1, "impact": "Medium", "mitigation": "Crop insurance"},
                "frost": {"probability": 0.2, "impact": "Medium", "mitigation": "Frost protection"}
            },
            "market": {
                "price_volatility": {"probability": 0.4, "impact": "Medium", "mitigation": "Forward contracts"},
                "demand_fluctuation": {"probability": 0.3, "impact": "Medium", "mitigation": "Market diversification"},
                "supply_chain": {"probability": 0.2, "impact": "Low", "mitigation": "Local markets"}
            },
            "water": {
                "shortage": {"probability": 0.3, "impact": "High", "mitigation": "Water conservation"},
                "quality": {"probability": 0.15, "impact": "Medium", "mitigation": "Water testing"},
                "access": {"probability": 0.2, "impact": "Medium", "mitigation": "Multiple sources"}
            },
            "soil": {
                "fertility_decline": {"probability": 0.25, "impact": "Medium", "mitigation": "Soil testing"},
                "erosion": {"probability": 0.2, "impact": "Medium", "mitigation": "Contour farming"},
                "salinity": {"probability": 0.15, "impact": "High", "mitigation": "Soil reclamation"}
            }
        }
    
    def analyze_risks(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Comprehensive risk analysis for the farming plan."""
        
        # Analyze individual risk categories
        disease_risk = self._analyze_disease_risk(farmer_profile, crop_recommendations)
        pest_risk = self._analyze_pest_risk(farmer_profile, crop_recommendations)
        weather_risk = self._analyze_weather_risk(farmer_profile)
        market_risk = self._analyze_market_risk(farmer_profile, crop_recommendations)
        water_risk = self._analyze_water_risk(farmer_profile)
        soil_risk = self._analyze_soil_risk(farmer_profile)
        
        # Calculate overall risk metrics
        overall_risk = self._calculate_overall_risk([
            disease_risk, pest_risk, weather_risk, market_risk, water_risk, soil_risk
        ])
        
        # Economic risk analysis
        economic_risk = self._analyze_economic_risk(farmer_profile, crop_recommendations)
        
        # Environmental risk analysis
        environmental_risk = self._analyze_environmental_risk(farmer_profile, crop_recommendations)
        
        # Risk tolerance analysis
        tolerance_analysis = self._analyze_risk_tolerance(farmer_profile, overall_risk)
        
        return {
            "overall_risk": overall_risk["level"],
            "risk_score": overall_risk["score"],
            "disease_risk": disease_risk,
            "pest_risk": pest_risk,
            "weather_risk": weather_risk,
            "market_risk": market_risk,
            "water_risk": water_risk,
            "soil_risk": soil_risk,
            "economic_risk": economic_risk["level"],
            "economic_risk_score": economic_risk["score"],
            "environmental_risk": environmental_risk["level"],
            "environmental_risk_score": environmental_risk["score"],
            "tolerance_analysis": tolerance_analysis,
            "risk_mitigation_strategies": self._generate_mitigation_strategies([
                disease_risk, pest_risk, weather_risk, market_risk, water_risk, soil_risk
            ])
        }
    
    def _analyze_disease_risk(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Analyze disease risk for recommended crops."""
        if not crop_recommendations.get('crops'):
            return {"level": "Unknown", "probability": 0, "impact": "Unknown", "mitigation": "N/A", "insurance": False}
        
        total_risk = 0
        crop_count = len(crop_recommendations['crops'])
        
        for crop in crop_recommendations['crops']:
            crop_key = crop['name'].lower().split()[0]  # Get first word of crop name
            if crop_key in self.risk_factors["disease"]:
                risk_data = self.risk_factors["disease"][crop_key]
                total_risk += risk_data["probability"]
        
        avg_risk = total_risk / crop_count if crop_count > 0 else 0
        
        # Determine risk level
        if avg_risk < 0.2:
            risk_level = "Low"
        elif avg_risk < 0.4:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "probability": avg_risk * 100,
            "impact": "Medium" if avg_risk > 0.3 else "Low",
            "mitigation": "Regular monitoring and preventive measures",
            "insurance": True
        }
    
    def _analyze_pest_risk(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Analyze pest risk for recommended crops."""
        if not crop_recommendations.get('crops'):
            return {"level": "Unknown", "probability": 0, "impact": "Unknown", "mitigation": "N/A", "insurance": False}
        
        total_risk = 0
        crop_count = len(crop_recommendations['crops'])
        
        for crop in crop_recommendations['crops']:
            crop_key = crop['name'].lower().split()[0]
            if crop_key in self.risk_factors["pest"]:
                risk_data = self.risk_factors["pest"][crop_key]
                total_risk += risk_data["probability"]
        
        avg_risk = total_risk / crop_count if crop_count > 0 else 0
        
        if avg_risk < 0.25:
            risk_level = "Low"
        elif avg_risk < 0.45:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "probability": avg_risk * 100,
            "impact": "Medium" if avg_risk > 0.35 else "Low",
            "mitigation": "Integrated Pest Management (IPM)",
            "insurance": True
        }
    
    def _analyze_weather_risk(self, farmer_profile) -> Dict[str, Any]:
        """Analyze weather-related risks based on location and season."""
        location_profile = farmer_profile.get_location_profile()
        
        # Base weather risk based on region
        regional_weather_risk = {
            "North-West": 0.3,  # Punjab, Haryana - moderate weather risk
            "North": 0.4,       # UP - higher weather variability
            "West": 0.35,       # Maharashtra - monsoon dependent
            "South": 0.25       # Karnataka, TN - more stable weather
        }
        
        base_risk = regional_weather_risk.get(location_profile["region"], 0.3)
        
        # Adjust for irrigation coverage
        irrigation_coverage = farmer_profile.irrigated_acres / farmer_profile.total_acres
        if irrigation_coverage > 0.8:
            base_risk *= 0.7
        elif irrigation_coverage > 0.5:
            base_risk *= 0.85
        
        if base_risk < 0.25:
            risk_level = "Low"
        elif base_risk < 0.4:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "probability": base_risk * 100,
            "impact": "High" if base_risk > 0.35 else "Medium",
            "mitigation": "Weather monitoring and contingency planning",
            "insurance": True
        }
    
    def _analyze_market_risk(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Analyze market-related risks."""
        # Base market risk
        base_risk = 0.35
        
        # Adjust based on crop diversity
        if crop_recommendations.get('crops'):
            crop_diversity = len(set(crop['category'] for crop in crop_recommendations['crops']))
            if crop_diversity > 3:
                base_risk *= 0.8  # More diversity reduces market risk
            elif crop_diversity == 1:
                base_risk *= 1.2  # Single crop category increases risk
        
        # Adjust based on farmer's financial position
        if farmer_profile.debt_to_income_ratio > 0.5:
            base_risk *= 1.3  # High debt increases market risk
        
        if base_risk < 0.3:
            risk_level = "Low"
        elif base_risk < 0.5:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "probability": base_risk * 100,
            "impact": "Medium",
            "mitigation": "Market diversification and forward contracts",
            "insurance": False
        }
    
    def _analyze_water_risk(self, farmer_profile) -> Dict[str, Any]:
        """Analyze water availability and quality risks."""
        irrigation_coverage = farmer_profile.irrigated_acres / farmer_profile.total_acres
        
        # Base water risk
        if irrigation_coverage < 0.3:
            base_risk = 0.6
        elif irrigation_coverage < 0.6:
            base_risk = 0.4
        else:
            base_risk = 0.25
        
        # Adjust based on irrigation type
        irrigation_type_risk = {
            "Well": 0.3,
            "Canal": 0.2,
            "Borewell": 0.4,
            "Rainfed": 0.7,
            "Mixed": 0.25
        }
        
        type_risk = irrigation_type_risk.get(farmer_profile.irrigation_type, 0.4)
        base_risk = (base_risk + type_risk) / 2
        
        if base_risk < 0.3:
            risk_level = "Low"
        elif base_risk < 0.5:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "probability": base_risk * 100,
            "impact": "High" if base_risk > 0.4 else "Medium",
            "mitigation": "Water conservation and multiple sources",
            "insurance": False
        }
    
    def _analyze_soil_risk(self, farmer_profile) -> Dict[str, Any]:
        """Analyze soil-related risks."""
        # Base soil risk based on soil type
        soil_risk_factors = {
            "Clay": 0.3,
            "Sandy": 0.4,
            "Loamy": 0.2,
            "Red Soil": 0.35,
            "Black Soil": 0.25,
            "Alluvial": 0.2
        }
        
        base_risk = soil_risk_factors.get(farmer_profile.soil_type, 0.3)
        
        # Adjust based on experience (more experience = better soil management)
        if farmer_profile.experience_years > 15:
            base_risk *= 0.8
        elif farmer_profile.experience_years < 5:
            base_risk *= 1.2
        
        if base_risk < 0.25:
            risk_level = "Low"
        elif base_risk < 0.4:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "probability": base_risk * 100,
            "impact": "Medium",
            "mitigation": "Soil testing and organic matter management",
            "insurance": False
        }
    
    def _calculate_overall_risk(self, risk_categories) -> Dict[str, Any]:
        """Calculate overall risk from all categories."""
        if not risk_categories:
            return {"level": "Unknown", "score": 0}
        
        # Weight different risk categories
        weights = {
            "disease": 0.2,
            "pest": 0.15,
            "weather": 0.25,
            "market": 0.2,
            "water": 0.15,
            "soil": 0.05
        }
        
        total_weighted_risk = 0
        total_weight = 0
        
        for i, risk in enumerate(risk_categories):
            weight = list(weights.values())[i] if i < len(weights) else 0.1
            risk_score = risk["probability"] / 100  # Convert percentage to decimal
            total_weighted_risk += risk_score * weight
            total_weight += weight
        
        overall_risk_score = total_weighted_risk / total_weight if total_weight > 0 else 0
        
        if overall_risk_score < 0.3:
            risk_level = "Low"
        elif overall_risk_score < 0.5:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "score": overall_risk_score
        }
    
    def _analyze_economic_risk(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Analyze economic risks based on financial profile."""
        # Calculate economic risk factors
        debt_risk = min(1.0, farmer_profile.debt_to_income_ratio * 2)
        investment_risk = 1.0 - (farmer_profile.investment_capacity / farmer_profile.annual_income)
        cash_flow_risk = 1.0 - (farmer_profile.savings / farmer_profile.annual_income)
        
        # Weighted economic risk
        economic_risk_score = (debt_risk * 0.4 + investment_risk * 0.3 + cash_flow_risk * 0.3)
        
        if economic_risk_score < 0.3:
            risk_level = "Low"
        elif economic_risk_score < 0.6:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "score": economic_risk_score
        }
    
    def _analyze_environmental_risk(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Analyze environmental risks."""
        # Combine weather, water, and soil risks
        weather_risk = self._analyze_weather_risk(farmer_profile)
        water_risk = self._analyze_water_risk(farmer_profile)
        soil_risk = self._analyze_soil_risk(farmer_profile)
        
        environmental_risk_score = (
            weather_risk["probability"] * 0.4 +
            water_risk["probability"] * 0.4 +
            soil_risk["probability"] * 0.2
        ) / 100
        
        if environmental_risk_score < 0.3:
            risk_level = "Low"
        elif environmental_risk_score < 0.5:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "score": environmental_risk_score
        }
    
    def _analyze_risk_tolerance(self, farmer_profile, overall_risk) -> Dict[str, Any]:
        """Analyze compatibility between farmer's risk tolerance and overall risk."""
        risk_tolerance_scores = {"Low": 0.3, "Medium": 0.5, "High": 0.7}
        farmer_tolerance = risk_tolerance_scores.get(farmer_profile.risk_tolerance, 0.5)
        
        # Calculate compatibility
        risk_gap = abs(overall_risk["score"] - farmer_tolerance)
        compatibility_score = max(0, 100 - (risk_gap * 100))
        
        # Determine recommended risk level
        if overall_risk["score"] > farmer_tolerance + 0.2:
            recommended_risk = "Lower risk crops recommended"
        elif overall_risk["score"] < farmer_tolerance - 0.2:
            recommended_risk = "Higher return crops possible"
        else:
            recommended_risk = "Current plan suitable"
        
        # Calculate financial tolerance
        max_loss_tolerance = farmer_profile.savings * 0.3
        min_profit_target = farmer_profile.annual_income * 0.1
        
        return {
            "recommended_risk": recommended_risk,
            "compatibility_score": compatibility_score,
            "max_loss_tolerance": max_loss_tolerance,
            "min_profit_target": min_profit_target,
            "adjusted_recommendation": self._get_adjusted_recommendation(overall_risk["score"], farmer_tolerance)
        }
    
    def _get_adjusted_recommendation(self, actual_risk, tolerance) -> str:
        """Get adjusted recommendation based on risk tolerance."""
        if actual_risk > tolerance + 0.2:
            return "Consider lower-risk crops or insurance"
        elif actual_risk < tolerance - 0.2:
            return "Can consider higher-return, higher-risk options"
        else:
            return "Current plan aligns with risk tolerance"
    
    def _generate_mitigation_strategies(self, risk_categories) -> List[str]:
        """Generate mitigation strategies for identified risks."""
        strategies = []
        
        for risk in risk_categories:
            if risk["level"] in ["Medium", "High"]:
                strategies.append(f"{risk['mitigation']} for {risk['level']} risk")
        
        # Add general strategies
        strategies.extend([
            "Regular monitoring and early warning systems",
            "Crop insurance for high-risk scenarios",
            "Diversification of crops and income sources",
            "Building financial reserves for emergencies"
        ])
        
        return list(set(strategies))  # Remove duplicates
