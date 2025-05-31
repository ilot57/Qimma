'use client';

import { useState } from 'react';

import { Check, CreditCard, Star, X, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
  bonus?: {
    credits: number;
    description: string;
  };
  features: string[];
}

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  onPurchaseComplete?: (credits: number) => void;
}

const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 25,
    price: 9.99,
    pricePerCredit: 0.4,
    features: [
      'Perfect for small classes',
      'Grade up to 25 exams',
      'Basic AI feedback',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    credits: 100,
    price: 29.99,
    pricePerCredit: 0.3,
    popular: true,
    bonus: {
      credits: 20,
      description: '20 bonus credits included!',
    },
    features: [
      'Most popular choice',
      'Grade up to 120 exams total',
      'Advanced AI feedback',
      'Priority support',
      'Bulk grading tools',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 500,
    price: 99.99,
    pricePerCredit: 0.2,
    bonus: {
      credits: 100,
      description: '100 bonus credits included!',
    },
    features: [
      'Best value for schools',
      'Grade up to 600 exams total',
      'Premium AI feedback',
      'Phone & email support',
      'Custom integrations',
      'Analytics dashboard',
    ],
  },
];

function PackageCard({
  package: pkg,
  isSelected,
  onSelect,
  currentCredits,
}: {
  package: CreditPackage;
  isSelected: boolean;
  onSelect: (packageId: string) => void;
  currentCredits: number;
}) {
  const totalCredits = pkg.credits + (pkg.bonus?.credits || 0);
  const finalCredits = currentCredits + totalCredits;

  return (
    <div
      className={cn(
        'relative cursor-pointer rounded-xl border-2 p-6 transition-all',
        isSelected
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-gray-200 hover:border-gray-300',
        pkg.popular && 'ring-opacity-50 ring-2 ring-emerald-500'
      )}
      onClick={() => onSelect(pkg.id)}
    >
      {/* Popular badge */}
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
            <Star className="h-3 w-3" />
            Most Popular
          </div>
        </div>
      )}

      {/* Package header */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
        <div className="mt-2 flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
          <span className="text-sm text-gray-500">USD</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          ${pkg.pricePerCredit.toFixed(2)} per credit
        </p>
      </div>

      {/* Credits display */}
      <div className="mt-4 rounded-lg bg-gray-50 p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5 text-emerald-600" />
          <span className="text-xl font-bold text-gray-900">
            {pkg.credits} Credits
          </span>
        </div>

        {pkg.bonus && (
          <div className="mt-2 flex items-center justify-center gap-1">
            <span className="text-sm font-medium text-emerald-600">
              + {pkg.bonus.credits} bonus
            </span>
            <span className="text-sm text-gray-500">
              = {totalCredits} total
            </span>
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500">
          New balance: {finalCredits} credits
        </div>
      </div>

      {/* Features list */}
      <ul className="mt-4 space-y-2">
        {pkg.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Selection indicator */}
      {isSelected && (
        <div className="mt-4 flex items-center justify-center rounded-lg bg-emerald-100 py-2">
          <Check className="mr-2 h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">Selected</span>
        </div>
      )}
    </div>
  );
}

export function CreditPurchaseModal({
  isOpen,
  onClose,
  currentCredits,
  onPurchaseComplete,
}: CreditPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] =
    useState<string>('professional');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPkg = creditPackages.find((pkg) => pkg.id === selectedPackage);

  const handlePurchase = async () => {
    if (!selectedPkg) return;

    setIsProcessing(true);

    try {
      // TODO: Implement actual purchase logic with Stripe
      console.log('🛒 Processing purchase:', selectedPkg);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Calculate final credits
      const purchasedCredits =
        selectedPkg.credits + (selectedPkg.bonus?.credits || 0);

      // Call completion handler
      onPurchaseComplete?.(purchasedCredits);

      // Close modal
      onClose();

      // Show success message (could be a toast notification)
      console.log('✅ Purchase completed successfully!');
    } catch (error) {
      console.error('❌ Purchase failed:', error);
      // Handle error (show error message to user)
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="bg-opacity-50 absolute inset-0 bg-black"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 rounded-t-xl border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Purchase Credits
              </h2>
              <p className="text-sm text-gray-500">
                Current balance: {currentCredits} credits
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Package selection */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {creditPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isSelected={selectedPackage === pkg.id}
                onSelect={setSelectedPackage}
                currentCredits={currentCredits}
              />
            ))}
          </div>

          {/* Purchase summary */}
          {selectedPkg && (
            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{selectedPkg.name}</span>
                  <span className="font-medium">${selectedPkg.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits</span>
                  <span className="font-medium">{selectedPkg.credits}</span>
                </div>
                {selectedPkg.bonus && (
                  <div className="flex justify-between">
                    <span className="text-emerald-600">Bonus Credits</span>
                    <span className="font-medium text-emerald-600">
                      +{selectedPkg.bonus.credits}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">
                      Total Credits
                    </span>
                    <span className="font-bold text-gray-900">
                      {selectedPkg.credits + (selectedPkg.bonus?.credits || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 rounded-b-xl border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Secure payment powered by Stripe
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={isProcessing || !selectedPkg}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Purchase for ${selectedPkg?.price}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
