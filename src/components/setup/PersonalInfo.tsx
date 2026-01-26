import { useState, useEffect } from "react";
import { User, Building2, Award, MapPin, Languages, FileText, CheckCircle, Briefcase, Phone, Home, Users, GraduationCap, Trophy, Stethoscope, Scale, Calculator, Wrench, BarChart3, Sun, MessageCircle, Mail, Smartphone, Globe } from "lucide-react";
import Select from "react-select";

interface PersonalInfoProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  userType?: 'client' | 'developer';
}

const PERSONAL_INFO_STORAGE_KEY = 'buildtrust_personal_info';

// Comprehensive list of major African cities
const AFRICAN_CITIES = [
  // North Africa
  { value: 'cairo', label: 'Cairo, Egypt' },
  { value: 'alexandria', label: 'Alexandria, Egypt' },
  { value: 'casablanca', label: 'Casablanca, Morocco' },
  { value: 'marrakech', label: 'Marrakech, Morocco' },
  { value: 'rabat', label: 'Rabat, Morocco' },
  { value: 'tunis', label: 'Tunis, Tunisia' },
  { value: 'sousse', label: 'Sousse, Tunisia' },
  { value: 'algiers', label: 'Algiers, Algeria' },
  { value: 'constantine', label: 'Constantine, Algeria' },
  { value: 'tripoli', label: 'Tripoli, Libya' },
  
  // West Africa
  { value: 'lagos', label: 'Lagos, Nigeria' },
  { value: 'abuja', label: 'Abuja, Nigeria' },
  { value: 'port-harcourt', label: 'Port Harcourt, Nigeria' },
  { value: 'kano', label: 'Kano, Nigeria' },
  { value: 'ibadan', label: 'Ibadan, Nigeria' },
  { value: 'benin-city', label: 'Benin City, Nigeria' },
  { value: 'enugu', label: 'Enugu, Nigeria' },
  { value: 'kaduna', label: 'Kaduna, Nigeria' },
  { value: 'owerri', label: 'Owerri, Nigeria' },
  { value: 'abeokuta', label: 'Abeokuta, Nigeria' },
  { value: 'accra', label: 'Accra, Ghana' },
  { value: 'kumasi', label: 'Kumasi, Ghana' },
  { value: 'dakar', label: 'Dakar, Senegal' },
  { value: 'freetown', label: 'Freetown, Sierra Leone' },
  { value: 'conakry', label: 'Conakry, Guinea' },
  { value: 'monrovia', label: 'Monrovia, Liberia' },
  { value: 'bamako', label: 'Bamako, Mali' },
  { value: 'ouagadougou', label: 'Ouagadougou, Burkina Faso' },
  { value: 'lome', label: 'Lomé, Togo' },
  { value: 'cotonou', label: 'Cotonou, Benin' },
  
  // Central Africa
  { value: 'kinshasa', label: 'Kinshasa, Democratic Republic of Congo' },
  { value: 'lubumbashi', label: 'Lubumbashi, Democratic Republic of Congo' },
  { value: 'brazzaville', label: 'Brazzaville, Republic of Congo' },
  { value: 'libreville', label: 'Libreville, Gabon' },
  { value: 'bangui', label: 'Bangui, Central African Republic' },
  { value: 'yaounde', label: 'Yaoundé, Cameroon' },
  { value: 'douala', label: 'Douala, Cameroon' },
  { value: 'ndjamena', label: 'N\'Djamena, Chad' },
  
  // East Africa
  { value: 'nairobi', label: 'Nairobi, Kenya' },
  { value: 'mombasa', label: 'Mombasa, Kenya' },
  { value: 'dar-es-salaam', label: 'Dar es Salaam, Tanzania' },
  { value: 'dodoma', label: 'Dodoma, Tanzania' },
  { value: 'kampala', label: 'Kampala, Uganda' },
  { value: 'juba', label: 'Juba, South Sudan' },
  { value: 'addis-ababa', label: 'Addis Ababa, Ethiopia' },
  { value: 'dire-dawa', label: 'Dire Dawa, Ethiopia' },
  { value: 'kigali', label: 'Kigali, Rwanda' },
  { value: 'bujumbura', label: 'Bujumbura, Burundi' },
  { value: 'djibouti-city', label: 'Djibouti City, Djibouti' },
  { value: 'mogadishu', label: 'Mogadishu, Somalia' },
  
  // Southern Africa
  { value: 'johannesburg', label: 'Johannesburg, South Africa' },
  { value: 'cape-town', label: 'Cape Town, South Africa' },
  { value: 'durban', label: 'Durban, South Africa' },
  { value: 'pretoria', label: 'Pretoria, South Africa' },
  { value: 'gaborone', label: 'Gaborone, Botswana' },
  { value: 'harare', label: 'Harare, Zimbabwe' },
  { value: 'bulawayo', label: 'Bulawayo, Zimbabwe' },
  { value: 'lusaka', label: 'Lusaka, Zambia' },
  { value: 'lilongwe', label: 'Lilongwe, Malawi' },
  { value: 'blantyre', label: 'Blantyre, Malawi' },
  { value: 'maputo', label: 'Maputo, Mozambique' },
  { value: 'windhoek', label: 'Windhoek, Namibia' },
  { value: 'maseru', label: 'Maseru, Lesotho' },
  { value: 'mbabane', label: 'Mbabane, Eswatini' },
  
  // Indian Ocean
  { value: 'port-louis', label: 'Port Louis, Mauritius' },
  { value: 'victoria', label: 'Victoria, Seychelles' },
];

// Comprehensive list of major cities worldwide
const WORLD_CITIES = [
  // Africa - already included in AFRICAN_CITIES above
  ...AFRICAN_CITIES,
  
  // Europe
  { value: 'london', label: 'London, United Kingdom' },
  { value: 'manchester', label: 'Manchester, United Kingdom' },
  { value: 'birmingham', label: 'Birmingham, United Kingdom' },
  { value: 'paris', label: 'Paris, France' },
  { value: 'marseille', label: 'Marseille, France' },
  { value: 'berlin', label: 'Berlin, Germany' },
  { value: 'munich', label: 'Munich, Germany' },
  { value: 'madrid', label: 'Madrid, Spain' },
  { value: 'barcelona', label: 'Barcelona, Spain' },
  { value: 'rome', label: 'Rome, Italy' },
  { value: 'milan', label: 'Milan, Italy' },
  { value: 'amsterdam', label: 'Amsterdam, Netherlands' },
  { value: 'geneva', label: 'Geneva, Switzerland' },
  { value: 'zurich', label: 'Zurich, Switzerland' },
  { value: 'vienna', label: 'Vienna, Austria' },
  { value: 'prague', label: 'Prague, Czech Republic' },
  { value: 'warsaw', label: 'Warsaw, Poland' },
  { value: 'stockholm', label: 'Stockholm, Sweden' },
  { value: 'oslo', label: 'Oslo, Norway' },
  { value: 'copenhagen', label: 'Copenhagen, Denmark' },
  { value: 'brussels', label: 'Brussels, Belgium' },
  { value: 'athens', label: 'Athens, Greece' },
  { value: 'lisbon', label: 'Lisbon, Portugal' },
  { value: 'dublin', label: 'Dublin, Ireland' },
  { value: 'istanbul', label: 'Istanbul, Turkey' },
  { value: 'moscow', label: 'Moscow, Russia' },
  { value: 'st-petersburg', label: 'Saint Petersburg, Russia' },
  
  // North America
  { value: 'new-york', label: 'New York, USA' },
  { value: 'los-angeles', label: 'Los Angeles, USA' },
  { value: 'chicago', label: 'Chicago, USA' },
  { value: 'houston', label: 'Houston, USA' },
  { value: 'phoenix', label: 'Phoenix, USA' },
  { value: 'philadelphia', label: 'Philadelphia, USA' },
  { value: 'san-antonio', label: 'San Antonio, USA' },
  { value: 'san-diego', label: 'San Diego, USA' },
  { value: 'dallas', label: 'Dallas, USA' },
  { value: 'san-francisco', label: 'San Francisco, USA' },
  { value: 'seattle', label: 'Seattle, USA' },
  { value: 'atlanta', label: 'Atlanta, USA' },
  { value: 'miami', label: 'Miami, USA' },
  { value: 'boston', label: 'Boston, USA' },
  { value: 'denver', label: 'Denver, USA' },
  { value: 'toronto', label: 'Toronto, Canada' },
  { value: 'vancouver', label: 'Vancouver, Canada' },
  { value: 'montreal', label: 'Montreal, Canada' },
  { value: 'calgary', label: 'Calgary, Canada' },
  { value: 'mexico-city', label: 'Mexico City, Mexico' },
  { value: 'guadalajara', label: 'Guadalajara, Mexico' },
  { value: 'cancun', label: 'Cancún, Mexico' },
  
  // Central America & Caribbean
  { value: 'panama-city', label: 'Panama City, Panama' },
  { value: 'san-jose', label: 'San José, Costa Rica' },
  { value: 'havana', label: 'Havana, Cuba' },
  { value: 'kingston', label: 'Kingston, Jamaica' },
  
  // South America
  { value: 'sao-paulo', label: 'São Paulo, Brazil' },
  { value: 'rio-de-janeiro', label: 'Rio de Janeiro, Brazil' },
  { value: 'brasilia', label: 'Brasília, Brazil' },
  { value: 'buenos-aires', label: 'Buenos Aires, Argentina' },
  { value: 'santiago', label: 'Santiago, Chile' },
  { value: 'lima', label: 'Lima, Peru' },
  { value: 'bogota', label: 'Bogotá, Colombia' },
  { value: 'caracas', label: 'Caracas, Venezuela' },
  { value: 'quito', label: 'Quito, Ecuador' },
  { value: 'asuncion', label: 'Asunción, Paraguay' },
  { value: 'montevideo', label: 'Montevideo, Uruguay' },
  
  // Middle East & West Asia
  { value: 'dubai', label: 'Dubai, United Arab Emirates' },
  { value: 'abu-dhabi', label: 'Abu Dhabi, United Arab Emirates' },
  { value: 'dubai', label: 'Dubai, United Arab Emirates' },
  { value: 'doha', label: 'Doha, Qatar' },
  { value: 'riyadh', label: 'Riyadh, Saudi Arabia' },
  { value: 'jeddah', label: 'Jeddah, Saudi Arabia' },
  { value: 'kuwait-city', label: 'Kuwait City, Kuwait' },
  { value: 'beirut', label: 'Beirut, Lebanon' },
  { value: 'amman', label: 'Amman, Jordan' },
  { value: 'jerusalem', label: 'Jerusalem, Israel' },
  { value: 'tel-aviv', label: 'Tel Aviv, Israel' },
  { value: 'tehran', label: 'Tehran, Iran' },
  { value: 'bangkok', label: 'Bangkok, Thailand' },
  
  // South Asia
  { value: 'mumbai', label: 'Mumbai, India' },
  { value: 'delhi', label: 'Delhi, India' },
  { value: 'bangalore', label: 'Bangalore, India' },
  { value: 'hyderabad', label: 'Hyderabad, India' },
  { value: 'kolkata', label: 'Kolkata, India' },
  { value: 'chennai', label: 'Chennai, India' },
  { value: 'pune', label: 'Pune, India' },
  { value: 'karachi', label: 'Karachi, Pakistan' },
  { value: 'islamabad', label: 'Islamabad, Pakistan' },
  { value: 'lahore', label: 'Lahore, Pakistan' },
  { value: 'dhaka', label: 'Dhaka, Bangladesh' },
  { value: 'colombo', label: 'Colombo, Sri Lanka' },
  
  // Southeast Asia
  { value: 'bangkok', label: 'Bangkok, Thailand' },
  { value: 'ho-chi-minh', label: 'Ho Chi Minh City, Vietnam' },
  { value: 'hanoi', label: 'Hanoi, Vietnam' },
  { value: 'manila', label: 'Manila, Philippines' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'kuala-lumpur', label: 'Kuala Lumpur, Malaysia' },
  { value: 'jakarta', label: 'Jakarta, Indonesia' },
  { value: 'bangkok', label: 'Bangkok, Thailand' },
  { value: 'yangon', label: 'Yangon, Myanmar' },
  
  // East Asia
  { value: 'tokyo', label: 'Tokyo, Japan' },
  { value: 'osaka', label: 'Osaka, Japan' },
  { value: 'beijing', label: 'Beijing, China' },
  { value: 'shanghai', label: 'Shanghai, China' },
  { value: 'hong-kong', label: 'Hong Kong' },
  { value: 'taipei', label: 'Taipei, Taiwan' },
  { value: 'seoul', label: 'Seoul, South Korea' },
  { value: 'busan', label: 'Busan, South Korea' },
  
  // Oceania
  { value: 'sydney', label: 'Sydney, Australia' },
  { value: 'melbourne', label: 'Melbourne, Australia' },
  { value: 'brisbane', label: 'Brisbane, Australia' },
  { value: 'perth', label: 'Perth, Australia' },
  { value: 'auckland', label: 'Auckland, New Zealand' },
  { value: 'wellington', label: 'Wellington, New Zealand' },
  { value: 'fiji', label: 'Suva, Fiji' },
  { value: 'samoa', label: 'Apia, Samoa' },
].sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically for easier browsing

// Comprehensive list of African languages
const AFRICAN_LANGUAGES = [
  // West Africa - Nigeria
  { value: 'yoruba', label: 'Yoruba' },
  { value: 'igbo', label: 'Igbo' },
  { value: 'hausa', label: 'Hausa' },
  { value: 'pidgin', label: 'Nigerian Pidgin' },
  { value: 'edo', label: 'Edo' },
  { value: 'tiv', label: 'Tiv' },
  { value: 'ibibio', label: 'Ibibio' },
  { value: 'efik', label: 'Efik' },
  { value: 'fulfulde', label: 'Fulfulde' },
  { value: 'kanuri', label: 'Kanuri' },
  { value: 'nupe', label: 'Nupe' },
  { value: 'ijaw', label: 'Ijaw' },
  { value: 'urhobo', label: 'Urhobo' },
  { value: 'isoko', label: 'Isoko' },
  
  // West Africa - Ghana
  { value: 'akan', label: 'Akan' },
  { value: 'ewe', label: 'Ewe' },
  { value: 'ga', label: 'Ga' },
  { value: 'dagbani', label: 'Dagbani' },
  
  // West Africa - Senegal & others
  { value: 'wolof', label: 'Wolof' },
  { value: 'fula', label: 'Fula' },
  { value: 'serer', label: 'Serer' },
  { value: 'mandinka', label: 'Mandinka' },
  { value: 'bambara', label: 'Bambara' },
  { value: 'soninke', label: 'Soninke' },
  
  // Central Africa
  { value: 'lingala', label: 'Lingala' },
  { value: 'kikongo', label: 'Kikongo' },
  { value: 'tshiluba', label: 'Tshiluba' },
  { value: 'cameroon-pidgin', label: 'Cameroon Pidgin' },
  { value: 'fang', label: 'Fang' },
  { value: 'bulu', label: 'Bulu' },
  { value: 'ewondo', label: 'Ewondo' },
  
  // East Africa
  { value: 'swahili', label: 'Swahili' },
  { value: 'kikuyu', label: 'Kikuyu' },
  { value: 'maasai', label: 'Maasai' },
  { value: 'samburu', label: 'Samburu' },
  { value: 'luo', label: 'Luo' },
  { value: 'kamba', label: 'Kamba' },
  { value: 'somali', label: 'Somali' },
  { value: 'oromo', label: 'Oromo' },
  { value: 'amharic', label: 'Amharic' },
  { value: 'tigrinya', label: 'Tigrinya' },
  { value: 'kinyarwanda', label: 'Kinyarwanda' },
  { value: 'kirundi', label: 'Kirundi' },
  { value: 'luganda', label: 'Luganda' },
  { value: 'lango', label: 'Lango' },
  { value: 'acholi', label: 'Acholi' },
  { value: 'teso', label: 'Teso' },
  
  // Southern Africa
  { value: 'zulu', label: 'Zulu' },
  { value: 'xhosa', label: 'Xhosa' },
  { value: 'sotho', label: 'Sotho' },
  { value: 'tswana', label: 'Tswana' },
  { value: 'venda', label: 'Venda' },
  { value: 'tsonga', label: 'Tsonga' },
  { value: 'afrikaans', label: 'Afrikaans' },
  { value: 'shona', label: 'Shona' },
  { value: 'ndebele', label: 'Ndebele' },
  { value: 'chichewa', label: 'Chichewa' },
  { value: 'bemba', label: 'Bemba' },
  { value: 'nyanja', label: 'Nyanja' },
  
  // North Africa
  { value: 'arabic', label: 'Arabic' },
  { value: 'french', label: 'French' },
  { value: 'tamazight', label: 'Tamazight' },
  { value: 'maghrebi-arabic', label: 'Maghrebi Arabic' },
  
  // International/Colonial languages
  { value: 'english', label: 'English' },
  { value: 'portuguese', label: 'Portuguese' },
  
  // Additional
  { value: 'nuer', label: 'Nuer' },
  { value: 'dinka', label: 'Dinka' },
  { value: 'lala', label: 'Lala' },
  { value: 'lamba', label: 'Lamba' },
  { value: 'kaonda', label: 'Kaonda' },
].sort((a, b) => a.label.localeCompare(b.label));

const PersonalInfo = ({ data, onChange, userType }: PersonalInfoProps) => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    // Try to load from localStorage first
    const savedData = localStorage.getItem(PERSONAL_INFO_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Failed to load personal info from localStorage', e);
      }
    }
    
    // Fallback to props data or default values
    return {
      fullName: '',
      bio: '',
      ...(userType === 'developer' ? {
        role: 'developer',
        companyType: '',
        yearsExperience: '',
        citiesCovered: [] as string[],
        languages: [] as string[],
      } : {
        role: 'client',
        phoneNumber: '',
        currentLocation: '',
        occupation: '',
      }),
      ...data
    };
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(PERSONAL_INFO_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateData = (field: string, value: unknown) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const handleFieldFocus = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const isFieldValid = (field: string, value: unknown): boolean => {
    const stringValue = (value as string)?.trim() || '';
    return stringValue.length > 0;
  };

  const getFieldBorderColor = (field: string, value: unknown): string => {
    if (!touched[field]) return 'border-gray-200';
    return isFieldValid(field, value) ? 'border-gray-200' : 'border-red-500';
  };

  const getFieldBgColor = (field: string, value: unknown): string => {
    if (!touched[field]) return 'bg-gray-50 focus:bg-white';
    return isFieldValid(field, value) ? 'bg-gray-50 focus:bg-white' : 'bg-red-50 focus:bg-red-50';
  };

  const getSelectBorderColor = (field: string, value: unknown): string => {
    if (!touched[field]) return 'border-gray-200';
    return isFieldValid(field, value) ? 'border-gray-200' : 'border-red-500';
  };

  const isFormValid = () => {
    const { fullName, bio } = formData;
    
    // Common required fields
    if (!fullName || !(fullName as string).trim()) return false;
    if (!bio || !(bio as string).trim()) return false;

    if (userType === 'developer') {
      const { companyType, yearsExperience, citiesCovered, languages } = formData;
      if (!companyType || !(companyType as string).trim()) return false;
      if (!yearsExperience || !(yearsExperience as string).trim()) return false;
      
      const cities = (citiesCovered as string[]) || [];
      if (cities.length === 0) return false;
      
      const langs = (languages as string[]) || [];
      if (langs.length === 0) return false;
    } else {
      const { phoneNumber, currentLocation, occupation } = formData;
      if (!phoneNumber || !(phoneNumber as string).trim()) return false;
      if (!currentLocation || !(currentLocation as string).trim()) return false;
      if (!occupation || !(occupation as string).trim()) return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!isFormValid()) {
      return;
    }
    onChange({ ...formData, personalInfoComplete: true });
  };

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = (formData[field as keyof typeof formData] as string[]) || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateData(field, newArray);
  };

  return (
    <div className="space-y-8">
      {userType === 'developer' && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#253E44]/10 rounded-2xl mb-4">
            <User className="w-8 h-8 text-[#253E44]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Personal & Company Information</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Tell us about yourself and your development practice to help clients find you.
          </p>
        </div>
      )}

      {userType === 'developer' ? (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <User className="w-4 h-4 mr-2 text-[#253E44]" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName as string}
                onChange={(e) => updateData('fullName', e.target.value)}
                onFocus={() => handleFieldFocus('fullName')}
                required
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#253E44] transition-all duration-200 text-gray-900 placeholder-gray-500 ${getFieldBorderColor('fullName', formData.fullName)} ${getFieldBgColor('fullName', formData.fullName)}`}
                placeholder="Enter your full name"
              />
            </div>

            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <Building2 className="w-4 h-4 mr-2 text-[#253E44]" />
                Company Type <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.companyType as string}
                onChange={(e) => updateData('companyType', e.target.value)}
                onFocus={() => handleFieldFocus('companyType')}
                required
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#253E44] transition-all duration-200 text-gray-900 ${getSelectBorderColor('companyType', formData.companyType)} ${getFieldBgColor('companyType', formData.companyType)}`}
              >
                <option value="">Select company type</option>
                <option value="solo">Solo Developer</option>
                <option value="firm">Development Firm</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
          </div>

          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
              <Award className="w-4 h-4 mr-2 text-[#253E44]" />
              Years of Experience <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={formData.yearsExperience as string}
              onChange={(e) => updateData('yearsExperience', e.target.value)}
              onFocus={() => handleFieldFocus('yearsExperience')}
              required
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#253E44] transition-all duration-200 text-gray-900 ${getSelectBorderColor('yearsExperience', formData.yearsExperience)} ${getFieldBgColor('yearsExperience', formData.yearsExperience)}`}
            >
              <option value="">Select experience level</option>
              <option value="1-3">1-3 years (Beginner)</option>
              <option value="4-7">4-7 years (Intermediate)</option>
              <option value="8-15">8-15 years (Experienced)</option>
              <option value="15+">15+ years (Expert)</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <User className="w-4 h-4 mr-2 text-[#253E44]" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName as string}
                onChange={(e) => updateData('fullName', e.target.value)}
                onFocus={() => handleFieldFocus('fullName')}
                required
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#226F75]/50 transition-all duration-200 text-gray-900 placeholder-gray-500 ${getFieldBorderColor('fullName', formData.fullName)} ${getFieldBgColor('fullName', formData.fullName)}`}
                placeholder="Enter your full name"
              />
            </div>

            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <Phone className="w-4 h-4 mr-2 text-[#253E44]" />
                Phone Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber as string}
                onChange={(e) => updateData('phoneNumber', e.target.value)}
                onFocus={() => handleFieldFocus('phoneNumber')}
                required
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#253E44] transition-all duration-200 text-gray-900 placeholder-gray-500 ${getFieldBorderColor('phoneNumber', formData.phoneNumber)} ${getFieldBgColor('phoneNumber', formData.phoneNumber)}`}
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <MapPin className="w-4 h-4 mr-2 text-[#253E44]" />
                Current Location <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                options={WORLD_CITIES}
                value={WORLD_CITIES.find(city => city.value === (formData.currentLocation as string))}
                onChange={(selected) => updateData('currentLocation', selected?.value || '')}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Search and select your location..."
                isClearable
                noOptionsMessage={() => "No cities found"}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#e5e7eb',
                    borderWidth: '2px',
                    borderRadius: '0.75rem',
                    backgroundColor: '#f9fafb',
                    '&:hover': {
                      borderColor: '#e5e7eb',
                    },
                    '&:focus': {
                      borderColor: '#3b82f6',
                      outline: 'none',
                    },
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? '#3b82f6' : isFocused ? '#eff6ff' : 'white',
                    color: isSelected ? 'white' : '#1f2937',
                    cursor: 'pointer',
                    padding: '10px 12px',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: '#1f2937',
                  }),
                }}
              />
              <p className="text-xs text-gray-500 mt-2">Select where you are currently located</p>
            </div>

            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <Briefcase className="w-4 h-4 mr-2 text-[#253E44]" />
                Occupation <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.occupation as string}
                onChange={(e) => updateData('occupation', e.target.value)}
                onFocus={() => handleFieldFocus('occupation')}
                required
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#253E44] transition-all duration-200 text-gray-900 ${getSelectBorderColor('occupation', formData.occupation)} ${getFieldBgColor('occupation', formData.occupation)}`}
              >
                <option value="">Select your occupation</option>
                <option value="software-engineer">Software Engineer</option>
                <option value="doctor">Doctor/Medical Professional</option>
                <option value="business-owner">Business Owner/Entrepreneur</option>
                <option value="teacher">Teacher/Educator</option>
                <option value="lawyer">Lawyer/Legal Professional</option>
                <option value="accountant">Accountant/Finance Professional</option>
                <option value="engineer">Engineer</option>
                <option value="consultant">Consultant</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </>
      )}

      {userType === 'developer' && (
        <>
          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
              <MapPin className="w-4 h-4 mr-2 text-[#253E44]" />
              Cities Covered <span className="text-red-500 ml-1">*</span>
            </label>
            <Select
              isMulti
              options={AFRICAN_CITIES}
              value={AFRICAN_CITIES.filter(city => (formData.citiesCovered as string[]).includes(city.value))}
              onChange={(selected) => {
                handleFieldFocus('citiesCovered');
                updateData('citiesCovered', selected ? selected.map(s => s.value) : []);
              }}
              onFocus={() => handleFieldFocus('citiesCovered')}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select cities where you operate..."
              noOptionsMessage={() => "No cities found"}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: touched['citiesCovered'] && ((formData.citiesCovered as string[]) || []).length === 0 ? '#ef4444' : '#e5e7eb',
                  borderWidth: 2,
                  borderRadius: '0.75rem',
                  backgroundColor: touched['citiesCovered'] && ((formData.citiesCovered as string[]) || []).length === 0 ? '#fef2f2' : '#f9fafb',
                  '&:hover': {
                    borderColor: touched['citiesCovered'] && ((formData.citiesCovered as string[]) || []).length === 0 ? '#ef4444' : '#e5e7eb',
                  },
                  '&:focus': {
                    borderColor: '#16a34a',
                    outline: 'none',
                  },
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#16a34a' : isFocused ? '#f0fdf4' : 'white',
                  color: isSelected ? 'white' : '#1f2937',
                  cursor: 'pointer',
                  padding: '10px 12px',
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#dcfce7',
                  borderRadius: '0.5rem',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: '#16a34a',
                  fontWeight: '500',
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: '#16a34a',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#bbf7d0',
                    color: '#15803d',
                  },
                }),
              }}
            />
            <p className="text-xs text-gray-500 mt-2">Select all cities where you operate or provide services</p>
          </div>

          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
              <Languages className="w-4 h-4 mr-2 text-[#253E44]" />
              Languages Spoken <span className="text-red-500 ml-1">*</span>
            </label>
            <Select
              isMulti
              options={AFRICAN_LANGUAGES}
              value={AFRICAN_LANGUAGES.filter(lang => (formData.languages as string[]).includes(lang.value))}
              onChange={(selected) => {
                handleFieldFocus('languages');
                updateData('languages', selected ? selected.map(s => s.value) : []);
              }}
              onFocus={() => handleFieldFocus('languages')}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Search and select languages you speak..."
              noOptionsMessage={() => "No languages found"}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: touched['languages'] && ((formData.languages as string[]) || []).length === 0 ? '#ef4444' : '#e5e7eb',
                  borderWidth: 2,
                  borderRadius: '0.75rem',
                  backgroundColor: touched['languages'] && ((formData.languages as string[]) || []).length === 0 ? '#fef2f2' : '#f9fafb',
                  '&:hover': {
                    borderColor: touched['languages'] && ((formData.languages as string[]) || []).length === 0 ? '#ef4444' : '#e5e7eb',
                  },
                  '&:focus': {
                    borderColor: '#16a34a',
                    outline: 'none',
                  },
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#16a34a' : isFocused ? '#f0fdf4' : 'white',
                  color: isSelected ? 'white' : '#1f2937',
                  cursor: 'pointer',
                  padding: '10px 12px',
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#dcfce7',
                  borderRadius: '0.5rem',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: '#16a34a',
                  fontWeight: '500',
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: '#16a34a',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#bbf7d0',
                    color: '#15803d',
                  },
                }),
              }}
            />
            <p className="text-xs text-gray-500 mt-2">Select all African languages you speak fluently</p>
          </div>
        </>
      )}

      <div className="group">
        <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
          <FileText className={`w-4 h-4 mr-2 ${userType === 'developer' ? 'text-[#253E44]' : 'text-[#226F75]'}`} />
          About / Bio <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={formData.bio as string}
          onChange={(e) => updateData('bio', e.target.value)}
          onFocus={() => handleFieldFocus('bio')}
          rows={5}
          maxLength={500}
          required
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none ${getFieldBorderColor('bio', formData.bio)} ${getFieldBgColor('bio', formData.bio)} ${
            userType === 'developer'
              ? 'focus:ring-[#253E44]'
              : 'focus:ring-[#226F75]'
          }`}
          placeholder={userType === 'developer' ? "Tell potential clients about your experience, specialties, and what makes you unique..." : "Tell developers about your project needs and expectations..."}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">Share your story and {userType === 'developer' ? 'expertise' : 'needs'}</span>
          <span className={`text-xs font-medium ${(formData.bio as string).length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
            {(formData.bio as string).length}/500
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
