import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Terms and Conditions</h2>
      <div className="space-y-4 text-slate-700 prose max-w-none">
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>
        <p>
          Please read these Terms and Conditions carefully before using the Animalpedia website. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
        </p>
        
        <h3 className="text-xl font-bold text-slate-800 pt-4">1. Content</h3>
        <p>
          The content on this website, including text, graphics, images, and information, is for informational purposes only. While we strive to provide accurate information, we make no representation or warranty of any kind about the completeness, accuracy, or reliability of the information provided.
        </p>

        <h3 className="text-xl font-bold text-slate-800 pt-4">2. Intellectual Property</h3>
        <p>
          The Service and its original content, features, and functionality are and will remain the exclusive property of Animalpedia and its licensors. Our content is protected by copyright and other intellectual property laws.
        </p>

        <h3 className="text-xl font-bold text-slate-800 pt-4">3. User Conduct</h3>
        <p>
            You agree not to use the website in any way that is unlawful, or harms Animalpedia, its service providers, its suppliers, or any other user.
        </p>

        <h3 className="text-xl font-bold text-slate-800 pt-4">4. Links to Other Websites</h3>
        <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by Animalpedia. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
        </p>

        <h3 className="text-xl font-bold text-slate-800 pt-4">5. Changes to Terms</h3>
        <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page.
        </p>
      </div>
    </div>
  );
};

export default Terms;
