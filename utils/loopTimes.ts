const loopTimes = async (
  num: number,
  callback: (currentNumber: number) => Promise<void>
) => {
  while (num) {
    await callback(num);
    num--;
  }
};

export default loopTimes;
