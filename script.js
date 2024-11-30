document.getElementById('brain-scan-form').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent page reload

    // Collect responses from the brain scan form
    const responses = {
        stressLevel: document.getElementById('stress-level').value,
        emotions: document.getElementById('emotions').value,
        mentalHealth: document.getElementById('mental-health').value,
        mindset: document.getElementById('mindset').value,
        sleep: document.getElementById('sleep').value,
    };

    // Show loading message
    document.getElementById('response').innerText = "Generating your therapy questions...";

    try {
        // Fetch therapy questions based on brain scan input
        const response = await fetch('https://therapy-bot-backend.onrender.com/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses }),  // Send user responses
        });

        const data = await response.json();

        if (!data.questions || data.questions.length === 0) {
            throw new Error('No therapy questions received.');
        }

        // Hide brain scan form and display therapy questions
        document.getElementById('brain-scan-form').style.display = 'none';
        document.getElementById('therapy-questions-section').style.display = 'block';

        // Display therapy questions dynamically
        const therapyQuestionsContainer = document.getElementById('therapy-questions-container');
        therapyQuestionsContainer.innerHTML = '';  // Clear any previous questions

        data.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('therapy-question');
            questionDiv.innerHTML = `
                <label for="question-${index}">${question}</label>
                <textarea id="question-${index}" rows="4" required></textarea>
            `;
            therapyQuestionsContainer.appendChild(questionDiv);
        });

        // Show submit button after questions are generated
        document.getElementById('submit-therapy-questions').style.display = 'inline-block';

        // Handle form submission for therapy questions
        document.getElementById('submit-therapy-questions').addEventListener('click', async () => {
            const therapyResponses = [];
            for (let i = 0; i < data.questions.length; i++) {
                const userResponse = document.getElementById(`question-${i}`).value;
                therapyResponses.push(userResponse);
            }

            // Send therapy responses to server for profile generation
            const finalResponse = await fetch('https://therapy-bot-backend.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ responses: therapyResponses }),
            });

            const finalData = await finalResponse.json();

            if (!finalData.profile) {
                document.getElementById('response').innerText = "Error generating profile.";
                return;
            }

            // Display the final therapy profile
            document.getElementById('response').innerHTML = `
                <h2>Your Personalized Therapy Profile:</h2>
                <p>${finalData.profile}</p>
            `;
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('response').innerText = `Error: ${error.message}`;
    }
});
