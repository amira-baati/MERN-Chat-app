import React from "react";

const ChatLoading = () => {
  // Styles en ligne
  const stackStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
  };

  const skeletonStyle = {
    height: "45px",
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "loadingAnimation 1.5s infinite",
    borderRadius: "5px",
  };

  // Ajout de l'animation via un style global
  const animationStyle = `
    @keyframes loadingAnimation {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `;

  // Injection des styles globaux pour l'animation
  return (
    <>
      <style>{animationStyle}</style>
      <div style={stackStyle}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} style={skeletonStyle}></div>
        ))}
      </div>
    </>
  );
};

export default ChatLoading;
