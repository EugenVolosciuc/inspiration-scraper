const loopTimes = async (
  num: number,
  callback: (currentNumber: number) => Promise<any>
) => {
  while (num) {
    await callback(num);
    num--;
  }
};

export default loopTimes;
