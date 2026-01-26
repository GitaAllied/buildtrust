import { useState, useEffect, useRef } from "react";
import Select from "react-select";

interface BuildPreferencesProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  userType?: 'client' | 'developer';
}

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

const PREFERENCES_STORAGE_KEY = 'buildtrust_build_preferences';

const BuildPreferences = ({ data, onChange, userType = 'developer' }: BuildPreferencesProps) => {
  const [preferences, setPreferences] = useState(() => {
    // Try to load from localStorage first
    const savedData = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Failed to load preferences from localStorage', e);
      }
    }
    
    // Fallback to props data or default values
    const d = (data || {}) as Record<string, unknown>;
    return {
      projectTypes: (d['project_types'] as string[]) ?? (d['projectTypes'] as string[]) ?? [],
      preferredCities: (d['preferred_cities'] as string[]) ?? (d['preferredCities'] as string[]) ?? [],
      budgetRange: (d['budget_range'] as string) ?? (d['budgetRange'] as string) ?? '',
      workingStyle: (d['working_style'] as string) ?? (d['workingStyle'] as string) ?? '',
      availability: (d['availability'] as string) ?? '',
      specializations: (d['specializations'] as string[]) ?? (d['specializations'] as string[]) ?? [],
    };
  });

  const lastEmittedRef = useRef<string | null>(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Save to localStorage whenever preferences change
  useEffect(() => {
    console.log('💾 Saving preferences to localStorage:', preferences);
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // Sync local state with parent (emit camelCase payload to match parent's formData structure)
  useEffect(() => {
    const serialized = JSON.stringify(preferences);
    if (lastEmittedRef.current !== serialized) {
      lastEmittedRef.current = serialized;
      onChange(preferences);
    }
  }, [preferences, onChange]);

  const updatePreferences = (field: string, value: unknown) => {
    const newPreferences = { ...preferences, [field]: value };
    console.log(`📝 Updating preference field "${field}":`, value);
    setPreferences(newPreferences);
  };

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = preferences[field as keyof typeof preferences] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updatePreferences(field, newArray);
  };

  const CheckboxGroup = ({ 
    title, 
    field, 
    options 
  }: { 
    title: string; 
    field: string; 
    options: string[];
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">{title}</label>
      <div className="grid md:grid-cols-2 gap-2">
        {options.map((option) => {
          const isSelected = (preferences[field as keyof typeof preferences] as string[]).includes(option);
          return (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleArrayItem(field, option)}
                className="w-4 h-4 text-[#253E44] border-gray-300 rounded focus:ring-[#253E44]"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {userType === 'client' ? 'Project Preferences' : 'Build Preferences'}
        </h2>
        <p className="text-gray-600">
          {userType === 'client'
            ? 'Tell us about the type of projects you\'re looking for and your budget range to help match you with the right developers.'
            : 'Tell us about your preferred types of projects and working style to help match you with the right clients.'
          }
        </p>
      </div>

      <CheckboxGroup
        title="Preferred Project Types"
        field="projectTypes"
        options={[
          "Residential Villas",
          "Apartment Complexes",
          "Commercial Buildings",
          "Mixed-Use Developments",
          "Industrial Projects",
          "Renovation Projects",
          "Luxury Developments",
          "Affordable Housing"
        ]}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Cities</label>
        <Select
          isMulti
          options={AFRICAN_CITIES}
          value={AFRICAN_CITIES.filter(city => (preferences.preferredCities as string[]).includes(city.value))}
          onChange={(selected) => {
            updatePreferences('preferredCities', selected ? selected.map(s => s.value) : []);
          }}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Search and select preferred cities..."
          noOptionsMessage={() => "No cities found"}
          styles={{
            control: (base) => ({
              ...base,
              borderColor: '#e5e7eb',
              borderWidth: 2,
              borderRadius: '0.75rem',
              backgroundColor: '#f9fafb',
              '&:hover': {
                borderColor: '#e5e7eb',
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
        <p className="text-xs text-gray-500 mt-2">Select all cities where you prefer to work</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Average Budget Range</label>
        <select
          value={preferences.budgetRange}
          onChange={(e) => updatePreferences('budgetRange', e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44] focus:border-transparent"
        >
          <option value="">Select preferred budget range</option>
          <option value="under-50m">Under ₦50M</option>
          <option value="50m-100m">₦50M - ₦100M</option>
          <option value="100m-500m">₦100M - ₦500M</option>
          <option value="500m-1b">₦500M - ₦1B</option>
          <option value="over-1b">Over ₦1B</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>

      {userType === 'developer' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Style</label>
            <div className="space-y-2">
              {[
                "Hands-on project management",
                "Design and build",
                "Consultation only",
                "Partnership with local teams",
                "Full-service development"
              ].map((style) => (
                <label key={style} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="workingStyle"
                    value={style}
                    checked={preferences.workingStyle === style}
                    onChange={(e) => updatePreferences('workingStyle', e.target.value)}
                    className="w-4 h-4 text-[#253E44] border-gray-300 focus:ring-[#253E44]"
                  />
                  <span className="text-sm text-gray-700">{style}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={preferences.availability}
              onChange={(e) => updatePreferences('availability', e.target.value)}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44] focus:border-transparent"
            >
              <option value="">Select availability</option>
              <option value="immediate">Available immediately</option>
              <option value="1-month">Available in 1 month</option>
              <option value="3-months">Available in 3 months</option>
              <option value="6-months">Available in 6 months</option>
              <option value="planning-only">Planning phase only</option>
            </select>
          </div>

          <CheckboxGroup
            title="Specializations"
            field="specializations"
            options={[
              "Sustainable Building",
              "Smart Home Technology",
              "Traditional Architecture",
              "Modern Design",
              "Project Management",
              "Cost Optimization",
              "Fast Construction",
              "High-end Finishes"
            ]}
          />
        </>
      )}

      <div className="bg-[#253E44]/5 border border-[#253E44]/5 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-[#253E44]/10 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-[#253E44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#253E44]/80">Smart Matching</h3>
            <p className="text-sm text-[#253E44] mt-1">
              Your preferences help us match you with clients looking for developers with your specific expertise and availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPreferences;
