import { useState, useEffect } from "react";

interface BuildPreferencesProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  userType?: 'client' | 'developer';
}

const BuildPreferences = ({ data, onChange, userType = 'developer' }: BuildPreferencesProps) => {
  const [preferences, setPreferences] = useState({
    projectTypes: [] as string[],
    preferredCities: [] as string[],
    budgetRange: '',
    workingStyle: '',
    availability: '',
    specializations: [] as string[],
    ...data
  });

  // Sync local state with parent
  useEffect(() => {
    onChange(preferences);
  }, [preferences]);  // Remove onChange from dependencies

  const updatePreferences = (field: string, value: unknown) => {
    const newPreferences = { ...preferences, [field]: value };
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
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
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

      <CheckboxGroup
        title="Preferred Cities"
        field="preferredCities"
        options={[
          "Lagos",
          "Abuja",
          "Port Harcourt",
          "Kano",
          "Ibadan",
          "Benin City",
          "Enugu",
          "Kaduna"
        ]}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Average Budget Range</label>
        <select
          value={preferences.budgetRange}
          onChange={(e) => updatePreferences('budgetRange', e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
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
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">Smart Matching</h3>
            <p className="text-sm text-green-700 mt-1">
              Your preferences help us match you with clients looking for developers with your specific expertise and availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPreferences;
