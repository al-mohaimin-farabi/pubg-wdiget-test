const Tableheader = ({ overall = false }) => {
  return (
    <div className="from-primary-shade-two to-primary flex w-[860px] bg-linear-to-b p-2 text-center text-lg font-bold text-black uppercase">
      <div className="w-[60px]! text-start uppercase">ranK</div>
      <div className="w-full uppercase">Team name</div>
      <div className="flex">
        {overall && (
          <>
            <div className="w-[80.67px]">Matches</div>
            <div className="w-[80.67px]">WWCD</div>
          </>
        )}
        <div className="w-[80.67px]">POS PTS</div>
        <div className="w-[80.67px]">Elims</div>
        <div className="w-[80.67px]">Total</div>
      </div>
    </div>
  );
};

export default Tableheader;
