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
