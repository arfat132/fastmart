import React from 'react';

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className="mb-5 flex flex-wrap font-bold w-[450px]">
      {['Shipping Address ➜', 'Payment Method ➜', 'Place Order'].map(
        (step, index) => (
          <div
            key={step}
            className={` ml-3
          text-center 
       ${
         index <= activeStep
           ? 'border-teal-500   text-teal-500'
           : 'border-gray-400 text-gray-400'
       }
          
       `}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
}