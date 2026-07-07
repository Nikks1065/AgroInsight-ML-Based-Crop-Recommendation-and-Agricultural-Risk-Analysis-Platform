from typing import Dict, List, Any
import random
from datetime import datetime, timedelta

class CropRecommender:
    """Crop recommendation system based on farmer profile and location."""
    
    def __init__(self):
        self.crop_database = self._initialize_crop_database()
    
    def _initialize_crop_database(self) -> Dict[str, Dict[str, Any]]:
        """Initialize crop database with Indian crops."""
        return {
            "wheat": {
                "name": "Wheat",
                "category": "Cereal",
                "duration": "Rabi",
                "growth_duration": 120,
                "water_requirement": "Medium",
                "soil_preference": ["Loamy", "Clay"],
                "climate_zones": ["Temperate", "Subtropical"],
                "regions": ["North-West", "North"],
                "base_yield": 3.5,  # tons/acre
                "base_price": 2200,  # ₹/ton
                "base_investment": 25000,  # ₹/acre
                "sowing_season": "October-November",
                "harvest_time": "March-April",
                "risk_level": "Low",
                "disease_risk": "Medium",
                "pest_risk": "Low"
            },
            "rice": {
                "name": "Rice",
                "category": "Cereal",
                "duration": "Kharif",
                "growth_duration": 150,
                "water_requirement": "High",
                "soil_preference": ["Clay", "Alluvial"],
                "climate_zones": ["Tropical", "Subtropical"],
                "regions": ["North", "South", "West"],
                "base_yield": 4.0,
                "base_price": 1800,
                "base_investment": 30000,
                "sowing_season": "June-July",
                "harvest_time": "October-November",
                "risk_level": "Medium",
                "disease_risk": "High",
                "pest_risk": "Medium"
            },
            "maize": {
                "name": "Maize",
                "category": "Cereal",
                "duration": "Kharif/Rabi",
                "growth_duration": 100,
                "water_requirement": "Medium",
                "soil_preference": ["Loamy", "Sandy"],
                "climate_zones": ["Tropical", "Subtropical"],
                "regions": ["North-West", "West", "South"],
                "base_yield": 3.0,
                "base_price": 1600,
                "base_investment": 20000,
                "sowing_season": "June-July / January-February",
                "harvest_time": "September-October / April-May",
                "risk_level": "Medium",
                "disease_risk": "Medium",
                "pest_risk": "Medium"
            },
            "cotton": {
                "name": "Cotton",
                "category": "Fiber",
                "duration": "Kharif",
                "growth_duration": 180,
                "water_requirement": "Medium",
                "soil_preference": ["Black Soil", "Red Soil"],
                "climate_zones": ["Tropical", "Subtropical"],
                "regions": ["West", "South"],
                "base_yield": 1.5,  # bales/acre
                "base_price": 6000,  # ₹/bale
                "base_investment": 35000,
                "sowing_season": "May-June",
                "harvest_time": "October-December",
                "risk_level": "High",
                "disease_risk": "High",
                "pest_risk": "High"
            },
            "sugarcane": {
                "name": "Sugarcane",
                "category": "Cash Crop",
                "duration": "Annual",
                "growth_duration": 365,
                "water_requirement": "High",
                "soil_preference": ["Alluvial", "Clay"],
                "climate_zones": ["Tropical", "Subtropical"],
                "regions": ["North", "West", "South"],
                "base_yield": 80,  # tons/acre
                "base_price": 300,  # ₹/ton
                "base_investment": 50000,
                "sowing_season": "February-March",
                "harvest_time": "November-March",
                "risk_level": "Medium",
                "disease_risk": "Medium",
                "pest_risk": "Low"
            },
            "pulses": {
                "name": "Pulses (Chickpea)",
                "category": "Pulse",
                "duration": "Rabi",
                "growth_duration": 120,
                "water_requirement": "Low",
                "soil_preference": ["Loamy", "Sandy"],
                "climate_zones": ["Temperate", "Subtropical"],
                "regions": ["North-West", "North", "West"],
                "base_yield": 1.2,
                "base_price": 4500,
                "base_investment": 15000,
                "sowing_season": "October-November",
                "harvest_time": "March-April",
                "risk_level": "Low",
                "disease_risk": "Low",
                "pest_risk": "Low"
            },
            "vegetables": {
                "name": "Mixed Vegetables",
                "category": "Horticulture",
                "duration": "Short-term",
                "growth_duration": 60,
                "water_requirement": "High",
                "soil_preference": ["Loamy", "Alluvial"],
                "climate_zones": ["Tropical", "Subtropical"],
                "regions": ["All"],
                "base_yield": 8.0,  # tons/acre
                "base_price": 8000,  # ₹/ton
                "base_investment": 40000,
                "sowing_season": "Year-round",
                "harvest_time": "60-90 days",
                "risk_level": "Medium",
                "disease_risk": "High",
                "pest_risk": "High"
            }
        }
    
    def get_recommendations(self, farmer_profile) -> Dict[str, Any]:
        """Get crop recommendations based on farmer profile."""
        suitable_crops = self._filter_suitable_crops(farmer_profile)
        recommended_crops = self._rank_crops(suitable_crops, farmer_profile)
        
        return {
            "crops": recommended_crops,
            "total_recommendations": len(recommended_crops),
            "risk_profile": self._calculate_overall_risk(recommended_crops),
            "investment_summary": self._calculate_investment_summary(recommended_crops, farmer_profile)
        }
    
    def _filter_suitable_crops(self, farmer_profile) -> List[Dict[str, Any]]:
        """Filter crops suitable for the farmer's conditions."""
        suitable_crops = []
        
        for crop_key, crop_data in self.crop_database.items():
            # Check soil compatibility
            if farmer_profile.soil_type in crop_data["soil_preference"]:
                # Check climate zone compatibility
                if farmer_profile.get_location_profile()["climate_zone"] in crop_data["climate_zones"]:
                    # Check region compatibility
                    if (crop_data["regions"] == ["All"] or 
                        farmer_profile.get_location_profile()["region"] in crop_data["regions"]):
                        
                        # Check water availability
                        if self._check_water_compatibility(crop_data, farmer_profile):
                            suitable_crops.append({
                                "key": crop_key,
                                **crop_data
                            })
        
        return suitable_crops
    
    def _check_water_compatibility(self, crop_data, farmer_profile) -> bool:
        """Check if water requirements are compatible with farmer's irrigation."""
        if crop_data["water_requirement"] == "Low":
            return True
        elif crop_data["water_requirement"] == "Medium":
            return farmer_profile.irrigated_acres > 0
        else:  # High water requirement
            return farmer_profile.irrigated_acres >= farmer_profile.total_acres * 0.5
    
    def _rank_crops(self, suitable_crops, farmer_profile) -> List[Dict[str, Any]]:
        """Rank crops based on farmer's profile and preferences."""
        ranked_crops = []
        
        for crop in suitable_crops:
            # Calculate adjusted metrics
            adjusted_yield = self._adjust_yield(crop, farmer_profile)
            adjusted_price = self._adjust_price(crop, farmer_profile)
            adjusted_investment = self._adjust_investment(crop, farmer_profile)
            
            # Calculate financial metrics
            expected_revenue = adjusted_yield * adjusted_price
            net_profit = expected_revenue - adjusted_investment
            roi = (net_profit / adjusted_investment) * 100 if adjusted_investment > 0 else 0
            
            # Calculate risk-adjusted score
            risk_score = self._calculate_risk_score(crop, farmer_profile)
            
            ranked_crops.append({
                "name": crop["name"],
                "category": crop["category"],
                "expected_yield": f"{adjusted_yield:.2f}",
                "sowing_season": crop["sowing_season"],
                "harvest_time": crop["harvest_time"],
                "water_requirement": crop["water_requirement"],
                "growth_duration": crop["growth_duration"],
                "investment": adjusted_investment,
                "expected_revenue": expected_revenue,
                "net_profit": net_profit,
                "roi": roi,
                "risk_level": crop["risk_level"],
                "irrigation_cost": self._calculate_irrigation_cost(crop, farmer_profile),
                "risk_score": risk_score
            })
        
        # Sort by risk-adjusted ROI
        ranked_crops.sort(key=lambda x: x["roi"] * (1 - x["risk_score"]), reverse=True)
        
        # Limit to top 5 recommendations
        return ranked_crops[:5]
    
    def _adjust_yield(self, crop, farmer_profile) -> float:
        """Adjust yield based on farmer's conditions."""
        base_yield = crop["base_yield"]
        
        # Adjust for soil type
        soil_multipliers = {
            "Clay": 1.0,
            "Sandy": 0.8,
            "Loamy": 1.1,
            "Red Soil": 0.9,
            "Black Soil": 1.0,
            "Alluvial": 1.2
        }
        soil_multiplier = soil_multipliers.get(farmer_profile.soil_type, 1.0)
        
        # Adjust for experience
        experience_multiplier = min(1.2, 1.0 + (farmer_profile.experience_years * 0.01))
        
        # Adjust for irrigation
        irrigation_coverage = farmer_profile.irrigated_acres / farmer_profile.total_acres
        irrigation_multiplier = 0.8 + (irrigation_coverage * 0.4)
        
        return base_yield * soil_multiplier * experience_multiplier * irrigation_multiplier
    
    def _adjust_price(self, crop, farmer_profile) -> float:
        """Adjust price based on market conditions and location."""
        base_price = crop["base_price"]
        
        # Regional price variations
        regional_multipliers = {
            "North-West": 1.1,
            "North": 1.0,
            "West": 0.95,
            "South": 0.9
        }
        regional_multiplier = regional_multipliers.get(
            farmer_profile.get_location_profile()["region"], 1.0
        )
        
        # Seasonal adjustments (simplified)
        current_month = datetime.now().month
        if crop["duration"] == "Kharif" and current_month in [6, 7, 8, 9]:
            seasonal_multiplier = 1.1
        elif crop["duration"] == "Rabi" and current_month in [10, 11, 12, 1, 2]:
            seasonal_multiplier = 1.1
        else:
            seasonal_multiplier = 1.0
        
        return base_price * regional_multiplier * seasonal_multiplier
    
    def _adjust_investment(self, crop, farmer_profile) -> float:
        """Adjust investment based on farmer's conditions."""
        base_investment = crop["base_investment"]
        
        # Adjust for scale
        scale_multiplier = 1.0 if farmer_profile.total_acres <= 5 else 0.9
        
        # Adjust for irrigation type
        irrigation_multipliers = {
            "Well": 1.1,
            "Canal": 0.9,
            "Borewell": 1.0,
            "Rainfed": 0.8,
            "Mixed": 1.0
        }
        irrigation_multiplier = irrigation_multipliers.get(farmer_profile.irrigation_type, 1.0)
        
        return base_investment * scale_multiplier * irrigation_multiplier
    
    def _calculate_irrigation_cost(self, crop, farmer_profile) -> float:
        """Calculate irrigation cost for the crop."""
        base_irrigation_cost = {
            "Low": 5000,
            "Medium": 10000,
            "High": 15000
        }
        
        base_cost = base_irrigation_cost.get(crop["water_requirement"], 10000)
        
        # Adjust based on irrigation type
        if farmer_profile.irrigation_type == "Canal":
            return base_cost * 0.5
        elif farmer_profile.irrigation_type == "Well":
            return base_cost * 0.8
        else:
            return base_cost
    
    def _calculate_risk_score(self, crop, farmer_profile) -> float:
        """Calculate risk score for the crop."""
        base_risk = {"Low": 0.2, "Medium": 0.5, "High": 0.8}
        risk_score = base_risk.get(crop["risk_level"], 0.5)
        
        # Adjust based on farmer's risk tolerance
        if farmer_profile.risk_tolerance == "Low":
            risk_score *= 1.2
        elif farmer_profile.risk_tolerance == "High":
            risk_score *= 0.8
        
        # Adjust based on experience
        if farmer_profile.experience_years > 10:
            risk_score *= 0.9
        
        return min(1.0, risk_score)
    
    def _calculate_overall_risk(self, crops) -> Dict[str, Any]:
        """Calculate overall risk profile for recommendations."""
        if not crops:
            return {"level": "Unknown", "score": 0}
        
        avg_risk_score = sum(crop["risk_score"] for crop in crops) / len(crops)
        
        if avg_risk_score < 0.3:
            risk_level = "Low"
        elif avg_risk_score < 0.6:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "level": risk_level,
            "score": avg_risk_score,
            "distribution": {
                "Low": len([c for c in crops if c["risk_level"] == "Low"]),
                "Medium": len([c for c in crops if c["risk_level"] == "Medium"]),
                "High": len([c for c in crops if c["risk_level"] == "High"])
            }
        }
    
    def _calculate_investment_summary(self, crops, farmer_profile) -> Dict[str, Any]:
        """Calculate investment summary for all recommendations."""
        if not crops:
            return {"total_investment": 0, "affordable_crops": 0}
        
        total_investment = sum(crop["investment"] for crop in crops)
        affordable_crops = len([c for c in crops if c["investment"] <= farmer_profile.investment_capacity])
        
        return {
            "total_investment": total_investment,
            "affordable_crops": affordable_crops,
            "investment_per_acre": total_investment / farmer_profile.total_acres,
            "utilization_rate": (total_investment / farmer_profile.investment_capacity) * 100
        }
