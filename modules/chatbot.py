from typing import Dict, List, Any
import random
from datetime import datetime

class CropChatbot:
    """AI-powered chatbot for farming advice and crop planning assistance."""
    
    def __init__(self):
        self.knowledge_base = self._initialize_knowledge_base()
        self.conversation_history = []
    
    def _initialize_knowledge_base(self) -> Dict[str, Dict[str, Any]]:
        """Initialize knowledge base with farming information."""
        return {
            "crop_spacing": {
                "wheat": "Row spacing: 20-25 cm, Plant spacing: 5-7 cm",
                "rice": "Row spacing: 20-25 cm, Plant spacing: 15-20 cm",
                "maize": "Row spacing: 60-75 cm, Plant spacing: 20-25 cm",
                "cotton": "Row spacing: 90-120 cm, Plant spacing: 30-45 cm",
                "pulses": "Row spacing: 30-45 cm, Plant spacing: 10-15 cm",
                "vegetables": "Varies by crop: Tomatoes (60x45 cm), Onions (15x10 cm), Potatoes (60x25 cm)"
            },
            "fertilizer_application": {
                "npk": "Apply NPK 10:26:26 at 250 kg/acre during sowing",
                "urea": "Apply urea 46-0-0 at 100 kg/acre in 2-3 splits",
                "organic": "Apply 5-10 tons of farmyard manure per acre before sowing",
                "micronutrients": "Apply zinc sulphate 21% at 25 kg/acre if deficiency observed"
            },
            "irrigation_schedule": {
                "wheat": "Critical stages: Crown root, Tillering, Jointing, Flowering, Grain filling",
                "rice": "Maintain 5-7 cm water level during vegetative phase",
                "maize": "Irrigate at 7-10 day intervals, critical at tasseling",
                "cotton": "Irrigate at 10-15 day intervals, avoid waterlogging"
            },
            "pest_management": {
                "aphids": "Use neem oil or imidacloprid 17.8% SL at 0.3 ml/liter",
                "borers": "Apply carbofuran 3G at 25 kg/acre or use pheromone traps",
                "fungal_diseases": "Use mancozeb 75% WP at 2.5 g/liter as preventive spray",
                "weeds": "Apply pendimethalin 30% EC at 1 liter/acre as pre-emergence"
            },
            "soil_health": {
                "ph_testing": "Test soil pH every 2-3 years, ideal range: 6.0-7.5",
                "organic_matter": "Maintain 2-3% organic matter through crop residues and FYM",
                "soil_erosion": "Practice contour farming and use cover crops",
                "soil_compaction": "Deep plowing and organic matter addition helps"
            },
            "weather_management": {
                "drought": "Use drought-resistant varieties and mulching techniques",
                "excess_rain": "Ensure proper drainage and avoid waterlogging",
                "frost": "Use frost protection measures like irrigation and windbreaks",
                "heat_stress": "Provide shade and increase irrigation frequency"
            },
            "market_timing": {
                "wheat": "Best selling time: March-April when prices are high",
                "rice": "Sell during October-December for better prices",
                "vegetables": "Avoid glut periods, target off-season markets",
                "pulses": "Store and sell during lean periods for premium prices"
            },
            "government_schemes": {
                "pmfby": "Pradhan Mantri Fasal Bima Yojana covers crop insurance",
                "pmksy": "Pradhan Mantri Krishi Sinchayee Yojana for irrigation",
                "soil_health_card": "Free soil testing and recommendations",
                "kisan_credit_card": "Easy credit access for farmers"
            }
        }
    
    def get_response(self, user_input: str) -> str:
        """Generate response to user input."""
        # Add to conversation history
        self.conversation_history.append({"user": user_input, "timestamp": datetime.now()})
        
        # Analyze user input
        intent = self._analyze_intent(user_input.lower())
        
        # Generate appropriate response
        response = self._generate_response(intent, user_input)
        
        # Add response to history
        self.conversation_history.append({"bot": response, "timestamp": datetime.now()})
        
        return response
    
    def _analyze_intent(self, user_input: str) -> Dict[str, Any]:
        """Analyze user intent from input."""
        intent = {
            "type": "general",
            "crop": None,
            "topic": None,
            "confidence": 0.0
        }
        
        # Check for crop-specific queries
        crops = ["wheat", "rice", "maize", "cotton", "sugarcane", "pulses", "vegetables", "tomato", "onion", "potato"]
        for crop in crops:
            if crop in user_input:
                intent["crop"] = crop
                intent["confidence"] += 0.3
                break
        
        # Check for specific topics
        topics = {
            "spacing": ["spacing", "gap", "distance", "row", "plant"],
            "fertilizer": ["fertilizer", "npk", "urea", "manure", "nutrient"],
            "irrigation": ["irrigation", "water", "drip", "sprinkler"],
            "pest": ["pest", "insect", "disease", "fungus", "weed"],
            "soil": ["soil", "ph", "organic", "erosion"],
            "weather": ["weather", "drought", "rain", "frost", "heat"],
            "market": ["market", "price", "sell", "profit", "income"],
            "scheme": ["scheme", "government", "subsidy", "insurance", "loan"]
        }
        
        for topic, keywords in topics.items():
            if any(keyword in user_input for keyword in keywords):
                intent["topic"] = topic
                intent["confidence"] += 0.4
                break
        
        # Determine intent type
        if intent["crop"] and intent["topic"]:
            intent["type"] = "specific_advice"
            intent["confidence"] += 0.3
        elif intent["crop"]:
            intent["type"] = "crop_general"
            intent["confidence"] += 0.2
        elif intent["topic"]:
            intent["type"] = "topic_general"
            intent["confidence"] += 0.2
        else:
            intent["type"] = "general"
        
        return intent
    
    def _generate_response(self, intent: Dict[str, Any], user_input: str) -> str:
        """Generate response based on intent."""
        if intent["type"] == "specific_advice":
            return self._get_specific_advice(intent["crop"], intent["topic"])
        elif intent["type"] == "crop_general":
            return self._get_crop_general_info(intent["crop"])
        elif intent["type"] == "topic_general":
            return self._get_topic_general_info(intent["topic"])
        else:
            return self._get_general_response(user_input)
    
    def _get_specific_advice(self, crop: str, topic: str) -> str:
        """Get specific advice for crop and topic combination."""
        if topic == "spacing":
            spacing_info = self.knowledge_base["crop_spacing"].get(crop, "Standard spacing: 20-25 cm between rows")
            return f"For {crop}, the recommended spacing is: {spacing_info}. This ensures optimal plant growth and easy management."
        
        elif topic == "fertilizer":
            if crop in ["wheat", "rice", "maize"]:
                return f"For {crop}, apply NPK 10:26:26 at 250 kg/acre during sowing, followed by urea 46-0-0 at 100 kg/acre in 2-3 splits. Also apply 5-10 tons of farmyard manure per acre."
            else:
                return f"For {crop}, apply balanced NPK fertilizer based on soil test results. Organic manure application of 5-10 tons/acre is recommended."
        
        elif topic == "irrigation":
            irrigation_info = self.knowledge_base["irrigation_schedule"].get(crop, "Irrigate based on soil moisture and crop stage")
            return f"For {crop}: {irrigation_info}. Monitor soil moisture regularly and avoid waterlogging."
        
        elif topic == "pest":
            return f"For {crop} pest management: Monitor regularly for pests and diseases. Use integrated pest management (IPM) approach. Apply recommended pesticides only when necessary."
        
        elif topic == "soil":
            return f"For {crop} soil management: Test soil pH every 2-3 years. Maintain 2-3% organic matter. Practice crop rotation to improve soil health."
        
        elif topic == "weather":
            return f"For {crop} weather management: Monitor weather forecasts regularly. Use appropriate varieties for your region. Implement protective measures during extreme weather."
        
        elif topic == "market":
            market_info = self.knowledge_base["market_timing"].get(crop, "Monitor market prices and sell when prices are favorable")
            return f"For {crop}: {market_info}. Consider storage facilities for better price realization."
        
        else:
            return f"For {crop} {topic}: Please consult local agricultural experts for specific recommendations based on your location and conditions."
    
    def _get_crop_general_info(self, crop: str) -> str:
        """Get general information about a crop."""
        crop_info = {
            "wheat": "Wheat is a Rabi season crop requiring moderate water. Best suited for loamy soils. Sowing: Oct-Nov, Harvest: Mar-Apr. Expected yield: 3-4 tons/acre.",
            "rice": "Rice is a Kharif season crop requiring high water. Best suited for clay soils. Sowing: Jun-Jul, Harvest: Oct-Nov. Expected yield: 4-5 tons/acre.",
            "maize": "Maize can be grown in both Kharif and Rabi seasons. Moderate water requirement. Sowing: Jun-Jul or Jan-Feb. Expected yield: 3-4 tons/acre.",
            "cotton": "Cotton is a Kharif season crop. Moderate water requirement. Sowing: May-Jun, Harvest: Oct-Dec. Expected yield: 1.5-2 bales/acre.",
            "pulses": "Pulses are Rabi season crops with low water requirement. Sowing: Oct-Nov, Harvest: Mar-Apr. Good for soil health and crop rotation.",
            "vegetables": "Vegetables can be grown year-round with proper management. High value crops requiring intensive care. Good for small landholdings."
        }
        
        return crop_info.get(crop, f"{crop} is a valuable crop. Consult local agricultural experts for specific recommendations.")
    
    def _get_topic_general_info(self, topic: str) -> str:
        """Get general information about a farming topic."""
        topic_info = {
            "spacing": "Proper crop spacing is crucial for optimal growth. It ensures adequate sunlight, air circulation, and nutrient availability. Follow recommended spacing for your crop and soil type.",
            "fertilizer": "Fertilizer application should be based on soil test results. Use balanced NPK fertilizers and organic manures. Apply at recommended rates and timings for best results.",
            "irrigation": "Irrigation should be based on crop stage, soil type, and weather conditions. Avoid over-irrigation and waterlogging. Use efficient irrigation methods like drip or sprinkler.",
            "pest": "Integrated Pest Management (IPM) is the best approach. Monitor regularly, use resistant varieties, and apply pesticides only when necessary. Consider biological control methods.",
            "soil": "Soil health is fundamental for good crop production. Regular soil testing, organic matter addition, and proper crop rotation help maintain soil fertility.",
            "weather": "Weather monitoring is essential for farming decisions. Use weather forecasts for planning operations. Implement protective measures during extreme weather events.",
            "market": "Market timing is crucial for better returns. Monitor price trends, avoid glut periods, and consider storage facilities. Government schemes can help with marketing.",
            "scheme": "Several government schemes support farmers: PMFBY for crop insurance, PMKSY for irrigation, Soil Health Card for soil testing, and Kisan Credit Card for easy credit."
        }
        
        return topic_info.get(topic, "This is an important aspect of farming. Consult local agricultural experts for specific guidance.")
    
    def _get_general_response(self, user_input: str) -> str:
        """Generate general response for unclear queries."""
        general_responses = [
            "I'm here to help with your farming questions! You can ask about crop spacing, fertilizers, irrigation, pest management, soil health, weather management, market timing, or government schemes.",
            "For specific advice, please mention the crop name (like wheat, rice, maize) and the topic (like spacing, fertilizer, irrigation).",
            "I can provide guidance on various farming topics. What specific aspect of farming would you like to know more about?",
            "Feel free to ask about any farming-related topic. I can help with crop recommendations, pest management, soil health, and more.",
            "I'm your farming assistant! Ask me about crops, techniques, government schemes, or any agricultural topic."
        ]
        
        return random.choice(general_responses)
    
    def get_farming_tips(self, crop: str = None) -> List[str]:
        """Get general farming tips."""
        general_tips = [
            "Always test your soil before applying fertilizers",
            "Practice crop rotation to improve soil health",
            "Use integrated pest management (IPM) approach",
            "Monitor weather forecasts regularly",
            "Keep records of your farming activities",
            "Use quality seeds from reliable sources",
            "Maintain proper irrigation scheduling",
            "Consider organic farming practices",
            "Plan your crop calendar in advance",
            "Stay updated with government schemes"
        ]
        
        if crop:
            crop_specific_tips = {
                "wheat": [
                    "Sow wheat at proper time (Oct-Nov)",
                    "Apply irrigation at critical growth stages",
                    "Control weeds early in the season",
                    "Harvest when grain moisture is 20-25%"
                ],
                "rice": [
                    "Maintain proper water level during growth",
                    "Use certified seeds for better yield",
                    "Control pests like stem borer",
                    "Harvest at proper maturity stage"
                ],
                "maize": [
                    "Ensure proper spacing for good yield",
                    "Apply nitrogen in splits",
                    "Control fall armyworm if present",
                    "Harvest when kernels are hard"
                ]
            }
            return crop_specific_tips.get(crop, general_tips)
        
        return general_tips
    
    def get_emergency_advice(self, situation: str) -> str:
        """Get emergency advice for farming situations."""
        emergency_responses = {
            "drought": "During drought: Use drought-resistant varieties, mulching, and efficient irrigation. Consider crop insurance under PMFBY.",
            "flood": "During flood: Ensure proper drainage, avoid waterlogging, and use flood-tolerant varieties if available.",
            "pest_outbreak": "For pest outbreak: Identify the pest correctly, use recommended pesticides, and consider biological control methods.",
            "disease": "For disease outbreak: Remove infected plants, use fungicides, and improve air circulation.",
            "frost": "During frost: Use frost protection measures like irrigation, windbreaks, and cover crops.",
            "heat_wave": "During heat wave: Increase irrigation frequency, provide shade, and use heat-tolerant varieties."
        }
        
        return emergency_responses.get(situation.lower(), "Please contact your local agricultural extension officer for immediate assistance.")
    
    def get_conversation_summary(self) -> Dict[str, Any]:
        """Get summary of conversation history."""
        if not self.conversation_history:
            return {"total_exchanges": 0, "topics_discussed": []}
        
        topics = []
        for exchange in self.conversation_history:
            if "user" in exchange:
                intent = self._analyze_intent(exchange["user"].lower())
                if intent["topic"]:
                    topics.append(intent["topic"])
                if intent["crop"]:
                    topics.append(intent["crop"])
        
        return {
            "total_exchanges": len(self.conversation_history) // 2,
            "topics_discussed": list(set(topics)),
            "last_interaction": self.conversation_history[-1]["timestamp"] if self.conversation_history else None
        }
