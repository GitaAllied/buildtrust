
interface ProfilePreviewProps {
  formData: any;
}

const ProfilePreview = ({ formData }: ProfilePreviewProps) => {
  const { identity, personal, projects, credentials, preferences } = formData;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Profile Preview</h2>
        <p className="text-gray-600">Review your profile before submitting. You can go back to make any changes.</p>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{personal.fullName || "Your Name"}</h1>
            <p className="text-green-100 mt-1">{personal.companyType || "Developer"} • {personal.yearsExperience || "Experience Level"}</p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{personal.citiesCovered?.join(", ") || "Cities"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="text-sm">{personal.languages?.join(", ") || "Languages"}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 bg-green-500 rounded-full text-sm font-medium">
              ✓ Verified Developer
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      {personal.bio && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">About</h3>
          <p className="text-gray-700 leading-relaxed">{personal.bio}</p>
        </div>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Projects</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((project: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                  <span>{project.type}</span>
                  <span>{project.budget}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
              </div>
            ))}
          </div>
          {projects.length > 4 && (
            <div className="text-center mt-4">
              <span className="text-sm text-gray-500">+{projects.length - 4} more projects</span>
            </div>
          )}
        </div>
      )}

      {/* Preferences Section */}
      {preferences && Object.keys(preferences).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Work Preferences</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {preferences.projectTypes?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Project Types</h4>
                <div className="flex flex-wrap gap-2">
                  {preferences.projectTypes.slice(0, 3).map((type: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {type}
                    </span>
                  ))}
                  {preferences.projectTypes.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{preferences.projectTypes.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
            {preferences.budgetRange && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Range</h4>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {preferences.budgetRange}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Section */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Submit</h3>
        <p className="text-gray-600 mb-4">
          Your profile will be reviewed by our team within 24-48 hours. Once approved, you'll start receiving project invitations from verified clients.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Identity Verified</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Profile Complete</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Ready for Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
