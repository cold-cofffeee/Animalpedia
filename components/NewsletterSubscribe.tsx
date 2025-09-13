import React, { useState } from 'react';

const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle the API call here.
    // For this example, we'll just simulate a success.
    if (email) {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return <p className="text-green-600 font-medium">Thank you for subscribing!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label htmlFor="email-subscribe" className="sr-only">Email address</label>
      <input
        id="email-subscribe"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your.email@example.com"
        required
        className="flex-grow w-full px-3 py-2 border border-slate-300 rounded-md bg-white shadow-sm focus:ring-sky-500 focus:border-sky-500 transition text-sm"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition text-sm"
      >
        Subscribe
      </button>
    </form>
  );
};

export default NewsletterSubscribe;
