"use client"

import { useState } from "react"
import { ShadcnTest } from "@/components/shadcn-test"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"tailwind" | "shadcn">("shadcn")

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-primary-700 mb-4 animate-fade-in">
          🎓 Qimma
        </h1>
        <p className="text-xl text-secondary-600 animate-slide-up mb-8">
          AI-Powered Exam Correction Platform
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={activeTab === "shadcn" ? "default" : "outline"}
            onClick={() => setActiveTab("shadcn")}
          >
            Shadcn/UI Components
          </Button>
          <Button
            variant={activeTab === "tailwind" ? "default" : "outline"}
            onClick={() => setActiveTab("tailwind")}
          >
            Tailwind CSS Test
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto pb-12">
        {activeTab === "shadcn" ? (
          <ShadcnTest />
        ) : (
          <div className="p-8">
            <div className="card max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-6 text-center">
                ✅ Tailwind CSS Configuration Test
              </h2>

              <div className="space-y-6">
                {/* Color Palette Test */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-700 mb-3">Color Palette</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-primary-500 text-white p-3 rounded-lg text-center text-sm font-medium">
                      Primary
                    </div>
                    <div className="bg-secondary-500 text-white p-3 rounded-lg text-center text-sm font-medium">
                      Secondary
                    </div>
                    <div className="bg-success-500 text-white p-3 rounded-lg text-center text-sm font-medium">
                      Success
                    </div>
                    <div className="bg-error-500 text-white p-3 rounded-lg text-center text-sm font-medium">
                      Error
                    </div>
                  </div>
                </div>

                {/* Button Components Test */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-700 mb-3">Custom Button Classes</h3>
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
                  <h3 className="text-lg font-medium text-secondary-700 mb-3">Custom Form Elements</h3>
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
                  <h3 className="text-lg font-medium text-secondary-700 mb-3">Typography</h3>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-primary-700">Heading 1</p>
                    <p className="text-xl font-semibold text-secondary-700">Heading 2</p>
                    <p className="text-base text-secondary-600">Regular paragraph text</p>
                    <p className="text-sm text-secondary-500">Small text</p>
                    <code className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded font-mono text-sm">
                      Code snippet
                    </code>
                  </div>
                </div>

                {/* Responsive Grid Test */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-700 mb-3">Responsive Grid</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-primary-100 text-primary-700 p-4 rounded-lg text-center">
                      Grid Item 1
                    </div>
                    <div className="bg-secondary-100 text-secondary-700 p-4 rounded-lg text-center">
                      Grid Item 2
                    </div>
                    <div className="bg-success-100 text-success-700 p-4 rounded-lg text-center">
                      Grid Item 3
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="card hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-xl">
                    🤖
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-800 mb-2">AI Processing</h3>
                  <p className="text-secondary-600 text-sm">Advanced AI-powered exam correction</p>
                </div>
              </div>

              <div className="card hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-success-100 text-success-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-xl">
                    📊
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-800 mb-2">Analytics</h3>
                  <p className="text-secondary-600 text-sm">Comprehensive performance insights</p>
                </div>
              </div>

              <div className="card hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning-100 text-warning-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-xl">
                    ⚡
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-800 mb-2">Fast Processing</h3>
                  <p className="text-secondary-600 text-sm">Quick and efficient grading</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-secondary-500 text-sm mt-12">
              <p>✨ Custom Tailwind CSS classes working perfectly! ✨</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
