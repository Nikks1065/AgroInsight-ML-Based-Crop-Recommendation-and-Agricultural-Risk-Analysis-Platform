from typing import Dict, List, Any
import numpy as np
from datetime import datetime, timedelta

class FinancialPlanner:
    """Financial planning and analysis for crop farming."""
    
    def __init__(self):
        self.cost_structures = self._initialize_cost_structures()
    
    def _initialize_cost_structures(self) -> Dict[str, Dict[str, float]]:
        """Initialize cost structures for different farming activities."""
        return {
            "land_preparation": {
                "plowing": 2000,  # ₹/acre
                "harrowing": 1500,
                "leveling": 1000,
                "seed_bed": 500
            },
            "seeds": {
                "wheat": 800,
                "rice": 1200,
                "maize": 600,
                "cotton": 1500,
                "sugarcane": 3000,
                "pulses": 400,
                "vegetables": 2000
            },
            "fertilizers": {
                "npk": 3000,  # ₹/acre
                "organic": 1500,
                "micronutrients": 500
            },
            "pesticides": {
                "insecticides": 1000,
                "fungicides": 800,
                "herbicides": 600
            },
            "irrigation": {
                "electricity": 2000,
                "diesel": 3000,
                "labor": 1500
            },
            "labor": {
                "sowing": 1000,
                "weeding": 800,
                "harvesting": 2000,
                "threshing": 1500
            },
            "machinery": {
                "tractor": 5000,
                "harvester": 8000,
                "thresher": 3000
            },
            "miscellaneous": {
                "transport": 1000,
                "storage": 500,
                "marketing": 800
            }
        }
    
    def analyze_financials(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Comprehensive financial analysis for the farming plan."""
        
        if not crop_recommendations.get('crops'):
            return self._empty_financial_analysis()
        
        # Calculate total financial metrics
        total_investment = sum(crop['investment'] for crop in crop_recommendations['crops'])
        total_revenue = sum(crop['expected_revenue'] for crop in crop_recommendations['crops'])
        total_profit = sum(crop['net_profit'] for crop in crop_recommendations['crops'])
        
        # Calculate per-acre metrics
        total_acres = farmer_profile.total_acres
        investment_per_acre = total_investment / total_acres
        revenue_per_acre = total_revenue / total_acres
        profit_per_acre = total_profit / total_acres
        
        # Calculate ROI and profit margin
        roi = (total_profit / total_investment) * 100 if total_investment > 0 else 0
        profit_margin = (total_profit / total_revenue) * 100 if total_revenue > 0 else 0
        
        # Generate cash flow projections
        cash_flow = self._generate_cash_flow(farmer_profile, crop_recommendations)
        
        # Break-even analysis
        break_even_analysis = self._calculate_break_even(farmer_profile, crop_recommendations)
        
        # Risk-adjusted metrics
        risk_adjusted_roi = self._calculate_risk_adjusted_roi(crop_recommendations)
        
        return {
            "total_investment": total_investment,
            "total_revenue": total_revenue,
            "net_profit": total_profit,
            "investment_per_acre": investment_per_acre,
            "revenue_per_acre": revenue_per_acre,
            "profit_per_acre": profit_per_acre,
            "roi": roi,
            "profit_margin": profit_margin,
            "monthly_expenses": cash_flow['monthly_expenses'],
            "monthly_income": cash_flow['monthly_income'],
            "break_even_yield": break_even_analysis['break_even_yield'],
            "break_even_price": break_even_analysis['break_even_price'],
            "safety_margin": break_even_analysis['safety_margin'],
            "risk_adjusted_roi": risk_adjusted_roi,
            "cash_flow_summary": cash_flow['summary'],
            "financial_health": self._assess_financial_health(farmer_profile, total_investment, roi)
        }
    
    def _empty_financial_analysis(self) -> Dict[str, Any]:
        """Return empty financial analysis when no crops are recommended."""
        return {
            "total_investment": 0,
            "total_revenue": 0,
            "net_profit": 0,
            "investment_per_acre": 0,
            "revenue_per_acre": 0,
            "profit_per_acre": 0,
            "roi": 0,
            "profit_margin": 0,
            "monthly_expenses": [0] * 12,
            "monthly_income": [0] * 12,
            "break_even_yield": 0,
            "break_even_price": 0,
            "safety_margin": 0,
            "risk_adjusted_roi": 0,
            "cash_flow_summary": {},
            "financial_health": "Unknown"
        }
    
    def _generate_cash_flow(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Generate monthly cash flow projections."""
        monthly_expenses = [0] * 12
        monthly_income = [0] * 12
        
        # Current month
        current_month = datetime.now().month - 1  # 0-indexed
        
        for crop in crop_recommendations['crops']:
            # Distribute expenses and income across months based on crop timeline
            crop_cash_flow = self._calculate_crop_cash_flow(crop, current_month)
            
            for month in range(12):
                monthly_expenses[month] += crop_cash_flow['expenses'][month]
                monthly_income[month] += crop_cash_flow['income'][month]
        
        # Calculate cash flow summary
        total_expenses = sum(monthly_expenses)
        total_income = sum(monthly_income)
        net_cash_flow = total_income - total_expenses
        
        # Calculate monthly net cash flow
        monthly_net = [income - expense for income, expense in zip(monthly_income, monthly_expenses)]
        
        # Find peak cash requirement
        cumulative_cash_flow = []
        running_total = 0
        for net in monthly_net:
            running_total += net
            cumulative_cash_flow.append(running_total)
        
        peak_cash_requirement = abs(min(cumulative_cash_flow)) if cumulative_cash_flow else 0
        
        return {
            "monthly_expenses": monthly_expenses,
            "monthly_income": monthly_income,
            "monthly_net": monthly_net,
            "cumulative_cash_flow": cumulative_cash_flow,
            "summary": {
                "total_expenses": total_expenses,
                "total_income": total_income,
                "net_cash_flow": net_cash_flow,
                "peak_cash_requirement": peak_cash_requirement,
                "positive_months": len([x for x in monthly_net if x > 0]),
                "negative_months": len([x for x in monthly_net if x < 0])
            }
        }
    
    def _calculate_crop_cash_flow(self, crop, start_month) -> Dict[str, List[float]]:
        """Calculate cash flow for a specific crop."""
        expenses = [0] * 12
        income = [0] * 12
        
        # Get crop timeline
        timeline = self._get_crop_timeline(crop)
        
        # Distribute expenses across timeline
        total_investment = crop['investment']
        expense_distribution = self._distribute_expenses(timeline, total_investment)
        
        for month, amount in expense_distribution.items():
            actual_month = (start_month + month) % 12
            expenses[actual_month] += amount
        
        # Distribute income (harvest)
        harvest_month = (start_month + timeline['harvest']) % 12
        income[harvest_month] += crop['expected_revenue']
        
        return {
            "expenses": expenses,
            "income": income
        }
    
    def _get_crop_timeline(self, crop) -> Dict[str, int]:
        """Get timeline for crop activities based on growth duration."""
        growth_duration = crop.get('growth_duration', 120)  # Default 120 days
        
        # Convert days to months (approximate)
        months = max(1, growth_duration // 30)
        
        # Distribute activities across the timeline
        timeline = {
            "land_prep": 0,
            "sowing": 1,
            "irrigation": max(2, months // 3),
            "harvest": months
        }
        
        return timeline
    
    def _distribute_expenses(self, timeline, total_investment) -> Dict[int, float]:
        """Distribute total investment across timeline months."""
        distribution = {
            timeline['land_prep']: total_investment * 0.2,
            timeline['sowing']: total_investment * 0.3,
            timeline['irrigation']: total_investment * 0.3,
            timeline['harvest']: total_investment * 0.2
        }
        return distribution
    
    def _calculate_break_even(self, farmer_profile, crop_recommendations) -> Dict[str, float]:
        """Calculate break-even analysis."""
        if not crop_recommendations.get('crops'):
            return {"break_even_yield": 0, "break_even_price": 0, "safety_margin": 0}
        
        total_investment = sum(crop['investment'] for crop in crop_recommendations['crops'])
        total_expected_revenue = sum(crop['expected_revenue'] for crop in crop_recommendations['crops'])
        total_expected_yield = sum(float(crop['expected_yield']) for crop in crop_recommendations['crops'])
        
        # Calculate break-even metrics
        if total_expected_yield > 0:
            avg_price_per_ton = total_expected_revenue / total_expected_yield
            break_even_yield = total_investment / avg_price_per_ton
            break_even_price = total_investment / total_expected_yield
            safety_margin = ((total_expected_yield - break_even_yield) / total_expected_yield) * 100
        else:
            break_even_yield = 0
            break_even_price = 0
            safety_margin = 0
        
        return {
            "break_even_yield": break_even_yield,
            "break_even_price": break_even_price,
            "safety_margin": safety_margin
        }
    
    def _calculate_risk_adjusted_roi(self, crop_recommendations) -> float:
        """Calculate risk-adjusted ROI."""
        if not crop_recommendations.get('crops'):
            return 0
        
        total_roi = 0
        total_weight = 0
        
        for crop in crop_recommendations['crops']:
            # Weight ROI by risk (lower risk = higher weight)
            risk_weights = {"Low": 1.0, "Medium": 0.8, "High": 0.6}
            weight = risk_weights.get(crop['risk_level'], 0.8)
            
            total_roi += crop['roi'] * weight
            total_weight += weight
        
        return total_roi / total_weight if total_weight > 0 else 0
    
    def _assess_financial_health(self, farmer_profile, total_investment, roi) -> str:
        """Assess overall financial health of the farming plan."""
        # Check investment capacity
        if total_investment > farmer_profile.investment_capacity:
            return "High Risk - Investment exceeds capacity"
        
        # Check ROI
        if roi < 10:
            return "Low Return - Consider alternatives"
        elif roi < 20:
            return "Moderate Return - Acceptable"
        else:
            return "Good Return - Recommended"
    
    def generate_financial_report(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Generate comprehensive financial report."""
        financial_analysis = self.analyze_financials(farmer_profile, crop_recommendations)
        
        # Add sensitivity analysis
        sensitivity_analysis = self._perform_sensitivity_analysis(farmer_profile, crop_recommendations)
        
        # Add financing recommendations
        financing_recommendations = self._generate_financing_recommendations(farmer_profile, financial_analysis)
        
        return {
            **financial_analysis,
            "sensitivity_analysis": sensitivity_analysis,
            "financing_recommendations": financing_recommendations,
            "risk_mitigation": self._suggest_risk_mitigation(financial_analysis)
        }
    
    def _perform_sensitivity_analysis(self, farmer_profile, crop_recommendations) -> Dict[str, Any]:
        """Perform sensitivity analysis on key variables."""
        base_analysis = self.analyze_financials(farmer_profile, crop_recommendations)
        
        # Test different scenarios
        scenarios = {
            "yield_reduction_20": self._calculate_scenario_roi(crop_recommendations, yield_multiplier=0.8),
            "yield_reduction_40": self._calculate_scenario_roi(crop_recommendations, yield_multiplier=0.6),
            "price_reduction_15": self._calculate_scenario_roi(crop_recommendations, price_multiplier=0.85),
            "price_reduction_30": self._calculate_scenario_roi(crop_recommendations, price_multiplier=0.7),
            "cost_increase_20": self._calculate_scenario_roi(crop_recommendations, cost_multiplier=1.2),
            "cost_increase_40": self._calculate_scenario_roi(crop_recommendations, cost_multiplier=1.4)
        }
        
        return {
            "base_roi": base_analysis['roi'],
            "scenarios": scenarios,
            "worst_case_roi": min(scenarios.values()),
            "best_case_roi": max(scenarios.values())
        }
    
    def _calculate_scenario_roi(self, crop_recommendations, yield_multiplier=1.0, 
                               price_multiplier=1.0, cost_multiplier=1.0) -> float:
        """Calculate ROI for a specific scenario."""
        if not crop_recommendations.get('crops'):
            return 0
        
        total_investment = sum(crop['investment'] * cost_multiplier for crop in crop_recommendations['crops'])
        total_revenue = sum(
            float(crop['expected_yield']) * yield_multiplier * 
            (crop['expected_revenue'] / float(crop['expected_yield'])) * price_multiplier 
            for crop in crop_recommendations['crops']
        )
        
        net_profit = total_revenue - total_investment
        return (net_profit / total_investment) * 100 if total_investment > 0 else 0
    
    def _generate_financing_recommendations(self, farmer_profile, financial_analysis) -> Dict[str, Any]:
        """Generate financing recommendations."""
        total_investment = financial_analysis['total_investment']
        available_capital = farmer_profile.investment_capacity
        
        if total_investment <= available_capital:
            return {
                "financing_needed": False,
                "recommendation": "Self-financing sufficient",
                "loan_amount": 0,
                "loan_type": "None"
            }
        else:
            loan_amount = total_investment - available_capital
            
            # Recommend loan type based on amount and farmer profile
            if loan_amount < 100000:
                loan_type = "Kisan Credit Card"
            elif loan_amount < 500000:
                loan_type = "Agricultural Term Loan"
            else:
                loan_type = "Multiple loan sources"
            
            return {
                "financing_needed": True,
                "recommendation": f"Consider {loan_type} for ₹{loan_amount:,.0f}",
                "loan_amount": loan_amount,
                "loan_type": loan_type,
                "monthly_emi": self._calculate_emi(loan_amount, 12, 0.08)  # 8% interest, 12 months
            }
    
    def _calculate_emi(self, principal, months, annual_rate) -> float:
        """Calculate monthly EMI."""
        monthly_rate = annual_rate / 12
        if monthly_rate == 0:
            return principal / months
        
        emi = principal * (monthly_rate * (1 + monthly_rate)**months) / ((1 + monthly_rate)**months - 1)
        return emi
    
    def _suggest_risk_mitigation(self, financial_analysis) -> List[str]:
        """Suggest risk mitigation strategies based on financial analysis."""
        suggestions = []
        
        if financial_analysis['roi'] < 15:
            suggestions.append("Consider crop insurance to protect against yield losses")
        
        if financial_analysis['cash_flow_summary']['peak_cash_requirement'] > 50000:
            suggestions.append("Arrange credit line for peak cash requirement periods")
        
        if financial_analysis['safety_margin'] < 20:
            suggestions.append("Focus on cost optimization and yield improvement")
        
        if financial_analysis['risk_adjusted_roi'] < financial_analysis['roi'] * 0.8:
            suggestions.append("Diversify crop portfolio to reduce risk concentration")
        
        return suggestions
