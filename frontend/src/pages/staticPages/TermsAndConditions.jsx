import React from "react";

const TermsAndConditions = () => {
  return (
    <div>
      {/* Content */}
      <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>Terms And Conditions</h4>
      </div>
      <hr />
      <main className="container bg-white d-flex flex-column gap-3">
        <span>
          Welcome to Travelers need! By accessing or using our website and
          services, you agree to comply with the following Terms and Conditions.
          Please read them carefully before proceeding.
        </span>

        <ol>
          <li>
            <h3>
              <span>Acceptance of Terms</span>
            </h3>
            <p>
              By using this website, you acknowledge that you have read,
              understood, and agree to these Terms and Conditions. If you do not
              agree, please refrain from using our services.
            </p>
          </li>
          <li>
            <h3>
              <span>Use of Services</span>
            </h3>
            <ul>
              <li>
                You agree to provide accurate, complete, and up-to-date
                information when booking or registering with us.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials and all activities under your account.
              </li>
            </ul>
          </li>
          <li>
            <h3>
              <span>Booking and Payments</span>
            </h3>
            <ul>
              <li>
                All bookings are subject to availability and confirmation.
              </li>
              <li>
                Prices displayed on the website are subject to change without
                prior notice.
              </li>
              <li>
                Full payment or a deposit may be required at the time of
                booking. Outstanding balances must be settled before the
                specified deadline.
              </li>
            </ul>
          </li>
          <li>
            <h3>
              <span>Cancellations and Refunds</span>
            </h3>
            <ul>
              <li>
                Cancellation and refund policies vary by travel package and
                provider. Please refer to the specific terms associated with
                your booking.
              </li>
              <li>
                Refunds may be subject to processing fees, and certain bookings
                may be non-refundable.
              </li>
            </ul>
          </li>
        </ol>
      </main>
    </div>
  );
};

export default TermsAndConditions;
