function typeText(text, elementId, callback, speed = 50) {
  let index = 0;
  function type() {
      const element = document.getElementById(elementId);
      if (element) {
        if (index < text.length) {
            // Handle line break by checking for a special marker (e.g., '\n')
            if (text.charAt(index) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text.charAt(index);
            }
            index++;
            setTimeout(type, speed); // Adjust speed as needed
        }
    } else {
        console.error(`Element with id "${elementId}" not found.`);
    }
  }
  type();
}

// Start the typing animation on page load
window.onload = function () {
  const textToType = "Before we begin, we need to understand you better.\nPlease hold still while we scan your mind and memories.";
  typeText(textToType, "typing-text");
};

// Wait until the DOM is fully loaded
window.onload = function() {
  // Attach an event listener to the "Next" button
  const nextBtn = document.getElementById('nextBtnScene2');
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function(event) {
      // Prevent the default link behavior to handle it in JS
      event.preventDefault();

      // Get the value of the selected radio button (stress level)
      const selectedStressLevel = document.querySelector('input[name="stress"]:checked');
      
      if (selectedStressLevel) {
        // Store the selected stress level in localStorage
        localStorage.setItem('userStressLevel', selectedStressLevel.value);
        console.log("Stored stress level:", selectedStressLevel.value);
      } else {
        // If no radio button is selected, log a warning
        console.log("No stress level selected");
      }

      // Now navigate to the next page
      window.location.href = "scene2.html";
    });
  }
};

window.onload = function() {
  // Attach an event listener to the "Next" button
  const nextBtn = document.getElementById('nextBtnScene3');

  if (nextBtn) {
    nextBtn.addEventListener('click', function(event) {
      // Prevent the default link behavior to handle it in JS
      event.preventDefault();

      // Get the user's input from the text field
      const userResponse = document.getElementById('response-input').value;

      if (userResponse) {
        // Store the user's response in localStorage
        localStorage.setItem('userEmotionResponse', userResponse);
        console.log("Stored emotion response:", userResponse);
      } else {
        // If no response is provided, log a warning
        console.log("No response entered");
      }

      // Now navigate to the next page
      window.location.href = "scene3.html";
    });
  }
};

// Wait for the page to load before adding event listeners
window.onload = function() {
  // Event listener for the "Next" button click
  document.getElementById('nextBtnScene4').addEventListener('click', function(event) {
    // Prevent default behavior (navigate immediately)
    event.preventDefault();
    
    // Get the selected stress level value
    let selectedStress = null;
    const stressButtons = document.getElementsByName('stress');
    
    // Find the selected radio button
    for (let i = 0; i < stressButtons.length; i++) {
      if (stressButtons[i].checked) {
        selectedStress = stressButtons[i].value;
        break;
      }
    }

    // If a value is selected, store it in localStorage (or sessionStorage if preferred)
    if (selectedStress !== null) {
      localStorage.setItem('stressLevel', selectedStress);
      console.log('Stored Final Thoughts:', localStorage.getItem('stressLevel'));

      // Redirect to the next page (scene4.html)
      window.location.href = "scene4.html";
    } else {
      // If no radio button is selected, alert the user to select one
      alert("Please select a stress level before proceeding.");
    }
  });
};

window.onload = function() {
  // Variables for the buttons
  const yesButton = document.getElementById('yes-button');
  const noButton = document.getElementById('no-button');
  const nextBtn = document.getElementById('nextBtnScene5');
  
  // Store the user's response
  let userResponse = null;

  // Event listener for the "YES" button
  yesButton.addEventListener('click', function() {
    userResponse = "YES";
  });

  // Event listener for the "NO" button
  noButton.addEventListener('click', function() {
    userResponse = "NO";
  });

  // Event listener for the "Next" button click
  nextBtn.addEventListener('click', function(event) {
    // Prevent default behavior (immediate navigation)
    event.preventDefault();
    
    // Check if a response was selected
    if (userResponse !== null) {
      // Store the response in localStorage (or sessionStorage)
      localStorage.setItem('hopefulResponse', userResponse);
      console.log('Stored Final Thoughts:', localStorage.getItem('hopefulResponse'));

      // Navigate to the next page (scene5.html)
      window.location.href = "scene5.html";
    } else {
      // If no response is selected, alert the user to choose an option
      alert("Please select an option before proceeding.");
    }
  });
};

window.onload = function() {
  // Get the "Next" button and the input field
  const nextBtn = document.getElementById('nextBtnResult');
  const responseInput = document.getElementById('response-input');
  
  // Event listener for the "Next" button click
  nextBtn.addEventListener('click', function(event) {
    // Prevent default behavior (immediate navigation)
    event.preventDefault();

    // Get the value entered in the text input field
    const userResponse = responseInput.value.trim();

    // Check if the input is not empty
    if (userResponse !== "") {
      // Store the response in localStorage (or sessionStorage)
      localStorage.setItem('finalThoughtsResponse', userResponse);
      console.log('Stored Final Thoughts:', localStorage.getItem('finalThoughtsResponse'));

      // Navigate to the next page (result.html)
      window.location.href = "result.html";
    } else {
      // If no response is entered, alert the user to provide an answer
      alert("Please enter your final thoughts before proceeding.");
    }
  });
};

// Assuming you have retrieved the responses as variables
const emotions = localStorage.getItem("emotions"); // User's emotions
const innerStrength = localStorage.getItem("innerStrength"); // User's rating of inner strength (1-10)
const hopefulFuture = localStorage.getItem("hopefulFuture"); // User's response to feeling hopeful about their future (yes/no)
const finalThoughts = localStorage.getItem("finalThoughts"); // User's final thoughts on their journey

// Create the prompt for ChatGPT
const prompt = `
The user is immersed in a therapeutic scenario where they are repairing a broken mirror. As they go through this experience, they are asked a series of reflective questions. Here are their responses:

1. **Emotions**: As they fit the piece into place, the user describes their emotions: "${emotions}".
2. **Inner Strength Rating**: The user rates their inner strength on a scale from 1 to 10: ${innerStrength}.
3. **Hope for the Future**: The user is asked if they feel hopeful about their future as they mend the cracks in the mirror. Their answer is: "${hopefulFuture}".
4. **Final Thoughts**: As the user gazes at their reflection, they reflect on their journey. Their final thoughts are: "${finalThoughts}".

Given this context, provide a holistic therapeutic suggestion that addresses their emotional state, inner strength, and outlook for the future. Aim to offer empathetic guidance, acknowledging their current feelings, strength, and sense of hope or uncertainty.
`;


async function getTherapeuticAdvice() {
  try {
    const response = await fetch("https://therapy-bot-backend.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const data = await response.json();
    console.log("Therapeutic advice:", data);

    // Display therapeutic suggestion
    const suggestion = data.choices[0].message.content.trim();
    const resultText4 = document.getElementById("resulttext4");
    resultText4.innerHTML = suggestion;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getTherapeuticAdvice();