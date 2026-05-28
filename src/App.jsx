import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const translations = {
  en: {
    title: 'AgroEye Dashboard',
    sub: 'Real-time crop monitoring system',
    altitude: 'Altitude',
    battery: 'Battery',
    speed: 'Speed',
    areaCovered: 'Area Covered',
    diseasesFound: 'Diseases Found',
    flightTime: 'Flight Time',
    droneOnline: 'Drone Online',
    dashboard: 'Dashboard',
    cropHealth: 'Crop Health',
    alerts: 'Alerts',
    analytics: 'Analytics',
    cropMap: 'Farm Crop Health Map',
    alertsTitle: 'Disease Alerts Center',
    controlTitle: 'Drone Control Panel',
    armDrone: 'ARM DRONE',
    disarm: 'DISARM',
    takeoff: 'TAKEOFF',
    landNow: 'LAND NOW',
    returnHome: 'RETURN HOME',
    startMission: 'START AUTONOMOUS MISSION',
    emergencyStop: 'EMERGENCY STOP',
    weatherTitle: 'Weather Conditions',
    weatherSub: 'Current weather at farm location',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    visibility: 'Visibility',
    uvIndex: 'UV Index',
  },
  hi: {
    title: 'एग्रोआई डैशबोर्ड',
    sub: 'रियल-टाइम फसल निगरानी प्रणाली',
    altitude: 'ऊंचाई',
    battery: 'बैटरी',
    speed: 'गति',
    areaCovered: 'कवर क्षेत्र',
    diseasesFound: 'रोग मिले',
    flightTime: 'उड़ान समय',
    droneOnline: 'ड्रोन ऑनलाइन',
    dashboard: 'डैशबोर्ड',
    cropHealth: 'फसल स्वास्थ्य',
    alerts: 'अलर्ट',
    analytics: 'विश्लेषण',
    cropMap: 'खेत फसल स्वास्थ्य मानचित्र',
    alertsTitle: 'रोग अलर्ट केंद्र',
    controlTitle: 'ड्रोन नियंत्रण पैनल',
    armDrone: 'ड्रोन सशस्त्र करें',
    disarm: 'निःशस्त्र करें',
    takeoff: 'उड़ान भरें',
    landNow: 'अभी उतरें',
    returnHome: 'घर वापस',
    startMission: 'स्वचालित मिशन शुरू करें',
    emergencyStop: 'आपातकालीन रोक',
    weatherTitle: 'मौसम की स्थिति',
    weatherSub: 'खेत स्थान पर वर्तमान मौसम',
    humidity: 'नमी',
    windSpeed: 'हवा की गति',
    visibility: 'दृश्यता',
    uvIndex: 'यूवी सूचकांक',
  }
};

function useDroneData() {
  const [droneData, setDroneData] = React.useState({
    altitude: 45,
    battery: 78,
    speed: 5,
    area_covered: 2.4,
    flight_time: 12,
    status: 'FLYING'
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/drone/status');
        const data = await res.json();
        setDroneData(data);
      } catch(err) {
        console.log('API not connected — using simulation');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return droneData;
}

function App() {
  const [lang, setLang] = React.useState('en');
  const t = translations[lang];
  return (
    <div className="app">
      <Navbar lang={lang} setLang={setLang} t={t}/>
      <Dashboard t={t}/>
    </div>
  );
}

function Navbar({lang, setLang, t}) {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <span className="logo-icon">👁️</span>
        <span className="logo-text">AgroEye</span>
      </div>
      <div className="nav-links">
        <a href="#dashboard">{t.dashboard}</a>
        <a href="#crops">{t.cropHealth}</a>
        <a href="#alerts">{t.alerts}</a>
        <a href="#analytics">{t.analytics}</a>
      </div>
      <div className="nav-right">
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === 'en' ? 'lang-active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`lang-btn ${lang === 'hi' ? 'lang-active' : ''}`} onClick={() => setLang('hi')}>हि</button>
        </div>
        <div className="nav-status">
          <span className="status-dot"></span>
          <span>{t.droneOnline}</span>
        </div>
      </div>
    </nav>
  );
}

function Dashboard({t}) {
  const [altitude, setAltitude] = React.useState(45);
  const [battery, setBattery] = React.useState(78);
  const [flightTime, setFlightTime] = React.useState(12);
  const [altitudeHistory, setAltitudeHistory] = React.useState(
    Array.from({length: 20}, (_, i) => ({time: i, altitude: 45, battery: 78}))
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAltitude(prev => {
        const newAlt = Math.max(0, prev + (Math.random() * 4 - 2));
        setAltitudeHistory(history => {
          const newHistory = [...history.slice(-19), {
            time: history[history.length-1].time + 1,
            altitude: parseFloat(newAlt.toFixed(1)),
            battery: parseFloat(battery.toFixed(1))
          }];
          return newHistory;
        });
        return parseFloat(newAlt.toFixed(1));
      });
      setBattery(prev => parseFloat(Math.max(0, prev - 0.5).toFixed(1)));
      setFlightTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const batteryColor = battery > 50 ? 'green' : battery > 20 ? 'orange' : 'red';

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">{t.title}</h1>
      <p className="dashboard-sub">{t.sub}</p>
      <div className="cards-grid">
        <StatusCard title={t.altitude} value={`${altitude}m`} icon="🚁" color="blue"/>
        <StatusCard title={t.battery} value={`${battery}%`} icon="🔋" color={batteryColor}/>
        <StatusCard title={t.speed} value="5 m/s" icon="⚡" color="blue"/>
        <StatusCard title={t.areaCovered} value="2.4 acres" icon="🌾" color="green"/>
        <StatusCard title={t.diseasesFound} value="3 zones" icon="⚠️" color="red"/>
        <StatusCard title={t.flightTime} value={`${flightTime} min`} icon="⏱️" color="blue"/>
      </div>
      <DroneControlPanel t={t}/>
      <CropHealthMap t={t}/>
      <AlertsPanel t={t}/>
      <WeatherWidget t={t}/>
      <AnalyticsPage t={t}/>
      <DiseaseLibrary/>
      <GPSMap/>
      <div className="chart-section">
        <h2 className="chart-title">📈 Live Altitude Telemetry</h2>
        <p className="chart-sub">Real-time altitude data from barometer sensor</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={altitudeHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2a4a"/>
              <XAxis dataKey="time" stroke="#8899bb" tick={{fill: '#8899bb', fontSize: 12}}/>
              <YAxis stroke="#8899bb" tick={{fill: '#8899bb', fontSize: 12}}/>
              <Tooltip contentStyle={{background: '#0d1526', border: '1px solid #1a2a4a', borderRadius: '8px'}} itemStyle={{color: '#00c853'}} formatter={(value) => [`${value}m`, 'Altitude']}/>
              <Line type="monotone" dataKey="altitude" stroke="#00c853" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <h2 className="chart-title" style={{marginTop: '30px'}}>🔋 Battery Discharge Graph</h2>
        <p className="chart-sub">Battery consumption over flight time</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={altitudeHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2a4a"/>
              <XAxis dataKey="time" stroke="#8899bb" tick={{fill: '#8899bb', fontSize: 12}}/>
              <YAxis stroke="#8899bb" tick={{fill: '#8899bb', fontSize: 12}} domain={[0, 100]}/>
              <Tooltip contentStyle={{background: '#0d1526', border: '1px solid #1a2a4a', borderRadius: '8px'}} itemStyle={{color: '#ff5252'}} formatter={(value) => [`${value}%`, 'Battery']}/>
              <Line type="monotone" dataKey="battery" stroke="#ff5252" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function DroneControlPanel({t}) {
  const [droneStatus, setDroneStatus] = React.useState('LANDED');
  const [isArmed, setIsArmed] = React.useState(false);
  const [targetAltitude, setTargetAltitude] = React.useState(50);
  const [missionStatus, setMissionStatus] = React.useState('IDLE');

  const getStatusColor = () => {
    if(droneStatus === 'FLYING') return '#00c853';
    if(droneStatus === 'LANDING') return '#ffd600';
    if(droneStatus === 'RETURNING') return '#00b0ff';
    return '#8899bb';
  }

  const handleTakeoff = () => {
    if(!isArmed){ alert('Arm the drone first!'); return; }
    setDroneStatus('FLYING');
    setMissionStatus('TAKEOFF');
  }

  const handleLand = () => {
    setDroneStatus('LANDING');
    setMissionStatus('LANDING');
    setTimeout(() => { setDroneStatus('LANDED'); setMissionStatus('IDLE'); setIsArmed(false); }, 3000);
  }

  const handleReturn = () => {
    setDroneStatus('RETURNING');
    setMissionStatus('RETURNING HOME');
    setTimeout(() => { setDroneStatus('LANDED'); setMissionStatus('IDLE'); setIsArmed(false); }, 5000);
  }

  const handleMission = () => {
    if(!isArmed){ alert('Arm the drone first!'); return; }
    setDroneStatus('FLYING');
    setMissionStatus('SCANNING FARM');
  }

  return (
    <div className="control-section">
      <h2 className="chart-title">🎮 {t.controlTitle}</h2>
      <p className="chart-sub">Control AgroEye drone operations remotely</p>
      <div className="control-status-bar">
        <div className="control-status-item">
          <span className="control-status-label">Drone Status</span>
          <span className="control-status-value" style={{color: getStatusColor()}}>● {droneStatus}</span>
        </div>
        <div className="control-status-item">
          <span className="control-status-label">Armed</span>
          <span className="control-status-value" style={{color: isArmed ? '#00c853' : '#ff5252'}}>{isArmed ? '✅ ARMED' : '❌ DISARMED'}</span>
        </div>
        <div className="control-status-item">
          <span className="control-status-label">Mission</span>
          <span className="control-status-value" style={{color: '#00b0ff'}}>{missionStatus}</span>
        </div>
        <div className="control-status-item">
          <span className="control-status-label">Target Alt</span>
          <span className="control-status-value" style={{color: '#ffd600'}}>{targetAltitude}m</span>
        </div>
      </div>
      <div className="control-grid">
        <div className="control-card">
          <div className="control-card-title">⚡ Arm Control</div>
          <div className="control-card-desc">Arm motors before flight</div>
          <button className={`control-btn ${isArmed ? 'btn-disarm' : 'btn-arm'}`} onClick={() => setIsArmed(!isArmed)}>
            {isArmed ? `🔴 ${t.disarm}` : `🟢 ${t.armDrone}`}
          </button>
        </div>
        <div className="control-card">
          <div className="control-card-title">🚀 Takeoff</div>
          <div className="control-card-desc">Launch to target altitude</div>
          <div className="altitude-control">
            <button onClick={() => setTargetAltitude(a => Math.max(10, a-10))}>−</button>
            <span>{targetAltitude}m</span>
            <button onClick={() => setTargetAltitude(a => Math.min(120, a+10))}>+</button>
          </div>
          <button className="control-btn btn-takeoff" onClick={handleTakeoff} disabled={droneStatus === 'FLYING'}>
            🚁 {t.takeoff}
          </button>
        </div>
        <div className="control-card">
          <div className="control-card-title">🛬 Land</div>
          <div className="control-card-desc">Land drone at current position</div>
          <button className="control-btn btn-land" onClick={handleLand} disabled={droneStatus === 'LANDED'}>
            ⬇️ {t.landNow}
          </button>
        </div>
        <div className="control-card">
          <div className="control-card-title">🏠 Return Home</div>
          <div className="control-card-desc">Auto-return to launch point</div>
          <button className="control-btn btn-return" onClick={handleReturn} disabled={droneStatus === 'LANDED'}>
            🔄 {t.returnHome}
          </button>
        </div>
        <div className="control-card mission-card">
          <div className="control-card-title">🌾 Start Farm Mission</div>
          <div className="control-card-desc">Launch autonomous crop scanning mission across all 9 zones</div>
          <button className="control-btn btn-mission" onClick={handleMission} disabled={droneStatus === 'FLYING'}>
            🤖 {t.startMission}
          </button>
        </div>
        <div className="control-card">
          <div className="control-card-title">🚨 Emergency Stop</div>
          <div className="control-card-desc">Immediately stop all motors</div>
          <button className="control-btn btn-emergency" onClick={() => { setDroneStatus('LANDED'); setIsArmed(false); setMissionStatus('EMERGENCY STOP'); }}>
            ⛔ {t.emergencyStop}
          </button>
        </div>
      </div>
    </div>
  );
}

function CropHealthMap({t}) {
  const zones = [
    {id:'A', health:98, status:'Healthy', crop:'Wheat'},
    {id:'B', health:67, status:'Monitor', crop:'Mustard'},
    {id:'C', health:23, status:'Disease!', crop:'Cotton'},
    {id:'D', health:91, status:'Healthy', crop:'Wheat'},
    {id:'E', health:85, status:'Healthy', crop:'Rice'},
    {id:'F', health:54, status:'Monitor', crop:'Mustard'},
    {id:'G', health:12, status:'Disease!', crop:'Cotton'},
    {id:'H', health:78, status:'Healthy', crop:'Wheat'},
    {id:'I', health:45, status:'Monitor', crop:'Rice'},
  ];
  const getColor = (h) => h >= 75 ? '#00c853' : h >= 50 ? '#ffd600' : '#ff5252';
  const getEmoji = (h) => h >= 75 ? '🟢' : h >= 50 ? '🟡' : '🔴';

  return (
    <div className="crop-map-section">
      <h2 className="chart-title">🌾 {t.cropMap}</h2>
      <p className="chart-sub">Real-time crop health monitoring across all farm zones</p>
      <div className="zone-legend">
        <span className="legend-item"><span>🟢</span> Healthy (75-100%)</span>
        <span className="legend-item"><span>🟡</span> Monitor (50-74%)</span>
        <span className="legend-item"><span>🔴</span> Disease (0-49%)</span>
      </div>
      <div className="zones-grid">
        {zones.map(zone => (
          <div key={zone.id} className="zone-card" style={{borderColor: getColor(zone.health)}}>
            <div className="zone-header">
              <span className="zone-id">Zone {zone.id}</span>
              <span className="zone-emoji">{getEmoji(zone.health)}</span>
            </div>
            <div className="zone-crop">{zone.crop}</div>
            <div className="zone-health-bar">
              <div className="zone-health-fill" style={{width: `${zone.health}%`, background: getColor(zone.health)}}/>
            </div>
            <div className="zone-footer">
              <span className="zone-percent" style={{color: getColor(zone.health)}}>{zone.health}%</span>
              <span className="zone-status" style={{color: getColor(zone.health)}}>{zone.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="disease-alert">
        <span>⚠️</span>
        <div>
          <div className="alert-title">Disease Alert — Zone C & G</div>
          <div className="alert-desc">Cotton crops showing signs of bacterial blight. Immediate treatment recommended!</div>
        </div>
      </div>
    </div>
  );
}

function AlertsPanel({t}) {
  const alerts = [
    {id:1, type:'critical', zone:'Zone C', crop:'Cotton', disease:'Bacterial Blight', time:'2 min ago', action:'Spray Copper Oxychloride immediately'},
    {id:2, type:'critical', zone:'Zone G', crop:'Cotton', disease:'Bacterial Blight', time:'2 min ago', action:'Spray Copper Oxychloride immediately'},
    {id:3, type:'warning', zone:'Zone B', crop:'Mustard', disease:'Powdery Mildew', time:'15 min ago', action:'Monitor closely, apply Sulphur fungicide if worsens'},
    {id:4, type:'warning', zone:'Zone F', crop:'Mustard', disease:'Aphid Infestation', time:'28 min ago', action:'Apply Imidacloprid spray in evening'},
    {id:5, type:'warning', zone:'Zone I', crop:'Rice', disease:'Leaf Spot', time:'45 min ago', action:'Apply Tricyclazole fungicide'},
    {id:6, type:'info', zone:'Zone A', crop:'Wheat', disease:'Routine Check', time:'1 hr ago', action:'Crop health excellent — no action needed'},
  ];

  const getAlertStyle = (type) => {
    if(type === 'critical') return {border:'#ff5252', bg:'rgba(255,82,82,0.08)', icon:'🚨', label:'CRITICAL'}
    if(type === 'warning') return {border:'#ffd600', bg:'rgba(255,214,0,0.08)', icon:'⚠️', label:'WARNING'}
    return {border:'#00c853', bg:'rgba(0,200,83,0.08)', icon:'✅', label:'INFO'}
  }

  return (
    <div className="alerts-section">
      <h2 className="chart-title">⚠️ {t.alertsTitle}</h2>
      <p className="chart-sub">Real-time disease detection alerts from AgroEye AI</p>
      <div className="alerts-summary">
        <div className="summary-card critical-summary"><div className="summary-num">2</div><div className="summary-label">Critical</div></div>
        <div className="summary-card warning-summary"><div className="summary-num">3</div><div className="summary-label">Warnings</div></div>
        <div className="summary-card info-summary"><div className="summary-num">1</div><div className="summary-label">Info</div></div>
        <div className="summary-card total-summary"><div className="summary-num">6</div><div className="summary-label">Total</div></div>
      </div>
      <div className="alerts-list">
        {alerts.map(alert => {
          const style = getAlertStyle(alert.type);
          return (
            <div key={alert.id} className="alert-item" style={{borderColor: style.border, background: style.bg}}>
              <div className="alert-left">
                <span className="alert-icon">{style.icon}</span>
                <div>
                  <div className="alert-top">
                    <span className="alert-label" style={{color: style.border}}>{style.label}</span>
                    <span className="alert-zone">{alert.zone}</span>
                    <span className="alert-crop">{alert.crop}</span>
                  </div>
                  <div className="alert-disease">{alert.disease}</div>
                  <div className="alert-action">💊 {alert.action}</div>
                </div>
              </div>
              <div className="alert-time">{alert.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeatherWidget({t}) {
  const weather = {
    location:'Jodhpur, Rajasthan', temp:39, condition:'Sunny',
    humidity:28, wind:12, visibility:8, uvIndex:9,
    suitable:false, reason:'High temperature may affect drone battery performance'
  };

  return (
    <div className="weather-section">
      <h2 className="chart-title">🌤️ {t.weatherTitle}</h2>
      <p className="chart-sub">{t.weatherSub}</p>
      <div className="weather-main">
        <div className="weather-left">
          <div className="weather-icon">☀️</div>
          <div className="weather-temp">{weather.temp}°C</div>
          <div className="weather-condition">{weather.condition}</div>
          <div className="weather-location">📍 {weather.location}</div>
        </div>
        <div className="weather-right">
          <div className="weather-grid">
            <div className="weather-stat"><div className="weather-stat-icon">💧</div><div className="weather-stat-value">{weather.humidity}%</div><div className="weather-stat-label">{t.humidity}</div></div>
            <div className="weather-stat"><div className="weather-stat-icon">💨</div><div className="weather-stat-value">{weather.wind} km/h</div><div className="weather-stat-label">{t.windSpeed}</div></div>
            <div className="weather-stat"><div className="weather-stat-icon">👁️</div><div className="weather-stat-value">{weather.visibility} km</div><div className="weather-stat-label">{t.visibility}</div></div>
            <div className="weather-stat"><div className="weather-stat-icon">🌞</div><div className="weather-stat-value">{weather.uvIndex}/10</div><div className="weather-stat-label">{t.uvIndex}</div></div>
          </div>
        </div>
      </div>
      <div className={`flight-suitability ${weather.suitable ? 'suitable' : 'not-suitable'}`}>
        <span>{weather.suitable ? '✅' : '⚠️'}</span>
        <div>
          <div className="suitability-title">{weather.suitable ? 'Suitable for flight' : 'Flight caution advised'}</div>
          <div className="suitability-reason">{weather.reason}</div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage({t}) {
  const weeklyData = [
    {day:'Mon', area:2.1, diseases:1, flights:2},
    {day:'Tue', area:3.4, diseases:3, flights:3},
    {day:'Wed', area:1.8, diseases:0, flights:1},
    {day:'Thu', area:4.2, diseases:2, flights:4},
    {day:'Fri', area:3.7, diseases:4, flights:3},
    {day:'Sat', area:2.9, diseases:1, flights:2},
    {day:'Sun', area:2.4, diseases:3, flights:2},
  ];

  const cropData = [
    {crop:'Wheat', healthy:76, diseased:24},
    {crop:'Cotton', healthy:45, diseased:55},
    {crop:'Mustard', healthy:62, diseased:38},
    {crop:'Rice', healthy:81, diseased:19},
  ];

  return (
    <div className="analytics-section">
      <h2 className="chart-title">📊 Flight Analytics</h2>
      <p className="chart-sub">Weekly performance summary — AgroEye autonomous missions</p>
      <div className="analytics-summary">
        <div className="analytics-stat"><div className="analytics-num">17</div><div className="analytics-label">Total Flights</div><div className="analytics-sub">This week</div></div>
        <div className="analytics-stat"><div className="analytics-num">20.5</div><div className="analytics-label">Acres Covered</div><div className="analytics-sub">This week</div></div>
        <div className="analytics-stat"><div className="analytics-num">14</div><div className="analytics-label">Diseases Found</div><div className="analytics-sub">This week</div></div>
        <div className="analytics-stat"><div className="analytics-num">94%</div><div className="analytics-label">AI Accuracy</div><div className="analytics-sub">YOLOv8 model</div></div>
      </div>
      <div className="analytics-chart-box">
        <h3 className="analytics-chart-title">📍 Daily Area Coverage (acres)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2a4a"/>
            <XAxis dataKey="day" stroke="#8899bb" tick={{fill:'#8899bb', fontSize:12}}/>
            <YAxis stroke="#8899bb" tick={{fill:'#8899bb', fontSize:12}}/>
            <Tooltip contentStyle={{background:'#0d1526', border:'1px solid #1a2a4a', borderRadius:'8px'}} itemStyle={{color:'#00b0ff'}} formatter={(value) => [`${value} acres`, 'Area']}/>
            <Line type="monotone" dataKey="area" stroke="#00b0ff" strokeWidth={2} dot={{fill:'#00b0ff', r:4}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="analytics-chart-box">
        <h3 className="analytics-chart-title">🦠 Daily Disease Detections</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2a4a"/>
            <XAxis dataKey="day" stroke="#8899bb" tick={{fill:'#8899bb', fontSize:12}}/>
            <YAxis stroke="#8899bb" tick={{fill:'#8899bb', fontSize:12}}/>
            <Tooltip contentStyle={{background:'#0d1526', border:'1px solid #1a2a4a', borderRadius:'8px'}} itemStyle={{color:'#ff5252'}} formatter={(value) => [`${value} zones`, 'Diseases']}/>
            <Line type="monotone" dataKey="diseases" stroke="#ff5252" strokeWidth={2} dot={{fill:'#ff5252', r:4}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="analytics-chart-box">
        <h3 className="analytics-chart-title">🌾 Crop Health Breakdown</h3>
        <div className="crop-breakdown">
          {cropData.map(crop => (
            <div key={crop.crop} className="crop-row">
              <div className="crop-name">{crop.crop}</div>
              <div className="crop-bars">
                <div className="crop-bar-wrap">
                  <div className="crop-bar healthy-bar" style={{width:`${crop.healthy}%`}}/>
                  <span className="crop-bar-label" style={{color:'#00c853'}}>{crop.healthy}% Healthy</span>
                </div>
                <div className="crop-bar-wrap">
                  <div className="crop-bar disease-bar" style={{width:`${crop.diseased}%`}}/>
                  <span className="crop-bar-label" style={{color:'#ff5252'}}>{crop.diseased}% Diseased</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function DiseaseLibrary() {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(null);

  const diseases = [
    {
      id: 1,
      name: 'Bacterial Blight',
      hindi: 'जीवाणु अंगमारी',
      crop: 'Cotton, Rice',
      severity: 'critical',
      symptoms: 'Yellow to brown lesions on leaves, wilting, water-soaked spots',
      cause: 'Xanthomonas bacteria spread through water and infected seeds',
      treatment: 'Spray Copper Oxychloride 3g/L, remove infected plants',
      prevention: 'Use certified disease-free seeds, avoid overhead irrigation',
      season: 'Kharif (July-October)',
      loss: '30-40%',
      emoji: '🦠'
    },
    {
      id: 2,
      name: 'Powdery Mildew',
      hindi: 'चूर्णिल आसिता',
      crop: 'Mustard, Wheat, Peas',
      severity: 'warning',
      symptoms: 'White powdery coating on leaves and stems',
      cause: 'Fungal infection in humid conditions with moderate temperature',
      treatment: 'Spray Sulphur 2g/L or Carbendazim 1g/L',
      prevention: 'Maintain plant spacing, avoid excess nitrogen fertilizer',
      season: 'Rabi (Oct-March)',
      loss: '15-25%',
      emoji: '⬜'
    },
    {
      id: 3,
      name: 'Aphid Infestation',
      hindi: 'माहू कीट',
      crop: 'Mustard, Wheat, Cotton',
      severity: 'warning',
      symptoms: 'Curling leaves, sticky honeydew, stunted growth',
      cause: 'Small insects sucking plant sap, spread rapidly in dry weather',
      treatment: 'Spray Imidacloprid 0.5ml/L in evening hours',
      prevention: 'Encourage natural predators like ladybugs, avoid excess nitrogen',
      season: 'Winter (Nov-Feb)',
      loss: '10-20%',
      emoji: '🐛'
    },
    {
      id: 4,
      name: 'Leaf Spot',
      hindi: 'पत्ती धब्बा रोग',
      crop: 'Rice, Maize, Sorghum',
      severity: 'warning',
      symptoms: 'Brown or grey circular spots on leaves with yellow halo',
      cause: 'Fungal pathogen Helminthosporium in warm humid conditions',
      treatment: 'Spray Mancozeb 2.5g/L or Tricyclazole 0.6g/L',
      prevention: 'Crop rotation, balanced fertilization, proper drainage',
      season: 'Kharif (July-Sept)',
      loss: '15-20%',
      emoji: '🟤'
    },
    {
      id: 5,
      name: 'Root Rot',
      hindi: 'जड़ सड़न',
      crop: 'Cotton, Chickpea, Soybean',
      severity: 'critical',
      symptoms: 'Yellowing, wilting, dark brown rotting roots',
      cause: 'Fusarium fungus in waterlogged or poorly drained soil',
      treatment: 'Drench soil with Carbendazim 1g/L, improve drainage',
      prevention: 'Avoid waterlogging, seed treatment before sowing',
      season: 'Kharif (Aug-Sept)',
      loss: '40-60%',
      emoji: '🌱'
    },
    {
      id: 6,
      name: 'Rust Disease',
      hindi: 'रतुआ रोग',
      crop: 'Wheat, Barley, Mustard',
      severity: 'critical',
      symptoms: 'Orange-brown pustules on leaves and stems',
      cause: 'Puccinia fungus spread by wind over long distances',
      treatment: 'Spray Propiconazole 1ml/L at first sign of infection',
      prevention: 'Plant resistant varieties, early sowing, monitor regularly',
      season: 'Rabi (Feb-March)',
      loss: '35-50%',
      emoji: '🟠'
    },
    {
      id: 7,
      name: 'Stem Borer',
      hindi: 'तना छेदक',
      crop: 'Rice, Maize, Sugarcane',
      severity: 'critical',
      symptoms: 'Dead heart in young plants, white ear in mature plants',
      cause: 'Moth larvae boring into stems, active in warm weather',
      treatment: 'Apply Chlorpyriphos 2ml/L, use pheromone traps',
      prevention: 'Destroy crop residues, balanced nitrogen application',
      season: 'Kharif (June-Sept)',
      loss: '20-30%',
      emoji: '🦟'
    },
    {
      id: 8,
      name: 'Mosaic Virus',
      hindi: 'मोज़ेक विषाणु',
      crop: 'Cotton, Tomato, Cucumber',
      severity: 'warning',
      symptoms: 'Mosaic pattern of yellow-green on leaves, stunted growth',
      cause: 'Virus transmitted by whiteflies and aphids',
      treatment: 'No cure — remove infected plants immediately',
      prevention: 'Control whiteflies, use virus-resistant varieties',
      season: 'All seasons',
      loss: '25-40%',
      emoji: '🟡'
    },
  ];

  const filtered = diseases.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.crop.toLowerCase().includes(search.toLowerCase()) ||
    d.hindi.includes(search)
  );

  const getSeverityColor = (s) => s === 'critical' ? '#ff5252' : s === 'warning' ? '#ffd600' : '#00c853';
  const getSeverityLabel = (s) => s === 'critical' ? '🔴 Critical' : s === 'warning' ? '🟡 Warning' : '🟢 Low';

  return (
    <div className="library-section">
      <h2 className="chart-title">📚 Disease Library</h2>
      <p className="chart-sub">Complete guide to crop diseases — identification and treatment</p>

      <div className="library-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search disease or crop name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="disease-grid">
        {filtered.map(disease => (
          <div
            key={disease.id}
            className="disease-card"
            style={{borderColor: getSeverityColor(disease.severity)}}
            onClick={() => setSelected(selected?.id === disease.id ? null : disease)}
          >
            <div className="disease-card-top">
              <span className="disease-emoji">{disease.emoji}</span>
              <div className="disease-info">
                <div className="disease-name">{disease.name}</div>
                <div className="disease-hindi">{disease.hindi}</div>
                <div className="disease-crop">🌾 {disease.crop}</div>
              </div>
              <span className="severity-badge" style={{color: getSeverityColor(disease.severity), borderColor: getSeverityColor(disease.severity)}}>
                {getSeverityLabel(disease.severity)}
              </span>
            </div>

            {selected?.id === disease.id && (
              <div className="disease-details">
                <div className="detail-row">
                  <span className="detail-label">🔬 Symptoms:</span>
                  <span className="detail-value">{disease.symptoms}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🦠 Cause:</span>
                  <span className="detail-value">{disease.cause}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">💊 Treatment:</span>
                  <span className="detail-value" style={{color: '#00c853'}}>{disease.treatment}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🛡️ Prevention:</span>
                  <span className="detail-value">{disease.prevention}</span>
                </div>
                <div className="detail-stats">
                  <div className="detail-stat">
                    <span>📅 Season</span>
                    <span>{disease.season}</span>
                  </div>
                  <div className="detail-stat">
                    <span>📉 Crop Loss</span>
                    <span style={{color: '#ff5252'}}>{disease.loss}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
function GPSMap() {
  React.useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.head.appendChild(script);

    script.onload = () => {
      const L = window.L;

      // Jodhpur farm coordinates
      const map = L.map('farm-map').setView([26.2389, 73.0243], 14);

      // Satellite tiles
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'AgroEye Farm Map'
      }).addTo(map);

      // Farm boundary
      const farmBoundary = [
        [26.2450, 73.0180],
        [26.2450, 73.0320],
        [26.2330, 73.0320],
        [26.2330, 73.0180],
      ];

      L.polygon(farmBoundary, {
        color: '#00c853',
        weight: 2,
        fillColor: '#00c853',
        fillOpacity: 0.1
      }).addTo(map).bindPopup('🌾 AgroEye Farm — Total 10 acres');

      // Zone markers
      const zones = [
        {pos: [26.2420, 73.0200], label: 'Zone A — Wheat 98% ✅', color: '#00c853'},
        {pos: [26.2400, 73.0240], label: 'Zone B — Mustard 67% ⚠️', color: '#ffd600'},
        {pos: [26.2380, 73.0280], label: 'Zone C — Cotton 23% 🔴', color: '#ff5252'},
        {pos: [26.2360, 73.0200], label: 'Zone D — Wheat 91% ✅', color: '#00c853'},
        {pos: [26.2340, 73.0240], label: 'Zone E — Rice 85% ✅', color: '#00c853'},
        {pos: [26.2360, 73.0290], label: 'Zone F — Mustard 54% ⚠️', color: '#ffd600'},
        {pos: [26.2410, 73.0300], label: 'Zone G — Cotton 12% 🔴', color: '#ff5252'},
        {pos: [26.2390, 73.0220], label: 'Zone H — Wheat 78% ✅', color: '#00c853'},
        {pos: [26.2345, 73.0270], label: 'Zone I — Rice 45% ⚠️', color: '#ffd600'},
      ];

      zones.forEach(zone => {
        const circle = L.circleMarker(zone.pos, {
          radius: 15,
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.6,
          weight: 2
        }).addTo(map);
        circle.bindPopup(zone.label);
      });

      // Drone marker
      const droneIcon = L.divIcon({
        html: '🚁',
        className: 'drone-marker',
        iconSize: [30, 30]
      });

      const droneMarker = L.marker([26.2390, 73.0243], {icon: droneIcon})
        .addTo(map)
        .bindPopup('🚁 AgroEye Drone — Altitude: 45m — Battery: 78%');

      // Animate drone
      let angle = 0;
      setInterval(() => {
        angle += 0.01;
        const lat = 26.2390 + 0.003 * Math.sin(angle);
        const lng = 73.0243 + 0.003 * Math.cos(angle);
        droneMarker.setLatLng([lat, lng]);
      }, 1000);
    };

    return () => {
      const mapEl = document.getElementById('farm-map');
      if(mapEl) mapEl.innerHTML = '';
    };
  }, []);

  return (
    <div className="map-section">
      <h2 className="chart-title">🗺️ Live Farm GPS Map</h2>
      <p className="chart-sub">Real-time drone location and crop zone mapping</p>

      <div className="map-legend">
        <span className="map-legend-item"><span style={{color:'#00c853'}}>●</span> Healthy Zone</span>
        <span className="map-legend-item"><span style={{color:'#ffd600'}}>●</span> Monitor Zone</span>
        <span className="map-legend-item"><span style={{color:'#ff5252'}}>●</span> Disease Zone</span>
        <span className="map-legend-item">🚁 Drone Location</span>
      </div>

      <div id="farm-map" className="farm-map"></div>

      <div className="map-stats">
        <div className="map-stat">
          <span className="map-stat-label">📍 Location</span>
          <span className="map-stat-value">Jodhpur, Rajasthan</span>
        </div>
        <div className="map-stat">
          <span className="map-stat-label">📐 Farm Size</span>
          <span className="map-stat-value">10 Acres</span>
        </div>
        <div className="map-stat">
          <span className="map-stat-label">🚁 Drone Status</span>
          <span className="map-stat-value" style={{color:'#00c853'}}>● Flying</span>
        </div>
        <div className="map-stat">
          <span className="map-stat-label">📊 Zones Scanned</span>
          <span className="map-stat-value">9/9</span>
        </div>
      </div>
    </div>
  );
}


function StatusCard({title, value, icon, color}) {
  return (
    <div className={`card card-${color}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-info">
        <div className="card-title">{title}</div>
        <div className="card-value">{value}</div>
      </div>
    </div>
  );
}

export default App;

