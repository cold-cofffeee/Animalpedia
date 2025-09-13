import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Privacy Policy</h2>
      <div className="space-y-4 text-slate-700 prose max-w-none">
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>
        <p>
          Welcome to Animalpedia. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
        
        <h3 className="text-xl font-bold text-slate-800 pt-4">1. Information We Collect</h3>
        <p>
          We may collect personal information such as your name and email address when you voluntarily subscribe to our newsletter. We may also collect non-personal information, such as browser type, operating system, and website usage data through analytics services.
        </p>

        <h3 className="text-xl font-bold text-slate-800 pt-4">2. Use of Your Information</h3>
        <p>
          We use the information we collect to:
        </p>
        <ul>
            <li>Send you newsletters and promotional materials.</li>
            <li>Improve our website and user experience.</li>
            <li>Monitor and analyze usage and trends.</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 pt-4">3. Disclosure of Your Information</h3>
        <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, so long as those parties agree to keep this information confidential.
        </p>

        <h3 className="text-xl font-bold text-slate-800 pt-4">4. Cookies</h3>
        <p>
            Our website may use cookies to enhance your experience. You can choose to disable cookies through your browser settings, but this may affect the functionality of the site.
        </p>

        <h3 className="text-xl font-bold text-slate-800 pt-4">5. Contact Us</h3>
        <p>
            If you have any questions about this Privacy Policy, please contact us through the information provided on our About page.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
