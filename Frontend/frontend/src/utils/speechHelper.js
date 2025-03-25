// src/utils/speechHelper.js
export const speak = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US"; // Set the language for speech synthesis, can be adjusted as needed
  window.speechSynthesis.speak(speech);
};
