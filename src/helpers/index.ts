const pad = (num: number) => (num > 9 ? "" : "0") + num;
const fileDateGenerator = () => {
  const time = new Date();

  const month = time.getFullYear() + "-" + pad(time.getMonth() + 1);
  const day = pad(time.getDate());

  return `${month}-${day}-file.log`;
};

export { fileDateGenerator };
