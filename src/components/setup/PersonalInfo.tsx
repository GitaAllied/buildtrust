
import { useState } from "react";
import { User, Building2, Award, MapPin, Languages, FileText, CheckCircle, Briefcase, Phone, Home, Users, GraduationCap, Trophy, Stethoscope, Scale, Calculator, Wrench, BarChart3, Sun, MessageCircle, Mail, Smartphone, Globe } from "lucide-react";

interface PersonalInfoProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  userType?: 'client' | 'developer';
}

const PersonalInfo = ({ data, onChange, userType = 'developer' }: PersonalInfoProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({
    fullName: '',
    bio: '',
    ...(userType === 'developer' ? {
      companyType: '',
      yearsExperience: '',
      citiesCovered: [] as string[],
      languages: [] as string[],
    } : {
      phoneNumber: '',
      currentLocation: '',
      occupation: '',
      preferredContact: '',
    }),
    ...data
  });

  const updateData = (field: string, value: unknown) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const isFormValid = () => {
    const { fullName, bio } = formData;
    
    // Common required fields
    if (!fullName || !(fullName as string).trim()) return false;
    if (!bio || !(bio as string).trim()) return false;

    if (userType === 'developer') {
      const { companyType, yearsExperience } = formData;
      if (!companyType || !(companyType as string).trim()) return false;
      if (!yearsExperience || !(yearsExperience as string).trim()) return false;
    } else {
      const { phoneNumber, currentLocation, occupation, preferredContact } = formData;
      if (!phoneNumber || !(phoneNumber as string).trim()) return false;
      if (!currentLocation || !(currentLocation as string).trim()) return false;
      if (!occupation || !(occupation as string).trim()) return false;
      if (!preferredContact || !(preferredContact as string).trim()) return false;
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
            <User className="w-8 h-8 text-green-600" />
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
                <User className="w-4 h-4 mr-2 text-green-600" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName as string}
                onChange={(e) => updateData('fullName', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <Building2 className="w-4 h-4 mr-2 text-green-600" />
                Company Type <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.companyType as string}
                onChange={(e) => updateData('companyType', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
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
              <Award className="w-4 h-4 mr-2 text-green-600" />
              Years of Experience <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={formData.yearsExperience as string}
              onChange={(e) => updateData('yearsExperience', e.target.value)}
              required
              className="w-full md:w-1/2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
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
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName as string}
                onChange={(e) => updateData('fullName', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                Phone Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber as string}
                onChange={(e) => updateData('phoneNumber', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Current Location <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.currentLocation as string}
                onChange={(e) => updateData('currentLocation', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
              >
                <option value="">Select your location</option>
                <option value="lagos">Lagos, Nigeria</option>
                <option value="abuja">Abuja, Nigeria</option>
                <option value="london">London, UK</option>
                <option value="manchester">Manchester, UK</option>
                <option value="birmingham">Birmingham, UK</option>
                <option value="toronto">Toronto, Canada</option>
                <option value="vancouver">Vancouver, Canada</option>
                <option value="montreal">Montreal, Canada</option>
                <option value="new-york">New York, USA</option>
                <option value="atlanta">Atlanta, USA</option>
                <option value="dallas">Dallas, USA</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                Occupation <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.occupation as string}
                onChange={(e) => updateData('occupation', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
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

          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
              <MessageCircle className="w-4 h-4 mr-2 text-blue-600" />
              Preferred Contact Method <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
                { value: 'phone', label: 'Phone Call', icon: Phone },
                { value: 'email', label: 'Email', icon: Mail },
                { value: 'sms', label: 'SMS', icon: MessageCircle }
              ].map((method) => {
                const IconComponent = method.icon;
                return (
                  <label key={method.value} className={`flex items-center space-x-2 cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    formData.preferredContact === method.value
                      ? 'bg-blue-50 border-blue-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-200'
                  }`}>
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method.value}
                      checked={formData.preferredContact === method.value}
                      onChange={(e) => updateData('preferredContact', e.target.value)}
                      required
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      formData.preferredContact === method.value
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {formData.preferredContact === method.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex items-center space-x-1">
                      <IconComponent className="w-4 h-4" />
                      <span className={`text-sm transition-colors ${
                        formData.preferredContact === method.value ? 'text-blue-800 font-medium' : 'text-gray-700'
                      }`}>{method.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}

      {userType === 'developer' && (
        <>
          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              Cities Covered
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan",
                "Benin City", "Enugu", "Kaduna", "Owerri", "Abeokuta"
              ].map((city) => {
                const isSelected = (formData.citiesCovered as string[]).includes(city);
                return (
                  <label key={city} className={`flex items-center space-x-2 cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'bg-green-50 border-green-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-green-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleArrayItem('citiesCovered', city)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm transition-colors ${
                      isSelected ? 'text-green-800 font-medium' : 'text-gray-700'
                    }`}>{city}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
              <Languages className="w-4 h-4 mr-2 text-green-600" />
              Languages Spoken
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "English", "Yoruba", "Igbo", "Hausa", "Pidgin",
                "Edo", "Tiv", "Ibibio", "Efik", "Fulfulde"
              ].map((language) => {
                const isSelected = (formData.languages as string[]).includes(language);
                return (
                  <label key={language} className={`flex items-center space-x-2 cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'bg-green-50 border-green-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-green-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleArrayItem('languages', language)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm transition-colors ${
                      isSelected ? 'text-green-800 font-medium' : 'text-gray-700'
                    }`}>{language}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="group">
        <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
          <FileText className={`w-4 h-4 mr-2 ${userType === 'developer' ? 'text-green-600' : 'text-blue-600'}`} />
          About / Bio <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={formData.bio as string}
          onChange={(e) => updateData('bio', e.target.value)}
          rows={5}
          maxLength={500}
          required
          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 resize-none ${
            userType === 'developer'
              ? 'focus:ring-green-500 focus:border-green-500'
              : 'focus:ring-blue-500 focus:border-blue-500'
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

      <div className="flex gap-3">
        <button
          onClick={handleNext}
          disabled={!isFormValid()}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isFormValid()
              ? userType === 'developer'
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Next Step
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
