from dataclasses import dataclass
from typing import Dict, Any
import json

@dataclass
class FarmerProfile:
    """Farmer profile with personal, financial, and land information."""
    
    # Personal Information
    name: str
    age: int
    experience_years: int
    family_size: int
    education: str
    
    # Financial Information
    annual_income: float
    savings: float
    land_value: float
    bank_loan: float
    risk_tolerance: str  # Low, Medium, High
    investment_capacity: float
    
    # Land Information
    total_acres: float
    irrigated_acres: float
    soil_type: str
    irrigation_type: str
    
    # Location Information
    state: str
    district: str
    latitude: float
    longitude: float
    
    def __post_init__(self):
        """Calculate derived financial metrics."""
        self.total_assets = self.savings + (self.total_acres * self.land_value)
        self.net_worth = self.total_assets - self.bank_loan
        self.debt_to_income_ratio = self.bank_loan / self.annual_income if self.annual_income > 0 else 0
        self.investment_ratio = self.investment_capacity / self.annual_income if self.annual_income > 0 else 0
        
    def get_financial_profile(self) -> Dict[str, Any]:
        """Get financial profile summary."""
        return {
            "total_assets": self.total_assets,
            "net_worth": self.net_worth,
            "debt_to_income_ratio": self.debt_to_income_ratio,
            "investment_ratio": self.investment_ratio,
            "available_capital": min(self.investment_capacity, self.savings * 0.7),
            "risk_capacity": self._calculate_risk_capacity()
        }
    
    def _calculate_risk_capacity(self) -> float:
        """Calculate risk capacity based on financial situation."""
        base_capacity = self.net_worth * 0.1  # 10% of net worth
        
        # Adjust based on risk tolerance
        risk_multipliers = {"Low": 0.5, "Medium": 1.0, "High": 1.5}
        multiplier = risk_multipliers.get(self.risk_tolerance, 1.0)
        
        # Adjust based on debt ratio
        if self.debt_to_income_ratio > 0.5:
            multiplier *= 0.7
        elif self.debt_to_income_ratio > 0.3:
            multiplier *= 0.85
        
        return base_capacity * multiplier
    
    def get_land_profile(self) -> Dict[str, Any]:
        """Get land profile summary."""
        return {
            "total_acres": self.total_acres,
            "irrigated_acres": self.irrigated_acres,
            "rainfed_acres": self.total_acres - self.irrigated_acres,
            "irrigation_coverage": (self.irrigated_acres / self.total_acres) * 100,
            "soil_type": self.soil_type,
            "irrigation_type": self.irrigation_type,
            "land_value_total": self.total_acres * self.land_value
        }
    
    def get_location_profile(self) -> Dict[str, Any]:
        """Get location profile summary."""
        return {
            "state": self.state,
            "district": self.district,
            "coordinates": (self.latitude, self.longitude),
            "region": self._get_region(),
            "climate_zone": self._get_climate_zone()
        }
    
    def _get_region(self) -> str:
        """Get agricultural region based on state."""
        regions = {
            "Punjab": "North-West",
            "Haryana": "North-West", 
            "Uttar Pradesh": "North",
            "Maharashtra": "West",
            "Karnataka": "South",
            "Tamil Nadu": "South"
        }
        return regions.get(self.state, "Other")
    
    def _get_climate_zone(self) -> str:
        """Get climate zone based on location."""
        if self.latitude > 30:
            return "Temperate"
        elif self.latitude > 20:
            return "Subtropical"
        else:
            return "Tropical"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert profile to dictionary."""
        return {
            "personal": {
                "name": self.name,
                "age": self.age,
                "experience_years": self.experience_years,
                "family_size": self.family_size,
                "education": self.education
            },
            "financial": self.get_financial_profile(),
            "land": self.get_land_profile(),
            "location": self.get_location_profile(),
            "risk_tolerance": self.risk_tolerance,
            "investment_capacity": self.investment_capacity
        }
    
    def save_to_file(self, filename: str):
        """Save profile to JSON file."""
        with open(filename, 'w') as f:
            json.dump(self.to_dict(), f, indent=2)
    
    @classmethod
    def load_from_file(cls, filename: str) -> 'FarmerProfile':
        """Load profile from JSON file."""
        with open(filename, 'r') as f:
            data = json.load(f)
        
        return cls(
            name=data["personal"]["name"],
            age=data["personal"]["age"],
            experience_years=data["personal"]["experience_years"],
            family_size=data["personal"]["family_size"],
            education=data["personal"]["education"],
            annual_income=data["financial"]["annual_income"],
            savings=data["financial"]["savings"],
            land_value=data["land"]["land_value_per_acre"],
            bank_loan=data["financial"]["bank_loan"],
            risk_tolerance=data["risk_tolerance"],
            investment_capacity=data["investment_capacity"],
            total_acres=data["land"]["total_acres"],
            irrigated_acres=data["land"]["irrigated_acres"],
            soil_type=data["land"]["soil_type"],
            irrigation_type=data["land"]["irrigation_type"],
            state=data["location"]["state"],
            district=data["location"]["district"],
            latitude=data["location"]["coordinates"][0],
            longitude=data["location"]["coordinates"][1]
        )
