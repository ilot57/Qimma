'use client';

import { useState } from 'react';

import { ShadcnTest } from '@/components/shadcn-test';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tailwind' | 'shadcn'>('shadcn');

  return (
    <main className="from-primary-50 to-secondary-50 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <div className="py-12 text-center">
        <h1 className="text-primary-700 animate-fade-in mb-4 text-5xl font-bold">
          🎓 Qimma
        </h1>
        <p className="text-secondary-600 animate-slide-up mb-8 text-xl">
          AI-Powered Exam Correction Platform
        </p>

        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center gap-2">
          <Button
            variant={activeTab === 'shadcn' ? 'default' : 'outline'}
            onClick={() => setActiveTab('shadcn')}
          >
            Shadcn/UI Components
          </Button>
          <Button
            variant={activeTab === 'tailwind' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tailwind')}
          >
            Tailwind CSS Test
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl pb-12">
        {activeTab === 'shadcn' ? (
          <ShadcnTest />
        ) : (
          <div className="p-8">
            <div className="card mx-auto max-w-2xl">
              <h2 className="text-secondary-800 mb-6 text-center text-2xl font-semibold">
                ✅ Tailwind CSS Configuration Test
              </h2>

              <div className="space-y-6">
                {/* Color Palette Test */}
                <div>
                  <h3 className="text-secondary-700 mb-3 text-lg font-medium">
                    Color Palette
                  </h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="bg-primary-500 rounded-lg p-3 text-center text-sm font-medium text-white">
                      Primary
                    </div>
                    <div className="bg-secondary-500 rounded-lg p-3 text-center text-sm font-medium text-white">
                      Secondary
                    </div>
                    <div className="bg-success-500 rounded-lg p-3 text-center text-sm font-medium text-white">
                      Success
                    </div>
                    <div className="bg-error-500 rounded-lg p-3 text-center text-sm font-medium text-white">
                      Error
                    </div>
                  </div>
                </div>

                {/* Button Components Test */}
                <div>
                  <h3 className="text-secondary-700 mb-3 text-lg font-medium">
                    Custom Button Classes
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="btn-primary">Primary Button</button>
                    <button className="btn-secondary">Secondary Button</button>
                    <button className="btn-success">Success Button</button>
                    <button className="btn-warning">Warning Button</button>
                    <button className="btn-error">Error Button</button>
                  </div>
                </div>

                {/* Form Elements Test */}
                <div>
                  <h3 className="text-secondary-700 mb-3 text-lg font-medium">
                    Custom Form Elements
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Custom input field"
                      className="input-field"
                    />
                    <select className="input-field">
                      <option>Select an option</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                  </div>
                </div>

                {/* Typography Test */}
                <div>
                  <h3 className="text-secondary-700 mb-3 text-lg font-medium">
                    Typography
                  </h3>
                  <div className="space-y-2">
                    <p className="text-primary-700 text-3xl font-bold">
                      Heading 1
                    </p>
                    <p className="text-secondary-700 text-xl font-semibold">
                      Heading 2
                    </p>
                    <p className="text-secondary-600 text-base">
                      Regular paragraph text
                    </p>
                    <p className="text-secondary-500 text-sm">Small text</p>
                    <code className="bg-secondary-100 text-secondary-800 rounded px-2 py-1 font-mono text-sm">
                      Code snippet
                    </code>
                  </div>
                </div>

                {/* Responsive Grid Test */}
                <div>
                  <h3 className="text-secondary-700 mb-3 text-lg font-medium">
                    Responsive Grid
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-primary-100 text-primary-700 rounded-lg p-4 text-center">
                      Grid Item 1
                    </div>
                    <div className="bg-secondary-100 text-secondary-700 rounded-lg p-4 text-center">
                      Grid Item 2
                    </div>
                    <div className="bg-success-100 text-success-700 rounded-lg p-4 text-center">
                      Grid Item 3
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="card transition-shadow duration-300 hover:shadow-lg">
                <div className="text-center">
                  <div className="bg-primary-100 text-primary-600 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-xl">
                    🤖
                  </div>
                  <h3 className="text-secondary-800 mb-2 text-lg font-semibold">
                    AI Processing
                  </h3>
                  <p className="text-secondary-600 text-sm">
                    Advanced AI-powered exam correction
                  </p>
                </div>
              </div>

              <div className="card transition-shadow duration-300 hover:shadow-lg">
                <div className="text-center">
                  <div className="bg-success-100 text-success-600 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-xl">
                    📊
                  </div>
                  <h3 className="text-secondary-800 mb-2 text-lg font-semibold">
                    Analytics
                  </h3>
                  <p className="text-secondary-600 text-sm">
                    Comprehensive performance insights
                  </p>
                </div>
              </div>

              <div className="card transition-shadow duration-300 hover:shadow-lg">
                <div className="text-center">
                  <div className="bg-warning-100 text-warning-600 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-xl">
                    ⚡
                  </div>
                  <h3 className="text-secondary-800 mb-2 text-lg font-semibold">
                    Fast Processing
                  </h3>
                  <p className="text-secondary-600 text-sm">
                    Quick and efficient grading
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-secondary-500 mt-12 text-center text-sm">
              <p>✨ Custom Tailwind CSS classes working perfectly! ✨</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
