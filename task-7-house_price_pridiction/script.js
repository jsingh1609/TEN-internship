/* ═══════════════════════════════════════════════════════
   DATA — ALL INDIAN STATES + UNION TERRITORIES
   rates: { p: premium, m: mid, a: affordable } ₹/sqft
   trend: YoY % change
   tier: market tier (1=metro, 2=major, 3=emerging)
═══════════════════════════════════════════════════════ */
const INDIA = {
  "Andhra Pradesh": {
    tier:2, cities:{
      "Visakhapatnam":  {p:9000,m:5500,a:3400,trend:"+6.8%",pop:"1.7M"},
      "Vijayawada":     {p:8000,m:5000,a:3100,trend:"+7.2%",pop:"1.4M"},
      "Tirupati":       {p:7000,m:4200,a:2700,trend:"+5.5%",pop:"0.5M"},
      "Guntur":         {p:6000,m:3700,a:2300,trend:"+5.0%",pop:"0.9M"},
      "Kakinada":       {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.5M"},
      "Rajahmundry":    {p:5500,m:3400,a:2100,trend:"+4.8%",pop:"0.5M"},
      "Nellore":        {p:5000,m:3100,a:1900,trend:"+4.2%",pop:"0.5M"},
      "Kurnool":        {p:4800,m:3000,a:1900,trend:"+4.0%",pop:"0.5M"},
    }
  },
  "Arunachal Pradesh": {
    tier:3, cities:{
      "Itanagar":   {p:5000,m:3200,a:2000,trend:"+4.0%",pop:"0.1M"},
      "Tawang":     {p:4500,m:2900,a:1800,trend:"+3.5%",pop:"0.05M"},
      "Ziro":       {p:4000,m:2600,a:1600,trend:"+3.0%",pop:"0.05M"},
    }
  },
  "Assam": {
    tier:2, cities:{
      "Guwahati":   {p:8500,m:5000,a:3000,trend:"+7.5%",pop:"1.3M"},
      "Silchar":    {p:4500,m:2900,a:1800,trend:"+4.0%",pop:"0.2M"},
      "Dibrugarh":  {p:4500,m:2900,a:1800,trend:"+3.8%",pop:"0.2M"},
      "Jorhat":     {p:4000,m:2600,a:1600,trend:"+3.5%",pop:"0.2M"},
      "Tezpur":     {p:4000,m:2500,a:1600,trend:"+3.5%",pop:"0.1M"},
    }
  },
  "Bihar": {
    tier:2, cities:{
      "Patna":        {p:8000,m:4800,a:2900,trend:"+6.5%",pop:"2.5M"},
      "Gaya":         {p:4500,m:2900,a:1800,trend:"+4.0%",pop:"0.5M"},
      "Muzaffarpur":  {p:4500,m:2800,a:1800,trend:"+3.8%",pop:"0.4M"},
      "Bhagalpur":    {p:4200,m:2700,a:1700,trend:"+3.5%",pop:"0.4M"},
      "Darbhanga":    {p:4000,m:2500,a:1600,trend:"+3.0%",pop:"0.3M"},
    }
  },
  "Chhattisgarh": {
    tier:2, cities:{
      "Raipur":    {p:7000,m:4200,a:2600,trend:"+5.5%",pop:"1.2M"},
      "Bhilai":    {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.6M"},
      "Bilaspur":  {p:5000,m:3100,a:1900,trend:"+4.0%",pop:"0.4M"},
      "Durg":      {p:5000,m:3100,a:1900,trend:"+4.0%",pop:"0.3M"},
      "Korba":     {p:4000,m:2500,a:1600,trend:"+3.5%",pop:"0.3M"},
    }
  },
  "Goa": {
    tier:1, cities:{
      "Panaji":        {p:18000,m:11000,a:6500,trend:"+10.2%",pop:"0.1M"},
      "Margao":        {p:14000,m:8500,a:5000,trend:"+9.0%",pop:"0.1M"},
      "Vasco da Gama": {p:13000,m:8000,a:4800,trend:"+8.5%",pop:"0.1M"},
      "Mapusa":        {p:14000,m:8500,a:5000,trend:"+9.2%",pop:"0.1M"},
      "Panjim Beach":  {p:20000,m:13000,a:7500,trend:"+11.0%",pop:"0.1M"},
    }
  },
  "Gujarat": {
    tier:1, cities:{
      "Ahmedabad":  {p:10000,m:6000,a:3500,trend:"+7.0%",pop:"8M"},
      "Surat":      {p:8000,m:5000,a:3000,trend:"+6.5%",pop:"7M"},
      "Vadodara":   {p:7500,m:4600,a:2800,trend:"+6.0%",pop:"2.5M"},
      "Rajkot":     {p:7000,m:4300,a:2600,trend:"+5.8%",pop:"1.7M"},
      "Gandhinagar":{p:9000,m:5500,a:3300,trend:"+7.5%",pop:"0.4M"},
      "Bhavnagar":  {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.7M"},
      "Jamnagar":   {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.7M"},
      "Junagadh":   {p:4800,m:3000,a:1900,trend:"+4.0%",pop:"0.3M"},
    }
  },
  "Haryana": {
    tier:1, cities:{
      "Gurugram":   {p:18000,m:11000,a:6500,trend:"+9.5%",pop:"1.5M"},
      "Faridabad":  {p:9000,m:5500,a:3300,trend:"+6.5%",pop:"1.9M"},
      "Chandigarh": {p:12000,m:7500,a:4500,trend:"+7.0%",pop:"1.2M"},
      "Ambala":     {p:6500,m:4000,a:2500,trend:"+5.0%",pop:"0.2M"},
      "Hisar":      {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.3M"},
      "Rohtak":     {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.4M"},
      "Karnal":     {p:6000,m:3700,a:2300,trend:"+5.0%",pop:"0.3M"},
      "Panipat":    {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.5M"},
    }
  },
  "Himachal Pradesh": {
    tier:2, cities:{
      "Shimla":       {p:10000,m:6000,a:3700,trend:"+7.5%",pop:"0.2M"},
      "Dharamshala":  {p:9000,m:5500,a:3400,trend:"+8.0%",pop:"0.1M"},
      "Manali":       {p:11000,m:7000,a:4200,trend:"+9.0%",pop:"0.05M"},
      "Mandi":        {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.1M"},
      "Solan":        {p:7000,m:4300,a:2700,trend:"+6.0%",pop:"0.1M"},
      "Kullu":        {p:8000,m:5000,a:3100,trend:"+7.0%",pop:"0.05M"},
    }
  },
  "Jharkhand": {
    tier:2, cities:{
      "Ranchi":      {p:7000,m:4300,a:2700,trend:"+6.0%",pop:"1.5M"},
      "Jamshedpur":  {p:6500,m:4000,a:2500,trend:"+5.5%",pop:"0.7M"},
      "Dhanbad":     {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"1.2M"},
      "Bokaro":      {p:5000,m:3100,a:1900,trend:"+4.0%",pop:"0.6M"},
      "Hazaribagh":  {p:4500,m:2800,a:1800,trend:"+3.8%",pop:"0.2M"},
    }
  },
  "Karnataka": {
    tier:1, cities:{
      "Bengaluru":     {p:18000,m:10500,a:6000,trend:"+10.5%",pop:"15M"},
      "Mysuru":        {p:8000,m:5000,a:3000,trend:"+7.0%",pop:"1.2M"},
      "Hubballi-Dharwad":{p:5500,m:3400,a:2100,trend:"+5.0%",pop:"0.9M"},
      "Mangaluru":     {p:7500,m:4600,a:2800,trend:"+6.5%",pop:"0.6M"},
      "Belagavi":      {p:5000,m:3100,a:1900,trend:"+4.5%",pop:"0.5M"},
      "Kalaburagi":    {p:4500,m:2800,a:1800,trend:"+4.0%",pop:"0.5M"},
      "Ballari":       {p:4500,m:2800,a:1800,trend:"+4.0%",pop:"0.4M"},
      "Tumakuru":      {p:6000,m:3700,a:2300,trend:"+5.5%",pop:"0.3M"},
    }
  },
  "Kerala": {
    tier:1, cities:{
      "Kochi":             {p:14000,m:8500,a:5000,trend:"+8.5%",pop:"2.5M"},
      "Thiruvananthapuram":{p:11000,m:6500,a:4000,trend:"+7.0%",pop:"1.8M"},
      "Kozhikode":         {p:9000,m:5500,a:3300,trend:"+6.5%",pop:"0.8M"},
      "Thrissur":          {p:9500,m:5800,a:3500,trend:"+6.8%",pop:"0.3M"},
      "Kollam":            {p:8000,m:5000,a:3000,trend:"+6.0%",pop:"1.1M"},
      "Kannur":            {p:7500,m:4600,a:2800,trend:"+6.0%",pop:"0.2M"},
      "Palakkad":          {p:6000,m:3700,a:2300,trend:"+5.0%",pop:"0.1M"},
      "Alappuzha":         {p:7000,m:4300,a:2700,trend:"+6.0%",pop:"0.2M"},
    }
  },
  "Madhya Pradesh": {
    tier:2, cities:{
      "Bhopal":    {p:8500,m:5200,a:3200,trend:"+6.5%",pop:"2.5M"},
      "Indore":    {p:9000,m:5500,a:3300,trend:"+8.0%",pop:"3.5M"},
      "Gwalior":   {p:6000,m:3700,a:2300,trend:"+5.0%",pop:"1.2M"},
      "Jabalpur":  {p:5500,m:3400,a:2100,trend:"+5.0%",pop:"1.4M"},
      "Ujjain":    {p:5000,m:3100,a:1900,trend:"+4.5%",pop:"0.7M"},
      "Rewa":      {p:4500,m:2800,a:1800,trend:"+4.0%",pop:"0.3M"},
      "Satna":     {p:4200,m:2600,a:1700,trend:"+3.8%",pop:"0.3M"},
    }
  },
  "Maharashtra": {
    tier:1, cities:{
      "Mumbai":      {p:30000,m:17000,a:10000,trend:"+8.5%",pop:"20M"},
      "Pune":        {p:14000,m:8500,a:5000,trend:"+9.0%",pop:"6.5M"},
      "Nagpur":      {p:7000,m:4300,a:2700,trend:"+6.0%",pop:"2.9M"},
      "Thane":       {p:20000,m:12000,a:7000,trend:"+8.0%",pop:"2.5M"},
      "Navi Mumbai": {p:17000,m:10000,a:6000,trend:"+8.5%",pop:"1.1M"},
      "Nashik":      {p:7000,m:4300,a:2700,trend:"+6.5%",pop:"1.6M"},
      "Aurangabad":  {p:6000,m:3700,a:2300,trend:"+5.5%",pop:"1.2M"},
      "Solapur":     {p:5500,m:3400,a:2100,trend:"+5.0%",pop:"1.0M"},
      "Kolhapur":    {p:5500,m:3400,a:2100,trend:"+5.0%",pop:"0.6M"},
      "Vasai-Virar": {p:14000,m:8500,a:5000,trend:"+7.5%",pop:"1.5M"},
    }
  },
  "Manipur": {
    tier:3, cities:{
      "Imphal":  {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.4M"},
      "Thoubal": {p:4000,m:2500,a:1600,trend:"+3.5%",pop:"0.1M"},
    }
  },
  "Meghalaya": {
    tier:3, cities:{
      "Shillong": {p:7000,m:4300,a:2700,trend:"+5.5%",pop:"0.4M"},
      "Tura":     {p:3500,m:2200,a:1400,trend:"+3.0%",pop:"0.1M"},
    }
  },
  "Mizoram": {
    tier:3, cities:{
      "Aizawl":  {p:5500,m:3400,a:2100,trend:"+4.0%",pop:"0.4M"},
      "Lunglei":  {p:3500,m:2200,a:1400,trend:"+3.0%",pop:"0.05M"},
    }
  },
  "Nagaland": {
    tier:3, cities:{
      "Kohima":   {p:5000,m:3100,a:1900,trend:"+4.0%",pop:"0.1M"},
      "Dimapur":  {p:4500,m:2800,a:1800,trend:"+3.8%",pop:"0.5M"},
    }
  },
  "Odisha": {
    tier:2, cities:{
      "Bhubaneswar": {p:8500,m:5200,a:3200,trend:"+7.5%",pop:"1.0M"},
      "Cuttack":     {p:6500,m:4000,a:2500,trend:"+5.5%",pop:"1.0M"},
      "Rourkela":    {p:5500,m:3400,a:2100,trend:"+4.8%",pop:"0.6M"},
      "Sambalpur":   {p:4500,m:2800,a:1800,trend:"+4.0%",pop:"0.3M"},
      "Berhampur":   {p:4500,m:2800,a:1800,trend:"+4.0%",pop:"0.5M"},
      "Puri":        {p:7000,m:4300,a:2700,trend:"+6.0%",pop:"0.2M"},
    }
  },
  "Punjab": {
    tier:2, cities:{
      "Ludhiana":    {p:9000,m:5500,a:3300,trend:"+6.5%",pop:"1.7M"},
      "Amritsar":    {p:8000,m:5000,a:3000,trend:"+6.0%",pop:"1.3M"},
      "Chandigarh":  {p:13000,m:8000,a:4800,trend:"+7.5%",pop:"1.2M"},
      "Jalandhar":   {p:7500,m:4600,a:2800,trend:"+5.8%",pop:"0.9M"},
      "Patiala":     {p:6500,m:4000,a:2500,trend:"+5.5%",pop:"0.5M"},
      "Mohali":      {p:11000,m:6800,a:4100,trend:"+8.0%",pop:"0.2M"},
    }
  },
  "Rajasthan": {
    tier:2, cities:{
      "Jaipur":    {p:10000,m:6000,a:3600,trend:"+7.5%",pop:"4M"},
      "Jodhpur":   {p:7000,m:4300,a:2700,trend:"+5.8%",pop:"1.5M"},
      "Udaipur":   {p:8000,m:5000,a:3100,trend:"+7.0%",pop:"0.7M"},
      "Kota":      {p:5500,m:3400,a:2100,trend:"+5.0%",pop:"1.2M"},
      "Ajmer":     {p:5000,m:3100,a:1900,trend:"+4.5%",pop:"0.6M"},
      "Bikaner":   {p:4500,m:2800,a:1800,trend:"+4.0%",pop:"0.8M"},
      "Alwar":     {p:6000,m:3700,a:2300,trend:"+5.5%",pop:"0.4M"},
      "Bhilwara":  {p:4500,m:2800,a:1800,trend:"+4.2%",pop:"0.4M"},
    }
  },
  "Sikkim": {
    tier:3, cities:{
      "Gangtok":  {p:8000,m:5000,a:3100,trend:"+6.5%",pop:"0.1M"},
      "Namchi":   {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.05M"},
    }
  },
  "Tamil Nadu": {
    tier:1, cities:{
      "Chennai":    {p:14000,m:8500,a:5000,trend:"+7.5%",pop:"11M"},
      "Coimbatore": {p:8000,m:5000,a:3100,trend:"+7.0%",pop:"2.5M"},
      "Madurai":    {p:6500,m:4000,a:2500,trend:"+5.8%",pop:"1.7M"},
      "Tiruchirappalli":{p:6000,m:3700,a:2300,trend:"+5.5%",pop:"1.1M"},
      "Salem":      {p:5500,m:3400,a:2100,trend:"+5.0%",pop:"0.9M"},
      "Tirunelveli":{p:5000,m:3100,a:1900,trend:"+4.8%",pop:"0.5M"},
      "Tiruppur":   {p:5500,m:3400,a:2100,trend:"+5.2%",pop:"1.0M"},
      "Erode":      {p:5000,m:3100,a:1900,trend:"+4.8%",pop:"0.6M"},
      "Vellore":    {p:5500,m:3400,a:2100,trend:"+5.0%",pop:"0.6M"},
    }
  },
  "Telangana": {
    tier:1, cities:{
      "Hyderabad":   {p:16000,m:9500,a:5500,trend:"+12.0%",pop:"10M"},
      "Warangal":    {p:6000,m:3700,a:2300,trend:"+5.5%",pop:"1.0M"},
      "Nizamabad":   {p:5000,m:3100,a:1900,trend:"+4.5%",pop:"0.5M"},
      "Karimnagar":  {p:5000,m:3100,a:1900,trend:"+4.5%",pop:"0.5M"},
      "Khammam":     {p:4500,m:2800,a:1800,trend:"+4.0%",pop:"0.3M"},
      "Secunderabad":{p:14000,m:8500,a:5000,trend:"+10.5%",pop:"1.5M"},
    }
  },
  "Tripura": {
    tier:3, cities:{
      "Agartala": {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.5M"},
      "Dharmanagar":{p:3500,m:2200,a:1400,trend:"+3.0%",pop:"0.1M"},
    }
  },
  "Uttar Pradesh": {
    tier:2, cities:{
      "Lucknow":     {p:9000,m:5500,a:3300,trend:"+7.0%",pop:"4.5M"},
      "Noida":       {p:14000,m:8500,a:5000,trend:"+9.5%",pop:"1M"},
      "Ghaziabad":   {p:10000,m:6000,a:3600,trend:"+8.0%",pop:"2.5M"},
      "Agra":        {p:6500,m:4000,a:2500,trend:"+5.5%",pop:"2M"},
      "Varanasi":    {p:7000,m:4300,a:2700,trend:"+5.8%",pop:"1.7M"},
      "Kanpur":      {p:6500,m:4000,a:2500,trend:"+5.5%",pop:"3M"},
      "Prayagraj":   {p:6000,m:3700,a:2300,trend:"+5.0%",pop:"1.5M"},
      "Meerut":      {p:7000,m:4300,a:2700,trend:"+5.8%",pop:"1.8M"},
      "Greater Noida":{p:12000,m:7000,a:4200,trend:"+9.0%",pop:"0.6M"},
      "Bareilly":    {p:5500,m:3400,a:2100,trend:"+4.8%",pop:"1M"},
    }
  },
  "Uttarakhand": {
    tier:2, cities:{
      "Dehradun":   {p:10000,m:6000,a:3600,trend:"+8.5%",pop:"0.8M"},
      "Haridwar":   {p:7000,m:4300,a:2700,trend:"+6.5%",pop:"0.3M"},
      "Rishikesh":  {p:8000,m:5000,a:3100,trend:"+7.5%",pop:"0.1M"},
      "Nainital":   {p:9000,m:5500,a:3300,trend:"+8.0%",pop:"0.04M"},
      "Roorkee":    {p:6500,m:4000,a:2500,trend:"+6.0%",pop:"0.1M"},
      "Mussoorie":  {p:11000,m:7000,a:4200,trend:"+9.0%",pop:"0.03M"},
    }
  },
  "West Bengal": {
    tier:1, cities:{
      "Kolkata":      {p:12000,m:7000,a:4200,trend:"+6.5%",pop:"14M"},
      "Howrah":       {p:9000,m:5500,a:3300,trend:"+5.8%",pop:"4.5M"},
      "Durgapur":     {p:5500,m:3400,a:2100,trend:"+4.8%",pop:"0.6M"},
      "Asansol":      {p:5000,m:3100,a:1900,trend:"+4.5%",pop:"1.3M"},
      "Siliguri":     {p:7000,m:4300,a:2700,trend:"+6.5%",pop:"0.8M"},
      "Bardhaman":    {p:4500,m:2800,a:1800,trend:"+4.0%",pop:"0.4M"},
      "Kharagpur":    {p:4500,m:2800,a:1800,trend:"+4.0%",pop:"0.3M"},
    }
  },
  // ─── UNION TERRITORIES ─────────────────────────────────
  "Delhi (NCT)": {
    tier:1, cities:{
      "New Delhi":     {p:24000,m:15000,a:9000,trend:"+8.0%",pop:"10M"},
      "Dwarka":        {p:16000,m:10000,a:6000,trend:"+7.5%",pop:"1.5M"},
      "Rohini":        {p:14000,m:8500,a:5000,trend:"+7.0%",pop:"1M"},
      "Saket":         {p:22000,m:14000,a:8500,trend:"+8.0%",pop:"0.3M"},
      "Lajpat Nagar":  {p:20000,m:13000,a:8000,trend:"+7.8%",pop:"0.5M"},
      "Janakpuri":     {p:15000,m:9000,a:5500,trend:"+7.0%",pop:"0.5M"},
    }
  },
  "Chandigarh (UT)": {
    tier:1, cities:{
      "Chandigarh":  {p:14000,m:8500,a:5000,trend:"+7.5%",pop:"1.2M"},
      "Mohali":      {p:12000,m:7500,a:4500,trend:"+8.0%",pop:"0.2M"},
    }
  },
  "Jammu & Kashmir": {
    tier:2, cities:{
      "Srinagar":  {p:7000,m:4300,a:2700,trend:"+5.5%",pop:"1.4M"},
      "Jammu":     {p:6500,m:4000,a:2500,trend:"+5.0%",pop:"0.7M"},
      "Anantnag":  {p:4500,m:2800,a:1800,trend:"+3.8%",pop:"0.1M"},
    }
  },
  "Ladakh": {
    tier:3, cities:{
      "Leh":    {p:7000,m:4300,a:2700,trend:"+6.0%",pop:"0.03M"},
      "Kargil": {p:4500,m:2800,a:1800,trend:"+3.5%",pop:"0.02M"},
    }
  },
  "Lakshadweep": {
    tier:3, cities:{
      "Kavaratti": {p:6000,m:3700,a:2300,trend:"+4.0%",pop:"0.01M"},
    }
  },
  "Puducherry": {
    tier:2, cities:{
      "Puducherry": {p:9000,m:5500,a:3300,trend:"+7.0%",pop:"0.7M"},
      "Karaikal":   {p:5500,m:3400,a:2100,trend:"+4.5%",pop:"0.2M"},
    }
  },
  "Dadra & Nagar Haveli and Daman & Diu": {
    tier:2, cities:{
      "Daman":          {p:9000,m:5500,a:3300,trend:"+6.5%",pop:"0.1M"},
      "Silvassa":       {p:8000,m:5000,a:3100,trend:"+7.0%",pop:"0.1M"},
      "Diu":            {p:8500,m:5200,a:3200,trend:"+7.5%",pop:"0.05M"},
    }
  },
  "Andaman & Nicobar Islands": {
    tier:2, cities:{
      "Port Blair":  {p:10000,m:6000,a:3600,trend:"+6.0%",pop:"0.1M"},
      "Diglipur":    {p:5500,m:3400,a:2100,trend:"+3.5%",pop:"0.05M"},
    }
  },
};

/* ═══════════════════════════════════════════════════════
   CANVAS ANIMATED BACKGROUND
═══════════════════════════════════════════════════════ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, orbs = [];
function initCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  orbs = Array.from({length: 5}, (_, i) => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 220 + Math.random() * 200,
    vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
    hue: [200, 40, 170, 140, 220][i], sat: 70, lit: 60,
  }));
}
function drawCanvas() {
  ctx.clearRect(0, 0, W, H);
  orbs.forEach(o => {
    o.x += o.vx; o.y += o.vy;
    if (o.x < -o.r) o.x = W + o.r;
    if (o.x > W + o.r) o.x = -o.r;
    if (o.y < -o.r) o.y = H + o.r;
    if (o.y > H + o.r) o.y = -o.r;
    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    g.addColorStop(0, `hsla(${o.hue},${o.sat}%,${o.lit}%,.08)`);
    g.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
  });
  requestAnimationFrame(drawCanvas);
}
window.addEventListener('resize', initCanvas);
initCanvas(); drawCanvas();

/* ═══════════════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════════════ */
let isDark = true;
document.getElementById('themeBtn').addEventListener('click', function() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  this.textContent = isDark ? '🌙' : '☀️';
});

/* ═══════════════════════════════════════════════════════
   STATE → CITY CASCADE DROPDOWNS
═══════════════════════════════════════════════════════ */
const stateSelect = document.getElementById('stateSelect');
const citySelect  = document.getElementById('citySelect');

Object.keys(INDIA).sort().forEach(s => {
  const o = document.createElement('option');
  o.value = o.textContent = s;
  stateSelect.appendChild(o);
});
stateSelect.value = 'Karnataka';

function populateCities() {
  const state = stateSelect.value;
  citySelect.innerHTML = '';
  Object.keys(INDIA[state].cities).forEach(c => {
    const o = document.createElement('option');
    o.value = o.textContent = c;
    citySelect.appendChild(o);
  });
}
stateSelect.addEventListener('change', populateCities);
populateCities();
citySelect.value = 'Bengaluru';

/* ═══════════════════════════════════════════════════════
   TICKER
═══════════════════════════════════════════════════════ */
const tickerItems = Object.entries(INDIA).flatMap(([s, sd]) =>
  Object.entries(sd.cities).slice(0, 2).map(([c, cd]) =>
    `${c}, ${s.split(' ')[0]}<span class="price">₹${(cd.m/1000).toFixed(0)}K/sqft</span>`
  )
);
const thtml = [...tickerItems, ...tickerItems].map(t => `<div class="ticker-item">${t}</div>`).join('');
document.getElementById('tickerTrack').innerHTML = thtml;

/* ═══════════════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════════════ */
function animateCounter(el, target, dur = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = 1;
      animateCounter(e.target, parseInt(e.target.dataset.target));
    }
  });
}, {threshold: .5});
counters.forEach(c => counterObserver.observe(c));

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════ */
const revObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revObserver.unobserve(e.target);
    }
  });
}, {threshold: .12});
document.querySelectorAll('.reveal').forEach(el => revObserver.observe(el));

/* ═══════════════════════════════════════════════════════
   RANGE INPUTS
═══════════════════════════════════════════════════════ */
document.getElementById('area').addEventListener('input', function() {
  document.getElementById('areaVal').textContent = `${parseInt(this.value).toLocaleString('en-IN')} sq ft`;
});
document.getElementById('age').addEventListener('input', function() {
  const v = parseInt(this.value);
  document.getElementById('ageVal').textContent = v === 0 ? 'New / Under Construction' : `${v} year${v===1?'':'s'}`;
});

/* ═══════════════════════════════════════════════════════
   CHECKBOXES
═══════════════════════════════════════════════════════ */
document.querySelectorAll('.cbi').forEach(el => {
  el.addEventListener('click', () => {
    el.classList.toggle('on');
    el.querySelector('.cdot').textContent = el.classList.contains('on') ? '✓' : '';
  });
});

/* ═══════════════════════════════════════════════════════
   PRICING MULTIPLIERS
═══════════════════════════════════════════════════════ */
const floorM   = {ground:.91,low:.97,mid:1,high:1.07,penthouse:1.2};
const propM    = {flat:1,independent:1.09,villa:1.25,studio:.88,plot:.6};
const bhkBonus = {'1':.95,'2':1,'3':1.04,'4':1.08,'5':1.14};
const amenM    = {parking:1.03,security:1.025,gym:1.04,pool:1.055,lift:1.02,clubhouse:1.03,garden:1.02,powerbackup:1.02};
const ageF     = a => Math.max(.68, 1 - a*.0085);
const fcols    = ['#f0b429','#43d9a2','#4da6ff','#e07070','#b57bee','#4dd6d0'];

function formatP(v) {
  if (v >= 1e7) return `₹${(v/1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v/1e5).toFixed(2)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
}

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNT-UP FOR PRICE
═══════════════════════════════════════════════════════ */
function animatePrice(el, target) {
  let start = null;
  const dur = 1200;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    const val = Math.floor(ease * target);
    el.textContent = formatP(val);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════
   SVG GAUGE
═══════════════════════════════════════════════════════ */
function buildGauge(pct) {
  const r = 44, cx = 56, cy = 56;
  const start = Math.PI, sweep = Math.PI; // semicircle bottom
  const rad = (pct / 100) * sweep + start;
  const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(start + sweep), y2 = cy + r * Math.sin(start + sweep);
  const sx = cx + r * Math.cos(start), sy = cy + r * Math.sin(start);
  const ex = cx + r * Math.cos(rad), ey = cy + r * Math.sin(rad);
  const la = pct > 50 ? 1 : 0;
  const color = pct >= 85 ? '#43d9a2' : pct >= 70 ? '#f0b429' : '#e07070';
  return `<svg class="gauge-svg" width="112" height="64" viewBox="0 0 112 64">
    <path d="M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}" stroke="var(--bg3)" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M ${sx} ${sy} A ${r} ${r} 0 ${la} 1 ${ex} ${ey}" stroke="${color}" stroke-width="10" fill="none" stroke-linecap="round" style="transition:stroke-dashoffset 1.2s ease"/>
    <text x="56" y="52" text-anchor="middle" fill="${color}" font-family="Fraunces,serif" font-size="18" font-weight="900">${pct}%</text>
  </svg>`;
}

/* ═══════════════════════════════════════════════════════
   PREDICT
═══════════════════════════════════════════════════════ */
document.getElementById('predictBtn').addEventListener('click', predict);

function predict() {
  const state   = stateSelect.value;
  const city    = citySelect.value;
  const tier    = document.getElementById('tier').value;
  const bhk     = document.getElementById('bhk').value;
  const type    = document.getElementById('propType').value;
  const area    = parseInt(document.getElementById('area').value);
  const floor   = document.getElementById('floor').value;
  const age     = parseInt(document.getElementById('age').value);
  const amenities = [...document.querySelectorAll('.cbi.on')].map(e => e.dataset.v);

  const cd = INDIA[state].cities[city];
  const rate = tier === 'premium' ? cd.p : tier === 'mid' ? cd.m : cd.a;

  let price = rate * area;
  price *= floorM[floor];
  price *= propM[type];
  price *= ageF(age);
  price *= bhkBonus[bhk] || 1;
  let am = 1;
  amenities.forEach(a => { am *= (amenM[a] || 1); });
  price *= am;

  const conf = Math.min(97, 74 + amenities.length * 2.5 + (tier === 'premium' ? 3 : 0) + (INDIA[state].tier === 1 ? 4 : INDIA[state].tier === 2 ? 2 : 0));
  const low = price * .91, high = price * 1.11;
  const perSqft = Math.round(price / area);

  const factors = [
    {n:'Location',  v:Math.round((rate / 30000) * 100)},
    {n:'Area',      v:Math.round((area / 8000) * 100)},
    {n:'Floor',     v:Math.round(floorM[floor] * 90)},
    {n:'Amenities', v:Math.min(100, Math.round(((am - 1) * 800) + 25))},
    {n:'Prop Type', v:Math.round(propM[type] * 80)},
    {n:'Age',       v:Math.round(ageF(age) * 100)},
  ];

  const tierLabel = INDIA[state].tier === 1 ? 'Metro' : INDIA[state].tier === 2 ? 'Major City' : 'Emerging';
  const tierClass = INDIA[state].tier === 1 ? 'tier-1' : INDIA[state].tier === 2 ? 'tier-2' : 'tier-3';
  const trendUp = cd.trend.startsWith('+');

  const panel = document.getElementById('mpanel');
  panel.innerHTML = `
    <div class="rcard fadein">
      <div class="rcard-top"></div>
      <div class="rcard-glow"></div>
      <div class="rlabel">ESTIMATED MARKET VALUE</div>
      <div class="price-display" id="pdisplay">₹0</div>
      <div class="price-range">Range: ${formatP(low)} – ${formatP(high)}</div>
      <div class="price-perSqft">≈ ₹${perSqft.toLocaleString('en-IN')} / sq ft</div>
      <div class="gauge-wrap">
        ${buildGauge(Math.round(conf))}
        <div class="gauge-info">
          <div class="gauge-label">Model Confidence</div>
          <div class="gauge-sub">Based on ${amenities.length} amenities + ${tierLabel} data</div>
        </div>
      </div>
      <div class="rtags">
        <span class="rtag">📍 ${city}, ${state.split(' ')[0]}</span>
        <span class="rtag">📐 ${area.toLocaleString('en-IN')} sq ft</span>
        <span class="rtag">🛏 ${bhk} BHK</span>
        <span class="rtag ${tierClass}">${tierLabel}</span>
        ${amenities.map(a => `<span class="rtag">✓ ${a[0].toUpperCase()+a.slice(1)}</span>`).join('')}
      </div>
    </div>

    <div class="fbreak fadein">
      <div class="fbr-title">Price Factor Breakdown</div>
      ${factors.map((f,i) => `
        <div class="frow">
          <div class="fname">${f.n}</div>
          <div class="fbar-w"><div class="fbar" data-w="${Math.min(f.v,100)}" style="background:${fcols[i]}"></div></div>
          <div class="fval">${Math.min(f.v,100)}%</div>
        </div>
      `).join('')}
    </div>

    <div class="icard fadein">
      <div class="fbr-title">City Insights — ${city}</div>
      <div class="igrid">
        <div class="iitem"><div class="ikey">Avg Rate</div><div class="ival">₹${cd.m.toLocaleString('en-IN')}/sqft</div><div class="isub">Mid-range</div></div>
        <div class="iitem"><div class="ikey">Premium Rate</div><div class="ival">₹${cd.p.toLocaleString('en-IN')}/sqft</div><div class="isub">Central area</div></div>
        <div class="iitem"><div class="ikey">YoY Growth</div><div class="ival ${trendUp?'trend-up':'trend-dn'}">${cd.trend}</div><div class="isub">Market trend</div></div>
        <div class="iitem"><div class="ikey">City Tier</div><div class="ival">${tierLabel}</div><div class="isub">${state}</div></div>
        <div class="iitem"><div class="ikey">Your Rate</div><div class="ival">₹${perSqft.toLocaleString('en-IN')}/sqft</div><div class="isub">This estimate</div></div>
        <div class="iitem"><div class="ikey">Stamp Duty</div><div class="ival">${price>=4500000?'6%':'5%'}</div><div class="isub">Approx</div></div>
        <div class="iitem"><div class="ikey">Population</div><div class="ival">${cd.pop}</div><div class="isub">City est.</div></div>
        <div class="iitem"><div class="ikey">Registration</div><div class="ival">1–2%</div><div class="isub">Of value</div></div>
      </div>
    </div>
  `;

  // Animate price count-up
  animatePrice(document.getElementById('pdisplay'), price);

  // Animate factor bars
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('.fbar[data-w]').forEach(b => {
        b.style.width = b.dataset.w + '%';
      });
    }, 80);
  });
}