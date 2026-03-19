const MVPStats = ({ icon, label, value }) => {
  return (
    <div className="bg-primary flex w-[460px]">
      <div className="grid w-[40%] place-content-center text-7xl text-white">
        {icon}
      </div>
      <div className="w-[60%] text-center">
        <div className="bg-primary-shade-one p-1 text-3xl font-bold text-white uppercase">
          {label}
        </div>
        <div className="bg-primary-shade-two mb-2 p-4 text-5xl font-bold text-black">
          {value}
        </div>
      </div>
    </div>
  );
};

export default MVPStats;
