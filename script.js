async function submitResponses(responses) {
    const responseDiv = document.getElementById('response'); // Placeholder for results

    try {
        // Display loading message
        responseDiv.innerText = "Generating your therapy profile...";

        // Send responses to the server
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses })
        });

        if (!response.ok) throw new Error('Failed to fetch profile.');

        // Get the JSON data from the server
        const data = await response.json();
        const therapyProfile = data.profile; // Extract profile from response

        // Update the UI with the therapy profile
        responseDiv.innerHTML = `
            <h2>Your Personalized Therapy Profile:</h2>
            <p>${therapyProfile}</p>
        `;
    } catch (error) {
        console.error(error);
        responseDiv.innerHTML = `
            <h2>Something went wrong</h2>
            <p>Please try again later.</p>
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
