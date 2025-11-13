import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserStore, useScanStore } from '../store';
import { useGeolocation } from '../hooks';
import { getRecyclersNearby } from '../api';

// Fix Leaflet default icon issue
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Map() {
  const navigate = useNavigate();
  const { language } = useUserStore();
  const { currentScan } = useScanStore();
  const { latitude, longitude, loading: locationLoading } = useGeolocation();
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (latitude && longitude) {
      loadRecyclers();
    }
  }, [latitude, longitude]);

  const loadRecyclers = async () => {
    setLoading(true);
    setError(null);
    try {
      const material = currentScan?.material || 'Plastic';
      const data = await getRecyclersNearby(latitude, longitude, material, 1.0);
      setRecyclers(data.recyclers || []);
    } catch (err) {
      console.error('Recycler load error:', err);
      setError(language === 'en' ? 'Failed to load recyclers' : 'रीसाइकलर लोड विफल रहा');
    } finally {
      setLoading(false);
    }
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen bg-beige p-6 flex items-center justify-center">
        <div className="card text-center">
          <div className="animate-spin text-4xl mb-4">🗺️</div>
          <p className="text-xl font-semibold text-forest">
            {language === 'en' ? 'Loading location...' : 'स्थान लोड हो रहा है...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-forest font-semibold flex items-center gap-2 hover:gap-4 transition-all"
        >
          ← {language === 'en' ? 'Back' : 'वापस'}
        </button>

        <h1 className="text-3xl font-bold text-forest mb-6">
          🗺️ {language === 'en' ? 'Nearby Recyclers' : 'निकटतम रीसाइकलर'}
        </h1>

        {error && (
          <div className="bg-hazard text-white p-4 rounded-lg mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Map */}
        <div className="card p-0 mb-6 overflow-hidden" style={{ height: '500px' }}>
          <MapContainer
            center={[latitude || 28.6139, longitude || 77.2090]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User location */}
            {latitude && longitude && (
              <Marker position={[latitude, longitude]}>
                <Popup>
                  <b>{language === 'en' ? 'Your Location' : 'आपका स्थान'}</b>
                </Popup>
              </Marker>
            )}
            
            {/* Recyclers */}
            {recyclers.map((recycler, i) => (
              <Marker
                key={i}
                position={[recycler.location_lat, recycler.location_lon]}
              >
                <Popup>
                  <div className="p-2">
                    <b className="text-forest">{recycler.recycler_name}</b>
                    <p className="text-sm text-olive-dark mt-1">
                      {recycler.distance_km.toFixed(1)} km {language === 'en' ? 'away' : 'दूर'}
                    </p>
                    <p className="text-sm text-olive-dark">
                      {language === 'en' ? 'Score:' : 'स्कोर:'} {recycler.total_score.toFixed(1)}
                    </p>
                    {recycler.materials_accepted && (
                      <p className="text-xs mt-1">
                        <b>{language === 'en' ? 'Accepts:' : 'स्वीकार करता है:'}</b><br/>
                        {recycler.materials_accepted.join(', ')}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Recycler List */}
        <div className="card">
          <h3 className="text-xl font-bold text-forest mb-4">
            {language === 'en' ? 'Recycler List' : 'रीसाइकलर सूची'} ({recyclers.length})
          </h3>
          
          {loading ? (
            <p className="text-center text-olive-dark py-4">
              {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
            </p>
          ) : recyclers.length === 0 ? (
            <p className="text-center text-olive-dark py-4">
              {language === 'en' ? 'No recyclers found nearby' : 'पास में कोई रीसाइकलर नहीं मिला'}
            </p>
          ) : (
            <div className="space-y-3">
              {recyclers.slice(0, 10).map((recycler, i) => (
                <div key={i} className="p-4 bg-beige rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-forest">{recycler.recycler_name}</h4>
                      <p className="text-sm text-olive-dark mt-1">
                        📍 {recycler.distance_km.toFixed(1)} km {language === 'en' ? 'away' : 'दूर'}
                      </p>
                      {recycler.materials_accepted && (
                        <p className="text-xs mt-1 text-forest">
                          {recycler.materials_accepted.slice(0, 3).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-olive-dark">{language === 'en' ? 'Score' : 'स्कोर'}</p>
                      <p className="text-2xl font-bold text-forest">{recycler.total_score.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
