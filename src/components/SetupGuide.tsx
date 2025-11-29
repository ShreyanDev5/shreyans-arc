import React from 'react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* 1. Identity Locked */}
      <section className="bg-dark-card p-6 rounded-xl border-l-4 border-brand-primary shadow-lg shadow-black/20 flex items-center justify-between">
        <div>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            Identity Configured
            </h2>
            <p className="text-gray-400 text-sm">
            App Name: <strong className="text-white">Shreyan's Arc</strong> • Theme: <strong className="text-white">Premium Dark</strong>
            </p>
        </div>
        <div className="text-3xl">🚀</div>
      </section>

      {/* 2. Detailed Firebase Guide */}
      <section className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-dark-border"></div>
        <h2 className="text-2xl font-bold text-white mb-6 pl-4 flex items-center gap-2">
            <span>Authentication Setup Guide</span>
            <span className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-1 rounded">Required</span>
        </h2>
        
        <div className="space-y-8 pl-4">
            <div className="bg-dark-card p-8 rounded-xl border border-dark-border shadow-xl">
                <p className="text-gray-300 mb-6 text-sm">
                    Follow these exact steps to enable Google Login. This allows users to save their progress permanently.
                </p>

                <div className="space-y-8">
                    <Step 
                        num="01" 
                        title="Create Firebase Project" 
                        text={
                            <span>
                                Go to <a href="https://console.firebase.google.com" target="_blank" className="text-brand-primary underline hover:text-brand-secondary">console.firebase.google.com</a>.
                                <br/>Click <strong>"Create a project"</strong>.
                                <br/>Name it <code>shreyans-arc</code> (or similar).
                                <br/>Disable Google Analytics (not needed for MVP).
                            </span>
                        } 
                    />
                    
                    <Step 
                        num="02" 
                        title="Enable Google Authentication" 
                        text={
                            <span>
                                In the sidebar, go to <strong>Build</strong> &rarr; <strong>Authentication</strong>.
                                <br/>Click <strong>"Get Started"</strong>.
                                <br/>Select the <strong>Google</strong> provider.
                                <br/>Toggle <strong>Enable</strong>.
                                <br/>Select your support email address.
                                <br/>Click <strong>Save</strong>.
                            </span>
                        } 
                    />

                    <Step 
                        num="03" 
                        title="Configure Authorized Domains (Crucial)" 
                        text={
                            <span>
                                Still in Authentication &rarr; <strong>Settings</strong> tab &rarr; <strong>Authorized domains</strong>.
                                <br/><code>localhost</code> is added by default.
                                <br/><span className="text-brand-accent">Action:</span> If/when you deploy to Vercel/Netlify, you <strong>MUST</strong> come back here and add your live domain (e.g., <code>shreyans-arc.vercel.app</code>) to this list, or login will fail in production.
                            </span>
                        } 
                    />

                    <Step 
                        num="04" 
                        title="Create Firestore Database" 
                        text={
                            <span>
                                In sidebar: <strong>Build</strong> &rarr; <strong>Firestore Database</strong>.
                                <br/>Click <strong>Create Database</strong>.
                                <br/>Select location (e.g., <code>us-central1</code>).
                                <br/><strong className="text-brand-secondary">IMPORTANT:</strong> Choose <strong>Start in Test Mode</strong>.
                                <br/>(We will secure this with rules later, but this prevents errors during development).
                            </span>
                        } 
                    />

                    <Step 
                        num="05" 
                        title="Get API Configuration" 
                        text={
                            <div className="mt-1">
                                <span>
                                    Click the <strong>Gear Icon ⚙️</strong> (Project Settings) next to "Project Overview".
                                    <br/>Scroll down to the "Your apps" section.
                                    <br/>Click the <strong>Web Icon (&lt;/&gt;)</strong>.
                                    <br/>Nickname: "Web-Client". Click Register.
                                    <br/>You will see a <code>firebaseConfig</code> object.
                                </span>
                                <div className="mt-4 p-4 bg-black/50 border border-dark-border rounded text-xs font-mono text-gray-400">
                                    {`const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "...",
  projectId: "...",
  ...
};`}
                                </div>
                                <p className="mt-2 text-brand-accent text-xs">
                                    Keep this config ready. You will need to paste these values into the code I generate next.
                                </p>
                            </div>
                        } 
                    />
                </div>
            </div>
        </div>
      </section>

      {/* 3. Action Area */}
      <section className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 p-8 rounded-2xl border border-brand-primary/20 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Final Confirmation</h3>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
            Once you have completed the steps above and have your <strong>firebaseConfig</strong> values and your <strong>Question List</strong> ready:
        </p>
        <div className="inline-block px-8 py-4 rounded-full bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/25 animate-pulse">
            Ready for Question List
        </div>
      </section>
    </div>
  );
};

const Step: React.FC<{ num: string; title: string; text: React.ReactNode }> = ({ num, title, text }) => (
    <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded bg-dark-highlight flex items-center justify-center font-mono font-bold text-brand-secondary border border-dark-border text-sm">
            {num}
        </div>
        <div>
            <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wide">{title}</h4>
            <div className="text-sm text-gray-400 leading-relaxed font-light">{text}</div>
        </div>
    </div>
);