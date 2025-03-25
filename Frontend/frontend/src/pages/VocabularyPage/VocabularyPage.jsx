import React from "react";
import { Modal, Typography, Button } from "antd";

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

const WordDetailModal = ({ selectedWord, setSelectedWord }) => {
  return (
    <Modal
      visible={!!selectedWord}
      onCancel={() => setSelectedWord(null)}
      footer={null}
      centered
    >
      {selectedWord && (
        <div style={{ textAlign: "center" }}>
          <Typography.Title level={3}>{selectedWord.word}</Typography.Title>
          <Typography.Text italic>{selectedWord.ipa}</Typography.Text>
          <div>{selectedWord.definition}</div>
          <div>
            <strong>Từ loại:</strong> {selectedWord.partOfSpeech}
          </div>
          <div>
            <strong>Cụm từ:</strong> {selectedWord.phrase}
          </div>
          <div>
            <strong>Nghĩa của cụm từ:</strong> {selectedWord.phraseMeaning}
          </div>
          <div>
            <strong>Ví dụ:</strong> {selectedWord.example}
          </div>
          <Button
            type="primary"
            onClick={() => speak(selectedWord.word)}
            style={{ marginTop: "10px" }}
          >
            Phát âm 🔊
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default WordDetailModal;
