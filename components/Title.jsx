const Title = ({ title, subtitle }) => {
  const titleMain = title.split(" ")[0];
  const titlehightlight = title.split(" ")[1];
  return (
    <div className="mx-auto w-max text-white uppercase text-center">
      <h1 className="text-7xl font-extrabold mb-1">
        {titleMain}{" "}
        <span className="text-primary-shade-one">{titlehightlight}</span>
      </h1>
      {subtitle && <p className="bg-primary-shade-one p-1 text-3xl w-max mx-auto">{subtitle}</p>}
    </div>
  );
};
export default Title;
