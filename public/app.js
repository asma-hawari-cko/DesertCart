/* global CheckoutWebComponents */

async function performriskChecks(data){
  return true;
}

async function utilizeToken(data) {
  try {
    const cardData = {
      token: data.token,           // Card token obtained from the response
      bin: data.bin,               // Card BIN (Bank Identification Number)
      card_category: data.card_category, // Card category (e.g., CONSUMER)
      card_type: data.card_type,   // Card type (e.g., CREDIT)
      expiry_month: data.expiry_month, // Expiry month
      expiry_year: data.expiry_year,   // Expiry year
      last4: data.last4,           // Last 4 digits of the card
      issuer: data.issuer,         // Issuer name (e.g., CKO, WHERE THE WORLD CHECKS OUT)
      issuer_country: data.issuer_country, // Issuer country (e.g., GB)
      name: data.name,             // Cardholder name
      phone: data.phone,           // Phone number (if available)
      product_id: data.product_id, // Product ID (e.g., "F")
      product_type: data.product_type, // Product type (e.g., Visa Classic)
      scheme: data.scheme,         // Card scheme (e.g., VISA)
      expires_on: data.expires_on, // Expiry date in full format
    };


    // Handle the response from your backend (e.g., confirmation of successful payment)
    if (data.card_type === "CREDIT") {
      console.log("Payment processed successfully!");
      // Optionally, trigger a success message or redirect to a success page
    } else {
      console.error("Payment failed BLOCKED FOR DEBIT");
      // Handle payment failure (e.g., show a failure message)
    }
  } catch (error) {
    console.error("Error during payment processing", error);
    // Handle any errors (e.g., network errors, server errors)
  }
}

(async () => {
  // Insert your public key here
  const PUBLIC_KEY = "pk_sbox_nbxb62mmfenoyusjtisldfek7i6";

  const response = await fetch("/create-payment-sessions", { method: "POST" }); // Order
  const paymentSession = await response.json();

  if (!response.ok) {
    console.error("Error creating payment session", paymentSession);
    return;
  }


  /*async function PerformPaymentSubmission(session_data){
    const SECRET_KEY = "";
    const response = await fetch(
      `https://api.sandbox.checkout.com/payment-sessions/${paymentSession.id}/submit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 900,
          session_data:session_data,
        }),
      });
      console.log("RESPONSE", response.json());
    return response.json();
  }*/

  const checkout = await CheckoutWebComponents({
    publicKey: PUBLIC_KEY,
    environment: "sandbox",
    locale: "en-GB",
    paymentSession,
    onReady: () => {
      console.log("onReady");
    },

  onCardBinChanged: (_component, cardMetadata) => {
    console.log(cardMetadata);
      if (cardMetadata.card_type === 'Debit') {
        return {
          continue: false,
          errorMessage: 'Credit cards are not accepted.',
        };
      }
      return { continue: true };
    },

  onTokenized  :   async (_component, tokenizedResult) => {
    console.log('Tokenized DATA are', tokenizedResult);
    const cardriskresult = await performriskChecks(tokenizedResult)

    if (cardriskresult.result  === 'abort'){
      return {
        continue :  false , 
        errorMessage : "This card is not supported",
        

      };
    }
    return { continue: true };
  },
    
    onPaymentCompleted: async (_component, paymentResponse) => {  // Make this function async
      console.log("Create Payment with PaymentId: ", paymentResponse.id);
      //const { data } = await _component.tokenize();  // Assuming `_component` is the cardComponent
     // console.log(data.token);
      //console.log(data);
     

    // await utilizeToken(data);
    },
    onChange: (component) => {
      console.log(
        `onChange() -> isValid: "${component.isValid()}" for "${
          component.type
        }"`,
      );
    },
    onError: (component, error) => {
      console.log("onError", error, "Component", component.type);
    },

    //handleSubmit : async(_component,{session_data}) => {
     // console.log('HANDLE SUBMIT');
    //  console.log(session_data);
    //const submitResponse = await PerformPaymentSubmission(session_data);
    //return session_data;
   // },
  
  });


  const flowComponent = checkout.create("flow");

  flowComponent.mount(document.getElementById("flow-container"));

  //const applepayComponent = checkout.create("tabby");
  //if (await applepayComponent.isAvailable()) {
  //  applepayComponent.mount(document.getElementById("flow-container"));
  //}
})();

function triggerToast(id) {
  var element = document.getElementById(id);
  element.classList.add("show");

  setTimeout(function () {
    element.classList.remove("show");
  }, 5000);
}

const urlParams = new URLSearchParams(window.location.search);
const paymentStatus = urlParams.get("status");
const paymentId = urlParams.get("cko-payment-id");

if (paymentStatus === "succeeded") {
  triggerToast("successToast");
}

if (paymentStatus === "failed") {
  triggerToast("failedToast");
}

if (paymentId) {
  console.log("Create Payment with PaymentId: ", paymentId);
}
