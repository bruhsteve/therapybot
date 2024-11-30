// Declare isSubmitting variable at the top to ensure it is globally accessible
let isSubmitting = false;

async function submitBrainScan(responses) {
    const responseDiv = document.getElementById('response'); // Placeholder for results

    // Prevent multiple submissions
    if (isSubmitting) return;
    isSubmitting = true;

    // Display loading message
    responseDiv.innerText = "Generating your therapy profile...";

    try {
        // Send the responses to your backend server
        const response = await fetch('https://therapy-bot-backend.onrender.com/api/brain-scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses }), // Send user input
        });

        // Check for a successful response
        if (!response.ok) throw new Error('Failed to generate therapy profile.');

        // Parse the JSON data from the server
        const data = await response.json();

        // Ensure the data contains the profile key
        if (!data.questions || data.questions.length !== 15) {
            throw new Error('Questions not generated properly.');
        }

        const therapyQuestions = data.questions; // Extract the questions from the response

        // Update the UI with the therapy questions
        responseDiv.innerHTML = `<h2>Your Personalized Therapy Questions:</h2><ul>`;
        therapyQuestions.forEach(question => {
            responseDiv.innerHTML += `<li>${question}</li>`;
        });
        responseDiv.innerHTML += `</ul>`;
    } catch (error) {
        // Handle errors if any occur
        console.error('Error:', error);
        responseDiv.innerHTML = `
            <h2>Something went wrong</h2>
            <p>Please try again later. Error: ${error.message}</p>
        `;
    } finally {
        isSubmitting = false;
    }
}

// Attach event listener to the brain scan form
document.getElementById('brain-scan-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload

    // Collect responses from the brain scan form
    const responses = {
        stressLevel: document.getElementById('stress-level').value,
        emotions: document.getElementById('emotions').value,
        mentalHealth: document.getElementById('mental-health').value,
        mindset: document.getElementById('mindset').value,
        sleep: document.getElementById('sleep').value,
    };

    // Submit the responses to the backend
    submitBrainScan(responses);
});
