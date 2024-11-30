import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'; // Add this line

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Replace with your OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    const { responses } = req.body;

    // Log the received responses
    console.log("Received responses:", responses);

    // Create a prompt using the user's responses
    const messages = [
        { role: "system", content: "You are a helpful assistant creating therapy profiles based on user responses." },
        { role: "user", content: "Create a personalized therapy profile using the following responses: " + JSON.stringify(responses) }
    ];

    try {
        // Send request to OpenAI API using gpt-3.5-turbo as it's the available model
        const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',  // Use the available model
                messages: messages
            })
        });

        // Check if the response is successful
        if (!apiResponse.ok) {
            throw new Error(`API request failed with status: ${apiResponse.status}`);
        }

        // Parse the API response
        const data = await apiResponse.json();

        // Log the OpenAI response for debugging
        console.log("OpenAI API response:", data);

        // Ensure the response is in the correct format
        if (!data.choices || !data.choices[0]) {
            throw new Error("Unexpected API response format");
        }

        // Extract the therapy profile from the API response
        const profile = data.choices[0].message.content;

        // Return the therapy profile as JSON
        res.json({ profile });
    } catch (error) {
        // Log the error for debugging
        console.error("Error in /api/chat:", error.message);

        // Return a response indicating failure
        res.status(500).json({ error: 'Failed to generate therapy profile' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
