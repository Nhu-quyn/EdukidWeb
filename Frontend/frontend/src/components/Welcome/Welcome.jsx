import styled from "styled-components";
import { motion } from "framer-motion";
import img1 from "../../assets/img1.png";
import img2 from "../../assets/img2.png";
import img3 from "../../assets/img3.png";
import img4 from "../../assets/img4.png";
import img5 from "../../assets/img5.png";
import img6 from "../../assets/img6.png";
// const LetterContainer = styled.div`
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 3rem;
  position: relative;
`;

const Character = styled.img`
  position: absolute;
  width: 60px;
  height: 50px;
  // ${(props) => props.customStyle}
`;
const MotionLetter = styled(motion.span)`
  font-size: 10rem;
  font-weight: 900;
  width: 100%;
  color: ${(props) => props.color};
`;
const LetterContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const letters = [
  { char: "W", image: img1, color: "#2563eb", style: "top: -15px; left: 0;" },
  {
    char: "E",
    image: img2,
    color: "#facc15",
    style: "top: -20px; left: 10px; transform: rotate(-15deg);",
  },
  {
    char: "L",
    image: img3,
    color: "#a855f7",
    style: "top: -20px; left: 5px; transform: rotate(10deg);",
  },
  {
    char: "C",
    image: img4,
    color: "#fb923c",
    style: "top: -15px; left: 10px;",
  },
  { char: "O", image: img5, color: "#ef4444", style: "top: -15px; left: 5px;" },
  {
    char: "M",
    image: img6,
    color: "#ec4899",
    style: "top: -10px; left: 15px; transform: rotate(8deg);",
  },
  { char: "E", image: img1, color: "#f59e0b", style: "top: -10px; left: 5px;" },
];

export default function WelcomeTitle() {
  return (
    <Wrapper>
      {letters.map((item, index) => {
        const Icon = item.Icon;
        const offset = index % 2 === 0 ? "-2rem" : "2rem"; // cao thấp xen kẽ

        return (
          <MotionLetter
            key={index}
            style={{
              marginLeft: `${index * 0.5}rem`,
              transform: `translateY(${offset})`,
              color: item.color,
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut",
            }}
          >
            <Icon size={60} weight="fill" />
            {item.char}
          </MotionLetter>
        );
      })}
    </Wrapper>
  );
}
