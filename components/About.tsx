import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">About Animalpedia</h2>
      <div className="space-y-4 text-slate-700">
        <p>
          Animalpedia is a digital encyclopedia dedicated to providing accurate, engaging, and easily accessible information about the animal kingdom. Our mission is to foster a deeper understanding and appreciation for the incredible diversity of life on our planet.
        </p>
        <p>
          We believe that knowledge is the first step towards conservation. By presenting well-organized facts, fascinating articles, and intuitive tools, we aim to inspire curiosity and encourage our users to learn more about the animals we share the Earth with.
        </p>
        <p>
          Whether you're a student working on a project, a teacher looking for resources, or simply a curious individual, Animalpedia is here to be your reliable guide to the wonders of nature.
        </p>
      </div>
    </div>
  );
};

export default About;
