import React, { useState, useEffect, useRef } from 'react';
import { fetchLiveWeather, LiveWeatherData, REGIONAL_WEATHER_PRESETS } from '../services/weatherService';
import { MLPredictionInput } from '../services/mlInference';
import L from 'leaflet';
import {
  CloudSun,
  MapPin,
  RefreshCw,
  ArrowRight,
  Thermometer,
  Droplets,
  CloudRain,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { PageId } from './Navigation';

interface LiveWeatherGISViewProps {
  onApplyWeatherToRecommender: (temp: number, humidity: number, rainfall: number) => void;
  onNavigate: (page: PageId) => void;
}

export const LiveWeatherGISView: React.FC<LiveWeatherGISViewProps> = ({
  onApplyWeatherToRecommender,
  onNavigate,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('nitt');
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const activePreset = REGIONAL_WEATHER_PRESETS[selectedKey] || REGIONAL_WEATHER_PRESETS.nitt;

  const loadWeather = async (presetKey: string) => {
    setIsLoading(true);
    const preset = REGIONAL_WEATHER_PRESETS[presetKey] || REGIONAL_WEATHER_PRESETS.nitt;
    const res = await fetchLiveWeather(preset.lat, preset.lng, preset.name);
    setWeatherData(res);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWeather(selectedKey);
  }, [selectedKey]);

  // Leaflet map setup
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current).setView([activePreset.lat, activePreset.lng], 11);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const stationIcon = L.divIcon({
      html: `
        <div style="background-color: #047857; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.35);">
          🛰️
        </div>
      `,
      className: '',
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -34],
    });

    L.marker([activePreset.lat, activePreset.lng], { icon: stationIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #065f46; font-size: 13px;">📍 ${activePreset.name}</strong><br/>
          <strong>Latitude:</strong> ${activePreset.lat.toFixed(4)}<br/>
          <strong>Longitude:</strong> ${activePreset.lng.toFixed(4)}<br/>
          <strong>Status:</strong> Meteorological Monitoring Node
        </div>`
      )
      .openPopup();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activePreset]);

  const handleApply = () => {
    if (!weatherData) return;
    onApplyWeatherToRecommender(
      weatherData.temperature,
      weatherData.humidity,
      weatherData.rainfallEstimatedMm
    );
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onNavigate('crop_recommendation');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
            <span>🌦️</span> Live Meteorological Satellite Integration & GIS Mapping
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Real-time micro-climate synchronization via Open-Meteo satellite observations for agricultural sites in India.
          </p>
        </div>

        <button
          onClick={() => loadWeather(selectedKey)}
          disabled={isLoading}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Weather</span>
        </button>
      </div>

      {appliedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Live temperature, humidity, and rainfall transferred to Crop Recommender! Redirecting...</span>
        </div>
      )}

      {/* Region Presets */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <span className="text-xs font-bold text-slate-700 block">Select Agricultural Region / Research Station:</span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.entries(REGIONAL_WEATHER_PRESETS).map(([key, data]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedKey(key)}
              className={`p-2.5 rounded-lg text-xs font-semibold border text-left transition-all ${
                selectedKey === key
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              <span className="block truncate font-bold">{data.name.split(' (')[0]}</span>
              <span className={`text-[10px] block mt-0.5 truncate ${selectedKey === key ? 'text-emerald-200' : 'text-slate-400'}`}>
                {data.lat.toFixed(2)}°N, {data.lng.toFixed(2)}°E
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Weather Metrics Display */}
      {weatherData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
              Temperature
            </span>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {weatherData.temperature}°C
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <Thermometer className="w-3.5 h-3.5 text-amber-600" />
              <span>Current ambient air observation</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-blue-500">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
              Relative Humidity
            </span>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {weatherData.humidity}%
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              <span>Atmospheric vapor content</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
              Estimated Rainfall
            </span>
            <p className="mt-2 text-3xl font-black text-emerald-800">
              {weatherData.rainfallEstimatedMm} mm
            </p>
            <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-medium">
              <CloudRain className="w-3.5 h-3.5 text-emerald-600" />
              <span>Precipitation depth benchmark</span>
            </p>
          </div>
        </div>
      )}

      {/* Transfer to Recommender Action */}
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-emerald-950 block text-sm">
            Use Observed Live Weather in Recommendation Pipeline
          </span>
          <p className="text-emerald-800 mt-0.5">
            Synchronizes Temperature ({weatherData?.temperature}°C), Humidity ({weatherData?.humidity}%), and Rainfall ({weatherData?.rainfallEstimatedMm}mm) directly into the Random Forest input vector.
          </p>
        </div>

        <button
          onClick={handleApply}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <span>Transfer to Recommender</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Map */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 pb-1">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-700" />
            GIS Station Coordinates: {activePreset.name}
          </span>
          <span className="font-mono text-slate-400">
            Lat: {activePreset.lat.toFixed(4)}, Lng: {activePreset.lng.toFixed(4)}
          </span>
        </div>

        <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-200 relative">
          <div ref={mapContainerRef} className="w-full h-full"></div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Provider: {weatherData?.provider}</span>
          <span>Last Synchronized: {weatherData?.timestamp}</span>
        </div>
      </div>
    </div>
  );
};
