let isSubmitting = false;  // To prevent multiple submissions

async function submitBrainScanResponses(responses) {
    const responseDiv = document.getElementById('response');  // Placeholder for results

    if (isSubmitting) return;  // Prevent multiple submissions
    isSubmitting = true;
    responseDiv.innerText = "Generating personalized therapy questions...";

    try {
        // Send brain scan responses to the backend to get therapy questions
        const response = await fetch('https://your-backend-url/api/brain-scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses }),  // Send the brain scan responses
        });

        if (!response.ok) throw new Error('Failed to fetch therapy questions.');

        // Get the therapy questions from the server
        const data = await response.json();
        const therapyQuestions = data.questions;

        // Display the therapy questions to the user for input
        showTherapyQuestions(therapyQuestions);
    } catch (error) {
        console.error('Error:', error);
        responseDiv.innerHTML = `<h2>Something went wrong</h2><p>Please try again later. Error: ${error.message}</p>`;
    } finally {
        isSubmitting = false;  // Re-enable submission
    }
}

// Display therapy questions one by one
function showTherapyQuestions(questions) {
    const responseDiv = document.getElementById('response');
    let currentQuestionIndex = 0;
    const responses = [];

    // Function to show the next question
    function displayNextQuestion() {
        if (currentQuestionIndex < questions.length) {
            responseDiv.innerHTML = `
                <h2>Question ${currentQuestionIndex + 1}:</h2>
                <p>${questions[currentQuestionIndex]}</p>
                <input type="text" id="user-response" />
                <button onclick="submitAnswer()">Next</button>
            `;
        } else {
            // Once all questions are answered, submit the responses
            submitTherapyProfile(responses);
        }
    }

    // Function to handle the answer and move to the next question
    function submitAnswer() {
        const userResponse = document.getElementById('user-response').value;
        if (userResponse) {
            responses.push(userResponse);
            currentQuestionIndex++;
            displayNextQuestion();
        } else {
            alert("Please answer the question before moving on.");
        }
    }

    displayNextQuestion();  // Start the first question
}

// Submit the therapy responses to generate a therapy profile
async function submitTherapyProfile(responses) {
    const responseDiv = document.getElementById('response');

    if (isSubmitting) return;  // Prevent multiple submissions
    isSubmitting = true;
    responseDiv.innerText = "Generating your personalized therapy profile...";

    try {
        // Send therapy responses to the backend to generate a profile
        const response = await fetch('https://your-backend-url/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses }),  // Send user answers
        });

        if (!response.ok) throw new Error('Failed to generate therapy profile.');

        // Get the personalized therapy profile from the server
        const data = await response.json();
        const therapyProfile = data.profile;

        // Display the therapy profile to the user
        responseDiv.innerHTML = `
            <h2>Your Personalized Therapy Profile:</h2>
            <p>${therapyProfile}</p>
        `;
    } catch (error) {
        console.error('Error:', error);
        responseDiv.innerHTML = `<h2>Something went wrong</h2><p>Please try again later. Error: ${error.message}</p>`;
    } finally {
        isSubmitting = false;  // Re-enable submission
    }
}

// Attach event listener to the initial brain scan form (assuming this is the first step)
document.getElementById('brain-scan-form').addEventListener('submit', (event) => {
    event.preventDefault();  // Prevent page reload

    // Collect responses from input fields (assumes you're collecting responses for the brain scan)
    const responses = [...document.querySelectorAll('.brain-scan-input')].map(input => input.value);

    // Submit the brain scan responses to get therapy questions
    submitBrainScanResponses(responses);
});
