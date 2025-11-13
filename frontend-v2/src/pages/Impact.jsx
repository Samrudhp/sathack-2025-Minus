import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import { getImpactStats } from '../api';

export default function Impact() {
  const navigate = useNavigate();
  const { user, language } = useUserStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadImpact();
  }, []);

  const loadImpact = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getImpactStats(user.id);
      setStats(data);
    } catch (err) {
      console.error('Impact load error:', err);
      setError(language === 'en' ? 'Failed to load impact' : 'प्रभाव लोड विफल रहा');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-forest font-semibold flex items-center gap-2 hover:gap-4 transition-all"
        >
          ← {language === 'en' ? 'Back' : 'वापस'}
        </button>

        <h1 className="text-3xl font-bold text-forest mb-6">
          🌍 {language === 'en' ? 'Your Environmental Impact' : 'आपका पर्यावरणीय प्रभाव'}
        </h1>

        {loading ? (
          <div className="card text-center py-16">
            <div className="animate-spin text-4xl mb-4">🌍</div>
            <p className="text-xl font-semibold text-forest">
              {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
            </p>
          </div>
        ) : error ? (
          <div className="bg-hazard text-white p-4 rounded-lg">
            ⚠️ {error}
          </div>
        ) : stats ? (
          <>
            {/* Total Impact */}
            <div className="card bg-forest text-white mb-6">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'en' ? 'Total Impact' : 'कुल प्रभाव'}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold">{stats.total_co2_saved_kg?.toFixed(1) || '0.0'}</p>
                  <p className="text-sm opacity-90 mt-1">kg CO₂</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">{stats.total_water_saved_liters?.toFixed(0) || '0'}</p>
                  <p className="text-sm opacity-90 mt-1">{language === 'en' ? 'Liters Water' : 'लीटर पानी'}</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">{stats.total_landfill_saved_kg?.toFixed(1) || '0.0'}</p>
                  <p className="text-sm opacity-90 mt-1">{language === 'en' ? 'kg Landfill' : 'kg लैंडफिल'}</p>
                </div>
              </div>
            </div>

            {/* Scans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="card bg-olive-light">
                <p className="text-olive-dark mb-1">{language === 'en' ? 'Total Scans' : 'कुल स्कैन'}</p>
                <p className="text-4xl font-bold text-forest">{stats.total_scans || 0}</p>
              </div>
              <div className="card bg-olive-light">
                <p className="text-olive-dark mb-1">{language === 'en' ? 'Tokens Earned' : 'टोकन अर्जित'}</p>
                <p className="text-4xl font-bold text-forest">{stats.total_tokens_earned || 0}</p>
              </div>
            </div>

            {/* Material Breakdown */}
            {stats.material_breakdown && Object.keys(stats.material_breakdown).length > 0 && (
              <div className="card mb-6">
                <h3 className="text-xl font-bold text-forest mb-4">
                  {language === 'en' ? 'Materials Recycled' : 'पुनर्नवीनीकरण सामग्री'}
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.material_breakdown).map(([material, count]) => (
                    <div key={material} className="flex justify-between items-center p-3 bg-beige rounded-lg">
                      <span className="font-semibold text-forest">{material}</span>
                      <span className="text-olive-dark">{count} {language === 'en' ? 'items' : 'वस्तुएं'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equivalent Impact */}
            <div className="card bg-forest-light text-white">
              <h3 className="text-xl font-bold mb-4">
                {language === 'en' ? 'What This Means' : 'इसका क्या मतलब है'}
              </h3>
              <ul className="space-y-2">
                <li>🌳 {language === 'en' 
                  ? `Equivalent to planting ${Math.floor((stats.total_co2_saved_kg || 0) / 20)} trees` 
                  : `${Math.floor((stats.total_co2_saved_kg || 0) / 20)} पेड़ लगाने के बराबर`}
                </li>
                <li>💧 {language === 'en' 
                  ? `Enough water for ${Math.floor((stats.total_water_saved_liters || 0) / 100)} days` 
                  : `${Math.floor((stats.total_water_saved_liters || 0) / 100)} दिनों के लिए पर्याप्त पानी`}
                </li>
                <li>🗑️ {language === 'en' 
                  ? `Prevented ${(stats.total_landfill_saved_kg || 0).toFixed(0)}kg from landfills` 
                  : `${(stats.total_landfill_saved_kg || 0).toFixed(0)}kg को लैंडफिल से रोका`}
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="card text-center py-16">
            <p className="text-xl font-semibold text-forest mb-4">
              {language === 'en' ? 'No impact data yet' : 'अभी तक कोई प्रभाव डेटा नहीं'}
            </p>
            <button onClick={() => navigate('/scan')} className="btn-primary">
              {language === 'en' ? 'Start Scanning' : 'स्कैन शुरू करें'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
