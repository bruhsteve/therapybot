// Declare isSubmitting variable at the top to ensure it is globally accessible

async function submitResponses(responses) {
    const responseDiv = document.getElementById('response'); // Placeholder for results

    // Prevent multiple submissions
    try {
        // Display loading message
        responseDiv.innerText = "Generating your therapy profile...";

        // Send responses to your backend server
        const response = await fetch('https://therapy-bot-backend.onrender.com/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses }), // Send user input
        });

        // Check for a successful response
        if (!response.ok) throw new Error('Failed to fetch profile.');

        // Parse the JSON data from the server
        const data = await response.json();

        // Ensure the data contains the profile key
        if (!data.profile) {
            throw new Error('Profile not found in response.');
        }

        const therapyProfile = data.profile; // Extract the profile from the response

        // Update the UI with the therapy profile
        responseDiv.innerHTML = `
            <h2>Your Personalized Therapy Profile:</h2>
            <p>${therapyProfile}</p>
        `;
    } catch (error) {
        // Handle errors if any occur
        console.error('Error:', error);
        responseDiv.innerHTML = `
            <h2>Something went wrong</h2>
            <p>Please try again later. Error: ${error.message}</p>
        `;
    } 
}

// Attach event listener to the quiz form
document.getElementById('quiz-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload

    // Collect responses from input fields
    const responses = [...document.querySelectorAll('.quiz-input')].map(input => input.value);

    // Submit the responses to the server
    submitResponses(responses);
});
