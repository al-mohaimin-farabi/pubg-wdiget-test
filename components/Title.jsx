const Title = ({ title, subtitle, data, stageOnly }) => {
  // Split once to avoid repeating work
  const words = title.split(" ");
  const titleMain = words[0];

  // Recombine everything after the first word
  const titlehightlight = words.slice(1).join(" ");

  const game_stage = data?.game_stage;
  const game_day = data?.game_day;
  const game_name = data?.game_name;

  return (
    <div className="mx-auto w-max text-center text-white uppercase">
      <h1 className="mb-2 text-7xl font-extrabold">
        {titleMain}{" "}
        <span className="text-primary-shade-one">{titlehightlight}</span>
      </h1>

      {data && (
        <p className="bg-primary-shade-one mx-auto w-max p-1 text-3xl">
          {stageOnly
            ? `${game_stage}`
            : `${game_stage} - ${game_day} - ${game_name}`}
        </p>
      )}
      {subtitle && (
        <p className="bg-primary-shade-one mx-auto w-max p-1 text-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Title;
