import React from "react";

const getColorFromName = (): string => {
  const colors = [
    "#FF5733", // Bright Red-Orange
    "#FF8C00", // Dark Orange
    "#FFB400", // Bright Yellow-Orange
    "#E91E63", // Deep Pink
    "#9C27B0", // Deep Purple
    "#673AB7", // Dark Purple
    "#3F51B5", // Deep Blue
    "#2196F3", // Bright Blue
    "#009688", // Teal
    "#4CAF50"  // Green
  ];
  // genrate random digit from 0 to 5
  const digit = Math.floor(Math.random() * colors.length);
  return colors[digit];
};

const getInitials = (name: string): string => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return initials.length > 2 ? initials.slice(0, 2) : initials;
};

interface DefaultAvatarProps {
  name: string;
}

const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ name }) => {
  const bgColor = getColorFromName();
  const initials = getInitials(name);

  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: bgColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: bgColor === "#FFFFFF" ? "#000" : "#FFF",
        fontWeight: "bold",
        fontSize: "16px",
        textTransform: "uppercase",
      }}
    >
      {initials}
    </div>
  );
};

export default DefaultAvatar;
