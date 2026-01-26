
import { useEffect, useState } from 'react';

interface ProfilePreviewProps {
  formData: any;
  onStepChange?: (step: number) => void;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

const ProfilePreview = ({ formData, onStepChange }: ProfilePreviewProps) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { identity, personal, projects, credentials, preferences } = formData;

  // Comprehensive validation function
  const validateAllData = (): ValidationResult => {
    const errors: Record<string, string[]> = {};

    // Step 1: Personal Info validation
    if (!personal?.fullName?.trim()) {
      errors.personal = [...(errors.personal || []), 'Full name is required'];
    }
    if (!personal?.bio?.trim()) {
      errors.personal = [...(errors.personal || []), 'Bio/description is required'];
    }
    if (!personal?.role) {
      errors.personal = [...(errors.personal || []), 'User role could not be determined'];
    }
    if (!personal?.companyType) {
      errors.personal = [...(errors.personal || []), 'Company type is required'];
    }
    if (!personal?.yearsExperience) {
      errors.personal = [...(errors.personal || []), 'Years of experience is required'];
    }
    if (!personal?.citiesCovered || personal.citiesCovered.length === 0) {
      errors.personal = [...(errors.personal || []), 'At least one city must be selected'];
    }
    if (!personal?.languages || personal.languages.length === 0) {
      errors.personal = [...(errors.personal || []), 'At least one language must be selected'];
    }

    // Step 2: Identity Verification validation
    if (!identity?.hasId) {
      errors.identity = [...(errors.identity || []), 'Government ID is required'];
    }
    if (!identity?.hasCac) {
      errors.identity = [...(errors.identity || []), 'CAC document is required'];
    }
    if (!identity?.hasSelfie) {
      errors.identity = [...(errors.identity || []), 'Selfie verification is required'];
    }

    // Step 3: Licenses & Credentials validation
    if (!credentials?.licenses || credentials.licenses.length === 0) {
      errors.credentials = [...(errors.credentials || []), 'At least one license document is required'];
    }
    if (!credentials?.certifications || credentials.certifications.length === 0) {
      errors.credentials = [...(errors.credentials || []), 'At least one certification is required'];
    }
    if (!credentials?.testimonials || credentials.testimonials.length === 0) {
      errors.credentials = [...(errors.credentials || []), 'At least one testimonial is required'];
    }

    // Step 4: Project Gallery validation
    if (!projects || projects.length === 0) {
      errors.projects = ['At least one project must be added'];
    } else {
      const invalidProjects = projects.filter(
        (p: any) => !p.title?.trim() || !p.type || !p.location?.trim() || !p.budget || !p.description?.trim()
      );
      if (invalidProjects.length > 0) {
        errors.projects = [`${invalidProjects.length} project(s) have incomplete information`];
      }
    }

    // Step 5: Build Preferences validation
    if (!preferences?.projectTypes || preferences.projectTypes.length === 0) {
      errors.preferences = [...(errors.preferences || []), 'At least one project type must be selected'];
    }
    if (!preferences?.preferredCities || preferences.preferredCities.length === 0) {
      errors.preferences = [...(errors.preferences || []), 'At least one preferred city must be selected'];
    }
    if (!preferences?.budgetRange) {
      errors.preferences = [...(errors.preferences || []), 'Budget range is required'];
    }
    if (!preferences?.workingStyle) {
      errors.preferences = [...(errors.preferences || []), 'Working style preference is required'];
    }
    if (!preferences?.availability) {
      errors.preferences = [...(errors.preferences || []), 'Availability is required'];
    }
    if (!preferences?.specializations || preferences.specializations.length === 0) {
      errors.preferences = [...(errors.preferences || []), 'At least one specialization must be selected'];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleSubmit = () => {
    const validation = validateAllData();
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      window.scrollTo(0, 0);
      return;
    }

    setSubmitting(true);
    // TODO: Submit profile data to backend
    console.log('Profile submission:', formData);
  };

  const getStepNumber = (section: string): number => {
    const stepMap: Record<string, number> = {
      personal: 1,
      identity: 2,
      credentials: 3,
      projects: 4,
      preferences: 5,
    };
    return stepMap[section];
  };

  const goToStep = (section: string) => {
    const step = getStepNumber(section);
    if (onStepChange) {
      onStepChange(step);
    }
  };

  const ValidationAlert = ({ section, errors }: { section: string; errors: string[] }) => (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 mb-2">Issues found:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => goToStep(section)}
            className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
          >
            Fix on Step {getStepNumber(section)}
          </button>
        </div>
      </div>
    </div>
  );

  const validation = validateAllData();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Profile Preview</h2>
        <p className="text-gray-600">Review your profile before submitting. You can go back to make any changes.</p>
      </div>

      {/* Validation Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Profile Validation Issues</h3>
              <p className="text-red-700 mb-4">Please fix the following issues before submitting:</p>
              <div className="space-y-3">
                {validationErrors.personal && <ValidationAlert section="personal" errors={validationErrors.personal} />}
                {validationErrors.identity && <ValidationAlert section="identity" errors={validationErrors.identity} />}
                {validationErrors.credentials && <ValidationAlert section="credentials" errors={validationErrors.credentials} />}
                {validationErrors.projects && <ValidationAlert section="projects" errors={validationErrors.projects} />}
                {validationErrors.preferences && <ValidationAlert section="preferences" errors={validationErrors.preferences} />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className={`bg-gradient-to-r from-[#253E44]/80 to-[#253E44]/90 rounded-xl p-6 text-white ${validation.errors.personal ? 'ring-2 ring-red-500' : ''}`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{personal?.fullName || "Your Name"}</h1>
            <p className="text-white mt-1">{personal?.companyType || "Company Type"} • {personal?.yearsExperience || "Experience"} years</p>
            <p className="text-white/80 text-sm mt-1">Role: {personal?.role || "Not specified"}</p>
            <div className="flex items-center space-x-4 mt-3 flex-wrap gap-2">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs">{personal?.citiesCovered?.length || 0} Cities</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="text-xs">{personal?.languages?.length || 0} Languages</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${validation.errors.identity ? 'bg-red-500/30 text-red-100' : 'bg-[#253E44]/50 text-white'}`}>
              {validation.errors.identity ? '⚠ Verify' : '✓ Verified'}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      {personal?.bio && (
        <div className={`bg-white border-2 rounded-lg p-6 ${validation.errors.personal ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">About</h3>
            <span className="text-xs font-medium text-gray-500">Step 1</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{personal.bio}</p>
        </div>
      )}

      {/* Personal Information Detail */}
      {personal && (
        <div className={`bg-white border-2 rounded-lg p-6 ${validation.errors.personal ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${validation.errors.personal ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {validation.errors.personal ? 'Incomplete' : 'Complete'}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
              <p className="text-gray-900 font-medium mt-1">{personal.fullName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Company Type</p>
              <p className="text-gray-900 font-medium mt-1">{personal.companyType || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Years of Experience</p>
              <p className="text-gray-900 font-medium mt-1">{personal.yearsExperience || '—'} years</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Professional Role</p>
              <p className="text-gray-900 font-medium mt-1">{personal.role || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Cities Covered</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {personal.citiesCovered?.slice(0, 3).map((city: string) => (
                  <span key={city} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {city}
                  </span>
                ))}
                {personal.citiesCovered?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                    +{personal.citiesCovered.length - 3}
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Languages</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {personal.languages?.slice(0, 3).map((lang: string) => (
                  <span key={lang} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {lang}
                  </span>
                ))}
                {personal.languages?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                    +{personal.languages.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Identity Verification Summary */}
      <div className={`bg-white border-2 rounded-lg p-6 ${validation.errors.identity ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Identity Verification</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${validation.errors.identity ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {validation.errors.identity ? 'Incomplete' : 'Complete'}
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${identity?.hasId ? 'bg-green-100' : 'bg-red-100'}`}>
              {identity?.hasId ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Government ID</p>
              <p className="text-xs text-gray-500">{identity?.hasId ? 'Uploaded' : 'Not uploaded'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${identity?.hasCac ? 'bg-green-100' : 'bg-red-100'}`}>
              {identity?.hasCac ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">CAC Document</p>
              <p className="text-xs text-gray-500">{identity?.hasCac ? 'Uploaded' : 'Not uploaded'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${identity?.hasSelfie ? 'bg-green-100' : 'bg-red-100'}`}>
              {identity?.hasSelfie ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Selfie</p>
              <p className="text-xs text-gray-500">{identity?.hasSelfie ? 'Uploaded' : 'Not uploaded'}</p>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 mt-4 inline-block">Step 2</span>
      </div>

      {/* Licenses & Credentials Summary */}
      <div className={`bg-white border-2 rounded-lg p-6 ${validation.errors.credentials ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Licenses & Credentials</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${validation.errors.credentials ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {validation.errors.credentials ? 'Incomplete' : 'Complete'}
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Licenses</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#253E44]">{credentials?.licenses?.length || 0}</span>
              <span className="text-xs text-gray-500">file(s)</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Certifications</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#253E44]">{credentials?.certifications?.length || 0}</span>
              <span className="text-xs text-gray-500">file(s)</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Testimonials</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#253E44]">{credentials?.testimonials?.length || 0}</span>
              <span className="text-xs text-gray-500">file(s)</span>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 mt-4 inline-block">Step 3</span>
      </div>

      {/* Projects Section */}
      <div className={`bg-white border-2 rounded-lg p-6 ${validation.errors.projects ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Featured Projects</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${validation.errors.projects ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {validation.errors.projects ? 'Incomplete' : `${projects?.length || 0} Project(s)`}
          </span>
        </div>
        {projects && projects.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">{project.title || 'Untitled'}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-2 flex-wrap gap-1">
                    <span className="px-2 py-1 bg-gray-100 rounded">{project.type || '—'}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">{project.budget || '—'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description || 'No description'}</p>
                  <p className="text-xs text-gray-500 mt-2">Location: {project.location || '—'}</p>
                </div>
              ))}
            </div>
            {projects.length > 4 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                +{projects.length - 4} more projects
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">No projects added yet</p>
        )}
        <span className="text-xs font-medium text-gray-500 mt-4 inline-block">Step 4</span>
      </div>

      {/* Build Preferences Section */}
      <div className={`bg-white border-2 rounded-lg p-6 ${validation.errors.preferences ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Work Preferences</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${validation.errors.preferences ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {validation.errors.preferences ? 'Incomplete' : 'Complete'}
          </span>
        </div>
        <div className="space-y-4">
          {preferences?.projectTypes?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Project Types</h4>
              <div className="flex flex-wrap gap-2">
                {preferences.projectTypes.slice(0, 5).map((type: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-[#253E44]/10 text-[#253E44]/80 rounded text-xs font-medium">
                    {type}
                  </span>
                ))}
                {preferences.projectTypes.length > 5 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    +{preferences.projectTypes.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {preferences?.preferredCities?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Cities</h4>
              <div className="flex flex-wrap gap-2">
                {preferences.preferredCities.slice(0, 5).map((city: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {city}
                  </span>
                ))}
                {preferences.preferredCities.length > 5 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    +{preferences.preferredCities.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {preferences?.budgetRange && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Range</h4>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                {preferences.budgetRange}
              </span>
            </div>
          )}

          {preferences?.workingStyle && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Working Style</h4>
              <p className="text-gray-600 text-sm">{preferences.workingStyle}</p>
            </div>
          )}

          {preferences?.availability && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
              <p className="text-gray-600 text-sm">{preferences.availability}</p>
            </div>
          )}

          {preferences?.specializations?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {preferences.specializations.slice(0, 5).map((spec: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                    {spec}
                  </span>
                ))}
                {preferences.specializations.length > 5 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    +{preferences.specializations.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-gray-500 mt-4 inline-block">Step 5</span>
      </div>

      {/* Submit Section */}
      <div className={`bg-gradient-to-r from-gray-50 to-[#253E44]/5 border-2 rounded-lg p-6 text-center ${validation.isValid ? 'border-green-200' : 'border-red-200'}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${validation.isValid ? 'bg-green-100' : 'bg-amber-100'}`}>
          {validation.isValid ? (
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {validation.isValid ? 'Ready to Submit' : 'Profile Incomplete'}
        </h3>
        <p className="text-gray-600 mb-4">
          {validation.isValid
            ? 'Your profile is complete and ready for submission. Once submitted, our team will review your profile within 24-48 hours.'
            : `Please fix ${Object.keys(validation.errors).length} section(s) above before submitting your profile.`}
        </p>

        {validation.isValid && (
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6 flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Identity Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Profile Complete</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Ready for Review</span>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !validation.isValid}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            validation.isValid
              ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Submitting...' : validation.isValid ? 'Submit Profile' : 'Fix Issues to Continue'}
        </button>

        {!validation.isValid && (
          <p className="text-xs text-red-600 mt-3">
            ⚠ Click on the red sections above to navigate to pages that need fixes
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePreview;
