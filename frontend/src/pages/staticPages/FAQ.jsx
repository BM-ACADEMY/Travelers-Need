import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import faq from "../../images/FAQLogo.png";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { 
      category: 'Payments',
      questions: [
        {
          question: 'Do you have online payment facility?',
          answer:
            'Travelers need is an online travel website where travellers can search, calculate price & book tours. We accept all major cards, net banking & wallets as well.',
        },
        {
          question: 'Does Travelers need offer any deal/discount(s)?',
          answer: 
          'Yes, Travelers Need regularly offers special deals and discounts on various tour packages. These may include seasonal offers and promotional deals. Please check our website or subscribe to our newsletter to stay updated on the latest discounts and offers.',
        },
        {
          question: 'Do you accept International cards for payment?',
          answer: 'Yes, we accept international payment methods, including Visa, MasterCard, and American Express. Travelers can securely use their international cards to make payments for bookings on our platform.',
        },
        {
          question: 'What is EMI related procedure?',
          answer: 'We offer easy EMI options for bookings made with eligible credit cards, allowing you to split payments into convenient monthly installments without extra hassle.',
        },
      ],
    },
    {
      category: 'Post-Booking',
      questions: [
        {
          question: 'Where can I find detailed booking policy?',
          answer: 'You can find our detailed booking policy on the "Booking Policy" section of our website. It provides all the necessary information about cancellations, refunds, and terms of service.',
        },
        {
          question: 'Do I need to call hotel to reconfirm my reservation?',
          answer: 'It’s a good idea to call the hotel to reconfirm your reservation. This ensures your booking is secure and that any special requests are noted.',
        },
      ],
    },
  ];

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container my-5">
      {/* FAQ Header */}
      <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>FAQ </h4>
      </div>
      <hr />
      <div className="text-center mb-4">
        <img src={faq} alt="FAQ Logo" className="img-fluid" style={{ maxWidth: '500px' }} />
      </div>

      {/* FAQ Content */}
      {faqs.map((faq, catIndex) => (
        <div key={catIndex} className="mb-5">
          <h2 style={{ color: "#ef156c" }}>{faq.category}</h2>
          {faq.questions.map((item, index) => (
            <div key={index} className="border-bottom pb-3 mb-3">
              <div
                className="d-flex align-items-center justify-content-between "
                onClick={() => toggleQuestion(`${catIndex}-${index}`)}
                style={{ cursor: 'pointer',color:"black" }}
              >
                <span>{item.question}</span>
                <FontAwesomeIcon
                  icon={activeIndex === `${catIndex}-${index}` ? faChevronUp : faChevronDown}
                />
              </div>
              {activeIndex === `${catIndex}-${index}` && (
                <div className="mt-2 text-secondary">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

   
    </div>
  );
};

export default FAQ;
