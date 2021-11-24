const writeToConsole = (content: string | number, level: number = 0) => {
  console.log(" ".repeat(level * 4) + content);
  if (level === 0) console.log("===================");
};

export default writeToConsole;
