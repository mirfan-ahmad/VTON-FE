import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for trying out our service',
    features: [
      '5 Virtual Try-Ons per month',
      'Basic clothing catalog',
      'Standard resolution output',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Best for fashion enthusiasts',
    features: [
      'Unlimited Try-Ons',
      'Premium clothing catalog',
      'HD resolution output',
      'Priority support',
      'Custom wardrobe integration',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For businesses and retailers',
    features: [
      'Custom API access',
      'White-label solution',
      '4K resolution output',
      'Dedicated support',
      'Analytics dashboard',
      'Custom integration',
    ],
  },
];

export function Pricing() {
  return (
    <div className="flex flex-col">
      <section className="bg-gray-50 py-24">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="flex flex-col rounded-lg border bg-white p-8"
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-600">/month</span>}
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 text-blue-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8">Get Started</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}