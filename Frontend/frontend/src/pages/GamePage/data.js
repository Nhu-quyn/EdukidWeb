export const gameQuestions = [
  {
    type: "image_match",
    question: "Chọn hình ảnh của 'Apple'",
    options: [
      "https://th.bing.com/th/id/OIP.QWX0dxUltIViFFkiYmlDjQHaFH?rs=1&pid=ImgDetMain",
      "https://img.lovepik.com/free-png/20211212/lovepik-autumn-fruit-banana-png-image_401518907_wh1200.png",
      "https://png.pngtree.com/png-clipart/20190604/original/pngtree-a-bunch-of-grapes-png-image_1322957.jpg",
    ],
    answer:
      "https://th.bing.com/th/id/OIP.QWX0dxUltIViFFkiYmlDjQHaFH?rs=1&pid=ImgDetMain",
    score: 1,
    level: "easy",
  },
  {
    type: "word_match",
    question: "Chọn từ đúng với hình ảnh sau đây",
    image:
      "https://img.meta.com.vn/Data/image/2021/09/21/anh-meo-cute-hoat-hinh-11.jpg",
    options: ["Cat", "Dog", "Bird"],
    answer: "Cat",
    pairs: [
      {
        word: "Cat",
        image:
          "https://img.meta.com.vn/Data/image/2021/09/21/anh-meo-cute-hoat-hinh-11.jpg",
      },
      {
        word: "Dog",
        image:
          "https://png.pngtree.com/png-clipart/20230411/original/pngtree-vector-cartoon-cute-puppy-dog-png-image_9044050.png",
      },
      {
        word: "Bird",
        image: "https://example.com/bird.jpg", // Thêm một hình ảnh khác
      },
    ],
    score: 1,
    level: "medium",
  },
  {
    type: "audio_record",
    word: "Yellow",
    core: 1,
    level: "medium",
  },
  {
    type: "listen_choose_word",
    options: ["Apple", "Banana", "Grape"],
    answer: "Apple",
    level: "easy",
  },
  {
    type: "listen_choose_image",
    audio: "Cat",
    options: [
      "https://img.meta.com.vn/Data/image/2021/09/21/anh-meo-cute-hoat-hinh-11.jpg",
      "https://png.pngtree.com/png-clipart/20230411/original/pngtree-vector-cartoon-cute-puppy-dog-png-image_9044050.png",
      "https://symbols.vn/wp-content/uploads/2022/02/Hinh-Chuot-Hamster-Chibi-Cute-sieu-de-thuong.jpg",
    ],
    answer:
      "https://img.meta.com.vn/Data/image/2021/09/21/anh-meo-cute-hoat-hinh-11.jpg",
    level: "easy",
  },
  {
    type: "image_select_sound",
    question: "Chọn âm thanh chính xác với hình ảnh",
    image:
      "https://png.pngtree.com/png-clipart/20230414/original/pngtree-red-apple-fruit-realistic-transparent-png-image_9057112.png",
    options: ["Apple", "Banana", "Grape"],
    answer: "Apple",
    level: "medium",
  },
];
